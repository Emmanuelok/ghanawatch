import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Banknote,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Download,
  FileSearch,
  Building2,
} from "lucide-react";
import { Sparkline } from "@/components/sparkline";

export const metadata = { title: "Compliance Dashboard — GhanaWatch" };

const KYC_BY_LEVEL = [
  { level: "Basic", count: 4_120, color: "#9aa0b0" },
  { level: "Enhanced", count: 3_980, color: "#f5b800" },
  { level: "Regulated", count: 850, color: "#10b981" },
];

const SARS = [
  { id: "SAR-2026-0438", ts: "2026-05-22T14:11Z", subject: "Nana Yaw B.", reason: "Title overlap pattern — 3 East Legon Hills cases ", status: "filed-with-fic", amountGHS: 1_250_000 },
  { id: "SAR-2026-0439", ts: "2026-05-23T09:02Z", subject: "Vendor: Adum Trade Stalls Ltd.", reason: "Duplicate-receipt cluster across 5 diaspora users", status: "draft", amountGHS: 384_000 },
  { id: "SAR-2026-0440", ts: "2026-05-23T17:48Z", subject: "Clearing agent CG-9981", reason: "Last-minute penalty pattern with non-GRA receipts", status: "filed-with-fic", amountGHS: 162_000 },
  { id: "SAR-2026-0441", ts: "2026-05-24T07:10Z", subject: "Nii Agyemang (stool elder)", reason: "Cluster of disputed indentures 2023-2025", status: "investigating", amountGHS: 4_180_000 },
];

const AML_HITS = [
  { ts: "2026-05-23", flag: "PEP match — UK list (low confidence)", outcome: "false-positive", reviewer: "Ama Sarpong" },
  { ts: "2026-05-22", flag: "OFAC SDN secondary match", outcome: "false-positive", reviewer: "Kwesi Adjei" },
  { ts: "2026-05-20", flag: "Adverse media — Ghana case 2018", outcome: "escalated", reviewer: "Ama Sarpong" },
];

const REGULATORS = [
  { name: "Financial Intelligence Centre (FIC)", id: "FIC-GH", role: "SARs / STRs filing", status: "active" },
  { name: "Bank of Ghana", id: "BoG", role: "Payment service compliance", status: "active" },
  { name: "Securities & Exchange Commission", id: "SEC-GH", role: "Diaspora bond compliance", status: "active" },
  { name: "Data Protection Commission", id: "DPC", role: "DPA registration #DPC-2024-1188", status: "active" },
  { name: "Ghana Police Service — Land Fraud Unit", id: "GPS-LFU", role: "Criminal escalation", status: "active" },
  { name: "FATF (corresponding)", id: "FATF", role: "International AML alignment", status: "active" },
];

function trendSeries(start: number, days = 30): { v: number }[] {
  const out = []; let v = start;
  for (let i = 0; i < days; i++) { v += Math.sin(i / 2) * 4 + 1; out.push({ v: Math.round(v) }); }
  return out;
}

export default function CompliancePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Building2 className="h-3 w-3" /> Compliance · Institutional view
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Regulator dashboard</h1>
        <p className="mt-1 max-w-3xl text-[14px] text-ink-dim">
          The view for banks, MTOs, the FIC, the Bank of Ghana, and partner regulators. KYC
          throughput, AML hit rate, SAR/STR queue, audit log access, and regulator coordination —
          all in one place.
        </p>
      </div>

      {/* KPIs */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Kpi label="KYC verifications (30d)" value="8,950" sub="+12% MoM" up trend={trendSeries(120)} color="#f5b800" />
        <Kpi label="AML / sanctions hits" value="38" sub="3 escalated · 35 false-pos" color="#ef4444" trend={trendSeries(25)} />
        <Kpi label="SARs filed (YTD)" value="184" sub="GHS 41.2M flagged" color="#3b82f6" trend={trendSeries(40)} />
        <Kpi label="Median KYC time" value="3m 41s" sub="↓ 8s vs last week" down color="#10b981" trend={trendSeries(80).reverse()} />
      </div>

      {/* KYC mix */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="text-[14px] font-semibold">KYC tier distribution</div>
          <div className="mt-2 text-[11px] text-ink-dim">Verifications across all diaspora users on the platform</div>
          <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-bg-subtle">
            {KYC_BY_LEVEL.map((l) => (
              <div key={l.level} style={{ background: l.color, width: `${(l.count / KYC_BY_LEVEL.reduce((s, x) => s + x.count, 0)) * 100}%` }} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {KYC_BY_LEVEL.map((l) => (
              <div key={l.level}>
                <div className="text-[22px] font-semibold" style={{ color: l.color }}>{l.count.toLocaleString()}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{l.level}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <div className="text-[14px] font-semibold">Sanctions watchlists synced</div>
          <ul className="mt-3 space-y-1.5 text-[12px]">
            {["OFAC SDN", "UN Consolidated", "UK HMT", "EU CFSP", "FATF", "PEP global", "Ghana sanctions index"].map((w) => (
              <li key={w} className="flex items-center gap-2 text-ink-dim"><CheckCircle2 className="h-3.5 w-3.5 text-accent-green" /> {w}</li>
            ))}
          </ul>
          <div className="mt-3 border-t border-line pt-3 text-[11px] text-ink-muted">Last sync: 4 minutes ago</div>
        </div>
      </div>

      {/* SARs queue */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div>
            <div className="flex items-center gap-2 text-[14px] font-semibold"><FileSearch className="h-4 w-4 text-accent-gold" /> Suspicious Activity Reports (SARs)</div>
            <div className="text-[11px] text-ink-dim">Filed with the Financial Intelligence Centre (FIC-GH) under the AML Act 2020 (Act 1044)</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip">{SARS.length} this week</span>
            <button className="btn btn-ghost text-[12px] py-1.5"><Download className="h-3.5 w-3.5" /> Export CSV</button>
          </div>
        </div>
        <table className="w-full text-[12px]">
          <thead className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            <tr className="border-b border-line">
              <th className="px-5 py-3">SAR ID</th>
              <th className="px-3 py-3">When</th>
              <th className="px-3 py-3">Subject</th>
              <th className="px-3 py-3">Reason</th>
              <th className="px-3 py-3">Flagged (GHS)</th>
              <th className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {SARS.map((s) => (
              <tr key={s.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3 font-mono text-ink">{s.id}</td>
                <td className="px-3 py-3 text-ink-dim">{s.ts.slice(0, 10)}</td>
                <td className="px-3 py-3 text-ink">{s.subject}</td>
                <td className="px-3 py-3 text-ink-dim">{s.reason}</td>
                <td className="px-3 py-3 text-ink">{s.amountGHS.toLocaleString()}</td>
                <td className="px-5 py-3 text-right">
                  <span
                    className="chip capitalize"
                    style={{
                      color:
                        s.status === "filed-with-fic" ? "#10b981" :
                        s.status === "investigating" ? "#f59e0b" : "#9aa0b0",
                    }}
                  >
                    {s.status.replace(/-/g, " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AML hits + Regulators */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">AML watchlist hits (last 30 days)</div>
          <div className="divide-y divide-line">
            {AML_HITS.map((h, i) => (
              <div key={i} className="grid items-center gap-3 px-5 py-3 md:grid-cols-[110px_1fr_auto_auto]">
                <span className="text-[11px] text-ink-muted">{h.ts}</span>
                <span className="text-[12px] text-ink">{h.flag}</span>
                <span
                  className="chip capitalize"
                  style={{ color: h.outcome === "false-positive" ? "#10b981" : "#f59e0b" }}
                >
                  {h.outcome.replace("-", " ")}
                </span>
                <span className="text-[11px] text-ink-muted">{h.reviewer}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Regulator coordination</div>
          <div className="divide-y divide-line">
            {REGULATORS.map((r) => (
              <div key={r.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] text-ink">{r.name}</div>
                  <span className="chip" style={{ color: "#10b981" }}><CheckCircle2 className="h-3 w-3" /> active</span>
                </div>
                <div className="mt-0.5 text-[11px] text-ink-muted">{r.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer compliance disclosures */}
      <div className="mt-8 card p-6">
        <div className="text-[14px] font-semibold">Standards & disclosures</div>
        <ul className="mt-3 grid gap-2 text-[12px] text-ink-dim md:grid-cols-2">
          <li>· Anti-Money Laundering Act 2020 (Act 1044) — registered reporting entity</li>
          <li>· Data Protection Act 2012 (Act 843) — DPC #DPC-2024-1188</li>
          <li>· Financial Sector Conduct Act 2024 — adopted</li>
          <li>· Cybersecurity Act 2020 (Act 1038) — CERT-GH liaison</li>
          <li>· SOC 2 Type II — in progress (target Q3 2026)</li>
          <li>· ISO 27001 — in progress (target Q4 2026)</li>
        </ul>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, up, down, color = "#f5b800", trend }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
        {up && <TrendingUp className="h-3.5 w-3.5 text-accent-green" />}
        {down && <TrendingDown className="h-3.5 w-3.5 text-accent-green" />}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <div>
          <div className="text-[22px] font-semibold tracking-tight">{value}</div>
          <div className="mt-0.5 text-[11px] text-ink-dim">{sub}</div>
        </div>
        {trend && <Sparkline data={trend} color={color} width={84} height={28} />}
      </div>
    </div>
  );
}
