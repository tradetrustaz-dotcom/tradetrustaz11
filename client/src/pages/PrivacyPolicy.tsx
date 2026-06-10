/**
 * Privacy Policy — TradeTrust AZ
 * Design: Clean legal document layout matching ToS
 * Covers: Data routing, volatile memory during analysis, PostgreSQL storage,
 *         PII protections, no-sale policy, and user rights.
 */
import { Navbar } from "@/components/Navbar";
import { Link } from "wouter";

const EFFECTIVE_DATE = "June 1, 2025";
const LAST_UPDATED = "May 31, 2026";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-10" style={{ background: "#0F172A" }}>
        <div className="container max-w-4xl">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{
              color: "#14B8A6",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Legal
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Privacy Policy
          </h1>
          <p
            className="text-sm"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Effective: {EFFECTIVE_DATE} &nbsp;·&nbsp; Last Updated:{" "}
            {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-12">
        <div className="container max-w-4xl">
          <div
            className="rounded-2xl p-8 sm:p-12"
            style={{
              background: "white",
              boxShadow: "0 2px 24px rgba(15,23,42,0.07)",
            }}
          >
            <LegalSection title="1. Overview">
              <p>
                TradeTrust AZ LLC ("Company," "we," "us," or "our") is committed
                to protecting your privacy. This Privacy Policy explains how we
                collect, use, store, and protect information when you use the
                TradeTrust AZ platform ("Platform"). By using the Platform, you
                agree to the data practices described in this policy.
              </p>
              <p>
                This policy is incorporated by reference into our{" "}
                <Link
                  href="/legal/tos"
                  className="underline"
                  style={{ color: "#14B8A6" }}
                >
                  Terms of Service
                </Link>
                . Capitalized terms not defined here have the meanings given in
                the Terms of Service.
              </p>
            </LegalSection>

            <LegalSection title="2. Information We Collect">
              <p>
                <strong>2.1 Account Information.</strong> When you create an
                account, we collect your name, email address, and subscription
                tier. For Contractor Members, we additionally collect your
                Arizona contractor license number and trade category.
              </p>
              <p>
                <strong>2.2 User-Submitted Documents.</strong> When you upload
                an estimate, invoice, or photograph for analysis, we receive and
                process that document. See Section 3 for how this data is routed
                and stored.
              </p>
              <p>
                <strong>2.3 Consumer Triage Responses.</strong> The
                five-question Consumer Triage Checklist collects binary (Yes/No)
                responses about your on-site experience. These responses are
                used solely to weight your Trust Score Report and are stored
                alongside your audit record.
              </p>
              <p>
                <strong>2.4 Usage Data.</strong> We automatically collect
                standard server logs including IP address, browser type, pages
                visited, and timestamps. This data is used for security
                monitoring and Platform improvement only.
              </p>
              <p>
                <strong>2.5 Payment Information.</strong> Payment processing is
                handled entirely by Stripe, Inc. TradeTrust AZ does not receive,
                store, or process your credit card number or banking
                information. We receive only a transaction confirmation token
                from Stripe.
              </p>
            </LegalSection>

            <LegalSection title="3. Data Routing and Storage Architecture">
              <p>
                <strong>3.1 Volatile Memory During Analysis.</strong> When you
                submit a document for analysis, the document is loaded into
                local server memory (RAM) for the duration of the analysis
                process only. This volatile memory is cleared immediately upon
                completion of the analysis. The raw document binary is never
                written to permanent disk storage on the analysis server.
              </p>
              <p>
                <strong>3.2 PostgreSQL Database Storage.</strong> The following
                data is written to our PostgreSQL database upon completion of
                analysis: your account profile, the Trust Score Report output
                (numerical scores and findings text), your Consumer Triage
                responses, and metadata about the submitted document (file type,
                size, submission timestamp). The original document file is not
                stored in the database.
              </p>
              <p>
                <strong>3.3 Document Retention.</strong> Uploaded documents are
                retained in encrypted cloud storage (AWS S3) for a maximum of 90
                days to support report regeneration and dispute resolution.
                After 90 days, documents are permanently deleted. Account
                holders may request earlier deletion at any time.
              </p>
              <p>
                <strong>3.4 Contractor Invoice Storage.</strong> Invoices
                submitted by Contractor Members for verification purposes are
                retained for the duration of the membership and for 12 months
                following termination, for audit and dispute resolution
                purposes.
              </p>
            </LegalSection>

            <LegalSection title="4. How We Use Your Information">
              <ul className="list-disc pl-6 space-y-2">
                <li>To generate and deliver your Trust Score Report;</li>
                <li>To maintain your account and subscription;</li>
                <li>
                  To improve the accuracy of our pricing benchmark models using
                  anonymized, aggregated data;
                </li>
                <li>
                  To detect and prevent fraud, abuse, and unauthorized access;
                </li>
                <li>
                  To comply with legal obligations and respond to lawful
                  requests from government authorities;
                </li>
                <li>
                  To send transactional emails (receipts, report delivery,
                  account notices).
                </li>
              </ul>
              <p>
                We do not use your data for behavioral advertising, third-party
                marketing, or any purpose not listed above without your explicit
                prior consent.
              </p>
            </LegalSection>

            <LegalSection title="5. No Sale of Personal Information">
              <p>
                TradeTrust AZ does not sell, rent, lease, or otherwise transfer
                your personally identifiable information (PII) to any third
                party for commercial purposes. This commitment applies
                regardless of any applicable "opt-out" rights under state law —
                we do not engage in the sale of personal data as a business
                practice.
              </p>
              <p>
                We do not share your PII with unverified third parties. The only
                third-party service providers who receive any user data are: (a)
                Stripe, Inc. for payment processing; (b) Amazon Web Services for
                encrypted document storage; and (c) our database hosting
                provider. All such providers are bound by data processing
                agreements that prohibit secondary use of your data.
              </p>
            </LegalSection>

            <LegalSection title="6. Data Security">
              <p>
                We implement industry-standard security measures including: TLS
                1.3 encryption for all data in transit; AES-256 encryption for
                data at rest; role-based access controls limiting employee
                access to user data; regular security audits; and automated
                intrusion detection.
              </p>
              <p>
                No method of electronic transmission or storage is 100% secure.
                While we strive to protect your information, we cannot guarantee
                absolute security. In the event of a data breach affecting your
                PII, we will notify you within 72 hours as required by
                applicable law.
              </p>
            </LegalSection>

            <LegalSection title="7. Your Rights and Choices">
              <p>You have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Access:</strong> Request a copy of all personal data
                  we hold about you;
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  or incomplete data;
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account
                  and associated data (subject to legal retention obligations);
                </li>
                <li>
                  <strong>Portability:</strong> Request your data in a
                  machine-readable format;
                </li>
                <li>
                  <strong>Objection:</strong> Object to processing of your data
                  for any purpose beyond service delivery.
                </li>
              </ul>
              <p>
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:privacy@tradetrustaz.com"
                  className="underline"
                  style={{ color: "#14B8A6" }}
                >
                  privacy@tradetrustaz.com
                </a>
                . We will respond within 30 days.
              </p>
            </LegalSection>

            <LegalSection title="8. Cookies and Tracking">
              <p>
                We use strictly necessary cookies to maintain your session and
                authentication state. We do not use third-party advertising
                cookies, cross-site tracking pixels, or behavioral analytics
                tools. Our analytics are powered by a self-hosted,
                privacy-preserving analytics platform that does not share data
                with third parties and does not track users across sites.
              </p>
            </LegalSection>

            <LegalSection title="9. Children's Privacy">
              <p>
                The Platform is not directed to individuals under the age of 18.
                We do not knowingly collect personal information from minors. If
                you believe a minor has submitted information to us, contact us
                immediately at{" "}
                <a
                  href="mailto:privacy@tradetrustaz.com"
                  className="underline"
                  style={{ color: "#14B8A6" }}
                >
                  privacy@tradetrustaz.com
                </a>{" "}
                and we will delete the information promptly.
              </p>
            </LegalSection>

            <LegalSection title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Material
                changes will be communicated via email or prominent notice on
                the Platform at least fourteen (14) days before taking effect.
                Your continued use of the Platform after the effective date
                constitutes acceptance of the revised policy.
              </p>
            </LegalSection>

            <LegalSection title="11. Contact Information">
              <p>
                For privacy inquiries:{" "}
                <a
                  href="mailto:privacy@tradetrustaz.com"
                  className="underline"
                  style={{ color: "#14B8A6" }}
                >
                  privacy@tradetrustaz.com
                </a>
                <br />
                TradeTrust AZ LLC · Phoenix, Arizona
              </p>
            </LegalSection>

            {/* Footer nav */}
            <div
              className="mt-10 pt-6 flex flex-wrap gap-4 text-sm"
              style={{
                borderTop: "1px solid rgba(15,23,42,0.08)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Link
                href="/legal/tos"
                className="underline"
                style={{ color: "#14B8A6" }}
              >
                Terms of Service →
              </Link>
              <Link href="/" className="underline" style={{ color: "#64748B" }}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2
        className="text-lg font-bold mb-3"
        style={{ color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {title}
      </h2>
      <div
        className="space-y-3 text-sm leading-relaxed"
        style={{ color: "#334155", fontFamily: "'Inter', sans-serif" }}
      >
        {children}
      </div>
    </div>
  );
}
