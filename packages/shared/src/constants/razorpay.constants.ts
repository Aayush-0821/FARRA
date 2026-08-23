export const RAZORPAY = {
  PROVIDER: "razorpay",

  API: {
    BASE_URL: "https://api.razorpay.com/v1",
  },

  WEBHOOK: {
    MAX_RETRY_ATTEMPTS: 5,
    PROCESSING_TIMEOUT_MS: 30_000,
  },
} as const;