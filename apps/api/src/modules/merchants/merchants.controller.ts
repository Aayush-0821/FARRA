import type { Request, Response } from "express";

import { MerchantService } from "./merchants.service.js";
import {
  createRecoveryPolicySchema,
  updateMerchantSchema,
  updateRecoveryPolicySchema,
} from "./merchants.validation.js";

type MerchantParams = {
  merchantId: string;
};

type RecoveryPolicyParams = {
  merchantId: string;
  policyId: string;
};

export class MerchantController {
  constructor(
    private readonly merchantService: MerchantService,
  ) {}

  // =========================================
  // MERCHANT PROFILE
  // =========================================

  getMerchant = async (
    req: Request<MerchantParams>,
    res: Response,
  ) => {
    const { merchantId } = req.params;

    const merchant =
      await this.merchantService.getMerchant(merchantId);

    res.status(200).json({
      success: true,
      data: merchant,
    });
  };

  updateMerchant = async (
    req: Request<MerchantParams>,
    res: Response,
  ) => {
    const { merchantId } = req.params;

    const input = updateMerchantSchema.parse(req.body);

    const merchant =
      await this.merchantService.updateMerchant(
        merchantId,
        input,
      );

    res.status(200).json({
      success: true,
      data: merchant,
    });
  };

  getRazorpayConnection = async (
    req: Request<MerchantParams>,
    res: Response,
  ) => {
    const { merchantId } = req.params;

    const connection =
      await this.merchantService.getRazorpayConnection(
        merchantId,
      );

    res.status(200).json({
      success: true,
      data: connection,
    });
  };

  getRecoveryPolicies = async (
    req: Request<MerchantParams>,
    res: Response,
  ) => {
    const { merchantId } = req.params;

    const policies =
      await this.merchantService.getRecoveryPolicies(
        merchantId,
      );

    res.status(200).json({
      success: true,
      data: policies,
    });
  };

  getActiveRecoveryPolicy = async (
    req: Request<MerchantParams>,
    res: Response,
  ) => {
    const { merchantId } = req.params;

    const policy =
      await this.merchantService.getActiveRecoveryPolicy(
        merchantId,
      );

    res.status(200).json({
      success: true,
      data: policy,
    });
  };

  getRecoveryPolicy = async (
    req: Request<RecoveryPolicyParams>,
    res: Response,
  ) => {
    const { merchantId, policyId } = req.params;

    const policy =
      await this.merchantService.getRecoveryPolicy(
        merchantId,
        policyId,
      );

    res.status(200).json({
      success: true,
      data: policy,
    });
  };

  createRecoveryPolicy = async (
    req: Request<MerchantParams>,
    res: Response,
  ) => {
    const { merchantId } = req.params;

    const input =
      createRecoveryPolicySchema.parse(req.body);

    const policy =
      await this.merchantService.createRecoveryPolicy(
        merchantId,
        input,
      );

    res.status(201).json({
      success: true,
      data: policy,
    });
  };

  updateRecoveryPolicy = async (
    req: Request<RecoveryPolicyParams>,
    res: Response,
  ) => {
    const { merchantId, policyId } = req.params;

    const input =
      updateRecoveryPolicySchema.parse(req.body);

    const policy =
      await this.merchantService.updateRecoveryPolicy(
        merchantId,
        policyId,
        input,
      );

    res.status(200).json({
      success: true,
      data: policy,
    });
  };

  deactivateRecoveryPolicy = async (
    req: Request<RecoveryPolicyParams>,
    res: Response,
  ) => {
    const { merchantId, policyId } = req.params;

    await this.merchantService.deactivateRecoveryPolicy(
      merchantId,
      policyId,
    );

    res.status(200).json({
      success: true,
      message: "Recovery policy deactivated successfully",
    });
  };
}