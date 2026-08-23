export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = "INTERNAL_SERVER_ERROR",
  ) {
    super(message);

    this.name = "AppError";

    Object.setPrototypeOf(this, new.target.prototype);
  }
}