/**
 * Pricing — TradeTrust AZ
 * Design: Precision Trust — deep navy/teal/orange, asymmetric layout
 *
 * Four tiers:
 *  1. Single Consumer Audit   — $49.99 / one-time
 *  2. Investor Bundle         — $140.00 / 3-audit pack
 *  3. Enterprise Portfolio    — $199–$299 / month
 *  4. Contractor Membership   — $149.00 / month (merit-based, no paid rankings)
 *
 * Stripe Checkout redirect via @stripe/stripe-js (publishable key only)
 * Price IDs must be set via VITE_STRIPE_*_PRICE_ID environment variables.
 */
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Home,
  TrendingUp,
  Building2,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Star,
  Lock,
  Zap,
  AlertCircle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";

// ─── Stripe config ────────────────────────────────────────────────────────────
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

// TODO: Add these Price IDs in Settings → Secrets after creating products in Stripe Dashboard
const PRICE_IDS: Record<string, string> = {
  consumer: import.meta.env.VITE_STRIPE_CONSUMER_PRICE_ID as string || "",
  investor: import.meta.env.VITE_STRIPE_INVESTOR_PRICE_ID as string || "",
  enterprise: import.meta.env.VITE_STRIPE_ENTERPRISE_PRICE_ID as string || "",
  contractor: import.meta.env.VITE_STRIPE_CONTRACTOR_PRICE_ID as string || "",
};

// ─── Plan definitions ─────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "consumer",
    mode: "payment" as const,
    name: "Single Consumer Audit",
    price: "$49.99",
    period: "per review",
    priceSub: "One-time payment — no subscription",
    tagline: "For homeowners who want an instant, independent pricing triage on a single estimate or invoice.",
    color: "#14B8A6",
    accentBg: "rgba(20,184,166,0.08)",
    icon: <Home className="w-6 h-6" />,
    badge: null,
    target: "Homeowners · Single Properties",
    features: [
      "Upload one estimate or invoice",
      "Instant AI-powered Trust Score",
      "Line-by-line market price comparison",
      "Negotiation script tailored to your job",
      "PDF report download",
      "Covers all 6 trade categories",
      "Results in under 60 seconds",
    ],
    note: null,
  },
  {
    id: "investor",
    mode: "payment" as const,
    name: "Investor Bundle",
    price: "$140.00",
    period: "3-audit pack",
    priceSub: "~$46.67 per audit — save 7%",
    tagline: "For real estate investors and flippers auditing multiple residential bids across active projects.",
    color: "#F97316",
    accentBg: "rgba(249,115,22,0.08)",
    icon: <TrendingUp className="w-6 h-6" />,
    badge: "Best Value",
    target: "Real Estate Investors · Flippers",
    features: [
      "3 prepaid audit credits",
      "Credits never expire",
      "All Single Audit features included",
      "Side-by-side multi-bid comparison",
      "Contractor track record summary",
      "Priority processing queue",
      "Email support",
    ],
    note: null,
  },
  {
    id: "enterprise",
    mode: "subscription" as const,
    name: "Enterprise Portfolio",
    price: "$199–$299",
    period: "/ month",
    priceSub: "Volume pricing — contact us for custom tiers",
    tagline: "For property managers and commercial portfolios requiring continuous, high-volume maintenance auditing.",
    color: "#6366F1",
    accentBg: "rgba(99,102,241,0.08)",
    icon: <Building2 className="w-6 h-6" />,
    badge: null,
    target: "Property Managers · Commercial Portfolios",
    features: [
      "Unlimited monthly audits",
      "Multi-property portfolio dashboard",
      "Contractor performance history",
      "Bulk CSV invoice upload",
      "Custom reporting & exports",
      "API access (coming soon)",
      "Dedicated account manager",
      "Phone + email support",
      "Team seats included",
    ],
    note: null,
  },
  {
    id: "contractor",
    mode: "subscription" as const,
    name: "Contractor Membership",
    price: "$149.00",
    period: "/ month",
    priceSub: "Merit-based — badge earned, not bought",
    tagline: "For licensed Arizona contractors who want to prove their pricing is fair and win more bids on transparency.",
    color: "#EAB308",
    accentBg: "rgba(234,179,8,0.08)",
    icon: <ShieldCheck className="w-6 h-6" />,
    badge: "Merit-Based",
    target: "Plumbing · HVAC · Electrical · Roofing · More",
    features: [
      "TradeTrust Verified badge on your profile",
      "Priority listing in contractor directory",
      "Lead generation from homeowner searches",
      "Business analytics dashboard",
      "Dispute & respond to Trust Score findings",
      "Dedicated account manager",
      "Phone + email support",
      "Unlimited team seats",
    ],
    note: {
      icon: <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />,
      color: "#EAB308",
      text: "Contractors do not buy a ranking. To earn and maintain the \"TradeTrust Verified\" badge, members must upload their final itemized invoices so the system can verify that their pricing matches market honesty. The badge proves data transparency — not a paid endorsement.",
    },
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: typeof PLANS[0]) => {
    if (!STRIPE_KEY) {
      toast.error("Stripe is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY to your environment.");
      return;
    }
    const priceId = PRICE_IDS[plan.id];
    if (!priceId) {
      toast.error(
        `Price ID not set for "${plan.name}". Add VITE_STRIPE_${plan.id.toUpperCase()}_PRICE_ID in Settings → Secrets.`,
        { duration: 7000 }
      );
      return;
    }

    setLoading(plan.id);
    try {
      const stripe = await loadStripe(STRIPE_KEY);
      if (!stripe) throw new Error("Stripe failed to load");

      // Create session on server to support webhook fulfillment with metadata
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          planId: plan.id,
          mode: plan.mode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { id: sessionId } = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result?.error) throw result.error;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Checkout failed. Please try again.");
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
            Transparent Pricing · No Hidden Fees
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            The right plan for every
            <br />
            <span style={{ color: "#14B8A6" }}>level of protection.</span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Inter', sans-serif" }}
          >
            From a single homeowner checking one quote to enterprise property managers auditing
            hundreds of jobs — TradeTrust AZ scales with your needs.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {[
              { icon: <Lock className="w-4 h-4" />, text: "256-bit SSL · Powered by Stripe" },
              { icon: <Zap className="w-4 h-4" />, text: "Instant access after payment" },
              { icon: <Star className="w-4 h-4" />, text: "Cancel subscriptions anytime" },
              { icon: <Package className="w-4 h-4" />, text: "Credits never expire" },
            ].map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm"
                style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif" }}
              >
                <span style={{ color: "#14B8A6" }}>{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING GRID ──────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="relative rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "white",
                  boxShadow: plan.badge
                    ? `0 0 0 2px ${plan.color}, 0 8px 40px rgba(15,23,42,0.10)`
                    : "0 2px 20px rgba(15,23,42,0.07)",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className="absolute top-0 right-0 text-xs font-bold px-3 py-1.5 rounded-bl-xl"
                    style={{
                      background: plan.color,
                      color: "#0F172A",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Header */}
                <div className="p-6 pb-5" style={{ borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                  {/* Icon + target */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="inline-flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
                      style={{ background: plan.accentBg, color: plan.color }}
                    >
                      {plan.icon}
                    </div>
                    <span
                      className="text-xs font-semibold leading-tight"
                      style={{ color: plan.color, fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {plan.target}
                    </span>
                  </div>

                  <h2
                    className="text-xl font-bold mb-1"
                    style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {plan.name}
                  </h2>
                  <p
                    className="text-xs leading-relaxed mb-5"
                    style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
                  >
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="flex items-end gap-1 mb-1">
                    <span
                      className="text-4xl font-bold leading-none"
                      style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className="text-sm mb-0.5"
                      style={{ color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: plan.color, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    {plan.priceSub}
                  </p>
                </div>

                {/* Features */}
                <div className="p-6 pt-5 flex-1 flex flex-col">
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                        <span style={{ color: "#334155" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Contractor merit note */}
                  {plan.note && (
                    <div
                      className="rounded-xl p-3 mb-5 flex gap-2.5 text-xs leading-relaxed"
                      style={{
                        background: `${plan.color}12`,
                        color: "#334155",
                        fontFamily: "'Inter', sans-serif",
                        border: `1px solid ${plan.color}30`,
                      }}
                    >
                      <span style={{ color: plan.note.color }}>{plan.note.icon}</span>
                      <span>{plan.note.text}</span>
                    </div>
                  )}

                  <Button
                    onClick={() => handleCheckout(plan)}
                    disabled={loading !== null}
                    className="w-full py-3.5 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.97]"
                    style={{
                      background: loading === plan.id ? "rgba(15,23,42,0.06)" : plan.color,
                      color: loading === plan.id ? "#94A3B8" : "#0F172A",
                      fontFamily: "'Space Grotesk', sans-serif",
                      boxShadow: loading !== plan.id ? `0 0 20px ${plan.color}35` : "none",
                    }}
                  >
                    {loading === plan.id ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Redirecting…
                      </>
                    ) : (
                      <>
                        {plan.mode === "payment" ? "Buy Now" : "Get Started"}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                  <p
                    className="text-center text-xs mt-2.5"
                    style={{ color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}
                  >
                    {plan.mode === "payment" ? "Secure one-time payment · Instant access" : "Secure checkout · Cancel anytime"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison note */}
          <div
            className="max-w-3xl mx-auto mt-12 rounded-2xl p-6 text-center"
            style={{ background: "#0F172A" }}
          >
            <p
              className="text-sm font-semibold mb-1 text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Not sure which plan is right for you?
            </p>
            <p
              className="text-sm mb-4"
              style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Inter', sans-serif" }}
            >
              Start with a Single Consumer Audit — no account required. Upgrade anytime as your needs grow.
            </p>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-semibold text-sm px-6 py-2.5 rounded-lg"
              style={{ background: "#14B8A6", color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Start with a Free Demo
            </Button>
          </div>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto mt-10 grid sm:grid-cols-3 gap-5">
            {[
              {
                q: "Do audit credits expire?",
                a: "No. Investor Bundle credits never expire — use them at your own pace across any active project.",
              },
              {
                q: "How does the Contractor badge work?",
                a: "Contractors earn the TradeTrust Verified badge by uploading real invoices. The system verifies their pricing matches market norms. It cannot be purchased — only earned.",
              },
              {
                q: "Can I upgrade or downgrade?",
                a: "Yes. Subscription plans can be changed at any time from your account settings. Changes take effect on your next billing date.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-xl"
                style={{ background: "white", boxShadow: "0 2px 14px rgba(15,23,42,0.06)" }}
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
            Payments processed securely by{" "}
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
