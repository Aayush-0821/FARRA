import { createHash, randomBytes } from "node:crypto";

import { AppError } from "../../errors/app.errors.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

import { AUTH_DEFAULTS, AUTH_ERRORS } from "./auth.constants.js";
import { AuthRepository } from "./auth.repository.js";

import { emailService } from "../service/email/email.service.js";
import { env } from "../../config/env.js";

import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResendVerificationEmailInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "./auth.validations.js";

import type {
  AuthResponse,
  AuthTokens,
  AuthUser,
  LogoutInput,
  RefreshTokenInput,
  RegisterResponse,
} from "./auth.types.js";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(input: RegisterInput): Promise<RegisterResponse> {
    const existingUser = await this.authRepository.findUserByEmail(input.email);

    if (existingUser) {
      throw new AppError(AUTH_ERRORS.EMAIL_ALREADY_EXISTS, 409);
    }

    const passwordHash = await hashPassword(input.password);

    const merchant = await this.authRepository.createUserWithMerchant({
      merchantName: input.merchantName,

      ...(input.razorpayAccountId !== undefined && {
        razorpayAccountId: input.razorpayAccountId,
      }),

      userName: input.name,
      userEmail: input.email,
      passwordHash,
    });

    const user = merchant.users[0];

    if (!user) {
      throw new AppError("Failed to create user", 500);
    }

    const verificationToken = await this.createEmailVerificationToken(user.id);

    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await emailService.sendVerificationEmail(user.email, verificationUrl);

    return {
      user: this.toAuthUser(user),
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.authRepository.findUserByEmail(input.email);

    if (!user) {
      throw new AppError(AUTH_ERRORS.INVALID_CREDENTIALS, 401);
    }

    if (user.status === "SUSPENDED") {
      throw new AppError(AUTH_ERRORS.USER_SUSPENDED, 403);
    }

    if (user.status === "DEACTIVATED") {
      throw new AppError(AUTH_ERRORS.USER_DEACTIVATED, 403);
    }

    if (!user.emailVerifiedAt) {
      throw new AppError(AUTH_ERRORS.EMAIL_NOT_VERIFIED, 403);
    }

    const passwordValid = await verifyPassword(
      input.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new AppError(AUTH_ERRORS.INVALID_CREDENTIALS, 401);
    }

    const tokens = await this.generateAuthTokens(user);

    return {
      user: this.toAuthUser(user),
      tokens,
    };
  }

  async verifyEmail(input: VerifyEmailInput) {
    const tokenHash = this.hashToken(input.token);

    const verificationToken =
      await this.authRepository.findEmailVerificationToken(tokenHash);

    if (
      !verificationToken ||
      verificationToken.usedAt ||
      verificationToken.expiresAt < new Date()
    ) {
      throw new AppError("Invalid or expired verification token", 400);
    }

    const user = await this.authRepository.findUserById(
      verificationToken.userId,
    );

    if (!user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, 404);
    }

    if (user.emailVerifiedAt) {
      return {
        message: "Email is already verified",
      };
    }

    await this.authRepository.markEmailVerified(user.id);

    await this.authRepository.markEmailVerificationTokenUsed(
      verificationToken.id,
    );

    await this.authRepository.invalidateEmailVerificationTokens(user.id);

    return {
      message: "Email verified successfully",
    };
  }

  async resendVerificationEmail(input: ResendVerificationEmailInput) {
    const user = await this.authRepository.findUserByEmail(input.email);

    if (!user) {
      return {
        message:
          "If an account exists with this email, a verification email has been sent.",
      };
    }

    if (user.emailVerifiedAt) {
      return {
        message: "Email is already verified",
      };
    }

    await this.authRepository.invalidateEmailVerificationTokens(user.id);

    const verificationToken = await this.createEmailVerificationToken(user.id);

    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await emailService.sendVerificationEmail(user.email, verificationUrl);

    return {
      message:
        "If an account exists with this email, a verification email has been sent.",
    };
  }

  async refresh(input: RefreshTokenInput): Promise<AuthTokens> {
    const tokenHash = this.hashToken(input.refreshToken);

    const storedToken = await this.authRepository.findRefreshToken(tokenHash);

    if (!storedToken) {
      throw new AppError(AUTH_ERRORS.INVALID_REFRESH_TOKEN, 401);
    }

    if (storedToken.revokedAt) {
      throw new AppError(AUTH_ERRORS.INVALID_REFRESH_TOKEN, 401);
    }

    if (storedToken.expiresAt < new Date()) {
      throw new AppError(AUTH_ERRORS.REFRESH_TOKEN_EXPIRED, 401);
    }

    let payload;

    try {
      payload = await verifyRefreshToken(input.refreshToken);
    } catch {
      throw new AppError(AUTH_ERRORS.INVALID_REFRESH_TOKEN, 401);
    }

    if (payload.sub !== storedToken.userId) {
      throw new AppError(AUTH_ERRORS.INVALID_REFRESH_TOKEN, 401);
    }

    const user = await this.authRepository.findUserById(storedToken.userId);

    if (!user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, 404);
    }

    if (user.status === "SUSPENDED") {
      throw new AppError(AUTH_ERRORS.USER_SUSPENDED, 403);
    }

    if (user.status === "DEACTIVATED") {
      throw new AppError(AUTH_ERRORS.USER_DEACTIVATED, 403);
    }

    /*
     * Refresh-token rotation:
     *
     * old refresh token -> revoked
     * new refresh token -> stored
     */

    await this.authRepository.revokeRefreshToken(tokenHash);

    return this.generateAuthTokens(user);
  }

  // =========================================
  // LOGOUT
  // =========================================

  async logout(input: LogoutInput) {
    const tokenHash = this.hashToken(input.refreshToken);

    const storedToken = await this.authRepository.findRefreshToken(tokenHash);

    /*
     * Logout should be idempotent.
     *
     * If the token doesn't exist or is already revoked,
     * we still return successful logout.
     */
    if (storedToken && !storedToken.revokedAt) {
      await this.authRepository.revokeRefreshToken(tokenHash);
    }

    return {
      message: "Logged out successfully",
    };
  }

  async forgotPassword(input: ForgotPasswordInput) {
    const user = await this.authRepository.findUserByEmail(input.email);

    if (!user) {
      return {
        message:
          "If an account exists with this email, a password reset link has been sent.",
      };
    }

    await this.authRepository.invalidatePasswordResetTokens(user.id);

    const rawToken = randomBytes(32).toString("hex");

    const tokenHash = this.hashToken(rawToken);

    const expiresAt = new Date(
      Date.now() +
        AUTH_DEFAULTS.PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES * 60 * 1000,
    );

    await this.authRepository.createPasswordResetToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    await emailService.sendPasswordResetEmail(user.email, resetUrl);

    return {
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };
  }

  async resetPassword(input: ResetPasswordInput) {
    const tokenHash = this.hashToken(input.token);

    const resetToken =
      await this.authRepository.findPasswordResetToken(tokenHash);

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new AppError(AUTH_ERRORS.INVALID_RESET_TOKEN, 400);
    }

    const user = await this.authRepository.findUserById(resetToken.userId);

    if (!user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, 404);
    }

    const passwordHash = await hashPassword(input.password);

    await this.authRepository.updatePassword(resetToken.userId, passwordHash);

    await this.authRepository.markPasswordResetTokenUsed(resetToken.id);

    await this.authRepository.invalidatePasswordResetTokens(resetToken.userId);

    /*
     * Password changed means every existing session
     * should be invalidated.
     */
    await this.authRepository.revokeAllRefreshTokens(resetToken.userId);

    return {
      message: "Password reset successfully",
    };
  }

  private async createEmailVerificationToken(userId: string): Promise<string> {
    const rawToken = randomBytes(32).toString("hex");

    const tokenHash = this.hashToken(rawToken);

    const expiresAt = new Date(
      Date.now() +
        AUTH_DEFAULTS.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MINUTES * 60 * 1000,
    );

    await this.authRepository.createEmailVerificationToken({
      userId,
      tokenHash,
      expiresAt,
    });

    return rawToken;
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private async generateAuthTokens(user: {
    id: string;
    merchantId: string;
    email: string;
    name: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
  }): Promise<AuthTokens> {
    const accessToken = await generateAccessToken({
      sub: user.id,
      merchantId: user.merchantId,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const refreshToken = await generateRefreshToken({
      sub: user.id,
      merchantId: user.merchantId,
      role: user.role,
    });

    const tokenHash = this.hashToken(refreshToken);

    const expiresAt = new Date(
      Date.now() +
        AUTH_DEFAULTS.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
    );

    await this.authRepository.createRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // =========================================
  // AUTH USER MAPPING
  // =========================================

  private toAuthUser(user: {
    id: string;
    merchantId: string;
    email: string;
    name: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
  }): AuthUser {
    return {
      id: user.id,
      merchantId: user.merchantId,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
