import {
  LOGGER,
} from "./logger.constants";

import type {
  LogLevel,
  LoggerContext,
  LogMetadata,
} from "./logger.types";

type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LoggerContext;
  metadata?: LogMetadata;
};

export class Logger {
  private readonly context: LoggerContext;

  constructor(context: LoggerContext = {}) {
    this.context = context;
  }

  child(context: LoggerContext): Logger {
    return new Logger({
      ...this.context,
      ...context,
    });
  }

  debug(
    message: string,
    metadata?: LogMetadata,
  ): void {
    this.write(
      LOGGER.LEVELS.DEBUG,
      message,
      metadata,
    );
  }

  info(
    message: string,
    metadata?: LogMetadata,
  ): void {
    this.write(
      LOGGER.LEVELS.INFO,
      message,
      metadata,
    );
  }

  warn(
    message: string,
    metadata?: LogMetadata,
  ): void {
    this.write(
      LOGGER.LEVELS.WARN,
      message,
      metadata,
    );
  }

  error(
    message: string,
    metadata?: LogMetadata,
  ): void {
    this.write(
      LOGGER.LEVELS.ERROR,
      message,
      metadata,
    );
  }

  fatal(
    message: string,
    metadata?: LogMetadata,
  ): void {
    this.write(
      LOGGER.LEVELS.FATAL,
      message,
      metadata,
    );
  }

  private write(
    level: LogLevel,
    message: string,
    metadata?: LogMetadata,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (Object.keys(this.context).length > 0) {
      entry.context = this.context;
    }

    if (metadata) {
      entry.metadata = metadata;
    }

    const serialized = JSON.stringify(entry);

    switch (level) {
      case LOGGER.LEVELS.ERROR:
      case LOGGER.LEVELS.FATAL:
        console.error(serialized);
        break;

      case LOGGER.LEVELS.WARN:
        console.warn(serialized);
        break;

      default:
        console.log(serialized);
    }
  }
}

export const logger = new Logger();