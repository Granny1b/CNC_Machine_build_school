"use client";

import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import { formatFixed } from "@/lib/format";
import { formatCalcValue } from "@/lib/machining";
import type { MotionProfile, ProfilePoint } from "@/lib/axis-sizing";

/**
 * The trapezoidal velocity profile. SPEC section 9.3 — the only use of the
 * charting library in Phase 1, because this is a genuine engineering graph
 * rather than decoration.
 *
 * Design notes: axis ticks are mono, the trace is `blue`, and there are no
 * gridlines. Animation is off entirely, so there is nothing for
 * `prefers-reduced-motion` to suppress. The shape is described in words for
 * anyone who cannot see the line.
 */

/** Tailwind tokens from tailwind.config.ts. Recharts needs concrete SVG values. */
const TOKENS = {
  blue: "#17395B",
  blueBright: "#2E90C4",
  inkSoft: "#54626E",
  rule: "#D2D8D5",
  ruleStrong: "#B4BDB8",
  paperRaised: "#FFFFFF",
} as const;

const MONO_TICK = {
  fontFamily: "IBM Plex Mono, ui-monospace, monospace",
  fontSize: 11,
  fill: TOKENS.inkSoft,
} as const;

export interface MotionProfileChartProps {
  profile: MotionProfile;
  /** The speed that was asked for, m/s — drawn as a target on a short move. */
  commandedSpeed: number;
  className?: string;
}

function describe(profile: MotionProfile, commandedSpeed: number): string {
  if (profile.points.length === 0) {
    return "No profile yet: travel, speed and acceleration all need to be greater than zero.";
  }

  const peak = formatCalcValue(profile.peakSpeed);
  const total = formatCalcValue(profile.totalTime);
  const ramp = formatCalcValue(profile.rampTime);

  if (profile.shape === "triangular") {
    return (
      `Line chart of axis speed against time, shaped as a triangle. Speed rises in a straight line from rest to a peak of ${peak} metres per second after ${ramp} seconds, ` +
      `then falls in a straight line back to rest at ${total} seconds. The axis never reaches the ${formatCalcValue(commandedSpeed)} metres per second commanded, because the travel is too short.`
    );
  }

  return (
    `Line chart of axis speed against time, shaped as a trapezium. Speed rises in a straight line from rest to ${peak} metres per second over ${ramp} seconds, ` +
    `holds steady for ${formatCalcValue(profile.cruiseTime)} seconds, then falls in a straight line back to rest, reaching standstill at ${total} seconds. ` +
    "The two sloping sides are the acceleration and deceleration ramps; their slope is the acceleration."
  );
}

function ProfileTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload as ProfilePoint;

  return (
    <div className="rounded-sm border border-rule-strong bg-paper-raised px-3 py-2 shadow-panel">
      <p className="font-mono text-[12px] tabular-nums text-ink">
        t = {formatFixed(point.t, 3)} s
      </p>
      <p className="font-mono text-[12px] tabular-nums text-blue-deep">
        v = {formatFixed(point.v, 3)} m/s
      </p>
      <p className="mt-0.5 font-mono text-[11px] tabular-nums text-ink-soft">
        {formatCalcValue(point.v * 60)} m/min
      </p>
    </div>
  );
}

export function MotionProfileChart({
  profile,
  commandedSpeed,
  className = "",
}: MotionProfileChartProps) {
  const description = describe(profile, commandedSpeed);
  const showTarget =
    profile.shape === "triangular" && Number.isFinite(commandedSpeed) && commandedSpeed > 0;
  const yMax = Math.max(profile.peakSpeed, showTarget ? commandedSpeed : 0) * 1.12;

  return (
    <figure className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="eyebrow">Velocity profile · v (m/s)</p>
        <p className="eyebrow">
          {profile.shape === "triangular" ? "Triangular — speed not reached" : "Trapezoidal"}
        </p>
      </div>

      {profile.points.length === 0 ? (
        <div className="mt-2 flex h-48 items-center justify-center rounded-sm border border-rule bg-paper-sunk px-6">
          <p className="text-center text-[14px] leading-snug text-ink-soft">{description}</p>
        </div>
      ) : (
        // The wrapper carries role="img" and the whole description, so the
        // chart's own children are presentational to assistive technology.
        // Recharts' `accessibilityLayer` is deliberately not enabled: it adds a
        // focusable element, and the img role makes descendants unreachable.
        <div
          role="img"
          aria-label={description}
          className="mt-2 h-52 w-full rounded-sm border border-rule bg-paper-raised py-3 pr-3 sm:h-60"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profile.points} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <XAxis
                dataKey="t"
                type="number"
                domain={[0, profile.totalTime]}
                tickFormatter={(value: number) => formatFixed(value, 2)}
                tick={MONO_TICK}
                tickLine={{ stroke: TOKENS.rule }}
                axisLine={{ stroke: TOKENS.ruleStrong }}
                height={26}
              />
              <YAxis
                type="number"
                domain={[0, yMax]}
                tickFormatter={(value: number) => formatFixed(value, 2)}
                tick={MONO_TICK}
                tickLine={{ stroke: TOKENS.rule }}
                axisLine={{ stroke: TOKENS.ruleStrong }}
                width={48}
              />
              {showTarget ? (
                <ReferenceLine
                  y={commandedSpeed}
                  stroke={TOKENS.ruleStrong}
                  strokeDasharray="4 4"
                  ifOverflow="extendDomain"
                />
              ) : null}
              <Tooltip
                content={<ProfileTooltip />}
                cursor={{ stroke: TOKENS.blueBright, strokeWidth: 1, strokeDasharray: "3 3" }}
              />
              <Line
                type="linear"
                dataKey="v"
                stroke={TOKENS.blue}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: TOKENS.blueBright, stroke: TOKENS.paperRaised }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="eyebrow">t (s) →</span>
        <span className="text-[13px] leading-snug text-ink-soft">
          Area under the line is the distance travelled; the slope of each ramp is the acceleration.
          {showTarget
            ? " The dashed line is the speed you asked for, which this move is too short to reach."
            : ""}
        </span>
      </figcaption>
    </figure>
  );
}
