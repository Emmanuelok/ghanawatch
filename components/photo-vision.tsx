"use client";
import { useRef, useState } from "react";
import { Camera, Loader2, Sparkles, Upload, X, Check, AlertTriangle } from "lucide-react";

type Result = {
  stage: string;
  stageConfidence: number;
  observations: string[];
  qualityFlags: string[];
  anomalies: string[];
  verdict: "consistent" | "suspicious" | "off-pattern";
  recommendation: string;
};

export function PhotoVision({ projectName }: { projectName?: string }) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function pick(file: File) {
    if (file.size > 6 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function run() {
    if (!image && !loading) {
      // run with a no-op to get the offline reply
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/photo-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: image ?? "data:image/png;base64,iVBORw0KGgo=", projectCtx: projectName }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const color = result?.verdict === "consistent" ? "#10b981" : result?.verdict === "suspicious" ? "#f59e0b" : "#ef4444";

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[14px] font-semibold">
          <Sparkles className="h-4 w-4 text-accent-gold" /> AI vision — site photo analysis
        </div>
        {!loading && (
          <button onClick={run} className="btn btn-ghost text-[11px] py-1.5">
            <Sparkles className="h-3 w-3" /> Analyse
          </button>
        )}
      </div>
      <p className="text-[12px] text-ink-dim">
        Upload a site photo. Claude reads the image, identifies BOQ stage, lists what's visible,
        flags anomalies, and verdicts whether it's consistent with the project's claimed state.
      </p>

      <div className="mt-4">
        {image ? (
          <div className="relative">
            <img src={image} alt="site" className="max-h-72 w-full rounded-md border border-line object-contain" />
            <button onClick={() => { setImage(null); setResult(null); }} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-bg/80 text-ink-dim hover:text-ink"><X className="h-3.5 w-3.5" /></button>
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()} className="grid w-full place-items-center rounded-xl border-2 border-dashed border-line bg-bg-elev/40 py-10 text-center text-[12px] text-ink-dim hover:border-accent-gold/40">
            <Upload className="mb-2 h-6 w-6 text-ink-muted" />
            Click or drop a site photo
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f); }} />
      </div>

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-[12px] text-ink-dim">
          <Loader2 className="h-4 w-4 animate-spin text-accent-gold" /> Vision model reading the image…
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-line bg-bg-elev/40 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: `${color}15`, color }}>
              {result.verdict === "consistent" ? <Check className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-semibold capitalize" style={{ color }}>{result.verdict}</div>
              <div className="text-[12px] text-ink-dim">{result.stage} · confidence {result.stageConfidence}%</div>
            </div>
          </div>

          {result.observations.length > 0 && (
            <div className="rounded-md border border-line bg-bg-elev/40 p-3">
              <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">What's visible</div>
              <ul className="mt-1 space-y-1 text-[12px] text-ink-dim">
                {result.observations.map((o) => <li key={o} className="flex items-start gap-2"><Camera className="mt-0.5 h-3 w-3 text-accent-gold shrink-0" />{o}</li>)}
              </ul>
            </div>
          )}
          {result.qualityFlags.length > 0 && (
            <div className="rounded-md border border-line bg-bg-elev/40 p-3">
              <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Quality cues</div>
              <ul className="mt-1 space-y-1 text-[12px] text-ink-dim">
                {result.qualityFlags.map((o) => <li key={o}>· {o}</li>)}
              </ul>
            </div>
          )}
          {result.anomalies.length > 0 && (
            <div className="rounded-md border border-risk-high/30 bg-risk-high/5 p-3">
              <div className="text-[10px] uppercase tracking-[0.12em] text-risk-high">Anomalies</div>
              <ul className="mt-1 space-y-1 text-[12px] text-ink-dim">
                {result.anomalies.map((o) => <li key={o} className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-3 w-3 text-risk-high shrink-0" />{o}</li>)}
              </ul>
            </div>
          )}
          <div className="rounded-md border border-accent-gold/30 bg-accent-gold/5 p-3 text-[12px] text-ink">
            <strong>Recommendation: </strong>{result.recommendation}
          </div>
        </div>
      )}
    </div>
  );
}
