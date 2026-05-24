import Link from "next/link";
import { Car, Building2, Calculator, ArrowRight, Banknote, Receipt } from "lucide-react";

export const metadata = { title: "Tools — GhanaWatch" };

const tools = [
  {
    href: "/tools/vehicle-duty",
    title: "Vehicle Import Duty Calculator",
    desc: "Estimate GRA duty + VAT + clearing for a vehicle import, before your agent quotes you.",
    icon: Car,
    color: "#3b82f6",
  },
  {
    href: "/benchmarks",
    title: "Market Rate Benchmarks",
    desc: "Median + p10/p90 rates for materials, labour, customs, funeral, medical, education.",
    icon: Receipt,
    color: "#f5b800",
  },
  {
    href: "/verify",
    title: "Document Forensics",
    desc: "AI vision + descriptor analysis of any document (receipt, indenture, BoL, bill).",
    icon: Building2,
    color: "#10b981",
  },
  {
    href: "/ledger",
    title: "Ledger Explorer",
    desc: "Browse and verify every event on the immutable audit chain.",
    icon: Banknote,
    color: "#8b5cf6",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Calculator className="h-3 w-3" /> Tools
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Calculators & forensic tools</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">Standalone utilities you can use even without an active project on the platform.</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="card card-hover flex items-start gap-4 p-6">
            <div
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg"
              style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}
            >
              <t.icon className="h-5 w-5" style={{ color: t.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold">{t.title}</div>
              <p className="mt-1 text-[13px] text-ink-dim">{t.desc}</p>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 text-ink-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
