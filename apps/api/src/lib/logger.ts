type LogLevel = "info" | "warn" | "error";

interface LogMeta {
  [key: string]: unknown;
}

function log(level: LogLevel, meta: LogMeta, message: string) {
  const logEntry = {
    level,
    message,
    ts: new Date().toISOString(),
    ...meta,
  };
  
  const output = JSON.stringify(logEntry);
  
  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  info: (meta: LogMeta, message: string) => log("info", meta, message),
  warn: (meta: LogMeta, message: string) => log("warn", meta, message),
  error: (meta: LogMeta, message: string) => log("error", meta, message),
};
