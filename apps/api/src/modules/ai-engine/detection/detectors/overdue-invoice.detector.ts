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

export class OverdueInvoiceDetector
  implements DetectionRule
{
  name = "overdue-invoice-detector";

  eventTypes: RevenueEventType[] = [
    RevenueEventType.INVOICE_OVERDUE,
  ];

  async detect(
    context: DetectionContext,
  ): Promise<DetectionResult | null> {
    if (
      context.eventType !==
      RevenueEventType.INVOICE_OVERDUE
    ) {
      return null;
    }

    const probability =
      DETECTION_THRESHOLDS.OVERDUE_INVOICE
        .DEFAULT_PROBABILITY;

    /*
     * For an overdue invoice, the amount actually
     * outstanding is more important than the original
     * invoice amount.
     */
    const amountAtRisk =
      this.getAmount(
        context.payload,
        "dueAmount",
      ) ??
      this.getAmount(
        context.payload,
        "amount",
      ) ??
      0;

    const customerId =
      this.getString(
        context.payload,
        "customerId",
      );

    const sourceId =
      context.sourceId;

    const expectedLoss =
      amountAtRisk * probability;

    return {
      detected: true,

      riskType:
        RevenueRiskType.OVERDUE_INVOICE,

      riskScore:
        this.calculateRiskScore(
          probability,
        ),

      probability,

      amountAtRisk,

      expectedLoss,

      ...(customerId !== undefined && {
        customerId,
      }),

      ...(sourceId !== undefined && {
        sourceId,
      }),

      signals: [
        {
          signalType: "INVOICE_OVERDUE",
          value: "true",
          weight: 1,
          source: "revenue_event",
        },
      ],

      reason:
        "Invoice is overdue with outstanding revenue at risk.",
    };
  }

  private getAmount(
    payload: Record<string, unknown>,
    key: string,
  ): number | undefined {
    const value = payload[key];

    if (typeof value === "number") {
      return Number.isFinite(value)
        ? value
        : undefined;
    }

    if (typeof value === "string") {
      const parsed = Number(value);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return undefined;
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