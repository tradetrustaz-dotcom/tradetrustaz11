/**
 * regionalBaseline.ts — TradeTrust AZ
 *
 * Default regional baseline thresholds for the scoring engine.
 * All dollar amounts represent the standard market range for the Phoenix / Tucson
 * metro areas, sourced from Arizona Registrar of Contractors permit data,
 * aggregated homeowner quote submissions, and industry cost databases.
 *
 * Variance Tier Definitions (Total Variance Percentage, V):
 *   Green  — Within Standard Range:  V = 0–15%   above regional baseline
 *   Yellow — Moderate Deviation:     V = 16–40%  above regional baseline
 *   Red    — High Variance Index:    V > 40%     above regional baseline
 *             OR: unitemized bulk sum where labor and materials are completely locked
 *
 * Score mapping (0–100 trust score → deviation tier):
 *   85–100 → Within Standard Range  (green,  #10B981)
 *   50–84  → Moderate Deviation     (amber,  #F59E0B)
 *   0–49   → High Variance Index    (red,    #EF4444)
 *
 * Data is for informational purposes only. Baselines are updated quarterly.
 * Last updated: Q2 2025
 */

export interface BaselineEntry {
  jobType: string;
  region: "Phoenix Metro" | "Tucson Metro" | "Statewide AZ";
  /** Standard labor rate range ($/hr) for this trade */
  laborRateRange: [number, number];
  /** Standard dispatch / diagnostic fee range ($) */
  dispatchFeeRange: [number, number];
  /** Flag: dispatch fee waived only upon repair = Conditional Diagnostic Premium */
  conditionalDispatchFlag: boolean;
  /** Typical job cost range ($) for a standard residential unit */
  jobCostRange: [number, number];
  /** Standard material markup over wholesale (%) */
  materialMarkupRange: [number, number];
  /** Variance tier thresholds (%) — deviation from jobCostRange high end */
  varianceTiers: {
    withinStandard: number;   // 0 to this % = green
    moderateDeviation: number; // withinStandard+1 to this % = yellow
    // above moderateDeviation = red (High Variance Index)
  };
  notes: string;
}

/**
 * Default baseline database — Phoenix and Tucson metro areas.
 * These values seed the scoring engine until live permit/quote data is ingested.
 */
export const REGIONAL_BASELINES: BaselineEntry[] = [
  // ─── HVAC ───────────────────────────────────────────────────────────────────
  {
    jobType: "HVAC System Replacement (3–5 ton residential)",
    region: "Phoenix Metro",
    laborRateRange: [85, 120],
    dispatchFeeRange: [75, 150],
    conditionalDispatchFlag: true,
    jobCostRange: [5800, 8500],
    materialMarkupRange: [15, 20],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "Includes equipment, labor, refrigerant, and permit. Excludes ductwork replacement. Seasonal demand surges (Jun–Aug) may add 8–12% to labor.",
  },
  {
    jobType: "HVAC System Replacement (3–5 ton residential)",
    region: "Tucson Metro",
    laborRateRange: [75, 110],
    dispatchFeeRange: [65, 130],
    conditionalDispatchFlag: true,
    jobCostRange: [5200, 7800],
    materialMarkupRange: [15, 20],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "Tucson market runs 8–12% below Phoenix metro due to lower overhead costs.",
  },
  {
    jobType: "HVAC Repair (capacitor, contactor, refrigerant recharge)",
    region: "Phoenix Metro",
    laborRateRange: [85, 120],
    dispatchFeeRange: [75, 150],
    conditionalDispatchFlag: true,
    jobCostRange: [150, 650],
    materialMarkupRange: [20, 35],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "Refrigerant recharge (R-410A) adds $100–$200. Dispatch fee should be waived or credited toward repair cost.",
  },
  {
    jobType: "HVAC Diagnostic / Service Call",
    region: "Phoenix Metro",
    laborRateRange: [85, 120],
    dispatchFeeRange: [75, 150],
    conditionalDispatchFlag: true,
    jobCostRange: [75, 150],
    materialMarkupRange: [0, 0],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "Conditional Diagnostic Premium trigger: fee NOT waived upon repair = flag as CDP.",
  },

  // ─── PLUMBING ────────────────────────────────────────────────────────────────
  {
    jobType: "Water Heater Replacement (40–50 gal tank, standard)",
    region: "Phoenix Metro",
    laborRateRange: [90, 130],
    dispatchFeeRange: [65, 125],
    conditionalDispatchFlag: true,
    jobCostRange: [1400, 2200],
    materialMarkupRange: [15, 25],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "Includes unit, labor, expansion tank, and permit. Tankless units add $800–$1,500.",
  },
  {
    jobType: "Water Heater Replacement (40–50 gal tank, standard)",
    region: "Tucson Metro",
    laborRateRange: [80, 115],
    dispatchFeeRange: [55, 110],
    conditionalDispatchFlag: true,
    jobCostRange: [1200, 1900],
    materialMarkupRange: [15, 25],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "Tucson market runs 10–15% below Phoenix metro.",
  },
  {
    jobType: "Drain Clearing / Hydro-Jetting",
    region: "Phoenix Metro",
    laborRateRange: [90, 130],
    dispatchFeeRange: [65, 125],
    conditionalDispatchFlag: true,
    jobCostRange: [150, 500],
    materialMarkupRange: [10, 20],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "Hydro-jetting (camera + jetting) ranges $350–$700. Camera-only inspection: $100–$250.",
  },
  {
    jobType: "Toilet Replacement (standard residential)",
    region: "Phoenix Metro",
    laborRateRange: [90, 130],
    dispatchFeeRange: [65, 125],
    conditionalDispatchFlag: false,
    jobCostRange: [350, 700],
    materialMarkupRange: [15, 25],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "Includes unit and labor. High-efficiency or comfort-height units add $100–$200.",
  },
  {
    jobType: "Slab Leak Detection & Repair",
    region: "Phoenix Metro",
    laborRateRange: [95, 145],
    dispatchFeeRange: [75, 150],
    conditionalDispatchFlag: true,
    jobCostRange: [1800, 4500],
    materialMarkupRange: [15, 25],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "High variance job type. Detection alone: $200–$400. Epoxy pipe lining adds $1,000–$3,000.",
  },

  // ─── ELECTRICAL ──────────────────────────────────────────────────────────────
  {
    jobType: "Electrical Panel Upgrade (100A to 200A)",
    region: "Phoenix Metro",
    laborRateRange: [95, 140],
    dispatchFeeRange: [75, 150],
    conditionalDispatchFlag: false,
    jobCostRange: [2500, 4000],
    materialMarkupRange: [15, 20],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "Includes panel, labor, and permit. Utility company coordination may add 1–2 weeks.",
  },
  {
    jobType: "Outlet / Switch Replacement",
    region: "Phoenix Metro",
    laborRateRange: [95, 140],
    dispatchFeeRange: [75, 150],
    conditionalDispatchFlag: true,
    jobCostRange: [100, 300],
    materialMarkupRange: [20, 35],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "GFCI outlets add $25–$50 per unit. Aluminum wiring remediation is a separate, higher-cost job.",
  },

  // ─── ROOFING ─────────────────────────────────────────────────────────────────
  {
    jobType: "Roof Replacement (asphalt shingle, 1,500–2,000 sq ft)",
    region: "Phoenix Metro",
    laborRateRange: [80, 110],
    dispatchFeeRange: [0, 0],
    conditionalDispatchFlag: false,
    jobCostRange: [8500, 14000],
    materialMarkupRange: [15, 25],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "Tile roofing adds 30–50%. Post-storm demand surges may add 10–20% to labor.",
  },
  {
    jobType: "Roof Repair (patch, flashing, minor leak)",
    region: "Phoenix Metro",
    laborRateRange: [80, 110],
    dispatchFeeRange: [75, 150],
    conditionalDispatchFlag: true,
    jobCostRange: [300, 1200],
    materialMarkupRange: [20, 35],
    varianceTiers: { withinStandard: 15, moderateDeviation: 40 },
    notes: "Inspection fee should be credited toward repair. Full replacement recommendation on a repairable roof is a High Variance Index signal.",
  },
];

/**
 * Lookup helper: find the best matching baseline for a given job type and region.
 * Returns the first match by partial job type string (case-insensitive).
 */
export function findBaseline(
  jobType: string,
  region: "Phoenix Metro" | "Tucson Metro" | "Statewide AZ" = "Phoenix Metro"
): BaselineEntry | undefined {
  const normalized = jobType.toLowerCase();
  return REGIONAL_BASELINES.find(
    (b) =>
      b.region === region &&
      b.jobType.toLowerCase().includes(normalized.split(" ")[0])
  );
}

/**
 * Calculate the Baseline Deviation Percentage (V) for a given quote amount.
 * V = ((quoteAmount - baselineHigh) / baselineHigh) * 100
 * Returns 0 if quote is at or below the baseline high end.
 */
export function calcBaselineDeviation(
  quoteAmount: number,
  baselineHigh: number
): number {
  if (quoteAmount <= baselineHigh) return 0;
  return Math.round(((quoteAmount - baselineHigh) / baselineHigh) * 100);
}

/**
 * Map a Baseline Deviation Percentage to a variance tier and UI color.
 */
export function getVarianceTier(deviationPercent: number): {
  tier: "within_standard" | "moderate_deviation" | "high_variance_index";
  label: string;
  color: string;
  uiText: string;
} {
  if (deviationPercent <= 15) {
    return {
      tier: "within_standard",
      label: "Within Standard Range",
      color: "#10B981",
      uiText: "Pricing aligns with standard regional operational margins.",
    };
  }
  if (deviationPercent <= 40) {
    return {
      tier: "moderate_deviation",
      label: "Moderate Deviation",
      color: "#F59E0B",
      uiText: "Ancillary cost variance detected. Line-item premiums exceed standard regional averages.",
    };
  }
  return {
    tier: "high_variance_index",
    label: "High Variance Index",
    color: "#EF4444",
    uiText: "Significant pricing variance. Documented costs reflect a high baseline deviation index.",
  };
}
