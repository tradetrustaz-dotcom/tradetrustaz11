import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { handleStripeWebhook, stripe } from "./stripe";
import { runMigrations } from "./db";
import { logger } from "./logger";
import { recordAnomaly } from "./anomaly";
import { dispatchAlert } from "./alerts";
import { monitoringRouter } from "./monitoring";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Run migrations before starting the server
  await runMigrations();

  // Warn on missing critical env vars at startup
  const required = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"];
  for (const key of required) {
    if (!process.env[key]) {
      await dispatchAlert({
        type: "missing_env",
        severity: "critical",
        subject: `Missing required env var: ${key}`,
        body: `The environment variable ${key} is not set. Stripe functionality will not work correctly.`,
      });
    }
  }

  const app = express();
  const server = createServer(app);

  // ── Stripe webhook — MUST use raw body for signature verification ───────────
  app.post(
    "/api/webhooks/stripe",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      if (!sig) {
        logger.warn("webhook_missing_signature", { ip: req.ip });
        await recordAnomaly({
          anomalyType: "signature_failure",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"] ?? undefined,
          errorMessage: "Request arrived with no stripe-signature header",
        });
        return res.status(400).send("Missing stripe-signature header");
      }

      try {
        await handleStripeWebhook(sig as string, req.body);
        res.json({ received: true });
      } catch (err: any) {
        // Error already logged and alerted inside handleStripeWebhook
        res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }
  );

  // ── Regular JSON parsing for all other routes ───────────────────────────────
  app.use(express.json());

  // ── Create Stripe Checkout Session (server-side, with metadata) ─────────────
  app.post("/api/create-checkout-session", async (req, res) => {
    const { priceId, planId, mode } = req.body;

    if (!priceId || !planId || !mode) {
      await recordAnomaly({
        anomalyType: "missing_fields",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] ?? undefined,
        errorMessage: `Missing fields: priceId=${priceId}, planId=${planId}, mode=${mode}`,
      });
      logger.warn("checkout_session_missing_fields", { priceId, planId, mode, ip: req.ip });
      return res.status(400).json({ error: "Missing required fields" });
    }

    const validModes = ["payment", "subscription"];
    if (!validModes.includes(mode)) {
      await recordAnomaly({
        anomalyType: "missing_fields",
        planId,
        priceId,
        ipAddress: req.ip,
        errorMessage: `Invalid mode: ${mode}`,
      });
      return res.status(400).json({ error: "Invalid mode" });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: priceId, quantity: 1 }],
        mode: mode as "payment" | "subscription",
        success_url: `${req.headers.origin}/dashboard?checkout=success&plan=${planId}`,
        cancel_url: `${req.headers.origin}/pricing?checkout=cancelled`,
        metadata: { planId },
      });

      logger.info("checkout_session_created", { sessionId: session.id, planId, mode, ip: req.ip });
      res.json({ id: session.id });

    } catch (err: any) {
      await recordAnomaly({
        anomalyType: "stripe_error",
        planId,
        priceId,
        ipAddress: req.ip,
        errorMessage: err.message,
      });
      await dispatchAlert({
        type: "session_error",
        severity: "high",
        subject: `Stripe session creation failed for plan: ${planId}`,
        body: `Error: ${err.message}\nPlan: ${planId}\nPrice: ${priceId}\nMode: ${mode}`,
        meta: { planId, priceId, error: err.message },
      });
      logger.error("checkout_session_creation_failed", { planId, priceId, error: err.message });
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // ── Monitoring endpoints ────────────────────────────────────────────────────
  app.use("/api/monitoring", monitoringRouter);

  // ── Serve static files ──────────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // ── Client-side routing fallback ────────────────────────────────────────────
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    logger.info("server_started", { port, env: process.env.NODE_ENV ?? "development" });
  });
}

startServer().catch((err) => {
  logger.critical("server_startup_failed", { error: err.message });
  process.exit(1);
});
