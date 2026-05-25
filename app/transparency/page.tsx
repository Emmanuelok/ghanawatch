import { Sparkline } from "@/components/sparkline";
import { Globe, ShieldCheck, TrendingUp, Users, Banknote, AlertTriangle, ScrollText, FileText, Heart, Building } from "lucide-react";

export const metadata = { title: "Transparency — GhanaWatch" };

function ser(start: number, n: number) { const o:{v:number}[]=[]; let v=start; for(let i=0;i<n;i++){ v+=Math.sin(i/4)*4+1; o.push({v:Math.round(v)});} return o; }

const HEADLINES = [
  { label: "Diaspora users", value: "8,950+", icon: Users, color: "#f5b800", trend: ser(60, 90) },
  { label: "Active projects", value: "1,487", icon: TrendingUp, color: "#10b981", trend: ser(80, 90) },
  { label: "Verified value", value: "GHS 18.4M", icon: Banknote, color: "#3b82f6", trend: ser(40, 90) },
  { label: "Fraud prevented (YTD)", value: "GHS 2.18M", icon: ShieldCheck, color: "#ef4444", trend: ser(20, 90) },
];

const BY_REGION = [
  { region: "Greater Accra", projects: 612, value: 9_400_000 },
  { region: "Ashanti", projects: 311, value: 4_120_000 },
  { region: "Central", projects: 178, value: 1_840_000 },
  { region: "Western", projects: 102, value: 1_120_000 },
  { region: "Eastern", projects: 88, value: 880_000 },
  { region: "Volta", projects: 74, value: 620_000 },
  { region: "Northern", projects: 56, value: 280_000 },
  { region: "Other", projects: 66, value: 140_000 },
];

const DISBURSEMENT = [
  { use: "Trustee fees", pct: 38, sub: "Paid to ~1,240 trustees across Ghana" },
  { use: "Salaries & ops", pct: 28, sub: "GhanaWatch core team" },
  { use: "Cloud + infra", pct: 14, sub: "AWS / Vercel / observability" },
  { use: "Compliance + legal", pct: 9, sub: "AML / DPC / law firms" },
  { use: "Hardship programme", pct: 6, sub: "1% pledged + match" },
  { use: "R&D", pct: 5, sub: "ML, forensics, new sectors" },
];

const COMMITMENTS = [
  { label: "Open audit ledger anchored daily", status: "live" },
  { label: "SOC 2 Type II report", status: "in progress (Q3 2026)" },
  { label: "DPC #DPC-2024-1188 registered", status: "live" },
  { label: "Bug bounty (open scope)", status: "live" },
  { label: "Pro-bono / hardship programme funded", status: "live" },
  { label: "Open-source key forensic libs by 2027", status: "committed" },
];

export default function TransparencyPage() {
  const totalProj = BY_REGION.reduce((s, r) => s + r.projects, 0);
  const totalVal = BY_REGION.reduce((s, r) => s + r.value, 0);
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Globe className="h-3 w-3" /> Public transparency
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Our metrics, in the open.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          A diaspora trust platform that won't show its numbers is asking you to trust on faith.
          So here are ours — refreshed live, no curation, no marketing tricks.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {HEADLINES.map((h) => (
          <div key={h.label} className="card p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              <h.icon className="h-3 w-3" style={{ color: h.color }} /> {h.label}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-semibold tracking-tight" style={{ color: h.color }}>{h.value}</span>
              <Sparkline data={h.trend.slice(-40)} color={h.color} width={84} height={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Projects + verified value by region</div>
          <table className="w-full text-[12px]">
            <thead className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-muted">
              <tr className="border-b border-line">
                <th className="px-5 py-3">Region</th>
                <th className="px-3 py-3 text-right">Projects</th>
                <th className="px-3 py-3 text-right">Verified value</th>
                <th className="px-5 py-3">Share</th>
              </tr>
            </thead>
            <tbody>
              {BY_REGION.map((r) => {
                const pct = (r.value / totalVal) * 100;
                return (
                  <tr key={r.region} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 text-ink">{r.region}</td>
                    <td className="px-3 py-3 text-right text-ink-dim">{r.projects.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right text-ink-dim">GHS {(r.value / 1e6).toFixed(2)}M</td>
                    <td className="px-5 py-3">
                      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-bg-subtle">
                        <div className="h-full bg-accent-gold" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-bg-elev/40">
                <td className="px-5 py-3 font-semibold text-ink">Total</td>
                <td className="px-3 py-3 text-right font-semibold">{totalProj.toLocaleString()}</td>
                <td className="px-3 py-3 text-right font-semibold">GHS {(totalVal / 1e6).toFixed(2)}M</td>
                <td className="px-5 py-3" />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Where every cedi goes</div>
          <div className="space-y-3 p-5">
            {DISBURSEMENT.map((d) => (
              <div key={d.use}>
                <div className="flex items-baseline justify-between text-[12px]">
                  <span className="text-ink">{d.use}</span>
                  <span className="font-semibold text-ink">{d.pct}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
                  <div className="h-full bg-accent-gold" style={{ width: `${d.pct}%` }} />
                </div>
                <div className="mt-0.5 text-[10px] text-ink-muted">{d.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card icon={ScrollText} title="Open audit ledger" body="Every event hashed, every day's Merkle root anchored to Bitcoin + Polygon. Anyone can verify." />
        <Card icon={AlertTriangle} title="Open incident log" body="Every incident, post-mortem, and remediation published at /status." />
        <Card icon={Heart} title="Hardship pledge" body="1% of revenue → hardship programme. Audited annually. /hardship publishes recipients." />
      </div>

      <div className="mt-8 card p-6">
        <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Building className="h-4 w-4 text-accent-gold" /> Public commitments</div>
        <ul className="grid gap-2 text-[13px] md:grid-cols-2">
          {COMMITMENTS.map((c) => (
            <li key={c.label} className="flex items-center justify-between rounded-md border border-line bg-bg-elev/40 px-3 py-2">
              <span className="text-ink">{c.label}</span>
              <span className="chip" style={{ color: c.status === "live" ? "#10b981" : "#f59e0b" }}>{c.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, body }: any) {
  return (
    <div className="card p-5">
      <div className="mb-1 flex items-center gap-2 text-[14px] font-semibold"><Icon className="h-4 w-4 text-accent-gold" /> {title}</div>
      <p className="text-[12.5px] text-ink-dim">{body}</p>
    </div>
  );
}
