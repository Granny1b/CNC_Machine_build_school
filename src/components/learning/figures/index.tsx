import type { ComponentType } from "react";
import type { FigureId } from "@/content/types";
import { CadToPartFigure } from "./CadToPartFigure";
import { AxisTriadFigure } from "./AxisTriadFigure";
import { BallScrewFigure } from "./BallScrewFigure";
import { AccuracyTargetsFigure } from "./AccuracyTargetsFigure";
import { ArchitecturesFigure } from "./ArchitecturesFigure";
import { MachineAnatomyFigure } from "./MachineAnatomyFigure";

/**
 * The figure registry.
 *
 * Typed as `Record<FigureId, ComponentType>`, so adding a `FigureId` to
 * `content/types.ts` without drawing it is a compile error rather than a blank
 * space in a lesson. Every figure is prop-free: a lesson block names a figure,
 * and the figure knows how to draw itself.
 */
export const figures: Record<FigureId, ComponentType> = {
  "cad-to-part": CadToPartFigure,
  "axis-triad": AxisTriadFigure,
  ballscrew: BallScrewFigure,
  "accuracy-targets": AccuracyTargetsFigure,
  architectures: ArchitecturesFigure,
  "machine-anatomy": MachineAnatomyFigure,
};

export function getFigure(id: FigureId): ComponentType {
  return figures[id];
}
