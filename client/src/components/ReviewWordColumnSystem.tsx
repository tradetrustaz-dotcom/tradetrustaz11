/**
 * ReviewWordColumnSystem — TradeTrust AZ
 * Exact-token indexing with no stemming, lemmatization, or grouping.
 * Displays review words in stacked columns for easy frequency counting.
 *
 * Rules:
 * - No stemming or lemmatization
 * - No synonym grouping
 * - No combining plural/singular or conjugated forms
 * - Preserve original surface form exactly
 * - Case normalization only for visual alignment
 * - Punctuation stripped only when not part of the word
 */

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TokenColumn {
  word: string;
  count: number;
  review_indices: number[];
}

interface ReviewWordColumnSystemProps {
  tokens: TokenColumn[];
  rawReviews: string[];
}

export function ReviewWordColumnSystem({ tokens, rawReviews }: ReviewWordColumnSystemProps) {
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
        <div
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Informational Triage · Source Comparison · Exact Word Column
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="rounded-lg p-4 text-xs"
        style={{
          background: "rgba(20,184,166,0.08)",
          border: "1px solid rgba(20,184,166,0.2)",
          color: "#334155",
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.6,
        }}
      >
        <strong>Informational Triage Only.</strong> This system displays exact words from source reviews without stemming, lemmatization, or grouping. Each token is preserved in its original surface form. Plural and singular forms, conjugations, and tense variations are tracked separately. TradeTrust AZ does not adopt these words as conclusions.
      </div>

      {/* Stacked word columns */}
      <div
        className="flex overflow-x-auto pb-6 gap-4 items-end min-h-[240px]"
        style={{ borderBottom: "1px solid rgba(15,23,42,0.08)" }}
      >
        {tokens.map((token, i) => (
          <div
            key={i}
            className="flex flex-col-reverse items-center min-w-[90px] group cursor-pointer"
            onClick={() => setExpandedWord(expandedWord === token.word ? null : token.word)}
          >
            {/* Stacked blocks (one per occurrence) */}
            <div className="flex flex-col-reverse gap-0.5 mb-2">
              {token.review_indices.map((idx, j) => (
                <div
                  key={j}
                  className="w-10 h-4 rounded-sm transition-all duration-150"
                  style={{
                    background: "#14B8A6",
                    opacity: 0.75,
                    boxShadow: "0 1px 3px rgba(15,23,42,0.1)",
                  }}
                  title={`Source Reference #${idx}`}
                />
              ))}
            </div>

            {/* Word label */}
            <div
              className="mt-2 px-2 py-1 w-full text-center rounded-t-lg text-[11px] font-bold truncate transition-all duration-150"
              style={{
                background: expandedWord === token.word ? "rgba(20,184,166,0.15)" : "rgba(15,23,42,0.05)",
                color: "#0F172A",
                fontFamily: "'Space Grotesk', sans-serif",
                borderTop: `2px solid #14B8A6`,
              }}
              title={token.word}
            >
              {token.word}
            </div>

            {/* Count badge */}
            <div
              className="text-[10px] font-mono font-bold mt-1"
              style={{ color: "#14B8A6", fontFamily: "'JetBrains Mono', monospace" }}
            >
              ×{token.count}
            </div>
          </div>
        ))}
      </div>

      {/* Source reference section */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
        }}
      >
        <h3
          className="text-sm font-bold mb-4 flex items-center gap-2"
          style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Source Reference (Auditability)
        </h3>
        <div className="space-y-3">
          {rawReviews.map((review, i) => (
            <div
              key={i}
              className="p-3 rounded-lg text-xs leading-relaxed"
              style={{
                background: "rgba(15,23,42,0.03)",
                borderLeft: "4px solid #14B8A6",
                color: "#475569",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <strong style={{ color: "#0F172A", marginRight: 8 }}>Source #{i}:</strong>
              {review}
            </div>
          ))}
        </div>
      </div>

      {/* Summary statistics */}
      <div
        className="p-4 rounded-lg"
        style={{
          background: "rgba(15,23,42,0.03)",
          border: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        <p
          className="text-xs"
          style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}
        >
          <strong>Summary:</strong> {tokens.length} unique tokens across {rawReviews.length} source(s).
          {tokens.length > 0 && (
            <>
              {" "}
              Highest frequency: <strong>{tokens[0]?.word}</strong> ({tokens[0]?.count} occurrence
              {tokens[0]?.count !== 1 ? "s" : ""}).
            </>
          )}
        </p>
      </div>
    </div>
  );
}
