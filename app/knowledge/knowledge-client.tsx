"use client";
import { useState, useMemo } from "react";
import { Search, ShieldAlert, Check, AlertTriangle, ExternalLink } from "lucide-react";
import { FRAUD_PATTERNS } from "@/lib/mock-data";
import { SectorBadge, SECTOR_META } from "@/components/sector-icon";

const ALL = "all" as const;

export function KnowledgeClient() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>(ALL);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return FRAUD_PATTERNS.filter((p) => {
      if (sector !== ALL && p.sector !== sector) return false;
      if (!t) return true;
      return (
        p.name.toLowerCase().includes(t) ||
        p.region.toLowerCase().includes(t) ||
        p.signals.join(" ").toLowerCase().includes(t) ||
        p.countermeasures.join(" ").toLowerCase().includes(t) ||
        p.caseExamples.join(" ").toLowerCase().includes(t)
      );
    });
  }, [q, sector]);

  const sectors = [ALL, ...Array.from(new Set(FRAUD_PATTERNS.map((p) => p.sector)))];

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search patterns, signals, regions, case examples…"
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-line bg-bg-elev p-1 text-[12px]">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 capitalize ${
                sector === s ? "bg-bg-card text-ink" : "text-ink-dim hover:text-ink"
              }`}
            >
              {s === ALL ? "All sectors" : (SECTOR_META as any)[s]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5">
        {filtered.map((p) => (
          <div key={p.id} className="card overflow-hidden">
            <div className="border-b border-line p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="chip uppercase tracking-wider"
                  style={
                    p.prevalence === "endemic"
                      ? { color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)" }
                      : p.prevalence === "common"
                      ? { color: "#f59e0b", borderColor: "rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.08)" }
                      : { color: "#9aa0b0" }
                  }
                >
                  <AlertTriangle className="h-3 w-3" />
                  {p.prevalence}
                </span>
                {p.sector !== "any" && <SectorBadge sector={p.sector as any} />}
                <span className="chip">{p.region}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-accent-gold" />
                <h2 className="text-[18px] font-semibold tracking-tight">{p.name}</h2>
              </div>
            </div>

            <div className="grid divide-line md:grid-cols-3 md:divide-x">
              <div className="p-6">
                <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">Warning signals</div>
                <ul className="space-y-2 text-[13px]">
                  {p.signals.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-ink-dim">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-risk-high" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6">
                <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">Countermeasures</div>
                <ul className="space-y-2 text-[13px]">
                  {p.countermeasures.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-ink-dim">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6">
                <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">Case examples</div>
                <ul className="space-y-3 text-[13px]">
                  {p.caseExamples.map((s) => (
                    <li key={s} className="rounded-lg border border-line bg-bg-elev/40 p-3 text-ink-dim">
                      {s}
                    </li>
                  ))}
                </ul>
                {p.refUrl && (
                  <a
                    href={p.refUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-accent-gold hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> Source
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card grid place-items-center px-6 py-16 text-center text-[13px] text-ink-dim">
            No patterns match this query.
          </div>
        )}
      </div>
    </>
  );
}
