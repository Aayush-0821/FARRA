import { PrismaClient } from "@prisma/client";

import type {
  UpdateRazorpayConnectionInput,
  RazorpayOAuthTokenResponse,
} from "./razorpay.types.js";

import { RAZORPAY_DEFAULTS } from "./razorpay.constants.js";

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

  async createFromOAuth(
    merchantId: string,
    tokens: RazorpayOAuthTokenResponse,
  ) {
    return this.prisma.razorpayConnection.create({
      data: {
        merchantId,

        razorpayAccountId: tokens.razorpay_account_id,

        accessToken: tokens.access_token,

        ...(tokens.refresh_token !== undefined && {
          refreshToken: tokens.refresh_token,
        }),

        ...(tokens.expires_in !== undefined && {
          expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        }),

        scope: RAZORPAY_DEFAULTS.OAUTH_SCOPE,

        status: "ACTIVE",
      },
    });
  }

  async update(id: string, input: UpdateRazorpayConnectionInput) {
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
          status: input.status as
            | "ACTIVE"
            | "EXPIRED"
            | "REVOKED"
            | "DISCONNECTED",
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