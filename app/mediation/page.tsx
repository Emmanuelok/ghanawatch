import { MediationRoom } from "./mediation-client";
import { Video } from "lucide-react";

export const metadata = { title: "Mediation room — GhanaWatch" };

export default function MediationPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Video className="h-3 w-3" /> Live mediation
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Mediation room</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          End-to-end encrypted, recorded, transcribed, signed. The room is the formal venue for
          ADR proceedings under Act 798. All participants are KYC-verified; every shared exhibit
          is hash-anchored to the dispute's ledger entry.
        </p>
      </div>
      <MediationRoom />
    </div>
  );
}
