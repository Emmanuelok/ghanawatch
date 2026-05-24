import { WizardClient } from "./wizard-client";
import { Plus } from "lucide-react";

export const metadata = { title: "New Project — GhanaWatch" };

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div>
        <div className="chip mb-4"><Plus className="h-3 w-3 text-accent-gold" /> New verified venture</div>
        <h1 className="text-3xl font-semibold tracking-tight">Bring a project under the verification umbrella</h1>
        <p className="mt-3 text-[15px] text-ink-dim">
          A sector-tailored intake. We'll pre-fill milestones, recommended trustees, document
          templates, and the right benchmarks for the region you select.
        </p>
      </div>
      <WizardClient />
    </div>
  );
}
