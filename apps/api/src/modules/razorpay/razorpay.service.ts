import { AppError } from "../../errors/app.errors.js";

import { RazorpayRepository } from "./razorpay.repository.js";

import type {
  CreateRazorpayConnectionInput,
  UpdateRazorpayConnectionInput,
} from "./razorpay.types.js";

export class RazorpayService {
  constructor(
    private readonly razorpayRepository: RazorpayRepository,
  ) {}

  async getConnection(merchantId: string) {
    const connection =
      await this.razorpayRepository.findByMerchantId(
        merchantId,
      );

    if (!connection) {
      throw new AppError(
        "Razorpay account is not connected",
        404,
      );
    }

    return this.toSafeConnection(connection);
  }

  async createConnection(
    input: CreateRazorpayConnectionInput,
  ) {
    const existingConnection =
      await this.razorpayRepository.findByMerchantId(
        input.merchantId,
      );

    if (existingConnection) {
      throw new AppError(
        "Razorpay account is already connected",
        409,
      );
    }

    const connection =
      await this.razorpayRepository.create(input);

    return this.toSafeConnection(connection);
  }

  async updateConnection(
    merchantId: string,
    input: UpdateRazorpayConnectionInput,
  ) {
    const existingConnection =
      await this.razorpayRepository.findByMerchantId(
        merchantId,
      );

    if (!existingConnection) {
      throw new AppError(
        "Razorpay account is not connected",
        404,
      );
    }

    const connection =
      await this.razorpayRepository.update(
        existingConnection.id,
        input,
      );

    return this.toSafeConnection(connection);
  }

  async disconnect(merchantId: string) {
    const existingConnection =
      await this.razorpayRepository.findByMerchantId(
        merchantId,
      );

    if (!existingConnection) {
      throw new AppError(
        "Razorpay account is not connected",
        404,
      );
    }

    await this.razorpayRepository.delete(
      existingConnection.id,
    );

    return {
      message: "Razorpay account disconnected successfully",
    };
  }

  private toSafeConnection(connection: {
    id: string;
    merchantId: string;
    accessToken: string;
    refreshToken: string | null;
    expiresAt: Date | null;
    scope: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: connection.id,
      merchantId: connection.merchantId,
      status: connection.status,
      expiresAt: connection.expiresAt,
      scope: connection.scope,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    };
  }
}