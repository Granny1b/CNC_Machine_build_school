/**
 * Figure `ballscrew`: a sectioned ball screw feed drive, end to end.
 *
 * Section conventions, SPEC 5.5: cut material is hatched, axes of rotation are
 * dash-dot centrelines, the lead is dimensioned with extension lines standing
 * off the object and arrowheads at both ends, and every balloon has a leader
 * with a filled dot at the feature it names.
 *
 * The geometry is arranged so the balls sit exactly in the groove between two
 * thread crests, which is where they sit in the real thing: the crest pitch and
 * the ball spacing are the same 60-unit lead.
 */

const LEAD = 60;
const TOP_CRESTS = [300, 360, 420, 480, 540, 600, 660, 720, 780];
const BOTTOM_CRESTS = [330, 390, 450, 510, 570, 630, 690, 750];

/** Balloon plus leader plus the filled dot at the feature end. */
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
  // Start the leader on the balloon's edge, in the direction of the feature.
  const dx = toX - cx;
  const dy = toY - cy;
  const length = Math.hypot(dx, dy) || 1;
  const startX = cx + (dx / length) * 15;
  const startY = cy + (dy / length) * 15;
  const endX = toX - (dx / length) * 4;
  const endY = toY - (dy / length) * 4;

  return (
    <g>
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
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

const PARTS = [
  "Servo motor — the torque source, commanded by the drive",
  "Coupling — transmits torque without pulling the screw off line",
  "Fixed support bearings — an angular-contact pair taking thrust both ways",
  "Ball screw — hardened, ground helical groove; the crests are one lead apart",
  "Ball nut — recirculating balls in the groove, returned through the channel above",
  "Saddle — the moving structure the nut flange is bolted to",
  "Profile rail and bearing blocks — carry the load and hold the line of travel",
  "Supported end bearing — locates the far end and lets the screw grow with heat",
  "Bed — the casting everything is aligned to",
];

export function BallScrewFigure() {
  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <svg
          viewBox="0 0 1000 500"
          role="img"
          aria-label="A sectioned ball screw drive: motor, coupling and a fixed pair of support bearings at the left, a threaded screw running to a supported bearing at the right, a ball nut part way along with recirculating balls and a return channel, the nut bolted through a flange to a saddle riding a profile rail on two bearing blocks, and the screw lead dimensioned between two adjacent thread crests."
          className="h-auto w-full min-w-[52rem]"
        >
          <defs>
            <pattern
              id="bs-hatch"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="8" className="stroke-rule-strong" strokeWidth="1" />
            </pattern>
            <marker
              id="bs-dim"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 10 5 0 10Z" className="fill-ink" />
            </marker>
            <marker
              id="bs-flow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0 0 10 5 0 10Z" className="fill-blue" />
            </marker>
          </defs>

          {/* Axis of rotation. */}
          <line
            x1={30}
            y1={280}
            x2={970}
            y2={280}
            className="stroke-ink-soft"
            strokeWidth="1"
            strokeDasharray="18 5 3 5"
          />

          {/* ---- bed, rail, bearing blocks ---- */}
          <g className="stroke-ink-soft" strokeWidth="1.5">
            <rect x={240} y={412} width={700} height={40} className="fill-paper-sunk" />
            <rect x={280} y={392} width={620} height={20} className="fill-paper-raised" />
            <rect x={424} y={356} width={76} height={36} className="fill-paper-raised" />
            <rect x={700} y={356} width={76} height={36} className="fill-paper-raised" />
          </g>
          <line x1={280} y1={402} x2={900} y2={402} className="stroke-rule-strong" strokeWidth="1" />

          {/* ---- saddle: top plate and two cut side walls with a bore for the screw ---- */}
          <g className="stroke-ink" strokeWidth="1.5">
            <rect x={440} y={120} width={320} height={50} className="fill-paper-sunk" />
            <rect x={440} y={170} width={32} height={80} fill="url(#bs-hatch)" />
            <rect x={440} y={310} width={32} height={46} fill="url(#bs-hatch)" />
            <rect x={728} y={170} width={32} height={80} fill="url(#bs-hatch)" />
            <rect x={728} y={310} width={32} height={46} fill="url(#bs-hatch)" />
          </g>

          {/* ---- motor, coupling, fixed support bearings ---- */}
          <g className="stroke-ink-soft" strokeWidth="1.5">
            <rect x={40} y={236} width={110} height={88} className="fill-paper-sunk" />
            <rect x={150} y={272} width={26} height={16} className="fill-paper-raised" />
            <rect x={176} y={252} width={44} height={56} className="fill-paper-raised" />
          </g>
          <g className="stroke-rule-strong" strokeWidth="1">
            <line x1={62} y1={246} x2={62} y2={314} />
            <line x1={82} y1={246} x2={82} y2={314} />
            <line x1={102} y1={246} x2={102} y2={314} />
            <line x1={122} y1={246} x2={122} y2={314} />
            <line x1={188} y1={256} x2={188} y2={304} />
            <line x1={198} y1={256} x2={198} y2={304} />
            <line x1={208} y1={256} x2={208} y2={304} />
          </g>
          <g className="stroke-ink" strokeWidth="1.4">
            <rect x={220} y={240} width={62} height={80} fill="url(#bs-hatch)" />
            <rect x={220} y={268} width={62} height={24} className="fill-paper-raised" />
            <circle cx={240} cy={257} r={8} className="fill-paper-raised" />
            <circle cx={264} cy={257} r={8} className="fill-paper-raised" />
            <circle cx={240} cy={303} r={8} className="fill-paper-raised" />
            <circle cx={264} cy={303} r={8} className="fill-paper-raised" />
          </g>

          {/* ---- supported end bearing ---- */}
          <g className="stroke-ink" strokeWidth="1.4">
            <rect x={890} y={248} width={56} height={64} fill="url(#bs-hatch)" />
            <rect x={890} y={268} width={56} height={24} className="fill-paper-raised" />
            <circle cx={918} cy={259} r={7} className="fill-paper-raised" />
            <circle cx={918} cy={301} r={7} className="fill-paper-raised" />
          </g>

          {/* ---- the screw: core, journals and thread crests ---- */}
          <g className="stroke-ink" strokeWidth="1.5" fill="none">
            <line x1={282} y1={268} x2={946} y2={268} />
            <line x1={282} y1={292} x2={946} y2={292} />
            {TOP_CRESTS.map((x) => (
              <path key={`t${x}`} d={`M${x} 268Q${x + LEAD / 2} 244 ${x + LEAD} 268`} />
            ))}
            {BOTTOM_CRESTS.map((x) => (
              <path key={`b${x}`} d={`M${x} 292Q${x + LEAD / 2} 316 ${x + LEAD} 292`} />
            ))}
          </g>

          {/* ---- the ball nut: hatched frame, return channel, recirculating balls ---- */}
          <g className="stroke-ink" strokeWidth="1.5">
            <rect x={520} y={232} width={160} height={24} fill="url(#bs-hatch)" />
            <rect x={520} y={304} width={160} height={24} fill="url(#bs-hatch)" />
            <rect x={520} y={232} width={16} height={96} fill="url(#bs-hatch)" />
            <rect x={664} y={232} width={16} height={96} fill="url(#bs-hatch)" />
            <rect x={580} y={170} width={40} height={62} className="fill-paper-sunk" />
          </g>
          <rect
            x={542}
            y={236}
            width={116}
            height={16}
            rx={8}
            className="fill-paper-raised stroke-ink-soft"
            strokeWidth="1.2"
          />
          <g className="fill-paper-raised stroke-ink" strokeWidth="1.3">
            {/* Load-carrying balls, seated in the groove between two crests. */}
            <circle cx={540} cy={268} r={11} />
            <circle cx={600} cy={268} r={11} />
            <circle cx={660} cy={268} r={11} />
            <circle cx={570} cy={292} r={11} />
            <circle cx={630} cy={292} r={11} />
            {/* Balls on the return leg, unloaded. */}
            <circle cx={556} cy={244} r={5} />
            <circle cx={578} cy={244} r={5} />
            <circle cx={600} cy={244} r={5} />
            <circle cx={622} cy={244} r={5} />
            <circle cx={644} cy={244} r={5} />
          </g>
          <g
            className="stroke-blue"
            strokeWidth="1.6"
            fill="none"
            markerEnd="url(#bs-flow)"
          >
            <path d="M668 256C680 248 672 242 656 243" />
            <path d="M548 248C536 252 534 260 540 265" />
          </g>

          {/* ---- lead dimension, groove to groove, clear of the saddle ---- */}
          <g className="stroke-ink" strokeWidth="1">
            <line x1={780} y1={262} x2={780} y2={196} />
            <line x1={840} y1={262} x2={840} y2={196} />
            <line
              x1={780}
              y1={206}
              x2={840}
              y2={206}
              markerStart="url(#bs-dim)"
              markerEnd="url(#bs-dim)"
            />
          </g>
          <text
            x={810}
            y={190}
            textAnchor="middle"
            className="fill-ink font-mono"
            fontSize={17}
          >
            P
          </text>

          {/* ---- balloons ---- */}
          <Balloon n={1} cx={95} cy={190} toX={95} toY={234} />
          <Balloon n={2} cx={198} cy={190} toX={198} toY={252} />
          <Balloon n={3} cx={262} cy={150} toX={262} toY={240} />
          <Balloon n={4} cx={500} cy={196} toX={510} toY={256} />
          <Balloon n={5} cx={700} cy={196} toX={678} toY={236} />
          <Balloon n={6} cx={600} cy={90} toX={600} toY={120} />
          <Balloon n={7} cx={840} cy={358} toX={846} toY={396} />
          <Balloon n={8} cx={918} cy={200} toX={918} toY={248} />
          <Balloon n={9} cx={300} cy={478} toX={300} toY={450} />

          <text x={440} y={470} className="fill-ink-soft font-mono" fontSize={15}>
            hatching shows cut material · P is the lead
          </text>
          <text x={440} y={492} className="fill-ink-soft font-mono" fontSize={15}>
            single-start screw: one groove to the next is one lead
          </text>
        </svg>
      </div>

      <div className="mt-4 border-t border-rule pt-4">
        <p className="eyebrow">Parts list · section through the feed drive</p>
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
        <p className="mt-3 text-[13px] leading-snug text-ink-soft">
          <span className="num text-ink">P</span> is the lead: the axial distance the nut advances
          for one full turn of the screw. On the single-start screw drawn here it is also the
          distance from one thread groove to the next, which is how it is dimensioned above.
        </p>
      </div>
    </div>
  );
}
