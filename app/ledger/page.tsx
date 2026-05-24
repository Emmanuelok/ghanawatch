import { LedgerExplorer } from "./ledger-client";
import { ScrollText } from "lucide-react";
import { AUDIT_EVENTS, PROJECTS } from "@/lib/mock-data";

export const metadata = { title: "Ledger Explorer — GhanaWatch" };

export default function LedgerPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <ScrollText className="h-3 w-3" /> Ledger explorer
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">The immutable audit chain</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Every event the platform records — uploads, payments, verifications, alerts, trustee
          reports — is hash-chained from genesis. Browse, filter, and verify the integrity of any
          range across all your projects.
        </p>
      </div>
      <LedgerExplorer events={AUDIT_EVENTS} projects={PROJECTS} />
    </div>
  );
}
