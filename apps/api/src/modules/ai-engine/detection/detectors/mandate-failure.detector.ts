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

export class MandateFailureDetector
  implements DetectionRule
{
  name = "mandate-failure-detector";

  eventTypes: RevenueEventType[] = [
    RevenueEventType.MANDATE_FAILED,
  ];

  async detect(
    context: DetectionContext,
  ): Promise<DetectionResult | null> {
    if (
      context.eventType !==
      RevenueEventType.MANDATE_FAILED
    ) {
      return null;
    }

    const probability =
      DETECTION_THRESHOLDS.MANDATE_FAILURE
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
        RevenueRiskType.MANDATE_FAILURE,

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
          signalType: "MANDATE_FAILED",
          value: "true",
          weight: 1,
          source: "revenue_event",
        },
      ],

      reason:
        "Mandate failure detected with potential recurring revenue exposure.",
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