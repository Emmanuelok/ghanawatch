"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { HUMAN_REVIEWS, PROJECTS, FORENSIC_CASES } from "@/lib/mock-data";

const statusColor = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
  escalated: "#8b5cf6",
  "more-evidence": "#3b82f6",
} as const;

export function ReviewClient() {
  const [filter, setFilter] = useState<"all" | "pending" | "decided">("all");
  const [active, setActive] = useState<string | null>(HUMAN_REVIEWS[0]?.id ?? null);

  const filtered = useMemo(
    () =>
      HUMAN_REVIEWS.filter((r) =>
        filter === "all" ? true : filter === "pending" ? r.status === "pending" : r.status !== "pending",
      ),
    [filter],
  );

  const item = HUMAN_REVIEWS.find((r) => r.id === active) ?? null;
  const project = item ? PROJECTS.find((p) => p.id === item.projectId) : null;
  const c = item ? FORENSIC_CASES.find((c) => c.id === item.caseId) : null;

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      <Kpi label="Pending review" value={`${HUMAN_REVIEWS.filter((r) => r.status === "pending").length}`} />
      <Kpi label="Median time-to-decide" value="3h 14m" good />
      <Kpi label="Analyst override rate" value="12.4%" sub="of AI verdicts" />

      <div className="card overflow-hidden md:col-span-3">
        <div className="flex items-center gap-1 border-b border-line p-2">
          {(["all", "pending", "decided"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-[12px] capitalize ${
                filter === f ? "bg-bg-subtle text-ink" : "text-ink-dim hover:text-ink"
              }`}
            >
              {f}
              {f === "pending" && (
                <span className="ml-1.5 text-[10px] text-accent-gold">
                  {HUMAN_REVIEWS.filter((r) => r.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid divide-line lg:grid-cols-[420px_1fr] lg:divide-x">
          <div className="divide-y divide-line max-h-[640px] overflow-y-auto scroll-shadow">
            {filtered.map((r) => {
              const proj = PROJECTS.find((p) => p.id === r.projectId);
              const color = statusColor[r.status];
              return (
                <button
                  key={r.id}
                  onClick={() => setActive(r.id)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                    active === r.id ? "bg-bg-elev/60" : "hover:bg-bg-elev/40"
                  }`}
                >
                  <div
                    className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md"
                    style={{ background: `${color}15`, border: `1px solid ${color}25`, color }}
                  >
                    {r.status === "pending" ? <Clock className="h-3.5 w-3.5" /> : r.status === "approved" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="chip uppercase tracking-wider"
                        style={{ color: r.priority === "critical" ? "#ef4444" : r.priority === "high" ? "#f59e0b" : "#9aa0b0" }}
                      >
                        {r.priority}
                      </span>
                      <span className="text-[11px] capitalize text-ink-muted">{r.status.replace("-", " ")}</span>
                    </div>
                    <div className="mt-1 text-[13px] font-semibold">{proj?.name}</div>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-ink-dim">{r.aiVerdict}</p>
                    <div className="mt-1.5 text-[11px] text-ink-muted">Analyst: {r.reviewer.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-5">
            {item && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="chip uppercase tracking-wider"
                        style={{ color: statusColor[item.status], borderColor: `${statusColor[item.status]}30`, background: `${statusColor[item.status]}10` }}
                      >
                        {item.status.replace("-", " ")}
                      </span>
                      <span className="chip">SLA {item.slaHours}h</span>
                    </div>
                    <h2 className="mt-3 text-[18px] font-semibold tracking-tight">{c?.title ?? "Case"}</h2>
                    {project && (
                      <Link href={`/projects/${project.id}`} className="text-[12px] text-ink-dim hover:text-ink">
                        {project.name} →
                      </Link>
                    )}
                  </div>
                  <Link
                    href={`/cases/${item.caseId}`}
                    className="btn btn-ghost text-[12px] py-1.5"
                  >
                    Open case <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="mt-5 rounded-xl border border-line bg-bg-elev/40 p-4">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                    <Sparkles className="h-3 w-3 text-accent-gold" /> AI verdict (confidence {item.aiConfidence}%)
                  </div>
                  <p className="mt-2 text-[13px] text-ink-dim">{item.aiVerdict}</p>
                </div>

                <div className="mt-4 rounded-xl border border-line bg-bg-elev/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="grid h-7 w-7 place-items-center rounded-md bg-accent-gold/15 text-[11px] font-semibold text-accent-gold">
                        {item.reviewer.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold">{item.reviewer.name}</div>
                        <div className="text-[11px] text-ink-muted">{item.reviewer.role} · {item.reviewer.license}</div>
                      </div>
                    </div>
                    {item.status !== "pending" && (
                      <span className="text-[11px] text-ink-muted">
                        Decided {item.decisionAt?.slice(0, 10)}
                      </span>
                    )}
                  </div>
                  {item.analystVerdict && (
                    <div className="mt-3 border-t border-line pt-3">
                      <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Analyst verdict</div>
                      <p className="mt-1 text-[13px] text-ink">{item.analystVerdict}</p>
                    </div>
                  )}
                  {item.analystNote && (
                    <div className="mt-3 border-t border-line pt-3">
                      <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Note</div>
                      <p className="mt-1 text-[13px] text-ink-dim italic">"{item.analystNote}"</p>
                    </div>
                  )}
                  <div className="mt-3 border-t border-line pt-3 text-[11px] text-ink-muted">
                    Evidence reviewed: {item.evidenceReviewed} items
                  </div>
                </div>

                {item.status === "pending" && (
                  <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
                    <button className="btn btn-primary"><CheckCircle2 className="h-4 w-4" /> Approve</button>
                    <button className="btn btn-ghost"><XCircle className="h-4 w-4" /> Reject AI</button>
                    <button className="btn btn-ghost"><ChevronDown className="h-4 w-4" /> Request evidence</button>
                    <button className="btn btn-ghost"><AlertTriangle className="h-4 w-4" /> Escalate</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, good }: { label: string; value: string; sub?: string; good?: boolean }) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight" style={good ? { color: "#10b981" } : {}}>{value}</div>
      {sub && <div className="text-[11px] text-ink-muted">{sub}</div>}
    </div>
  );
}
