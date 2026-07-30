"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Readout, SelectField } from "@/components/ui/Field";
import { parseNumeric } from "@/lib/format";
import {
  AXIS_ESTIMATE_NOTE,
  AXIS_EXCLUSIONS,
  AXIS_FORMULA,
  AXIS_SI_NOTE,
  AXIS_WORKED_EXAMPLE,
  AXIS_WORKED_GIVENS,
  AXIS_WORKED_INTRO,
  AXIS_WORKED_STEPS,
  VERTICAL_AXIS_SAFETY,
  axisResults,
  axisWarnings,
  formatInertia,
  type AxisInputs,
  type AxisOrientation,
} from "@/lib/axis-sizing";
import { formatCalcValue } from "@/lib/machining";
import { CalcField, CalcWarnings, EstimateNote, WorkedExample } from "./CalcField";
import { FormulaCard } from "./FormulaCard";
import { MotionProfileChart } from "./MotionProfileChart";

/**
 * A first estimate of what a feed drive has to produce. SPEC section 9.2.
 *
 * All maths lives in `@/lib/axis-sizing`; this component holds the raw text of
 * each field and lays the answers out. The default state is the course's
 * canonical worked example, so the panel opens reproducing the numbers the
 * lessons quote.
 */

type NumericKey = Exclude<keyof AxisInputs, "orientation">;
type Draft = Record<NumericKey, string>;

function draftFrom(inputs: AxisInputs): Draft {
  return {
    mass: String(inputs.mass),
    speed: String(inputs.speed),
    acceleration: String(inputs.acceleration),
    travel: String(inputs.travel),
    externalForce: String(inputs.externalForce),
    lead: String(inputs.lead),
    efficiency: String(inputs.efficiency),
    friction: String(inputs.friction),
  };
}

const numeric = (raw: string): number => parseNumeric(raw) ?? Number.NaN;

const ORIENTATIONS: { value: AxisOrientation; label: string }[] = [
  { value: "horizontal", label: "Horizontal — θ = 0°" },
  { value: "vertical", label: "Vertical — θ = 90°" },
];

export function AxisSizingCalculator({ compact = false }: { compact?: boolean }) {
  const [draft, setDraft] = useState<Draft>(() => draftFrom(AXIS_WORKED_EXAMPLE));
  const [orientation, setOrientation] = useState<AxisOrientation>(
    AXIS_WORKED_EXAMPLE.orientation,
  );

  const update = (key: NumericKey) => (raw: string) =>
    setDraft((previous) => ({ ...previous, [key]: raw }));

  function reset() {
    setDraft(draftFrom(AXIS_WORKED_EXAMPLE));
    setOrientation(AXIS_WORKED_EXAMPLE.orientation);
  }

  const inputs = useMemo<AxisInputs>(
    () => ({
      mass: numeric(draft.mass),
      speed: numeric(draft.speed),
      acceleration: numeric(draft.acceleration),
      travel: numeric(draft.travel),
      externalForce: numeric(draft.externalForce),
      lead: numeric(draft.lead),
      efficiency: numeric(draft.efficiency),
      friction: numeric(draft.friction),
      orientation,
    }),
    [draft, orientation],
  );

  const results = useMemo(() => axisResults(inputs), [inputs]);
  const warnings = useMemo(() => axisWarnings(inputs, results), [inputs, results]);

  const breakdown = [
    { symbol: "F_a", label: "accelerate the mass", value: formatCalcValue(results.accelerationForce, 4) },
    { symbol: "F_f", label: "guideway friction", value: formatCalcValue(results.frictionForce, 3) },
    { symbol: "F_g", label: "weight along the travel", value: formatCalcValue(results.gravityForce, 3) },
    { symbol: "F_ext", label: "the cut pushing back", value: formatCalcValue(inputs.externalForce, 4) },
  ];

  const conversions = [
    `F   ${formatCalcValue(results.thrust, 4)} N`,
    `T   ${formatCalcValue(results.torque)} N·m`,
    `n   ${formatCalcValue(results.motorSpeed, 4)} rev/min  =  ${formatCalcValue(results.motorAngular)} rad/s`,
    `J   ${formatInertia(results.loadInertia)} kg·m²`,
    `t   ${formatCalcValue(results.moveTime)} s`,
    `v   ${formatCalcValue(inputs.speed, 4)} m/min  =  ${formatCalcValue(results.speedSi)} m/s`,
    `P   ${formatCalcValue(inputs.lead, 4)} mm  =  ${formatCalcValue(results.leadSi)} m for torque and inertia`,
    `m × g  =  ${formatCalcValue(results.weight, 4)} N carried by the guideways`,
    "1 rev/min = 2π / 60 rad/s ≈ 0.105 rad/s",
  ];

  return (
    <section id="axis-sizing" className="scroll-mt-24">
      {compact ? null : (
        <div className="mb-6">
          <p className="eyebrow">Calculator two · Thrust, torque, speed and inertia</p>
          <h2 className="mt-2 text-[26px] font-bold sm:text-[32px]">Axis-sizing calculator</h2>
          <p className="measure mt-3 text-[16px] leading-[1.65] text-ink-soft">
            Four demands add up to the force a feed drive must produce: accelerating the moving
            mass, dragging it along the guideways, holding it up if the axis stands vertical, and
            resisting the cut. Which of them dominates tells you what kind of machine you are
            designing — and that matters far more than the motor part number at the end.
          </p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-6">
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <p className="eyebrow">Inputs</p>
              <p className="mt-1.5 text-[14px] leading-snug text-ink-soft">
                Set to the worked example: the horizontal X axis of a small vertical machining
                centre.
              </p>
            </CardHeader>
            <CardBody className="space-y-4">
              <CalcField
                label="Moving mass"
                symbol="m"
                unit="kg"
                step={5}
                value={draft.mass}
                onChange={update("mass")}
                hint="everything the drive actually moves: table, saddle, fixture and workpiece together"
              />
              <div className="grid gap-4 xs:grid-cols-2">
                <CalcField
                  label="Traverse speed"
                  symbol="v"
                  unit="m/min"
                  step={1}
                  value={draft.speed}
                  onChange={update("speed")}
                  hint="the rapid speed the axis has to reach"
                />
                <CalcField
                  label="Acceleration"
                  symbol="a"
                  unit="m/s²"
                  step={0.1}
                  value={draft.acceleration}
                  onChange={update("acceleration")}
                  hint="how briskly it gets there; on short moves this buys far more time than top speed does"
                />
              </div>
              <div className="grid gap-4 xs:grid-cols-2">
                <CalcField
                  label="Travel"
                  symbol="L"
                  unit="mm"
                  step={10}
                  value={draft.travel}
                  onChange={update("travel")}
                  hint="length of the move being timed, end to end"
                />
                <CalcField
                  label="Process force"
                  symbol="F_ext"
                  unit="N"
                  step={50}
                  allowZero
                  value={draft.externalForce}
                  onChange={update("externalForce")}
                  hint="the cut pushing back along this axis; zero while the axis is only positioning"
                />
              </div>
              <div className="grid gap-4 xs:grid-cols-2">
                <CalcField
                  label="Screw lead"
                  symbol="P"
                  unit="mm"
                  step={1}
                  value={draft.lead}
                  onChange={update("lead")}
                  hint="how far the axis advances for one turn of the screw"
                />
                <CalcField
                  label="Efficiency"
                  symbol="η"
                  step={0.01}
                  max={1}
                  value={draft.efficiency}
                  onChange={update("efficiency")}
                  outOfRangeMessage="Efficiency is a fraction between zero and one. Above one the screw would give out more than it takes in."
                  hint="the fraction of the work put into the screw that arrives as useful thrust; the rest becomes heat"
                />
              </div>
              <div className="grid gap-4 xs:grid-cols-2">
                <CalcField
                  label="Friction coefficient"
                  symbol="μ"
                  step={0.001}
                  allowZero
                  value={draft.friction}
                  onChange={update("friction")}
                  hint="how much drag the guideways add; rolling elements are low, sliding ways far higher"
                />
                <SelectField
                  label="Orientation"
                  value={orientation}
                  onChange={(value) => setOrientation(value as AxisOrientation)}
                  options={ORIENTATIONS}
                  hint={
                    <>
                      <span className="font-mono font-medium text-ink">θ</span>
                      <span aria-hidden="true"> · </span>a vertical axis has to hold its own weight
                      up, even at standstill
                    </>
                  }
                />
              </div>
              <div className="flex justify-end border-t border-rule pt-4">
                <Button variant="secondary" size="sm" onClick={reset}>
                  Reset to the worked example
                </Button>
              </div>
            </CardBody>
          </Card>

          <FormulaCard formula={AXIS_FORMULA} />
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <p className="eyebrow">Results</p>
              <p className="mt-1.5 text-[14px] leading-snug text-ink-soft">
                Thrust, torque and speed are what a motor is selected against; reflected inertia is
                what decides whether the axis can be tuned to behave.
              </p>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Readout
                  label="Total thrust"
                  value={formatCalcValue(results.thrust, 4)}
                  unit="N"
                  emphasis
                  meaning="The force the drive must produce at the nut. Read the breakdown below it: whichever term dominates is the one worth arguing about."
                />
                <Readout
                  label="Screw torque"
                  value={formatCalcValue(results.torque)}
                  unit="N·m"
                  emphasis
                  meaning="Torque at the screw shaft. With a motor coupled straight to the screw this is what the motor must produce; through a belt or gearbox, divide by the ratio and remember the ratio multiplies the speed."
                />
                <Readout
                  label="Screw speed"
                  value={formatCalcValue(results.motorSpeed, 4)}
                  unit="rev/min"
                  emphasis
                  meaning="How fast the screw must turn at full traverse. On many axes it is this, rather than torque, that rules a candidate motor out."
                />
                <Readout
                  label="Reflected load inertia"
                  value={formatInertia(results.loadInertia)}
                  unit="kg·m²"
                  meaning="The moving mass as the motor feels it: a flywheel on its own shaft. Compare it with the motor's rotor inertia — that ratio is what decides how tunable the axis will be."
                />
                <Readout
                  label="Move time"
                  value={formatCalcValue(results.moveTime)}
                  unit="s"
                  meaning="One move from standstill to standstill, including both ramps, taken from the trapezoidal formula. The chart below shows the shape it assumes."
                />
              </div>

              <div className="rounded-sm border border-rule bg-paper-sunk px-4 py-3">
                <p className="eyebrow">Where the thrust comes from</p>
                <dl className="mt-2 space-y-1">
                  {breakdown.map((row) => (
                    <div key={row.symbol} className="flex items-baseline gap-2">
                      <dt className="w-14 shrink-0 font-mono text-[12px] font-medium text-blue">
                        {row.symbol}
                      </dt>
                      <dd className="num min-w-[5.5rem] text-[12px] text-ink">{row.value} N</dd>
                      <dd className="text-[13px] leading-snug text-ink-soft">{row.label}</dd>
                    </div>
                  ))}
                  <div className="flex items-baseline gap-2 border-t border-rule pt-1.5">
                    <dt className="w-14 shrink-0 font-mono text-[12px] font-medium text-blue">F</dt>
                    <dd className="num min-w-[5.5rem] text-[12px] font-medium text-blue-deep">
                      {formatCalcValue(results.thrust, 4)} N
                    </dd>
                    <dd className="text-[13px] leading-snug text-ink-soft">total thrust</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-sm border border-rule bg-paper-sunk px-4 py-3">
                <p className="eyebrow">Symbols, SI relations and unit checks</p>
                <ul className="mt-2 space-y-1">
                  {conversions.map((line) => (
                    <li key={line} className="num text-[12px] leading-relaxed text-ink-soft">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>
          </Card>

          {orientation === "vertical" ? (
            <div className="rounded-sm border border-amber/30 bg-amber-wash px-4 py-3">
              <p className="eyebrow text-amber">Safety — vertical axis</p>
              <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-soft">
                {VERTICAL_AXIS_SAFETY}
              </p>
            </div>
          ) : null}

          <EstimateNote>{AXIS_ESTIMATE_NOTE}</EstimateNote>

          <CalcWarnings
            warnings={warnings}
            quietMessage="Nothing in these inputs trips a sanity check. That says the arithmetic is self-consistent, not that the drive would work — the list of what this model ignores is below."
          />

          <Card>
            <CardBody>
              <MotionProfileChart profile={results.profile} commandedSpeed={results.speedSi} />
            </CardBody>
          </Card>
        </div>
      </div>

      <Card tone="sunk" className="mt-5">
        <div className="px-5 py-4 sm:px-6">
          <p className="eyebrow">What this model ignores</p>
          <p className="measure mt-1.5 text-[15px] leading-[1.6] text-ink-soft">
            The list of what is left out is longer than the list of what is included, and every item
            on it can decide a selection on its own.
          </p>
          <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {AXIS_EXCLUSIONS.map((item) => (
              <div key={item.title}>
                <dt className="font-display text-[15px] font-semibold tracking-tightest text-ink">
                  {item.title}
                </dt>
                <dd className="mt-0.5 text-[14px] leading-[1.55] text-ink-soft">{item.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 border-t border-rule-strong pt-3 text-[14px] leading-[1.55] text-ink-soft">
            A real axis selection is done with the screw and motor manufacturers&rsquo; own sizing
            software against the full duty cycle, and reviewed by a qualified engineer before
            anything is ordered, built or operated.
          </p>
        </div>
      </Card>

      {compact ? null : (
        <div className="mt-5">
          <WorkedExample
            title="Sizing a horizontal X axis, step by step"
            intro={AXIS_WORKED_INTRO}
            givens={AXIS_WORKED_GIVENS}
            steps={AXIS_WORKED_STEPS}
            siNote={AXIS_SI_NOTE}
          />
        </div>
      )}
    </section>
  );
}
