import { CostSimulator } from "./cost-simulator";
import { Calculator } from "lucide-react";

export const metadata = { title: "Cost simulator — GhanaWatch" };

export default function CostSimulatorPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Calculator className="h-3 w-3" /> Tool
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Build cost simulator</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Get a quick GHS estimate for your residential build before committing capital. Modelled on
          GhanaWatch's regional benchmark data for materials and labour. Not a substitute for an
          architect's full BOQ — but a strong sanity check.
        </p>
      </div>
      <CostSimulator />
    </div>
  );
}
