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

export class SubscriptionFailureDetector
  implements DetectionRule
{
  name = "subscription-failure-detector";

  eventTypes: RevenueEventType[] = [
    RevenueEventType.SUBSCRIPTION_FAILED,
    RevenueEventType.SUBSCRIPTION_CHARGE_FAILED,
  ];

  async detect(
    context: DetectionContext,
  ): Promise<DetectionResult | null> {
    if (
      context.eventType !==
        RevenueEventType.SUBSCRIPTION_FAILED &&
      context.eventType !==
        RevenueEventType.SUBSCRIPTION_CHARGE_FAILED
    ) {
      return null;
    }

    const probability =
      DETECTION_THRESHOLDS.FAILED_SUBSCRIPTION
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

    const signalType =
      context.eventType ===
      RevenueEventType.SUBSCRIPTION_FAILED
        ? "SUBSCRIPTION_FAILED"
        : "SUBSCRIPTION_CHARGE_FAILED";

    return {
      detected: true,

      riskType:
        RevenueRiskType.FAILED_SUBSCRIPTION,

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
          signalType,
          value: "true",
          weight: 1,
          source: "revenue_event",
        },
      ],

      reason:
        "Subscription payment failure detected with revenue exposure.",
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