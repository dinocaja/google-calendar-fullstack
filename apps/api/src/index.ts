import app from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { prisma } from "./db/prisma";

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, `API running on http://localhost:${env.PORT}`);
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

async function gracefulShutdown(signal: string) {
  logger.info({ signal }, "Received shutdown signal, closing gracefully...");
  
  server.close(async () => {
    logger.info({}, "HTTP server closed");
    
    try {
      await prisma.$disconnect();
      logger.info({}, "Database connection closed");
      process.exit(0);
    } catch (error) {
      logger.error({ error }, "Error during shutdown");
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error({}, "Forced shutdown after timeout");
    process.exit(1);
  }, 30000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason, promise) => {
  logger.error({ reason, promise: String(promise) }, "Unhandled Promise Rejection");
});

process.on("uncaughtException", (error) => {
  logger.error({ error: error.message, stack: error.stack }, "Uncaught Exception");
  gracefulShutdown("uncaughtException");
});
