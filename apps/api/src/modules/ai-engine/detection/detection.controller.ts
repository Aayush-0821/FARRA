import type { Request, Response } from "express";
import { DetectionService } from "./detection.service.js";

export class DetectionController {
  constructor(
    private readonly detectionService: DetectionService,
  ) {}

  async processPendingEvents(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const merchantId = req.user?.merchantId;

      if (!merchantId) {
        res.status(401).json({
          success: false,
          message: "Merchant authentication required",
        });
        return;
      }

      const results =
        await this.detectionService.processPendingEvents(
          merchantId,
        );

      res.status(200).json({
        success: true,
        data: {
          processed: results.length,
          results,
        },
      });
    } catch (error) {
      console.error(
        "Detection processing failed:",
        error,
      );

      res.status(500).json({
        success: false,
        message: "Failed to process revenue events",
      });
    }
  }

  async processEvent(
    req: Request<{ revenueEventId: string }>,
    res: Response,
  ): Promise<void> {
    try {
      const merchantId = req.user?.merchantId;
      const { revenueEventId } = req.params;

      if (!merchantId) {
        res.status(401).json({
          success: false,
          message: "Merchant authentication required",
        });
        return;
      }

      if (!revenueEventId) {
        res.status(400).json({
          success: false,
          message: "Revenue event ID is required",
        });
        return;
      }

      const result =
        await this.detectionService.processEvent(
          merchantId,
          revenueEventId,
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(
        "Revenue event detection failed:",
        error,
      );

      if (
        error instanceof Error &&
        error.message === "Revenue event not found"
      ) {
        res.status(404).json({
          success: false,
          message: "Revenue event not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === "Payment not found"
      ) {
        res.status(404).json({
          success: false,
          message: "Payment not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === "Subscription not found"
      ) {
        res.status(404).json({
          success: false,
          message: "Subscription not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === "Invoice not found"
      ) {
        res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Failed to process revenue event",
      });
    }
  }
}