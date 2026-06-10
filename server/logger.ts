// Structured JSON logger for server-side monitoring.
// Every log entry is a JSON line so it can be ingested by Vercel Log Drains,
// Datadog, Logtail, or any NDJSON-compatible log aggregator.

export type LogLevel = "debug" | "info" | "warn" | "error" | "critical";

export interface LogEntry {
  ts: string;
  level: LogLevel;
  msg: string;
  [key: string]: unknown;
}

function emit(level: LogLevel, msg: string, meta: Record<string, unknown> = {}) {
  const entry: LogEntry = {
    ts: new Date().toISOString(),
    level,
    msg,
    ...meta,
  };
  const line = JSON.stringify(entry);
  if (level === "error" || level === "critical") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => emit("debug", msg, meta),
  info:  (msg: string, meta?: Record<string, unknown>) => emit("info",  msg, meta),
  warn:  (msg: string, meta?: Record<string, unknown>) => emit("warn",  msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => emit("error", msg, meta),
  critical: (msg: string, meta?: Record<string, unknown>) => emit("critical", msg, meta),
};
