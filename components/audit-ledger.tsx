import {
  FileText,
  ShieldCheck,
  Banknote,
  AlertTriangle,
  Camera,
  Users,
  Settings,
  Flag,
  Fingerprint,
} from "lucide-react";
import type { AuditEvent } from "@/lib/types";

const iconMap = {
  doc: FileText,
  site: Camera,
  payment: Banknote,
  milestone: Flag,
  alert: AlertTriangle,
  verify: ShieldCheck,
  trustee: Users,
  system: Settings,
} as const;

export function AuditLedger({ events }: { events: AuditEvent[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div>
          <div className="text-[14px] font-semibold">Immutable audit ledger</div>
          <div className="text-[11px] text-ink-muted">Every event is hash-chained — any retroactive edit breaks the chain.</div>
        </div>
        <span className="chip">
          <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-accent-green" />
          chain intact
        </span>
      </div>

      <div className="divide-y divide-line">
        {events.map((e, i) => {
          const Icon = iconMap[e.category] ?? Settings;
          return (
            <div key={e.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line bg-bg-elev">
                  <Icon className="h-3.5 w-3.5 text-accent-gold" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] text-ink">{e.action}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
                    <span>{e.actor}</span>
                    <span>·</span>
                    <span>{new Date(e.ts).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
                    <span className="chip uppercase tracking-wider">{e.category}</span>
                  </div>
                  <div className="mt-2 grid gap-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-3 w-3 text-ink-muted" />
                      <span className="text-ink-muted">prev</span>
                      <span className="hash-mono">{e.prevHash}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-3 w-3 text-accent-gold" />
                      <span className="text-ink-muted">hash</span>
                      <span className="hash-mono" style={{ color: "#f5b800" }}>{e.hash}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
