import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// ─── Payments ─────────────────────────────────────────────────────────────────
export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // 'pending' | 'completed' | 'failed'
  planId: text("plan_id").notNull(),
  customerEmail: text("customer_email"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(new Date()),
});

export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// ─── Webhook Event Log ────────────────────────────────────────────────────────
// Every incoming Stripe webhook event is recorded here for full auditability.
export const webhookEvents = sqliteTable("webhook_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stripeEventId: text("stripe_event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  status: text("status").notNull(),          // 'received' | 'processed' | 'failed' | 'duplicate'
  processingMs: integer("processing_ms"),    // how long fulfillment took
  errorMessage: text("error_message"),       // populated on failure
  rawPayload: text("raw_payload"),           // JSON string of event data (trimmed)
  stripeSessionId: text("stripe_session_id"),
  planId: text("plan_id"),
  customerEmail: text("customer_email"),
  receivedAt: integer("received_at", { mode: "timestamp" }).notNull().default(new Date()),
  processedAt: integer("processed_at", { mode: "timestamp" }),
});

export const insertWebhookEventSchema = createInsertSchema(webhookEvents);
export const selectWebhookEventSchema = createSelectSchema(webhookEvents);
export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type InsertWebhookEvent = typeof webhookEvents.$inferInsert;

// ─── Session Anomalies ────────────────────────────────────────────────────────
// Records suspicious or failed checkout session creation attempts.
export const sessionAnomalies = sqliteTable("session_anomalies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  anomalyType: text("anomaly_type").notNull(),  // 'missing_fields' | 'stripe_error' | 'invalid_price' | 'duplicate_session' | 'signature_failure' | 'unknown_plan'
  severity: text("severity").notNull(),          // 'low' | 'medium' | 'high' | 'critical'
  planId: text("plan_id"),
  priceId: text("price_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  errorMessage: text("error_message"),
  stripeSessionId: text("stripe_session_id"),
  resolved: integer("resolved", { mode: "boolean" }).notNull().default(false),
  alertSent: integer("alert_sent", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(new Date()),
});

export const insertSessionAnomalySchema = createInsertSchema(sessionAnomalies);
export const selectSessionAnomalySchema = createSelectSchema(sessionAnomalies);
export type SessionAnomaly = typeof sessionAnomalies.$inferSelect;
export type InsertSessionAnomaly = typeof sessionAnomalies.$inferInsert;

// ─── Alert Log ────────────────────────────────────────────────────────────────
// Tracks every alert dispatched so we can avoid duplicate notifications.
export const alertLog = sqliteTable("alert_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  alertType: text("alert_type").notNull(),  // 'webhook_failure' | 'signature_failure' | 'anomaly_spike' | 'fulfillment_error'
  severity: text("severity").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  channel: text("channel").notNull(),       // 'email' | 'console'
  delivered: integer("delivered", { mode: "boolean" }).notNull().default(false),
  errorMessage: text("error_message"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(new Date()),
});

export const insertAlertLogSchema = createInsertSchema(alertLog);
export type AlertLogEntry = typeof alertLog.$inferSelect;
export type InsertAlertLogEntry = typeof alertLog.$inferInsert;
