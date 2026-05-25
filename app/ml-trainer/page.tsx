"use client";
import { useState, useEffect } from "react";
import { Cpu, Upload, Play, Pause, Check, Loader2, TrendingUp, Database, Sparkles, Zap } from "lucide-react";

type Status = "draft" | "training" | "deployed" | "paused";

const MODELS = [
  { id: "m-1", name: "Stanbic — Corridor Risk v2", base: "claude-haiku-4-5 + LoRA", status: "deployed" as Status, version: "v2.1.3", accuracy: 94.2, samples: 18_412, owner: "Stanbic Bank", deployedAt: "2026-04-22" },
  { id: "m-2", name: "MTN — MoMo Merchant Authenticity", base: "custom CNN + Claude classifier", status: "training" as Status, version: "v1.0.0-rc.4", accuracy: 91.8, samples: 11_220, owner: "MTN", deployedAt: "—" },
  { id: "m-3", name: "British HC — Title Cluster Detector", base: "Graph NN + Claude reasoning", status: "draft" as Status, version: "v0.1.0", accuracy: 0, samples: 0, owner: "British High Commission", deployedAt: "—" },
];

export default function MLTrainerPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Cpu className="h-3 w-3" /> Custom ML model trainer
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Train your own forensic model.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Institutional partners can train custom forensic models on their corridor data. Models
          run inside GhanaWatch's enclave; raw data never leaves your custody. Useful when your
          population looks materially different from the platform average (e.g. one bank's UK
          remittance corridor has different signals from another's USA corridor).
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Kpi icon={Database} label="Models in production" value="12" />
        <Kpi icon={TrendingUp} label="Avg corridor-specific lift" value="+18.4%" color="#10b981" />
        <Kpi icon={Zap} label="Training time (typical)" value="~ 4 hours" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Models</div>
          <div className="divide-y divide-line">
            {MODELS.map((m) => (
              <ModelRow key={m.id} m={m} />
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Sparkles className="h-4 w-4 text-accent-gold" /> Train a new model</div>
          <div className="space-y-3">
            <Field label="Model name"><input placeholder="e.g. Wise — EU corridor receipt forensics" className="input" /></Field>
            <Field label="Base"><select className="input"><option>Claude Haiku 4.5 + LoRA fine-tune</option><option>Claude Sonnet 4.6 + RAG corpus</option><option>Custom CNN (vision-only)</option><option>Graph NN (cluster detector)</option></select></Field>
            <Field label="Task"><select className="input"><option>Document forensics (receipts / invoices)</option><option>Site-photo verification</option><option>Title-cluster detection</option><option>Corridor-specific risk scoring</option><option>Vendor authenticity scoring</option></select></Field>
            <Field label="Training data"><div className="rounded-md border-2 border-dashed border-line bg-bg-elev/40 p-6 text-center text-[12px] text-ink-dim"><Upload className="mx-auto mb-2 h-5 w-5" />Drop .jsonl / .parquet (≤ 1GB)<br /><span className="text-[10px] text-ink-muted">PII-scrubbed automatically</span></div></Field>
            <Field label="Validation split"><input type="range" min="5" max="30" defaultValue={20} className="w-full accent-amber-500" /><div className="text-[10px] text-ink-muted">20% hold-out</div></Field>
            <button className="btn btn-primary w-full justify-center"><Play className="h-4 w-4" /> Start training</button>
            <p className="text-[10.5px] text-ink-muted">Training runs in our SOC2 enclave on isolated GPUs. We never see your raw data; the trained weights belong to you and can be deleted at any time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelRow({ m }: any) {
  const [progress, setProgress] = useState(m.status === "training" ? 67 : 100);
  useEffect(() => {
    if (m.status !== "training") return;
    const id = setInterval(() => setProgress((p) => (p >= 99 ? p : p + 0.4)), 800);
    return () => clearInterval(id);
  }, [m.status]);

  const colour = m.status === "deployed" ? "#10b981" : m.status === "training" ? "#f5b800" : "#9aa0b0";

  return (
    <div className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip uppercase" style={{ color: colour, borderColor: `${colour}30`, background: `${colour}10` }}>
          {m.status === "training" && <Loader2 className="h-3 w-3 animate-spin" />} {m.status}
        </span>
        <span className="chip text-[10px]">{m.base}</span>
        <span className="chip text-[10px]">{m.version}</span>
        <span className="ml-auto text-[11px] text-ink-muted">owner · {m.owner}</span>
      </div>
      <div className="mt-2 text-[14px] font-semibold">{m.name}</div>
      <div className="mt-2 grid gap-2 md:grid-cols-3 text-[12px]">
        <div className="rounded-md border border-line bg-bg-elev/40 p-2.5">
          <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Accuracy</div>
          <div className="mt-0.5 text-[15px] font-semibold" style={{ color: colour }}>{m.accuracy}%</div>
        </div>
        <div className="rounded-md border border-line bg-bg-elev/40 p-2.5">
          <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Training samples</div>
          <div className="mt-0.5 text-[15px] font-semibold">{m.samples.toLocaleString()}</div>
        </div>
        <div className="rounded-md border border-line bg-bg-elev/40 p-2.5">
          <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Deployed</div>
          <div className="mt-0.5 text-[15px] font-semibold">{m.deployedAt}</div>
        </div>
      </div>
      {m.status === "training" && (
        <div className="mt-3">
          <div className="flex items-baseline justify-between text-[11px] text-ink-muted">
            <span>Training in enclave (8× H100)</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
            <div className="h-full bg-accent-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-1 text-[10px] text-ink-muted">ETA ~ 1h 42m · loss curve converging</div>
        </div>
      )}
    </div>
  );
}

function Kpi({ icon: Icon, label, value, color }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight" style={color ? { color } : {}}>{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      {children}
    </label>
  );
}
