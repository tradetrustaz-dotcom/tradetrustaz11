// Alert dispatcher — sends notifications when anomalies or failures are detected.
// Supports email via SMTP (nodemailer) when ALERT_EMAIL_* env vars are set,
// and always falls back to structured console output so Vercel logs capture it.

import { db } from "./db";
import { alertLog } from "../shared/schema";
import { logger } from "./logger";

export type AlertSeverity = "low" | "medium" | "high" | "critical";
export type AlertType =
  | "webhook_failure"
  | "signature_failure"
  | "fulfillment_error"
  | "anomaly_spike"
  | "duplicate_event"
  | "missing_env"
  | "session_error";

export interface AlertPayload {
  type: AlertType;
  severity: AlertSeverity;
  subject: string;
  body: string;
  meta?: Record<string, unknown>;
}

// Throttle map — prevents flooding the same alert type within a window.
const throttleMap = new Map<string, number>();
const THROTTLE_MS = 5 * 60 * 1000; // 5 minutes per alert type

async function shouldThrottle(key: string): Promise<boolean> {
  const last = throttleMap.get(key);
  if (last && Date.now() - last < THROTTLE_MS) return true;
  throttleMap.set(key, Date.now());
  return false;
}

async function sendEmail(subject: string, body: string): Promise<boolean> {
  const host = process.env.ALERT_SMTP_HOST;
  const port = parseInt(process.env.ALERT_SMTP_PORT || "587", 10);
  const user = process.env.ALERT_SMTP_USER;
  const pass = process.env.ALERT_SMTP_PASS;
  const from = process.env.ALERT_FROM_EMAIL;
  const to   = process.env.ALERT_TO_EMAIL;

  if (!host || !user || !pass || !from || !to) {
    return false; // Email not configured — fall through to console
  }

  try {
    // Dynamically import nodemailer only when email is configured
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    await transporter.sendMail({ from, to, subject, text: body });
    return true;
  } catch (err: any) {
    logger.error("alert_email_send_failed", { error: err.message });
    return false;
  }
}

export async function dispatchAlert(payload: AlertPayload): Promise<void> {
  const throttleKey = `${payload.type}:${payload.severity}`;

  // Always log to structured console (Vercel captures this)
  logger[payload.severity === "critical" || payload.severity === "high" ? "critical" : "warn"](
    `ALERT: ${payload.subject}`,
    { alertType: payload.type, severity: payload.severity, ...payload.meta }
  );

  // Throttle duplicate alerts
  if (await shouldThrottle(throttleKey)) {
    logger.debug("alert_throttled", { key: throttleKey });
    return;
  }

  // Attempt email delivery
  const delivered = await sendEmail(
    `[TradeTrust AZ] ${payload.severity.toUpperCase()}: ${payload.subject}`,
    `${payload.body}\n\nTimestamp: ${new Date().toISOString()}\nMeta: ${JSON.stringify(payload.meta ?? {}, null, 2)}`
  );

  // Persist alert to DB for dashboard visibility
  try {
    await db.insert(alertLog).values({
      alertType: payload.type,
      severity: payload.severity,
      subject: payload.subject,
      body: payload.body,
      channel: delivered ? "email" : "console",
      delivered,
    });
  } catch (dbErr: any) {
    logger.error("alert_log_db_write_failed", { error: dbErr.message });
  }
}
