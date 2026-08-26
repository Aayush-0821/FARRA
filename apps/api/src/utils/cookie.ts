import type { Response } from "express";

import { AUTH_COOKIE } from "../modules/auth/auth.constants.js";

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
};

export function setAccessTokenCookie(
  res: Response,
  accessToken: string,
) {
  res.cookie(
    AUTH_COOKIE.ACCESS_TOKEN_NAME,
    accessToken,
    {
      ...baseCookieOptions,
      path: AUTH_COOKIE.ACCESS_TOKEN_PATH,
      maxAge: 15 * 60 * 1000,
    },
  );
}

export function setRefreshTokenCookie(
  res: Response,
  refreshToken: string,
) {
  res.cookie(
    AUTH_COOKIE.REFRESH_TOKEN_NAME,
    refreshToken,
    {
      ...baseCookieOptions,
      path: AUTH_COOKIE.REFRESH_TOKEN_PATH,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  );
}

export function clearAccessTokenCookie(res: Response) {
  res.clearCookie(
    AUTH_COOKIE.ACCESS_TOKEN_NAME,
    {
      ...baseCookieOptions,
      path: AUTH_COOKIE.ACCESS_TOKEN_PATH,
    },
  );
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie(
    AUTH_COOKIE.REFRESH_TOKEN_NAME,
    {
      ...baseCookieOptions,
      path: AUTH_COOKIE.REFRESH_TOKEN_PATH,
    },
  );
}