import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import * as eventsService from "../services/events.service";
import * as userRepo from "../repositories/user.repo";
import { signToken } from "../lib/jwt";
import { AppError } from "../lib/errors";
import { env, isProduction } from "../config/env";
import {
  JWT_COOKIE_NAME,
  STATE_COOKIE_NAME,
  STATE_COOKIE_MAX_AGE,
  AUTH_COOKIE_MAX_AGE,
} from "../config/constants";

export async function initiateGoogleAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { url, state } = authService.generateAuthUrl();
    
    res.cookie(STATE_COOKIE_NAME, state, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: STATE_COOKIE_MAX_AGE,
      path: "/",
    });
    
    res.redirect(url);
  } catch (error) {
    next(error);
  }
}

export async function handleGoogleCallback(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies[STATE_COOKIE_NAME];
    
    if (!code || typeof code !== "string") {
      throw AppError.badRequest("Authorization code is required");
    }
    
    if (!state || state !== storedState) {
      throw AppError.badRequest("Invalid state parameter");
    }
    
    res.clearCookie(STATE_COOKIE_NAME, { path: "/" });
    
    const { accessToken, refreshToken } = await authService.exchangeCode(code);
    const userProfile = await authService.getUserProfile(accessToken);
    
    const user = await userRepo.upsertByGoogleId({
      googleUserId: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      accessToken,
      refreshToken,
    });
    
    await eventsService.syncUserEvents(user);
    
    const jwtToken = signToken({ userId: user.id });
    
    res.cookie(JWT_COOKIE_NAME, jwtToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: "/",
    });
    
    res.redirect(env.APP_URL);
  } catch (error) {
    next(error);
  }
}

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    
    res.json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.clearCookie(JWT_COOKIE_NAME, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });
    
    res.json({
      data: {
        message: "Logged out successfully",
      },
    });
  } catch (error) {
    next(error);
  }
}
