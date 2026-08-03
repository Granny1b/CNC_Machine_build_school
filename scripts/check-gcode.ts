/**
 * Correctness checks for the G-code engine. SPEC.md section 16 item 1.
 *
 *   npm run check:gcode
 *
 * The engine is the part everything else trusts: the drawing, the readout and
 * every diagnostic are only as right as the interpreter underneath them. These
 * cases are hand-computed rather than recorded from the implementation, so they
 * catch a plausible-looking parser that quietly has the arithmetic wrong —
 * which is exactly the failure a screenshot cannot show.
 *
 * Exits non-zero on failure so it can gate a release.
 */
import { simulate } from "../src/lib/gcode";
import type { SimulatedProgram } from "../src/lib/gcode/types";

let failures = 0;
let checks = 0;

function fail(name: string, detail: string) {
  failures += 1;
  console.log(`  x ${name}\n      ${detail}`);
}

function close(actual: number, expected: number, tol = 1e-6): boolean {
  return Math.abs(actual - expected) <= tol;
}

function expect(name: string, actual: number, expected: number, tol = 1e-6) {
  checks += 1;
  if (!close(actual, expected, tol)) {
    fail(name, `expected ${expected}, got ${actual}`);
  }
}

function expectEqual(name: string, actual: unknown, expected: unknown) {
  checks += 1;
  if (actual !== expected) fail(name, `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function expectCode(name: string, program: SimulatedProgram, code: string, present = true) {
  checks += 1;
  const has = program.diagnostics.some((d) => d.code === code);
  if (has !== present) {
    const codes = program.diagnostics.map((d) => d.code).join(", ") || "none";
    fail(name, `expected code "${code}" ${present ? "present" : "absent"}; diagnostics: ${codes}`);
  }
}

/* ------------------------------------------------------------------ */
/* 1. Straight moves, modal feed, distances                            */
/* ------------------------------------------------------------------ */
{
  const p = simulate(["G21 G90 G17", "G0 X0 Y0 Z5", "G1 Z-2 F100", "G1 X10 F200"].join("\n"));
  expect("straight: final X", p.finalState.position.x, 10);
  expect("straight: final Z", p.finalState.position.z, -2);
  expect("straight: modal feed carried", p.finalState.feed, 200);
  expectEqual("straight: units", p.finalState.units, "mm");
  // rapid 0,0,0 -> 0,0,5 is 5; plunge 5 -> -2 is 7; traverse 10.
  expect("straight: cutting distance", p.cuttingDistance, 17, 1e-6);
  const rapids = p.segments.filter((s) => s.kind === "rapid");
  expectEqual("straight: one rapid", rapids.length, 1);
  expect("straight: rapid length", rapids[0].length, 5);
}

/* ------------------------------------------------------------------ */
/* 2. Inch input converts at the boundary                              */
/* ------------------------------------------------------------------ */
{
  const p = simulate(["G20 G90", "G0 X1 Y0 Z0", "G1 X2 F10"].join("\n"));
  expect("inch: X converted to mm", p.finalState.position.x, 50.8, 1e-9);
  // F10 in/min is 254 mm/min.
  expect("inch: feed converted to mm/min", p.finalState.feed, 254, 1e-9);
}

/* ------------------------------------------------------------------ */
/* 3. Incremental distance mode                                        */
/* ------------------------------------------------------------------ */
{
  const p = simulate(["G21 G90", "G0 X10 Y0 Z0", "G91", "G1 X5 Y5 F100"].join("\n"));
  expect("incremental: X accumulates", p.finalState.position.x, 15);
  expect("incremental: Y accumulates", p.finalState.position.y, 5);
  expectEqual("incremental: mode", p.finalState.distance, "incremental");
}

/* ------------------------------------------------------------------ */
/* 4. Arc geometry, centre format — a half circle that bulges          */
/*    past both endpoints, so bounds must follow the arc not the ends. */
/* ------------------------------------------------------------------ */
{
  const p = simulate(["G21 G90 G17", "G0 X10 Y0 Z0", "G2 X-10 Y0 I-10 J0 F100"].join("\n"));
  const arc = p.segments.find((s) => s.kind === "arc-cw");
  checks += 1;
  if (!arc) {
    fail("arc cw: segment produced", "no arc-cw segment found");
  } else {
    expect("arc cw: radius", arc.radius ?? 0, 10, 1e-9);
    expect("arc cw: centre x", arc.centre?.x ?? NaN, 0, 1e-9);
    expect("arc cw: centre y", arc.centre?.y ?? NaN, 0, 1e-9);
    // Half circle of radius 10.
    expect("arc cw: length", arc.length, Math.PI * 10, 1e-6);
  }
  // Clockwise from 0 degrees to 180 passes through -90, i.e. y = -10.
  expect("arc cw: bounds follow the arc, not the endpoints", p.bounds?.min.y ?? NaN, -10, 1e-6);
  expect("arc cw: bounds max y", p.bounds?.max.y ?? NaN, 0, 1e-6);
}

/* ------------------------------------------------------------------ */
/* 5. Arc radius format, and the sign convention                       */
/* ------------------------------------------------------------------ */
{
  const p = simulate(["G21 G90 G17", "G0 X10 Y0 Z0", "G3 X0 Y10 R10 F100"].join("\n"));
  const arc = p.segments.find((s) => s.kind === "arc-ccw");
  checks += 1;
  if (!arc) fail("arc R: segment produced", "no arc-ccw segment found");
  else {
    expect("arc R: radius", arc.radius ?? 0, 10, 1e-6);
    // Positive R selects the minor arc: a quarter circle here.
    expect("arc R: quarter circle length", arc.length, (Math.PI * 10) / 2, 1e-6);
  }
}

/* ------------------------------------------------------------------ */
/* 6. A mismatched arc endpoint is reported, not silently accepted     */
/* ------------------------------------------------------------------ */
{
  const p = simulate(["G21 G90 G17", "G0 X10 Y0 Z0", "G3 X0 Y12 I-10 J0 F100"].join("\n"));
  expectCode("arc mismatch reported", p, "arc-endpoint-mismatch");
}

/* ------------------------------------------------------------------ */
/* 7. Unsupported codes are named, never silently ignored              */
/* ------------------------------------------------------------------ */
{
  const p = simulate(["G21 G90", "G99 X1"].join("\n"));
  checks += 1;
  if (p.diagnostics.length === 0) fail("unsupported code reported", "G99 produced no diagnostic");
}

/* ------------------------------------------------------------------ */
/* 8. Comments, block delete and line numbers do not break parsing     */
/* ------------------------------------------------------------------ */
{
  const p = simulate(
    ["%", "O1000 (rectangular contour)", "N10 G21 G90 ; millimetres, absolute", "/N20 G0 X5", "N30 G0 X1 Y2 Z3", "M30"].join("\n"),
  );
  expect("comments: X reached", p.finalState.position.x, 1);
  expect("comments: Y reached", p.finalState.position.y, 2);
  expectEqual("comments: program ended", p.finalState.programEnded, true);
  checks += 1;
  const commented = p.lines.find((l) => l.comments.some((c) => /rectangular contour/.test(c)));
  if (!commented) fail("comments: parenthesised comment captured", "no line carried the comment text");
}

/* ------------------------------------------------------------------ */
/* 9. Every executed step exposes before and after state               */
/* ------------------------------------------------------------------ */
{
  const p = simulate(["G21 G90", "G0 X1", "G1 X2 F50"].join("\n"));
  checks += 1;
  const broken = p.steps.filter((s) => !s.before || !s.after);
  if (broken.length) fail("steps: before/after present", `${broken.length} step(s) missing state`);
  checks += 1;
  if (p.explanations.length !== p.steps.length) {
    fail("explanations: one per step", `${p.explanations.length} explanations for ${p.steps.length} steps`);
  }
}

/* ------------------------------------------------------------------ */
/* 10. Time estimate follows length / feed                             */
/* ------------------------------------------------------------------ */
{
  const p = simulate(["G21 G90", "G1 X100 F100"].join("\n"));
  // 100 mm at 100 mm/min is exactly one minute of cutting.
  expect("time: one minute of feed", p.estimatedMinutes, 1, 1e-6);
}

/* ------------------------------------------------------------------ */
/* 11. Degenerate input must not throw                                 */
/* ------------------------------------------------------------------ */
{
  for (const source of ["", "   ", "(only a comment)", "G", "X", "G1 X", "((", ";", "G2 X10 Y10"]) {
    checks += 1;
    try {
      simulate(source);
    } catch (error) {
      fail("degenerate input survives", `${JSON.stringify(source)} threw: ${(error as Error).message}`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* 12. Every diagnostic teaches: message, consequence and fix          */
/* ------------------------------------------------------------------ */
{
  const sources = [
    "G21 G90\nG1 X10\nG0 X0 Z-5\nG1 Z-2 F500\n",
    "G21 G90 G17\nG3 X0 Y12 I-10 J0 F100\n",
    "G99 X1\n",
  ];
  for (const source of sources) {
    for (const d of simulate(source).diagnostics) {
      checks += 1;
      if (!d.message.trim() || !d.consequence.trim() || !d.fix.trim()) {
        fail("diagnostics teach", `"${d.code}" is missing message, consequence or fix`);
      }
      checks += 1;
      if (/^syntax error$/i.test(d.message.trim())) fail("diagnostics teach", `"${d.code}" is a bare syntax error`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* 13. The sample programs are all valid, and the faulty one is faulty */
/* ------------------------------------------------------------------ */
{
  const { gcodeSamples } = await import("../src/content/gcode-samples");
  checks += 1;
  if (gcodeSamples.length < 6) fail("samples: at least six", `found ${gcodeSamples.length}`);

  for (const sample of gcodeSamples) {
    const p = simulate(sample.source);
    const errors = p.diagnostics.filter((d) => d.severity === "error");
    checks += 1;
    if (!sample.faulty && errors.length > 0) {
      fail(`samples: "${sample.id}" is clean`, `errors: ${errors.map((e) => `${e.code}@${e.lineIndex + 1}`).join(", ")}`);
    }
    checks += 1;
    if (sample.faulty && p.diagnostics.length === 0) {
      fail(`samples: "${sample.id}" is marked faulty`, "but produced no diagnostics at all");
    }
    checks += 1;
    if (!sample.faulty && p.segments.length === 0) {
      fail(`samples: "${sample.id}" produces motion`, "no path segments");
    }
  }
}

console.log("\nCNC Academy G-code engine check\n");
if (failures === 0) {
  console.log(`  ${checks} assertions, all passed.\n`);
  process.exit(0);
}
console.log(`\n  ${failures} failure(s) across ${checks} assertions.\n`);
process.exit(1);
