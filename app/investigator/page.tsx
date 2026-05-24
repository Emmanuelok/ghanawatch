import { Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";
import { Investigator } from "./investigator-client";

export const metadata = { title: "AI Investigator — GhanaWatch" };

export default function InvestigatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="max-w-2xl">
        <div className="chip mb-4"><Sparkles className="h-3 w-3 text-accent-gold" /> Forensic AI</div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">AI Investigator</h1>
        <p className="mt-3 text-[15px] text-ink-dim">
          Describe what's going on. The Investigator drafts a red-flag map, a verification plan, and
          the immediate actions you should take — grounded in Ghanaian agencies, regional norms, and
          common fraud patterns.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <Investigator />

        <div className="space-y-4">
          <div className="card p-5">
            <div className="mb-3 text-[14px] font-semibold">Tips</div>
            <ul className="space-y-2.5 text-[13px] text-ink-dim">
              <li>· Be specific — name regions, agencies, amounts in GHS.</li>
              <li>· Mention who's managing it on the ground (relative, contractor, lawyer).</li>
              <li>· Paste any document text or describe what's odd about it.</li>
              <li>· The Investigator will recommend trustees and platform features by name.</li>
            </ul>
          </div>
          <div className="card p-5">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent-gold" />
              <div className="text-[13px] font-semibold">Demo mode</div>
            </div>
            <p className="text-[12px] text-ink-dim">
              Without an Anthropic API key, the Investigator returns a deterministic skeleton reply
              based on the scenario type. Add{" "}
              <code className="rounded bg-bg-elev px-1.5 py-0.5">ANTHROPIC_API_KEY</code> on Vercel for
              live forensic reasoning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
