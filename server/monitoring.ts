// Monitoring router — exposes read-only endpoints for health checks and
// operational visibility. All endpoints require a MONITORING_SECRET header
// so they are not publicly accessible.

import { Router } from "express";
import { db } from "./db";
import { webhookEvents, sessionAnomalies, alertLog, payments } from "../shared/schema";
import { desc, eq, gte, and, count, sql } from "drizzle-orm";
import { logger } from "./logger";

export const monitoringRouter = Router();

// ── Auth guard ─────────────────────────────────────────────────────────────────
function requireMonitoringSecret(req: any, res: any, next: any) {
  const secret = process.env.MONITORING_SECRET;
  if (!secret) {
    // If no secret is configured, block all access
    return res.status(503).json({ error: "Monitoring not configured" });
  }
  const provided = req.headers["x-monitoring-secret"] ?? req.query.secret;
  if (provided !== secret) {
    logger.warn("monitoring_unauthorized_access", { ip: req.ip, path: req.path });
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

monitoringRouter.use(requireMonitoringSecret);

// ── GET /api/monitoring/health ─────────────────────────────────────────────────
// Returns overall system health: DB connectivity, env var presence, recent stats.
monitoringRouter.get("/health", async (_req, res) => {
  const checks: Record<string, boolean | string> = {
    stripe_secret_key:    !!process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: !!process.env.STRIPE_WEBHOOK_SECRET,
    database:             false,
  };

  try {
    await db.select({ n: count() }).from(payments);
    checks.database = true;
  } catch (err: any) {
    checks.database = `error: ${err.message}`;
  }

  const allOk = Object.values(checks).every((v) => v === true);
  res.status(allOk ? 200 : 503).json({
    status: allOk ? "ok" : "degraded",
    ts: new Date().toISOString(),
    checks,
  });
});

// ── GET /api/monitoring/webhook-events ────────────────────────────────────────
// Returns the 50 most recent webhook events with their status.
monitoringRouter.get("/webhook-events", async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const query = db
      .select()
      .from(webhookEvents)
      .orderBy(desc(webhookEvents.receivedAt))
      .limit(50);

    const rows = await query;
    const filtered = status ? rows.filter((r) => r.status === status) : rows;
    res.json({ total: filtered.length, events: filtered });
  } catch (err: any) {
    logger.error("monitoring_webhook_events_query_failed", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/monitoring/anomalies ─────────────────────────────────────────────
// Returns recent unresolved anomalies, grouped by type.
monitoringRouter.get("/anomalies", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(sessionAnomalies)
      .where(eq(sessionAnomalies.resolved, false))
      .orderBy(desc(sessionAnomalies.createdAt))
      .limit(100);

    // Group by anomaly type for summary
    const summary: Record<string, number> = {};
    for (const row of rows) {
      summary[row.anomalyType] = (summary[row.anomalyType] ?? 0) + 1;
    }

    res.json({ total: rows.length, summary, anomalies: rows });
  } catch (err: any) {
    logger.error("monitoring_anomalies_query_failed", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/monitoring/alerts ────────────────────────────────────────────────
// Returns the 50 most recent dispatched alerts.
monitoringRouter.get("/alerts", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(alertLog)
      .orderBy(desc(alertLog.createdAt))
      .limit(50);
    res.json({ total: rows.length, alerts: rows });
  } catch (err: any) {
    logger.error("monitoring_alerts_query_failed", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/monitoring/stats ─────────────────────────────────────────────────
// Returns aggregate stats: total payments, failed webhooks, anomaly counts.
monitoringRouter.get("/stats", async (_req, res) => {
  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalPayments] = await db.select({ n: count() }).from(payments);
    const [failedWebhooks] = await db
      .select({ n: count() })
      .from(webhookEvents)
      .where(eq(webhookEvents.status, "failed"));
    const [recentAnomalies] = await db
      .select({ n: count() })
      .from(sessionAnomalies)
      .where(gte(sessionAnomalies.createdAt, since24h));
    const [signatureFailures] = await db
      .select({ n: count() })
      .from(sessionAnomalies)
      .where(
        and(
          eq(sessionAnomalies.anomalyType, "signature_failure"),
          gte(sessionAnomalies.createdAt, since24h)
        )
      );

    res.json({
      ts: new Date().toISOString(),
      total_payments: totalPayments.n,
      failed_webhooks_all_time: failedWebhooks.n,
      anomalies_last_24h: recentAnomalies.n,
      signature_failures_last_24h: signatureFailures.n,
    });
  } catch (err: any) {
    logger.error("monitoring_stats_query_failed", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/monitoring/resolve-anomaly ──────────────────────────────────────
// Marks an anomaly as resolved.
monitoringRouter.post("/resolve-anomaly/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    await db
      .update(sessionAnomalies)
      .set({ resolved: true })
      .where(eq(sessionAnomalies.id, id));
    logger.info("anomaly_resolved", { id });
    res.json({ resolved: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
