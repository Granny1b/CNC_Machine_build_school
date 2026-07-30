/**
 * Figure `axis-triad`: the standard right-handed X, Y, Z triad on a vertical
 * machining centre, with the three rotary axes about the correct linear axes.
 *
 * Drawing decisions worth knowing:
 *   - Z is drawn parallel to the spindle axis, which is marked with a dash-dot
 *     centreline running through the head, spindle and tool;
 *   - the triad itself is drawn clear of the tool with a leader line and a
 *     filled dot at its true origin, the tool tip. Drawing it on the tool would
 *     bury the +Z arrow inside the spindle;
 *   - positive senses are tool motion relative to the workpiece, so the table
 *     arrow points the opposite way to the commanded direction — the single
 *     thing beginners most often get backwards.
 */
export function AxisTriadFigure() {
  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <svg
          viewBox="0 0 1000 600"
          role="img"
          aria-label="A vertical machining centre in side view with a right-handed axis triad drawn beside the tool: positive Z upwards along the spindle axis, positive X to the right, positive Y away from the viewer, and curved arrows for the rotary axes A about X, B about Y and C about Z."
          className="h-auto w-full min-w-[44rem]"
        >
          <defs>
            <marker
              id="triad-arrow-blue"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0 0 10 5 0 10Z" className="fill-blue" />
            </marker>
            <marker
              id="triad-arrow-mid"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0 0 10 5 0 10Z" className="fill-blue-mid" />
            </marker>
            <marker
              id="triad-arrow-ink"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0 0 10 5 0 10Z" className="fill-ink-soft" />
            </marker>
          </defs>

          {/* ---- the machine, in section-free side elevation ---- */}
          <g className="stroke-ink-soft" strokeWidth="1.5">
            <rect x={90} y={470} width={700} height={70} className="fill-paper-sunk" />
            <rect x={690} y={110} width={100} height={360} className="fill-paper-sunk" />
            <rect x={480} y={150} width={210} height={90} className="fill-paper-sunk" />
            <rect x={500} y={240} width={60} height={70} className="fill-paper-raised" />
            <path d="M502 310H558L546 340H514Z" className="fill-paper-raised" />
            <rect x={522} y={340} width={16} height={30} className="fill-paper-raised" />
            <rect x={200} y={420} width={430} height={50} className="fill-paper-raised" />
            <rect x={460} y={370} width={140} height={50} className="fill-paper-sunk" />
          </g>

          {/* Spindle centreline: dash-dot, the convention for an axis of rotation. */}
          <line
            x1={530}
            y1={120}
            x2={530}
            y2={398}
            className="stroke-ink-soft"
            strokeWidth="1"
            strokeDasharray="18 5 3 5"
          />

          {/* ---- the triad, drawn clear of the tool ---- */}
          <g className="stroke-blue" strokeWidth="2.2" fill="none">
            <line x1={300} y1={308} x2={300} y2={170} markerEnd="url(#triad-arrow-blue)" />
            <line x1={312} y1={320} x2={452} y2={320} markerEnd="url(#triad-arrow-blue)" />
            <line x1={291} y1={311} x2={198} y2={234} markerEnd="url(#triad-arrow-blue)" />
          </g>
          <circle cx={300} cy={320} r={4.5} className="fill-blue" />

          {/* Leader from the triad origin to the point it really belongs to. */}
          <line
            x1={314}
            y1={333}
            x2={521}
            y2={368}
            className="stroke-ink-soft"
            strokeWidth="1"
            strokeDasharray="6 4"
          />
          <circle cx={528} cy={369} r={4} className="fill-ink" />

          {/* Rotary axes: a long curved arrow about each linear axis. */}
          <g className="stroke-blue-mid" strokeWidth="1.8" fill="none" markerEnd="url(#triad-arrow-mid)">
            <path d="M380 303A26 26 0 1 1 420 303" />
            <path d="M222 253A24 24 0 1 1 258 253" />
            <path d="M280 203A26 26 0 1 1 320 203" />
          </g>

          {/* Axis lettering. Linear axes take the primary blue, which clears
              4.5:1 on paper; the rotary letters are set in ink because blue-mid
              does not. Colour is never the only cue: every axis is lettered. */}
          <g className="fill-blue font-mono" fontSize={21}>
            <text x={314} y={180}>
              +Z
            </text>
            <text x={458} y={327}>
              +X
            </text>
            <text x={166} y={222}>
              +Y
            </text>
          </g>
          <g className="fill-ink font-mono" fontSize={17}>
            <text x={386} y={286}>
              +A
            </text>
            <text x={264} y={247}>
              +B
            </text>
            <text x={330} y={214}>
              +C
            </text>
          </g>

          {/* Which way the castings move. The convention describes the tool. */}
          <line
            x1={424}
            y1={447}
            x2={300}
            y2={447}
            className="stroke-ink-soft"
            strokeWidth="1.6"
            markerEnd="url(#triad-arrow-ink)"
          />
          <text x={434} y={452} className="fill-ink-soft font-mono" fontSize={15}>
            table travels &minus;X
          </text>

          {/* Part lettering. */}
          <g className="fill-ink font-mono" fontSize={15}>
            <text x={600} y={282}>
              spindle
            </text>
            <text x={470} y={399}>
              workpiece
            </text>
            <text x={208} y={412}>
              table
            </text>
            <text x={700} y={300}>
              column
            </text>
            <text x={110} y={512}>
              base
            </text>
          </g>

          {/* Drawing notes. */}
          <g className="fill-ink-soft font-mono" fontSize={16}>
            <text x={90} y={566}>
              Note 1 — the triad is drawn clear of the tool; its origin is the tool tip.
            </text>
            <text x={90} y={588}>
              Note 2 — +Z is parallel to the spindle axis and points away from the work.
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 border-t border-rule pt-4">
        <p className="eyebrow">Key to the axes</p>
        <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {[
            ["+X", "to the right, viewed from the front of the machine"],
            ["+Y", "away from the operator, into the machine"],
            ["+Z", "up the spindle axis, lifting the tool out of the work"],
            ["+A", "rotation about X, positive by the right-hand rule"],
            ["+B", "rotation about Y, positive by the right-hand rule"],
            ["+C", "rotation about Z, positive by the right-hand rule"],
          ].map(([symbol, meaning]) => (
            <li key={symbol} className="flex gap-3 text-[14px] leading-snug text-ink-soft">
              <span className="num w-8 shrink-0 text-[13px] text-blue">{symbol}</span>
              <span>{meaning}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
