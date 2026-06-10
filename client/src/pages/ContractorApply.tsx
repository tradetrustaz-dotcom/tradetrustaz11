/**
 * ContractorApply — TradeTrust AZ
 * Design: Dark navy, teal accents, merit-based protocol messaging
 * Click-wrap: Mandatory checkbox gating form submission
 * Covers: License number, trade category, business info, invoice protocol agreement
 */
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ShieldCheck, Upload, CheckCircle2, ExternalLink, AlertTriangle } from "lucide-react";

const TRADE_CATEGORIES = [
  "HVAC (Heating, Ventilation & Air Conditioning)",
  "Plumbing",
  "Electrical",
  "Roofing",
  "General Contractor",
  "Pest Control",
  "Pool & Spa",
  "Landscaping / Irrigation",
  "Appliance Repair",
  "Flooring",
  "Painting",
  "Other Trade",
];

interface FormState {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  tradeCategory: string;
  yearsInBusiness: string;
  serviceAreas: string;
  tosAccepted: boolean;
  invoiceProtocolAccepted: boolean;
}

const EMPTY_FORM: FormState = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  licenseNumber: "",
  tradeCategory: "",
  yearsInBusiness: "",
  serviceAreas: "",
  tosAccepted: false,
  invoiceProtocolAccepted: false,
};

export default function ContractorApply() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [, navigate] = useLocation();

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.businessName.trim()) e.businessName = "Business name is required";
    if (!form.contactName.trim()) e.contactName = "Contact name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email is required";
    if (!form.licenseNumber.trim()) e.licenseNumber = "Arizona contractor license number is required";
    if (!form.tradeCategory) e.tradeCategory = "Trade category is required";
    if (!form.tosAccepted) e.tosAccepted = "You must accept the Terms of Service and Privacy Policy";
    if (!form.invoiceProtocolAccepted)
      e.invoiceProtocolAccepted = "You must accept the Invoice-Upload Verification Protocol";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // In production this would POST to the backend
    setSubmitted(true);
  };

  const canSubmit = form.tosAccepted && form.invoiceProtocolAccepted;

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: "#0F172A" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{ background: "rgba(20,184,166,0.15)", border: "2px solid #14B8A6" }}
          >
            <CheckCircle2 className="w-8 h-8" style={{ color: "#14B8A6" }} />
          </div>
          <h1
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Application Received
          </h1>
          <p
            className="text-base max-w-md mb-2"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif" }}
          >
            Thank you, <strong className="text-white">{form.businessName}</strong>. Your Contractor
            Membership application has been submitted for review.
          </p>
          <p
            className="text-sm max-w-md mb-8"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif" }}
          >
            Our team will verify your Arizona contractor license and contact you at{" "}
            <strong className="text-white">{form.email}</strong> within 2–3 business days with
            next steps, including your invoice upload portal access.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/pricing")}
              style={{ background: "#14B8A6", color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              View Pricing Plans
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-10" style={{ background: "#0F172A" }}>
        <div className="container max-w-3xl">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            For Service Providers
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            Apply for Contractor Membership
          </h1>
          <p
            className="text-base max-w-xl"
            style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Inter', sans-serif" }}
          >
            The TradeTrust Verified badge is earned through data transparency — not purchased.
            Contractors who upload final, itemized invoices demonstrate honest pricing and earn
            consumer trust.
          </p>
        </div>
      </section>

      {/* Merit protocol callout */}
      <section className="py-6" style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container max-w-3xl">
          <div
            className="rounded-xl p-4 flex items-start gap-4"
            style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)" }}
          >
            <ShieldCheck className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "#14B8A6" }} />
            <div>
              <p
                className="text-sm font-bold mb-1"
                style={{ color: "#14B8A6", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Merit-Based Verification Protocol
              </p>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Inter', sans-serif" }}
              >
                Contractors do not "buy" a ranking. To earn and maintain the TradeTrust Verified
                status, you must upload your final itemized invoices into the system to verify
                that your pricing matches market honesty. The badge proves data transparency,
                not a paid endorsement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="container max-w-3xl">
          <form onSubmit={handleSubmit} noValidate>
            <div
              className="rounded-2xl p-8 sm:p-10 space-y-8"
              style={{ background: "white", boxShadow: "0 2px 24px rgba(15,23,42,0.07)" }}
            >
              {/* Section 1: Business Info */}
              <FormSection title="Business Information">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Business / Company Name *"
                    error={errors.businessName}
                  >
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => set("businessName", e.target.value)}
                      placeholder="e.g. Desert Air HVAC LLC"
                      className="form-input"
                    />
                  </Field>
                  <Field label="Primary Contact Name *" error={errors.contactName}>
                    <input
                      type="text"
                      value={form.contactName}
                      onChange={(e) => set("contactName", e.target.value)}
                      placeholder="First and last name"
                      className="form-input"
                    />
                  </Field>
                  <Field label="Business Email *" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@yourbusiness.com"
                      className="form-input"
                    />
                  </Field>
                  <Field label="Phone Number" error={errors.phone}>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="(602) 555-0100"
                      className="form-input"
                    />
                  </Field>
                </div>
              </FormSection>

              {/* Section 2: License & Trade */}
              <FormSection title="License & Trade Details">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Arizona Contractor License Number *"
                    error={errors.licenseNumber}
                    hint="Issued by the Arizona Registrar of Contractors (ROC)"
                  >
                    <input
                      type="text"
                      value={form.licenseNumber}
                      onChange={(e) => set("licenseNumber", e.target.value)}
                      placeholder="ROC-XXXXXX"
                      className="form-input"
                    />
                  </Field>
                  <Field label="Years in Business">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.yearsInBusiness}
                      onChange={(e) => set("yearsInBusiness", e.target.value)}
                      placeholder="e.g. 8"
                      className="form-input"
                    />
                  </Field>
                  <Field
                    label="Primary Trade Category *"
                    error={errors.tradeCategory}
                    className="sm:col-span-2"
                  >
                    <select
                      value={form.tradeCategory}
                      onChange={(e) => set("tradeCategory", e.target.value)}
                      className="form-input"
                    >
                      <option value="">Select a trade category</option>
                      {TRADE_CATEGORIES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="Service Areas (Cities / Zip Codes)"
                    className="sm:col-span-2"
                  >
                    <input
                      type="text"
                      value={form.serviceAreas}
                      onChange={(e) => set("serviceAreas", e.target.value)}
                      placeholder="e.g. Phoenix, Scottsdale, Tempe, Mesa"
                      className="form-input"
                    />
                  </Field>
                </div>
              </FormSection>

              {/* Section 3: Invoice Upload Protocol */}
              <FormSection title="Invoice Verification Protocol">
                <div
                  className="rounded-xl p-4 flex items-start gap-3 mb-4"
                  style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.2)" }}
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#F97316" }} />
                  <p
                    className="text-sm"
                    style={{ color: "#7C3A1E", fontFamily: "'Inter', sans-serif" }}
                  >
                    <strong>Important:</strong> Submission of falsified or altered invoices constitutes
                    fraud and will result in immediate membership termination and referral to the
                    Arizona Registrar of Contractors and appropriate law enforcement authorities.
                  </p>
                </div>
                <div className="space-y-3">
                  <p
                    className="text-sm"
                    style={{ color: "#475569", fontFamily: "'Inter', sans-serif" }}
                  >
                    By applying, you agree to upload final, itemized invoices for completed jobs on
                    a regular basis. The TradeTrust Verified badge will be awarded and maintained
                    based on your pricing consistency with market benchmarks — not as a paid endorsement.
                  </p>
                  <div className="flex items-start gap-3">
                    <Upload className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#14B8A6" }} />
                    <p
                      className="text-sm"
                      style={{ color: "#475569", fontFamily: "'Inter', sans-serif" }}
                    >
                      After approval, you will receive access to a secure invoice upload portal.
                      Invoices are processed through the same automated analysis engine used for
                      consumer audits to ensure objective, unbiased scoring.
                    </p>
                  </div>
                </div>
              </FormSection>

              {/* Click-wrap agreements */}
              <FormSection title="Required Agreements">
                <div className="space-y-4">
                  {/* ToS + Privacy */}
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: form.tosAccepted ? "rgba(20,184,166,0.05)" : "rgba(15,23,42,0.02)",
                      border: `1px solid ${form.tosAccepted ? "rgba(20,184,166,0.25)" : "rgba(15,23,42,0.1)"}`,
                    }}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.tosAccepted}
                        onChange={(e) => set("tosAccepted", e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded flex-shrink-0"
                        style={{ accentColor: "#14B8A6" }}
                      />
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: "#334155", fontFamily: "'Inter', sans-serif" }}
                      >
                        I have read and agree to the TradeTrust AZ{" "}
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
                        , including all provisions related to Contractor Membership and the
                        merit-based verification requirements.
                      </span>
                    </label>
                    {errors.tosAccepted && (
                      <p className="text-xs mt-2 ml-7" style={{ color: "#EF4444" }}>{errors.tosAccepted}</p>
                    )}
                  </div>

                  {/* Invoice Protocol */}
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: form.invoiceProtocolAccepted ? "rgba(20,184,166,0.05)" : "rgba(15,23,42,0.02)",
                      border: `1px solid ${form.invoiceProtocolAccepted ? "rgba(20,184,166,0.25)" : "rgba(15,23,42,0.1)"}`,
                    }}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.invoiceProtocolAccepted}
                        onChange={(e) => set("invoiceProtocolAccepted", e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded flex-shrink-0"
                        style={{ accentColor: "#14B8A6" }}
                      />
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: "#334155", fontFamily: "'Inter', sans-serif" }}
                      >
                        I have read and agree to the{" "}
                        <strong>Invoice-Upload Verification Protocol</strong>, including the
                        requirement to upload final, itemized invoices on a regular basis, and I
                        understand that submission of falsified or altered invoices will result in
                        immediate termination and referral to appropriate authorities.
                      </span>
                    </label>
                    {errors.invoiceProtocolAccepted && (
                      <p className="text-xs mt-2 ml-7" style={{ color: "#EF4444" }}>{errors.invoiceProtocolAccepted}</p>
                    )}
                  </div>
                </div>
              </FormSection>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-4 text-base font-bold rounded-xl transition-all duration-150 active:scale-[0.98]"
                  style={{
                    background: canSubmit ? "#14B8A6" : "rgba(15,23,42,0.08)",
                    color: canSubmit ? "#0F172A" : "#94A3B8",
                    fontFamily: "'Space Grotesk', sans-serif",
                    boxShadow: canSubmit ? "0 0 24px rgba(20,184,166,0.3)" : "none",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                  }}
                >
                  {canSubmit ? "Submit Contractor Application →" : "Accept both agreements above to submit"}
                </Button>
                <p
                  className="text-xs text-center mt-3"
                  style={{ color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}
                >
                  Applications are reviewed within 2–3 business days. Membership is $149/month
                  after approval — no charge until verified.{" "}
                  <Link href="/pricing" className="underline" style={{ color: "#14B8A6" }}>
                    View full pricing
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>

      <style>{`
        .form-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(15,23,42,0.12);
          background: #F8FAFC;
          font-size: 0.875rem;
          font-family: 'Inter', sans-serif;
          color: #0F172A;
          outline: none;
          transition: border-color 0.15s;
        }
        .form-input:focus {
          border-color: #14B8A6;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
        }
        .form-input::placeholder { color: #94A3B8; }
      `}</style>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="text-base font-bold mb-4 pb-2"
        style={{
          color: "#0F172A",
          fontFamily: "'Space Grotesk', sans-serif",
          borderBottom: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        className="block text-xs font-semibold mb-1.5"
        style={{ color: "#475569", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {label}
      </label>
      {hint && (
        <p className="text-xs mb-1.5" style={{ color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p className="text-xs mt-1" style={{ color: "#EF4444", fontFamily: "'Inter', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}
