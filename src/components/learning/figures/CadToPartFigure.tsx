/**
 * Figure `cad-to-part`: the chain that turns an intention into a measured
 * component.
 *
 * Drawing vernacular, SPEC 5.5: hairline strokes, balloon callouts numbered in
 * mono, and an adjacent parts list keyed to the same numbers. The teaching text
 * lives in the lesson's authored caption — the strings here are drawing labels,
 * the equivalent of the lettering on a print.
 *
 * The accent down the left edge of each box says where the stage happens: blue
 * for the stages that exist only as data, ink for the stages that exist in
 * metal. That distinction is the point of the figure.
 */

interface Stage {
  n: number;
  name: string;
  /** Where the stage happens: in the computer, or in the metal. */
  world: "data" | "metal";
  /** What leaves the stage, for the parts list. */
  output: string;
}

const STAGES: Stage[] = [
  { n: 1, name: "Design intent", world: "data", output: "the requirement, in words, sketches and constraints" },
  { n: 2, name: "CAD model", world: "data", output: "exact geometry, plus the tolerances that matter" },
  { n: 3, name: "CAM toolpaths", world: "data", output: "cutter paths, tools, depths, speeds and feeds" },
  { n: 4, name: "Post-processor", world: "data", output: "paths translated for one specific control" },
  { n: 5, name: "G-code program", world: "data", output: "the text the machine actually executes" },
  { n: 6, name: "Machine", world: "metal", output: "real motion, under real cutting load" },
  { n: 7, name: "Finished part", world: "metal", output: "metal, carrying every error the chain added" },
  { n: 8, name: "Inspection", world: "metal", output: "measured evidence of what was really made" },
];

/** Row 1 runs left to right, row 2 runs right to left, so the chain snakes. */
const NODE_W = 216;
const NODE_H = 96;
const ROW_1_Y = 70;
const ROW_2_Y = 300;
const COLUMNS = [22, 268, 514, 760];
const POSITIONS = [
  { x: COLUMNS[0], y: ROW_1_Y },
  { x: COLUMNS[1], y: ROW_1_Y },
  { x: COLUMNS[2], y: ROW_1_Y },
  { x: COLUMNS[3], y: ROW_1_Y },
  { x: COLUMNS[3], y: ROW_2_Y },
  { x: COLUMNS[2], y: ROW_2_Y },
  { x: COLUMNS[1], y: ROW_2_Y },
  { x: COLUMNS[0], y: ROW_2_Y },
];

export function CadToPartFigure() {
  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <svg
          viewBox="0 0 1000 420"
          role="img"
          aria-label="A flow of eight stages: design intent, CAD model, CAM toolpaths, post-processor and G-code program happen as data; machine, finished part and inspection happen in metal. Inspection feeds back to design intent."
          className="h-auto w-full min-w-[46rem]"
        >
          <defs>
            <marker
              id="cad-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 10 5 0 10Z" className="fill-ink-soft" />
            </marker>
          </defs>

          {/* Flow arrows, drawn before the boxes so nothing overlaps lettering. */}
          <g className="stroke-ink-soft" strokeWidth="1.4" markerEnd="url(#cad-arrow)">
            {/* Row 1, left to right. */}
            <line x1={238} y1={118} x2={262} y2={118} />
            <line x1={484} y1={118} x2={508} y2={118} />
            <line x1={730} y1={118} x2={754} y2={118} />
            {/* Down the right-hand side into row 2. */}
            <line x1={868} y1={170} x2={868} y2={294} />
            {/* Row 2, right to left. */}
            <line x1={756} y1={348} x2={732} y2={348} />
            <line x1={510} y1={348} x2={486} y2={348} />
            <line x1={264} y1={348} x2={240} y2={348} />
            {/* Inspection feeds the next design: the one dashed path. */}
            <line x1={130} y1={296} x2={130} y2={172} strokeDasharray="7 5" />
          </g>

          <text x={146} y={222} className="fill-ink-soft font-mono" fontSize={15}>
            measured evidence
          </text>
          <text x={146} y={244} className="fill-ink-soft font-mono" fontSize={15}>
            feeds the next design
          </text>

          {STAGES.map((stage, index) => {
            const { x, y } = POSITIONS[index];
            return (
              <g key={stage.n}>
                <rect
                  x={x}
                  y={y}
                  width={NODE_W}
                  height={NODE_H}
                  rx="2"
                  className="fill-paper-raised stroke-ink-soft"
                  strokeWidth="1.4"
                />
                <rect
                  x={x}
                  y={y}
                  width={4}
                  height={NODE_H}
                  className={stage.world === "data" ? "fill-blue" : "fill-ink"}
                />
                <circle
                  cx={x + 30}
                  cy={y + 48}
                  r={15}
                  className="fill-paper-raised stroke-ink"
                  strokeWidth="1.3"
                />
                <text
                  x={x + 30}
                  y={y + 48}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-ink font-mono"
                  fontSize={16}
                >
                  {String(stage.n).padStart(2, "0")}
                </text>
                <text
                  x={x + 54}
                  y={y + 48}
                  dominantBaseline="central"
                  className="fill-ink font-mono"
                  fontSize={17}
                >
                  {stage.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* The parts list. Numbers match the balloons, as on a print. */}
      <div className="mt-4 border-t border-rule pt-4">
        <p className="eyebrow">Parts list · what leaves each stage</p>
        <ol className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {STAGES.map((stage) => (
            <li key={stage.n} className="flex gap-3 text-[14px] leading-snug text-ink-soft">
              <span className="num shrink-0 text-[12px] text-ink">
                {String(stage.n).padStart(2, "0")}
              </span>
              <span>
                <span className="font-mono text-[13px] text-ink">{stage.name}</span>
                <span className="mx-1.5 text-ink-soft" aria-hidden="true">
                  &mdash;
                </span>
                {stage.output}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-soft">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-3 w-1 bg-blue" />
            stages that exist only as data
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-3 w-1 bg-ink" />
            stages that exist in metal
          </span>
        </p>
      </div>
    </div>
  );
}
