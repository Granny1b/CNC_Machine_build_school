"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { plainSegments } from "@/lib/autolink";
import { formatFixed } from "@/lib/format";
import {
  CONTOUR,
  CONTOUR_PERIMETER,
  CYCLE_SECONDS,
  FINAL_FRAME,
  HERO_CAPTION,
  HERO_EXAMPLE_NOTE,
  HERO_LEGEND,
  HERO_PROGRAM_NAME,
  HERO_REDUCED_MOTION_NOTE,
  HERO_SI_NOTE,
  HERO_SVG_LABEL,
  PROGRAM_START,
  TOOL_DIAMETER,
  frameAt,
  gcodeProgram,
  type FrameState,
} from "./gcode-program";

/**
 * The hero of SPEC.md section 5.4: a live G-code-to-motion strip. The program
 * listing highlights the line being executed, the toolpath draws itself with a
 * dash trace, and the readout ticks X, Y and Z in sync — all three read the same
 * `frameAt()` state, so they cannot drift apart.
 *
 * Motion rules, in order of authority:
 *   1. The server-rendered first paint is the finished state, so there is no
 *      flash of motion and no hydration mismatch.
 *   2. An effect checks `prefers-reduced-motion`. If the visitor asks for
 *      reduced motion the strip stays on that finished state and says why.
 *   3. Otherwise the loop starts, and the play/pause button always wins.
 */

/* Palette hexes, as in AxisScale: SVG strokes need values, and these are the
   design tokens of SPEC 5.1. `currentColor` carries the drawing annotations. */
const RULE = "#D2D8D5";
const RULE_STRONG = "#B4BDB8";
const BLUE = "#17395B";
const BLUE_BRIGHT = "#2E90C4";

/* The drawing is authored in millimetres and mapped into the viewBox, so every
   coordinate below is a real dimension of the part. */
const VIEW = { xMin: -28, xMax: 76, yMin: -26, yMax: 50 };
const VIEW_W = VIEW.xMax - VIEW.xMin;
const VIEW_H = VIEW.yMax - VIEW.yMin;
const sx = (x: number) => x - VIEW.xMin;
const sy = (y: number) => VIEW.yMax - y;

const CONTOUR_PATH = [
  `M${sx(0)},${sy(0)}`,
  `L${sx(CONTOUR.width)},${sy(0)}`,
  `L${sx(CONTOUR.width)},${sy(CONTOUR.height)}`,
  `L${sx(0)},${sy(CONTOUR.height)}`,
  `L${sx(0)},${sy(0)}`,
].join(" ");

export function GcodeHero() {
  const [frame, setFrame] = useState<FrameState>(FINAL_FRAME);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const elapsed = useRef(CYCLE_SECONDS);

  // Decide, on the client only, whether the loop may run at all.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(query.matches);
      if (query.matches) {
        elapsed.current = CYCLE_SECONDS;
        setFrame(FINAL_FRAME);
        setPlaying(false);
      } else {
        elapsed.current = 0;
        setPlaying(true);
      }
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    let sinceUpdate = 0;

    const tick = (now: number) => {
      // Cap the step so returning to a backgrounded tab does not skip the cycle.
      const dt = Math.min((now - last) / 1000, 0.2);
      last = now;
      elapsed.current = (elapsed.current + dt) % CYCLE_SECONDS;
      sinceUpdate += dt;
      if (sinceUpdate >= 1 / 40) {
        sinceUpdate = 0;
        setFrame(frameAt(elapsed.current));
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const activeLine = gcodeProgram[frame.lineIndex];
  const modeLabel =
    frame.motion === "rapid" ? "G00 rapid" : frame.motion === "feed" ? "G01 feed" : "no motion";

  return (
    <figure className="m-0">
      <Card tone="raised" className="overflow-hidden">
        <CardHeader className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div>
            <p className="eyebrow">Live · G-code to motion</p>
            <p className="mt-1 font-mono text-[13px] font-medium text-ink">
              {HERO_PROGRAM_NAME}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone={frame.motion === "none" ? "neutral" : "blue"}>{modeLabel}</Badge>
            <Button variant="secondary" size="sm" onClick={() => setPlaying((p) => !p)}>
              <svg aria-hidden="true" width="9" height="9" viewBox="0 0 10 10" className="fill-current">
                {playing ? <path d="M1 1h3v8H1zM6 1h3v8H6z" /> : <path d="M2 1l7 4-7 4z" />}
              </svg>
              {playing ? "Pause" : "Play"}
              <span className="sr-only"> the toolpath animation</span>
            </Button>
          </div>
        </CardHeader>

        <div className="grid md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
          <div className="overflow-x-auto border-b border-rule p-4 sm:p-5 md:border-b-0 md:border-r">
            <p className="eyebrow">The program · {gcodeProgram.length} blocks</p>
            <ProgramListing activeIndex={frame.lineIndex} />
          </div>

          <div className="p-4 sm:p-5">
            <p className="eyebrow">Plan view · dimensions in mm</p>
            <ToolpathDrawing frame={frame} />
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {HERO_LEGEND.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  <LegendSwatch kind={item.kind} />
                  <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-soft">
                    {item.label}
                  </span>
                  <span className="text-[12px] leading-tight text-ink-faint">{item.meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-3 border-t border-rule bg-paper-sunk px-4 py-4 sm:grid-cols-5 sm:px-5">
          <Dro label="X · mm" value={formatFixed(frame.pose.x, 3)} live={frame.moving.x} />
          <Dro label="Y · mm" value={formatFixed(frame.pose.y, 3)} live={frame.moving.y} />
          <Dro label="Z · mm" value={formatFixed(frame.pose.z, 3)} live={frame.moving.z} />
          <Dro
            label="S · rev/min"
            value={String(frame.spindle)}
            live={frame.spindle > 0}
          />
          <Dro
            label="F · mm/min"
            value={frame.feed > 0 ? String(frame.feed) : "—"}
            live={frame.motion === "feed"}
          />
        </div>

        <div className="min-h-[7rem] border-t border-rule px-4 py-4 xs:min-h-[6.5rem] sm:min-h-[5.5rem] sm:px-5">
          <p className="eyebrow">
            Block {String(frame.lineIndex + 1).padStart(2, "0")} · {activeLine.result}
          </p>
          <p className="measure mt-2 text-[15px] leading-[1.6] text-ink-soft">
            <Prose text={activeLine.explain} inline />
          </p>
        </div>
      </Card>

      <figcaption className="measure mt-5 space-y-3 text-[14px] leading-[1.6] text-ink-soft">
        {reduced ? <p className="text-ink">{HERO_REDUCED_MOTION_NOTE}</p> : null}
        <Prose text={HERO_CAPTION} />
        <Prose text={HERO_SI_NOTE} />
        <p className="border-l-2 border-rule-strong pl-3 text-[13px] text-ink-faint">
          <Prose text={HERO_EXAMPLE_NOTE} inline />
        </p>
      </figcaption>
    </figure>
  );
}

/** Backticked values become mono, so no calculated number sits in body copy. */
function Prose({ text, inline = false }: { text: string; inline?: boolean }) {
  const segments = plainSegments(text).map((segment, i) =>
    segment.code ? (
      <span key={i} className="num text-ink">
        {segment.text}
      </span>
    ) : (
      <span key={i}>{segment.text}</span>
    ),
  );
  return inline ? <>{segments}</> : <p>{segments}</p>;
}

function ProgramListing({ activeIndex }: { activeIndex: number }) {
  return (
    <ol className="mt-3 font-mono text-[12px] leading-[1.5]">
      {gcodeProgram.map((line, index) => {
        const active = index === activeIndex;
        return (
          <li
            key={line.text}
            aria-current={active ? "true" : undefined}
            className={`flex gap-2 rounded-sm px-1.5 py-[3px] ${
              active ? "bg-blue-wash font-medium text-blue" : "text-ink-soft"
            }`}
          >
            <span aria-hidden="true" className="w-[1ch] shrink-0 text-blue">
              {active ? ">" : ""}
            </span>
            <span className="whitespace-pre">{line.text}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Dro({ label, value, live }: { label: string; value: string; live: boolean }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p
        className={`num mt-1 text-[15px] font-medium leading-none sm:text-[17px] ${
          live ? "text-blue-bright" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function LegendSwatch({ kind }: { kind: "rapid" | "cut" | "tool" }) {
  return (
    <svg aria-hidden="true" width="22" height="10" viewBox="0 0 22 10" className="shrink-0">
      {kind === "rapid" ? (
        <path d="M0 5H22" stroke={RULE_STRONG} strokeWidth={1} strokeDasharray="3.5 2.5" />
      ) : null}
      {kind === "cut" ? <path d="M0 5H22" stroke={BLUE} strokeWidth={2} /> : null}
      {kind === "tool" ? (
        <circle cx={11} cy={5} r={4} fill={BLUE_BRIGHT} fillOpacity={0.16} stroke={BLUE_BRIGHT} strokeWidth={1} />
      ) : null}
    </svg>
  );
}

/**
 * Plan view of the toolpath in the drawing vernacular of SPEC 5.5: hairlines,
 * an 8 mm graph wash, dimension lines with extension lines and arrowheads, and
 * a datum marker at part zero.
 */
function ToolpathDrawing({ frame }: { frame: FrameState }) {
  const toolX = sx(frame.pose.x);
  const toolY = sy(frame.pose.y);
  const rapidX = sx(PROGRAM_START.x + (0 - PROGRAM_START.x) * frame.approachFraction);
  const rapidY = sy(PROGRAM_START.y + (0 - PROGRAM_START.y) * frame.approachFraction);
  const toolStroke = frame.inCut ? BLUE_BRIGHT : RULE_STRONG;

  return (
    <svg
      role="img"
      aria-label={HERO_SVG_LABEL}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="mx-auto mt-3 block h-auto w-full max-w-[460px] text-ink-soft"
    >
      <defs>
        {/* The 8 mm graph wash of SPEC 5.5, aligned to part zero, at 6%. */}
        <pattern id="hero-grid" x={4} y={2} width={8} height={8} patternUnits="userSpaceOnUse">
          <path d="M8 0V8M0 8H8" fill="none" stroke={BLUE} strokeOpacity={0.06} strokeWidth={0.25} />
        </pattern>
        <marker
          id="hero-arrow-end"
          viewBox="0 0 10 6"
          refX={10}
          refY={3}
          markerWidth={3}
          markerHeight={1.8}
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M0 0L10 3L0 6Z" fill="currentColor" />
        </marker>
        <marker
          id="hero-arrow-start"
          viewBox="0 0 10 6"
          refX={0}
          refY={3}
          markerWidth={3}
          markerHeight={1.8}
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M10 0L0 3L10 6Z" fill="currentColor" />
        </marker>
      </defs>

      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="url(#hero-grid)" />

      {/* Dimensions: extension lines, then the dimension line and its value. */}
      <g stroke="currentColor" strokeWidth={0.25} fill="none">
        <path d={`M${sx(0)},${sy(0) + 2}V${sy(0) + 12}`} />
        <path d={`M${sx(CONTOUR.width)},${sy(0) + 2}V${sy(0) + 12}`} />
        <path
          d={`M${sx(0)},${sy(0) + 10}H${sx(CONTOUR.width)}`}
          markerStart="url(#hero-arrow-start)"
          markerEnd="url(#hero-arrow-end)"
        />
        <path d={`M${sx(CONTOUR.width) + 2},${sy(0)}H${sx(CONTOUR.width) + 12}`} />
        <path d={`M${sx(CONTOUR.width) + 2},${sy(CONTOUR.height)}H${sx(CONTOUR.width) + 12}`} />
        <path
          d={`M${sx(CONTOUR.width) + 10},${sy(0)}V${sy(CONTOUR.height)}`}
          markerStart="url(#hero-arrow-start)"
          markerEnd="url(#hero-arrow-end)"
        />
      </g>
      <g fill="currentColor" className="font-mono" fontSize={4}>
        <text x={sx(CONTOUR.width / 2)} y={sy(0) + 8.4} textAnchor="middle">
          {CONTOUR.width}
        </text>
        <text
          x={sx(CONTOUR.width) + 7}
          y={sy(CONTOUR.height / 2)}
          textAnchor="middle"
          transform={`rotate(-90 ${sx(CONTOUR.width) + 7} ${sy(CONTOUR.height / 2)})`}
        >
          {CONTOUR.height}
        </text>
      </g>

      {/* The contour, drawn faintly so the dimensions have something to hold. */}
      <path d={CONTOUR_PATH} fill="none" stroke={RULE} strokeWidth={0.3} />

      {/* Part zero, marked as a datum. */}
      <g stroke={BLUE} strokeWidth={0.35} fill="none">
        <circle cx={sx(0)} cy={sy(0)} r={2} />
        <path d={`M${sx(0) - 3.2},${sy(0)}H${sx(0) + 3.2}M${sx(0)},${sy(0) - 3.2}V${sy(0) + 3.2}`} />
      </g>

      {/* Where the tool waits before the program moves it. */}
      <path
        d={`M${sx(PROGRAM_START.x) - 2.4},${sy(PROGRAM_START.y)}H${sx(PROGRAM_START.x) + 2.4}M${sx(
          PROGRAM_START.x,
        )},${sy(PROGRAM_START.y) - 2.4}V${sy(PROGRAM_START.y) + 2.4}`}
        stroke={RULE_STRONG}
        strokeWidth={0.3}
      />

      {/* The rapid approach, revealed by its own endpoint. */}
      <path
        d={`M${sx(PROGRAM_START.x)},${sy(PROGRAM_START.y)}L${rapidX},${rapidY}`}
        stroke={RULE_STRONG}
        strokeWidth={0.4}
        strokeDasharray="2 1.4"
        fill="none"
      />

      {/* The cut, traced with stroke-dasharray in step with the readout. */}
      <path
        d={CONTOUR_PATH}
        fill="none"
        stroke={BLUE}
        strokeWidth={0.9}
        strokeLinejoin="round"
        strokeDasharray={CONTOUR_PERIMETER}
        strokeDashoffset={CONTOUR_PERIMETER * (1 - frame.cutFraction)}
      />

      {/* The cutter: solid measurement cyan in the cut, dashed when clear. */}
      <g>
        <circle
          cx={toolX}
          cy={toolY}
          r={TOOL_DIAMETER / 2}
          fill={BLUE_BRIGHT}
          fillOpacity={frame.inCut ? 0.16 : 0}
          stroke={toolStroke}
          strokeWidth={frame.inCut ? 0.6 : 0.4}
          strokeDasharray={frame.inCut ? undefined : "1.4 1.2"}
        />
        <path
          d={`M${toolX - 1.6},${toolY}H${toolX + 1.6}M${toolX},${toolY - 1.6}V${toolY + 1.6}`}
          stroke={toolStroke}
          strokeWidth={0.4}
        />
      </g>
    </svg>
  );
}
