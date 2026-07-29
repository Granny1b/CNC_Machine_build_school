/**
 * Unit and number formatting. SPEC.md rule 5: SI by default, shop units shown
 * alongside where they are genuinely conventional.
 */

/**
 * Round to `digits` significant figures. Calculator outputs use this rather
 * than fixed decimals so that 0.0413 and 4130 both read sensibly.
 */
export function significant(value: number, digits = 3): number {
  if (!Number.isFinite(value) || value === 0) return 0;
  const magnitude = Math.ceil(Math.log10(Math.abs(value)));
  const factor = Math.pow(10, digits - magnitude);
  return Math.round(value * factor) / factor;
}

/** Format a number for display with thousands separators and tabular digits. */
export function formatNumber(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = significant(value, digits);
  const decimals =
    Math.abs(rounded) >= 100 ? 0 : Math.abs(rounded) >= 10 ? 1 : Math.abs(rounded) >= 1 ? 2 : 4;
  return rounded.toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/** Format with a fixed number of decimal places, for coordinate readouts. */
export function formatFixed(value: number, decimals = 3): string {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(decimals);
}

/**
 * Parse a user-typed field. Returns `null` for anything that is not a finite
 * number so callers can distinguish "empty" from "zero".
 */
export function parseNumeric(input: string): number | null {
  const trimmed = input.trim().replace(",", ".");
  if (trimmed === "") return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

/** rev/min is the shop unit; SPEC rule 5 asks for the SI relationship alongside. */
export const RPM_TO_RAD_PER_S = (2 * Math.PI) / 60; // ≈ 0.10472

export function rpmToRadPerSecond(rpm: number): number {
  return rpm * RPM_TO_RAD_PER_S;
}

/** Standard gravity, used by the axis-sizing calculator. */
export const G = 9.80665; // m/s²

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Title-cased tier label, e.g. "foundation" -> "Foundations". */
export const TIER_LABELS = {
  foundation: "Foundations",
  mechanical: "Mechanical design",
  control: "Drives and control",
  practice: "Proving and building",
} as const;

export function pluralise(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}
