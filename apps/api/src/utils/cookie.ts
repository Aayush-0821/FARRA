import type { Response } from "express";

import {
  AUTH_COOKIE,
  AUTH_DEFAULTS,
} from "../modules/auth/auth.constants.js";

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge:
    AUTH_DEFAULTS.REFRESH_TOKEN_EXPIRES_IN_DAYS *
    24 *
    60 *
    60 *
    1000,
  path: AUTH_COOKIE.REFRESH_TOKEN_PATH,
};

export function setRefreshTokenCookie(
  res: Response,
  refreshToken: string,
): void {
  res.cookie(
    AUTH_COOKIE.REFRESH_TOKEN_NAME,
    refreshToken,
    refreshTokenCookieOptions,
  );
}

export function clearRefreshTokenCookie(
  res: Response,
): void {
  res.clearCookie(
    AUTH_COOKIE.REFRESH_TOKEN_NAME,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: AUTH_COOKIE.REFRESH_TOKEN_PATH,
    },
  );
}