import Stripe from "stripe";
import { db } from "./db";
import { payments } from "../shared/schema";
import { eq } from "drizzle-orm";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24-preview",
});

export async function handleStripeWebhook(signature: string, payload: Buffer) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const planId = session.metadata?.planId || "unknown";
    
    await db.insert(payments).values({
      stripeSessionId: session.id,
      stripeCustomerId: session.customer as string,
      amount: session.amount_total || 0,
      currency: session.currency || "usd",
      status: "completed",
      planId: planId,
      customerEmail: session.customer_details?.email || null,
    }).onConflictDoUpdate({
      target: payments.stripeSessionId,
      set: { status: "completed" }
    });

    console.log(`Fulfillment completed for session ${session.id}, plan: ${planId}`);
  }

  return { received: true };
}
