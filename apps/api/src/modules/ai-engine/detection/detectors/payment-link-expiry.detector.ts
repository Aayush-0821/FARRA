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

export class PaymentLinkExpiryDetector
  implements DetectionRule
{
  name = "payment-link-expiry-detector";

  eventTypes: RevenueEventType[] = [
    RevenueEventType.PAYMENT_LINK_EXPIRED,
  ];

  async detect(
    context: DetectionContext,
  ): Promise<DetectionResult | null> {
    if (
      context.eventType !==
      RevenueEventType.PAYMENT_LINK_EXPIRED
    ) {
      return null;
    }

    const probability =
      DETECTION_THRESHOLDS.PAYMENT_LINK_EXPIRY
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
        RevenueRiskType.PAYMENT_LINK_EXPIRY,

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
          signalType: "PAYMENT_LINK_EXPIRED",
          value: "true",
          weight: 1,
          source: "revenue_event",
        },
      ],

      reason:
        "Payment link expired before the associated payment was completed.",
    };
  }

  private getAmount(
    payload: Record<string, unknown>,
  ): number {
    const amount = payload.amount;

    if (typeof amount === "number") {
      return Number.isFinite(amount)
        ? amount
        : 0;
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