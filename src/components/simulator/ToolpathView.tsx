"use client";

import { useId } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { formatFixed } from "@/lib/format";
import type { Bounds, PathSegment, Plane, Vec3 } from "@/lib/gcode";

/**
 * The toolpath, drawn in the vernacular of SPEC 5.5: hairlines, a graph wash
 * under 6%, dimension lines with extension lines and arrowheads for the
 * extents, and a datum marker at part zero.
 *
 * Two views, because one is never enough. The plan view is the drawing of the
 * part; the front view is where a plunge becomes visible at all. Arcs are drawn
 * as real arcs from the centre and radius the interpreter worked out, never as
 * polylines, and only in the plane they were programmed in — seen from the other
 * view an arc is the straight line between its ends, which the caption says.
 *
 * Rapids and cutting moves differ in dash pattern as well as in colour, and the
 * legend names both, because colour on its own carries nothing to a reader who
 * cannot see it. The whole drawing is one `role="img"` with a written
 * description, since the SVG itself tells a screen reader nothing.
 */

/* SVG strokes need values rather than classes; these are the SPEC 5.1 tokens. */
const RULE_STRONG = "#B4BDB8";
const BLUE = "#17395B";
const BLUE_BRIGHT = "#2E90C4";

const TWO_PI = Math.PI * 2;
const MIN_SPAN_MM = 12;
const ASPECT = 1.5;
const PAD_LEFT = 0.1;
const PAD_RIGHT = 0.26;
const PAD_TOP = 0.1;
const PAD_BOTTOM = 0.26;
/** How faint the part of the program that has not run yet is drawn. */
const REMAINING_OPACITY = 0.22;

type Axis = "x" | "y" | "z";

interface ViewSpec {
  id: string;
  label: string;
  /** Machine axis running left to right, and the one running up the page. */
  h: Axis;
  v: Axis;
  hLabel: string;
  vLabel: string;
  /** Arcs in this plane are drawn as arcs; anything else becomes a chord. */
  arcPlane: Plane;
  /**
   * True when this view looks at the plane from the opposite side to the one an
   * arc direction is defined from, which reverses how the arc reads on the page.
   */
  flipSweep: boolean;
  caption: string;
}

const VIEWS: ViewSpec[] = [
  {
    id: "plan",
    label: "Plan · X Y",
    h: "x",
    v: "y",
    hLabel: "X",
    vLabel: "Y",
    arcPlane: "XY",
    flipSweep: false,
    caption:
      "Looking down on the table from above, the way a drawing of the part is laid out. Depth does not show here, so a plunge is a single point.",
  },
  {
    id: "front",
    label: "Front · X Z",
    h: "x",
    v: "z",
    hLabel: "X",
    vLabel: "Z",
    arcPlane: "ZX",
    flipSweep: true,
    caption:
      "Looking at the front of the machine, so Z runs up the page and every plunge and retract is visible. Movement in Y does not show here.",
  },
];

interface Flat {
  h: number;
  v: number;
}

interface ArcGeometry {
  centre: Flat;
  radius: number;
  startAngle: number;
  /** Magnitude of the swept angle, always positive. */
  sweep: number;
  /** Counter-clockwise seen from the plane's own reference direction. */
  ccw: boolean;
}

function project(position: Vec3, view: ViewSpec): Flat {
  return { h: position[view.h], v: position[view.v] };
}

function normalise(angle: number): number {
  const wrapped = angle % TWO_PI;
  return wrapped < 0 ? wrapped + TWO_PI : wrapped;
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function finite(...values: number[]): boolean {
  return values.every((value) => Number.isFinite(value));
}

function atLeastMinimum(span: number): number {
  return Math.max(span, MIN_SPAN_MM);
}

/** Screen y runs down the page; machine v runs up it. */
function point(flat: Flat): string {
  return `${round(flat.h)},${round(-flat.v)}`;
}

function arcGeometry(segment: PathSegment, view: ViewSpec): ArcGeometry | null {
  if (segment.kind !== "arc-cw" && segment.kind !== "arc-ccw") return null;
  if (!segment.centre || segment.plane !== view.arcPlane) return null;

  const centre = project(segment.centre, view);
  const from = project(segment.from, view);
  const to = project(segment.to, view);
  if (!finite(centre.h, centre.v, from.h, from.v, to.h, to.v)) return null;

  const measured = Math.hypot(from.h - centre.h, from.v - centre.v);
  const radius = segment.radius && segment.radius > 0 ? segment.radius : measured;
  if (!Number.isFinite(radius) || radius <= 0) return null;

  const ccw = segment.kind === "arc-ccw";
  const startAngle = Math.atan2(from.v - centre.v, from.h - centre.h);
  const endAngle = Math.atan2(to.v - centre.v, to.h - centre.h);
  let sweep = normalise(ccw ? endAngle - startAngle : startAngle - endAngle);
  // Ends that coincide are a full circle, not a zero-length arc.
  if (sweep < 1e-6) sweep = TWO_PI;

  return { centre, radius, startAngle, sweep, ccw };
}

/**
 * An arc as two SVG arc commands. Splitting it in half keeps each piece at or
 * under a half turn, so the large-arc flag is always 0, and a full circle — which
 * one arc command cannot express at all — comes out right.
 */
function arcPathData(arc: ArcGeometry, to: Flat, view: ViewSpec): string {
  const signed = arc.ccw ? arc.sweep : -arc.sweep;
  const at = (angle: number): Flat => ({
    h: arc.centre.h + arc.radius * Math.cos(angle),
    v: arc.centre.v + arc.radius * Math.sin(angle),
  });
  // Machine counter-clockwise reads counter-clockwise on the page when the view
  // looks along the plane's reference direction. The front view looks at the
  // other face of that plane, so its sweep runs the other way about.
  const screenCcw = view.flipSweep ? !arc.ccw : arc.ccw;
  const flag = screenCcw ? 0 : 1;
  const r = round(arc.radius);
  return [
    `M${point(at(arc.startAngle))}`,
    `A${r},${r} 0 0 ${flag} ${point(at(arc.startAngle + signed / 2))}`,
    `A${r},${r} 0 0 ${flag} ${point(to)}`,
  ].join("");
}

function segmentPath(segment: PathSegment, view: ViewSpec): string | null {
  const from = project(segment.from, view);
  const to = project(segment.to, view);
  if (!finite(from.h, from.v, to.h, to.v)) return null;
  const arc = arcGeometry(segment, view);
  if (arc) return arcPathData(arc, to, view);
  return `M${point(from)}L${point(to)}`;
}

/** The quarter points an arc really passes through, so the fit is not guessed. */
function arcExtremes(arc: ArcGeometry): Flat[] {
  const out: Flat[] = [];
  for (let quarter = 0; quarter < 4; quarter += 1) {
    const angle = (quarter * Math.PI) / 2;
    const travelled = normalise(arc.ccw ? angle - arc.startAngle : arc.startAngle - angle);
    if (travelled <= arc.sweep + 1e-9) {
      out.push({
        h: arc.centre.h + arc.radius * Math.cos(angle),
        v: arc.centre.v + arc.radius * Math.sin(angle),
      });
    }
  }
  return out;
}

interface Frame {
  viewBox: string;
  x0: number;
  y0: number;
  /** Width and height of the view, in millimetres. */
  width: number;
  height: number;
  /** Extents of the path itself, which is what the dimensions describe. */
  min: Flat;
  max: Flat;
  hasPath: boolean;
}

function frameFor(
  view: ViewSpec,
  segments: PathSegment[],
  bounds: Bounds | null,
  position: Vec3,
): Frame {
  let minH = Infinity;
  let maxH = -Infinity;
  let minV = Infinity;
  let maxV = -Infinity;

  const include = (h: number, v: number) => {
    if (!finite(h, v)) return;
    minH = Math.min(minH, h);
    maxH = Math.max(maxH, h);
    minV = Math.min(minV, v);
    maxV = Math.max(maxV, v);
  };

  if (bounds) {
    include(bounds.min[view.h], bounds.min[view.v]);
    include(bounds.max[view.h], bounds.max[view.v]);
  }
  for (const segment of segments) {
    include(segment.from[view.h], segment.from[view.v]);
    include(segment.to[view.h], segment.to[view.v]);
    const arc = arcGeometry(segment, view);
    if (arc) for (const extreme of arcExtremes(arc)) include(extreme.h, extreme.v);
  }

  const hasPath = Number.isFinite(minH);
  if (!hasPath) {
    minH = 0;
    maxH = 0;
    minV = 0;
    maxV = 0;
  }
  const min: Flat = { h: minH, v: minV };
  const max: Flat = { h: maxH, v: maxV };

  // Part zero and the tool are in shot whatever the path does.
  include(0, 0);
  include(position[view.h], position[view.v]);

  const spanH = atLeastMinimum(maxH - minH);
  const spanV = atLeastMinimum(maxV - minV);
  const centreH = (minH + maxH) / 2;
  const centreV = (minV + maxV) / 2;

  let x0 = centreH - spanH / 2 - spanH * PAD_LEFT;
  let x1 = centreH + spanH / 2 + spanH * PAD_RIGHT;
  let y0 = centreV - spanV / 2 - spanV * PAD_BOTTOM;
  let y1 = centreV + spanV / 2 + spanV * PAD_TOP;

  let width = x1 - x0;
  let height = y1 - y0;
  if (width / height < ASPECT) {
    const grow = (height * ASPECT - width) / 2;
    x0 -= grow;
    x1 += grow;
    width = x1 - x0;
  } else {
    const grow = (width / ASPECT - height) / 2;
    y0 -= grow;
    y1 += grow;
    height = y1 - y0;
  }

  return {
    viewBox: `${round(x0)} ${round(-y1)} ${round(width)} ${round(height)}`,
    x0: round(x0),
    y0: round(-y1),
    width,
    height,
    min,
    max,
    hasPath,
  };
}

/**
 * The graph wash. SPEC 5.5 asks for an 8 mm grid, which is right for a part you
 * can hold; a program that runs a metre would turn it into a solid block, so the
 * pitch steps up through the usual 1–2–5 sequence and the caption says which
 * pitch is on the page.
 */
function gridPitch(width: number): number {
  const candidates = [1, 2, 5, 8, 10, 20, 25, 50, 100, 200, 500, 1000, 2000];
  for (const pitch of candidates) {
    if (width / pitch <= 22) return pitch;
  }
  return 2000;
}

export interface ToolpathViewProps {
  /** Every move the program makes, in execution order. */
  segments: PathSegment[];
  /** Moves before this index have run; the rest are drawn faintly. */
  doneCount: number;
  /** The active step's own moves are the half-open range below. */
  activeFrom: number;
  activeTo: number;
  bounds: Bounds | null;
  /** Where the tool is left after the active step. */
  position: Vec3;
  onSelectLine: (lineIndex: number) => void;
}

export function ToolpathView(props: ToolpathViewProps) {
  const items = VIEWS.map((view) => ({
    id: view.id,
    label: view.label,
    content: <ToolpathDrawing view={view} {...props} />,
  }));

  return (
    <section
      aria-labelledby="toolpath-heading"
      className="flex h-full flex-col rounded-sm border border-rule bg-paper-raised shadow-panel"
    >
      <div className="border-b border-rule px-5 py-4 sm:px-6">
        <h2 id="toolpath-heading" className="text-[18px] font-semibold sm:text-[20px]">
          The path this program describes
        </h2>
        <p className="eyebrow mt-1">Dimensions in mm · commanded tool centre</p>
      </div>
      <div className="flex-1 px-5 py-4 sm:px-6">
        <Tabs items={items} ariaLabel="Toolpath views" />
      </div>
    </section>
  );
}

function ToolpathDrawing({
  view,
  segments,
  doneCount,
  activeFrom,
  activeTo,
  bounds,
  position,
  onSelectLine,
}: ToolpathViewProps & { view: ViewSpec }) {
  const instanceId = useId();
  const uid = `tp-${view.id}-${instanceId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const frame = frameFor(view, segments, bounds, position);

  const unit = frame.width / 100;
  const fontSize = frame.width / 46;
  const pitch = gridPitch(frame.width);
  const tool = project(position, view);

  const spanH = frame.max.h - frame.min.h;
  const spanV = frame.max.v - frame.min.v;
  const showH = frame.hasPath && spanH > 1e-6;
  const showV = frame.hasPath && spanV > 1e-6;

  /* Dimensions sit clear of everything drawn, with extension lines that start
     off the path and run past the dimension line, as they would on a drawing. */
  const stepV = atLeastMinimum(spanV);
  const stepH = atLeastMinimum(spanH);
  const baseV = Math.min(frame.min.v, 0);
  const baseH = Math.max(frame.max.h, 0);
  const dimV = baseV - stepV * 0.13;
  const dimH = baseH + stepH * 0.13;

  const rapidCount = segments.filter((segment) => segment.kind === "rapid").length;
  const cutCount = segments.length - rapidCount;

  const description = segments.length
    ? `${view.label} view of the toolpath. ${segments.length} moves in all: ${rapidCount} rapid and ${cutCount} at a feed rate. The path covers ${formatFixed(spanH, 1)} millimetres in ${view.hLabel} and ${formatFixed(spanV, 1)} in ${view.vLabel}. ${doneCount} moves have run, and the tool is at ${view.hLabel} ${formatFixed(tool.h, 3)}, ${view.vLabel} ${formatFixed(tool.v, 3)} millimetres.`
    : `${view.label} view. This program commands no movement, so there is no path to draw and only part zero is marked.`;

  const drawn = segments.map((segment, index) => ({
    d: segmentPath(segment, view),
    segment,
    index,
  }));
  const remaining = drawn.filter((item) => item.index >= doneCount);
  const travelled = drawn.filter((item) => item.index < doneCount);
  const current = drawn.filter((item) => item.index >= activeFrom && item.index < activeTo);

  return (
    <div>
      <svg
        role="img"
        aria-label={description}
        viewBox={frame.viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-[620px] text-ink-soft"
      >
        <defs>
          <pattern
            id={`${uid}-grid`}
            x={0}
            y={0}
            width={pitch}
            height={pitch}
            patternUnits="userSpaceOnUse"
          >
            {/* Sized in user units rather than by vector-effect: a pattern is
                its own coordinate system, and this way the wash is the same
                weight in every browser. */}
            <path
              d={`M${pitch} 0V${pitch}M0 ${pitch}H${pitch}`}
              fill="none"
              stroke={BLUE}
              strokeOpacity={0.06}
              strokeWidth={round(frame.width / 900)}
            />
          </pattern>
          <marker
            id={`${uid}-arrow-end`}
            viewBox="0 0 10 6"
            refX={10}
            refY={3}
            markerWidth={unit * 2.6}
            markerHeight={unit * 1.6}
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path d="M0 0L10 3L0 6Z" fill="currentColor" />
          </marker>
          <marker
            id={`${uid}-arrow-start`}
            viewBox="0 0 10 6"
            refX={0}
            refY={3}
            markerWidth={unit * 2.6}
            markerHeight={unit * 1.6}
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path d="M10 0L0 3L10 6Z" fill="currentColor" />
          </marker>
        </defs>

        <rect
          x={frame.x0}
          y={frame.y0}
          width={round(frame.width)}
          height={round(frame.height)}
          fill={`url(#${uid}-grid)`}
        />

        {/* Extents, dimensioned. */}
        {showH ? (
          <g stroke="currentColor" fill="none" strokeWidth={0.75}>
            <path
              d={`M${point({ h: frame.min.h, v: baseV - stepV * 0.03 })}L${point({
                h: frame.min.h,
                v: baseV - stepV * 0.16,
              })}`}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={`M${point({ h: frame.max.h, v: baseV - stepV * 0.03 })}L${point({
                h: frame.max.h,
                v: baseV - stepV * 0.16,
              })}`}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={`M${point({ h: frame.min.h, v: dimV })}L${point({ h: frame.max.h, v: dimV })}`}
              vectorEffect="non-scaling-stroke"
              markerStart={`url(#${uid}-arrow-start)`}
              markerEnd={`url(#${uid}-arrow-end)`}
            />
          </g>
        ) : null}
        {showV ? (
          <g stroke="currentColor" fill="none" strokeWidth={0.75}>
            <path
              d={`M${point({ h: baseH + stepH * 0.03, v: frame.min.v })}L${point({
                h: baseH + stepH * 0.16,
                v: frame.min.v,
              })}`}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={`M${point({ h: baseH + stepH * 0.03, v: frame.max.v })}L${point({
                h: baseH + stepH * 0.16,
                v: frame.max.v,
              })}`}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={`M${point({ h: dimH, v: frame.min.v })}L${point({ h: dimH, v: frame.max.v })}`}
              vectorEffect="non-scaling-stroke"
              markerStart={`url(#${uid}-arrow-start)`}
              markerEnd={`url(#${uid}-arrow-end)`}
            />
          </g>
        ) : null}
        <g fill="currentColor" className="font-mono tabular-nums" fontSize={round(fontSize)}>
          {showH ? (
            <text
              x={round((frame.min.h + frame.max.h) / 2)}
              y={round(-dimV + fontSize * 1.15)}
              textAnchor="middle"
            >
              {formatFixed(spanH, 1)}
            </text>
          ) : null}
          {showV ? (
            <text
              x={round(dimH + fontSize * 0.9)}
              y={round(-(frame.min.v + frame.max.v) / 2)}
              textAnchor="middle"
              transform={`rotate(-90 ${round(dimH + fontSize * 0.9)} ${round(
                -(frame.min.v + frame.max.v) / 2,
              )})`}
            >
              {formatFixed(spanV, 1)}
            </text>
          ) : null}
        </g>

        {/* Part zero, marked as a datum. */}
        <g stroke={BLUE} fill="none" strokeWidth={1}>
          <circle cx={0} cy={0} r={round(unit * 1.8)} vectorEffect="non-scaling-stroke" />
          <path
            d={`M${round(-unit * 3)},0H${round(unit * 3)}M0,${round(-unit * 3)}V${round(unit * 3)}`}
            vectorEffect="non-scaling-stroke"
          />
        </g>
        <text
          x={round(unit * 3.4)}
          y={round(unit * 4.8)}
          className="font-mono tabular-nums"
          fontSize={round(fontSize * 0.82)}
          fill={BLUE}
        >
          0,0
        </text>

        {/* The path, in painting order: what is left, what has run, this step. */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {remaining.map((item) =>
            item.d ? (
              <path
                key={`rest-${item.index}`}
                d={item.d}
                stroke={item.segment.kind === "rapid" ? RULE_STRONG : BLUE}
                strokeOpacity={REMAINING_OPACITY}
                strokeWidth={item.segment.kind === "rapid" ? 1 : 1.75}
                strokeDasharray={item.segment.kind === "rapid" ? "4 3" : undefined}
                vectorEffect="non-scaling-stroke"
              />
            ) : null,
          )}
          {travelled.map((item) =>
            item.d ? (
              <path
                key={`done-${item.index}`}
                d={item.d}
                stroke={item.segment.kind === "rapid" ? RULE_STRONG : BLUE}
                strokeWidth={item.segment.kind === "rapid" ? 1 : 1.75}
                strokeDasharray={item.segment.kind === "rapid" ? "4 3" : undefined}
                vectorEffect="non-scaling-stroke"
              />
            ) : null,
          )}
          {current.map((item) =>
            item.d ? (
              <path
                key={`now-${item.index}`}
                d={item.d}
                stroke={BLUE_BRIGHT}
                strokeWidth={2.5}
                strokeDasharray={item.segment.kind === "rapid" ? "4 3" : undefined}
                vectorEffect="non-scaling-stroke"
              />
            ) : null,
          )}
        </g>

        {/* The tool, where this step leaves it. */}
        <g stroke={BLUE_BRIGHT} fill="none">
          <circle
            cx={round(tool.h)}
            cy={round(-tool.v)}
            r={round(unit * 1.6)}
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M${round(tool.h - unit * 3)},${round(-tool.v)}H${round(tool.h + unit * 3)}M${round(
              tool.h,
            )},${round(-tool.v - unit * 3)}V${round(-tool.v + unit * 3)}`}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Pointer targets, wide enough to hit. The listing is the keyboard
            route to the same thing, so nothing is reachable only here. */}
        <g fill="none" stroke="transparent" style={{ pointerEvents: "stroke" }}>
          {drawn.map((item) =>
            item.d ? (
              <path
                key={`hit-${item.index}`}
                d={item.d}
                strokeWidth={12}
                vectorEffect="non-scaling-stroke"
                className="cursor-pointer"
                onClick={() => onSelectLine(item.segment.lineIndex)}
              />
            ) : null,
          )}
        </g>
      </svg>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {LEGEND.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <LegendSwatch kind={item.kind} />
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-soft">
              {item.label}
            </span>
            <span className="text-[12px] leading-tight text-ink-soft">{item.meaning}</span>
          </li>
        ))}
      </ul>

      <p className="measure mt-3 text-[13px] leading-snug text-ink-soft">
        {segments.length === 0
          ? "This program commands no movement yet, so there is nothing to draw but part zero. "
          : ""}
        {view.caption} Graph wash at <span className="num">{pitch}</span> mm. Click a move to jump
        the simulation to the line that made it. Arcs are drawn as true arcs only in the plane they
        were programmed in; seen from the other view, an arc is the straight line between its ends.
      </p>
    </div>
  );
}

const LEGEND: { kind: "rapid" | "cut" | "left" | "tool"; label: string; meaning: string }[] = [
  { kind: "rapid", label: "Rapid · dashed", meaning: "G00 positioning, not cutting" },
  { kind: "cut", label: "Feed · solid", meaning: "G01, G02 and G03 at the F rate" },
  { kind: "left", label: "Not run · faded", meaning: "the rest of the program" },
  { kind: "tool", label: "Tool · circled cross", meaning: "where this step leaves it" },
];

function LegendSwatch({ kind }: { kind: "rapid" | "cut" | "left" | "tool" }) {
  return (
    <svg aria-hidden="true" width="22" height="10" viewBox="0 0 22 10" className="shrink-0">
      {kind === "rapid" ? (
        <path d="M0 5H22" stroke={RULE_STRONG} strokeWidth={1} strokeDasharray="3.5 2.5" />
      ) : null}
      {kind === "cut" ? <path d="M0 5H22" stroke={BLUE} strokeWidth={2} /> : null}
      {kind === "left" ? (
        <path d="M0 5H22" stroke={BLUE} strokeOpacity={REMAINING_OPACITY} strokeWidth={2} />
      ) : null}
      {kind === "tool" ? (
        <g stroke={BLUE_BRIGHT} fill="none" strokeWidth={1}>
          <circle cx={11} cy={5} r={3} />
          <path d="M5 5H17M11 0V10" />
        </g>
      ) : null}
    </svg>
  );
}
