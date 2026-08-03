/**
 * The public entry point to the G-code simulator.
 *
 * Four stages, in order, each of which does one thing:
 *
 *   parse       what the learner wrote          — words, comments, syntax
 *   interpret   what the machine would be asked — state, toolpath, geometry
 *   explain     what each line means            — plain language, then terms
 *   lint        what is likely to go wrong      — the classic beginner mistakes
 *
 * Every stage produces diagnostics, and they are gathered and sorted here so a
 * component never has to know which stage found what.
 *
 * THE ONE HARD RULE, restated at the front door because this is the file
 * everything else imports: the simulator runs entirely in the browser and must
 * never be capable of driving hardware. There is no serial output, no network
 * output, and no export that a control could take as a job. It knows nothing
 * about your fixture, your clamps, your real tool lengths, your machine's
 * travels or what is sitting on the table, so a clean run here is not a proven
 * program. Proving out belongs on the machine, to competent people, using the
 * machine's own verification features.
 */

import { explainLine } from "./explain";
import { interpret } from "./interpret";
import { parseProgram } from "./parse";
import {
  DEFAULT_SIMULATION_OPTIONS,
  type Diagnostic,
  type IssueSeverity,
  type LineExplanation,
  type SimulatedProgram,
  type SimulationOptions,
} from "./types";
import { lintProgram } from "./lint";

export * from "./types";
export { tokenizeLine, tokenizeLineDetailed } from "./tokenize";
export { parseProgram, MAX_PROGRAM_LINES } from "./parse";
export { interpret, ARC_TOLERANCE_MM } from "./interpret";

/** Errors first: the ordering the issue list reads in. */
const SEVERITY_ORDER: Record<IssueSeverity, number> = { error: 0, warning: 1, note: 2 };

function finiteOr(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/**
 * Fill in the options, and refuse a rapid rate that cannot be divided by. The
 * defaults are assumptions about a machine this model knows nothing about, which
 * is why anything derived from them is only ever an estimate.
 */
function resolveOptions(options?: SimulationOptions): Required<SimulationOptions> {
  const rapid = finiteOr(options?.assumedRapidRate, DEFAULT_SIMULATION_OPTIONS.assumedRapidRate);
  return {
    assumedRapidRate: rapid > 0 ? rapid : DEFAULT_SIMULATION_OPTIONS.assumedRapidRate,
    clearanceZ: finiteOr(options?.clearanceZ, DEFAULT_SIMULATION_OPTIONS.clearanceZ),
    stockTopZ: finiteOr(options?.stockTopZ, DEFAULT_SIMULATION_OPTIONS.stockTopZ),
  };
}

function sortDiagnostics(diagnostics: Diagnostic[]): Diagnostic[] {
  return [...diagnostics].sort((a, b) => {
    if (a.lineIndex !== b.lineIndex) return a.lineIndex - b.lineIndex;
    return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
  });
}

/**
 * Read a program and work out everything there is to say about it.
 *
 * Pure: the same source and the same options always give the same result, and
 * nothing is held between calls. `estimatedMinutes` is an estimate in the
 * strict sense — it counts path length against the commanded feeds and the
 * assumed rapid rate, and takes no account of acceleration, tool changes,
 * spindle run-up or anything else a real machine spends time on.
 */
export function simulate(source: string, options?: SimulationOptions): SimulatedProgram {
  const resolved = resolveOptions(options);

  const parsed = parseProgram(source);
  const run = interpret(parsed.lines, resolved);

  const explanations: LineExplanation[] = parsed.lines.map((line, index) => {
    const step = run.steps[index];
    return explainLine(line, step.before, step.after);
  });

  const lint = lintProgram({
    lines: parsed.lines,
    steps: run.steps,
    segments: run.segments,
    options: resolved,
  });

  return {
    lines: parsed.lines,
    steps: run.steps,
    segments: run.segments,
    explanations,
    diagnostics: sortDiagnostics([...parsed.diagnostics, ...run.diagnostics, ...lint]),
    bounds: run.bounds,
    estimatedMinutes: run.estimatedMinutes,
    cuttingDistance: run.cuttingDistance,
    finalState: run.finalState,
    options: resolved,
  };
}
