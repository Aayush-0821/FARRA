import { ERROR_CODES, ErrorCode } from "./error-codes";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;
  public readonly cause?: unknown;

  constructor(
    code: ErrorCode,
    message: string,
    options?: {
      statusCode?: number;
      isOperational?: boolean;
      details?: unknown;
      cause?: unknown;
    },
  ) {
    super(message);

    this.name = "AppError";
    this.code = code;
    this.statusCode = options?.statusCode ?? 500;
    this.isOperational = options?.isOperational ?? true;
    this.details = options?.details;
    this.cause = options?.cause;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  static validation(
    message = "Validation failed",
    details?: unknown,
  ) {
    return new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      message,
      {
        statusCode: 400,
        details,
      },
    );
  }

  static unauthorized(
    message = "Authentication required",
  ) {
    return new AppError(
      ERROR_CODES.UNAUTHORIZED,
      message,
      {
        statusCode: 401,
      },
    );
  }

  static forbidden(
    message = "You do not have permission to perform this action",
  ) {
    return new AppError(
      ERROR_CODES.FORBIDDEN,
      message,
      {
        statusCode: 403,
      },
    );
  }

  static notFound(
    message = "Resource not found",
    code: ErrorCode = ERROR_CODES.NOT_FOUND,
  ) {
    return new AppError(
      code,
      message,
      {
        statusCode: 404,
      },
    );
  }

  static conflict(
    message = "Resource conflict",
    code: ErrorCode = ERROR_CODES.CONFLICT,
  ) {
    return new AppError(
      code,
      message,
      {
        statusCode: 409,
      },
    );
  }

  static internal(
    message = "An internal error occurred",
    cause?: unknown,
  ) {
    return new AppError(
      ERROR_CODES.INTERNAL_ERROR,
      message,
      {
        statusCode: 500,
        isOperational: false,
        cause,
      },
    );
  }
}