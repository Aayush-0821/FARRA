import type {
  ConnectionStatus,
  MerchantStatus,
} from "@prisma/client";

export interface MerchantProfile {
  id: string;
  razorpayAccountId: string;
  name: string;
  email: string | null;
  currency: string;
  status: MerchantStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateMerchantInput {
  name?: string | undefined;
  email?: string | null | undefined;
  currency?: string | undefined;
}

export interface MerchantConnectionStatus {
  status: ConnectionStatus;
  provider: string;
  expiresAt: Date | null;
}

export interface MerchantRecoverySettings {
  maxRetries: number;
  retryWindowHours: number;
  maxCommunicationAttempts: number;
  allowAutoRetry: boolean;
  allowVoiceRecovery: boolean;
  escalationThreshold: number;
  active: boolean;
}

export interface CreateRecoveryPolicyInput {
  name: string;
  maxRetries?: number | undefined;
  retryWindowHours?: number | undefined;
  maxCommunicationAttempts?: number | undefined;
  allowAutoRetry?: boolean | undefined;
  allowVoiceRecovery?: boolean | undefined;
  escalationThreshold?: number | undefined;
  active?: boolean | undefined;
}

export interface UpdateRecoveryPolicyInput {
  name?: string | undefined;
  maxRetries?: number | undefined;
  retryWindowHours?: number | undefined;
  maxCommunicationAttempts?: number | undefined;
  allowAutoRetry?: boolean | undefined;
  allowVoiceRecovery?: boolean | undefined;
  escalationThreshold?: number | undefined;
  active?: boolean | undefined;
}