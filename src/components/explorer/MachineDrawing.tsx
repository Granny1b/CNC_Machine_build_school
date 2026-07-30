"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { MachineComponent } from "@/content/types";

/**
 * Hand-authored cutaway of a vertical machining centre, drawn in the vernacular
 * of SPEC.md section 5.5: hairline strokes, `currentColor` so the drawing
 * themes with its container, section hatching on cut faces, leader lines with a
 * filled dot at the feature end, and balloon callouts numbered in mono that
 * match the parts list beside the drawing.
 *
 * The machine is drawn in bridge (double-column) form so that every component
 * SPEC.md section 10 requires has a real place to sit — including the gantry
 * cross-beam, which a single-column C-frame layout does not have.
 *
 * The balloons are not SVG elements. They are ordinary HTML buttons, absolutely
 * positioned over the drawing by the hotspot percentages held in
 * `machine-components.ts`, which keeps focus rings, hit areas and accessible
 * names behaving exactly as they do everywhere else on the site.
 *
 * Drawing units: a 960 × 640 viewBox, so a hotspot at x = 50 sits at 480 units.
 */

const VB_W = 960;
const VB_H = 640;

export const SYSTEM_LABEL: Record<MachineComponent["system"], string> = {
  structure: "structure",
  motion: "motion",
  spindle: "spindle and tooling",
  control: "control",
  auxiliary: "auxiliary",
  safety: "safety",
};

/** Feature end of the leader line, in viewBox units. Small parts only. */
const LEADER_TARGETS: Record<string, [number, number]> = {
  "linear-rails": [215, 486],
  "bearing-blocks": [243, 480],
  "ball-screw": [280, 434],
  "ball-screw-supports": [435, 434],
  "servo-motor": [486, 450],
  coupling: [456, 434],
  encoder: [514, 424],
  "tool-holder": [338, 332],
  sensors: [438, 184],
};

/** Outline drawn round the selected part, in viewBox units: [x, y, w, h]. */
const HIGHLIGHTS: Record<string, [number, number, number, number][]> = {
  base: [[90, 524, 506, 42]],
  bed: [[158, 492, 370, 32]],
  column: [
    [104, 156, 46, 368],
    [536, 156, 46, 368],
  ],
  gantry: [[94, 98, 498, 58]],
  saddle: [[196, 450, 280, 26]],
  table: [[180, 388, 320, 30]],
  "linear-rails": [[186, 484, 300, 8]],
  "bearing-blocks": [
    [220, 476, 46, 8],
    [404, 476, 46, 8],
  ],
  "ball-screw": [[228, 428, 196, 12]],
  "ball-screw-supports": [
    [206, 420, 22, 30],
    [424, 420, 22, 30],
  ],
  "servo-motor": [[466, 414, 40, 38]],
  coupling: [[446, 424, 20, 20]],
  encoder: [[506, 422, 16, 22]],
  spindle: [[306, 236, 52, 64]],
  "tool-holder": [[302, 300, 60, 48]],
  "tool-changer": [[154, 194, 104, 104]],
  "cnc-controller": [[628, 150, 108, 150]],
  "electrical-cabinet": [[748, 96, 156, 480]],
  "lubrication-system": [[476, 196, 58, 54]],
  "coolant-system": [[452, 530, 120, 32]],
  "chip-conveyor": [
    [24, 538, 96, 30],
    [120, 530, 210, 32],
  ],
  "safety-enclosure": [[70, 60, 542, 524]],
  doors: [[170, 140, 260, 428]],
  sensors: [[428, 172, 20, 24]],
};

/** Conventional freehand break line, marking where a panel is cut away. */
function verticalBreak(x: number, y1: number, y2: number, step = 30, amp = 5): string {
  let d = `M ${x} ${y1}`;
  let i = 0;
  for (let y = y1 + step / 2; y < y2; y += step, i += 1) {
    d += ` L ${x + (i % 2 === 0 ? amp : -amp)} ${y}`;
  }
  return `${d} L ${x} ${y2}`;
}

/** Helix hatching along the ball-screw shaft. */
function screwHelix(x1: number, x2: number, top: number, bottom: number, pitch = 12): string {
  let d = "";
  for (let x = x1; x < x2 - 8; x += pitch) {
    d += `M ${x} ${bottom} L ${x + 8} ${top} `;
  }
  return d.trim();
}

export interface MachineDrawingProps {
  /** Every component, in parts-list order. The index sets the balloon number. */
  components: MachineComponent[];
  /** Ids the current filter leaves interactive. */
  enabledIds: string[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MachineDrawing({
  components,
  enabledIds,
  selectedId,
  onSelect,
}: MachineDrawingProps) {
  const [rovingId, setRovingId] = useState<string | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const enabledSet = new Set(enabledIds);
  const enabled = components.filter((component) => enabledSet.has(component.id));

  const activeId =
    rovingId && enabledSet.has(rovingId)
      ? rovingId
      : selectedId && enabledSet.has(selectedId)
        ? selectedId
        : (enabled[0]?.id ?? null);

  function moveTo(index: number) {
    if (enabled.length === 0) return;
    const next = enabled[(index + enabled.length) % enabled.length];
    setRovingId(next.id);
    buttonRefs.current[next.id]?.focus();
  }

  function handleHotspotKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveTo(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveTo(index - 1);
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(enabled.length - 1);
        break;
      default:
        break;
    }
  }

  const highlightBoxes = selectedId ? (HIGHLIGHTS[selectedId] ?? []) : [];

  return (
    <div className="overflow-x-auto">
      <div className="relative mx-auto min-w-[720px] max-w-[900px]">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="block h-auto w-full text-ink-soft"
          role="img"
          aria-label="Cutaway drawing of a bridge-type vertical machining centre with numbered balloon callouts on every major component. The same components are listed, and can be opened, in the parts list below the drawing."
        >
          <defs>
            <pattern
              id="explorer-cut-hatch"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="10" className="stroke-rule-strong" strokeWidth="1" />
            </pattern>
            <marker
              id="explorer-arrow"
              markerWidth="9"
              markerHeight="9"
              refX="8"
              refY="4.5"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L9 4.5 L0 9 Z" fill="currentColor" />
            </marker>
          </defs>

          {/* ---------- sheet furniture ---------- */}
          <text
            x="70"
            y="40"
            className="fill-ink-faint font-mono"
            fontSize="13"
            letterSpacing="1.6"
          >
            VERTICAL MACHINING CENTRE — BRIDGE TYPE — CUTAWAY
          </text>
          <line x1="20" y1="584" x2="940" y2="584" stroke="currentColor" strokeWidth="1.2" />

          {/* ---------- base, feet, bed ---------- */}
          <g stroke="currentColor" strokeWidth="1.2" className="fill-paper-raised">
            <rect x="90" y="524" width="506" height="42" />
            <rect x="120" y="566" width="40" height="12" />
            <rect x="510" y="566" width="40" height="12" />
            <rect x="158" y="492" width="370" height="32" />
          </g>

          {/* ---------- chip trough and coolant tank, in cut windows ---------- */}
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <rect x="120" y="530" width="210" height="32" fill="url(#explorer-cut-hatch)" />
            <rect x="452" y="530" width="120" height="32" className="fill-paper-sunk" />
            <path d="M120 562 L24 568 L24 538 L120 530 Z" className="fill-paper-sunk" />
            <path d="M132 546 L318 546" strokeDasharray="6 5" />
            <path d="M36 553 L108 548" strokeDasharray="6 5" />
            <circle cx="470" cy="546" r="8" className="fill-paper-raised" />
          </g>

          {/* ---------- Y guideway between bed and saddle ---------- */}
          <g stroke="currentColor" strokeWidth="1.2">
            <rect x="186" y="484" width="300" height="8" className="fill-paper-sunk" />
            <rect x="220" y="476" width="46" height="8" className="fill-paper-raised" />
            <rect x="404" y="476" width="46" height="8" className="fill-paper-raised" />
          </g>

          {/* ---------- saddle ---------- */}
          <g stroke="currentColor" strokeWidth="1.2">
            <rect x="196" y="450" width="280" height="26" className="fill-paper-raised" />
          </g>
          <path
            d="M210 476 L210 450 M462 476 L462 450"
            className="stroke-rule-strong"
            strokeWidth="1"
            fill="none"
          />

          {/* ---------- X feed drive, drawn as a broken-out section ---------- */}
          <g stroke="currentColor" strokeWidth="1.2">
            <rect x="206" y="420" width="22" height="30" className="fill-paper-sunk" />
            <rect x="424" y="420" width="22" height="30" className="fill-paper-sunk" />
            <rect x="228" y="428" width="196" height="12" className="fill-paper-raised" />
            <rect x="312" y="418" width="46" height="26" className="fill-paper-sunk" />
            <rect x="446" y="424" width="20" height="20" className="fill-paper-raised" />
            <rect x="466" y="414" width="40" height="38" className="fill-paper-raised" />
            <rect x="506" y="422" width="16" height="22" className="fill-paper-raised" />
          </g>
          <path
            d={screwHelix(232, 424, 428, 440)}
            stroke="currentColor"
            strokeWidth="0.9"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M452 428 L460 440 M452 440 L460 428"
            stroke="currentColor"
            strokeWidth="0.9"
            fill="none"
          />

          {/* ---------- table and workpiece ---------- */}
          <g stroke="currentColor" strokeWidth="1.2">
            <rect x="180" y="388" width="320" height="30" className="fill-paper-raised" />
            <rect x="220" y="388" width="12" height="7" className="fill-paper-sunk" />
            <rect x="334" y="388" width="12" height="7" className="fill-paper-sunk" />
            <rect x="448" y="388" width="12" height="7" className="fill-paper-sunk" />
            <rect x="258" y="370" width="144" height="18" fill="url(#explorer-cut-hatch)" />
          </g>

          {/* ---------- columns and cross-beam ---------- */}
          <g stroke="currentColor" strokeWidth="1.2" className="fill-paper-raised">
            <rect x="104" y="156" width="46" height="368" />
            <rect x="536" y="156" width="46" height="368" />
            <rect x="94" y="98" width="498" height="58" />
          </g>
          <g className="stroke-rule-strong" strokeWidth="0.9" fill="none">
            <path d="M104 240 L150 200 M104 320 L150 280 M104 400 L150 360 M104 480 L150 440" />
            <path d="M536 240 L582 200 M536 320 L582 280 M536 400 L582 360 M536 480 L582 440" />
            <path d="M120 156 L160 98 M200 156 L240 98 M280 156 L320 98 M400 156 L440 98 M480 156 L520 98" />
          </g>

          {/* ---------- ram, spindle, holder, cutter ---------- */}
          <g stroke="currentColor" strokeWidth="1.2">
            <rect x="288" y="156" width="88" height="80" className="fill-paper-raised" />
            <rect x="284" y="160" width="6" height="72" className="fill-paper-sunk" />
            <rect x="374" y="160" width="6" height="72" className="fill-paper-sunk" />
            <rect x="306" y="236" width="52" height="64" className="fill-paper-raised" />
            <rect x="302" y="300" width="60" height="14" className="fill-paper-sunk" />
            <path d="M306 314 L358 314 L340 348 L324 348 Z" className="fill-paper-raised" />
            <rect x="328" y="348" width="12" height="22" className="fill-paper-sunk" />
          </g>
          <g stroke="currentColor" strokeWidth="0.9" fill="none">
            <circle cx="316" cy="252" r="5" />
            <circle cx="348" cy="252" r="5" />
            <circle cx="316" cy="286" r="5" />
            <circle cx="348" cy="286" r="5" />
          </g>
          <path
            d="M332 232 L332 304"
            className="stroke-rule-strong"
            strokeWidth="0.9"
            strokeDasharray="10 4 2 4"
            fill="none"
          />

          {/* ---------- coolant delivery, drawn over the column it runs up ---------- */}
          <path
            d="M478 546 L560 546 L560 320 L374 320 L366 330"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <g stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 4">
            <path d="M363 333 L345 356" />
            <path d="M366 338 L348 366" />
          </g>

          {/* ---------- tool changer carousel ---------- */}
          <g stroke="currentColor" strokeWidth="1.2" className="fill-paper-raised">
            <circle cx="206" cy="246" r="52" />
            <circle cx="206" cy="246" r="14" />
          </g>
          <g stroke="currentColor" strokeWidth="1" className="fill-paper-sunk">
            <rect x="198" y="186" width="16" height="16" />
            <rect x="240" y="204" width="16" height="16" />
            <rect x="258" y="238" width="16" height="16" />
            <rect x="240" y="272" width="16" height="16" />
            <rect x="198" y="290" width="16" height="16" />
            <rect x="156" y="272" width="16" height="16" />
            <rect x="138" y="238" width="16" height="16" />
            <rect x="156" y="204" width="16" height="16" />
          </g>

          {/* ---------- lubrication reservoir and distribution ---------- */}
          <g stroke="currentColor" strokeWidth="1.2">
            <rect x="476" y="196" width="58" height="54" className="fill-paper-raised" />
            <circle cx="524" cy="240" r="6" className="fill-paper-sunk" strokeWidth="1" />
          </g>
          <path
            d="M484 212 L520 212"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M505 250 L530 268 L530 482 L246 482"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeDasharray="5 4"
            fill="none"
          />

          {/* ---------- safety enclosure, door, interlock ---------- */}
          <g stroke="currentColor" strokeWidth="1.4" fill="none">
            <rect x="70" y="60" width="542" height="524" />
            <path d="M70 92 L612 92" />
          </g>
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <path d={verticalBreak(88, 96, 520)} />
            <path d={verticalBreak(604, 96, 520)} />
          </g>
          <g stroke="currentColor" strokeWidth="1.2" fill="none">
            <rect x="170" y="140" width="260" height="428" />
            <path d="M182 140 L182 568" />
            <rect
              x="192"
              y="164"
              width="216"
              height="256"
              className="fill-blue-wash"
              fillOpacity={0.5}
            />
            <path d="M414 300 L414 350" strokeWidth="3" strokeLinecap="round" />
            <rect x="428" y="172" width="20" height="24" className="fill-paper-sunk" />
            <path d="M422 178 L428 178 M422 190 L428 190" strokeWidth="1" />
          </g>

          {/* ---------- operator pendant ---------- */}
          <g stroke="currentColor" strokeWidth="1.2">
            <rect x="612" y="210" width="18" height="12" className="fill-paper-sunk" />
            <rect x="628" y="150" width="108" height="150" className="fill-paper-raised" />
            <rect x="640" y="162" width="84" height="56" className="fill-blue-wash" />
          </g>
          <g stroke="currentColor" strokeWidth="0.9" className="fill-paper-sunk">
            <rect x="640" y="240" width="18" height="14" />
            <rect x="664" y="240" width="18" height="14" />
            <rect x="688" y="240" width="18" height="14" />
            <rect x="640" y="262" width="18" height="14" />
            <rect x="664" y="262" width="18" height="14" />
            <rect x="688" y="262" width="18" height="14" />
          </g>
          {/* Emergency stop. Amber is the safety colour of the design system. */}
          <circle
            cx="717"
            cy="272"
            r="10"
            stroke="currentColor"
            strokeWidth="1.2"
            className="fill-amber-wash"
          />

          {/* ---------- electrical cabinet ---------- */}
          <g stroke="currentColor" strokeWidth="1.2">
            <rect x="748" y="96" width="156" height="480" className="fill-paper-raised" />
            <rect x="760" y="120" width="132" height="18" className="fill-paper-sunk" />
            <rect x="760" y="152" width="60" height="120" className="fill-paper-sunk" />
            <rect x="832" y="152" width="60" height="120" className="fill-paper-sunk" />
            <rect x="760" y="350" width="132" height="26" className="fill-paper-sunk" />
            <rect x="760" y="392" width="132" height="26" className="fill-paper-sunk" />
            <path d="M904 96 L916 108 L916 588 L904 576 Z" className="fill-paper-sunk" />
          </g>
          <g stroke="currentColor" strokeWidth="0.9" fill="none">
            <path d="M760 440 L892 440 M760 462 L892 462 M760 484 L892 484 M760 506 L892 506" />
          </g>

          {/* ---------- axis triad ---------- */}
          <g
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            markerEnd="url(#explorer-arrow)"
          >
            <path d="M660 118 L660 66" />
            <path d="M660 118 L714 118" />
            <path d="M660 118 L630 144" />
          </g>
          <g className="fill-ink-faint font-mono" fontSize="12">
            <text x="650" y="62">Z</text>
            <text x="720" y="122">X</text>
            <text x="614" y="156">Y</text>
          </g>

          {/* ---------- reminder dimension: illustrative, not to scale ---------- */}
          <g className="stroke-rule-strong" strokeWidth="1" fill="none">
            <path d="M46 156 L96 156" />
            <path d="M46 524 L92 524" />
          </g>
          <path
            d="M52 162 L52 518"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            markerStart="url(#explorer-arrow)"
            markerEnd="url(#explorer-arrow)"
          />
          <text
            className="fill-ink-faint font-mono"
            fontSize="11"
            letterSpacing="1.2"
            transform="rotate(-90 34 340)"
            x="34"
            y="340"
            textAnchor="middle"
          >
            NOT TO SCALE
          </text>

          {/* ---------- title block ---------- */}
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <rect x="640" y="596" width="300" height="38" />
            <path d="M640 615 L940 615" className="stroke-rule-strong" />
          </g>
          <g className="fill-ink-faint font-mono" fontSize="10" letterSpacing="1.2">
            <text x="650" y="609">CNC ACADEMY — MACHINE EXPLORER</text>
            <text x="650" y="628">ILLUSTRATIVE ARRANGEMENT, NOT A DESIGN</text>
          </g>

          {/* ---------- selection highlight ---------- */}
          {highlightBoxes.map(([x, y, w, h], i) => (
            <rect
              key={`highlight-${i}`}
              x={x - 3}
              y={y - 3}
              width={w + 6}
              height={h + 6}
              rx="2"
              className="fill-blue-bright stroke-blue-bright"
              fillOpacity={0.12}
              strokeWidth={2}
            />
          ))}

          {/* ---------- leader lines, dot at the feature end ---------- */}
          {components.map((component) => {
            const target = LEADER_TARGETS[component.id];
            if (!target) return null;
            const bx = (component.hotspot.x / 100) * VB_W;
            const by = (component.hotspot.y / 100) * VB_H;
            const [tx, ty] = target;
            const dx = tx - bx;
            const dy = ty - by;
            const length = Math.hypot(dx, dy) || 1;
            const sx = bx + (dx / length) * 15;
            const sy = by + (dy / length) * 15;
            const path = `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${tx} ${ty}`;
            const dimmed = !enabledSet.has(component.id);
            const chosen = selectedId === component.id;
            return (
              <g
                key={`leader-${component.id}`}
                className={
                  chosen ? "text-blue-bright" : dimmed ? "text-rule-strong" : "text-ink-faint"
                }
              >
                <path
                  d={path}
                  className="stroke-paper-raised"
                  strokeWidth="4"
                  strokeOpacity={0.85}
                  fill="none"
                />
                <path d={path} stroke="currentColor" strokeWidth="1" fill="none" />
                <circle cx={tx} cy={ty} r="3" fill="currentColor" />
              </g>
            );
          })}
        </svg>

        {/* ---------- balloon callouts: real buttons over the drawing ---------- */}
        {components.map((component, index) => {
          const isEnabled = enabledSet.has(component.id);
          const isSelected = selectedId === component.id;
          const rovingIndex = enabled.findIndex((c) => c.id === component.id);
          const tone = isSelected
            ? "border-blue-bright bg-blue-bright text-paper-raised"
            : isEnabled
              ? "border-ink-soft bg-paper-raised text-ink hover:border-blue hover:text-blue"
              : "border-rule bg-paper-sunk text-ink-faint";
          return (
            <button
              key={component.id}
              ref={(element) => {
                buttonRefs.current[component.id] = element;
              }}
              type="button"
              disabled={!isEnabled}
              aria-pressed={isSelected}
              tabIndex={activeId === component.id ? 0 : -1}
              onClick={() => {
                setRovingId(component.id);
                onSelect(component.id);
              }}
              onKeyDown={(event) => {
                if (rovingIndex >= 0) handleHotspotKey(event, rovingIndex);
              }}
              style={{ left: `${component.hotspot.x}%`, top: `${component.hotspot.y}%` }}
              className={[
                "absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
                "rounded-full border font-mono text-[10px] leading-none tabular-nums shadow-panel",
                "transition-colors duration-150 motion-reduce:transition-none",
                "disabled:cursor-default disabled:opacity-60 disabled:shadow-none",
                tone,
              ].join(" ")}
            >
              <span className="sr-only">
                {`${component.name}, ${SYSTEM_LABEL[component.system]} system`}
              </span>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
