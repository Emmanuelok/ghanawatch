import { Flag, Lock, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import type { Milestone } from "@/lib/types";

const meta = {
  pending: { color: "#6b7280", icon: Clock, label: "Pending" },
  "in-progress": { color: "#3b82f6", icon: Flag, label: "In progress" },
  verified: { color: "#f59e0b", icon: CheckCircle2, label: "Verified — awaiting release" },
  released: { color: "#10b981", icon: CheckCircle2, label: "Released" },
  disputed: { color: "#ef4444", icon: AlertCircle, label: "Disputed" },
} as const;

export function MilestoneList({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div>
          <div className="text-[14px] font-semibold">Milestone escrow</div>
          <div className="text-[11px] text-ink-muted">Funds release only on verified evidence + trustee attestation.</div>
        </div>
      </div>
      <div className="divide-y divide-line">
        {milestones.map((m, i) => {
          const cfg = meta[m.status];
          const Icon = cfg.icon;
          return (
            <div key={m.id} className="flex items-center gap-4 px-5 py-3.5">
              <div
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
                style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-ink-muted">M{i + 1}</span>
                  <span className="text-[14px] font-semibold">{m.name}</span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
                  <span>Due {new Date(m.dueDate).toLocaleDateString("en-GB", { dateStyle: "medium" })}</span>
                  <span>·</span>
                  <span>{m.evidenceCount} evidence items</span>
                  {m.verifiedBy && (
                    <>
                      <span>·</span>
                      <span>Verified by {m.verifiedBy}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[14px] font-semibold">GHS {m.amountGHS.toLocaleString()}</div>
                <div
                  className="mt-0.5 text-[11px]"
                  style={{ color: cfg.color }}
                >
                  {cfg.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
