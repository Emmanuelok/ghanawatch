import { AlertsClient } from "./alerts-client";
import { Bell } from "lucide-react";

export const metadata = { title: "Smart alerts — GhanaWatch" };

export default function SmartAlertsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Bell className="h-3 w-3" /> Smart alerts
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Network-wide smart alerts</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Set rules that fire on patterns across the entire GhanaWatch network — not just your
          own projects. If three diaspora users in East Legon Hills get flagged with the same
          indenture seller, you want to know. Build the rule once; it watches for you.
        </p>
      </div>
      <AlertsClient />
    </div>
  );
}
