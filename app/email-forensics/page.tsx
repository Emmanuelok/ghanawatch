import { EmailForensicsClient } from "./client";
import { Mail } from "lucide-react";

export const metadata = { title: "Email forensics — GhanaWatch" };

export default function EmailForensicsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Mail className="h-3 w-3" /> Email forensics
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Paste the email. We'll tell you if it's safe.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Forwarded a suspicious email from "your brother's lawyer" or "Lands Commission officer"?
          Drop it here. We check spoof signals (SPF / DKIM / DMARC indicators in the body), urgency
          patterns, money-request structure, and Ghana-specific fraud archetypes.
        </p>
      </div>
      <EmailForensicsClient />
    </div>
  );
}
