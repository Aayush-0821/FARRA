import { RevenueEventType } from "@prisma/client";

import type {
  DetectionContext,
  DetectionResult,
  DetectionRule,
} from "./detection.types.js";

import { PaymentFailureDetector } from "./detectors/failed-payment.detector.js";
import { SubscriptionFailureDetector } from "./detectors/failed-subscription.detector.js";
import { CheckoutAbandonmentDetector } from "./detectors/checkout-abandonment.detector.js";
import { OverdueInvoiceDetector } from "./detectors/overdue-invoice.detector.js";
import { PaymentDegradationDetector } from "./detectors/payment-degradation.detector.js";
import { MandateFailureDetector } from "./detectors/mandate-failure.detector.js";
import { PaymentLinkExpiryDetector } from "./detectors/payment-link-expiry.detector.js";

export class DetectionEngine {
  private readonly detectors: DetectionRule[];

  private readonly detectorMap: Map<
    RevenueEventType,
    DetectionRule
  >;

  constructor() {
    this.detectors = [
      new PaymentFailureDetector(),
      new SubscriptionFailureDetector(),
      new CheckoutAbandonmentDetector(),
      new OverdueInvoiceDetector(),
      new PaymentDegradationDetector(),
      new MandateFailureDetector(),
      new PaymentLinkExpiryDetector(),
    ];

    this.detectorMap =
      this.buildDetectorMap();
  }

  /**
   * Run the detector responsible for the
   * given revenue event type.
   */
  async detect(
    context: DetectionContext,
  ): Promise<DetectionResult | null> {
    const detector =
      this.detectorMap.get(
        context.eventType,
      );

    /*
     * No detector means this event type is
     * currently not considered a revenue risk.
     *
     * Example:
     * PAYMENT_CREATED
     * PAYMENT_CAPTURED
     */
    if (!detector) {
      return null;
    }

    return detector.detect(context);
  }

  /**
   * Return all registered detectors.
   */
  getDetectors(): DetectionRule[] {
    return [...this.detectors];
  }

  /**
   * Build an event-type -> detector lookup map.
   *
   * This allows O(1) detector selection instead
   * of looping through all detectors for every event.
   */
  private buildDetectorMap(): Map<
    RevenueEventType,
    DetectionRule
  > {
    const map = new Map<
      RevenueEventType,
      DetectionRule
    >();

    for (const detector of this.detectors) {
      for (const eventType of detector.eventTypes) {
        if (map.has(eventType)) {
          throw new Error(
            `Multiple detectors registered for revenue event type: ${eventType}`,
          );
        }

        map.set(
          eventType,
          detector,
        );
      }
    }

    return map;
  }
}