import {
  RevenueEventType,
  RevenueRiskType,
  RevenueRiskStatus,
} from "@prisma/client";

export interface DetectionContext {
  merchantId: string;
  revenueEventId: string;
  eventType: RevenueEventType;
  sourceType: string;
  sourceId?: string;
  payload: Record<string, unknown>;
  occurredAt: Date;
}

export interface DetectionResult {
  detected: boolean;

  riskType?: RevenueRiskType;

  riskScore?: number;
  probability?: number;

  amountAtRisk?: number;
  expectedLoss?: number;

  customerId?: string;
  sourceId?: string;

  signals: DetectedSignal[];

  reason?: string;
}

export interface DetectedSignal {
  signalType: string;
  value?: string;
  weight?: number;
  source?: string;
}

export interface DetectionRule {
  name: string;

  eventTypes: RevenueEventType[];

  detect(
    context: DetectionContext
  ): Promise<DetectionResult | null>;
}