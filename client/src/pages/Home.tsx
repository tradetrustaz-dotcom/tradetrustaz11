/**
 * Home — TradeTrust AZ Landing Page
 * Design: Precision Trust — asymmetric layout, deep navy hero, teal/orange signals
 * Sections: Nav, Hero, TrustBar, HowItWorks, TrustScore, Vignettes, WhyDifferent, Privacy, FinalCTA, Footer
 */
import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "wouter";
import {
  Upload, CheckCircle, AlertTriangle, Shield, Lock, Trash2,
  TrendingDown, BarChart2, FileText, Star, ArrowRight, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { DemoModal } from "@/components/DemoModal";
import { TrustScoreGauge } from "@/components/TrustScoreGauge";

// ─── Intersection observer hook for fade-up animations ───────────────────────
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Score factor data ────────────────────────────────────────────────────────
const SCORE_FACTORS = [
  { label: "Pricing Fairness", weight: 40, desc: "Line-by-line comparison to current AZ market rates", color: "#14B8A6" },
  { label: "Review Language Patterns", weight: 20, desc: "Specific phrases customers use when they identify billing variances", color: "#14B8A6" },
  { label: "Court, BBB & Legal History", weight: 15, desc: "Public records of complaints and legal actions", color: "#14B8A6" },
  { label: "Company Longevity & Stability", weight: 15, desc: "How long the business has operated and under what names", color: "#14B8A6" },
  { label: "Response Rate to Complaints", weight: 10, desc: "How the contractor handles disputes and negative feedback", color: "#14B8A6" },
];

// ─── Vignette stories ─────────────────────────────────────────────────────────
const VIGNETTES = [
  {
    score: 34,
    quote: "$19,800",
    fair: "~$6,500",
    city: "Phoenix",
    job: "HVAC Replacement",
    story: "Got a $19,800 HVAC quote. Uploaded it. Saw the system was only 9 years old and fair market was ~$6,500.",
    outcome: "Smiled, closed the laptop, said \"Nope.\"",
    color: "#F97316",
  },
  {
    score: 28,
    quote: "$4,200",
    fair: "$1,800",
    city: "Tucson",
    job: "Water Heater",
    story: "Contractor said the water heater needed immediate replacement. Uploaded the quote. Saw average price was $1,800, not $4,200 — a significant billing variance.",
    outcome: "Laughed and said \"Nice try.\"",
    color: "#F97316",
  },
  {
    score: 31,
    quote: "Double market rate",
    fair: "Market rate",
    city: "Mesa",
    job: "Home Repair",
    story: "Contractor at the door presented a proposal. Wife snapped a photo, uploaded on her phone, showed her husband: \"This quote shows a significant deviation from market rate.\"",
    outcome: "They both shook their heads and walked away.",
    color: "#F97316",
  },
];

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [, navigate] = useLocation();

  const hero = useFadeIn(0.05);
  const howItWorks = useFadeIn(0.1);
  const trustScore = useFadeIn(0.1);
  const vignettes = useFadeIn(0.1);
  const whyDiff = useFadeIn(0.1);
  const privacy = useFadeIn(0.1);
  const finalCta = useFadeIn(0.1);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <Navbar />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: "#0F172A",
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663581162793/5xm5cEdoVRCD4pohCRBt2H/hero-bg-WLSCJsWJduWEZ7fTENXamU.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.75) 60%, rgba(15,23,42,0.5) 100%)" }} />

        <div className="container relative z-10 pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div
              ref={hero.ref}
              style={{
                opacity: hero.visible ? 1 : 0,
                transform: hero.visible ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)",
              }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ background: "rgba(20,184,166,0.15)", color: "#14B8A6", border: "1px solid rgba(20,184,166,0.3)", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                Built for Arizona Homeowners
              </div>

              <h1
                className="text-white font-bold leading-tight mb-6"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                Upload Your Contractor Quote.{" "}
                <span style={{ color: "#14B8A6" }}>Get the Real Truth</span>{" "}
                in 30 Seconds.
              </h1>

              <p
                className="text-lg mb-8 leading-relaxed"
                style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Inter', sans-serif", maxWidth: 520 }}
              >
                AI that actually reads the numbers on the page — not just reviews. See how your quote compares to regional market averages before you sign anything.
              </p>

              <div id="hero-cta" className="flex flex-col sm:flex-row gap-3 mb-10">
                <Button
                  onClick={() => setDemoOpen(true)}
                  className="font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all duration-150"
                  style={{
                    background: "#14B8A6",
                    color: "#0F172A",
                    fontFamily: "'Space Grotesk', sans-serif",
                    boxShadow: "0 0 32px rgba(20,184,166,0.3)",
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Quote & See Your Score — Free
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDemoOpen(true)}
                  className="font-semibold text-base px-6 py-4 rounded-xl"
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.85)",
                    background: "rgba(255,255,255,0.05)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Watch 25-second example
                </Button>
              </div>

              {/* Trust bar */}
              <div className="flex flex-wrap gap-4 text-sm" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Inter', sans-serif" }}>
                <span className="flex items-center gap-1.5">
                  <span style={{ color: "#14B8A6" }}>✓</span>
                  12,847 quotes analyzed this month
                </span>
                <span className="flex items-center gap-1.5">
                  <span style={{ color: "#14B8A6" }}>✓</span>
                  94% of users saved money
                </span>
                <span className="flex items-center gap-1.5">
                  <span style={{ color: "#14B8A6" }}>✓</span>
                  100% private
                </span>
              </div>
            </div>

              {/* Right: homeowner photo + floating score card */}
            <div
              className="hidden lg:flex flex-col gap-4 items-end"
              style={{
                opacity: hero.visible ? 1 : 0,
                transform: hero.visible ? "translateY(0)" : "translateY(60px)",
                transition: "opacity 0.7s var(--ease-out) 0.2s, transform 0.7s var(--ease-out) 0.2s",
              }}
            >
              {/* Homeowner photo */}
              <div className="relative w-full max-w-sm">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663581162793/5xm5cEdoVRCD4pohCRBt2H/homeowner-relief-NdB2WAp3EKAraiMAkSqGma.webp"
                  alt="Arizona homeowner reviewing contractor quote"
                  className="w-full rounded-2xl object-cover"
                  style={{ height: 280, objectPosition: "center top", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}
                />
                {/* Overlay badge */}
                <div
                  className="absolute bottom-4 left-4 right-4 flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(15,23,42,0.88)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <TrustScoreGauge score={34} size={56} strokeWidth={5} dark animated showLabel={false} />
                  <div>
                    <p className="text-white text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>HVAC Quote · Phoenix</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>$19,800 quoted · ~$6,500 fair</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#F97316" }}>Score: 34/100 — Overpriced</p>
                  </div>
                </div>
              </div>

              {/* Stats strip */}
              <div
                className="w-full max-w-sm p-4 rounded-xl flex gap-4"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {[
                  { val: "34", label: "Trust Score", color: "#F97316" },
                  { val: "$13.3k", label: "Potential savings", color: "#14B8A6" },
                  { val: "30s", label: "Analysis time", color: "rgba(255,255,255,0.7)" },
                ].map((s) => (
                  <div key={s.label} className="flex-1 text-center">
                    <p className="font-bold font-mono text-lg" style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6" style={{ color: "rgba(255,255,255,0.3)" }} />
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24" style={{ background: "#F8FAFC" }}>
        <div className="container">
          <div
            ref={howItWorks.ref}
            style={{
              opacity: howItWorks.visible ? 1 : 0,
              transform: howItWorks.visible ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)",
            }}
          >
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}>
                Dead Simple
              </p>
              <h2 className="text-4xl font-bold mb-4" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
                Three steps. Thirty seconds.
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}>
                No account required for your first analysis. Just upload and go.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: <Upload className="w-7 h-7" style={{ color: "#14B8A6" }} />,
                  title: "Upload Your PDF",
                  desc: "Drag & drop or click to upload your contractor proposal or estimate.",
                  note: "We automatically remove your name, address, and phone number. Only pricing and scope stay.",
                },
                {
                  step: "02",
                  icon: <FileText className="w-7 h-7" style={{ color: "#14B8A6" }} />,
                  title: "Pick the Job Type",
                  desc: "HVAC, Plumbing, Water Heater, Roofing, Electrical — one tap.",
                  note: null,
                },
                {
                  step: "03",
                  icon: <BarChart2 className="w-7 h-7" style={{ color: "#14B8A6" }} />,
                  title: "Get Your Trust Score",
                  desc: "A clean 1–100 score with full pricing breakdown, red flags, and a negotiation script.",
                  note: null,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative p-8 rounded-2xl"
                  style={{
                    background: "white",
                    boxShadow: "0 2px 24px rgba(15,23,42,0.07)",
                    borderTop: "3px solid #14B8A6",
                    opacity: howItWorks.visible ? 1 : 0,
                    transform: howItWorks.visible ? "translateY(0)" : "translateY(40px)",
                    transition: `opacity 0.6s var(--ease-out) ${i * 100}ms, transform 0.6s var(--ease-out) ${i * 100}ms`,
                  }}
                >
                  <div
                    className="text-5xl font-bold mb-4 leading-none"
                    style={{ color: "rgba(20,184,166,0.15)", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {item.step}
                  </div>
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-base mb-3" style={{ color: "#475569", fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}>
                    {item.desc}
                  </p>
                  {item.note && (
                    <p className="text-xs p-3 rounded-lg" style={{ background: "rgba(20,184,166,0.08)", color: "#0D9488", fontFamily: "'Inter', sans-serif" }}>
                      🔒 {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST SCORE EXPLAINER ─────────────────────────────────────────────── */}
      <section id="trust-score" className="py-24" style={{ background: "#0F172A" }}>
        <div className="container">
          <div
            ref={trustScore.ref}
            style={{
              opacity: trustScore.visible ? 1 : 0,
              transform: trustScore.visible ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)",
            }}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: two gauges */}
              <div className="flex flex-col items-center gap-8">
                <div className="flex gap-8 flex-wrap justify-center">
                  <div className="text-center">
                    <TrustScoreGauge score={34} size={160} dark animated />
                    <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}>
                      Overpriced HVAC
                    </p>
                  </div>
                  <div className="text-center">
                    <TrustScoreGauge score={87} size={160} dark animated />
                    <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}>
                      Fair Plumbing Quote
                    </p>
                  </div>
                </div>
                <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}>
                  Color-coded: 0–40 orange · 41–70 yellow · 71–100 teal
                </p>
              </div>

              {/* Right: explanation */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}>
                  The Trust Score
                </p>
                <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  A real 1–100 score — not another star rating
                </h2>
                <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}>
                  We combine six factors. Pricing fairness carries the most weight because that's where most people get screwed.
                </p>

                <div className="space-y-4">
                  {SCORE_FACTORS.map((factor, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        opacity: trustScore.visible ? 1 : 0,
                        transform: trustScore.visible ? "translateX(0)" : "translateX(20px)",
                        transition: `opacity 0.5s var(--ease-out) ${i * 80}ms, transform 0.5s var(--ease-out) ${i * 80}ms`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {factor.label}
                        </span>
                        <span
                          className="text-sm font-bold font-mono"
                          style={{ color: "#14B8A6", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {factor.weight}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: trustScore.visible ? `${factor.weight * 2.5}%` : "0%",
                            background: "#14B8A6",
                            transition: `width 0.8s var(--ease-out) ${i * 80 + 200}ms`,
                          }}
                        />
                      </div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Inter', sans-serif" }}>
                        {factor.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-6 p-4 rounded-xl text-sm"
                  style={{
                    background: "rgba(20,184,166,0.08)",
                    border: "1px solid rgba(20,184,166,0.2)",
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.7,
                  }}
                >
                  <strong style={{ color: "#14B8A6" }}>This is different from every other contractor review site.</strong>{" "}
                  We read the actual estimate you uploaded — not just whether the contractor replied to a Yelp review.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIGNETTES ─────────────────────────────────────────────────────────── */}
      <section id="examples" className="py-24" style={{ background: "#F8FAFC" }}>
        <div className="container">
          <div
            ref={vignettes.ref}
            style={{
              opacity: vignettes.visible ? 1 : 0,
              transform: vignettes.visible ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)",
            }}
          >
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}>
                Real Stories
              </p>
              <h2 className="text-4xl font-bold mb-4" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
                Arizona homeowners who said "not today."
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {VIGNETTES.map((v, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "white",
                    boxShadow: "0 4px 32px rgba(15,23,42,0.08)",
                    opacity: vignettes.visible ? 1 : 0,
                    transform: vignettes.visible ? "translateY(0)" : "translateY(40px)",
                    transition: `opacity 0.6s var(--ease-out) ${i * 120}ms, transform 0.6s var(--ease-out) ${i * 120}ms`,
                  }}
                >
                  {/* Top bar */}
                  <div
                    className="px-6 py-4 flex items-center justify-between"
                    style={{ background: "#0F172A" }}
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}>
                        {v.city} · {v.job}
                      </p>
                    </div>
                    <TrustScoreGauge score={v.score} size={64} strokeWidth={6} animated dark showLabel={false} />
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <p className="text-base mb-4" style={{ color: "#334155", fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}>
                      {v.story}
                    </p>
                    <div
                      className="flex items-center gap-2 p-3 rounded-lg text-sm font-semibold"
                      style={{ background: "rgba(20,184,166,0.08)", color: "#0D9488", fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      {v.outcome}
                    </div>
                    <div className="flex justify-between mt-4 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <div>
                        <p style={{ color: "#94A3B8" }}>Their quote</p>
                        <p className="font-bold font-mono" style={{ color: "#F97316" }}>{v.quote}</p>
                      </div>
                      <div className="text-right">
                        <p style={{ color: "#94A3B8" }}>Fair market</p>
                        <p className="font-bold font-mono" style={{ color: "#14B8A6" }}>{v.fair}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY DIFFERENT ─────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "#0F172A" }}>
        <div className="container">
          <div
            ref={whyDiff.ref}
            style={{
              opacity: whyDiff.visible ? 1 : 0,
              transform: whyDiff.visible ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)",
            }}
          >
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}>
                Why TradeTrust AZ
              </p>
              <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Other sites look at stars. We read the actual numbers.
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <th className="pb-4 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.4)", width: "40%" }}>Feature</th>
                    <th className="pb-4 text-sm font-semibold text-center" style={{ color: "rgba(255,255,255,0.4)" }}>Other Review Sites</th>
                    <th className="pb-4 text-sm font-semibold text-center" style={{ color: "#14B8A6" }}>TradeTrust AZ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Reads your actual estimate", false, true],
                    ["Compares to real Arizona pricing data", false, true],
                    ["Line-by-line cost breakdown", false, true],
                    ["Detects patterns across related companies", false, true],
                    ["Gives you a clear number to negotiate with", false, true],
                    ["Star ratings & reviews", true, true],
                    ["BBB & complaint history", true, true],
                  ].map(([feature, others, us], i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <td className="py-4 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{feature as string}</td>
                      <td className="py-4 text-center">
                        {others
                          ? <CheckCircle className="w-5 h-5 mx-auto" style={{ color: "rgba(255,255,255,0.3)" }} />
                          : <span className="text-lg" style={{ color: "rgba(255,255,255,0.15)" }}>—</span>
                        }
                      </td>
                      <td className="py-4 text-center">
                        <CheckCircle className="w-5 h-5 mx-auto" style={{ color: "#14B8A6" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRIVACY ───────────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "#F8FAFC" }}>
        <div className="container">
          <div
            ref={privacy.ref}
            style={{
              opacity: privacy.visible ? 1 : 0,
              transform: privacy.visible ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)",
            }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                style={{ background: "rgba(20,184,166,0.1)" }}
              >
                <Shield className="w-8 h-8" style={{ color: "#14B8A6" }} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}>
                Privacy & Trust
              </p>
              <h2 className="text-4xl font-bold mb-4" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
                Your privacy is non-negotiable.
              </h2>
              <p className="text-lg mb-12" style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}>
                We built this for Arizona homeowners. We're not in the business of selling your data.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 text-left">
                {[
                  { icon: <Lock className="w-5 h-5" />, title: "Processed securely", desc: "PDFs are analyzed in an isolated environment and never stored permanently." },
                  { icon: <Shield className="w-5 h-5" />, title: "Personal info auto-stripped", desc: "Your name, address, and phone are removed before any analysis begins." },
                  { icon: <Star className="w-5 h-5" />, title: "We never sell your data", desc: "Full stop. Your quotes are yours. We make money on subscriptions, not data." },
                  { icon: <Trash2 className="w-5 h-5" />, title: "Delete everything instantly", desc: "One click removes all your reports and data from our system permanently." },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-5 rounded-xl"
                    style={{
                      background: "white",
                      boxShadow: "0 2px 16px rgba(15,23,42,0.06)",
                      borderLeft: "3px solid #14B8A6",
                      opacity: privacy.visible ? 1 : 0,
                      transform: privacy.visible ? "translateY(0)" : "translateY(20px)",
                      transition: `opacity 0.5s var(--ease-out) ${i * 80}ms, transform 0.5s var(--ease-out) ${i * 80}ms`,
                    }}
                  >
                    <div className="flex-shrink-0 mt-0.5" style={{ color: "#14B8A6" }}>{item.icon}</div>
                    <div>
                      <p className="font-semibold mb-1" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</p>
                      <p className="text-sm" style={{ color: "#64748B", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm" style={{ color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}>
                🌵 Built in Arizona for Arizona homeowners (for now)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663581162793/5xm5cEdoVRCD4pohCRBt2H/az-desert-accent-iaH9SR2hNGz9DrcUJJ7iqR.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(15,23,42,0.88)" }} />
        <div className="container relative z-10">
          <div
            ref={finalCta.ref}
            className="text-center max-w-2xl mx-auto"
            style={{
              opacity: finalCta.visible ? 1 : 0,
              transform: finalCta.visible ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)",
            }}
          >
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Ready to stop overpaying?
            </h2>
            <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Inter', sans-serif" }}>
              Upload your first quote free. No credit card. No account required for the first try.
            </p>
            <Button
              onClick={() => setDemoOpen(true)}
              className="font-bold text-lg px-10 py-5 rounded-xl shadow-lg"
              style={{
                background: "#14B8A6",
                color: "#0F172A",
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: "0 0 40px rgba(20,184,166,0.35)",
              }}
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Quote & See Your Score — Free
            </Button>
            <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif" }}>
              First analysis is free. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* ── LEGAL DISCLAIMER ─────────────────────────────────────────────────── */}
      <section className="py-12" style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div
            className="max-w-3xl mx-auto p-6 rounded-2xl text-sm leading-relaxed space-y-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.5)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}>Legal Disclaimer</p>
            <p>This platform provides automated price-validation analysis based on regional market averages, historical data baselines, and standard trade pricing structures. The reports, scores, and data visualizations generated by this tool are intended solely for informational, educational, and consumer advocacy purposes. They do not constitute formal legal advice, contract audits, or definitive regulatory findings.</p>
            <p>The variances identified herein represent deviations from statistical pricing norms and should not be interpreted as definitive evidence of fraud, intentional overcharging, or unlawful business practices by any listed contractor or technician. Users are encouraged to verify all line items, labor rates, and material costs directly with their service providers.</p>
            <p>TradeTrust AZ does not guarantee the absolute accuracy of third-party invoice data extraction and assumes no liability for actions taken, or agreements entered into, based on the outputs of this software. Local market conditions, emergency service premiums, and specialized project complexities may justify pricing variations that fall outside standard baseline models.</p>
            <p>By utilizing this platform, you acknowledge that this analysis is an algorithmic tool designed to assist consumers in negotiating fair market rates and understanding trade billing transparently. For formal disputes or binding legal assessments, users should consult with qualified legal counsel or licensed construction professionals in their respective jurisdictions.</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}

      <section className="py-20" style={{ background: "#0F172A" }}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Monetization Lanes</h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: "rgba(255,255,255,0.72)" }}>
              TradeTrust AZ supports homeowner reports, contractor verification workflows, institutional review access, and public benefit programs through neutral informational triage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-xl font-semibold text-white mb-3">B2C — Homeowner Reports</h3>
              <p style={{ color: "rgba(255,255,255,0.72)" }}>
                One-time Deep Variance Reports for homeowner estimate and invoice review. Includes informational triage, source comparison, variance analysis, and downloadable informational PDF.
              </p>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-xl font-semibold text-white mb-3">B2B — Contractor Verification</h3>
              <p style={{ color: "rgba(255,255,255,0.72)" }}>
                Monthly contractor subscription for self-audit tools, contractor profile review, record correction requests, and optional factual verification certificate.
              </p>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-xl font-semibold text-white mb-3">B2B Institutional / Enterprise Access</h3>
              <p style={{ color: "rgba(255,255,255,0.72)" }}>
                For insurance carriers, HOAs, property managers, lenders, warranty companies, and legal intake teams. Includes bulk review dashboard, monitoring, API access, team seats, volume pricing, contracts, and custom integrations.
              </p>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-xl font-semibold text-white mb-3">B2G / Public Benefit Programs</h3>
              <p style={{ color: "rgba(255,255,255,0.72)" }}>
                For city, county, state, nonprofit, and public-sector consumer protection programs. Includes grant-funded access, civic dashboards, procurement integrity screening, and public benefit reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12" style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" style={{ color: "#14B8A6" }} />
              <span className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                TradeTrust
                <span
                  className="ml-1 text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ background: "#14B8A6", color: "#0F172A" }}
                >
                  AZ
                </span>
              </span>
            </div>
            <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Inter', sans-serif", maxWidth: 480 }}>
              Data sourced from public records only and is for informational purposes only. TradeTrust AZ is not a licensed contractor referral service. Reports do not constitute legal advice. For Arizona homeowners only (for now).
            </p>
            <div className="flex gap-4 text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif" }}>
              <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/legal/tos" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contractor-apply" className="hover:text-white transition-colors">Contractors</Link>
              <a href="mailto:legal@tradetrustaz.com" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Inter', sans-serif" }}>
            © 2025 TradeTrust AZ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
