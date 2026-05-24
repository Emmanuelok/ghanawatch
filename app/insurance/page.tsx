import { InsuranceCalculator } from "./calculator";
import { ShieldPlus } from "lucide-react";

export const metadata = { title: "Fraud Insurance — GhanaWatch" };

export default function InsurancePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <ShieldPlus className="h-3 w-3" /> Underwritten by GhanaWatch Reserve
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Diaspora fraud insurance</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Even with every verification layer running, fraud can still slip through (it's the rare
          tail risk). Our optional cover pays out up to a cap when a verified-on-platform project
          turns out fraudulent. Premiums are risk-priced from the project's own signals — high-trust
          projects pay less.
        </p>
      </div>
      <InsuranceCalculator />
    </div>
  );
}
