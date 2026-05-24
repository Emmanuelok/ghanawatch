import Link from "next/link";
import {
  LayoutGrid,
  Banknote,
  TrendingUp,
  Users,
  ShieldCheck,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { PROJECTS } from "@/lib/mock-data";
import { Sparkline } from "@/components/sparkline";

export const metadata = { title: "Portfolios — GhanaWatch" };

const PORTFOLIOS = [
  { id: "p-family", name: "Family wealth (Mensah)", desc: "Your individual + jointly-held projects", filter: (p: any) => ["kasoa-4bed", "korle-bu-care"].includes(p.id), owner: "Akosua Mensah", role: "Owner" },
  { id: "p-east-legon", name: "East Legon Hills Pool", desc: "8-member hometown association co-investment", filter: (p: any) => ["east-legon-plot"].includes(p.id), owner: "Akosua Mensah", role: "Member" },
  { id: "p-business", name: "Business ventures", desc: "Cosmetics shop + future stalls", filter: (p: any) => ["kumasi-shop"].includes(p.id), owner: "Akosua Mensah", role: "Co-investor" },
  { id: "p-civic", name: "Civic & community", desc: "Vehicle import + funeral support", filter: (p: any) => ["tema-civic", "takoradi-funeral"].includes(p.id), owner: "Akosua Mensah", role: "Co-signer" },
];

export default function PortfoliosPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            <LayoutGrid className="h-3 w-3" /> Portfolios
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Group projects into portfolios.</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
            For diaspora users who run multiple ventures or sit across family pools. Each portfolio
            rolls up its own KPIs, ledger view, and risk profile — and you can grant access
            per-portfolio (e.g. give your accountant view-only on the business portfolio without
            exposing the family wealth one).
          </p>
        </div>
        <button className="btn btn-primary"><Plus className="h-4 w-4" /> New portfolio</button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {PORTFOLIOS.map((pf) => {
          const items = PROJECTS.filter(pf.filter);
          const totalBudget = items.reduce((s, i) => s + i.budgetGHS, 0);
          const totalSpent = items.reduce((s, i) => s + i.spentGHS, 0);
          const avgTrust = items.length ? Math.round(items.reduce((s, i) => s + i.trustScore, 0) / items.length) : 0;
          const avgRisk = items.length ? Math.round(items.reduce((s, i) => s + i.riskScore, 0) / items.length) : 0;
          const alerts = items.reduce((s, i) => s + i.alerts, 0);
          // Aggregate trust history (sum/N) — simple average
          const len = items[0]?.trustHistory.length ?? 0;
          const blended = Array.from({ length: len }, (_, ix) => ({
            v: Math.round(items.reduce((s, p) => s + (p.trustHistory[ix]?.v ?? 0), 0) / Math.max(1, items.length)),
          }));

          return (
            <div key={pf.id} className="card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[16px] font-semibold">{pf.name}</div>
                    <div className="text-[12px] text-ink-dim">{pf.desc}</div>
                  </div>
                  <span className="chip">{pf.role}</span>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-3 text-center">
                  <Stat label="Projects" value={`${items.length}`} />
                  <Stat label="Tracked" value={`GHS ${(totalBudget / 1000).toFixed(0)}K`} />
                  <Stat label="Trust" value={`${avgTrust}`} color="#10b981" />
                  <Stat label="Risk" value={`${avgRisk}`} color={avgRisk > 60 ? "#ef4444" : avgRisk > 40 ? "#f59e0b" : "#10b981"} />
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-baseline justify-between text-[11px] text-ink-muted">
                    <span>Blended trust history</span>
                    {alerts > 0 && (
                      <span className="flex items-center gap-1 text-risk-high">
                        <AlertTriangle className="h-3 w-3" /> {alerts} alerts
                      </span>
                    )}
                  </div>
                  <Sparkline data={blended} color="#10b981" width={420} height={36} />
                </div>

                <div className="mt-4 grid gap-1.5 border-t border-line pt-3 text-[12px]">
                  {items.map((i) => (
                    <Link key={i.id} href={`/projects/${i.id}`} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-bg-elev">
                      <span className="text-ink">{i.name}</span>
                      <span className="flex items-center gap-2 text-[11px] text-ink-muted">
                        {i.alerts > 0 && <span className="chip risk-high text-[10px]">{i.alerts}</span>}
                        <span>GHS {(i.spentGHS / 1000).toFixed(0)}K · {i.progress}%</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 card p-6">
        <div className="flex items-center gap-2 text-[14px] font-semibold"><Users className="h-4 w-4 text-accent-gold" /> Per-portfolio access (role-based)</div>
        <p className="mt-2 text-[13px] text-ink-dim">
          Invite accountants, lawyers, hometown-association leaders to specific portfolios only —
          they see what's relevant to them without seeing the rest.
        </p>
        <div className="mt-4 grid gap-2 text-[12px] text-ink-dim md:grid-cols-3">
          <Row k="Accountant" v="business portfolio only · read-only" />
          <Row k="Family lawyer" v="family wealth + civic · read + write" />
          <Row k="Hometown chair" v="East Legon Pool · admin" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-md border border-line bg-bg-elev/40 p-2">
      <div className="text-[14px] font-semibold" style={{ color: color || "#e8eaf0" }}>{value}</div>
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-line bg-bg-elev/40 p-3">
      <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">{k}</div>
      <div className="mt-1 text-ink">{v}</div>
    </div>
  );
}
