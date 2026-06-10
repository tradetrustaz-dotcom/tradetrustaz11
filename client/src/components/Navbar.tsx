/**
 * Navbar — TradeTrust AZ
 * Design: Deep navy background, teal CTA, AZ badge on logo
 * Sticky with subtle backdrop blur on scroll
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Trust Score", href: "#trust-score" },
    { label: "Examples", href: "#examples" },
    { label: "Pricing", href: "/pricing", isRoute: true },
    { label: "For Contractors", href: "#contractors", subtle: true },
  ];

  const scrollTo = (href: string, isRoute?: boolean) => {
    setMenuOpen(false);
    if (isRoute) {
      navigate(href);
    } else if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(15,23,42,0.95)"
          : "rgba(15,23,42,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative">
            <Shield className="w-7 h-7" style={{ color: "#14B8A6" }} />
          </div>
          <span
            className="font-bold text-white text-lg tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            TradeTrust
            <span
              className="ml-1 text-xs font-bold px-1.5 py-0.5 rounded"
              style={{
                background: "#14B8A6",
                color: "#0F172A",
                verticalAlign: "middle",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              AZ
            </span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href, link.isRoute)}
              className="text-sm transition-colors duration-150"
              style={{
                color: link.subtle ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.75)",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = link.subtle ? "rgba(255,255,255,0.75)" : "white")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = link.subtle ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.75)")
              }
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm transition-colors duration-150"
            style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Inter', sans-serif" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "white")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.65)")}
          >
            Sign in
          </button>
          <Button
            onClick={() => {
              const el = document.querySelector("#hero-cta");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="font-semibold text-sm px-5 py-2 rounded-md transition-all duration-150"
            style={{
              background: "#14B8A6",
              color: "#0F172A",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Start Free
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: "#0F172A", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href, link.isRoute)}
                className="text-left text-sm py-1"
                style={{
                  color: link.subtle ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.8)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <button
                onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Sign in
              </button>
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  const el = document.querySelector("#hero-cta");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-semibold text-sm px-5"
                style={{ background: "#14B8A6", color: "#0F172A" }}
              >
                Start Free
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
