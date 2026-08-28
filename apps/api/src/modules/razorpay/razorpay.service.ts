import crypto from "node:crypto";

import { AppError } from "../../errors/app.errors.js";

import {
  RAZORPAY_DEFAULTS,
  RAZORPAY_ERRORS,
  RAZORPAY_OAUTH,
} from "./razorpay.constants.js";

import { RazorpayRepository } from "./razorpay.repository.js";

import type {
  RazorpayOAuthTokenResponse,
  UpdateRazorpayConnectionInput,
} from "./razorpay.types.js";

import { redis } from "../../lib/redis.js";

export class RazorpayService {
  constructor(private readonly razorpayRepository: RazorpayRepository) {}

  async getConnection(merchantId: string) {
    const connection =
      await this.razorpayRepository.findByMerchantId(merchantId);

    if (!connection) {
      throw new AppError(RAZORPAY_ERRORS.CONNECTION_NOT_FOUND, 404);
    }

    return this.toSafeConnection(connection);
  }

  /**
   * Start Razorpay OAuth flow.
   */
  async startOAuth(merchantId: string) {
    const existingConnection =
      await this.razorpayRepository.findByMerchantId(merchantId);

    if (existingConnection) {
      throw new AppError(RAZORPAY_ERRORS.CONNECTION_ALREADY_EXISTS, 409);
    }

    const state = crypto.randomBytes(32).toString("hex");

    const stateKey = `razorpay:oauth:state:${state}`;

    // IMPORTANT:
    // Use the Redis API supported by your redis package.
    await redis.set(
      stateKey,
      merchantId,
      "EX",
      RAZORPAY_DEFAULTS.OAUTH_STATE_TTL_SECONDS,
    );

    return this.generateOAuthUrl(state);
  }

  /**
   * Generate Razorpay OAuth authorization URL.
   */
  private generateOAuthUrl(state: string) {
    const clientId = process.env.RAZORPAY_OAUTH_CLIENT_ID;

    const redirectUri = process.env.RAZORPAY_OAUTH_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      throw new AppError(RAZORPAY_ERRORS.OAUTH_CONFIG_MISSING, 500);
    }

    const params = new URLSearchParams({
      response_type: RAZORPAY_OAUTH.RESPONSE_TYPE,

      client_id: clientId,

      redirect_uri: redirectUri,

      scope: process.env.RAZORPAY_OAUTH_SCOPE ?? RAZORPAY_DEFAULTS.OAUTH_SCOPE,

      state,

      mode: process.env.RAZORPAY_OAUTH_MODE ?? RAZORPAY_DEFAULTS.OAUTH_MODE,
    });

    return `${RAZORPAY_OAUTH.AUTHORIZE_URL}?` + params.toString();
  }

  /**
   * Handle Razorpay OAuth callback.
   */
  async handleOAuthCallback(code: string, state: string) {
    const stateKey = `razorpay:oauth:state:${state}`;

    const merchantId = await redis.get(stateKey);

    if (!merchantId) {
      throw new AppError(RAZORPAY_ERRORS.OAUTH_STATE_INVALID, 400);
    }

    // State is single-use.
    await redis.del(stateKey);

    const tokens = await this.exchangeOAuthCode(code);

    return this.createConnectionFromOAuth(merchantId, tokens);
  }

  /**
   * Exchange authorization code for tokens.
   */
  private async exchangeOAuthCode(
    code: string,
  ): Promise<RazorpayOAuthTokenResponse> {
    const clientId = process.env.RAZORPAY_OAUTH_CLIENT_ID;

    const clientSecret = process.env.RAZORPAY_OAUTH_CLIENT_SECRET;

    const redirectUri = process.env.RAZORPAY_OAUTH_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new AppError(RAZORPAY_ERRORS.OAUTH_CONFIG_MISSING, 500);
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64",
    );

    const response = await fetch(RAZORPAY_OAUTH.TOKEN_URL, {
      method: "POST",

      headers: {
        Authorization: `Basic ${credentials}`,

        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        grant_type: RAZORPAY_OAUTH.GRANT_TYPE_AUTHORIZATION_CODE,

        code,

        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new AppError(RAZORPAY_ERRORS.OAUTH_TOKEN_EXCHANGE_FAILED, 502);
    }

    const tokens = (await response.json()) as RazorpayOAuthTokenResponse;

    if (!tokens.access_token) {
      throw new AppError(RAZORPAY_ERRORS.OAUTH_TOKEN_EXCHANGE_FAILED, 502);
    }

    return tokens;
  }

  /**
   * Create connection after successful OAuth.
   */
  private async createConnectionFromOAuth(
    merchantId: string,
    tokens: RazorpayOAuthTokenResponse,
  ) {
    const existingConnection =
      await this.razorpayRepository.findByMerchantId(merchantId);

    if (existingConnection) {
      throw new AppError(RAZORPAY_ERRORS.CONNECTION_ALREADY_EXISTS, 409);
    }

    const connection = await this.razorpayRepository.createFromOAuth(
      merchantId,
      tokens,
    );

    return this.toSafeConnection(connection);
  }

  async updateConnection(
    merchantId: string,
    input: UpdateRazorpayConnectionInput,
  ) {
    const existingConnection =
      await this.razorpayRepository.findByMerchantId(merchantId);

    if (!existingConnection) {
      throw new AppError(RAZORPAY_ERRORS.CONNECTION_NOT_FOUND, 404);
    }

    const connection = await this.razorpayRepository.update(
      existingConnection.id,
      input,
    );

    return this.toSafeConnection(connection);
  }

  async disconnect(merchantId: string) {
    const existingConnection =
      await this.razorpayRepository.findByMerchantId(merchantId);

    if (!existingConnection) {
      throw new AppError(RAZORPAY_ERRORS.CONNECTION_NOT_FOUND, 404);
    }

    await this.razorpayRepository.delete(existingConnection.id);

    return {
      message: "Razorpay account disconnected successfully",
    };
  }

  private toSafeConnection(connection: {
    id: string;
    merchantId: string;
    accessToken: string;
    refreshToken: string | null;
    expiresAt: Date | null;
    scope: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: connection.id,
      merchantId: connection.merchantId,
      status: connection.status,
      expiresAt: connection.expiresAt,
      scope: connection.scope,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    };
  }
}
