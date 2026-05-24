"use client";
import { useMemo, useState } from "react";
import { Rewind, Calendar, Clock, ArrowRight } from "lucide-react";
import type { Project, AuditEvent } from "@/lib/types";

export function TimeMachine({ project, events }: { project: Project; events: AuditEvent[] }) {
  const sorted = useMemo(() => [...events].sort((a, b) => (a.ts < b.ts ? -1 : 1)), [events]);
  const [idx, setIdx] = useState(sorted.length - 1);

  if (sorted.length === 0) {
    return (
      <div className="card p-5 text-[12px] text-ink-muted">
        No audit events yet — the time machine activates once this project starts generating ledger events.
      </div>
    );
  }

  const at = sorted[idx];
  const before = sorted.slice(0, idx + 1);

  // Reconstruct state at the chosen point
  const stateAt = useMemo(() => {
    let trust = 92;
    let risk = 18;
    let releasedGHS = 0;
    let docsVerified = 0;
    let docsFlagged = 0;
    let photos = 0;
    let cases = 0;
    let alerts = 0;
    let milestonesReleased = 0;

    for (const e of before) {
      switch (e.category) {
        case "doc": docsVerified++; break;
        case "site": photos++; break;
        case "payment":
          releasedGHS += Number((e.meta as any)?.amount ?? 0);
          break;
        case "milestone":
          milestonesReleased++;
          const m = e.action.match(/GHS\s*([\d,]+)/);
          if (m) releasedGHS += Number(m[1].replace(/,/g, ""));
          break;
        case "alert":
          alerts++;
          risk += 6; trust -= 4;
          if (e.action.toLowerCase().includes("flagged")) docsFlagged++;
          break;
        case "verify":
          trust += 1;
          break;
        case "trustee":
          trust += 3; risk -= 2;
          break;
      }
    }
    return { trust: Math.max(0, Math.min(100, trust)), risk: Math.max(0, Math.min(100, risk)), releasedGHS, docsVerified, docsFlagged, photos, alerts, milestonesReleased };
  }, [before]);

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rewind className="h-4 w-4 text-accent-gold" />
          <div className="text-[14px] font-semibold">Project time machine</div>
        </div>
        <span className="chip text-[10px]">
          {idx + 1}/{sorted.length} events
        </span>
      </div>
      <p className="text-[12px] text-ink-dim">
        Drag the slider to reconstruct the project's state at any past audit event. Useful for
        post-mortems, dispute timelines, and explaining "what did we know, when?".
      </p>

      <div className="mt-5">
        <input
          type="range"
          min={0}
          max={sorted.length - 1}
          value={idx}
          onChange={(e) => setIdx(Number(e.target.value))}
          className="w-full accent-amber-500"
        />
        <div className="mt-1 flex items-center justify-between text-[10px] text-ink-muted">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {first.ts.slice(0, 10)}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {at.ts.slice(0, 16).replace("T", " ")}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {last.ts.slice(0, 10)}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-2 text-center md:grid-cols-4">
        <Stat label="Trust" value={`${stateAt.trust}`} color="#10b981" />
        <Stat label="Risk" value={`${stateAt.risk}`} color={stateAt.risk >= 60 ? "#ef4444" : stateAt.risk >= 40 ? "#f59e0b" : "#10b981"} />
        <Stat label="Released" value={`GHS ${(stateAt.releasedGHS / 1000).toFixed(0)}K`} color="#f5b800" />
        <Stat label="Milestones" value={`${stateAt.milestonesReleased}`} color="#3b82f6" />
      </div>

      <div className="mt-3 grid gap-2 text-center md:grid-cols-4">
        <Stat label="Docs verified" value={`${stateAt.docsVerified}`} small />
        <Stat label="Docs flagged" value={`${stateAt.docsFlagged}`} small color={stateAt.docsFlagged > 0 ? "#ef4444" : undefined} />
        <Stat label="Photos" value={`${stateAt.photos}`} small />
        <Stat label="Alerts open" value={`${stateAt.alerts}`} small color={stateAt.alerts > 0 ? "#f59e0b" : undefined} />
      </div>

      <div className="mt-5 rounded-md border border-line bg-bg-elev/40 p-3 text-[12px]">
        <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">At this point</div>
        <div className="mt-1 text-ink">{at.action}</div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-muted">
          <span>{at.actor}</span>
          <ArrowRight className="h-3 w-3" />
          <span className="hash-mono">{at.hash}</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color, small }: { label: string; value: string; color?: string; small?: boolean }) {
  return (
    <div className="rounded-md border border-line bg-bg-elev/40 p-2">
      <div className={small ? "text-[13px]" : "text-[18px] font-semibold"} style={{ color: color || "#e8eaf0" }}>{value}</div>
      <div className="text-[9px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
    </div>
  );
}
