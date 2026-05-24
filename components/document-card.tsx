"use client";
import { useState } from "react";
import {
  FileText,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import type { Document } from "@/lib/types";

export function DocumentCard({ doc }: { doc: Document }) {
  const [open, setOpen] = useState(false);
  const ok = doc.authenticityScore >= 80;
  const warn = doc.authenticityScore >= 50 && doc.authenticityScore < 80;
  const color = ok ? "#10b981" : warn ? "#f59e0b" : "#ef4444";

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-bg-elev/40"
      >
        <div
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
          style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
        >
          {ok ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-ink-muted" />
            <div className="truncate text-[14px] font-semibold">{doc.name}</div>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
            <span className="capitalize">{doc.type.replace("-", " ")}</span>
            <span>·</span>
            <span>by {doc.uploadedBy}</span>
            {doc.amountGHS && (
              <>
                <span>·</span>
                <span>GHS {doc.amountGHS.toLocaleString()}</span>
              </>
            )}
          </div>
        </div>
        <div className="hidden text-right md:block">
          <div className="text-[18px] font-semibold" style={{ color }}>
            {doc.authenticityScore}%
          </div>
          <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">authenticity</div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-ink-muted" /> : <ChevronDown className="h-4 w-4 text-ink-muted" />}
      </button>

      {open && (
        <div className="animate-fade-in border-t border-line bg-bg-elev/40 px-5 py-5">
          {doc.flags.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                Forensic flags
              </div>
              <div className="space-y-1.5">
                {doc.flags.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-[13px]">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-risk-high" />
                    <span className="text-ink-dim">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">
              Forensic breakdown
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <Bar label="Font consistency" value={doc.forensics.fontConsistency} invert={false} />
              <Bar label="Pixel tampering" value={doc.forensics.pixelTampering} invert />
              <Bar label="AI-generated probability" value={doc.forensics.aiGeneratedProbability} invert />
              <Bar label="Chain of custody" value={doc.forensics.chainOfCustody} invert={false} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
              <Tag ok={doc.forensics.metadataIntact} label="EXIF/metadata intact" />
              <Tag ok={doc.forensics.crossRefMatched ?? false} label="Cross-ref matched" />
              <Tag ok={doc.forensics.compressionAnomalies === 0} label="No compression anomalies" />
              <Tag ok={!doc.forensics.duplicateOfRef} label="No duplicate match" />
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-line pt-3">
            <Fingerprint className="h-3 w-3 text-ink-muted" />
            <span className="hash-mono">{doc.hash}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Bar({ label, value, invert }: { label: string; value: number; invert: boolean }) {
  const good = invert ? 100 - value : value;
  const color = good >= 80 ? "#10b981" : good >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div>
      <div className="flex items-baseline justify-between text-[12px]">
        <span className="text-ink-dim">{label}</span>
        <span className="font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-bg-subtle">
        <div className="h-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function Tag({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className="chip"
      style={{
        color: ok ? "#10b981" : "#ef4444",
        borderColor: ok ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
        background: ok ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)",
      }}
    >
      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </span>
  );
}
