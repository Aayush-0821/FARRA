import {
  RevenueEventType,
  RevenueRiskType,
} from "@prisma/client";

import type {
  DetectionContext,
  DetectionResult,
  DetectionRule,
} from "../detection.types.js";

import {
  DETECTION_THRESHOLDS,
} from "../detection.constants.js";

export class CheckoutAbandonmentDetector
  implements DetectionRule
{
  name = "checkout-abandonment-detector";

  eventTypes: RevenueEventType[] = [
    RevenueEventType.CHECKOUT_ABANDONED,
  ];

  async detect(
    context: DetectionContext,
  ): Promise<DetectionResult | null> {
    if (
      context.eventType !==
      RevenueEventType.CHECKOUT_ABANDONED
    ) {
      return null;
    }

    const probability =
      DETECTION_THRESHOLDS.CHECKOUT_ABANDONMENT
        .DEFAULT_PROBABILITY;

    const amount = this.getAmount(
      context.payload,
    );

    const customerId =
      this.getString(
        context.payload,
        "customerId",
      );

    const sourceId =
      context.sourceId;

    const expectedLoss =
      amount * probability;

    return {
      detected: true,

      riskType:
        RevenueRiskType.CHECKOUT_ABANDONMENT,

      riskScore:
        this.calculateRiskScore(
          probability,
        ),

      probability,

      amountAtRisk: amount,

      expectedLoss,

      ...(customerId !== undefined && {
        customerId,
      }),

      ...(sourceId !== undefined && {
        sourceId,
      }),

      signals: [
        {
          signalType: "CHECKOUT_ABANDONED",
          value: "true",
          weight: 1,
          source: "revenue_event",
        },
      ],

      reason:
        "Checkout abandonment detected with potential revenue exposure.",
    };
  }

  private getAmount(
    payload: Record<string, unknown>,
  ): number {
    const amount = payload.amount;

    if (typeof amount === "number") {
      return amount;
    }

    if (typeof amount === "string") {
      const parsed = Number(amount);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return 0;
  }

  private getString(
    payload: Record<string, unknown>,
    key: string,
  ): string | undefined {
    const value = payload[key];

    return typeof value === "string"
      ? value
      : undefined;
  }

  private calculateRiskScore(
    probability: number,
  ): number {
    return Math.round(
      probability * 100,
    );
  }
}