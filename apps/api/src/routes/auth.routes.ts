import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.get("/google", authRateLimiter, authController.initiateGoogleAuth);
router.get("/google/callback", authRateLimiter, authController.handleGoogleCallback);
router.get("/me", authMiddleware, authController.getMe);
router.post("/logout", authMiddleware, authController.logout);

export default router;
