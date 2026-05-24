import { IdentityClient } from "./identity-client";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Identity Verification — GhanaWatch" };

export default function IdentityPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <ShieldCheck className="h-3 w-3" /> KYC · AML · Liveness
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Verify your identity</h1>
        <p className="mt-3 max-w-2xl text-[15px] text-ink-dim">
          Before GhanaWatch holds funds in escrow or signs evidence packs on your behalf, we need to
          know you're you. This takes about 4 minutes and unlocks every consequential action on the
          platform. Your data is encrypted, never sold, and used only to satisfy Ghanaian and
          source-country regulators.
        </p>
      </div>
      <IdentityClient />
    </div>
  );
}
