import { GovernanceClient } from "./client";
import { Vote } from "lucide-react";

export const metadata = { title: "Hometown governance — GhanaWatch" };

export default function GovernancePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Vote className="h-3 w-3" /> Hometown association governance
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Treasury, votes, AGM — for hometown associations.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          For Ghanaian diaspora hometown associations (Kasoa Sons GTA, Adum Traders Hamburg, etc.).
          Pool funds for civic projects, run secret-ballot votes, hold AGMs, audit-trail every cedi.
          KYC-verified members only; every transaction hashed to the audit ledger.
        </p>
      </div>
      <GovernanceClient />
    </div>
  );
}
