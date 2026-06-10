/**
 * Terms of Service — TradeTrust AZ
 * Design: Clean legal document layout, deep navy header, readable body
 * Covers: Section 230 safe-harbor, UGC protections, platform immunity,
 *         analysis limitations, and anti-tortious-interference restrictions.
 */
import { Navbar } from "@/components/Navbar";
import { Link } from "wouter";

const EFFECTIVE_DATE = "June 1, 2025";
const LAST_UPDATED = "May 31, 2026";

export default function TermsOfService() {
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
            Terms of Service
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
            <LegalSection title="1. Acceptance of Terms">
              <p>
                By accessing or using TradeTrust AZ (the "Platform"), including
                any web, mobile, or API interface, you ("User") agree to be
                bound by these Terms of Service ("Terms") and our{" "}
                <Link
                  href="/legal/privacy"
                  className="underline"
                  style={{ color: "#14B8A6" }}
                >
                  Privacy Policy
                </Link>
                . If you do not agree to all of these Terms, you must not use
                the Platform.
              </p>
              <p>
                These Terms constitute a legally binding click-wrap agreement
                between you and TradeTrust AZ LLC ("Company," "we," "us," or
                "our"). Your continued use of the Platform after any
                modification to these Terms constitutes acceptance of the
                revised Terms.
              </p>
            </LegalSection>

            <LegalSection title="2. Description of Service">
              <p>
                TradeTrust AZ is an independent, automated pricing-analysis
                platform that compares contractor estimates and invoices against
                publicly available market-rate benchmarks for residential and
                commercial trade services in the State of Arizona. The Platform
                generates statistical variance reports ("Trust Score Reports")
                for informational purposes only.
              </p>
              <p>
                The Platform does not employ licensed contractors, attorneys, or
                financial advisors. Nothing on the Platform constitutes
                professional advice of any kind. Users are solely responsible
                for all decisions made in reliance on Platform output.
              </p>
            </LegalSection>

            <LegalSection title="3. Section 230 Safe Harbor — Platform Immunity">
              <p>
                TradeTrust AZ is an interactive computer service as defined
                under Section 230 of the Communications Decency Act, 47 U.S.C. §
                230 ("Section 230"). The Platform is not the author, creator, or
                publisher of any third-party content, contractor data, or
                user-submitted materials. All Trust Score Reports are generated
                through automated, algorithmic comparison of user-submitted
                documents against publicly available pricing benchmarks.
              </p>
              <p>
                Pursuant to Section 230(c)(1), TradeTrust AZ shall not be
                treated as the publisher or speaker of any information provided
                by another information content provider. The Company expressly
                disclaims liability for any claim arising from the publication,
                distribution, or display of third-party content, including
                contractor pricing data, user-submitted invoices, and
                algorithmically generated variance scores.
              </p>
              <p>
                Pursuant to Section 230(c)(2), the Company shall not be held
                liable for any action taken in good faith to restrict access to
                or availability of material that the Company considers to be
                obscene, lewd, lascivious, filthy, excessively violent,
                harassing, or otherwise objectionable.
              </p>
            </LegalSection>

            <LegalSection title="4. User-Generated Content and Submissions">
              <p>
                By uploading any document, invoice, estimate, photograph, or
                other material ("User Content") to the Platform, you represent
                and warrant that: (a) you own or have the legal right to submit
                such content; (b) the content does not violate any applicable
                law or third-party right; and (c) the content is accurate to the
                best of your knowledge.
              </p>
              <p>
                You grant TradeTrust AZ a non-exclusive, royalty-free, worldwide
                license to process, analyze, and store your User Content solely
                for the purpose of generating your Trust Score Report and
                improving Platform accuracy. We do not sell, license, or share
                your User Content with unverified third parties. See our{" "}
                <Link
                  href="/legal/privacy"
                  className="underline"
                  style={{ color: "#14B8A6" }}
                >
                  Privacy Policy
                </Link>{" "}
                for full data handling disclosures.
              </p>
              <p>
                The Company reserves the right to remove any User Content that
                violates these Terms or applicable law without prior notice.
              </p>
            </LegalSection>

            <LegalSection title="5. Automated Analysis Limitations and Disclaimer">
              <p>
                Trust Score Reports are generated by automated algorithms that
                compare submitted documents against publicly available
                market-rate data. Reports reflect statistical deviations from
                pricing norms and do not constitute: (a) evidence of fraud,
                intentional overcharging, or unlawful conduct by any contractor;
                (b) a determination of contractor negligence or incompetence; or
                (c) legal, financial, or professional advice of any kind.
              </p>
              <p>
                Local market conditions, project complexity, material
                availability, labor scarcity, and other legitimate factors may
                justify pricing that falls outside standard baseline models.
                Users acknowledge that a high variance score does not, by
                itself, establish wrongdoing. For formal disputes or legal
                claims, users must consult qualified legal counsel.
              </p>
              <p>
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
                LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
            </LegalSection>

            <LegalSection title="6. Prohibited Uses — Anti-Tortious Interference">
              <p>
                Users expressly agree that Platform data, Trust Score Reports,
                and any derivative outputs shall not be used for any of the
                following prohibited purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  Tortious interference with any contractor's business
                  relationships or prospective economic advantage;
                </li>
                <li>
                  Defamation, libel, or slander of any contractor, individual,
                  or business entity;
                </li>
                <li>
                  Harassment, intimidation, or extortion of any contractor or
                  third party;
                </li>
                <li>
                  Publication of Trust Score Reports as factual determinations
                  of fraud or illegality;
                </li>
                <li>
                  Any use that violates the Arizona Consumer Fraud Act (A.R.S. §
                  44-1521 et seq.) or any applicable federal or state law;
                </li>
                <li>
                  Automated scraping, bulk data extraction, or reverse
                  engineering of the Platform's scoring methodology;
                </li>
                <li>
                  Any commercial use of Platform output without express written
                  consent from TradeTrust AZ LLC.
                </li>
              </ul>
              <p className="mt-3">
                Violation of this section may result in immediate account
                termination and may expose the violating User to civil and
                criminal liability. TradeTrust AZ reserves the right to
                cooperate fully with law enforcement and civil litigation in
                connection with any such violation.
              </p>
            </LegalSection>

            <LegalSection title="7. Contractor Membership — Invoice Verification Protocol">
              <p>
                Contractors who subscribe to the Contractor Membership plan
                agree to the following additional terms as a condition of
                earning and maintaining the "TradeTrust Verified" badge:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  Contractors must upload final, itemized invoices for completed
                  jobs on a regular basis as determined by the Platform;
                </li>
                <li>
                  The TradeTrust Verified badge is awarded based on data
                  transparency and pricing consistency, not as a paid
                  endorsement;
                </li>
                <li>
                  The Company reserves the right to revoke the badge at any time
                  if submitted invoices reveal systematic pricing deviations;
                </li>
                <li>
                  Contractors may not represent the badge as a government
                  certification, license, or legal endorsement;
                </li>
                <li>
                  Submission of falsified or altered invoices constitutes fraud
                  and will result in immediate termination and referral to
                  appropriate authorities.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="8. Limitation of Liability">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, TRADETRUST AZ
                LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND LICENSORS
                SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO
                LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES,
                ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE PLATFORM,
                EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p>
                IN NO EVENT SHALL THE COMPANY'S TOTAL LIABILITY TO YOU FOR ALL
                CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE PLATFORM
                EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO THE COMPANY IN
                THE TWELVE MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED
                DOLLARS ($100.00).
              </p>
            </LegalSection>

            <LegalSection title="9. Indemnification">
              <p>
                You agree to indemnify, defend, and hold harmless TradeTrust AZ
                LLC and its affiliates, officers, directors, employees, and
                agents from and against any claims, liabilities, damages,
                judgments, awards, losses, costs, expenses, or fees (including
                reasonable attorneys' fees) arising out of or relating to: (a)
                your violation of these Terms; (b) your User Content; (c) your
                use of the Platform; or (d) your violation of any third-party
                right, including any intellectual property right or privacy
                right.
              </p>
            </LegalSection>

            <LegalSection title="10. Governing Law and Dispute Resolution">
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the State of Arizona, without regard to its
                conflict of law provisions. Any dispute arising out of or
                relating to these Terms or the Platform shall be resolved
                exclusively through binding arbitration administered by JAMS in
                Maricopa County, Arizona, under its Streamlined Arbitration
                Rules. You waive any right to a jury trial or class action
                proceeding.
              </p>
            </LegalSection>

            <LegalSection title="11. Modifications to Terms">
              <p>
                The Company reserves the right to modify these Terms at any
                time. Material changes will be communicated via email or
                prominent notice on the Platform at least fourteen (14) days
                before taking effect. Your continued use of the Platform after
                the effective date constitutes acceptance of the revised Terms.
              </p>
            </LegalSection>

            <LegalSection title="12. Contact Information">
              <p>
                For questions about these Terms, contact us at:{" "}
                <a
                  href="mailto:legal@tradetrustaz.com"
                  className="underline"
                  style={{ color: "#14B8A6" }}
                >
                  legal@tradetrustaz.com
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
                href="/legal/privacy"
                className="underline"
                style={{ color: "#14B8A6" }}
              >
                Privacy Policy →
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
