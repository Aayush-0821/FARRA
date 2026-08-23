import type { z } from "zod";

import {
  CompleteVoiceCallSchema,
  CreatePromiseToPaySchema,
  CreateVoiceRecoverySchema,
  StartVoiceCallSchema,
  UpdatePromiseToPaySchema,
  UpdateVoiceRecoverySchema,
  VoiceProviderResponseSchema,
  VoiceRecoveryRequestSchema,
} from "./voice.schemas";

import type {
  PromiseStatus,
  VoiceCallOutcome,
  VoiceLanguage,
  VoiceRecoveryStatus,
} from "./voice.constants";

export type CreateVoiceRecoveryInput = z.infer<
  typeof CreateVoiceRecoverySchema
>;

export type UpdateVoiceRecoveryInput = z.infer<
  typeof UpdateVoiceRecoverySchema
>;

export type StartVoiceCallInput = z.infer<
  typeof StartVoiceCallSchema
>;

export type CompleteVoiceCallInput = z.infer<
  typeof CompleteVoiceCallSchema
>;

export type CreatePromiseToPayInput = z.infer<
  typeof CreatePromiseToPaySchema
>;

export type UpdatePromiseToPayInput = z.infer<
  typeof UpdatePromiseToPaySchema
>;

export type VoiceRecoveryRequest = z.infer<
  typeof VoiceRecoveryRequestSchema
>;

export type VoiceProviderResponse = z.infer<
  typeof VoiceProviderResponseSchema
>;

export interface VoiceRecovery {
  id: string;

  recoveryCaseId: string;

  customerId: string;

  language: VoiceLanguage;

  phone: string;

  status: VoiceRecoveryStatus;

  transcript?: string;

  outcome?: VoiceCallOutcome;

  startedAt?: Date;

  completedAt?: Date;
}

export interface PromiseToPay {
  id: string;

  voiceRecoveryId: string;

  customerId: string;

  amount: number;

  currency: string;

  promisedAt: Date;

  dueAt: Date;

  status: PromiseStatus;

  fulfilledAt?: Date;
}

export interface VoiceExecutionContext {
  merchantId: string;

  recoveryCaseId: string;

  customerId: string;

  correlationId?: string;

  causationId?: string;
}

export interface VoiceCallResult {
  voiceRecoveryId: string;

  callId: string;

  status: VoiceRecoveryStatus;

  outcome?: VoiceCallOutcome;

  transcript?: string;

  startedAt?: Date;

  completedAt?: Date;

  promiseToPay?: {
    amount: number;
    currency: string;
    dueAt: Date;
  };
}

export interface VoiceProvider {
  readonly name: string;

  initiateCall(
    request: VoiceRecoveryRequest,
    context: VoiceExecutionContext,
  ): Promise<VoiceProviderResponse>;

  getCallStatus(
    callId: string,
  ): Promise<VoiceProviderResponse>;

  terminateCall(
    callId: string,
  ): Promise<void>;
}