import { randomUUID } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { AUTH_DEFAULTS } from "../modules/auth/auth.constants.js";
import { env } from "../config/env.js";

const accessTokenSecret = new TextEncoder().encode(
  env.JWT_ACCESS_SECRET,
);

const refreshTokenSecret = new TextEncoder().encode(
  env.JWT_REFRESH_SECRET,
);

interface AccessTokenPayload {
  sub: string;
  merchantId: string;
  email: string;
  name: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
}

interface RefreshTokenPayload {
  sub: string;
  merchantId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
}

export async function generateAccessToken(
  payload: AccessTokenPayload,
): Promise<string> {
  return new SignJWT({
    merchantId: payload.merchantId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(AUTH_DEFAULTS.ACCESS_TOKEN_EXPIRES_IN)
    .sign(accessTokenSecret);
}

export async function generateRefreshToken(
  payload: RefreshTokenPayload,
): Promise<string> {
  return new SignJWT({
    merchantId: payload.merchantId,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(
      `${AUTH_DEFAULTS.REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
    )
    .sign(refreshTokenSecret);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, accessTokenSecret);

  return payload;
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, refreshTokenSecret);

  return payload;
}