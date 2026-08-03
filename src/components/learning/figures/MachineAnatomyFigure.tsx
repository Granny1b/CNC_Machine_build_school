/**
 * Figure `machine-anatomy`: a vertical machining centre with balloon callouts
 * numbered in mono against an adjacent parts list, SPEC 5.5.
 *
 * The near sheet-metal panel is taken off — the enclosure is drawn as a dashed
 * outline — so the structure inside can be seen. The ball screw is drawn as a
 * hidden feature inside the base, because that is where it lives and where
 * learners never think to look for it.
 */

const PARTS = [
  "Base — the casting the whole geometry is referenced to",
  "Column — carries the spindle head and closes the structural loop",
  "Spindle — holds and turns the tool, and takes the cutting load",
  "Table — the surface the work or the fixture is clamped to",
  "Saddle — the intermediate slide giving the second axis of travel",
  "Linear rails — let one axis move freely while resisting every other",
  "Ball screw — turns motor rotation into axis travel, hidden in the base",
  "Safety enclosure — contains chips, coolant and noise; interlocked doors",
  "Control cabinet and pendant — the computer, the drives and the operator's window",
  "Chip conveyor — takes swarf out of the machine so it can keep cutting",
];

/** Balloon, leader and the filled dot at the feature end. */
function Balloon({
  n,
  cx,
  cy,
  toX,
  toY,
}: {
  n: number;
  cx: number;
  cy: number;
  toX: number;
  toY: number;
}) {
  const dx = toX - cx;
  const dy = toY - cy;
  const length = Math.hypot(dx, dy) || 1;
  return (
    <g>
      <line
        x1={cx + (dx / length) * 15}
        y1={cy + (dy / length) * 15}
        x2={toX - (dx / length) * 4}
        y2={toY - (dy / length) * 4}
        className="stroke-ink-soft"
        strokeWidth="1"
      />
      <circle cx={toX} cy={toY} r={4} className="fill-ink" />
      <circle cx={cx} cy={cy} r={15} className="fill-paper-raised stroke-ink" strokeWidth="1.3" />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink font-mono"
        fontSize={16}
      >
        {String(n).padStart(2, "0")}
      </text>
    </g>
  );
}

export function MachineAnatomyFigure() {
  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <svg
          viewBox="0 0 1020 660"
          role="img"
          aria-label="A vertical machining centre with the near panel removed, showing ten numbered callouts: the base casting, the column, the spindle, the table, the saddle, the linear rails, the ball screw hidden inside the base, the safety enclosure, the control cabinet with its operator pendant, and the chip conveyor leaving the machine at the bottom right."
          className="h-auto w-full min-w-[48rem]"
        >
          <defs>
            <marker
              id="anat-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0 0 10 5 0 10Z" className="fill-ink-soft" />
            </marker>
          </defs>

          {/* Safety enclosure: dashed, because the near panel is off. */}
          <rect
            x={200}
            y={90}
            width={610}
            height={495}
            className="stroke-ink-soft"
            strokeWidth="1.4"
            strokeDasharray="12 7"
            fill="none"
          />
          <rect
            x={240}
            y={150}
            width={150}
            height={150}
            className="fill-blue-wash stroke-ink-soft"
            strokeWidth="1.3"
          />
          <text x={210} y={118} className="fill-ink-soft font-mono" fontSize={15}>
            near panel removed for clarity
          </text>
          <text x={248} y={172} className="fill-ink-soft font-mono" fontSize={14}>
            door window
          </text>

          {/* Structure and motion. */}
          <g className="stroke-ink-soft" strokeWidth="1.5">
            <rect x={250} y={480} width={510} height={80} className="fill-paper-sunk" />
            <rect x={280} y={462} width={420} height={18} className="fill-paper-raised" />
            <rect x={330} y={430} width={310} height={32} className="fill-paper-sunk" />
            <rect x={300} y={390} width={380} height={40} className="fill-paper-raised" />
            <rect x={450} y={355} width={110} height={35} className="fill-paper-sunk" />
            <rect x={660} y={110} width={130} height={370} className="fill-paper-sunk" />
            <rect x={450} y={140} width={240} height={70} className="fill-paper-sunk" />
            <rect x={475} y={210} width={60} height={80} className="fill-paper-raised" />
            <path d="M488 290H522L514 320H496Z" className="fill-paper-raised" />
            <rect x={498} y={320} width={14} height={35} className="fill-paper-raised" />
          </g>
          <line x1={280} y1={471} x2={700} y2={471} className="stroke-rule-strong" strokeWidth="1" />

          {/* Ball screw, hidden inside the base: dashed outline, dash-dot axis. */}
          <g className="stroke-ink-soft" strokeWidth="1.2" strokeDasharray="9 5" fill="none">
            <line x1={310} y1={496} x2={690} y2={496} />
            <line x1={310} y1={514} x2={690} y2={514} />
          </g>
          <line
            x1={296}
            y1={505}
            x2={704}
            y2={505}
            className="stroke-ink-soft"
            strokeWidth="1"
            strokeDasharray="16 4 2 4"
          />
          <rect
            x={255}
            y={488}
            width={55}
            height={34}
            className="fill-paper-raised stroke-ink-soft"
            strokeWidth="1.3"
          />

          {/* Chip conveyor, leaving through the bottom corner of the enclosure. */}
          <path
            d="M690 530H750L880 608H820Z"
            className="fill-paper-sunk stroke-ink-soft"
            strokeWidth="1.5"
          />
          <line
            x1={730}
            y1={548}
            x2={840}
            y2={594}
            className="stroke-ink-soft"
            strokeWidth="1.4"
            markerEnd="url(#anat-arrow)"
          />

          {/* Control cabinet and operator pendant. */}
          <g className="stroke-ink-soft" strokeWidth="1.5">
            <rect x={860} y={160} width={65} height={310} className="fill-paper-sunk" />
            <line x1={892} y1={160} x2={892} y2={470} />
            <line x1={925} y1={260} x2={935} y2={260} />
            <rect x={935} y={210} width={73} height={100} className="fill-paper-raised" />
            <rect x={943} y={218} width={57} height={54} className="fill-blue-wash" />
          </g>
          <g className="stroke-rule-strong" strokeWidth="1">
            <line x1={947} y1={282} x2={996} y2={282} />
            <line x1={947} y1={294} x2={996} y2={294} />
          </g>

          {/* Balloons, keyed to the parts list. */}
          <Balloon n={1} cx={400} cy={620} toX={400} toY={548} />
          <Balloon n={2} cx={720} cy={66} toX={700} toY={112} />
          <Balloon n={3} cx={415} cy={250} toX={477} toY={252} />
          <Balloon n={4} cx={150} cy={370} toX={302} toY={400} />
          <Balloon n={5} cx={150} cy={425} toX={332} toY={446} />
          <Balloon n={6} cx={150} cy={478} toX={284} toY={470} />
          <Balloon n={7} cx={560} cy={620} toX={560} toY={506} />
          <Balloon n={8} cx={150} cy={140} toX={202} toY={166} />
          <Balloon n={9} cx={940} cy={120} toX={890} toY={162} />
          <line
            x1={944}
            y1={134}
            x2={962}
            y2={206}
            className="stroke-ink-soft"
            strokeWidth="1"
          />
          <circle cx={963} cy={209} r={4} className="fill-ink" />
          <Balloon n={10} cx={940} cy={556} toX={810} toY={584} />
        </svg>
      </div>

      <div className="mt-4 border-t border-rule pt-4">
        <p className="eyebrow">Parts list</p>
        <ol className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {PARTS.map((part, index) => (
            <li key={part} className="flex gap-3 text-[14px] leading-snug text-ink-soft">
              <span className="num shrink-0 text-[12px] text-ink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{part}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
