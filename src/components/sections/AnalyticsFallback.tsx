import { Panel } from "@/components/ui/Panel";

export function AnalyticsFallback() {
  return (
    <Panel>
      <p className="text-sm text-fg-muted" role="status">
        Loading traffic data…
      </p>
    </Panel>
  );
}
