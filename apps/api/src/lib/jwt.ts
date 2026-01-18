import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "../config/env";
import { JWT_EXPIRES_IN } from "../config/constants";
import { AppError } from "./errors";

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export function signToken(payload: { userId: string }): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  });
}

export function verifyToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    
    if (typeof payload === "string" || !payload.userId) {
      throw AppError.unauthorized("Invalid token payload");
    }
    
    return payload as JwtPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw AppError.unauthorized("Token has expired");
    }
    if (error instanceof JsonWebTokenError) {
      throw AppError.unauthorized("Invalid token");
    }
    throw error;
  }
}
