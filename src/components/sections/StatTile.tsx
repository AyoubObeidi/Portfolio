import { CountUp } from "@/components/animation/CountUp";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: number;
  // Value for the previous period of the same length; null hides the change.
  previous: number | null;
  periodName: string;
}

function change(value: number, previous: number) {
  return ((value - previous) / previous) * 100;
}

export function StatTile({ label, value, previous, periodName }: StatTileProps) {
  const pct = previous ? change(value, previous) : null;
  const up = pct !== null && pct >= 0;

  return (
    <Panel>
      <p className="text-meta text-fg-muted">{label}</p>
      <p className="mt-1 font-mono text-title font-semibold tabular-nums">
        <CountUp value={value} />
      </p>
      {pct === null ? (
        <p className="mt-1 text-2xs text-fg-subtle">
          No earlier data to compare
        </p>
      ) : (
        <p
          className={cn(
            "mt-1 font-mono text-2xs tabular-nums",
            up ? "text-success-fg" : "text-danger-fg",
          )}
        >
          <span aria-hidden="true">{up ? "↑" : "↓"} </span>
          <span className="sr-only">{up ? "Up" : "Down"} </span>
          {Math.abs(pct).toFixed(1)}%
          <span className="sr-only"> from the previous {periodName}</span>
        </p>
      )}
    </Panel>
  );
}
