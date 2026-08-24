import { PrismaClient } from "@prisma/client";

import type {
  CreateRecoveryPolicyInput,
  UpdateMerchantInput,
  UpdateRecoveryPolicyInput,
} from "./merchants.types.js";

export class MerchantRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getMerchantById(merchantId: string) {
    return this.prisma.merchant.findUnique({
      where: {
        id: merchantId,
      },
    });
  }

  async updateMerchant(merchantId: string, input: UpdateMerchantInput) {
    const data: {
      name?: string;
      email?: string | null;
      currency?: string;
    } = {};

    if (input.name !== undefined) {
      data.name = input.name;
    }

    if (input.email !== undefined) {
      data.email = input.email;
    }

    if (input.currency !== undefined) {
      data.currency = input.currency;
    }

    return this.prisma.merchant.update({
      where: {
        id: merchantId,
      },
      data,
    });
  }

  async getRazorpayConnection(merchantId: string) {
    return this.prisma.razorpayConnection.findUnique({
      where: {
        merchantId,
      },
      select: {
        status: true,
        provider: true,
        expiresAt: true,
      },
    });
  }

  async getRecoveryPolicies(merchantId: string) {
    return this.prisma.recoveryPolicy.findMany({
      where: {
        merchantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getActiveRecoveryPolicy(merchantId: string) {
    return this.prisma.recoveryPolicy.findFirst({
      where: {
        merchantId,
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getRecoveryPolicyById(merchantId: string, policyId: string) {
    return this.prisma.recoveryPolicy.findFirst({
      where: {
        id: policyId,
        merchantId,
      },
    });
  }

  async createRecoveryPolicy(
    merchantId: string,
    input: CreateRecoveryPolicyInput,
  ) {
    const data: {
      merchantId: string;
      name: string;
      maxRetries?: number;
      retryWindowHours?: number;
      maxCommunicationAttempts?: number;
      allowAutoRetry?: boolean;
      allowVoiceRecovery?: boolean;
      escalationThreshold?: number;
      active?: boolean;
    } = {
      merchantId,
      name: input.name,
    };

    if (input.maxRetries !== undefined) {
      data.maxRetries = input.maxRetries;
    }

    if (input.retryWindowHours !== undefined) {
      data.retryWindowHours = input.retryWindowHours;
    }

    if (input.maxCommunicationAttempts !== undefined) {
      data.maxCommunicationAttempts = input.maxCommunicationAttempts;
    }

    if (input.allowAutoRetry !== undefined) {
      data.allowAutoRetry = input.allowAutoRetry;
    }

    if (input.allowVoiceRecovery !== undefined) {
      data.allowVoiceRecovery = input.allowVoiceRecovery;
    }

    if (input.escalationThreshold !== undefined) {
      data.escalationThreshold = input.escalationThreshold;
    }

    if (input.active !== undefined) {
      data.active = input.active;
    }

    return this.prisma.recoveryPolicy.create({
      data,
    });
  }

  async updateRecoveryPolicy(
    merchantId: string,
    policyId: string,
    input: UpdateRecoveryPolicyInput,
  ) {
    const data: {
      name?: string;
      maxRetries?: number;
      retryWindowHours?: number;
      maxCommunicationAttempts?: number;
      allowAutoRetry?: boolean;
      allowVoiceRecovery?: boolean;
      escalationThreshold?: number;
      active?: boolean;
    } = {};

    if (input.name !== undefined) {
      data.name = input.name;
    }

    if (input.maxRetries !== undefined) {
      data.maxRetries = input.maxRetries;
    }

    if (input.retryWindowHours !== undefined) {
      data.retryWindowHours = input.retryWindowHours;
    }

    if (input.maxCommunicationAttempts !== undefined) {
      data.maxCommunicationAttempts = input.maxCommunicationAttempts;
    }

    if (input.allowAutoRetry !== undefined) {
      data.allowAutoRetry = input.allowAutoRetry;
    }

    if (input.allowVoiceRecovery !== undefined) {
      data.allowVoiceRecovery = input.allowVoiceRecovery;
    }

    if (input.escalationThreshold !== undefined) {
      data.escalationThreshold = input.escalationThreshold;
    }

    if (input.active !== undefined) {
      data.active = input.active;
    }

    return this.prisma.recoveryPolicy.update({
      where: {
        id: policyId,
        merchantId,
      },
      data,
    });
  }

  async deactivateRecoveryPolicies(merchantId: string) {
    return this.prisma.recoveryPolicy.updateMany({
      where: {
        merchantId,
        active: true,
      },
      data: {
        active: false,
      },
    });
  }
}
