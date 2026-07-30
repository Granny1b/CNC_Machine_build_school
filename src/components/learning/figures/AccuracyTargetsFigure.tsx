/**
 * Figure `accuracy-targets`: three targets separating accuracy from
 * repeatability.
 *
 * The mean of the shots is drawn as a diamond in the measurement cyan, quite
 * unlike the round shots, because the whole idea rests on seeing the mean and
 * the spread as two different quantities: accuracy is where the mean sits,
 * repeatability is how wide the spread is.
 *
 * Shot positions are hand-authored, not generated. A figure that changed on
 * every render could not be referred to in the prose, and a random draw might
 * not illustrate the case it is meant to illustrate.
 */

interface Target {
  cx: number;
  label: string;
  detail: string;
  /** Shot offsets from the true position, in drawing units. */
  shots: [number, number][];
  /** Mean offset from the true position. */
  mean: [number, number];
  /** Radius of the dashed spread circle drawn about the mean. */
  spread: number;
}

const CY = 160;
const RINGS = [32, 64, 96];
const OUTER = 120;

const TARGETS: Target[] = [
  {
    cx: 180,
    label: "Accurate, not repeatable",
    detail: "mean on target, scatter wide",
    shots: [
      [-70, -40],
      [60, -55],
      [75, 50],
      [-55, 65],
      [-10, -20],
    ],
    mean: [0, 0],
    spread: 98,
  },
  {
    cx: 510,
    label: "Repeatable, not accurate",
    detail: "scatter tight, mean off target",
    shots: [
      [48, -58],
      [62, -44],
      [55, -52],
      [60, -56],
      [50, -45],
    ],
    mean: [55, -51],
    spread: 20,
  },
  {
    cx: 840,
    label: "Accurate and repeatable",
    detail: "mean on target, scatter tight",
    shots: [
      [-6, 4],
      [5, -7],
      [2, 6],
      [-4, -5],
      [3, 2],
    ],
    mean: [0, 0],
    spread: 18,
  },
];

export function AccuracyTargetsFigure() {
  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <svg
          viewBox="0 0 1020 400"
          role="img"
          aria-label="Three targets. On the first, five shots are scattered widely but their mean sits on the true position: accurate but not repeatable. On the second, five shots sit in a tight group away from the true position, with the offset marked as systematic error: repeatable but not accurate. On the third, a tight group sits on the true position: accurate and repeatable."
          className="h-auto w-full min-w-[42rem]"
        >
          <defs>
            <marker
              id="tg-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 10 5 0 10Z" className="fill-ink" />
            </marker>
          </defs>

          {TARGETS.map((target) => {
            const meanX = target.cx + target.mean[0];
            const meanY = CY + target.mean[1];
            return (
              <g key={target.cx}>
                {/* Rings, then the outer boundary a shade stronger. */}
                <g className="stroke-rule-strong" strokeWidth="1" fill="none">
                  {RINGS.map((r) => (
                    <circle key={r} cx={target.cx} cy={CY} r={r} />
                  ))}
                </g>
                <circle
                  cx={target.cx}
                  cy={CY}
                  r={OUTER}
                  className="stroke-ink-soft"
                  strokeWidth="1.4"
                  fill="none"
                />

                {/* Centre lines, dash-dot as on a drawing. */}
                <g className="stroke-ink-soft" strokeWidth="1" strokeDasharray="16 4 2 4">
                  <line x1={target.cx - 132} y1={CY} x2={target.cx + 132} y2={CY} />
                  <line x1={target.cx} y1={CY - 132} x2={target.cx} y2={CY + 132} />
                </g>

                {/* The true position. */}
                <g className="stroke-ink" strokeWidth="1.8">
                  <line x1={target.cx - 9} y1={CY} x2={target.cx + 9} y2={CY} />
                  <line x1={target.cx} y1={CY - 9} x2={target.cx} y2={CY + 9} />
                </g>

                {/* The spread of the shots, about their own mean. */}
                <circle
                  cx={meanX}
                  cy={meanY}
                  r={target.spread}
                  className="stroke-blue-bright"
                  strokeWidth="1.4"
                  strokeDasharray="7 5"
                  fill="none"
                />

                {/* The shots. */}
                {target.shots.map(([dx, dy], index) => (
                  <circle
                    key={index}
                    cx={target.cx + dx}
                    cy={CY + dy}
                    r={6.5}
                    className="fill-ink-soft"
                  />
                ))}

                {/* Their mean: a diamond, never a dot. */}
                <rect
                  x={meanX - 9}
                  y={meanY - 9}
                  width={18}
                  height={18}
                  transform={`rotate(45 ${meanX} ${meanY})`}
                  className="fill-paper-raised stroke-blue-bright"
                  strokeWidth="2.2"
                />
                <circle cx={meanX} cy={meanY} r={2.6} className="fill-blue-bright" />

                <text
                  x={target.cx}
                  y={312}
                  textAnchor="middle"
                  className="fill-ink font-mono"
                  fontSize={18}
                >
                  {target.label}
                </text>
                <text
                  x={target.cx}
                  y={338}
                  textAnchor="middle"
                  className="fill-ink-soft font-mono"
                  fontSize={15}
                >
                  {target.detail}
                </text>
              </g>
            );
          })}

          {/* The spread, called out once. */}
          <g className="stroke-ink-soft" strokeWidth="1">
            <line x1={249} y1={91} x2={272} y2={68} />
          </g>
          <circle cx={249} cy={91} r={3.5} className="fill-ink" />
          <text x={278} y={72} className="fill-ink font-mono" fontSize={14}>
            the spread
          </text>

          {/* The offset of the mean, called out once. */}
          <line
            x1={510}
            y1={160}
            x2={565}
            y2={109}
            className="stroke-ink"
            strokeWidth="1.4"
            markerEnd="url(#tg-arrow)"
          />
          <text x={568} y={104} className="fill-ink font-mono" fontSize={14}>
            systematic error
          </text>
        </svg>
      </div>

      <div className="mt-4 border-t border-rule pt-4">
        <p className="eyebrow">Key</p>
        <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          <li className="flex items-center gap-3 text-[14px] leading-snug text-ink-soft">
            <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true" className="shrink-0">
              <circle cx="11" cy="8" r="5" className="fill-ink-soft" />
            </svg>
            one measured shot
          </li>
          <li className="flex items-center gap-3 text-[14px] leading-snug text-ink-soft">
            <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true" className="shrink-0">
              <rect
                x="5"
                y="2"
                width="12"
                height="12"
                transform="rotate(45 11 8)"
                className="fill-paper-raised stroke-blue-bright"
                strokeWidth="2"
              />
            </svg>
            the mean of the shots — this is what accuracy is about
          </li>
          <li className="flex items-center gap-3 text-[14px] leading-snug text-ink-soft">
            <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true" className="shrink-0">
              <circle
                cx="11"
                cy="8"
                r="6"
                fill="none"
                className="stroke-blue-bright"
                strokeWidth="1.6"
                strokeDasharray="4 3"
              />
            </svg>
            the spread of the shots — this is what repeatability is about
          </li>
          <li className="flex items-center gap-3 text-[14px] leading-snug text-ink-soft">
            <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true" className="shrink-0">
              <g className="stroke-ink" strokeWidth="1.8">
                <line x1="5" y1="8" x2="17" y2="8" />
                <line x1="11" y1="2" x2="11" y2="14" />
              </g>
            </svg>
            the true position you were aiming at
          </li>
        </ul>
      </div>
    </div>
  );
}
