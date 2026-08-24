import { AppError } from "../../errors/app.errors.js";

import { MerchantRepository } from "./merchants.repository.js";

import type {
  CreateRecoveryPolicyInput,
  UpdateMerchantInput,
  UpdateRecoveryPolicyInput,
} from "./merchants.types.js";

export class MerchantService {
  constructor(
    private readonly merchantRepository: MerchantRepository,
  ) {}

  async getMerchant(merchantId: string) {
    const merchant =
      await this.merchantRepository.getMerchantById(
        merchantId,
      );

    if (!merchant) {
      throw new AppError(
        "Merchant not found",
        404,
        "MERCHANT_NOT_FOUND",
      );
    }

    return merchant;
  }

  async updateMerchant(
    merchantId: string,
    input: UpdateMerchantInput,
  ) {
    await this.getMerchant(merchantId);

    return this.merchantRepository.updateMerchant(
      merchantId,
      input,
    );
  }

  async getRazorpayConnection(merchantId: string) {
    await this.getMerchant(merchantId);

    const connection =
      await this.merchantRepository.getRazorpayConnection(
        merchantId,
      );

    if (!connection) {
      throw new AppError(
        "Razorpay connection not found",
        404,
        "RAZORPAY_CONNECTION_NOT_FOUND",
      );
    }

    return connection;
  }

  async getRecoveryPolicies(merchantId: string) {
    await this.getMerchant(merchantId);

    return this.merchantRepository.getRecoveryPolicies(
      merchantId,
    );
  }

  async getActiveRecoveryPolicy(merchantId: string) {
    await this.getMerchant(merchantId);

    const policy =
      await this.merchantRepository.getActiveRecoveryPolicy(
        merchantId,
      );

    if (!policy) {
      throw new AppError(
        "No active recovery policy found",
        404,
        "ACTIVE_RECOVERY_POLICY_NOT_FOUND",
      );
    }

    return policy;
  }

  async getRecoveryPolicy(
    merchantId: string,
    policyId: string,
  ) {
    await this.getMerchant(merchantId);

    const policy =
      await this.merchantRepository.getRecoveryPolicyById(
        merchantId,
        policyId,
      );

    if (!policy) {
      throw new AppError(
        "Recovery policy not found",
        404,
        "RECOVERY_POLICY_NOT_FOUND",
      );
    }

    return policy;
  }

  async createRecoveryPolicy(
    merchantId: string,
    input: CreateRecoveryPolicyInput,
  ) {
    await this.getMerchant(merchantId);

    if (input.active) {
      await this.merchantRepository.deactivateRecoveryPolicies(
        merchantId,
      );
    }

    return this.merchantRepository.createRecoveryPolicy(
      merchantId,
      input,
    );
  }

  async updateRecoveryPolicy(
    merchantId: string,
    policyId: string,
    input: UpdateRecoveryPolicyInput,
  ) {
    await this.getMerchant(merchantId);

    const existingPolicy =
      await this.merchantRepository.getRecoveryPolicyById(
        merchantId,
        policyId,
      );

    if (!existingPolicy) {
      throw new AppError(
        "Recovery policy not found",
        404,
        "RECOVERY_POLICY_NOT_FOUND",
      );
    }

    if (
      input.active === true &&
      existingPolicy.active === false
    ) {
      await this.merchantRepository.deactivateRecoveryPolicies(
        merchantId,
      );
    }

    return this.merchantRepository.updateRecoveryPolicy(
      merchantId,
      policyId,
      input,
    );
  }

  async activateRecoveryPolicy(
    merchantId: string,
    policyId: string,
  ) {
    await this.getMerchant(merchantId);

    const policy =
      await this.merchantRepository.getRecoveryPolicyById(
        merchantId,
        policyId,
      );

    if (!policy) {
      throw new AppError(
        "Recovery policy not found",
        404,
        "RECOVERY_POLICY_NOT_FOUND",
      );
    }

    if (policy.active) {
      return policy;
    }

    await this.merchantRepository.deactivateRecoveryPolicies(
      merchantId,
    );

    return this.merchantRepository.updateRecoveryPolicy(
      merchantId,
      policyId,
      {
        active: true,
      },
    );
  }

  async deactivateRecoveryPolicy(
    merchantId: string,
    policyId: string,
  ) {
    await this.getMerchant(merchantId);

    const policy =
      await this.merchantRepository.getRecoveryPolicyById(
        merchantId,
        policyId,
      );

    if (!policy) {
      throw new AppError(
        "Recovery policy not found",
        404,
        "RECOVERY_POLICY_NOT_FOUND",
      );
    }

    if (!policy.active) {
      return policy;
    }

    return this.merchantRepository.updateRecoveryPolicy(
      merchantId,
      policyId,
      {
        active: false,
      },
    );
  }
}