import Stripe from "stripe";
import { db } from "./db";
import { payments, webhookEvents } from "../shared/schema";
import { eq } from "drizzle-orm";
import { logger } from "./logger";
import { dispatchAlert } from "./alerts";
import { recordAnomaly } from "./anomaly";

if (!process.env.STRIPE_SECRET_KEY) {
  logger.warn("STRIPE_SECRET_KEY is not set — Stripe calls will fail");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24-preview",
});

// ─── Webhook Handler ──────────────────────────────────────────────────────────

export async function handleStripeWebhook(signature: string, payload: Buffer): Promise<{ received: true }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    await dispatchAlert({
      type: "missing_env",
      severity: "critical",
      subject: "STRIPE_WEBHOOK_SECRET is not set",
      body: "The server cannot verify Stripe webhook signatures. Set STRIPE_WEBHOOK_SECRET in Vercel environment variables immediately.",
    });
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  // ── Signature verification ──────────────────────────────────────────────────
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    await recordAnomaly({
      anomalyType: "signature_failure",
      errorMessage: err.message,
    });
    await dispatchAlert({
      type: "signature_failure",
      severity: "critical",
      subject: "Stripe webhook signature verification failed",
      body: `A webhook request arrived with an invalid signature.\n\nError: ${err.message}\n\nThis may indicate a replay attack or misconfigured secret.`,
      meta: { error: err.message },
    });
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  const startMs = Date.now();

  // ── Idempotency guard — skip already-processed events ──────────────────────
  const existing = await db
    .select({ id: webhookEvents.id, status: webhookEvents.status })
    .from(webhookEvents)
    .where(eq(webhookEvents.stripeEventId, event.id))
    .limit(1);

  if (existing.length > 0 && existing[0].status === "processed") {
    logger.info("webhook_duplicate_skipped", { eventId: event.id, eventType: event.type });
    await recordAnomaly({ anomalyType: "duplicate_session", errorMessage: `Duplicate event: ${event.id}` });
    return { received: true };
  }

  // ── Log event as received ───────────────────────────────────────────────────
  const session = event.type.startsWith("checkout.session")
    ? (event.data.object as Stripe.Checkout.Session)
    : null;

  const rawSnippet = JSON.stringify(event.data.object).slice(0, 2000); // cap at 2 KB

  await db.insert(webhookEvents).values({
    stripeEventId: event.id,
    eventType: event.type,
    status: "received",
    stripeSessionId: session?.id ?? null,
    planId: session?.metadata?.planId ?? null,
    customerEmail: session?.customer_details?.email ?? null,
    rawPayload: rawSnippet,
    receivedAt: new Date(),
  }).onConflictDoUpdate({
    target: webhookEvents.stripeEventId,
    set: { status: "received" },
  });

  logger.info("webhook_received", { eventId: event.id, eventType: event.type });

  // ── Process event ───────────────────────────────────────────────────────────
  try {
    if (event.type === "checkout.session.completed") {
      await fulfillCheckoutSession(session!);
    } else if (event.type === "checkout.session.expired") {
      await handleExpiredSession(session!);
    } else if (event.type === "payment_intent.payment_failed") {
      await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
    }
    // Additional event types can be added here as the product grows.

    const processingMs = Date.now() - startMs;

    // Flag slow processing (> 8 s) as an anomaly
    if (processingMs > 8000) {
      await recordAnomaly({
        anomalyType: "webhook_processing_timeout",
        errorMessage: `Processing took ${processingMs}ms`,
        stripeSessionId: session?.id,
      });
    }

    // Mark event as processed
    await db
      .update(webhookEvents)
      .set({ status: "processed", processingMs, processedAt: new Date() })
      .where(eq(webhookEvents.stripeEventId, event.id));

    logger.info("webhook_processed", { eventId: event.id, eventType: event.type, processingMs });

  } catch (err: any) {
    const processingMs = Date.now() - startMs;

    await db
      .update(webhookEvents)
      .set({ status: "failed", errorMessage: err.message, processingMs })
      .where(eq(webhookEvents.stripeEventId, event.id));

    await recordAnomaly({
      anomalyType: "fulfillment_db_error",
      errorMessage: err.message,
      stripeSessionId: session?.id,
      planId: session?.metadata?.planId,
    });

    await dispatchAlert({
      type: "fulfillment_error",
      severity: "critical",
      subject: `Webhook fulfillment failed for event ${event.id}`,
      body: `Event type: ${event.type}\nSession: ${session?.id ?? "N/A"}\nPlan: ${session?.metadata?.planId ?? "N/A"}\nError: ${err.message}`,
      meta: { eventId: event.id, eventType: event.type, error: err.message },
    });

    logger.error("webhook_fulfillment_failed", { eventId: event.id, error: err.message });
    throw err; // Re-throw so Express returns 400 to Stripe for retry
  }

  return { received: true };
}

// ─── Fulfillment Handlers ─────────────────────────────────────────────────────

async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  const planId = session.metadata?.planId;

  if (!planId) {
    await recordAnomaly({
      anomalyType: "unknown_plan",
      stripeSessionId: session.id,
      errorMessage: "checkout.session.completed arrived with no planId in metadata",
    });
    logger.warn("fulfillment_missing_plan_id", { sessionId: session.id });
  }

  await db.insert(payments).values({
    stripeSessionId: session.id,
    stripeCustomerId: (session.customer as string) ?? null,
    amount: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    status: "completed",
    planId: planId ?? "unknown",
    customerEmail: session.customer_details?.email ?? null,
  }).onConflictDoUpdate({
    target: payments.stripeSessionId,
    set: { status: "completed" },
  });

  logger.info("fulfillment_completed", {
    sessionId: session.id,
    planId: planId ?? "unknown",
    email: session.customer_details?.email,
    amount: session.amount_total,
  });
}

async function handleExpiredSession(session: Stripe.Checkout.Session) {
  await db
    .update(payments)
    .set({ status: "failed" })
    .where(eq(payments.stripeSessionId, session.id));

  logger.info("session_expired", { sessionId: session.id });
}

async function handlePaymentFailed(intent: Stripe.PaymentIntent) {
  logger.warn("payment_intent_failed", {
    intentId: intent.id,
    lastError: intent.last_payment_error?.message,
  });

  await dispatchAlert({
    type: "webhook_failure",
    severity: "high",
    subject: `Payment failed: ${intent.id}`,
    body: `A payment intent failed.\n\nIntent ID: ${intent.id}\nReason: ${intent.last_payment_error?.message ?? "Unknown"}`,
    meta: { intentId: intent.id },
  });
}
