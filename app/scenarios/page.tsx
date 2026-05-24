import { ScenarioPlanner } from "./client";
import { Sliders } from "lucide-react";

export const metadata = { title: "Scenario planner — GhanaWatch" };

export default function ScenarioPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Sliders className="h-3 w-3" /> What-if planner
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Scenario planner</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Drag levers. See how each decision moves the project's risk score, trust score, and
          expected loss. Useful before you switch manager, dispatch a trustee, or change the
          escrow cadence.
        </p>
      </div>
      <ScenarioPlanner />
    </div>
  );
}
