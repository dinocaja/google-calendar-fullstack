import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { AppError } from "../lib/errors";
import { JWT_COOKIE_NAME } from "../config/constants";
import * as userRepo from "../repositories/user.repo";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies[JWT_COOKIE_NAME];
    
    if (!token) {
      throw AppError.unauthorized("No authentication token provided");
    }
    
    const payload = verifyToken(token);
    const user = await userRepo.findById(payload.userId);
    
    if (!user) {
      throw AppError.unauthorized("User not found");
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(AppError.unauthorized("Invalid authentication token"));
    }
  }
}
