"use client";
import { useState } from "react";
import { Sparkles, Loader2, Camera } from "lucide-react";
import type { Project } from "@/lib/types";

export function ExpectedProgress({ project }: { project: Project }) {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  function generate() {
    setLoading(true);
    setTimeout(() => { setLoading(false); setReady(true); }, 1400);
  }

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[14px] font-semibold">
          <Sparkles className="h-4 w-4 text-accent-gold" /> AI expected-progress reference
        </div>
        {!ready && (
          <button onClick={generate} disabled={loading} className="btn btn-ghost text-[11px] py-1.5 disabled:opacity-40">
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            Generate
          </button>
        )}
      </div>
      <p className="text-[12px] text-ink-dim">
        Given the project's BOQ + week-on-week milestone calendar, this is what the site should
        look like at the next trustee visit. Compare against the next geo-stamped photo to spot
        deviations early.
      </p>

      {ready && (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Card label="Last verified" tone="ground" date="20 May 2026" caption="Lintel work in progress, blockwork at first floor." />
          <Card label="AI expected (today)" tone="ai" date="24 May 2026" caption="First-floor decking should be cast; rebar visible for next-stage columns." />
          <Card label="Pending" tone="future" date="next visit" caption="Awaiting trustee dispatch — drone + 6 ground angles." />
        </div>
      )}

      {!ready && !loading && (
        <div className="mt-4 grid place-items-center rounded-md border border-dashed border-line p-8 text-center text-[12px] text-ink-muted">
          Generate to compare last-verified vs AI-expected vs upcoming.
        </div>
      )}
      {loading && (
        <div className="mt-4 grid place-items-center rounded-md border border-line bg-bg-elev/40 p-8 text-center text-[12px] text-ink-dim">
          <Loader2 className="mb-2 h-5 w-5 animate-spin text-accent-gold" />
          Synthesising expected-progress reference from BOQ stage 4.2 + week-on-week velocity…
        </div>
      )}
    </div>
  );
}

function Card({ label, tone, date, caption }: { label: string; tone: "ground" | "ai" | "future"; date: string; caption: string }) {
  const tones: Record<typeof tone, string> = {
    ground: "linear-gradient(135deg, #14532d, #16a34a 50%, #facc15)",
    ai: "linear-gradient(135deg, #1e3a8a, #0ea5e9 50%, #fb923c)",
    future: "linear-gradient(135deg, #18181b, #71717a 70%)",
  } as any;
  return (
    <div className="card overflow-hidden">
      <div className="aspect-video w-full" style={{ background: tones[tone] }}>
        <div className="grid h-full place-items-center text-white/85">
          <Camera className="h-7 w-7" />
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-ink-muted uppercase tracking-[0.12em]">{label}</span>
          <span className="text-ink-muted">{date}</span>
        </div>
        <div className="mt-1 text-[12px] text-ink-dim">{caption}</div>
      </div>
    </div>
  );
}
