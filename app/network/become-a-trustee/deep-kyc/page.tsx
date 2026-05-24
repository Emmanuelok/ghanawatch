import { DeepKycClient } from "./deep-kyc-client";
import { Fingerprint } from "lucide-react";

export const metadata = { title: "Trustee Deep KYC — GhanaWatch" };

export default function DeepKycPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Fingerprint className="h-3 w-3" /> Trustee — deep KYC
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Deep KYC for trustees</h1>
        <p className="mt-3 max-w-2xl text-[15px] text-ink-dim">
          To handle diaspora investment evidence in court, trustees go through a deeper-than-standard
          KYC: criminal record check, 5-year address history, conflict-of-interest disclosure,
          professional indemnity insurance, and a continuous-monitoring consent. This protects
          diaspora users and protects the trustee — if a case escalates to litigation, your file is
          already ready.
        </p>
      </div>
      <DeepKycClient />
    </div>
  );
}
