/**
 * PasswordGate — Developer-only access wall
 * Blocks all public access until the correct master password is entered.
 * Password is stored in sessionStorage so it persists across page refreshes
 * within the same browser session but clears when the tab/window is closed.
 *
 * To unlock: enter the master password set in VITE_DEV_PASSWORD env var.
 * Default fallback (dev only): "tradetrust-dev-2025"
 */
import { useState, useEffect } from "react";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";

const SESSION_KEY = "tt_dev_unlocked";
// Password is injected at build time via Vite env var.
// Set VITE_DEV_PASSWORD in your environment or .env file.
// Falls back to a hardcoded default only if the env var is absent.
const MASTER_PASSWORD =
  (import.meta.env.VITE_DEV_PASSWORD as string | undefined) ||
  "tradetrust-dev-2025";

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [shake, setShake] = useState(false);

  // Check sessionStorage on mount — persists within the same browser session
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === "1") setUnlocked(true);
  }, []);

  function attempt() {
    if (input === MASTER_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setInput("");
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") attempt();
  }

  if (unlocked) return <>{children}</>;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0F172A 50%, #0D1F3C 100%)",
      }}
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,184,166,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        className="relative w-full max-w-md mx-4 rounded-2xl p-8 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(20,184,166,0.2)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(20,184,166,0.05)",
          animation: shake ? "shake 0.5s cubic-bezier(.36,.07,.19,.97)" : "none",
        }}
      >
        {/* Logo mark */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
          style={{ background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.25)" }}
        >
          <Shield className="w-8 h-8" style={{ color: "#14B8A6" }} />
        </div>

        <h1
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          TradeTrust AZ
        </h1>
        <p
          className="text-sm mb-6"
          style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}
        >
          This build is restricted to authorized access only.
          <br />
          Enter your developer password to continue.
        </p>

        {/* Password input */}
        <div className="relative mb-3">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "rgba(255,255,255,0.3)" }}
          />
          <input
            type={showPw ? "text" : "password"}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            onKeyDown={handleKey}
            placeholder="Developer password"
            autoFocus
            className="w-full pl-11 pr-11 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: error
                ? "1.5px solid rgba(249,115,22,0.7)"
                : "1.5px solid rgba(255,255,255,0.1)",
              fontFamily: "'Inter', sans-serif",
              caretColor: "#14B8A6",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && (
          <p
            className="text-xs mb-3 text-left"
            style={{ color: "#F97316", fontFamily: "'Inter', sans-serif" }}
          >
            Incorrect password. Please try again.
          </p>
        )}

        <button
          onClick={attempt}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-150 active:scale-[0.97]"
          style={{
            background: "#14B8A6",
            color: "#0F172A",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Unlock Build →
        </button>

        <p
          className="text-xs mt-5"
          style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Inter', sans-serif" }}
        >
          🔒 Under construction · Section 230 compliance review in progress
        </p>
      </div>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
