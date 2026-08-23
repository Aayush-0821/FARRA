import type { z } from "zod";

import {
  AIRequestSchema,
  AIResponseSchema,
  CreateAIAnalysisSchema,
  RecoveryRecommendationSchema,
  RiskAnalysisRequestSchema,
} from "./ai.schemas";

import type {
  AIAnalysisStatus,
  AIModelProvider,
  AIRecommendationConfidence,
  AITaskType,
} from "./ai.constants";

export type CreateAIAnalysisInput = z.infer<
  typeof CreateAIAnalysisSchema
>;

export type AIRequest = z.infer<typeof AIRequestSchema>;

export type RiskAnalysisRequest = z.infer<
  typeof RiskAnalysisRequestSchema
>;

export type RecoveryRecommendation = z.infer<
  typeof RecoveryRecommendationSchema
>;

export type AIResponse = z.infer<typeof AIResponseSchema>;

export interface AIAnalysis {
  id: string;

  revenueRiskId: string;

  model: string;

  promptVersion?: string;

  input?: Record<string, unknown>;

  analysis: Record<string, unknown>;

  confidence?: number;

  createdAt: Date;
}

export interface AIModelConfig {
  provider: AIModelProvider;

  model: string;

  temperature?: number;

  maxTokens?: number;

  timeoutMs?: number;
}

export interface AIExecutionContext {
  merchantId: string;

  revenueRiskId?: string;

  recoveryCaseId?: string;

  correlationId?: string;

  causationId?: string;
}

export interface RiskAnalysisResult {
  revenueRiskId: string;

  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  probability: number;

  expectedLoss: number;

  primaryFactors: Array<{
    signal: string;
    impact: number;
    explanation: string;
  }>;

  reasoning: string;

  confidence: number;
}

export interface AIRecoveryDecision {
  strategy: string;

  reason: string;

  confidence: number;

  confidenceLevel: AIRecommendationConfidence;

  priority: number;

  expectedRecoveryProbability: number;

  estimatedRecoveryAmount?: number;

  alternatives?: Array<{
    strategy: string;
    reason: string;
    confidence: number;
  }>;
}

export interface AIServiceResult<T = Record<string, unknown>> {
  taskType: AITaskType;

  status: AIAnalysisStatus;

  model: string;

  result?: T;

  confidence?: number;

  tokensUsed?: number;

  latencyMs?: number;

  error?: string;
}

export interface AIProvider {
  readonly provider: AIModelProvider;

  analyze<T>(
    request: AIRequest,
    context: AIExecutionContext,
  ): Promise<AIServiceResult<T>>;
}