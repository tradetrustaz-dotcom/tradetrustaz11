// Anomaly detector — records suspicious events and triggers alerts when
// thresholds are breached (e.g. multiple signature failures in a short window).

import { db } from "./db";
import { sessionAnomalies, webhookEvents } from "../shared/schema";
import { eq, gte, and, count } from "drizzle-orm";
import { dispatchAlert } from "./alerts";
import { logger } from "./logger";

export type AnomalyType =
  | "missing_fields"
  | "stripe_error"
  | "invalid_price"
  | "duplicate_session"
  | "signature_failure"
  | "unknown_plan"
  | "fulfillment_db_error"
  | "webhook_processing_timeout";

export type AnomalySeverity = "low" | "medium" | "high" | "critical";

// Thresholds — how many occurrences of an anomaly type within the window
// before an alert is fired.
const THRESHOLDS: Record<AnomalyType, { count: number; windowMs: number; severity: AnomalySeverity }> = {
  signature_failure:          { count: 3,  windowMs: 5  * 60 * 1000, severity: "critical" },
  stripe_error:               { count: 5,  windowMs: 10 * 60 * 1000, severity: "high"     },
  fulfillment_db_error:       { count: 2,  windowMs: 5  * 60 * 1000, severity: "critical" },
  duplicate_session:          { count: 5,  windowMs: 10 * 60 * 1000, severity: "medium"   },
  missing_fields:             { count: 10, windowMs: 10 * 60 * 1000, severity: "medium"   },
  invalid_price:              { count: 3,  windowMs: 10 * 60 * 1000, severity: "high"     },
  unknown_plan:               { count: 3,  windowMs: 10 * 60 * 1000, severity: "high"     },
  webhook_processing_timeout: { count: 2,  windowMs: 5  * 60 * 1000, severity: "high"     },
};

export async function recordAnomaly(params: {
  anomalyType: AnomalyType;
  severity?: AnomalySeverity;
  planId?: string;
  priceId?: string;
  ipAddress?: string;
  userAgent?: string;
  errorMessage?: string;
  stripeSessionId?: string;
}): Promise<void> {
  const threshold = THRESHOLDS[params.anomalyType];
  const severity = params.severity ?? threshold?.severity ?? "medium";

  logger.warn("anomaly_recorded", {
    anomalyType: params.anomalyType,
    severity,
    planId: params.planId,
    errorMessage: params.errorMessage,
  });

  try {
    await db.insert(sessionAnomalies).values({
      anomalyType: params.anomalyType,
      severity,
      planId: params.planId ?? null,
      priceId: params.priceId ?? null,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
      errorMessage: params.errorMessage ?? null,
      stripeSessionId: params.stripeSessionId ?? null,
    });
  } catch (err: any) {
    logger.error("anomaly_db_write_failed", { error: err.message });
    return;
  }

  // Check if threshold is breached — if so, fire an alert
  if (!threshold) return;

  try {
    const windowStart = new Date(Date.now() - threshold.windowMs);
    const [result] = await db
      .select({ total: count() })
      .from(sessionAnomalies)
      .where(
        and(
          eq(sessionAnomalies.anomalyType, params.anomalyType),
          gte(sessionAnomalies.createdAt, windowStart)
        )
      );

    const total = result?.total ?? 0;
    if (total >= threshold.count) {
      await dispatchAlert({
        type: params.anomalyType === "signature_failure" ? "signature_failure" : "anomaly_spike",
        severity: threshold.severity,
        subject: `${params.anomalyType.replace(/_/g, " ")} threshold breached (${total} in ${threshold.windowMs / 60000}m)`,
        body: [
          `Anomaly type: ${params.anomalyType}`,
          `Occurrences in window: ${total} (threshold: ${threshold.count})`,
          `Last error: ${params.errorMessage ?? "N/A"}`,
          `Plan: ${params.planId ?? "N/A"}`,
          `Session: ${params.stripeSessionId ?? "N/A"}`,
        ].join("\n"),
        meta: { anomalyType: params.anomalyType, total, threshold: threshold.count },
      });
    }
  } catch (err: any) {
    logger.error("anomaly_threshold_check_failed", { error: err.message });
  }
}
