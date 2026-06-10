import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { handleStripeWebhook } from "./stripe";
import { runMigrations } from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Run migrations before starting the server
  await runMigrations();

  const app = express();
  const server = createServer(app);

  // Stripe webhook needs raw body for signature verification
  app.post(
    "/api/webhooks/stripe",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      if (!sig) {
        return res.status(400).send("No signature");
      }

      try {
        await handleStripeWebhook(sig as string, req.body);
        res.json({ received: true });
      } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }
  );

  // Regular JSON parsing for other routes
  app.use(express.json());

  // Create Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    const { priceId, planId, mode } = req.body;
    if (!priceId || !planId || !mode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: priceId, quantity: 1 }],
        mode: mode,
        success_url: `${req.headers.origin}/dashboard?checkout=success&plan=${planId}`,
        cancel_url: `${req.headers.origin}/pricing?checkout=cancelled`,
        metadata: { planId },
      });
      res.json({ id: session.id });
    } catch (err: any) {
      console.error(`Stripe Error: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
