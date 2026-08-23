export const LOGGER = {
  SERVICE_NAMES: {
    API: "api",
    WORKER: "worker",
    MERCHANT_DASHBOARD: "merchant-dashboard",
  },

  LEVELS: {
    DEBUG: "debug",
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
    FATAL: "fatal",
  },

  ENVIRONMENTS: {
    DEVELOPMENT: "development",
    TEST: "test",
    PRODUCTION: "production",
  },
} as const;