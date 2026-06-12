/**
 * Dashboard — TradeTrust AZ
 * Design: Left sidebar (navy) + main content (off-white)
 * Shows mock "My Reports" list with upload CTA
 */
import { useState } from "react";
import { useLocation } from "wouter";
import {
  Shield, Upload, FileText, ChevronRight, LogOut,
  Home, BarChart2, Settings, Plus, AlertTriangle, CheckCircle, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VarianceGauge } from "@/components/VarianceGauge";
import { DemoModal } from "@/components/DemoModal";
import { toast } from "sonner";

const MOCK_REPORTS = [
  {
    id: "hvac-phoenix-1",
    title: "HVAC System Replacement",
    contractor: "Desert Air Solutions LLC",
    city: "Phoenix",
    date: "May 21, 2025",
    score: 34,
    quoteAmount: "$19,800",
    fairRange: "$6,200–$8,500",
    status: "overpriced",
  },
  {
    id: "water-heater-tucson-1",
    title: "Water Heater Replacement",
    contractor: "AZ Plumbing & Drain",
    city: "Tucson",
    date: "May 18, 2025",
    score: 28,
    quoteAmount: "$4,200",
    fairRange: "$1,500–$2,100",
    status: "overpriced",
  },
  {
    id: "electrical-phoenix-1",
    title: "Electrical Panel Upgrade",
    contractor: "Sunbelt Electric Co.",
    city: "Scottsdale",
    date: "May 10, 2025",
    score: 78,
    quoteAmount: "$3,200",
    fairRange: "$2,800–$3,800",
    status: "fair",
  },
  {
    id: "roofing-mesa-1",
    title: "Roof Replacement",
    contractor: "Mesa Roofing Pros",
    city: "Mesa",
    date: "April 30, 2025",
    score: 45,
    quoteAmount: "$14,500",
    fairRange: "$9,000–$13,000",
    status: "borderline",
  },
];

function getStatusBadge(status: string, score: number) {
  if (status === "overpriced") return { label: "Variance Observed", color: "#F97316", bg: "rgba(249,115,22,0.12)" };
  if (status === "fair") return { label: "Baseline Aligned", color: "#14B8A6", bg: "rgba(20,184,166,0.12)" };
  return { label: "Variance Noted", color: "#EAB308", bg: "rgba(234,179,8,0.12)" };
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "#F8FAFC" }}>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* ── Sidebar ── */}
      <aside
        className="hidden md:flex flex-col w-64 min-h-screen flex-shrink-0"
        style={{ background: "#0F172A", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
            <Shield className="w-6 h-6" style={{ color: "#14B8A6" }} />
            <span className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              TradeTrust
              <span
                className="ml-1 text-xs font-bold px-1.5 py-0.5 rounded"
                style={{ background: "#14B8A6", color: "#0F172A" }}
              >
                AZ
              </span>
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: <BarChart2 className="w-4 h-4" />, label: "My Reports", active: true },
            { icon: <Home className="w-4 h-4" />, label: "Home", action: () => navigate("/") },
            { icon: <Settings className="w-4 h-4" />, label: "Settings", action: () => toast.info("Settings coming soon") },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left"
              style={{
                background: item.active ? "rgba(20,184,166,0.12)" : "transparent",
                color: item.active ? "#14B8A6" : "rgba(255,255,255,0.55)",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!item.active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!item.active) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "rgba(20,184,166,0.2)", color: "#14B8A6" }}
            >
              J
            </div>
            <div>
              <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Jane H.
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Phoenix, AZ</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Mobile header */}
        <div className="flex items-center justify-between mb-8 md:hidden">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <Shield className="w-5 h-5" style={{ color: "#14B8A6" }} />
            <span className="font-bold" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>TradeTrust AZ</span>
          </button>
        </div>

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
              My Reports
            </h1>
            <p className="text-sm" style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}>
              {MOCK_REPORTS.length} analyses · Last updated May 21, 2025
            </p>
          </div>
          <Button
            onClick={() => setDemoOpen(true)}
            className="flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl"
            style={{ background: "#14B8A6", color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Plus className="w-4 h-4" />
            Upload New Quote
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Quotes Analyzed", value: "4", icon: <FileText className="w-5 h-5" /> },
            { label: "Overpriced Found", value: "2", icon: <AlertTriangle className="w-5 h-5" />, color: "#F97316" },
            { label: "Fair Quotes", value: "1", icon: <CheckCircle className="w-5 h-5" />, color: "#14B8A6" },
            { label: "Potential Savings", value: "$17.5k", icon: <BarChart2 className="w-5 h-5" />, color: "#14B8A6" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-xl"
              style={{ background: "white", boxShadow: "0 2px 16px rgba(15,23,42,0.06)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#94A3B8", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.label}
                </span>
                <span style={{ color: stat.color || "#94A3B8" }}>{stat.icon}</span>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: stat.color || "#0F172A", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Reports list */}
        <div className="space-y-4">
          {MOCK_REPORTS.map((report) => {
            const badge = getStatusBadge(report.status, report.score);
            return (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 rounded-2xl cursor-pointer transition-all duration-200"
                style={{
                  background: "white",
                  boxShadow: "0 2px 16px rgba(15,23,42,0.06)",
                  border: "1px solid transparent",
                }}
                onClick={() => navigate(`/report/${report.id}`)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 32px rgba(15,23,42,0.12)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(20,184,166,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(15,23,42,0.06)";
                  (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                }}
              >
                {/* Gauge */}
                <div className="flex-shrink-0">
                  <VarianceGauge index={report.score} size={80} strokeWidth={7} dark={false} animated showLabel={false} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-base" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
                      {report.title}
                    </h3>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: badge.bg, color: badge.color, fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}>
                    {report.contractor} · {report.city}
                  </p>
                  <div className="flex items-center gap-4 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span style={{ color: "#94A3B8" }}>
                      <Clock className="inline w-3.5 h-3.5 mr-1" />
                      {report.date}
                    </span>
                    <span className="font-mono font-bold" style={{ color: "#F97316" }}>{report.quoteAmount}</span>
                    <span style={{ color: "#94A3B8" }}>vs</span>
                    <span className="font-mono font-bold" style={{ color: "#14B8A6" }}>{report.fairRange}</span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "#CBD5E1" }} />
              </div>
            );
          })}
        </div>

        {/* Empty state prompt */}
        <div
          className="mt-6 p-8 rounded-2xl text-center border-2 border-dashed cursor-pointer transition-all duration-200"
          style={{ borderColor: "rgba(20,184,166,0.25)" }}
          onClick={() => setDemoOpen(true)}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#14B8A6")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(20,184,166,0.25)")}
        >
          <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: "#14B8A6" }} />
          <p className="font-semibold mb-1" style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
            Got another quote?
          </p>
          <p className="text-sm" style={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}>
            Upload it and view Variance Analysis in 30 seconds.
          </p>
        </div>
      </main>
    </div>
  );
}
