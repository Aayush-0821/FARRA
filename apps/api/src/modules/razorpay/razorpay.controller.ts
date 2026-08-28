import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../../errors/app.errors.js";

import {
  oauthCallbackSchema,
  updateRazorpayConnectionSchema,
} from "./razorpay.validation.js";

import { RAZORPAY_ERRORS } from "./razorpay.constants.js";

import { RazorpayService } from "./razorpay.service.js";

export class RazorpayController {
  constructor(
    private readonly razorpayService: RazorpayService,
  ) {}

  async getConnection(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const merchantId =
        req.user?.merchantId;

      if (!merchantId) {
        throw new AppError(
          "Merchant ID is required",
          401,
        );
      }

      const result =
        await this.razorpayService.getConnection(
          merchantId,
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Start Razorpay OAuth flow.
   */
  async connect(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const merchantId =
        req.user?.merchantId;

      if (!merchantId) {
        throw new AppError(
          "Merchant ID is required",
          401,
        );
      }

      const authorizationUrl =
        await this.razorpayService.startOAuth(
          merchantId,
        );

      res.redirect(authorizationUrl);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Razorpay OAuth callback.
   */
  async oauthCallback(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input =
        oauthCallbackSchema.parse(req.query);

      if (input.error) {
        throw new AppError(
          input.error_description ??
            RAZORPAY_ERRORS.OAUTH_ACCESS_DENIED,
          400,
        );
      }

      await this.razorpayService.handleOAuthCallback(
        input.code,
        input.state,
      );

      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?razorpay=connected`,
      );
    } catch (error) {
      next(error);
    }
  }

  async updateConnection(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const merchantId =
        req.user?.merchantId;

      if (!merchantId) {
        throw new AppError(
          "Merchant ID is required",
          401,
        );
      }

      const input =
        updateRazorpayConnectionSchema.parse(
          req.body,
        );

      const result =
        await this.razorpayService.updateConnection(
          merchantId,
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

  async disconnect(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const merchantId =
        req.user?.merchantId;

      if (!merchantId) {
        throw new AppError(
          "Merchant ID is required",
          401,
        );
      }

      const result =
        await this.razorpayService.disconnect(
          merchantId,
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}