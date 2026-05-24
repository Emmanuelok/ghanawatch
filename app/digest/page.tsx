import { DigestBuilder } from "./digest-client";
import { Mail } from "lucide-react";

export const metadata = { title: "Digest Builder — GhanaWatch" };

export default function DigestPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Mail className="h-3 w-3" /> Digest builder
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Custom digests, your way.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Tell us exactly when to email / SMS / WhatsApp / Slack you — and what to include. Build
          per-project rules: "only ping me if document forensics drops below 70%", "send the weekly
          ledger digest every Sunday 9am Toronto time", "Slack me when a critical alert opens".
        </p>
      </div>
      <DigestBuilder />
    </div>
  );
}
