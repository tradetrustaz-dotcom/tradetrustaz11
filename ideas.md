# TradeTrust AZ — Design Ideas

## Chosen Approach: "Precision Trust" — Data-Driven Authority with Desert Warmth

**Design Movement:** Neo-Brutalist Data Dashboard meets Southwest Warmth

**Core Principles:**
1. Data speaks first — numbers, scores, and comparisons are the hero elements
2. Asymmetric tension — left-anchored headlines, offset visual elements, deliberate imbalance
3. Tactile depth — subtle grain texture on dark sections, hard-edge shadows on cards
4. Desert-rooted warmth — teal and orange as functional signals (good/bad), not decoration

**Color Philosophy:**
- Deep navy (#0F172A) as the primary canvas — communicates authority and seriousness
- Teal (#14B8A6) as the "safe/trusted/good" signal — used for high scores and CTAs
- Warning orange (#F97316) as the "caution/overpriced" signal — used for low scores and flags
- Off-white (#F8FAFC) for content sections — breathing room between dark blocks
- Subtle warm gray (#94A3B8) for secondary text

**Layout Paradigm:**
- Left-anchored hero with large score gauge floating right (asymmetric split)
- Trust bar as a full-width dark ribbon between sections
- Cards with hard left-border accent (4px teal or orange) instead of uniform rounded corners
- Diagonal section dividers using clip-path for energy and movement
- Dashboard uses left sidebar + main content area

**Signature Elements:**
1. The animated circular Trust Score gauge — the product's icon, appears in hero and report
2. Hard-edge accent borders on cards (left border only, colored by score)
3. Arizona sun motif as a subtle background pattern in hero

**Interaction Philosophy:**
- Upload zone has generous drag-target with dashed border that glows teal on hover
- Score gauge animates from 0 to final value with a satisfying deceleration
- Processing screen has typewriter-style messages cycling through fun copy
- All CTAs have scale(0.97) press feedback

**Animation:**
- Score gauge: 1.2s ease-out arc draw from 0
- Section entrances: fade-up 40px, 400ms, staggered 80ms per item
- Upload hover: border color transition 200ms + subtle scale(1.02)
- Processing messages: typewriter effect, 60ms per character

**Typography System:**
- Display/Headlines: Space Grotesk (bold, geometric, modern authority)
- Body/UI: Inter (clean, readable, trustworthy)
- Monospace/Numbers: JetBrains Mono (for score numbers and price comparisons)

---

## Routes & Components

### Routes
- `/` — Landing page (public)
- `/demo` — Interactive demo flow (no auth)
- `/dashboard` — My Reports (mock auth state)
- `/report/:id` — Individual report view

### Key Components
- `Navbar` — Logo + nav links + CTA
- `HeroSection` — Headline + CTA + trust bar
- `HowItWorks` — 3-step section
- `TrustScoreExplainer` — Score factors with progress bars
- `Vignettes` — 3 story cards
- `WhyDifferent` — Comparison table
- `PrivacySection` — Privacy reassurance
- `FinalCTA` — Bottom conversion section
- `Footer` — Legal + attribution
- `TrustScoreGauge` — Animated SVG arc gauge (reusable)
- `DemoModal` — Full demo flow in modal/slide-in
- `ProcessingScreen` — Animated loading with fun copy
- `ReportView` — Full report layout
- `Dashboard` — My Reports list
