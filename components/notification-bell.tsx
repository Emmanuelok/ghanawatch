"use client";
import { useState } from "react";
import Link from "next/link";
import { Bell, AlertTriangle, CheckCircle2, ShieldCheck, FileText, Flag, Banknote } from "lucide-react";
import { NOTIFICATIONS } from "@/lib/mock-data";

const iconMap = {
  alert: AlertTriangle,
  verify: ShieldCheck,
  trustee: CheckCircle2,
  milestone: Flag,
  doc: FileText,
  ledger: Banknote,
  system: Bell,
} as const;

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-8 w-8 place-items-center rounded-md border border-line bg-bg-elev text-ink-dim hover:text-ink"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-accent-red px-1 text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-[360px] overflow-hidden rounded-xl border border-line bg-bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div>
                <div className="text-[13px] font-semibold">Notifications</div>
                <div className="text-[11px] text-ink-muted">{unread} unread · {NOTIFICATIONS.length} total</div>
              </div>
              <Link
                href="/inbox"
                onClick={() => setOpen(false)}
                className="text-[11px] text-ink-dim hover:text-ink"
              >
                Open inbox →
              </Link>
            </div>
            <div className="max-h-[400px] divide-y divide-line overflow-y-auto scroll-shadow">
              {NOTIFICATIONS.slice(0, 8).map((n) => {
                const Icon = iconMap[n.kind] ?? Bell;
                const color =
                  n.severity === "critical" ? "#ef4444" : n.severity === "warning" ? "#f59e0b" : "#9aa0b0";
                const href = n.projectId ? `/projects/${n.projectId}` : "/inbox";
                return (
                  <Link
                    key={n.id}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 hover:bg-bg-elev/50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md"
                        style={{ background: `${color}15`, color }}
                      >
                        <Icon className="h-3 w-3" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="truncate text-[12.5px] font-medium text-ink">{n.title}</div>
                          {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />}
                        </div>
                        <div className="mt-0.5 line-clamp-2 text-[11px] text-ink-dim">{n.body}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
