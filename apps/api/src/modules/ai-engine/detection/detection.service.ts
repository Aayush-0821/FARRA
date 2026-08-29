import { RevenueRiskType } from "@prisma/client";

import { DetectionRepository } from "./detection.repository.js";
import { DetectionEngine } from "./detection.engine.js";

import type {
  DetectionContext,
  DetectionResult as EngineDetectionResult,
} from "./detection.types.js";

type DetectionResponse = {
  eventId: string;
  riskDetected: boolean;
  risk: {
    id: string;
    riskType: string;
    riskScore: string;
    probability: string;
    amountAtRisk: string;
    expectedLoss: string;
  } | null;
};

export class DetectionService {
  constructor(
    private readonly detectionRepository: DetectionRepository,
    private readonly detectionEngine: DetectionEngine,
  ) {}

  /**
   * Process all pending revenue events for a merchant.
   */
  async processPendingEvents(merchantId: string): Promise<DetectionResponse[]> {
    const events =
      await this.detectionRepository.findPendingRevenueEvents(merchantId);

    const results: DetectionResponse[] = [];

    for (const event of events) {
      try {
        const result = await this.processEvent(merchantId, event.id);

        results.push(result);
      } catch (error) {
        await this.detectionRepository.markRevenueEventFailed(
          merchantId,
          event.id,
        );

        throw error;
      }
    }

    return results;
  }

  /**
   * Process a single revenue event.
   */
  async processEvent(
    merchantId: string,
    revenueEventId: string,
  ): Promise<DetectionResponse> {
    /*
     * 1. Fetch the revenue event.
     */
    const event = await this.detectionRepository.findRevenueEventById(
      merchantId,
      revenueEventId,
    );

    if (!event) {
      throw new Error("Revenue event not found");
    }

    /*
     * 2. Only pending events should be processed.
     */
    if (event.status !== "PENDING") {
      return {
        eventId: event.id,
        riskDetected: false,
        risk: null,
      };
    }

    /*
     * 3. Prevent duplicate open/in-recovery
     *    risks for the same revenue event.
     */
    const existingRisk =
      await this.detectionRepository.findExistingRiskForEvent(
        merchantId,
        event.id,
      );

    if (existingRisk) {
      await this.detectionRepository.markRevenueEventProcessed(
        merchantId,
        event.id,
      );

      return {
        eventId: event.id,
        riskDetected: true,
        risk: {
          id: existingRisk.id,
          riskType: existingRisk.riskType,
          riskScore: existingRisk.riskScore,
          probability: existingRisk.probability,
          amountAtRisk: existingRisk.amountAtRisk,
          expectedLoss: existingRisk.expectedLoss,
        },
      };
    }

    /*
     * 4. Build the context required by
     *    the detection engine.
     */
    const context: DetectionContext = {
      merchantId: event.merchantId,
      revenueEventId: event.id,
      eventType: event.eventType,
      sourceType: event.sourceType,

      ...(event.sourceId !== null && {
        sourceId: event.sourceId,
      }),

      payload: this.normalizePayload(event.payload),

      occurredAt: event.occurredAt,
    };

    /*
     * 5. Let the DetectionEngine select and
     *    execute the correct detector.
     */
    const detectionResult = await this.detectionEngine.detect(context);

    /*
     * 6. No detector means this event does not
     *    represent a detectable revenue risk.
     *
     * Example:
     * PAYMENT_CREATED
     * PAYMENT_CAPTURED
     */
    if (!detectionResult || !detectionResult.detected) {
      await this.detectionRepository.markRevenueEventProcessed(
        merchantId,
        event.id,
      );

      return {
        eventId: event.id,
        riskDetected: false,
        risk: null,
      };
    }

    /*
     * 7. Validate the detector result before
     *    attempting persistence.
     */
    const validatedResult = this.validateDetectionResult(detectionResult);

    /*
     * 8. Persist the detected revenue risk.
     */
    const risk = await this.detectionRepository.createRevenueRisk({
      merchantId,

      ...(validatedResult.customerId !== undefined && {
        customerId: validatedResult.customerId,
      }),

      revenueEventId: event.id,

      sourceType: event.sourceType,

      ...(validatedResult.sourceId !== undefined && {
        sourceId: validatedResult.sourceId,
      }),

      riskType: validatedResult.riskType,

      riskScore: validatedResult.riskScore.toString(),

      probability: validatedResult.probability.toString(),

      amountAtRisk: validatedResult.amountAtRisk.toString(),

      expectedLoss: validatedResult.expectedLoss.toString(),

      currency: this.extractCurrency(event.payload),
    });

    /*
     * 9. Mark the revenue event as processed
     *    only after risk persistence succeeds.
     */
    await this.detectionRepository.markRevenueEventProcessed(
      merchantId,
      event.id,
    );

    /*
     * 10. Return a clean service response.
     */
    return {
      eventId: event.id,
      riskDetected: true,
      risk: {
        id: risk.id,
        riskType: risk.riskType,
        riskScore: risk.riskScore,
        probability: risk.probability,
        amountAtRisk: risk.amountAtRisk,
        expectedLoss: risk.expectedLoss,
      },
    };
  }

  /**
   * RevenueEvent.payload comes from Prisma as JsonValue.
   *
   * Detectors expect a Record<string, unknown>,
   * so normalize it at the service boundary.
   */
  private normalizePayload(payload: unknown): Record<string, unknown> {
    if (
      payload !== null &&
      typeof payload === "object" &&
      !Array.isArray(payload)
    ) {
      return payload as Record<string, unknown>;
    }

    return {};
  }

  /**
   * Extract currency from the revenue event payload.
   *
   * Falls back to INR because FAARA currently
   * operates around Razorpay payment data.
   */
  private extractCurrency(payload: unknown): string {
    if (
      payload !== null &&
      typeof payload === "object" &&
      !Array.isArray(payload)
    ) {
      const value = (payload as Record<string, unknown>).currency;

      if (typeof value === "string" && value.length > 0) {
        return value;
      }
    }

    return "INR";
  }

  /**
   * Make sure a detector that claims to have
   * detected a risk has supplied all values
   * required for persistence.
   */
  private validateDetectionResult(
    result: EngineDetectionResult,
  ): EngineDetectionResult & {
    riskType: RevenueRiskType;
    riskScore: number;
    probability: number;
    amountAtRisk: number;
    expectedLoss: number;
  } {
    if (!result.riskType) {
      throw new Error("Detection result is missing riskType");
    }

    if (result.riskScore === undefined) {
      throw new Error("Detection result is missing riskScore");
    }

    if (result.probability === undefined) {
      throw new Error("Detection result is missing probability");
    }

    if (result.amountAtRisk === undefined) {
      throw new Error("Detection result is missing amountAtRisk");
    }

    if (result.expectedLoss === undefined) {
      throw new Error("Detection result is missing expectedLoss");
    }

    if (
      !Number.isFinite(result.riskScore) ||
      result.riskScore < 0 ||
      result.riskScore > 100
    ) {
      throw new Error("Detection result contains an invalid riskScore");
    }

    if (
      !Number.isFinite(result.probability) ||
      result.probability < 0 ||
      result.probability > 1
    ) {
      throw new Error("Detection result contains an invalid probability");
    }

    if (!Number.isFinite(result.amountAtRisk) || result.amountAtRisk < 0) {
      throw new Error("Detection result contains an invalid amountAtRisk");
    }

    if (!Number.isFinite(result.expectedLoss) || result.expectedLoss < 0) {
      throw new Error("Detection result contains an invalid expectedLoss");
    }

    return result as EngineDetectionResult & {
      riskType: RevenueRiskType;
      riskScore: number;
      probability: number;
      amountAtRisk: number;
      expectedLoss: number;
    };
  }
}
