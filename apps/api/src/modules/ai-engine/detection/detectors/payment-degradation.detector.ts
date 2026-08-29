import {
  RevenueEventType,
  RevenueRiskType,
} from "@prisma/client";

import type {
  DetectionContext,
  DetectionResult,
  DetectionRule,
  DetectedSignal,
} from "../detection.types.js";

import {
  DETECTION_THRESHOLDS,
} from "../detection.constants.js";

export class PaymentDegradationDetector
  implements DetectionRule
{
  name = "payment-degradation-detector";

  eventTypes: RevenueEventType[] = [
    RevenueEventType.PAYMENT_DEGRADED,
  ];

  async detect(
    context: DetectionContext,
  ): Promise<DetectionResult | null> {
    if (
      context.eventType !==
      RevenueEventType.PAYMENT_DEGRADED
    ) {
      return null;
    }

    const payload = context.payload;

    const failureRate =
      this.getNumber(
        payload,
        "failureRate",
      );

    const latencyMs =
      this.getNumber(
        payload,
        "latencyMs",
      );

    const sampleSize =
      this.getNumber(
        payload,
        "sampleSize",
      );

    const threshold =
      DETECTION_THRESHOLDS.PAYMENT_DEGRADATION;

    /*
     * We need enough observations before
     * declaring a payment system degradation.
     */
    if (
      sampleSize !== undefined &&
      sampleSize < threshold.MIN_SAMPLE_SIZE
    ) {
      return {
        detected: false,

        signals: [
          {
            signalType: "INSUFFICIENT_SAMPLE_SIZE",
            value: sampleSize.toString(),
            source: "revenue_event",
          },
        ],

        reason:
          "Payment degradation cannot be confirmed because the sample size is below the minimum threshold.",
      };
    }

    const signals: DetectedSignal[] = [];

    let degradationDetected = false;

    /*
     * Failure-rate degradation.
     */
    if (
      failureRate !== undefined &&
      failureRate >= threshold.FAILURE_RATE
    ) {
      degradationDetected = true;

      signals.push({
        signalType: "HIGH_PAYMENT_FAILURE_RATE",
        value: failureRate.toString(),
        weight: 1,
        source: "revenue_event",
      });
    }

    /*
     * Latency degradation.
     */
    if (
      latencyMs !== undefined &&
      latencyMs >= threshold.LATENCY_MS
    ) {
      degradationDetected = true;

      signals.push({
        signalType: "HIGH_PAYMENT_LATENCY",
        value: latencyMs.toString(),
        weight: 1,
        source: "revenue_event",
      });
    }

    /*
     * No degradation signal was found.
     */
    if (!degradationDetected) {
      return {
        detected: false,
        signals,
        reason:
          "Payment failure rate and latency are below degradation thresholds.",
      };
    }

    const probability =
      this.calculateProbability(
        failureRate,
        latencyMs,
        threshold.FAILURE_RATE,
        threshold.LATENCY_MS,
      );

    const riskScore =
      Math.round(probability * 100);

    const amountAtRisk =
      this.getAmount(
        payload,
        "amount",
      );

    const expectedLoss =
      amountAtRisk * probability;

    const customerId =
      this.getString(
        payload,
        "customerId",
      );

    const sourceId =
      context.sourceId;

    return {
      detected: true,

      riskType:
        RevenueRiskType.PAYMENT_DEGRADATION,

      riskScore,

      probability,

      amountAtRisk,

      expectedLoss,

      ...(customerId !== undefined && {
        customerId,
      }),

      ...(sourceId !== undefined && {
        sourceId,
      }),

      signals,

      reason:
        "Payment degradation detected based on elevated failure rate or latency.",
    };
  }

  private getNumber(
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

      return Number.isFinite(parsed)
        ? parsed
        : undefined;
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

  private getAmount(
    payload: Record<string, unknown>,
    key: string,
  ): number {
    const amount = this.getNumber(
      payload,
      key,
    );

    return amount ?? 0;
  }

  private calculateProbability(
    failureRate: number | undefined,
    latencyMs: number | undefined,
    failureRateThreshold: number,
    latencyThreshold: number,
  ): number {
    let probability = 0;

    if (failureRate !== undefined) {
      const failureSeverity =
        failureRate /
        failureRateThreshold;

      probability +=
        Math.min(failureSeverity, 2) * 0.25;
    }

    if (latencyMs !== undefined) {
      const latencySeverity =
        latencyMs /
        latencyThreshold;

      probability +=
        Math.min(latencySeverity, 2) * 0.25;
    }

    return Math.min(
      Number(probability.toFixed(4)),
      1,
    );
  }
}