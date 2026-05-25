import { RedTeamClient } from "./client";
import { Bug } from "lucide-react";

export const metadata = { title: "AI red-team — GhanaWatch" };

export default function RedTeamPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Bug className="h-3 w-3" /> Adversarial pen-test
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Red-team your own project.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          The AI plays the fraudster. It identifies the soft spots in your setup, simulates the
          attack, and tells you exactly which control would have caught it. Run this before you
          escalate funding or change personnel.
        </p>
      </div>
      <RedTeamClient />
    </div>
  );
}
