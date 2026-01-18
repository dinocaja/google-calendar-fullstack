import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { env, isProduction } from "./config/env";
import { requestIdMiddleware } from "./middlewares/requestId.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { rateLimiter } from "./middlewares/rateLimiter.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import authRoutes from "./routes/auth.routes";
import eventsRoutes from "./routes/events.routes";
import { prisma } from "./db/prisma";

const app = express();

app.set("trust proxy", isProduction ? 1 : false);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(requestIdMiddleware);
app.use(rateLimiter);
app.use(cors({ 
  origin: env.APP_URL, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ ok: false, error: "Database connection failed" });
  }
});

app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
