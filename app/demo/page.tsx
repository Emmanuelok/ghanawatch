import { DemoClient } from "./client";
import { Play } from "lucide-react";

export const metadata = { title: "Guided demo — GhanaWatch" };

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Play className="h-3 w-3" /> Guided demo
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">A scripted end-to-end scenario.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Watch a complete project go from launch → flag → trustee dispatch → mediation → resolution,
          one beat at a time. Press play, or step through manually.
        </p>
      </div>
      <DemoClient />
    </div>
  );
}
