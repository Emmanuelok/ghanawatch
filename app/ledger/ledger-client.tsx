"use client";
import { useMemo, useState } from "react";
import {
  Search,
  Fingerprint,
  CheckCircle2,
  FileText,
  Camera,
  Banknote,
  Flag,
  AlertTriangle,
  ShieldCheck,
  Users,
  Settings,
} from "lucide-react";
import type { AuditEvent, Project } from "@/lib/types";
import { chainHash } from "@/lib/hash";

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

const CATEGORIES = ["all", "doc", "site", "payment", "milestone", "alert", "verify", "trustee", "system"] as const;

export function LedgerExplorer({ events, projects }: { events: AuditEvent[]; projects: Project[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("all");
  const [projectId, setProjectId] = useState<string>("all");
  const [verified, setVerified] = useState<null | "ok" | "broken">(null);

  // Verify the chain
  const verification = useMemo(() => {
    const byProject: Record<string, AuditEvent[]> = {};
    for (const e of events) (byProject[e.projectId] ??= []).push(e);
    const broken: string[] = [];
    let total = 0;
    for (const id of Object.keys(byProject)) {
      const list = [...byProject[id]].sort((a, b) => (a.ts < b.ts ? -1 : 1));
      let prev = "0x000000000000000000";
      for (const e of list) {
        total++;
        const payload = `${e.id}|${e.ts}|${e.actor}|${e.action}|${e.category}|${e.ref ?? ""}`;
        const expected = chainHash(prev, payload);
        if (expected !== e.hash || e.prevHash !== prev) broken.push(e.id);
        prev = e.hash;
      }
    }
    return { total, broken };
  }, [events]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return events
      .filter((e) => (cat === "all" ? true : e.category === cat))
      .filter((e) => (projectId === "all" ? true : e.projectId === projectId))
      .filter((e) => {
        if (!t) return true;
        return (
          e.action.toLowerCase().includes(t) ||
          e.actor.toLowerCase().includes(t) ||
          e.hash.toLowerCase().includes(t) ||
          (e.ref ?? "").toLowerCase().includes(t)
        );
      })
      .sort((a, b) => (a.ts < b.ts ? 1 : -1));
  }, [events, q, cat, projectId]);

  function runVerify() {
    setVerified(verification.broken.length === 0 ? "ok" : "broken");
  }

  return (
    <div className="mt-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Kpi label="Events on chain" value={verification.total.toLocaleString()} />
        <Kpi label="Projects tracked" value={`${projects.length}`} />
        <Kpi
          label="Chain integrity"
          value={verification.broken.length === 0 ? "Intact ✓" : `${verification.broken.length} broken`}
          good={verification.broken.length === 0}
        />
      </div>

      <div className="mt-5 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search action, actor, hash, reference…"
            className="input pl-9"
          />
        </div>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="input md:max-w-[240px]"
        >
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button onClick={runVerify} className="btn btn-ghost"><ShieldCheck className="h-4 w-4" /> Verify chain</button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`chip cursor-pointer capitalize ${cat === c ? "border-accent-gold/40 bg-accent-gold/10 text-ink" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      {verified && (
        <div
          className={`mt-4 rounded-lg border p-3 text-[13px] ${
            verified === "ok"
              ? "border-accent-green/30 bg-accent-green/5 text-accent-green"
              : "border-risk-high/30 bg-risk-high/5 text-risk-high"
          }`}
        >
          {verified === "ok" ? (
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Chain verified — all {verification.total} events hash forward correctly.</span>
          ) : (
            <span className="inline-flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> {verification.broken.length} broken hashes detected.</span>
          )}
        </div>
      )}

      <div className="mt-5 card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-4 py-2 text-[11px] text-ink-muted">
          Showing {filtered.length} events · most recent first
        </div>
        <div className="divide-y divide-line max-h-[640px] overflow-y-auto scroll-shadow">
          {filtered.map((e) => {
            const Icon = iconMap[e.category];
            const proj = projects.find((p) => p.id === e.projectId);
            return (
              <div key={e.id} className="grid grid-cols-[36px_1fr_auto] items-start gap-3 px-5 py-4">
                <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-md border border-line bg-bg-elev">
                  <Icon className="h-3.5 w-3.5 text-accent-gold" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] text-ink">{e.action}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
                    <span>{e.actor}</span>
                    <span>·</span>
                    <span>{new Date(e.ts).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
                    {proj && (<><span>·</span><span>{proj.name}</span></>)}
                    <span className="chip uppercase">{e.category}</span>
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
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-3 w-3 text-accent-green" />
                      <span className="text-ink-muted">sig</span>
                      <span className="hash-mono">{e.sig}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-ink-muted">#{events.indexOf(e) + 1}</div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-[13px] text-ink-muted">No events match.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight" style={good ? { color: "#10b981" } : {}}>{value}</div>
    </div>
  );
}
