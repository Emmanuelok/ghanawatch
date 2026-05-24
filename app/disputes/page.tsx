import Link from "next/link";
import {
  Gavel,
  Clock,
  Check,
  XCircle,
  Scale,
  ArrowUpRight,
  Banknote,
  Users,
  AlertTriangle,
  ScrollText,
} from "lucide-react";
import { DISPUTES, PROJECTS } from "@/lib/mock-data";

export const metadata = { title: "Disputes & ADR — GhanaWatch" };

const STAGES = [
  { id: "raised", label: "Raised" },
  { id: "negotiation", label: "Negotiation" },
  { id: "mediation", label: "Mediation (ADR)" },
  { id: "arbitration", label: "Arbitration" },
  { id: "court", label: "Court" },
  { id: "resolved", label: "Resolved" },
];

const stageColor: Record<string, string> = {
  raised: "#f59e0b",
  negotiation: "#3b82f6",
  mediation: "#8b5cf6",
  arbitration: "#ef4444",
  court: "#ef4444",
  resolved: "#10b981",
  withdrawn: "#9aa0b0",
};

export default function DisputesPage() {
  const totalExposure = DISPUTES.reduce((s, d) => s + d.amountGHS, 0);
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Gavel className="h-3 w-3" /> Dispute resolution
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">ADR workflow — disputes & resolutions</h1>
        <p className="mt-1 max-w-3xl text-[14px] text-ink-dim">
          Structured dispute resolution under the Alternative Dispute Resolution Act 2010 (Act 798).
          Most disputes settle in negotiation or mediation; arbitration is the next escalation;
          court is the last resort. Every step is recorded on the audit ledger, and the
          GhanaWatch-ADR Centre provides neutral mediators / arbitrators.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Kpi label="Open disputes" value={`${DISPUTES.filter((d) => d.stage !== "resolved" && d.stage !== "withdrawn").length}`} />
        <Kpi label="Resolved (YTD)" value="184" sub="68% in-favour-claimant" good />
        <Kpi label="Median time to resolve" value="22 days" />
        <Kpi label="Total exposure (you)" value={`GHS ${(totalExposure / 1000).toFixed(0)}K`} />
      </div>

      <div className="mt-8 grid gap-5">
        {DISPUTES.map((d) => {
          const proj = PROJECTS.find((p) => p.id === d.projectId);
          const stageIx = STAGES.findIndex((s) => s.id === d.stage);
          return (
            <div key={d.id} className="card overflow-hidden">
              <div className="grid items-start gap-5 p-6 lg:grid-cols-[2fr_1fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="chip uppercase tracking-wider"
                      style={{ color: stageColor[d.stage], borderColor: `${stageColor[d.stage]}30`, background: `${stageColor[d.stage]}10` }}
                    >
                      <Scale className="h-3 w-3" /> {d.stage.replace("-", " ")}
                    </span>
                    <span className="chip capitalize">{d.type.replace(/-/g, " ")}</span>
                    {proj && <Link href={`/projects/${proj.id}`} className="chip">{proj.name}</Link>}
                    <span className="font-mono text-[11px] text-ink-muted">{d.id}</span>
                  </div>
                  <div className="mt-3 text-[18px] font-semibold tracking-tight">{d.raisedBy} v {d.raisedAgainst}</div>
                  <p className="mt-2 text-[13px] text-ink-dim">{d.summary}</p>

                  <div className="mt-4 grid gap-2 text-[12px]">
                    <Row icon={Banknote} label="Amount" value={`GHS ${d.amountGHS.toLocaleString()}`} />
                    <Row icon={Clock} label="Opened" value={d.openedAt.slice(0, 10)} />
                    {d.arbitratorAssigned && <Row icon={Users} label="Mediator / arbitrator" value={d.arbitratorAssigned} />}
                  </div>

                  {/* Stage progress */}
                  <div className="mt-5">
                    <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Workflow</div>
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {STAGES.map((s, i) => (
                        <div key={s.id} className="flex shrink-0 items-center gap-1">
                          <span
                            className={`grid h-5 w-5 place-items-center rounded-full text-[9px] font-semibold ${
                              i <= stageIx ? "bg-accent-gold text-bg" : "bg-bg-subtle text-ink-muted"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span className={`text-[10.5px] ${i <= stageIx ? "text-ink" : "text-ink-muted"}`}>{s.label}</span>
                          {i < STAGES.length - 1 && <span className="h-px w-5 bg-line" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-bg-elev/40 p-4">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Hearings ({d.hearings.length})</div>
                  <ol className="mt-3 space-y-3 text-[12px]">
                    {d.hearings.map((h, i) => (
                      <li key={i}>
                        <div className="flex items-center gap-2">
                          <span className="chip text-[10px] capitalize">{h.mode}</span>
                          <span className="text-ink-muted">{h.ts.slice(0, 10)}</span>
                        </div>
                        <div className="mt-1 text-ink-dim">{h.notes}</div>
                      </li>
                    ))}
                  </ol>
                  {d.resolution && (
                    <div className="mt-4 border-t border-line pt-3">
                      <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Resolution</div>
                      <div className="mt-1 flex items-center gap-2 text-[13px]">
                        <Check className="h-3.5 w-3.5 text-accent-green" />
                        <span className="capitalize text-accent-green">{d.resolution.outcome.replace(/-/g, " ")}</span>
                      </div>
                      {d.resolution.awardGHS && <div className="text-[12px] text-ink">Award: GHS {d.resolution.awardGHS.toLocaleString()}</div>}
                      <p className="mt-1 text-[12px] text-ink-dim">{d.resolution.note}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-line bg-bg-elev/40 px-6 py-3">
                <button className="btn btn-ghost text-[12px] py-1.5"><ScrollText className="h-3.5 w-3.5" /> View evidence bundle</button>
                {d.stage !== "resolved" && d.stage !== "withdrawn" && (
                  <>
                    <button className="btn btn-ghost text-[12px] py-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Escalate to arbitration</button>
                    <button className="btn btn-primary text-[12px] py-1.5"><Check className="h-3.5 w-3.5" /> Accept settlement</button>
                  </>
                )}
                {proj && (
                  <Link href={`/projects/${proj.id}`} className="ml-auto text-[12px] text-ink-dim hover:text-ink">
                    Open project <ArrowUpRight className="inline h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 card p-6">
        <div className="text-[14px] font-semibold">How GhanaWatch ADR works</div>
        <ol className="mt-3 grid gap-2 text-[13px] text-ink-dim md:grid-cols-2">
          <li>1. Either party raises a dispute from inside the project. Funds in escrow are auto-paused.</li>
          <li>2. We try direct negotiation first — both parties + a GhanaWatch case officer.</li>
          <li>3. If unresolved in 7 days, we move to mediation with a neutral mediator from the GhanaWatch-ADR Centre.</li>
          <li>4. If mediation fails, arbitration — binding under Act 798, enforceable in Ghanaian courts.</li>
          <li>5. Court is the last resort. We provide the sealed evidence pack with hash chain intact.</li>
        </ol>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" />
      <div>
        <span className="text-ink-muted">{label}: </span>
        <span className="text-ink">{value}</span>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, good }: any) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight" style={good ? { color: "#10b981" } : {}}>{value}</div>
      {sub && <div className="text-[11px] text-ink-muted">{sub}</div>}
    </div>
  );
}
