/**
 * ConsumerTriageChecklist — TradeTrust AZ
 * Design: High-contrast toggle pairs (Yes/No), live risk gauge, click-wrap checkbox
 * Used in: DemoModal upload step, ContractorApply page, and as a landing page widget
 *
 * Props:
 *  - onComplete(responses, tosAccepted): called when all 5 answered + ToS checked
 *  - showClickWrap: whether to show the ToS/Privacy click-wrap checkbox (default true)
 *  - compact: smaller layout for embedding in modals
 */
import { useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export interface TriageResponses {
  triage_ipad_only: boolean | null;
  triage_pressure_pricing: boolean | null;
  triage_waived_diagnostic: boolean | null;
  triage_unitemized_bulk: boolean | null;
  triage_undocumented_failure: boolean | null;
}

const QUESTIONS = [
  {
    key: "triage_ipad_only" as keyof TriageResponses,
    label: "iPad / Tablet Presentation",
    description:
      "Did the technician present pricing on an iPad or tablet without leaving a printed, itemized breakdown?",
    riskLabel: "No paper trail — a known pressure tactic",
  },
  {
    key: "triage_pressure_pricing" as keyof TriageResponses,
    label: "High-Pressure Close",
    description:
      'Did the contractor state that the price is "only good for today" to pressure an immediate signature?',
    riskLabel: "Urgency language — non-standard market deviation",
  },
  {
    key: "triage_waived_diagnostic" as keyof TriageResponses,
    label: "Waived Fee Bait",
    description:
      "Is there a flat-rate dispatch or diagnostic fee that is waived ONLY if you agree to immediate repairs?",
    riskLabel: "Conditional waiver — inflates perceived urgency",
  },
  {
    key: "triage_unitemized_bulk" as keyof TriageResponses,
    label: "Unitemized Bulk Estimate",
    description:
      "Does the estimate lump materials and labor together into a single, unitemized bulk sum?",
    riskLabel: "No line-item breakdown — prevents independent verification",
  },
  {
    key: "triage_undocumented_failure" as keyof TriageResponses,
    label: "Unverified Catastrophe Claim",
    description:
      "Did the technician claim a catastrophic failure exists without providing clear video or photographic proof?",
    riskLabel: "Undocumented failure claim — unsubstantiated billing variance risk",
  },
];

const EMPTY_RESPONSES: TriageResponses = {
  triage_ipad_only: null,
  triage_pressure_pricing: null,
  triage_waived_diagnostic: null,
  triage_unitemized_bulk: null,
  triage_undocumented_failure: null,
};

interface Props {
  onComplete?: (responses: TriageResponses, tosAccepted: boolean) => void;
  showClickWrap?: boolean;
  compact?: boolean;
  /** If true, shows a CTA button at the bottom (landing page widget mode) */
  showCTA?: boolean;
  onCTAClick?: () => void;
}

export function ConsumerTriageChecklist({
  onComplete,
  showClickWrap = true,
  compact = false,
  showCTA = false,
  onCTAClick,
}: Props) {
  const [responses, setResponses] = useState<TriageResponses>(EMPTY_RESPONSES);
  const [tosAccepted, setTosAccepted] = useState(false);

  const answeredCount = Object.values(responses).filter((v) => v !== null).length;
  const yesCount = Object.values(responses).filter((v) => v === true).length;
  const allAnswered = answeredCount === 5;

  const canProceed = allAnswered && (!showClickWrap || tosAccepted);

  const riskLevel =
    yesCount === 0
      ? { label: "No Flags Detected", color: "#22C55E", bg: "rgba(34,197,94,0.1)", icon: <ShieldCheck className="w-5 h-5" /> }
      : yesCount === 1
      ? { label: "Low Risk — 1 Flag", color: "#84CC16", bg: "rgba(132,204,22,0.1)", icon: <ShieldCheck className="w-5 h-5" /> }
      : yesCount === 2
      ? { label: "Moderate Risk — 2 Flags", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: <AlertTriangle className="w-5 h-5" /> }
      : yesCount === 3
      ? { label: "High Risk — 3 Flags", color: "#F97316", bg: "rgba(249,115,22,0.1)", icon: <AlertTriangle className="w-5 h-5" /> }
      : { label: `Critical Risk — ${yesCount}/5 Tactics Detected`, color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: <ShieldAlert className="w-5 h-5" /> };

  const setAnswer = (key: keyof TriageResponses, value: boolean) => {
    const next = { ...responses, [key]: value };
    setResponses(next);
    const nextAnswered = Object.values(next).filter((v) => v !== null).length;
    if (nextAnswered === 5 && onComplete && (!showClickWrap || tosAccepted)) {
      onComplete(next, tosAccepted);
    }
  };

  const handleTosChange = (checked: boolean) => {
    setTosAccepted(checked);
    if (allAnswered && checked && onComplete) {
      onComplete(responses, checked);
    }
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {/* Header */}
      {!compact && (
        <div className="mb-2">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            5-Question Triage Checklist
          </p>
          <p
            className="text-sm"
            style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
          >
            Answer each question based on your on-site experience. Your responses are factored
            directly into your Trust Score.
          </p>
        </div>
      )}

      {/* Live risk gauge */}
      {answeredCount > 0 && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
          style={{ background: riskLevel.bg, border: `1px solid ${riskLevel.color}30` }}
        >
          <span style={{ color: riskLevel.color }}>{riskLevel.icon}</span>
          <div>
            <p
              className="text-sm font-bold"
              style={{ color: riskLevel.color, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {riskLevel.label}
            </p>
            <p className="text-xs" style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}>
              {answeredCount}/5 questions answered
            </p>
          </div>
          {/* Progress bar */}
          <div className="flex-1 ml-2">
            <div className="h-1.5 rounded-full" style={{ background: "rgba(15,23,42,0.08)" }}>
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(yesCount / 5) * 100}%`, background: riskLevel.color }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      {QUESTIONS.map((q, i) => {
        const answer = responses[q.key];
        return (
          <div
            key={q.key}
            className="rounded-xl p-4 transition-all duration-200"
            style={{
              background: answer === true ? "rgba(239,68,68,0.04)" : answer === false ? "rgba(34,197,94,0.04)" : "rgba(15,23,42,0.03)",
              border: answer === true ? "1px solid rgba(239,68,68,0.2)" : answer === false ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(15,23,42,0.08)",
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{
                  background: answer !== null ? (answer ? "#EF4444" : "#22C55E") : "#E2E8F0",
                  color: answer !== null ? "white" : "#94A3B8",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {answer !== null ? (answer ? "!" : "✓") : i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold mb-1 ${compact ? "text-xs" : "text-sm"}`}
                  style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {q.label}
                </p>
                <p
                  className={`leading-relaxed mb-3 ${compact ? "text-xs" : "text-sm"}`}
                  style={{ color: "#475569", fontFamily: "'Inter', sans-serif" }}
                >
                  {q.description}
                </p>
                {answer === true && (
                  <p
                    className="text-xs mb-2 flex items-center gap-1"
                    style={{ color: "#EF4444", fontFamily: "'Inter', sans-serif" }}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {q.riskLabel}
                  </p>
                )}
                {answer === false && (
                  <p
                    className="text-xs mb-2 flex items-center gap-1"
                    style={{ color: "#22C55E", fontFamily: "'Inter', sans-serif" }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    No flag on this indicator
                  </p>
                )}
                {/* Yes / No toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setAnswer(q.key, true)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
                    style={{
                      background: answer === true ? "#EF4444" : "rgba(239,68,68,0.08)",
                      color: answer === true ? "white" : "#EF4444",
                      fontFamily: "'Space Grotesk', sans-serif",
                      border: `1px solid ${answer === true ? "#EF4444" : "rgba(239,68,68,0.2)"}`,
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setAnswer(q.key, false)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
                    style={{
                      background: answer === false ? "#22C55E" : "rgba(34,197,94,0.08)",
                      color: answer === false ? "white" : "#22C55E",
                      fontFamily: "'Space Grotesk', sans-serif",
                      border: `1px solid ${answer === false ? "#22C55E" : "rgba(34,197,94,0.2)"}`,
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Click-wrap agreement */}
      {showClickWrap && (
        <div
          className="rounded-xl p-4"
          style={{
            background: tosAccepted ? "rgba(20,184,166,0.06)" : "rgba(15,23,42,0.03)",
            border: `1px solid ${tosAccepted ? "rgba(20,184,166,0.3)" : "rgba(15,23,42,0.1)"}`,
          }}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={tosAccepted}
              onChange={(e) => handleTosChange(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded flex-shrink-0"
              style={{ accentColor: "#14B8A6" }}
            />
            <span
              className="text-xs leading-relaxed"
              style={{ color: "#334155", fontFamily: "'Inter', sans-serif" }}
            >
              I certify that the answers provided above are accurate to my on-site experience and
              agree to the{" "}
              <Link
                href="/legal/tos"
                target="_blank"
                className="underline font-medium inline-flex items-center gap-0.5"
                style={{ color: "#14B8A6" }}
                onClick={(e) => e.stopPropagation()}
              >
                Terms of Service <ExternalLink className="w-3 h-3" />
              </Link>{" "}
              and{" "}
              <Link
                href="/legal/privacy"
                target="_blank"
                className="underline font-medium inline-flex items-center gap-0.5"
                style={{ color: "#14B8A6" }}
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy <ExternalLink className="w-3 h-3" />
              </Link>
              . I understand that this report is for informational purposes only and does not
              constitute legal advice.
            </span>
          </label>
        </div>
      )}

      {/* Landing page CTA */}
      {showCTA && (
        <button
          onClick={onCTAClick}
          disabled={!canProceed}
          className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97]"
          style={{
            background: canProceed ? "#14B8A6" : "rgba(15,23,42,0.08)",
            color: canProceed ? "#0F172A" : "#94A3B8",
            fontFamily: "'Space Grotesk', sans-serif",
            boxShadow: canProceed ? "0 0 24px rgba(20,184,166,0.35)" : "none",
            cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          {canProceed
            ? "Upload Invoice for Full Verification Audit →"
            : `Answer all 5 questions${showClickWrap && !tosAccepted ? " and accept Terms" : ""} to continue`}
        </button>
      )}
    </div>
  );
}
