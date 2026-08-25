import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../../errors/app.errors.js";

import { RazorpayService } from "./razorpay.service.js";

import {
  createRazorpayConnectionSchema,
  updateRazorpayConnectionSchema,
} from "./razorpay.validation.js";

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
      const merchantId = req.user?.merchantId;

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

  async createConnection(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const merchantId = req.user?.merchantId;

      if (!merchantId) {
        throw new AppError(
          "Merchant ID is required",
          401,
        );
      }

      const input =
        createRazorpayConnectionSchema.parse({
          ...req.body,
          merchantId,
        });

      const result =
        await this.razorpayService.createConnection(
          input,
        );

      res.status(201).json({
        success: true,
        data: result,
      });
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
      const merchantId = req.user?.merchantId;

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
      const merchantId = req.user?.merchantId;

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