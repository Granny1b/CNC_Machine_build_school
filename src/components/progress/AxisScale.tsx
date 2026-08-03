import { clamp } from "@/lib/format";

/**
 * The signature element. SPEC.md section 5.3.
 *
 * Progress is a linear scale with a carriage, not a progress bar or a ring.
 * Levels are graduation marks along a travel axis, the learner's position is a
 * saddle riding the rail, and a mono readout reports position in the manner of
 * a digital readout.
 *
 * Below 480px the graduated rail is replaced by a simple labelled bar, and the
 * carriage transition is dropped under `prefers-reduced-motion`.
 */
export interface AxisScaleProps {
  /** Highest level reached. 0 means nothing completed yet. */
  currentLevel: number;
  /** Total travel in levels. */
  totalLevels?: number;
  /**
   * Fine position along the travel as 0–1. Supply the lesson-level fraction so
   * the carriage sits between graduations mid-level. Falls back to
   * `currentLevel / totalLevels`.
   */
  fraction?: number;
  /** Readout label. "LEVEL" reads as a DRO axis name. */
  label?: string;
  /** Minor ticks per major graduation. 2 puts one lesson tick between levels. */
  minorPerMajor?: number;
  /** Hide the mono readout when the caller prints its own. */
  showReadout?: boolean;
  size?: "sm" | "md";
  className?: string;
}

function pad(n: number): string {
  return String(Math.max(0, Math.round(n))).padStart(2, "0");
}

export function AxisScale({
  currentLevel,
  totalLevels = 20,
  fraction,
  label = "Level",
  minorPerMajor = 2,
  showReadout = true,
  size = "md",
  className = "",
}: AxisScaleProps) {
  const total = Math.max(1, totalLevels);
  const level = clamp(currentLevel, 0, total);
  const position = clamp(fraction ?? level / total, 0, 1);
  const percent = position * 100;

  const railHeight = size === "sm" ? "h-[3px]" : "h-[4px]";
  const majorHeight = size === "sm" ? 9 : 12;
  const minorHeight = size === "sm" ? 5 : 7;

  const majors = Array.from({ length: total + 1 }, (_, i) => i);
  const minors: number[] = [];
  for (let i = 0; i < total; i += 1) {
    for (let m = 1; m < minorPerMajor; m += 1) {
      minors.push(i + m / minorPerMajor);
    }
  }

  // Label only the round graduations, otherwise 20 numbers collide at 480px.
  const labelled = new Set([0, Math.round(total / 4), Math.round(total / 2), Math.round((total * 3) / 4), total]);

  const readoutText = `${label.toUpperCase()} ${pad(level)} / ${pad(total)}`;
  const ariaLabel = `${label} ${level} of ${total}, ${Math.round(percent)} percent of the travel complete`;

  return (
    <div className={className}>
      {/* Graduated rail — 480px and up. */}
      <div className="hidden xs:block">
        <div
          role="img"
          aria-label={ariaLabel}
          className="relative select-none"
          style={{ paddingTop: majorHeight + 14, paddingBottom: 18 }}
        >
          {/* Graduations, drawn above the rail like a machine scale. */}
          <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height: majorHeight + 14 }}>
            {minors.map((m) => (
              <span
                key={`minor-${m}`}
                aria-hidden="true"
                className="absolute bottom-0 w-px bg-rule-strong"
                style={{ left: `${(m / total) * 100}%`, height: minorHeight }}
              />
            ))}
            {majors.map((n) => {
              const done = n <= level;
              return (
                <span key={`major-${n}`}>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 w-px ${done ? "bg-blue" : "bg-rule-strong"}`}
                    style={{ left: `${(n / total) * 100}%`, height: majorHeight }}
                  />
                  {labelled.has(n) ? (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 -translate-x-1/2 font-mono text-[10px] tabular-nums text-ink-soft"
                      style={{ left: `${(n / total) * 100}%`, bottom: majorHeight + 3 }}
                    >
                      {n}
                    </span>
                  ) : null}
                </span>
              );
            })}
          </div>

          {/* The rail: completed span in blue, remaining travel in rule. */}
          <div className={`relative w-full rounded-full bg-rule ${railHeight}`}>
            <div
              className={`absolute left-0 top-0 rounded-full bg-blue ${railHeight} transition-[width] duration-500 ease-out motion-reduce:transition-none`}
              style={{ width: `${percent}%` }}
            />

            {/* The carriage: a saddle riding the rail, drawn in ink. */}
            <span
              aria-hidden="true"
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-500 ease-out motion-reduce:transition-none"
              style={{ left: `${percent}%` }}
            >
              <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
                <path
                  d="M4 4.5h18l2.5 6.5H1.5L4 4.5Z"
                  fill="#0F141A"
                  stroke="#0F141A"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
                <path d="M13 0.5V4" stroke="#0F141A" strokeWidth="1.25" />
                <path d="M13 11v8.5" stroke="#2E90C4" strokeWidth="1.25" />
              </svg>
            </span>
          </div>

          {showReadout ? (
            <p className="absolute inset-x-0 -bottom-1 mt-2 font-mono text-[11px] uppercase tracking-eyebrow tabular-nums text-ink-soft">
              {readoutText}
            </p>
          ) : null}
        </div>
      </div>

      {/* Under 480px: a simple labelled bar, per SPEC 5.3. */}
      <div className="xs:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-eyebrow tabular-nums text-ink-soft">
            {readoutText}
          </span>
          <span className="font-mono text-[11px] tabular-nums text-ink-soft">
            {Math.round(percent)}%
          </span>
        </div>
        <div
          role="img"
          aria-label={ariaLabel}
          className={`mt-2 w-full rounded-full bg-rule ${railHeight}`}
        >
          <div
            className={`rounded-full bg-blue ${railHeight} transition-[width] duration-500 ease-out motion-reduce:transition-none`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
