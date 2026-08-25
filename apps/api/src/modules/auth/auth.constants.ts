export const AUTH_DEFAULTS = {
  ACCESS_TOKEN_EXPIRES_IN: "15m",
  REFRESH_TOKEN_EXPIRES_IN_DAYS: 7,
  PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES: 15,
  EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MINUTES: 15,
} as const;

export const AUTH_COOKIE = {
  REFRESH_TOKEN_NAME: "refreshToken",
  REFRESH_TOKEN_PATH: "/api/v1/auth",
} as const;

export const AUTH_LIMITS = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 254,
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  USER_SUSPENDED: "User account is suspended",
  USER_DEACTIVATED: "User account is deactivated",
  EMAIL_ALREADY_EXISTS: "Email is already registered",
  EMAIL_NOT_VERIFIED: "Email is not verified",
  INVALID_REFRESH_TOKEN: "Invalid refresh token",
  REFRESH_TOKEN_EXPIRED: "Refresh token has expired",
  INVALID_RESET_TOKEN: "Invalid or expired password reset token",
} as const;