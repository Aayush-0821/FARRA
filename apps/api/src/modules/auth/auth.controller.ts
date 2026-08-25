import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../../errors/app.errors.js";
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from "../../utils/cookie.js";

import { AUTH_COOKIE } from "./auth.constants.js";
import { AuthService } from "./auth.service.js";

import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validations.js";

export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input = registerSchema.parse(req.body);

      const result =
        await this.authService.register(input);

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input = loginSchema.parse(req.body);

      const result =
        await this.authService.login(input);

      setRefreshTokenCookie(
        res,
        result.tokens.refreshToken,
      );

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input =
        verifyEmailSchema.parse(req.body);

      const result =
        await this.authService.verifyEmail(input);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async resendVerificationEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input =
        resendVerificationEmailSchema.parse(req.body);

      const result =
        await this.authService.resendVerificationEmail(
          input,
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken =
        req.cookies?.[
          AUTH_COOKIE.REFRESH_TOKEN_NAME
        ] as string | undefined;

      if (!refreshToken) {
        throw new AppError(
          "Refresh token is required",
          401,
        );
      }

      const result =
        await this.authService.refresh({
          refreshToken,
        });
      setRefreshTokenCookie(
        res,
        result.refreshToken,
      );

      res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken =
        req.cookies?.[
          AUTH_COOKIE.REFRESH_TOKEN_NAME
        ] as string | undefined;

      if (refreshToken) {
        await this.authService.logout({
          refreshToken,
        });
      }

      clearRefreshTokenCookie(res);

      res.status(200).json({
        success: true,
        data: {
          message: "Logged out successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input =
        forgotPasswordSchema.parse(req.body);

      const result =
        await this.authService.forgotPassword(input);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input =
        resetPasswordSchema.parse(req.body);

      const result =
        await this.authService.resetPassword(input);
      clearRefreshTokenCookie(res);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}