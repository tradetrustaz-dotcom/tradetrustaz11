/**
 * DemoModal — Interactive demo flow (no signup required)
 * Steps: Upload → Job Type → Processing → Sample Report
 * Design: Dark navy modal, teal accents, satisfying gauge animation
 */
import { useState, useEffect, useCallback } from "react";
import { X, Upload, FileText, CheckCircle, AlertTriangle, TrendingDown, Clock, Star, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustScoreGauge } from "./TrustScoreGauge";
import { ConsumerTriageChecklist, type TriageResponses } from "./ConsumerTriageChecklist";
import { useLocation } from "wouter";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = "upload" | "jobtype" | "processing" | "report";

const JOB_TYPES = [
  { id: "hvac", label: "HVAC", icon: "❄️" },
  { id: "plumbing", label: "Plumbing", icon: "🔧" },
  { id: "water-heater", label: "Water Heater", icon: "🌡️" },
  { id: "roofing", label: "Roofing", icon: "🏠" },
  { id: "electrical", label: "Electrical", icon: "⚡" },
  { id: "other", label: "Other", icon: "🔨" },
];

const PROCESSING_MESSAGES = [
  "Reading the fine print...",
  "Comparing to 2,847 similar Arizona jobs...",
  "Checking line-item pricing against local market...",
  "Scanning for ancillary cost variances...",
  "Calculating your Trust Score...",
];

const SAMPLE_REPORTS: Record<string, {
  score: number;
  quoteAmount: string;
  fairRange: string;
  savings: string;
  jobLabel: string;
  findings: { type: "red" | "green"; text: string }[];
  negotiation: string;
}> = {
  "hvac": {
    score: 34,
    quoteAmount: "$19,800",
    fairRange: "$6,200 – $8,500",
    savings: "Up to $13,600",
    jobLabel: "HVAC System Replacement",
    findings: [
      { type: "red", text: "High Variance Index: Baseline Deviation of 133–219% above the Phoenix metro regional baseline" },
      { type: "red", text: "Unit age (9 years) is below the average replacement threshold — a repair assessment is recommended" },
      { type: "red", text: "Regional Labor Rate Premium: Labor component is approximately 3× the Phoenix metro average" },
      { type: "red", text: "Material Component Baseline Deviation: Equipment markup exceeds industry-standard range by approximately 85%" },
      { type: "green", text: "Scope of work is described clearly and completely" },
      { type: "green", text: "Warranty terms are within the standard industry range" },
    ],
    negotiation: "\"I've reviewed this quote against regional market data. The standard range for this HVAC replacement in the Phoenix area is $6,200–$8,500. I'd like to move forward, but I need a revised quote that aligns with that range.\"",
  },
  "water-heater": {
    score: 28,
    quoteAmount: "$4,200",
    fairRange: "$1,500 – $2,100",
    savings: "Up to $2,700",
    jobLabel: "Water Heater Replacement",
    findings: [
      { type: "red", text: "High Variance Index: Baseline Deviation of 100–180% above the Tucson regional baseline" },
      { type: "red", text: "Conditional Diagnostic Premium detected: urgency language is a conditional service pressure indicator" },
      { type: "red", text: "Material Component Baseline Deviation: Parts pricing reflects approximately 4× the documented wholesale cost baseline" },
      { type: "green", text: "Installation scope aligns with standard regional operational parameters" },
    ],
    negotiation: "\"I've reviewed this quote against regional market data. The standard range for water heater replacement in Tucson is $1,500–$2,100. I'd like a revised quote that aligns with that range.\"",
  },
  "plumbing": {
    score: 62,
    quoteAmount: "$1,850",
    fairRange: "$1,400 – $2,200",
    savings: "Within Baseline",
    jobLabel: "Plumbing Repair",
    findings: [
      { type: "green", text: "Pricing aligns with standard regional operational margins for Mesa" },
      { type: "green", text: "Labor rate is consistent with licensed plumbers in the regional baseline" },
      { type: "green", text: "Parts pricing reflects standard wholesale cost margins" },
      { type: "red", text: "Ancillary Cost Variance: No itemized breakdown provided — request one before signing" },
    ],
    negotiation: "\"This quote aligns with regional market data. Before I sign, could you provide an itemized breakdown of parts and labor? That way we're both on the same page.\"",
  },
  "roofing": {
    score: 45,
    quoteAmount: "$14,500",
    fairRange: "$9,000 – $13,000",
    savings: "Up to $5,500",
    jobLabel: "Roof Replacement",
    findings: [
      { type: "red", text: "Moderate-to-High Variance: Baseline Deviation of 12–61% above the Scottsdale regional baseline" },
      { type: "red", text: "Regional Labor Rate Premium: Tear-off labor component exceeds the regional average for this job scope" },
      { type: "green", text: "Material grade specified is appropriate for Arizona climate conditions" },
      { type: "green", text: "Warranty terms are within the competitive range for this job type" },
    ],
    negotiation: "\"I've reviewed this quote against regional market data. The standard range for this roof replacement in Scottsdale is $9,000–$13,000. Can you revise the labor component to align with that range?\"",
  },
  "electrical": {
    score: 78,
    quoteAmount: "$3,200",
    fairRange: "$2,800 – $3,800",
    savings: "Within Baseline",
    jobLabel: "Electrical Panel Upgrade",
    findings: [
      { type: "green", text: "Pricing aligns with standard regional operational margins for Phoenix" },
      { type: "green", text: "Permit fees are included — a positive indicator of operational transparency" },
      { type: "green", text: "Licensed electrician rate is consistent with the regional baseline" },
      { type: "green", text: "Project timeline reflects standard operational parameters" },
    ],
    negotiation: "\"This quote aligns with regional market data. I'm ready to move forward — when can you start?\"",
  },
  "other": {
    score: 52,
    quoteAmount: "$3,600",
    fairRange: "$2,800 – $4,200",
    savings: "Low Deviation",
    jobLabel: "Home Repair",
    findings: [
      { type: "green", text: "Pricing reflects a low baseline deviation for this job category" },
      { type: "red", text: "Unitemized Service Adjustment: No itemized breakdown provided — request one before signing" },
      { type: "green", text: "Project timeline aligns with standard operational parameters" },
    ],
    negotiation: "\"Before I sign, I'd like a full itemized breakdown of this quote. Can you provide that?\"",
  },
};

export function DemoModal({ open, onClose }: DemoModalProps) {
  const [step, setStep] = useState<Step>("upload");
  const [selectedJob, setSelectedJob] = useState<string>("hvac");
  const [dragOver, setDragOver] = useState(false);
  const [processingMsg, setProcessingMsg] = useState(0);
  const [processingDone, setProcessingDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [triageComplete, setTriageComplete] = useState(false);
  const [triageResponses, setTriageResponses] = useState<TriageResponses | null>(null);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [, navigate] = useLocation();

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep("upload");
      setSelectedJob("hvac");
      setProcessingMsg(0);
      setProcessingDone(false);
      setTriageComplete(false);
      setTriageResponses(null);
      setTosAccepted(false);
    }
  }, [open]);

  // Processing animation
  useEffect(() => {
    if (step !== "processing") return;
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < PROCESSING_MESSAGES.length) {
        setProcessingMsg(idx);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setProcessingDone(true);
          setTimeout(() => setStep("report"), 400);
        }, 600);
      }
    }, 550);
    return () => clearInterval(interval);
  }, [step]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Don't advance until triage is complete
  }, []);

  const handleTriageComplete = (responses: TriageResponses, tos: boolean) => {
    setTriageResponses(responses);
    setTosAccepted(tos);
    setTriageComplete(true);
  };

  const report = SAMPLE_REPORTS[selectedJob] || SAMPLE_REPORTS["hvac"];

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div>
            <h2 className="text-white font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {step === "upload" && "Try It Now — No Signup Required"}
              {step === "jobtype" && "What type of job is this?"}
              {step === "processing" && "Analyzing your quote..."}
              {step === "report" && "Your Trust Score Report"}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Inter', sans-serif" }}>
              {step === "upload" && "Upload a real quote or use our sample"}
              {step === "jobtype" && "One click — we'll do the rest"}
              {step === "processing" && "This usually takes 15–30 seconds"}
              {step === "report" && `Sample report · ${report.jobLabel}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "white")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step: Upload — includes Triage Checklist + click-wrap gate */}
        {step === "upload" && (
          <div className="p-6 space-y-5">
            {/* Sample quote selector */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif" }}>Choose a sample quote to analyze</p>
              <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setSelectedJob("hvac"); }}
                className="flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200"
                style={{
                  border: selectedJob === "hvac" ? "1px solid #14B8A6" : "1px solid rgba(20,184,166,0.3)",
                  background: selectedJob === "hvac" ? "rgba(20,184,166,0.12)" : "rgba(20,184,166,0.06)",
                }}
              >
                <FileText className="w-5 h-5 flex-shrink-0" style={{ color: "#14B8A6" }} />
                <div>
                  <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Sample HVAC Quote
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>$19,800 · Phoenix</p>
                </div>
              </button>
              <button
                onClick={() => { setSelectedJob("water-heater"); }}
                className="flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200"
                style={{
                  border: selectedJob === "water-heater" ? "1px solid #F97316" : "1px solid rgba(249,115,22,0.3)",
                  background: selectedJob === "water-heater" ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.06)",
                }}
              >
                <FileText className="w-5 h-5 flex-shrink-0" style={{ color: "#F97316" }} />
                <div>
                  <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Sample Water Heater
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>$4,200 · Tucson</p>
                </div>
              </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}>Then answer the 5-question triage below</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* Triage Checklist — dark theme wrapper */}
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <ConsumerTriageChecklist
                compact
                showClickWrap
                onComplete={handleTriageComplete}
              />
            </div>

            {/* Proceed button — gated behind triage + ToS */}
            <Button
              onClick={() => { if (triageComplete) setStep("jobtype"); }}
              disabled={!triageComplete}
              className="w-full py-3 font-bold text-base rounded-xl transition-all duration-150"
              style={{
                background: triageComplete ? "#14B8A6" : "rgba(255,255,255,0.08)",
                color: triageComplete ? "#0F172A" : "rgba(255,255,255,0.3)",
                fontFamily: "'Space Grotesk', sans-serif",
                cursor: triageComplete ? "pointer" : "not-allowed",
                boxShadow: triageComplete ? "0 0 20px rgba(20,184,166,0.3)" : "none",
              }}
            >
              {triageComplete ? "Analyze This Quote →" : "Complete all 5 questions and accept Terms to continue"}
            </Button>

            <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}>
              🔒 Personal info is automatically removed before analysis
            </p>
          </div>
        )}

        {/* Step: Job Type */}
        {step === "jobtype" && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {JOB_TYPES.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200"
                  style={{
                    border: selectedJob === job.id ? "2px solid #14B8A6" : "1px solid rgba(255,255,255,0.1)",
                    background: selectedJob === job.id ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.03)",
                  }}
                >
                  <span className="text-2xl">{job.icon}</span>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: selectedJob === job.id ? "#14B8A6" : "rgba(255,255,255,0.8)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {job.label}
                  </span>
                </button>
              ))}
            </div>

            <Button
              onClick={() => setStep("processing")}
              className="w-full py-3 font-bold text-base rounded-xl transition-all duration-150"
              style={{ background: "#14B8A6", color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Analyze This Quote →
            </Button>
          </div>
        )}

        {/* Step: Processing */}
        {step === "processing" && (
          <div className="p-12 flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: "rgba(20,184,166,0.2)", borderTopColor: "#14B8A6" }}
              />
              <FileText className="absolute inset-0 m-auto w-7 h-7" style={{ color: "#14B8A6" }} />
            </div>
            <div className="space-y-2">
              {PROCESSING_MESSAGES.map((msg, i) => (
                <p
                  key={i}
                  className="text-sm transition-all duration-300"
                  style={{
                    color: i <= processingMsg ? (i === processingMsg ? "white" : "rgba(255,255,255,0.4)") : "rgba(255,255,255,0.15)",
                    fontFamily: "'Inter', sans-serif",
                    transform: i === processingMsg ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {i < processingMsg && <CheckCircle className="inline w-3.5 h-3.5 mr-1.5" style={{ color: "#14B8A6" }} />}
                  {msg}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Step: Report */}
        {step === "report" && (
          <div className="p-6 space-y-6">
            {/* Score + summary */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
              <TrustScoreGauge score={report.score} size={160} dark />
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Sample Report · {report.jobLabel}
                </p>
                <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                  <span className="text-white text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Your Quote: {report.quoteAmount}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3 justify-center sm:justify-start">
                  <TrendingDown className="w-4 h-4" style={{ color: "#F97316" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Inter', sans-serif" }}>
                    Fair market range: <strong style={{ color: "#14B8A6" }}>{report.fairRange}</strong>
                  </span>
                </div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
                  style={{
                    background: report.score <= 40 ? "rgba(249,115,22,0.15)" : report.score <= 70 ? "rgba(234,179,8,0.15)" : "rgba(20,184,166,0.15)",
                    color: report.score <= 40 ? "#F97316" : report.score <= 70 ? "#EAB308" : "#14B8A6",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {report.score <= 40 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  Potential savings: {report.savings}
                </div>
              </div>
            </div>

            {/* Key Findings */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Key Findings
              </h3>
              <div className="space-y-2">
                {report.findings.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="mt-0.5 flex-shrink-0">
                      {f.type === "red"
                        ? <AlertTriangle className="w-4 h-4" style={{ color: "#F97316" }} />
                        : <CheckCircle className="w-4 h-4" style={{ color: "#14B8A6" }} />
                      }
                    </span>
                    <span style={{ color: f.type === "red" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.65)" }}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Negotiation script */}
            <div className="p-4 rounded-xl" style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}>
                What to say next
              </p>
              <p className="text-sm italic mb-3" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}>
                {report.negotiation}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(report.negotiation).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                style={{ background: "rgba(20,184,166,0.2)", color: "#14B8A6" }}
              >
                {copied ? "Copied!" : "Copy Script"}
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Inter', sans-serif" }}>
              DEMO DATA – NOT A REAL CONTRACTOR RECORD. This is a sample report using illustrative data for demonstration purposes only. The variances shown represent statistical deviations from pricing norms and do not constitute evidence of fraud, intentional overcharging, or unlawful practices by any contractor. Actual analysis uses real Arizona market data sourced from public records. Reports do not constitute legal advice. Local market conditions and project complexities may justify pricing variations outside standard baseline models. For formal disputes, consult qualified legal counsel.
            </p>

            {/* CTA */}
            <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <Button
                onClick={() => { onClose(); navigate("/dashboard"); }}
                className="w-full py-3 font-bold text-base rounded-xl"
                style={{ background: "#14B8A6", color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Create Free Account to Analyze Your Real Quotes →
              </Button>
              <p className="text-center text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                No credit card required
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
