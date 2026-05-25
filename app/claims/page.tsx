"use client";
import { useState } from "react";
import { ShieldPlus, Check, Clock, AlertTriangle, FileText, Banknote, Loader2 } from "lucide-react";

type Stage = "filed" | "evidence" | "review" | "decision" | "paid";

const CLAIMS = [
  {
    id: "CLM-2026-0148",
    project: "East Legon Hills Plot (2.5 acres)",
    type: "Title fraud / encroachment",
    filedAt: "2026-05-12",
    amountClaimed: 1_250_000,
    awarded: 1_087_500,
    deductible: 62_500,
    stage: "paid" as Stage,
    insurer: "GhanaWatch Reserve",
    timeline: [
      { ts: "2026-05-12", what: "Claim filed with sealed evidence pack" },
      { ts: "2026-05-14", what: "Adjuster Esi Ofori assigned" },
      { ts: "2026-05-19", what: "Trustee A. Yawson re-survey commissioned" },
      { ts: "2026-05-26", what: "Decision: in-favour-claimant (subject to deductible)" },
      { ts: "2026-05-29", what: "GHS 1,087,500 paid to claimant escrow account" },
    ],
  },
  {
    id: "CLM-2026-0152",
    project: "4-Bedroom Family Home, Kasoa",
    type: "Material diversion (inflated cement receipts)",
    filedAt: "2026-05-19",
    amountClaimed: 18_000,
    awarded: 0,
    deductible: 900,
    stage: "review" as Stage,
    insurer: "GhanaWatch Reserve",
    timeline: [
      { ts: "2026-05-19", what: "Claim filed" },
      { ts: "2026-05-22", what: "Forensic case → claim binding" },
      { ts: "2026-05-23", what: "Independent trustee site count requested" },
    ],
  },
];

const STAGES: { id: Stage; label: string }[] = [
  { id: "filed", label: "Filed" },
  { id: "evidence", label: "Evidence" },
  { id: "review", label: "Review" },
  { id: "decision", label: "Decision" },
  { id: "paid", label: "Paid" },
];

export default function ClaimsPage() {
  const [show, setShow] = useState(false);
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            <ShieldPlus className="h-3 w-3" /> Insurance claims
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">File a claim with one evidence pack.</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
            Because the platform already has every receipt, photo, ledger entry, and trustee
            report — claims close in days, not months. No adjuster runaround.
          </p>
        </div>
        <button onClick={() => setShow(true)} className="btn btn-primary">File a claim</button>
      </div>

      {show && <FileClaim onClose={() => setShow(false)} />}

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Kpi label="Open claims" value={`${CLAIMS.filter((c) => c.stage !== "paid").length}`} />
        <Kpi label="Resolved (YTD)" value="184" sub="68% paid out" />
        <Kpi label="Median time-to-decide" value="11 days" color="#10b981" />
        <Kpi label="Total paid (YTD)" value="GHS 41.2M" color="#f5b800" />
      </div>

      <div className="mt-8 space-y-5">
        {CLAIMS.map((c) => {
          const sIdx = STAGES.findIndex((s) => s.id === c.stage);
          return (
            <div key={c.id} className="card overflow-hidden">
              <div className="grid items-start gap-5 p-6 lg:grid-cols-[2fr_1fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip uppercase" style={{ color: c.stage === "paid" ? "#10b981" : "#f59e0b" }}>{c.stage}</span>
                    <span className="chip">{c.type}</span>
                    <span className="font-mono text-[11px] text-ink-muted">{c.id}</span>
                  </div>
                  <div className="mt-3 text-[16px] font-semibold">{c.project}</div>
                  <div className="mt-1 text-[12px] text-ink-dim">Filed {c.filedAt} · insurer {c.insurer}</div>

                  <div className="mt-5">
                    <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-ink-muted">Workflow</div>
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {STAGES.map((s, i) => (
                        <div key={s.id} className="flex shrink-0 items-center gap-1">
                          <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold ${i <= sIdx ? "bg-accent-gold text-bg" : "bg-bg-subtle text-ink-muted"}`}>{i + 1}</span>
                          <span className={i <= sIdx ? "text-ink text-[11px]" : "text-ink-muted text-[11px]"}>{s.label}</span>
                          {i < STAGES.length - 1 && <span className="h-px w-6 bg-line" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-bg-elev/40 p-4">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Amount</div>
                  <div className="text-[12px]">Claimed: <span className="font-semibold text-ink">GHS {c.amountClaimed.toLocaleString()}</span></div>
                  <div className="text-[12px]">Deductible: GHS {c.deductible.toLocaleString()}</div>
                  {c.awarded > 0 && (
                    <div className="mt-2 text-[18px] font-semibold text-accent-green">GHS {c.awarded.toLocaleString()} paid</div>
                  )}
                </div>
              </div>
              <div className="border-t border-line bg-bg-elev/40 px-6 py-4">
                <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-ink-muted">Timeline</div>
                <ol className="space-y-1.5 text-[12px]">
                  {c.timeline.map((t, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-3 w-3 text-ink-muted" />
                      <span className="font-mono text-[11px] text-ink-muted">{t.ts}</span>
                      <span className="text-ink">{t.what}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FileClaim({ onClose }: { onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  function submit() { setSubmitting(true); setTimeout(() => { setSubmitting(false); setDone(true); }, 1200); }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="card w-[min(560px,96vw)] p-6">
        {done ? (
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-green/15 text-accent-green"><Check className="h-5 w-5" /></div>
            <h3 className="mt-3 text-[18px] font-semibold">Claim filed</h3>
            <p className="mt-1 text-[12px] text-ink-dim">CLM-2026-0153 created. Adjuster assigned within 24h.</p>
            <button onClick={onClose} className="btn btn-primary mt-4">Done</button>
          </div>
        ) : (
          <>
            <div className="text-[16px] font-semibold">File an insurance claim</div>
            <div className="mt-4 space-y-3">
              <label className="block">
                <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Project</div>
                <select className="input">
                  <option>East Legon Hills Plot</option>
                  <option>4-Bedroom Family Home, Kasoa</option>
                  <option>Adum Cosmetics Shop</option>
                </select>
              </label>
              <label className="block">
                <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Loss type</div>
                <select className="input">
                  <option>Title fraud / encroachment</option>
                  <option>Material diversion</option>
                  <option>Vehicle substitution</option>
                  <option>Trustee malpractice</option>
                </select>
              </label>
              <label className="block">
                <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Amount claimed (GHS)</div>
                <input type="number" defaultValue={50000} className="input" />
              </label>
              <div className="rounded-md border border-accent-gold/30 bg-accent-gold/5 p-3 text-[11px] text-ink-dim">
                <FileText className="mr-1 inline h-3 w-3 text-accent-gold" />
                We'll auto-attach the project's sealed evidence pack. No additional paperwork needed.
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={onClose} className="btn btn-ghost">Cancel</button>
              <button onClick={submit} disabled={submitting} className="btn btn-primary disabled:opacity-40">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
                {submitting ? "Filing…" : "File claim"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, color }: any) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight" style={color ? { color } : {}}>{value}</div>
      {sub && <div className="text-[11px] text-ink-muted">{sub}</div>}
    </div>
  );
}
