"use client";
import { useState } from "react";
import { Database, Upload, FileSpreadsheet, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";

const SOURCES = [
  { id: "excel", name: "Excel / Google Sheets", logo: "X", note: "Most common — export your tracking sheet" },
  { id: "drive", name: "Google Drive folder", logo: "G", note: "Receipts + photos in a single folder" },
  { id: "whatsapp", name: "WhatsApp chat export", logo: "W", note: "We parse the .zip from your phone" },
  { id: "csv", name: "Bank / MoMo statement", logo: "C", note: "PDF or CSV → transactions" },
];

const STEPS = ["Connect source", "Map fields", "Preview", "Import", "Verify"];

export default function MigrationPage() {
  const [source, setSource] = useState(SOURCES[0].id);
  const [step, setStep] = useState(0);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);

  function importIt() {
    setImporting(true);
    setTimeout(() => { setImporting(false); setDone(true); setStep(4); }, 1600);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Database className="h-3 w-3" /> Migrate from Excel / Drive / WhatsApp
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Bring your years of records in — once.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Most diaspora users have been tracking projects in Excel, Google Drive, or WhatsApp for
          years. Pull all of it in. We parse, structure, verify, and anchor every historical
          receipt + photo + transaction onto the GhanaWatch ledger.
        </p>
      </div>

      {/* Stepper */}
      <div className="mt-8 flex items-center gap-2 overflow-x-auto text-[11px]">
        {STEPS.map((s, i) => (
          <div key={s} className="flex shrink-0 items-center gap-2">
            <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold ${step >= i ? "bg-accent-gold text-bg" : "bg-bg-subtle text-ink-muted"}`}>{i + 1}</span>
            <span className={step >= i ? "text-ink" : "text-ink-muted"}>{s}</span>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-line" />}
          </div>
        ))}
      </div>

      <div className="mt-6 card p-6">
        {step === 0 && (
          <div>
            <div className="mb-4 text-[14px] font-semibold">Where are your records?</div>
            <div className="grid gap-3 md:grid-cols-2">
              {SOURCES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSource(s.id)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left ${source === s.id ? "border-accent-gold/60 bg-accent-gold/5" : "border-line bg-bg-elev/40 hover:border-line/70"}`}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-bg-elev text-[14px] font-bold">{s.logo}</div>
                  <div>
                    <div className="text-[13px] font-semibold">{s.name}</div>
                    <div className="text-[11px] text-ink-dim">{s.note}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-xl border-2 border-dashed border-line bg-bg-elev/40 p-8 text-center text-[12px] text-ink-dim">
              <Upload className="mx-auto mb-2 h-6 w-6 text-ink-muted" />
              Drop your file or folder here
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setStep(1)} className="btn btn-primary">Continue <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Sparkles className="h-4 w-4 text-accent-gold" /> AI-suggested field mapping</div>
            <p className="text-[12px] text-ink-dim">We've auto-mapped your Excel columns. Override anything we got wrong.</p>
            <div className="mt-4 space-y-2 text-[12px]">
              {[
                ["Column A: 'Date'", "GhanaWatch: transaction_date"],
                ["Column B: 'Vendor / Person'", "GhanaWatch: vendor or counterparty"],
                ["Column C: 'Amount (GH₵)'", "GhanaWatch: amount_ghs"],
                ["Column D: 'For what?'", "GhanaWatch: purpose"],
                ["Column E: 'Notes'", "GhanaWatch: notes"],
                ["Column F: 'Receipt photo?'", "GhanaWatch: receipt_attached"],
              ].map(([from, to]) => (
                <div key={from} className="flex items-center gap-3 rounded-md border border-line bg-bg-elev/40 p-3">
                  <span className="flex-1 text-ink">{from}</span>
                  <ArrowRight className="h-3 w-3 text-ink-muted" />
                  <span className="flex-1 font-mono text-accent-gold">{to}</span>
                  <Check className="h-3.5 w-3.5 text-accent-green" />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setStep(0)} className="btn btn-ghost">Back</button>
              <button onClick={() => setStep(2)} className="btn btn-primary">Preview <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-3 text-[14px] font-semibold">Preview · 412 rows · 87 receipts · 64 photos</div>
            <div className="rounded-md border border-line bg-bg-elev/40 p-3">
              <table className="w-full text-[11px]">
                <thead className="text-left text-[10px] uppercase text-ink-muted">
                  <tr><th className="pb-2">Date</th><th className="pb-2">Vendor</th><th className="pb-2">Amount</th><th className="pb-2">Purpose</th><th className="pb-2">Attachment</th></tr>
                </thead>
                <tbody>
                  {[
                    ["2024-03-12", "Diamond Cement", "GHS 14,400", "Cement for foundation", "📷 receipt-12.jpg"],
                    ["2024-03-18", "Architect Mensimah", "GHS 6,000", "BOQ revision 2", "📄 boq-rev2.pdf"],
                    ["2024-04-02", "Aluworks", "GHS 28,750", "Roofing sheets", "📷 invoice-aluworks.png"],
                    ["2024-04-10", "Mason team", "GHS 3,800", "Week-4 labour", "—"],
                    ["…", "…", "…", "…", "+ 408 more"],
                  ].map((r, i) => (
                    <tr key={i} className="border-t border-line">
                      {r.map((c, j) => <td key={j} className="py-2 text-ink-dim">{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setStep(1)} className="btn btn-ghost">Back</button>
              <button onClick={() => { setStep(3); importIt(); }} className="btn btn-primary">Import all <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid place-items-center py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent-gold" />
            <div className="mt-3 text-[14px] font-semibold">Importing + verifying…</div>
            <div className="mt-1 text-[12px] text-ink-dim">412 rows · 87 receipts running through forensics · 64 photos hash-anchored</div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="grid place-items-center py-6 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-accent-green/15 text-accent-green"><Check className="h-5 w-5" /></div>
              <div className="mt-3 text-[18px] font-semibold">Import complete</div>
            </div>
            <div className="grid gap-3 md:grid-cols-3 mt-4">
              <Card label="Records imported" value="412" sub="across 5 historical projects" />
              <Card label="Receipts verified" value="84/87" sub="3 flagged for manual review" />
              <Card label="Photos anchored" value="64" sub="all hashed to ledger" />
            </div>
            <div className="mt-5 rounded-md border border-accent-gold/30 bg-accent-gold/5 p-4 text-[12px] text-ink-dim">
              <strong className="text-ink">Heads-up:</strong> 3 historical receipts came back at &lt;70% authenticity (cement from "Diamond Cement" on plain paper — these were from 2022, before you knew). Want us to walk you through whether you have recourse?
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ label, value, sub }: any) {
  return (
    <div className="rounded-xl border border-line bg-bg-elev/40 p-4 text-center">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-[10px] text-ink-muted">{sub}</div>
    </div>
  );
}
