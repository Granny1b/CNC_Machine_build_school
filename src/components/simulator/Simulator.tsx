"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Disclosure } from "@/components/ui/Disclosure";
import { Readout, SelectField } from "@/components/ui/Field";
import { GCODE_SAMPLE_NOTE, gcodeSamples, getGcodeSample } from "@/content/gcode-samples";
import { clamp, formatNumber, pluralise } from "@/lib/format";
import {
  initialMachineState,
  simulate,
  type ExecutedStep,
  type LineExplanation,
  type ParsedLine,
  type PathSegment,
} from "@/lib/gcode";
import { DiagnosticsPanel } from "./DiagnosticsPanel";
import { LinePanel } from "./LinePanel";
import { ProgramListing } from "./ProgramListing";
import { SimulatorReadout } from "./SimulatorReadout";
import { ToolpathView } from "./ToolpathView";

/**
 * The simulator. One piece of state — the program text and which step you are
 * standing on — and every panel is a view onto the single `SimulatedProgram`
 * that `simulate()` derives from it. Nothing below holds machine state of its
 * own, which is why the listing, the drawing and the readout cannot drift apart.
 *
 * It starts paused. Play is something you ask for, not something that happens
 * to you, which is also what `prefers-reduced-motion` asks of a page like this.
 *
 * It runs entirely in your browser and has no route to hardware: no serial, no
 * network output, nothing to send anywhere. See the note the page carries.
 */

/** How long each step is held when the program is playing, in milliseconds. */
const STEP_MS = 700;

const FIRST_SAMPLE = gcodeSamples.length > 0 ? gcodeSamples[0] : undefined;

const MOTION_WORDS: Record<PathSegment["kind"], string> = {
  rapid: "rapid",
  feed: "straight cut",
  "arc-cw": "clockwise arc",
  "arc-ccw": "counter-clockwise arc",
};

export function Simulator() {
  const [sampleId, setSampleId] = useState(FIRST_SAMPLE ? FIRST_SAMPLE.id : "");
  const [source, setSource] = useState(FIRST_SAMPLE ? FIRST_SAMPLE.source : "");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [editing, setEditing] = useState(false);
  const scrubberId = useId();

  const program = useMemo(() => simulate(source), [source]);

  const steps = program.steps;
  const lastStep = Math.max(0, steps.length - 1);
  // Derived rather than stored, so a program that shrinks under the cursor
  // cannot leave the cursor pointing at a step that no longer exists.
  const activeIndex = clamp(stepIndex, 0, lastStep);
  const activeStep: ExecutedStep | undefined = steps[activeIndex];
  const activeLineIndex = activeStep ? activeStep.lineIndex : 0;
  const activeLine: ParsedLine | undefined = program.lines[activeLineIndex];
  const explanation: LineExplanation | undefined = program.explanations.find(
    (item) => item.lineIndex === activeLineIndex,
  );

  const geometry = useMemo(() => {
    const all: PathSegment[] = [];
    let done = 0;
    let activeCount = 0;
    steps.forEach((step, index) => {
      all.push(...step.segments);
      if (index <= activeIndex) done = all.length;
      if (index === activeIndex) activeCount = step.segments.length;
    });
    return { segments: all, doneCount: done, activeFrom: done - activeCount, activeTo: done };
  }, [steps, activeIndex]);

  /* Playing advances one step on a timer, and stops of its own accord at the
     end of the program rather than looping back over the part. */
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStepIndex((index) => Math.min(index + 1, lastStep));
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, [playing, lastStep]);

  useEffect(() => {
    if (playing && activeIndex >= lastStep) setPlaying(false);
  }, [playing, activeIndex, lastStep]);

  function goToStep(index: number) {
    setPlaying(false);
    setStepIndex(clamp(index, 0, lastStep));
  }

  function jumpToLine(lineIndex: number) {
    const index = steps.findIndex((step) => step.lineIndex === lineIndex);
    setEditing(false);
    goToStep(index >= 0 ? index : lineIndex);
  }

  function togglePlay() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (activeIndex >= lastStep) setStepIndex(0);
    setEditing(false);
    setPlaying(true);
  }

  function changeSource(next: string) {
    setPlaying(false);
    setSource(next);
  }

  function chooseSample(id: string) {
    const chosen = getGcodeSample(id);
    setSampleId(id);
    if (chosen) setSource(chosen.source);
    setStepIndex(0);
    setPlaying(false);
    setEditing(false);
  }

  const sample = getGcodeSample(sampleId);
  const edited = sample ? source !== sample.source : source.trim().length > 0;

  const state = activeStep ? activeStep.after : initialMachineState();
  const moving = activeStep
    ? {
        x: activeStep.after.position.x !== activeStep.before.position.x,
        y: activeStep.after.position.y !== activeStep.before.position.y,
        z: activeStep.after.position.z !== activeStep.before.position.z,
      }
    : { x: false, y: false, z: false };

  const stepMoves = activeStep ? activeStep.segments : [];
  const stepSummary =
    stepMoves.length === 0
      ? "no movement"
      : stepMoves.map((segment) => MOTION_WORDS[segment.kind]).join(", ");

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="sample-heading"
        className="rounded-sm border border-rule bg-paper-raised shadow-panel"
      >
        <div className="border-b border-rule px-5 py-4 sm:px-6">
          <h2 id="sample-heading" className="text-[18px] font-semibold sm:text-[20px]">
            Choose a program, or write your own
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:px-6 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          {gcodeSamples.length > 0 ? (
            <SelectField
              label="Sample program"
              value={sampleId}
              onChange={chooseSample}
              options={gcodeSamples.map((item) => ({ value: item.id, label: item.title }))}
              hint="Loading a sample replaces whatever is in the editor."
            />
          ) : null}
          <div>
            {sample ? (
              <>
                <p className="measure text-[15px] leading-[1.6] text-ink-soft">{sample.blurb}</p>
                {sample.teaches.length > 0 ? (
                  /* Sentences, not chips: a Badge is whitespace-nowrap by design,
                     which is right for a short label and pushes the page sideways
                     at 360px once the text is a full line long. */
                  <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                    {sample.teaches.map((topic) => (
                      <li key={topic} className="flex gap-2 text-[14px] leading-snug text-ink-soft">
                        <span aria-hidden="true" className="mt-[3px] shrink-0 font-mono text-[11px] text-blue">
                          ·
                        </span>
                        <span className="min-w-0">{topic}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  {sample.faulty ? <Badge tone="blue">Deliberate mistakes to find</Badge> : null}
                  {edited ? (
                    <>
                      <Badge tone="outline">Edited</Badge>
                      <Button variant="ghost" size="sm" onClick={() => chooseSample(sampleId)}>
                        Restore the sample
                      </Button>
                    </>
                  ) : null}
                </div>
                {sample.faulty && sample.faults && sample.faults.length > 0 ? (
                  <Disclosure
                    className="mt-4"
                    eyebrow="Spoiler"
                    title="What is wrong with this program"
                  >
                    <ul className="space-y-2">
                      {sample.faults.map((fault) => (
                        <li key={fault} className="measure text-[15px] leading-[1.6] text-ink-soft">
                          {fault}
                        </li>
                      ))}
                    </ul>
                  </Disclosure>
                ) : null}
              </>
            ) : (
              <p className="measure text-[15px] leading-[1.6] text-ink-soft">
                Type or paste a program into the editor and it is read as you write it.
              </p>
            )}
          </div>
        </div>
        <p className="measure border-t border-rule px-5 py-4 text-[13px] leading-[1.55] text-ink-soft sm:px-6">
          {GCODE_SAMPLE_NOTE}
        </p>
      </section>

      <section
        aria-label="Transport controls"
        className="rounded-sm border border-rule bg-paper-sunk px-5 py-4 sm:px-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => goToStep(0)}
            disabled={activeIndex === 0}
          >
            <Glyph kind="rewind" />
            Rewind
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => goToStep(activeIndex - 1)}
            disabled={activeIndex === 0}
          >
            <Glyph kind="back" />
            Step back
          </Button>
          <Button variant="primary" size="sm" onClick={togglePlay} disabled={lastStep === 0}>
            <Glyph kind={playing ? "pause" : "play"} />
            {playing ? "Pause" : "Play"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => goToStep(activeIndex + 1)}
            disabled={activeIndex >= lastStep}
          >
            <Glyph kind="forward" />
            Step forward
          </Button>
        </div>

        <div className="mt-4">
          <label htmlFor={scrubberId} className="eyebrow">
            Step through the program
          </label>
          <input
            id={scrubberId}
            type="range"
            min={0}
            max={lastStep}
            step={1}
            value={activeIndex}
            onChange={(event) => goToStep(Number(event.target.value))}
            aria-valuetext={`Step ${activeIndex + 1} of ${steps.length}, line ${activeLineIndex + 1}`}
            aria-describedby={`${scrubberId}-hint`}
            className="mt-2 w-full cursor-pointer accent-blue-bright"
          />
          <p className="num mt-2 text-[13px] text-ink">
            Step {String(activeIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}{" "}
            · line {String(activeLineIndex + 1).padStart(2, "0")} · {stepSummary}
          </p>
          <p id={`${scrubberId}-hint`} className="mt-1 text-[13px] leading-snug text-ink-soft">
            With the slider focused, the left and right arrow keys step one block at a time. Play
            never starts on its own.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]">
        <ProgramListing
          source={source}
          lines={program.lines}
          activeLineIndex={activeLineIndex}
          diagnostics={program.diagnostics}
          editing={editing}
          onEditingChange={(next) => {
            if (next) setPlaying(false);
            setEditing(next);
          }}
          onSourceChange={changeSource}
          onSelectLine={jumpToLine}
        />
        <ToolpathView
          segments={geometry.segments}
          doneCount={geometry.doneCount}
          activeFrom={geometry.activeFrom}
          activeTo={geometry.activeTo}
          bounds={program.bounds}
          position={state.position}
          onSelectLine={jumpToLine}
        />
      </div>

      <SimulatorReadout state={state} moving={moving} lineNumber={activeLineIndex + 1} />

      <section
        aria-labelledby="totals-heading"
        className="rounded-sm border border-rule bg-paper-raised shadow-panel"
      >
        <div className="border-b border-rule px-5 py-4 sm:px-6">
          <h2 id="totals-heading" className="text-[18px] font-semibold sm:text-[20px]">
            What the program adds up to
          </h2>
        </div>
        <div className="px-5 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
            <Readout
              label="Estimated time"
              value={formatNumber(program.estimatedMinutes, 3)}
              unit="min"
              meaning="An estimate, on the assumptions below."
              emphasis
            />
            <Readout
              label="Cutting distance"
              value={formatNumber(program.cuttingDistance, 4)}
              unit="mm"
              meaning="Path length travelled at a feed rate."
            />
            <Readout
              label="Moves"
              value={String(geometry.segments.length)}
              unit={pluralise(geometry.segments.length, "move")}
              meaning="Every rapid, straight cut and arc the program makes."
            />
            <Readout
              label="Blocks"
              value={String(program.lines.length)}
              unit={pluralise(program.lines.length, "line")}
              meaning="Including blank lines and comment-only lines."
            />
          </div>
          <p className="measure mt-4 text-[14px] leading-[1.6] text-ink-soft">
            The time estimate assumes a rapid traverse rate of{" "}
            <span className="num text-ink">{formatNumber(program.options.assumedRapidRate, 5)}</span>{" "}
            mm/min, because the model cannot know what your machine rapids at. It also takes no
            account of acceleration, tool changes, spindle run-up or dwell. Treat it as an
            illustration of where the time goes, not as a cycle time.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LinePanel
          line={activeLine}
          explanation={explanation}
          lineNumber={activeLineIndex + 1}
        />
        <DiagnosticsPanel
          diagnostics={program.diagnostics}
          activeLineIndex={activeLineIndex}
          onSelectLine={jumpToLine}
        />
      </div>
    </div>
  );
}

function Glyph({ kind }: { kind: "rewind" | "back" | "play" | "pause" | "forward" }) {
  return (
    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" className="fill-current">
      {kind === "rewind" ? <path d="M1 1h1.4v8H1zM9 1L3.4 5 9 9z" /> : null}
      {kind === "back" ? <path d="M8.6 1L3 5l5.6 4z" /> : null}
      {kind === "play" ? <path d="M2 1l7 4-7 4z" /> : null}
      {kind === "pause" ? <path d="M1 1h3v8H1zM6 1h3v8H6z" /> : null}
      {kind === "forward" ? <path d="M1.4 1L7 5l-5.6 4z" /> : null}
    </svg>
  );
}
