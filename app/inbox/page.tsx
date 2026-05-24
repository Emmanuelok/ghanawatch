"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Inbox,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Flag,
  Bell,
  Filter,
} from "lucide-react";
import { NOTIFICATIONS, PROJECTS } from "@/lib/mock-data";

const iconMap = {
  alert: AlertTriangle,
  verify: ShieldCheck,
  trustee: CheckCircle2,
  milestone: Flag,
  doc: FileText,
  ledger: Bell,
  system: Bell,
} as const;

export default function InboxPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");

  const filtered = useMemo(() => {
    if (filter === "unread") return NOTIFICATIONS.filter((n) => !n.read);
    if (filter === "critical") return NOTIFICATIONS.filter((n) => n.severity === "critical");
    return NOTIFICATIONS;
  }, [filter]);

  const byDay = useMemo(() => {
    const g: Record<string, typeof NOTIFICATIONS> = {};
    for (const n of filtered) {
      const day = relDay(n.ts);
      (g[day] ??= []).push(n);
    }
    return g;
  }, [filtered]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            <Inbox className="h-3 w-3" /> Inbox
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Alerts & notifications</h1>
          <p className="mt-1 text-[14px] text-ink-dim">
            Everything that demands your attention — flagged docs, off-site photos, trustee updates, ledger commits.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-bg-elev p-1 text-[12px]">
          {(["all", "unread", "critical"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 capitalize ${
                filter === f ? "bg-bg-card text-ink" : "text-ink-dim hover:text-ink"
              }`}
            >
              {f}
              {f === "unread" && (
                <span className="ml-1.5 text-[10px] text-accent-gold">
                  {NOTIFICATIONS.filter((n) => !n.read).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {Object.entries(byDay).map(([day, items]) => (
          <section key={day}>
            <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">{day}</div>
            <div className="card overflow-hidden">
              <div className="divide-y divide-line">
                {items.map((n) => {
                  const Icon = iconMap[n.kind] ?? Bell;
                  const color =
                    n.severity === "critical" ? "#ef4444" : n.severity === "warning" ? "#f59e0b" : "#9aa0b0";
                  const proj = n.projectId ? PROJECTS.find((p) => p.id === n.projectId) : null;
                  const href = proj ? `/projects/${proj.id}` : "#";
                  return (
                    <Link
                      key={n.id}
                      href={href}
                      className="flex gap-4 px-5 py-4 transition-colors hover:bg-bg-elev/50"
                    >
                      <div
                        className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-[14px] font-semibold">{n.title}</div>
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />}
                          {n.severity && (
                            <span
                              className="chip uppercase tracking-wider"
                              style={{ color, borderColor: `${color}30`, background: `${color}10` }}
                            >
                              {n.severity}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[13px] text-ink-dim">{n.body}</p>
                        {proj && (
                          <div className="mt-1.5 text-[11px] text-ink-muted">
                            {proj.name} · {proj.location}
                          </div>
                        )}
                      </div>
                      <div className="text-right text-[11px] text-ink-muted">{relTime(n.ts)}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function relDay(iso: string) {
  const t = new Date(iso).getTime();
  const now = new Date("2026-05-24T09:00:00Z").getTime();
  const d = Math.floor((now - t) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)} weeks ago`;
  return new Date(iso).toLocaleDateString("en-GB", { dateStyle: "medium" });
}

function relTime(iso: string) {
  const t = new Date(iso).getTime();
  const now = new Date("2026-05-24T09:00:00Z").getTime();
  const diff = Math.max(0, now - t);
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `${d}d`;
  const h = Math.floor(diff / 3600000);
  if (h > 0) return `${h}h`;
  return `${Math.floor(diff / 60000)}m`;
}
