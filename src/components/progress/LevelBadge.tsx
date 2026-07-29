import { Badge } from "@/components/ui/Badge";
import type { Level } from "@/content/types";

/** `LEVEL 04` set as a mono callout, matching the DRO readout of AxisScale. */
export function LevelBadge({
  level,
  complete = false,
  className = "",
}: {
  level: number;
  complete?: boolean;
  className?: string;
}) {
  return (
    <Badge tone={complete ? "moss" : "blue"} className={className}>
      Level {String(level).padStart(2, "0")}
    </Badge>
  );
}

/** "Published" / "Planned", so the roadmap is honest about what exists. */
export function StatusBadge({ status }: { status: Level["status"] }) {
  return (
    <Badge tone={status === "published" ? "moss" : "outline"}>
      {status === "published" ? "Lessons ready" : "On the roadmap"}
    </Badge>
  );
}
