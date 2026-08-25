export const RAZORPAY_DEFAULTS = {
  PROVIDER: "razorpay",
} as const;

export const RAZORPAY_ERRORS = {
  CONNECTION_NOT_FOUND: "Razorpay connection not found",
  CONNECTION_ALREADY_EXISTS:
    "Razorpay connection already exists",
  INVALID_CONNECTION: "Invalid Razorpay connection",
  MERCHANT_NOT_FOUND: "Merchant not found",
  CONNECTION_INACTIVE:
    "Razorpay connection is inactive",
} as const;