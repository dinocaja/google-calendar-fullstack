export class AppError extends Error {
  public readonly isOperational = true;

  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(400, "BAD_REQUEST", message, details);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(401, "UNAUTHORIZED", message);
  }

  static forbidden(message = "Forbidden") {
    return new AppError(403, "FORBIDDEN", message);
  }

  static notFound(resource: string) {
    return new AppError(404, "NOT_FOUND", `${resource} not found`);
  }

  static conflict(message: string, details?: unknown) {
    return new AppError(409, "CONFLICT", message, details);
  }

  static tooManyRequests(message = "Too many requests") {
    return new AppError(429, "RATE_LIMIT_EXCEEDED", message);
  }

  static internal(message = "Internal server error") {
    return new AppError(500, "INTERNAL_ERROR", message);
  }

  static googleApiError(message: string, details?: unknown) {
    return new AppError(502, "GOOGLE_API_ERROR", message, details);
  }

  static serviceUnavailable(message = "Service temporarily unavailable") {
    return new AppError(503, "SERVICE_UNAVAILABLE", message);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}
