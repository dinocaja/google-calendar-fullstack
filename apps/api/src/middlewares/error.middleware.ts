import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors";
import { logger } from "../lib/logger";
import { isProduction } from "../config/env";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = req.requestId;
  
  if (err instanceof AppError) {
    logger.warn({ requestId, code: err.code }, err.message);
    
    const shouldHideDetails = isProduction && err.code === "GOOGLE_API_ERROR";
    
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: shouldHideDetails ? undefined : err.details,
        requestId,
      },
    });
  }

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "Invalid JSON in request body",
        requestId,
      },
    });
  }
  
  logger.error({ requestId, err: err.message, stack: err.stack }, "Unhandled error");
  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: isProduction ? "An unexpected error occurred" : err.message,
      requestId,
    },
  });
}
