"use client";
import { useState, useMemo } from "react";
import {
  Check,
  X,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Plus,
} from "lucide-react";
import { PROJECTS, DOCUMENTS, SITE_PHOTOS, SIGNATORIES, FORENSIC_CASES, getMilestonesByProject } from "@/lib/mock-data";
import { Sparkline } from "@/components/sparkline";
import { SectorBadge } from "@/components/sector-icon";

const PALETTE = ["#f5b800", "#10b981", "#3b82f6", "#8b5cf6"];

export function CompareClient() {
  const [picked, setPicked] = useState<string[]>([PROJECTS[0].id, PROJECTS[1].id, PROJECTS[2].id]);

  function toggle(id: string) {
    setPicked((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (p.length >= 4) return p;
      return [...p, id];
    });
  }

  const picks = useMemo(() => picked.map((id) => PROJECTS.find((p) => p.id === id)!).filter(Boolean), [picked]);

  return (
    <div className="mt-8">
      {/* Selector */}
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[14px] font-semibold">Choose projects to compare ({picked.length}/4)</div>
          <span className="chip">{picks.length === 0 ? "Pick at least 2" : `${picks.length} selected`}</span>
        </div>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((p) => {
            const isPicked = picked.includes(p.id);
            const idx = picked.indexOf(p.id);
            const color = isPicked ? PALETTE[idx] : "#1a1d27";
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`flex items-start gap-2 rounded-lg border p-3 text-left transition-colors ${
                  isPicked ? "border-accent-gold/60 bg-accent-gold/5" : "border-line bg-bg-elev/40 hover:border-line/70"
                }`}
              >
                <span className="mt-0.5 h-3 w-3 shrink-0 rounded-full border-2" style={{ borderColor: color, background: isPicked ? color : "transparent" }} />
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold">{p.name}</div>
                  <div className="text-[11px] text-ink-dim">{p.location} · risk {p.riskScore}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {picks.length >= 2 && (
        <>
          {/* Trust history comparison */}
          <div className="mt-6 card p-5">
            <div className="mb-3 text-[14px] font-semibold">Trust history (last 60 days)</div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {picks.map((p, i) => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between text-[12px]">
                    <span className="truncate text-ink">{p.name}</span>
                    <span className="font-semibold" style={{ color: PALETTE[i] }}>{p.trustScore}</span>
                  </div>
                  <div className="mt-2"><Sparkline data={p.trustHistory.slice(-60)} color={PALETTE[i]} width={260} height={48} /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison table */}
          <div className="mt-6 card overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="text-left text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                <tr className="border-b border-line">
                  <th className="px-5 py-3"> </th>
                  {picks.map((p, i) => (
                    <th key={p.id} className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: PALETTE[i] }} />
                        <span className="truncate text-ink font-semibold">{p.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METRICS(picks).map((m) => (
                  <tr key={m.label} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 text-ink-muted">{m.label}</td>
                    {m.values.map((v, i) => (
                      <td key={i} className="px-3 py-3 text-ink">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Verdict */}
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="card p-5">
              <div className="mb-1 flex items-center gap-2 text-[14px] font-semibold"><TrendingUp className="h-4 w-4 text-accent-green" /> Healthiest in this set</div>
              <p className="text-[12px] text-ink-dim">{healthiest(picks)}</p>
            </div>
            <div className="card p-5">
              <div className="mb-1 flex items-center gap-2 text-[14px] font-semibold"><AlertTriangle className="h-4 w-4 text-risk-high" /> Needs most attention</div>
              <p className="text-[12px] text-ink-dim">{worst(picks)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function METRICS(picks: typeof PROJECTS) {
  return [
    { label: "Sector", values: picks.map((p) => p.sector) },
    { label: "Region", values: picks.map((p) => p.region) },
    { label: "Owner location", values: picks.map((p) => p.ownerLocation) },
    { label: "Manager / relation", values: picks.map((p) => `${p.managedBy} (${p.managedByRelation})`) },
    { label: "Budget", values: picks.map((p) => `GHS ${p.budgetGHS.toLocaleString()}`) },
    { label: "Spent", values: picks.map((p) => `GHS ${p.spentGHS.toLocaleString()} (${Math.round((p.spentGHS / p.budgetGHS) * 100)}%)`) },
    { label: "Progress", values: picks.map((p) => `${p.progress}%`) },
    { label: "Trust score", values: picks.map((p) => `${p.trustScore}`) },
    { label: "Risk score", values: picks.map((p) => `${p.riskScore}`) },
    { label: "Open alerts", values: picks.map((p) => `${p.alerts}`) },
    { label: "Milestones verified", values: picks.map((p) => `${p.verifiedMilestones}/${p.totalMilestones}`) },
    { label: "Documents on file", values: picks.map((p) => `${DOCUMENTS.filter((d) => d.projectId === p.id).length}`) },
    { label: "Site evidence", values: picks.map((p) => `${SITE_PHOTOS.filter((d) => d.projectId === p.id).length}`) },
    { label: "Signatories signed", values: picks.map((p) => `${(SIGNATORIES[p.id] ?? []).filter((s) => s.status === "signed").length}/${(SIGNATORIES[p.id] ?? []).length || "—"}`) },
    { label: "Forensic cases", values: picks.map((p) => `${FORENSIC_CASES.filter((c) => c.projectId === p.id).length}`) },
    { label: "Status", values: picks.map((p) => p.status) },
  ];
}

function healthiest(picks: typeof PROJECTS) {
  const winner = [...picks].sort((a, b) => b.trustScore - a.trustScore - (a.riskScore - b.riskScore))[0];
  return `${winner.name} leads on trust score (${winner.trustScore}) with the lowest forensic exposure. Continue current cadence.`;
}
function worst(picks: typeof PROJECTS) {
  const loser = [...picks].sort((a, b) => b.riskScore - a.riskScore + (b.alerts - a.alerts) * 5)[0];
  return `${loser.name} carries the highest risk (${loser.riskScore}) with ${loser.alerts} open alert${loser.alerts === 1 ? "" : "s"}. Consider dispatching a trustee and pausing the next disbursement.`;
}
