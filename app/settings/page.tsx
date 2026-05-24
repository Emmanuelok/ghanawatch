import { SettingsClient } from "./settings-client";
import { Settings } from "lucide-react";

export const metadata = { title: "Settings — GhanaWatch" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Settings className="h-3 w-3" /> Settings
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your account</h1>
      </div>
      <SettingsClient />
    </div>
  );
}
