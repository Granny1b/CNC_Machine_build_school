/**
 * Figure `architectures`: four machine layouts drawn as simple sections at the
 * same scale, so the comparison is between shapes rather than between drawings.
 *
 * The structural loop — the closed chain of metal from the cutting edge back
 * round to the workpiece — is traced on the C-frame in the measurement cyan.
 * It is drawn once rather than four times: the point is to learn to trace it,
 * not to read it off.
 *
 * Each cell is drawn in its own 500 by 330 coordinate space and translated into
 * place, which is why every drawing below reads from a local origin.
 */

import type { ReactNode } from "react";

const OUTLINE = "stroke-ink-soft";

function CellFrame({
  title,
  descriptor,
  descriptorTone = "soft",
  note,
  children,
}: {
  title: string;
  descriptor: string;
  descriptorTone?: "soft" | "loop";
  note: string;
  children: ReactNode;
}) {
  return (
    <>
      <text x={14} y={28} className="fill-ink font-mono" fontSize={18}>
        {title}
      </text>
      <text
        x={14}
        y={48}
        className={`font-mono ${descriptorTone === "loop" ? "fill-blue" : "fill-ink-soft"}`}
        fontSize={14}
      >
        {descriptor}
      </text>
      {children}
      <text x={14} y={316} className="fill-ink-soft font-mono" fontSize={14}>
        {note}
      </text>
    </>
  );
}

function CFrame() {
  return (
    <CellFrame
      title="C-frame"
      descriptor="structural loop traced in blue"
      descriptorTone="loop"
      note="short loop, but the head is cantilevered off one column"
    >
      <g className={OUTLINE} strokeWidth="1.5">
        <rect x={60} y={250} width={370} height={35} className="fill-paper-sunk" />
        <rect x={350} y={90} width={80} height={160} className="fill-paper-sunk" />
        <rect x={230} y={100} width={130} height={40} className="fill-paper-sunk" />
        <rect x={268} y={140} width={34} height={36} className="fill-paper-raised" />
        <rect x={279} y={176} width={12} height={20} className="fill-paper-raised" />
        <rect x={245} y={196} width={80} height={22} className="fill-paper-sunk" />
        <rect x={120} y={218} width={210} height={32} className="fill-paper-raised" />
      </g>
      <path
        d="M285 196V120H390V267H225V234H285V212Z"
        fill="none"
        className="stroke-blue-bright"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </CellFrame>
  );
}

function FixedBridge() {
  return (
    <CellFrame
      title="Fixed-bridge gantry"
      descriptor="bridge never moves; the work moves under the spindle"
      note="long travel needs a long bed and a large footprint"
    >
      <g className={OUTLINE} strokeWidth="1.5">
        <rect x={50} y={250} width={400} height={38} className="fill-paper-sunk" />
        <rect x={110} y={110} width={50} height={140} className="fill-paper-sunk" />
        <rect x={340} y={110} width={50} height={140} className="fill-paper-sunk" />
        <rect x={100} y={70} width={300} height={40} className="fill-paper-sunk" />
        <rect x={220} y={110} width={60} height={35} className="fill-paper-raised" />
        <rect x={236} y={145} width={28} height={33} className="fill-paper-raised" />
        <rect x={244} y={178} width={12} height={22} className="fill-paper-raised" />
        <rect x={205} y={200} width={90} height={18} className="fill-paper-sunk" />
        <rect x={150} y={218} width={200} height={32} className="fill-paper-raised" />
      </g>
      <g
        className="stroke-ink"
        strokeWidth="1.4"
        markerStart="url(#arch-arrow)"
        markerEnd="url(#arch-arrow)"
      >
        <line x1={180} y1={236} x2={320} y2={236} />
        <line x1={306} y1={118} x2={306} y2={172} />
      </g>
      <text x={326} y={241} className="fill-ink font-mono" fontSize={15}>
        X
      </text>
      <text x={314} y={150} className="fill-ink font-mono" fontSize={15}>
        Z
      </text>
      <text x={112} y={95} className="fill-ink font-mono" fontSize={14}>
        fixed bridge
      </text>
    </CellFrame>
  );
}

function MovingGantry() {
  return (
    <CellFrame
      title="Moving gantry"
      descriptor="the gantry travels; the work stays where it is"
      note="less mass to move, but the gantry must resist twist"
    >
      <g className={OUTLINE} strokeWidth="1.5">
        <rect x={60} y={235} width={380} height={40} className="fill-paper-sunk" />
        <rect x={60} y={228} width={380} height={7} className="fill-paper-raised" />
        <rect x={150} y={110} width={40} height={118} className="fill-paper-sunk" />
        <rect x={300} y={110} width={40} height={118} className="fill-paper-sunk" />
        <rect x={140} y={70} width={210} height={40} className="fill-paper-sunk" />
        <rect x={215} y={110} width={60} height={35} className="fill-paper-raised" />
        <rect x={231} y={145} width={28} height={33} className="fill-paper-raised" />
        <rect x={239} y={178} width={12} height={22} className="fill-paper-raised" />
        <rect x={200} y={200} width={100} height={28} className="fill-paper-sunk" />
      </g>
      <line
        x1={160}
        y1={90}
        x2={330}
        y2={90}
        className="stroke-ink"
        strokeWidth="1.4"
        markerStart="url(#arch-arrow)"
        markerEnd="url(#arch-arrow)"
      />
      <text x={338} y={95} className="fill-ink font-mono" fontSize={15}>
        X
      </text>
      <text x={205} y={222} className="fill-ink font-mono" fontSize={14}>
        workpiece
      </text>
    </CellFrame>
  );
}

function BoxInBox() {
  return (
    <CellFrame
      title="Box-in-box"
      descriptor="each axis nested inside the one before it"
      note="symmetric and stiff, and the hardest of the four to build"
    >
      <g className={OUTLINE} strokeWidth="1.5">
        {/* Outer box: two walls, a top beam and the bed. */}
        <rect x={70} y={90} width={40} height={210} className="fill-paper-sunk" />
        <rect x={390} y={90} width={40} height={210} className="fill-paper-sunk" />
        <rect x={70} y={90} width={360} height={40} className="fill-paper-sunk" />
        <rect x={70} y={268} width={360} height={32} className="fill-paper-sunk" />
        {/* Inner box, sliding inside the outer one. */}
        <rect x={150} y={130} width={200} height={50} className="fill-paper-raised" />
        <rect x={168} y={142} width={164} height={26} className="fill-paper-sunk" />
        {/* Spindle carried by the inner box. */}
        <rect x={236} y={180} width={28} height={34} className="fill-paper-raised" />
        <rect x={244} y={214} width={12} height={18} className="fill-paper-raised" />
        <rect x={210} y={232} width={80} height={18} className="fill-paper-sunk" />
        <rect x={140} y={250} width={220} height={18} className="fill-paper-raised" />
      </g>
      <g
        className="stroke-ink"
        strokeWidth="1.4"
        markerStart="url(#arch-arrow)"
        markerEnd="url(#arch-arrow)"
      >
        <line x1={150} y1={110} x2={350} y2={110} />
        <line x1={300} y1={186} x2={300} y2={228} />
      </g>
      <text x={356} y={115} className="fill-ink font-mono" fontSize={15}>
        X
      </text>
      <text x={308} y={212} className="fill-ink font-mono" fontSize={15}>
        Z
      </text>
    </CellFrame>
  );
}

export function ArchitecturesFigure() {
  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <svg
          viewBox="0 0 1000 660"
          role="img"
          aria-label="Four machine layouts drawn as sections: a C-frame with its structural loop traced from the cutting edge up the spindle, across the head, down the column, along the base and back through the table; a fixed-bridge gantry whose table moves under a stationary bridge; a moving gantry that travels over stationary work; and a box-in-box layout with each axis nested inside the one before it."
          className="h-auto w-full min-w-[46rem]"
        >
          <defs>
            <marker
              id="arch-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0 0 10 5 0 10Z" className="fill-ink" />
            </marker>
          </defs>

          {/* Cell dividers, hairline as SPEC 5.5 asks. */}
          <g className="stroke-rule-strong" strokeWidth="1">
            <line x1={500} y1={16} x2={500} y2={644} />
            <line x1={16} y1={330} x2={984} y2={330} />
          </g>

          <g transform="translate(0 0)">
            <CFrame />
          </g>
          <g transform="translate(500 0)">
            <FixedBridge />
          </g>
          <g transform="translate(0 330)">
            <MovingGantry />
          </g>
          <g transform="translate(500 330)">
            <BoxInBox />
          </g>
        </svg>
      </div>

      <div className="mt-4 border-t border-rule pt-4">
        <p className="eyebrow">Reading the sections</p>
        <p className="measure mt-2 text-[14px] leading-[1.6] text-ink-soft">
          Every layout has to close the same loop: cutting edge, spindle, head, structure, bed,
          table, workpiece, back to the cutting edge. The four differ in how long that loop is, how
          symmetric it is, and which mass has to be accelerated to make a cut. Trace the loop on the
          other three and the trade-offs argue themselves.
        </p>
      </div>
    </div>
  );
}
