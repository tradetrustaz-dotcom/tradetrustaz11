/**
 * Pricing — TradeTrust AZ
 * Design: Precision Trust — deep navy/teal/orange, asymmetric layout
 * Two tiers: Homeowner Pro ($49.99/mo) and Contractor Verified ($149.99/mo)
 * Uses Stripe Checkout redirect via @stripe/stripe-js (publishable key only, no backend needed)
 *
 * NOTE: To complete checkout, you must create Products + Prices in your Stripe Dashboard
 * and paste the Price IDs (price_xxx) into HOMEOWNER_PRICE_ID and CONTRACTOR_PRICE_ID below.
 */
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Shield, CheckCircle, Zap, Building2, ArrowRight, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";

// ─── Stripe config ────────────────────────────────────────────────────────────
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

// TODO: Replace these with your actual Stripe Price IDs from the Stripe Dashboard
// Dashboard → Products → Add product → set price → copy "Price ID" (starts with price_)
const HOMEOWNER_PRICE_ID = import.meta.env.VITE_STRIPE_HOMEOWNER_PRICE_ID as string || "";
const CONTRACTOR_PRICE_ID = import.meta.env.VITE_STRIPE_CONTRACTOR_PRICE_ID as string || "";

// ─── Plan data ────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "homeowner",
    priceId: HOMEOWNER_PRICE_ID,
    name: "Homeowner Pro",
    price: "$49.99",
    period: "/month",
    tagline: "For Arizona homeowners who want to stop overpaying on every job.",
    color: "#14B8A6",
    icon: <Shield className="w-7 h-7" />,
    badge: null,
    features: [
      "Unlimited quote uploads & analysis",
      "AI-powered Trust Score for every contractor",
      "Line-by-line market comparison",
      "Negotiation script generator",
      "PDF report download",
      "6 job categories (HVAC, plumbing, roofing, electrical, and more)",
      "30-day report history",
      "Email support",
    ],
    notIncluded: [
      "Contractor profile management",
      "Business analytics dashboard",
    ],
  },
  {
    id: "contractor",
    priceId: CONTRACTOR_PRICE_ID,
    name: "Contractor Verified",
    price: "$149.99",
    period: "/month",
    tagline: "For licensed Arizona contractors who want to build trust and win more bids.",
    color: "#F97316",
    icon: <Building2 className="w-7 h-7" />,
    badge: "Most Popular",
    features: [
      "Everything in Homeowner Pro",
      "Verified Contractor badge on your profile",
      "Dispute & respond to Trust Score findings",
      "Business analytics dashboard",
      "Lead generation from homeowner searches",
      "Priority listing in contractor directory",
      "Dedicated account manager",
      "Phone & email support",
      "Unlimited team seats",
    ],
    notIncluded: [],
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: typeof PLANS[0]) => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      toast.error("Stripe is not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment.");
      return;
    }
    if (!plan.priceId) {
      toast.error(
        `Price ID not set for ${plan.name}. Add VITE_STRIPE_${plan.id.toUpperCase()}_PRICE_ID to your environment variables.`,
        { duration: 6000 }
      );
      return;
    }

    setLoading(plan.id);
    try {
      const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
      if (!stripe) throw new Error("Stripe failed to load");

      // Note: stripe.redirectToCheckout is the legacy Checkout API.
      // For full Checkout Sessions (recommended), you need a backend to create a session.
      // This uses the legacy Checkout which works client-side with a publishable key.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stripeAny = stripe as any;
      const result = await stripeAny.redirectToCheckout({
        lineItems: [{ price: plan.priceId, quantity: 1 }],
        mode: "subscription",
        successUrl: `${window.location.origin}/dashboard?checkout=success`,
        cancelUrl: `${window.location.origin}/pricing?checkout=cancelled`,
      });

      if (result?.error) throw result.error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-16" style={{ background: "#0F172A" }}>
        <div className="container text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Simple, Transparent Pricing
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            Know what you're paying for.
            <br />
            <span style={{ color: "#14B8A6" }}>Before you sign anything.</span>
          </h1>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif" }}
          >
            No hidden fees. Cancel anytime. Secure checkout powered by Stripe.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {[
              { icon: <Lock className="w-4 h-4" />, text: "256-bit SSL encryption" },
              { icon: <Zap className="w-4 h-4" />, text: "Instant access after payment" },
              { icon: <Star className="w-4 h-4" />, text: "Cancel anytime, no penalty" },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Inter', sans-serif" }}
              >
                <span style={{ color: "#14B8A6" }}>{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING CARDS ─────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="relative rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "white",
                  boxShadow: plan.badge
                    ? `0 0 0 2px ${plan.color}, 0 8px 40px rgba(15,23,42,0.12)`
                    : "0 2px 24px rgba(15,23,42,0.08)",
                }}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div
                    className="absolute top-0 right-0 text-xs font-bold px-4 py-1.5 rounded-bl-xl"
                    style={{
                      background: plan.color,
                      color: "#0F172A",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Card header */}
                <div
                  className="p-8 pb-6"
                  style={{ borderBottom: "1px solid rgba(15,23,42,0.06)" }}
                >
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                    style={{ background: `${plan.color}15`, color: plan.color }}
                  >
                    {plan.icon}
                  </div>
                  <h2
                    className="text-2xl font-bold mb-1"
                    style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {plan.name}
                  </h2>
                  <p
                    className="text-sm mb-6"
                    style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
                  >
                    {plan.tagline}
                  </p>
                  <div className="flex items-end gap-1">
                    <span
                      className="text-5xl font-bold"
                      style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className="text-base mb-2"
                      style={{ color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}
                    >
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="p-8 pt-6 flex-1">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <CheckCircle
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: plan.color }}
                        />
                        <span style={{ color: "#334155" }}>{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature, i) => (
                      <li key={`no-${i}`} className="flex items-start gap-3 text-sm opacity-40" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-center text-xs leading-4" style={{ color: "#94A3B8" }}>—</span>
                        <span style={{ color: "#94A3B8", textDecoration: "line-through" }}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleCheckout(plan)}
                    disabled={loading !== null}
                    className="w-full py-4 font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-all duration-150"
                    style={{
                      background: loading === plan.id ? "rgba(15,23,42,0.1)" : plan.color,
                      color: loading === plan.id ? "#94A3B8" : plan.id === "homeowner" ? "#0F172A" : "#0F172A",
                      fontFamily: "'Space Grotesk', sans-serif",
                      boxShadow: loading !== plan.id ? `0 0 24px ${plan.color}40` : "none",
                    }}
                  >
                    {loading === plan.id ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Redirecting to Stripe…
                      </>
                    ) : (
                      <>
                        Get Started — {plan.price}/mo
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                  <p
                    className="text-center text-xs mt-3"
                    style={{ color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}
                  >
                    Secure checkout · Cancel anytime
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ strip */}
          <div className="max-w-4xl mx-auto mt-12 grid sm:grid-cols-3 gap-6">
            {[
              { q: "Can I switch plans?", a: "Yes — upgrade or downgrade at any time from your account settings. Changes take effect on your next billing date." },
              { q: "Is there a free trial?", a: "Your first quote analysis is always free with no account required. Paid plans unlock unlimited analyses and full report history." },
              { q: "What payment methods are accepted?", a: "All major credit and debit cards via Stripe. Apple Pay and Google Pay are also supported at checkout." },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-xl"
                style={{ background: "white", boxShadow: "0 2px 16px rgba(15,23,42,0.06)" }}
              >
                <p
                  className="font-semibold text-sm mb-2"
                  style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {item.q}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>

          {/* Stripe trust note */}
          <p
            className="text-center text-xs mt-10"
            style={{ color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}
          >
            Payments are processed securely by{" "}
            <a
              href="https://stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600 transition-colors"
            >
              Stripe
            </a>
            . TradeTrust AZ does not store your payment information.
          </p>
        </div>
      </section>
    </div>
  );
}
