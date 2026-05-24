import Link from "next/link";
import { AlertTriangle, ShieldAlert, ArrowUpRight, Banknote } from "lucide-react";
import { FORENSIC_CASES, PROJECTS } from "@/lib/mock-data";

export const metadata = { title: "Forensic Cases — GhanaWatch" };

const sevColor = { critical: "#ef4444", high: "#f59e0b", med: "#3b82f6", low: "#9aa0b0" } as const;
const statusLabel = {
  open: "Open",
  investigating: "Investigating",
  "evidence-gathering": "Evidence gathering",
  escalated: "Escalated",
  resolved: "Resolved",
  closed: "Closed",
} as const;

export default function CasesPage() {
  const totalAtRisk = FORENSIC_CASES.reduce((s, c) => s + c.potentialLossGHS, 0);
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            <ShieldAlert className="h-3 w-3" /> Forensic cases
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Open investigations</h1>
          <p className="mt-1 text-[14px] text-ink-dim">
            Where signals crossed a threshold and we opened a structured investigation. Each case
            has a hypothesis, an evidence ledger, and a recommended action plan.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Kpi label="Open cases" value={`${FORENSIC_CASES.length}`} />
        <Kpi label="Total exposure" value={`GHS ${(totalAtRisk / 1000).toFixed(0)}K`} />
        <Kpi label="Median time-to-resolve" value="11 days" />
      </div>

      <div className="mt-8 space-y-4">
        {FORENSIC_CASES.map((c) => {
          const proj = PROJECTS.find((p) => p.id === c.projectId);
          const color = sevColor[c.severity];
          return (
            <Link key={c.id} href={`/cases/${c.id}`} className="card card-hover block overflow-hidden">
              <div className="grid items-start gap-5 p-6 md:grid-cols-[2fr_1fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="chip uppercase tracking-wider"
                      style={{ color, borderColor: `${color}30`, background: `${color}10` }}
                    >
                      <AlertTriangle className="h-3 w-3" /> {c.severity}
                    </span>
                    <span className="chip">{statusLabel[c.status]}</span>
                    {proj && <span className="chip">{proj.name}</span>}
                  </div>
                  <div className="mt-3 text-[17px] font-semibold tracking-tight">{c.title}</div>
                  <p className="mt-2 max-w-3xl text-[13px] text-ink-dim">{c.summary}</p>
                  <div className="mt-4 flex items-center gap-4 text-[12px] text-ink-muted">
                    <span>Lead: <span className="text-ink">{c.lead}</span></span>
                    <span>·</span>
                    <span>Opened {relDate(c.openedAt)}</span>
                    <span>·</span>
                    <span>{c.evidenceItemIds.length} evidence items</span>
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-bg-elev/40 p-4">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                    <Banknote className="h-3 w-3" /> Potential exposure
                  </div>
                  <div className="mt-1 text-2xl font-semibold" style={{ color }}>
                    GHS {c.potentialLossGHS.toLocaleString()}
                  </div>
                  <div className="mt-4 text-[12px] text-ink-dim">{c.timeline.length} timeline entries</div>
                  <div className="mt-3 flex items-center justify-between text-[12px] text-ink-dim">
                    <span>Open case</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function relDate(iso: string) {
  const d = Math.floor((new Date("2026-05-24T09:00:00Z").getTime() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  return `${d} days ago`;
}
