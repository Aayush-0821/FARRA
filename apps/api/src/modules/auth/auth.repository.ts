import { PrismaClient } from "@prisma/client";

export class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async createUser(data: {
    merchantId: string;
    name: string;
    email: string;
    passwordHash: string;
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  async createMerchant(data: { name: string; razorpayAccountId?: string }) {
    return this.prisma.merchant.create({
      data: {
        name: data.name,
        ...(data.razorpayAccountId !== undefined && {
          razorpayAccountId: data.razorpayAccountId,
        }),
      },
    });
  }

  async createUserWithMerchant(data: {
    merchantName: string;
    razorpayAccountId?: string;
    userName: string;
    userEmail: string;
    passwordHash: string;
  }) {
    return this.prisma.merchant.create({
      data: {
        name: data.merchantName,

        ...(data.razorpayAccountId !== undefined && {
          razorpayAccountId: data.razorpayAccountId,
        }),

        users: {
          create: {
            name: data.userName,
            email: data.userEmail,
            passwordHash: data.passwordHash,
          },
        },
      },
      include: {
        users: true,
      },
    });
  }

  async createRefreshToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }) {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  async findRefreshToken(tokenHash: string) {
    return this.prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
    });
  }

  async revokeRefreshToken(tokenHash: string) {
    return this.prisma.refreshToken.update({
      where: {
        tokenHash,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeAllRefreshTokens(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async createPasswordResetToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }) {
    return this.prisma.passwordResetToken.create({
      data,
    });
  }

  async findPasswordResetToken(tokenHash: string) {
    return this.prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });
  }

  async markPasswordResetTokenUsed(tokenId: string) {
    return this.prisma.passwordResetToken.update({
      where: {
        id: tokenId,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async invalidatePasswordResetTokens(userId: string) {
    return this.prisma.passwordResetToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async createEmailVerificationToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }) {
    return this.prisma.emailVerificationToken.create({
      data,
    });
  }

  async findEmailVerificationToken(tokenHash: string) {
    return this.prisma.emailVerificationToken.findUnique({
      where: {
        tokenHash,
      },
    });
  }

  async markEmailVerificationTokenUsed(tokenId: string) {
    return this.prisma.emailVerificationToken.update({
      where: {
        id: tokenId,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async invalidateEmailVerificationTokens(userId: string) {
    return this.prisma.emailVerificationToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async markEmailVerified(userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerifiedAt: new Date(),
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });
  }
}
