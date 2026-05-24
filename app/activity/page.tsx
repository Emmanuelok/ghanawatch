import { ActivityFeed } from "./activity-client";
import { Activity } from "lucide-react";

export const metadata = { title: "Live Activity — GhanaWatch" };

export default function ActivityPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Activity className="h-3 w-3" /> Network pulse
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Live activity feed</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Every verification, every trustee dispatch, every escrow release, every flagged case
          across the entire GhanaWatch network — streamed in real time (anonymised). It's how the
          platform's collective intelligence keeps growing.
        </p>
      </div>
      <ActivityFeed />
    </div>
  );
}
