"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Readout } from "@/components/ui/Field";
import { parseNumeric } from "@/lib/format";
import {
  MACHINING_ESTIMATE_NOTE,
  MACHINING_FORMULA,
  MACHINING_SI_NOTE,
  MACHINING_WORKED_EXAMPLE,
  MACHINING_WORKED_GIVENS,
  MACHINING_WORKED_INTRO,
  MACHINING_WORKED_STEPS,
  formatCalcValue,
  machiningResults,
  machiningWarnings,
  type MachiningInputs,
} from "@/lib/machining";
import { CalcField, CalcWarnings, EstimateNote, WorkedExample } from "./CalcField";
import { FormulaCard } from "./FormulaCard";

/**
 * Speeds, feeds, removal rate and cutting time. SPEC section 9.1.
 *
 * The component holds text, not numbers: every field keeps the raw string the
 * learner typed, and the maths happens in `@/lib/machining`. A field that is
 * not yet a usable number leaves the outputs showing a dash rather than a
 * guess, and never stops anyone typing.
 *
 * The default state is the course's canonical worked example, so the panel
 * opens reproducing the numbers the lessons quote.
 */

type Draft = Record<keyof MachiningInputs, string>;

function draftFrom(inputs: MachiningInputs): Draft {
  return {
    toolDiameter: String(inputs.toolDiameter),
    teeth: String(inputs.teeth),
    cuttingSpeed: String(inputs.cuttingSpeed),
    feedPerTooth: String(inputs.feedPerTooth),
    axialDepth: String(inputs.axialDepth),
    radialWidth: String(inputs.radialWidth),
    passLength: String(inputs.passLength),
    spindleMax: String(inputs.spindleMax),
  };
}

const numeric = (raw: string): number => parseNumeric(raw) ?? Number.NaN;

export function MachiningCalculator({ compact = false }: { compact?: boolean }) {
  const [draft, setDraft] = useState<Draft>(() => draftFrom(MACHINING_WORKED_EXAMPLE));

  const update = (key: keyof Draft) => (raw: string) =>
    setDraft((previous) => ({ ...previous, [key]: raw }));

  const inputs = useMemo<MachiningInputs>(
    () => ({
      toolDiameter: numeric(draft.toolDiameter),
      teeth: numeric(draft.teeth),
      cuttingSpeed: numeric(draft.cuttingSpeed),
      feedPerTooth: numeric(draft.feedPerTooth),
      axialDepth: numeric(draft.axialDepth),
      radialWidth: numeric(draft.radialWidth),
      passLength: numeric(draft.passLength),
      spindleMax: numeric(draft.spindleMax),
    }),
    [draft],
  );

  const results = useMemo(() => machiningResults(inputs), [inputs]);
  const warnings = useMemo(() => machiningWarnings(inputs, results), [inputs, results]);

  const conversions = [
    `n   ${formatCalcValue(results.spindleSpeed, 4)} rev/min  =  ${formatCalcValue(results.spindleAngular)} rad/s`,
    `vf  ${formatCalcValue(results.feedRate, 4)} mm/min  =  ${formatCalcValue(results.feedSpeed)} m/s`,
    `Q   ${formatCalcValue(results.removalRate)} cm³/min`,
    `t   ${formatCalcValue(results.passTime)} min  =  ${formatCalcValue(results.passTimeSeconds)} s`,
    `vc  ${formatCalcValue(results.cuttingSpeedCheck, 4)} m/min  recovered from n and D`,
    `z × fz  =  ${formatCalcValue(results.feedPerRevolution)} mm per revolution`,
    "1 rev/min = 2π / 60 rad/s ≈ 0.105 rad/s",
  ];

  return (
    <section id="machining-calculator" className="scroll-mt-24">
      {compact ? null : (
        <div className="mb-6">
          <p className="eyebrow">Calculator one · Speeds, feeds and time</p>
          <h2 className="mt-2 text-[26px] font-bold sm:text-[32px]">Machining calculator</h2>
          <p className="measure mt-3 text-[16px] leading-[1.65] text-ink-soft">
            Cutting speed and feed per tooth belong to the tool and the material, and come from the
            supplier&rsquo;s data. Everything a machine is actually told — spindle speed and feed
            rate — falls out of them once you choose a diameter and a tooth count. This works that
            chain through, and shows you what each answer means.
          </p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-6">
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <p className="eyebrow">Inputs</p>
              <p className="mt-1.5 text-[14px] leading-snug text-ink-soft">
                Set to the worked example: a carbide end mill with four flutes, cutting an
                aluminium alloy.
              </p>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid gap-4 xs:grid-cols-2">
                <CalcField
                  label="Tool diameter"
                  symbol="D"
                  unit="mm"
                  step={0.1}
                  value={draft.toolDiameter}
                  onChange={update("toolDiameter")}
                  hint="measured across the cutting edges, not the shank"
                />
                <CalcField
                  label="Number of teeth"
                  symbol="z"
                  unit="flutes"
                  step={1}
                  value={draft.teeth}
                  onChange={update("teeth")}
                  hint="cutting edges on the tool; each takes its own slice every revolution"
                />
              </div>
              <CalcField
                label="Cutting speed"
                symbol="vc"
                unit="m/min"
                step={5}
                value={draft.cuttingSpeed}
                onChange={update("cuttingSpeed")}
                hint="how fast the edge sweeps past the metal. A property of the material and the tool, taken from the supplier's cutting data."
              />
              <CalcField
                label="Feed per tooth"
                symbol="fz"
                unit="mm/tooth"
                step={0.005}
                value={draft.feedPerTooth}
                onChange={update("feedPerTooth")}
                hint="the thickness of the slice each edge takes. Also from the supplier's data — a property of the tool, not a preference."
              />
              <div className="grid gap-4 xs:grid-cols-2">
                <CalcField
                  label="Axial depth of cut"
                  symbol="ap"
                  unit="mm"
                  step={0.5}
                  value={draft.axialDepth}
                  onChange={update("axialDepth")}
                  hint="how deep the tool is engaged, measured along its own axis"
                />
                <CalcField
                  label="Radial width of cut"
                  symbol="ae"
                  unit="mm"
                  step={0.5}
                  value={draft.radialWidth}
                  onChange={update("radialWidth")}
                  hint="how wide a bite it takes sideways; it can never exceed the diameter"
                />
              </div>
              <div className="grid gap-4 xs:grid-cols-2">
                <CalcField
                  label="Pass length"
                  symbol="L"
                  unit="mm"
                  step={10}
                  value={draft.passLength}
                  onChange={update("passLength")}
                  hint="how far the tool travels through the cut in one pass"
                />
                <CalcField
                  label="Spindle maximum"
                  symbol="n max"
                  unit="rev/min"
                  step={500}
                  value={draft.spindleMax}
                  onChange={update("spindleMax")}
                  hint="your machine's stated top speed, from its data plate. It changes nothing above — it only gives the guard rail something to compare against."
                />
              </div>
              <div className="flex justify-end border-t border-rule pt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDraft(draftFrom(MACHINING_WORKED_EXAMPLE))}
                >
                  Reset to the worked example
                </Button>
              </div>
            </CardBody>
          </Card>

          <FormulaCard formula={MACHINING_FORMULA} />
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <p className="eyebrow">Results</p>
              <p className="mt-1.5 text-[14px] leading-snug text-ink-soft">
                Each step feeds the next at full precision, so the answers match the worked example
                rather than drifting through rounded intermediates.
              </p>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Readout
                  label="Spindle speed"
                  value={formatCalcValue(results.spindleSpeed, 4)}
                  unit="rev/min"
                  emphasis
                  meaning="How fast the spindle must turn for the edge to sweep past the metal at the cutting speed the tool data asks for. It follows from the diameter — it is not something you choose."
                />
                <Readout
                  label="Feed rate"
                  value={formatCalcValue(results.feedRate, 4)}
                  unit="mm/min"
                  emphasis
                  meaning="The number the control is actually given. It is a consequence of spindle speed, tooth count and chip thickness, never a starting point."
                />
                <Readout
                  label="Material removal rate"
                  value={formatCalcValue(results.removalRate)}
                  unit="cm³/min"
                  meaning="How much metal leaves the part each minute. This is the honest measure of how productive a pass is, and what you compare between two strategies."
                />
                <Readout
                  label="Time for one pass"
                  value={formatCalcValue(results.passTime)}
                  unit="min"
                  meaning="Cutting time for this pass alone — no rapids, no entries, no tool changes. Multiply by the number of passes for a first cycle-time estimate."
                />
              </div>

              <div className="rounded-sm border border-rule bg-paper-sunk px-4 py-3">
                <p className="eyebrow">Symbols, SI relations and cross-checks</p>
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

          <EstimateNote>{MACHINING_ESTIMATE_NOTE}</EstimateNote>

          <CalcWarnings
            warnings={warnings}
            quietMessage="Nothing in these inputs trips a sanity check. That is not the same as the numbers being right for your machine, your tool or your material — it only means no obvious slip stands out."
          />
        </div>
      </div>

      {compact ? null : (
        <div className="mt-6">
          <WorkedExample
            title="A 10 mm four-flute cutter in aluminium"
            intro={MACHINING_WORKED_INTRO}
            givens={MACHINING_WORKED_GIVENS}
            steps={MACHINING_WORKED_STEPS}
            siNote={MACHINING_SI_NOTE}
          />
        </div>
      )}
    </section>
  );
}
