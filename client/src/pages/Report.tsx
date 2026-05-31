/**
 * Report — TradeTrust AZ
 * Full report view: gauge, market comparison, key findings, negotiation script, methodology accordion
 * Design: Light background, navy/teal/orange accents, printable layout
 */
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import {
  Shield, ArrowLeft, Download, Share2, AlertTriangle, CheckCircle,
  TrendingDown, ChevronDown, ChevronUp, Copy, Check, Clock, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustScoreGauge } from "@/components/TrustScoreGauge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { toast } from "sonner";

const REPORT_DATA: Record<string, {
  title: string;
  contractor: string;
  city: string;
  date: string;
  score: number;
  quoteAmount: number;
  fairLow: number;
  fairHigh: number;
  jobType: string;
  findings: { type: "red" | "green"; text: string }[];
  negotiation: string;
  lineItems: { label: string; yours: number; fairLow: number; fairHigh: number }[];
  methodology: string;
}> = {
  "hvac-phoenix-1": {
    title: "HVAC System Replacement",
    contractor: "Desert Air Solutions LLC",
    city: "Phoenix",
    date: "May 21, 2025",
    score: 34,
    quoteAmount: 19800,
    fairLow: 6200,
    fairHigh: 8500,
    jobType: "HVAC",
    findings: [
      { type: "red", text: "High Variance Index: Total Baseline Deviation of 133–219% above the Phoenix metro regional baseline for comparable HVAC replacement." },
      { type: "red", text: "Unit age (9 years) is below the average replacement threshold of 15–20 years. A repair assessment is recommended before committing to replacement." },
      { type: "red", text: "Regional Labor Rate Premium: Labor component reflects a 3× deviation above the Phoenix metro average for this job type." },
      { type: "red", text: "Material Component Baseline Deviation: Equipment markup exceeds the industry-standard range (15–20%) by approximately 85%." },
      { type: "red", text: "Multiple operating names detected in the Phoenix area — verify current licensing status with the Arizona Registrar of Contractors." },
      { type: "green", text: "Scope of work is described clearly and completely." },
      { type: "green", text: "Warranty terms are within the standard industry range (10 years parts, 1 year labor)." },
    ],
    negotiation: "\"I've reviewed this quote against regional market data. The standard range for this HVAC replacement in the Phoenix area is $6,200–$8,500. I'd like to move forward with you, but I need a revised quote that aligns with that range. I'd also like to discuss a repair assessment first, given the unit is only 9 years old.\"",
    lineItems: [
      { label: "Equipment", yours: 12000, fairLow: 3500, fairHigh: 4800 },
      { label: "Labor", yours: 4200, fairLow: 1200, fairHigh: 1800 },
      { label: "Materials", yours: 2400, fairLow: 800, fairHigh: 1200 },
      { label: "Permit & Misc", yours: 1200, fairLow: 700, fairHigh: 700 },
    ],
    methodology: "The Trust Score combines six weighted factors: Pricing Fairness (40%), Review Language Patterns (20%), Court/BBB/Legal History (15%), Company Longevity (15%), Complaint Response Rate (10%), and Hidden Ownership Signals (qualitative). Pricing data is sourced from public permit records, contractor databases, and aggregated quote data from Arizona homeowners. All data is for informational purposes only.",
  },
  "water-heater-tucson-1": {
    title: "Water Heater Replacement",
    contractor: "AZ Plumbing & Drain",
    city: "Tucson",
    date: "May 18, 2025",
    score: 28,
    quoteAmount: 4200,
    fairLow: 1500,
    fairHigh: 2100,
    jobType: "Water Heater",
    findings: [
      { type: "red", text: "High Variance Index: Total Baseline Deviation of 100–180% above the Tucson regional baseline for water heater replacement." },
      { type: "red", text: "Conditional Diagnostic Premium detected: urgency language ('must replace today') is a conditional service pressure indicator. An independent assessment is recommended before committing." },
      { type: "red", text: "Material Component Baseline Deviation: Parts pricing reflects approximately 4× the documented wholesale cost baseline." },
      { type: "green", text: "Installation scope aligns with standard regional operational parameters for this job type." },
    ],
    negotiation: "\"I've reviewed this quote against regional market data. The standard range for water heater replacement in Tucson is $1,500–$2,100. I'd like to move forward with you, but I need a revised quote that aligns with that range. I'd also like an independent assessment before deciding between repair and replacement.\"",
    lineItems: [
      { label: "Unit/Equipment", yours: 2800, fairLow: 800, fairHigh: 1200 },
      { label: "Labor", yours: 900, fairLow: 450, fairHigh: 600 },
      { label: "Materials", yours: 350, fairLow: 150, fairHigh: 200 },
      { label: "Misc", yours: 150, fairLow: 100, fairHigh: 100 },
    ],
    methodology: "The Trust Score combines six weighted factors: Pricing Fairness (40%), Review Language Patterns (20%), Court/BBB/Legal History (15%), Company Longevity (15%), Complaint Response Rate (10%), and Hidden Ownership Signals (qualitative). Pricing data is sourced from public permit records, contractor databases, and aggregated quote data from Arizona homeowners. All data is for informational purposes only.",
  },
  "electrical-phoenix-1": {
    title: "Electrical Panel Upgrade",
    contractor: "Sunbelt Electric Co.",
    city: "Scottsdale",
    date: "May 10, 2025",
    score: 78,
    quoteAmount: 3200,
    fairLow: 2800,
    fairHigh: 3800,
    jobType: "Electrical",
    findings: [
      { type: "green", text: "Quote falls within the fair market range for Scottsdale." },
      { type: "green", text: "Labor rate is consistent with licensed electricians in the area." },
      { type: "green", text: "Permit fees are included — a positive sign of transparency." },
      { type: "green", text: "Company has operated under the same name for 11 years with no significant complaints." },
      { type: "red", text: "No itemized breakdown provided — request one before signing." },
    ],
    negotiation: "\"This quote looks reasonable based on my research. Before I sign, could you provide an itemized breakdown of parts and labor? That way we're both on the same page. When can you start?\"",
    lineItems: [
      { label: "Panel & Equipment", yours: 1600, fairLow: 1400, fairHigh: 1900 },
      { label: "Labor", yours: 1000, fairLow: 900, fairHigh: 1200 },
      { label: "Permits", yours: 350, fairLow: 300, fairHigh: 400 },
      { label: "Materials", yours: 250, fairLow: 200, fairHigh: 300 },
    ],
    methodology: "The Trust Score combines six weighted factors: Pricing Fairness (40%), Review Language Patterns (20%), Court/BBB/Legal History (15%), Company Longevity (15%), Complaint Response Rate (10%), and Hidden Ownership Signals (qualitative). Pricing data is sourced from public permit records, contractor databases, and aggregated quote data from Arizona homeowners. All data is for informational purposes only.",
  },
  "roofing-mesa-1": {
    title: "Roof Replacement",
    contractor: "Mesa Roofing Pros",
    city: "Mesa",
    date: "April 30, 2025",
    score: 45,
    quoteAmount: 14500,
    fairLow: 9000,
    fairHigh: 13000,
    jobType: "Roofing",
    findings: [
      { type: "red", text: "Moderate-to-High Variance: Total Baseline Deviation of 12–61% above the Mesa regional baseline for comparable roof replacement." },
      { type: "red", text: "Regional Labor Rate Premium: Tear-off labor component exceeds the Mesa metro regional average for this job scope." },
      { type: "green", text: "Material grade specified is appropriate for Arizona climate conditions." },
      { type: "green", text: "Warranty terms are within the competitive range for this job type (5 years workmanship)." },
      { type: "green", text: "Company record shows no significant complaint history." },
    ],
    negotiation: "\"I've reviewed this quote against regional market data. The standard range for this roof replacement in Mesa is $9,000–$13,000. I'd like to work with you — can you revise the labor component to align with that range? I'm ready to move forward once the quote reflects market benchmarks.\"",
    lineItems: [
      { label: "Materials", yours: 7200, fairLow: 4500, fairHigh: 6500 },
      { label: "Labor & Tear-off", yours: 5800, fairLow: 3200, fairHigh: 4800 },
      { label: "Permits", yours: 800, fairLow: 600, fairHigh: 800 },
      { label: "Misc", yours: 700, fairLow: 700, fairHigh: 900 },
    ],
    methodology: "The Trust Score combines six weighted factors: Pricing Fairness (40%), Review Language Patterns (20%), Court/BBB/Legal History (15%), Company Longevity (15%), Complaint Response Rate (10%), and Hidden Ownership Signals (qualitative). Pricing data is sourced from public permit records, contractor databases, and aggregated quote data from Arizona homeowners. All data is for informational purposes only.",
  },
};

const DEFAULT_REPORT = REPORT_DATA["hvac-phoenix-1"];

function fmt(n: number) {
  return "$" + n.toLocaleString();
}

export default function Report() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [methodOpen, setMethodOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const report = REPORT_DATA[params.id] || DEFAULT_REPORT;

  const overcharge = report.quoteAmount - report.fairHigh;
  const overchargePercent = Math.round(((report.quoteAmount - report.fairHigh) / report.fairHigh) * 100);

  const chartData = report.lineItems.map((item) => ({
    name: item.label,
    yours: item.yours,
    fairMid: Math.round((item.fairLow + item.fairHigh) / 2),
  }));

  const handleCopy = () => {
    navigator.clipboard.writeText(report.negotiation).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-40 border-b"
        style={{ background: "rgba(248,250,252,0.95)", backdropFilter: "blur(12px)", borderColor: "rgba(15,23,42,0.08)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#0F172A")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#64748B")}
          >
            <ArrowLeft className="w-4 h-4" />
            My Reports
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info("Download coming soon — full PDF report")}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(15,23,42,0.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={() => toast.info("Sharing coming soon")}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(15,23,42,0.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded"
              style={{ background: "rgba(20,184,166,0.1)", color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {report.jobType}
            </span>
            <span className="text-xs" style={{ color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}>
              <Clock className="inline w-3.5 h-3.5 mr-1" />{report.date}
            </span>
            <span className="text-xs" style={{ color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}>
              <MapPin className="inline w-3.5 h-3.5 mr-1" />{report.city}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
            {report.title}
          </h1>
          <p className="text-base" style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}>
            {report.contractor} · <span className="text-xs italic">This report is private to you.</span>
          </p>
        </div>

        {/* Score + summary card */}
        <div
          className="rounded-2xl p-8 mb-8 flex flex-col sm:flex-row items-center gap-8"
          style={{ background: "#0F172A" }}
        >
          <TrustScoreGauge score={report.score} size={180} dark animated />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}>
              Trust Score Summary
            </p>
            <div className="flex flex-wrap gap-6 mb-4 justify-center sm:justify-start">
              <div>
                <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Your Quote</p>
                <p className="text-2xl font-bold font-mono" style={{ color: "#F97316", fontFamily: "'JetBrains Mono', monospace" }}>
                  {fmt(report.quoteAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Fair Market Range</p>
                <p className="text-2xl font-bold font-mono" style={{ color: "#14B8A6", fontFamily: "'JetBrains Mono', monospace" }}>
                  {fmt(report.fairLow)} – {fmt(report.fairHigh)}
                </p>
              </div>
            </div>
            {overcharge > 0 ? (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <TrendingDown className="w-4 h-4" />
                Baseline deviation detected. Potential adjustment range: up to {fmt(overcharge)} ({overchargePercent}% above regional baseline).
              </div>
            ) : (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <CheckCircle className="w-4 h-4" />
                Pricing aligns with standard regional operational margins.
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Market comparison chart */}
          <div
            className="p-6 rounded-2xl"
            style={{ background: "white", boxShadow: "0 2px 24px rgba(15,23,42,0.07)" }}
          >
            <h2 className="font-bold text-lg mb-1" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
              Market Comparison
            </h2>
            <p className="text-xs mb-5" style={{ color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}>
              Your quote vs. fair market midpoint by line item
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "'Inter', sans-serif" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "'Inter', sans-serif" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    fmt(value),
                    name === "yours" ? "Your Quote" : "Fair Market",
                  ]}
                  contentStyle={{
                    background: "#0F172A",
                    border: "none",
                    borderRadius: 8,
                    color: "white",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="yours" name="yours" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="#F97316" />
                  ))}
                </Bar>
                <Bar dataKey="fairMid" name="fair" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="#14B8A6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#F97316" }} />Your Quote</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#14B8A6" }} />Fair Market</span>
            </div>
          </div>

          {/* Key findings */}
          <div
            className="p-6 rounded-2xl"
            style={{ background: "white", boxShadow: "0 2px 24px rgba(15,23,42,0.07)" }}
          >
            <h2 className="font-bold text-lg mb-5" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
              Key Findings
            </h2>
            <div className="space-y-3">
              {report.findings.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-0.5">
                    {f.type === "red"
                      ? <AlertTriangle className="w-4 h-4" style={{ color: "#F97316" }} />
                      : <CheckCircle className="w-4 h-4" style={{ color: "#14B8A6" }} />
                    }
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: f.type === "red" ? "#334155" : "#64748B",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: f.type === "red" ? 500 : 400,
                    }}
                  >
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Negotiation script */}
        <div
          className="p-6 rounded-2xl mb-8"
          style={{
            background: "white",
            boxShadow: "0 2px 24px rgba(15,23,42,0.07)",
            borderLeft: "4px solid #14B8A6",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
              What to say next
            </h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold transition-all"
              style={{
                background: copied ? "rgba(20,184,166,0.15)" : "rgba(20,184,166,0.08)",
                color: "#14B8A6",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Script"}
            </button>
          </div>
          <p
            className="text-base italic leading-relaxed"
            style={{ color: "#334155", fontFamily: "'Inter', sans-serif", lineHeight: 1.8 }}
          >
            {report.negotiation}
          </p>
        </div>

        {/* How we calculate this */}
        <div
          className="rounded-2xl overflow-hidden mb-8"
          style={{ background: "white", boxShadow: "0 2px 24px rgba(15,23,42,0.07)" }}
        >
          <button
            onClick={() => setMethodOpen(!methodOpen)}
            className="w-full flex items-center justify-between p-6 text-left transition-colors"
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(15,23,42,0.02)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <span className="font-semibold" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
              How we calculate this score
            </span>
            {methodOpen ? <ChevronUp className="w-5 h-5" style={{ color: "#94A3B8" }} /> : <ChevronDown className="w-5 h-5" style={{ color: "#94A3B8" }} />}
          </button>
          {methodOpen && (
            <div className="px-6 pb-6 border-t" style={{ borderColor: "rgba(15,23,42,0.06)" }}>
              <p
                className="text-sm leading-relaxed mt-4"
                style={{ color: "#475569", fontFamily: "'Inter', sans-serif", lineHeight: 1.8 }}
              >
                {report.methodology}
              </p>
            </div>
          )}
        </div>

        {/* Demo Banner */}
        <div
          className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm font-bold text-center"
          style={{ background: "#FEF08A", color: "#713F12", fontFamily: "'Space Grotesk', sans-serif", border: "2px solid #EAB308" }}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#CA8A04" }} />
          DEMO DATA – NOT A REAL CONTRACTOR RECORD
          <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#CA8A04" }} />
        </div>

      {/* Disclaimer */}
        <div
          className="p-5 rounded-xl text-xs leading-relaxed space-y-3 mb-4"
          style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", fontFamily: "'Inter', sans-serif", color: "#64748B" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}>Legal Disclaimer</p>
          <p>This platform provides automated price-validation analysis based on regional market averages, historical data baselines, and standard trade pricing structures. The reports, scores, and data visualizations generated by this tool are intended solely for informational, educational, and consumer advocacy purposes. They do not constitute formal legal advice, contract audits, or definitive regulatory findings.</p>
          <p>The variances identified herein represent deviations from statistical pricing norms and should not be interpreted as definitive evidence of fraud, intentional overcharging, or unlawful business practices by any listed contractor or technician. Users are encouraged to verify all line items, labor rates, and material costs directly with their service providers.</p>
          <p>TradeTrust AZ does not guarantee the absolute accuracy of third-party invoice data extraction and assumes no liability for actions taken, or agreements entered into, based on the outputs of this software. Local market conditions, emergency service premiums, and specialized project complexities may justify pricing variations that fall outside standard baseline models.</p>
          <p>By utilizing this platform, you acknowledge that this analysis is an algorithmic tool designed to assist consumers in negotiating fair market rates and understanding trade billing transparently. For formal disputes or binding legal assessments, users should consult with qualified legal counsel or licensed construction professionals in their respective jurisdictions.</p>
        </div>
      </div>
    </div>
  );
}
