"use client";
import { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";

export function ProjectHealth({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);

  async function fetchHealth() {
    setLoading(true);
    setText(null);
    try {
      const res = await fetch("/api/project-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();
      setText(data.text ?? "Could not generate health summary.");
    } catch {
      setText("Could not generate health summary.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent-gold" />
          <div className="text-[14px] font-semibold">AI health summary</div>
        </div>
        <button onClick={fetchHealth} disabled={loading} className="btn btn-ghost text-[11px] py-1.5 disabled:opacity-40">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          {text ? "Regenerate" : "Generate"}
        </button>
      </div>
      {!text && !loading && (
        <p className="text-[12px] text-ink-dim">
          Tap Generate for a 10-second executive narrative — what's the project state, what flags
          are open, what to do next.
        </p>
      )}
      {loading && (
        <div className="flex items-center gap-2 text-[12px] text-ink-dim">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-accent-gold" />
          Reading the project's signals…
        </div>
      )}
      {text && (
        <div className="space-y-3 text-[13px] leading-relaxed text-ink-dim">
          {text.split("\n\n").map((p, i) => (
            <p key={i} className={p.toLowerCase().startsWith("next best action") ? "rounded-md border border-accent-gold/30 bg-accent-gold/5 px-3 py-2 text-ink" : ""}>
              {p}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
