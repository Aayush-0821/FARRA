export const RAZORPAY_DEFAULTS = {
  PROVIDER: "razorpay",
  OAUTH_SCOPE: "read_only",
  OAUTH_MODE: "test",
  OAUTH_STATE_TTL_SECONDS: 600,
} as const;

export const RAZORPAY_OAUTH = {
  AUTHORIZE_URL: "https://auth.razorpay.com/authorize",
  TOKEN_URL: "https://auth.razorpay.com/token",
  REVOKE_URL: "https://auth.razorpay.com/revoke",

  RESPONSE_TYPE: "code",

  GRANT_TYPE_AUTHORIZATION_CODE:
    "authorization_code",

  GRANT_TYPE_REFRESH_TOKEN:
    "refresh_token",
} as const;

export const RAZORPAY_ERRORS = {
  CONNECTION_NOT_FOUND:
    "Razorpay connection not found",

  CONNECTION_ALREADY_EXISTS:
    "Razorpay connection already exists",

  INVALID_CONNECTION:
    "Invalid Razorpay connection",

  MERCHANT_NOT_FOUND:
    "Merchant not found",

  CONNECTION_INACTIVE:
    "Razorpay connection is inactive",

  OAUTH_CONFIG_MISSING:
    "Razorpay OAuth configuration is missing",

  OAUTH_STATE_INVALID:
    "Invalid OAuth state",

  OAUTH_CODE_MISSING:
    "OAuth authorization code is missing",

  OAUTH_ACCESS_DENIED:
    "Razorpay authorization was denied",

  OAUTH_TOKEN_EXCHANGE_FAILED:
    "Failed to exchange Razorpay authorization code",
} as const;