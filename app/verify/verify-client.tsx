"use client";
import { useState } from "react";
import { Loader2, ShieldAlert, ShieldCheck, Fingerprint, Upload, FileText } from "lucide-react";

type Result = {
  verdict: "verified" | "flagged" | "rejected";
  score: number;
  summary: string;
  flags: string[];
  forensics: {
    fontConsistency: number;
    pixelTampering: number;
    aiGenerated: number;
    chainOfCustody: number;
    metadataIntact: boolean;
    vendorPatternMatch: boolean;
  };
  recommendation: string;
  hash: string;
};

const EXAMPLES = [
  "Cement receipt from Diamond Cement, GHS 14,400 for 45 bags, dated last week, photo from WhatsApp",
  "Indenture for 2.5-acre plot in East Legon Hills, signed by stool elder, no LC stamp",
  "GRA customs duty receipt for Honda Civic 2019, GHS 36,800, serial CG-2148-A",
  "Korle Bu surgery bill GHS 18,500, itemised with anaesthesia and 3 nights ward",
  "Cosmetics shop rent top-up GHS 12,400, signed by landlord Mr. Adjei, plain paper",
];

export function VerifyClient() {
  const [text, setText] = useState("");
  const [type, setType] = useState("receipt");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    if (!text.trim()) return;
    setLoading(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch("/api/verify-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });
      if (!res.ok) throw new Error("Verification engine error");
      const data = (await res.json()) as Result;
      setResult(data);
    } catch (e: any) {
      setErr(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2 text-[13px]">
          <label className="text-ink-muted">Document type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-md border border-line bg-bg-elev px-2 py-1 text-[13px] text-ink outline-none"
          >
            <option value="receipt">Receipt</option>
            <option value="invoice">Invoice</option>
            <option value="land-title">Land title / indenture</option>
            <option value="bill-of-quantities">Bill of quantities</option>
            <option value="permit">Permit</option>
            <option value="delivery-note">Bill of lading / delivery note</option>
            <option value="bank-statement">Bank / MoMo statement</option>
            <option value="id">ID / KYC document</option>
          </select>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Describe the document — vendor, amount, signatures, stamps, anything that looks off. (For the live API, attach the file via the SDK; this demo accepts text.)"
          className="input resize-none"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[12px] text-ink-muted">
            <Upload className="h-3.5 w-3.5" /> File upload available in production
          </div>
          <button
            onClick={submit}
            disabled={loading || !text.trim()}
            className="btn btn-primary disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {loading ? "Analysing…" : "Run forensic verification"}
          </button>
        </div>

        <div className="mt-4 border-t border-line pt-3">
          <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Try an example</div>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setText(ex)}
                className="chip cursor-pointer hover:bg-bg-subtle"
              >
                {ex.slice(0, 38)}…
              </button>
            ))}
          </div>
        </div>
      </div>

      {err && <div className="rounded-lg border border-risk-high/30 bg-risk-high/5 p-3 text-[13px] text-risk-high">{err}</div>}

      {result && (
        <div className="card animate-slide-up overflow-hidden">
          <div
            className="flex items-center gap-3 border-b border-line p-5"
            style={{
              background:
                result.verdict === "verified"
                  ? "rgba(16,185,129,0.06)"
                  : result.verdict === "flagged"
                  ? "rgba(245,158,11,0.06)"
                  : "rgba(239,68,68,0.06)",
            }}
          >
            <div
              className="grid h-11 w-11 place-items-center rounded-xl"
              style={{
                background:
                  result.verdict === "verified"
                    ? "rgba(16,185,129,0.15)"
                    : "rgba(239,68,68,0.15)",
                color:
                  result.verdict === "verified" ? "#10b981" : result.verdict === "flagged" ? "#f59e0b" : "#ef4444",
              }}
            >
              {result.verdict === "verified" ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">Verdict</div>
              <div
                className="text-[18px] font-semibold capitalize"
                style={{
                  color:
                    result.verdict === "verified" ? "#10b981" : result.verdict === "flagged" ? "#f59e0b" : "#ef4444",
                }}
              >
                {result.verdict} · {result.score}% authenticity
              </div>
            </div>
            <div className="hidden text-right md:block">
              <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Doc hash</div>
              <div className="hash-mono">{result.hash}</div>
            </div>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Summary</div>
              <p className="text-[14px] text-ink">{result.summary}</p>
            </div>

            {result.flags.length > 0 && (
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Forensic flags</div>
                <ul className="space-y-1.5">
                  {result.flags.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-ink-dim">
                      <span className="mt-1 h-1 w-1 rounded-full bg-risk-high" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Forensic breakdown</div>
              <div className="grid gap-3 md:grid-cols-2">
                <Bar label="Font consistency" value={result.forensics.fontConsistency} invert={false} />
                <Bar label="Pixel tampering" value={result.forensics.pixelTampering} invert />
                <Bar label="AI-generated probability" value={result.forensics.aiGenerated} invert />
                <Bar label="Chain of custody" value={result.forensics.chainOfCustody} invert={false} />
              </div>
            </div>

            <div>
              <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Recommendation</div>
              <p className="text-[14px] text-ink-dim">{result.recommendation}</p>
            </div>

            <div className="flex items-center gap-2 border-t border-line pt-3">
              <Fingerprint className="h-3 w-3 text-ink-muted" />
              <span className="hash-mono">{result.hash}</span>
              <span className="ml-auto text-[11px] text-ink-muted">Anchored to your audit ledger</span>
            </div>
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
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
