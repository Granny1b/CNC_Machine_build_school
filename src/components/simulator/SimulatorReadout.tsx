import { formatFixed, formatNumber, rpmToRadPerSecond } from "@/lib/format";
import type { MachineState } from "@/lib/gcode";

/**
 * The DRO strip: the three commanded coordinates, and then the modal state a
 * real digital readout would never show you.
 *
 * That second half is the point. A DRO tells you where the tool is; it does not
 * tell you that G91 is still in force from eight lines ago, which is why the
 * next move went somewhere you did not expect. Everything here is commanded by
 * the program being read — nothing is measured from a machine, because there is
 * no machine at the other end of this and never will be.
 */

export interface SimulatorReadoutProps {
  /** The state the active step leaves the model in. */
  state: MachineState;
  /** Which axes the active step actually moved. */
  moving: { x: boolean; y: boolean; z: boolean };
  /** 1-based number of the line this readout describes. */
  lineNumber: number;
}

/** Commanded values are echoed as written, not rounded into something else. */
function commanded(value: number): string {
  return Number.isInteger(value) ? String(value) : formatFixed(value, 2);
}

const PLANE_LABELS: Record<MachineState["plane"], string> = {
  XY: "XY · G17",
  ZX: "ZX · G18",
  YZ: "YZ · G19",
};

const SPINDLE_LABELS: Record<MachineState["spindle"], string> = {
  off: "stopped",
  cw: "clockwise · M03",
  ccw: "counter-clockwise · M04",
};

export function SimulatorReadout({ state, moving, lineNumber }: SimulatorReadoutProps) {
  const axes = [
    { key: "x", label: "X", value: state.position.x, live: moving.x },
    { key: "y", label: "Y", value: state.position.y, live: moving.y },
    { key: "z", label: "Z", value: state.position.z, live: moving.z },
  ];

  const modal: { label: string; value: string; meaning: string }[] = [
    {
      label: "Feed · F",
      value: state.feed > 0 ? `${commanded(state.feed)} mm/min` : "none yet",
      meaning:
        state.feed > 0
          ? "How fast a cutting move runs along the path."
          : "No F word has been read, so a cutting move has no rate to use.",
    },
    {
      label: "Speed · S",
      value: state.spindleSpeed > 0 ? `${commanded(state.spindleSpeed)} rev/min` : "none yet",
      meaning:
        state.spindleSpeed > 0
          ? `How fast the cutter turns — ${formatNumber(rpmToRadPerSecond(state.spindleSpeed), 3)} rad/s in SI units.`
          : "No S word has been read, so no spindle speed is set.",
    },
    {
      label: "Spindle",
      value: SPINDLE_LABELS[state.spindle],
      meaning: "Whether the cutter is turning, and which way round.",
    },
    {
      label: "Tool · T",
      value: state.tool > 0 ? `T${state.tool}` : "none",
      meaning: "Which pocket the program asked for. The model knows nothing else about it.",
    },
    {
      label: "Plane",
      value: PLANE_LABELS[state.plane],
      meaning: "The plane an arc is measured in, and the axis a drill cycle feeds along.",
    },
    {
      label: "Positioning",
      value: state.distance === "absolute" ? "absolute · G90" : "incremental · G91",
      meaning:
        state.distance === "absolute"
          ? "Coordinates are measured from part zero."
          : "Coordinates are measured from wherever the tool already is.",
    },
    {
      label: "Units",
      value: state.units === "mm" ? "mm · G21" : "inch · G20",
      meaning:
        state.units === "mm"
          ? "The program is written in millimetres, which is what this readout shows."
          : "The program is written in inches; this readout converts them to millimetres.",
    },
    {
      label: "Work offset",
      value: state.workOffset === "none" ? "none yet" : state.workOffset,
      meaning: "Which stored zero the coordinates are measured from.",
    },
    {
      label: "Tool length",
      value: state.toolLengthOffset ? "applied · G43" : "none · G49",
      meaning: "Whether the length of the tool has been taken into account in Z.",
    },
    {
      label: "Coolant",
      value: state.coolant ? "on" : "off",
      meaning: "Whether the program has called for coolant.",
    },
  ];

  return (
    <section aria-labelledby="dro-heading" className="rounded-sm border border-rule bg-paper-raised shadow-panel">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule px-5 py-4 sm:px-6">
        <h2 id="dro-heading" className="text-[18px] font-semibold sm:text-[20px]">
          Position and modal state
        </h2>
        <p className="eyebrow">After line {String(lineNumber).padStart(2, "0")}</p>
      </div>

      <div className="overflow-x-auto border-b border-rule px-5 py-4 sm:px-6">
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {axes.map((axis) => (
            <div key={axis.key}>
              <p className="eyebrow flex items-center gap-1.5">
                <span>
                  {axis.label} · mm
                </span>
                {axis.live ? (
                  <>
                    <span aria-hidden="true" className="text-blue-mid">
                      &rarr;
                    </span>
                    <span className="sr-only">moving on this step</span>
                  </>
                ) : null}
              </p>
              <p
                className={`num mt-1 text-[15px] font-medium leading-none xs:text-[17px] sm:text-[20px] ${
                  axis.live ? "text-blue-mid" : "text-ink"
                }`}
              >
                {formatFixed(axis.value, 3)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px bg-rule xs:grid-cols-2 lg:grid-cols-3">
        {modal.map((item) => (
          <div key={item.label} className="bg-paper-raised px-5 py-3 sm:px-6">
            <p className="eyebrow">{item.label}</p>
            <p className="mt-1 font-mono text-[13px] font-medium tabular-nums text-ink">
              {item.value}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-ink-soft">{item.meaning}</p>
          </div>
        ))}
      </div>

      <p className="border-t border-rule px-5 py-3 text-[13px] leading-snug text-ink-soft sm:px-6">
        Every figure here is what the program commands, worked out by a model in your browser. None
        of it is measured, and none of it knows where your tool or your fixture actually is.
      </p>
    </section>
  );
}
