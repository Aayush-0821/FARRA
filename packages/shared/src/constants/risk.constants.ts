export const RISK = {
  SCORE: {
    LOW_MAX: 0.3,
    MEDIUM_MAX: 0.6,
    HIGH_MAX: 0.8,
  },

  PROBABILITY: {
    MIN_RECOVERY_THRESHOLD: 0.2,
  },

  SIGNAL: {
    DEFAULT_WEIGHT: 1,
    MAX_WEIGHT: 10,
  },

  EXPIRY: {
    DEFAULT_HOURS: 72,
  },
} as const;