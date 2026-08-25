import {
  PrismaClient,
  ConnectionStatus,
} from "@prisma/client";

import type {
  CreateRazorpayConnectionInput,
  UpdateRazorpayConnectionInput,
} from "./razorpay.types.js";

export class RazorpayRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByMerchantId(merchantId: string) {
    return this.prisma.razorpayConnection.findUnique({
      where: {
        merchantId,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.razorpayConnection.findUnique({
      where: {
        id,
      },
    });
  }

  async create(input: CreateRazorpayConnectionInput) {
    return this.prisma.razorpayConnection.create({
      data: {
        merchantId: input.merchantId,
        accessToken: input.accessToken,

        ...(input.refreshToken !== undefined && {
          refreshToken: input.refreshToken,
        }),

        ...(input.expiresAt !== undefined && {
          expiresAt: input.expiresAt,
        }),

        ...(input.scope !== undefined && {
          scope: input.scope,
        }),
      },
    });
  }

  async update(
    id: string,
    input: UpdateRazorpayConnectionInput,
  ) {
    return this.prisma.razorpayConnection.update({
      where: {
        id,
      },
      data: {
        ...(input.accessToken !== undefined && {
          accessToken: input.accessToken,
        }),

        ...(input.refreshToken !== undefined && {
          refreshToken: input.refreshToken,
        }),

        ...(input.expiresAt !== undefined && {
          expiresAt: input.expiresAt,
        }),

        ...(input.scope !== undefined && {
          scope: input.scope,
        }),

        ...(input.status !== undefined && {
          status: input.status as ConnectionStatus,
        }),
      },
    });
  }

  async delete(id: string) {
    return this.prisma.razorpayConnection.delete({
      where: {
        id,
      },
    });
  }
}