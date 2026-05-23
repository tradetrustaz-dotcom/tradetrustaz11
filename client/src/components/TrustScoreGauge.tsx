/**
 * TrustScoreGauge — Animated circular arc gauge
 * Design: Precision Trust — navy background, teal/yellow/orange arc by score
 * Animates from 0 to score value on mount
 */
import { useEffect, useRef, useState } from "react";

interface TrustScoreGaugeProps {
  score: number;          // 0–100
  size?: number;          // px diameter, default 200
  strokeWidth?: number;   // default 14
  animated?: boolean;     // default true
  showLabel?: boolean;    // default true
  dark?: boolean;         // dark background variant
}

function getScoreColor(score: number) {
  if (score <= 40) return "#F97316";   // orange — low
  if (score <= 70) return "#EAB308";   // yellow — mid
  return "#14B8A6";                    // teal — high
}

function getScoreLabel(score: number) {
  if (score <= 25) return "Overpriced";
  if (score <= 40) return "Concerning";
  if (score <= 60) return "Mixed";
  if (score <= 75) return "Fair";
  if (score <= 90) return "Good Value";
  return "Excellent";
}

export function TrustScoreGauge({
  score,
  size = 200,
  strokeWidth = 14,
  animated = true,
  showLabel = true,
  dark = true,
}: TrustScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const duration = 1400;

  // Arc math — 3/4 circle (270 degrees), starting from bottom-left
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270° = 75% of full circle
  const offset = arcLength * (1 - displayScore / 100);

  // Start angle: 135° (bottom-left), sweep 270°
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135 * (Math.PI / 180);
  const endAngle = startAngle + 270 * (Math.PI / 180);

  // Describe arc path
  function polarToCartesian(angle: number) {
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }

  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);

  const trackPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 1 1 ${end.x} ${end.y}`;

  // Animate score counter
  useEffect(() => {
    if (!animated) return;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    function step(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayScore(Math.round(easeOut(progress) * score));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    }

    const timer = setTimeout(() => {
      animRef.current = requestAnimationFrame(step);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [score, animated]);

  const color = getScoreColor(displayScore);
  const label = getScoreLabel(score);
  const trackColor = dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.1)";
  const textColor = dark ? "white" : "#0F172A";
  const subColor = dark ? "rgba(255,255,255,0.5)" : "#64748B";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(0deg)" }}>
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Arc */}
        <path
          d={trackPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={offset}
          style={{
            transition: animated ? "stroke-dashoffset 0.05s linear, stroke 0.3s ease" : "none",
            filter: `drop-shadow(0 0 8px ${color}60)`,
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-bold leading-none"
          style={{
            fontSize: size * 0.22,
            color,
            fontFamily: "'JetBrains Mono', monospace",
            textShadow: `0 0 20px ${color}40`,
          }}
        >
          {displayScore}
        </span>
        <span
          style={{
            fontSize: size * 0.065,
            color: subColor,
            fontFamily: "'Inter', sans-serif",
            marginTop: 2,
          }}
        >
          / 100
        </span>
        {showLabel && (
          <span
            className="font-semibold mt-1"
            style={{
              fontSize: size * 0.075,
              color,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
