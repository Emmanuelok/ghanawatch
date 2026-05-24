import { Download, FileText, ScrollText, Globe, Banknote, ShieldCheck, Calendar, TrendingUp } from "lucide-react";

export const metadata = { title: "Reports library — GhanaWatch" };

const REPORTS = [
  { id: "r-1", cat: "personal", title: "Q1 2026 portfolio statement (Akosua Mensah)", desc: "All projects, ledger excerpts, milestones, fees — court-citable.", date: "2026-04-01", pages: 22, icon: ScrollText, color: "#f5b800" },
  { id: "r-2", cat: "personal", title: "2025 year-end tax summary (Canada-resident)", desc: "Form for CRA — foreign-asset disclosure, escrow holdings, fraud losses claimable.", date: "2026-01-31", pages: 8, icon: Banknote, color: "#10b981" },
  { id: "r-3", cat: "personal", title: "East Legon Hills — sealed evidence pack", desc: "Title-overlap case dossier with full hash chain, ready for Police Land Fraud Unit.", date: "2026-05-08", pages: 41, icon: ShieldCheck, color: "#ef4444" },
  { id: "r-4", cat: "personal", title: "Kasoa 4-bed — milestone audit report", desc: "Independent QS sign-off on M1-M4.", date: "2026-02-28", pages: 15, icon: FileText, color: "#3b82f6" },
  { id: "r-5", cat: "industry", title: "State of Ghanaian Diaspora Fraud 2026", desc: "Annual fraud-pattern report. 47 patterns documented, regional heat, year-on-year shifts.", date: "2026-03-15", pages: 64, icon: Globe, color: "#8b5cf6" },
  { id: "r-6", cat: "industry", title: "Construction cost benchmarks — Q2 2026", desc: "Material, labour, customs across 16 regions with p10/p50/p90 bands.", date: "2026-04-15", pages: 32, icon: TrendingUp, color: "#f5b800" },
  { id: "r-7", cat: "industry", title: "Title fraud in Greater Accra — 5-year analysis", desc: "Cluster mapping, vendor reputation drift, court-record cross-referenced.", date: "2026-02-01", pages: 48, icon: Globe, color: "#ef4444" },
  { id: "r-8", cat: "regulatory", title: "FIC quarterly SAR submission summary", desc: "What we filed last quarter, redacted.", date: "2026-04-30", pages: 12, icon: ShieldCheck, color: "#10b981" },
  { id: "r-9", cat: "regulatory", title: "Data Protection — quarterly DPC return", desc: "Personal data inventory, breach log, retention compliance.", date: "2026-04-15", pages: 6, icon: ShieldCheck, color: "#3b82f6" },
  { id: "r-10", cat: "regulatory", title: "Trust account reconciliation — Stanbic", desc: "Daily escrow balance vs ledger; auditor-signed.", date: "2026-05-01", pages: 28, icon: Banknote, color: "#10b981" },
];

const CATS = [
  { id: "personal", label: "Personal" },
  { id: "industry", label: "Industry" },
  { id: "regulatory", label: "Regulatory" },
];

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <ScrollText className="h-3 w-3" /> Reports library
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Pre-built reports — yours, the industry's, the regulator's.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Generated and signed by GhanaWatch. Use them for your own filings, share with your
          accountant or lawyer, hand to police or regulators. Every report is hash-anchored.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {CATS.map((c) => {
          const list = REPORTS.filter((r) => r.cat === c.id);
          return (
            <div key={c.id}>
              <div className="mb-3 text-[14px] font-semibold">{c.label} <span className="text-[11px] text-ink-muted">({list.length})</span></div>
              <div className="space-y-3">
                {list.map((r) => {
                  const I = r.icon;
                  return (
                    <div key={r.id} className="card p-5">
                      <div className="flex items-start gap-3">
                        <div
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-md"
                          style={{ background: `${r.color}15`, border: `1px solid ${r.color}30` }}
                        >
                          <I className="h-4 w-4" style={{ color: r.color }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13.5px] font-semibold">{r.title}</div>
                          <div className="mt-1 text-[11.5px] text-ink-dim">{r.desc}</div>
                          <div className="mt-3 flex items-center justify-between text-[10px] text-ink-muted">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {r.date}</span>
                            <span>{r.pages} pages</span>
                          </div>
                        </div>
                      </div>
                      <button className="btn btn-primary mt-3 w-full justify-center text-[12px] py-1.5">
                        <Download className="h-3.5 w-3.5" /> Download PDF
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
