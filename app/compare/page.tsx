import { CompareClient } from "./compare-client";
import { Columns3 } from "lucide-react";

export const metadata = { title: "Compare Projects — GhanaWatch" };

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Columns3 className="h-3 w-3" /> Compare
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Side-by-side comparison</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Pick 2 to 4 projects. We compare risk scores, trust drift, document forensic ratios,
          milestone velocity, trustee coverage, signatory counts — across whichever projects you
          select.
        </p>
      </div>
      <CompareClient />
    </div>
  );
}
