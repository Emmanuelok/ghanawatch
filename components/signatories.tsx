import Link from "next/link";
import { Check, Clock, X, ShieldCheck, UserCheck } from "lucide-react";
import type { Signatory } from "@/lib/types";

const ROLE_LABEL = {
  "diaspora-owner": "Diaspora owner",
  "next-of-kin": "Next of kin",
  "co-investor": "Co-investor",
  trustee: "Trustee",
  lawyer: "Lawyer",
  witness: "Witness",
} as const;

export function SignatoriesPanel({ signatories }: { signatories: Signatory[] }) {
  const signed = signatories.filter((s) => s.status === "signed").length;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-accent-gold" />
          <div className="text-[14px] font-semibold">Verified signatories</div>
        </div>
        <span className="chip">{signed}/{signatories.length} signed</span>
      </div>
      <p className="mt-1 text-[11px] text-ink-dim">Real humans, ID-verified, accountable on this project</p>

      <div className="mt-4 space-y-2">
        {signatories.map((s) => {
          const color = s.status === "signed" ? "#10b981" : s.status === "pending" ? "#f59e0b" : "#ef4444";
          const Icon = s.status === "signed" ? Check : s.status === "pending" ? Clock : X;
          return (
            <div key={s.id} className="flex items-center gap-3 rounded-md border border-line bg-bg-elev/40 p-3">
              <div
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
                style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold">{s.name}</span>
                  {s.verifiedIdentity && (
                    <span className="chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.25)" }}>
                      <ShieldCheck className="h-3 w-3" /> KYC
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[11px] text-ink-muted">
                  {ROLE_LABEL[s.role]} · {s.contact}
                  {s.signedAt && <> · signed {s.signedAt.slice(0, 10)}</>}
                </div>
              </div>
              <span className="text-[11px] capitalize" style={{ color }}>
                {s.status}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-line pt-3 text-[11px] text-ink-muted">
        Need more co-signers? <Link href="/identity" className="text-accent-gold hover:underline">Add a verified signatory →</Link>
      </div>
    </div>
  );
}
