import type { LOGGER } from "./logger.constants";

export type LogLevel =
  (typeof LOGGER.LEVELS)[keyof typeof LOGGER.LEVELS];

export type LoggerContext = {
  service?: string;
  environment?: string;

  requestId?: string;
  traceId?: string;

  merchantId?: string;
  recoveryCaseId?: string;
  eventId?: string;

  actionId?: string;

  [key: string]: unknown;
};

export type LogMetadata = Record<string, unknown>;