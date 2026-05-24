import {
  Banknote,
  Landmark,
  Globe2,
  CheckCircle2,
  TrendingUp,
  ScrollText,
  Users,
  ShieldCheck,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Sparkline } from "@/components/sparkline";

export const metadata = { title: "Diaspora Bond — GhanaWatch" };

const BONDS = [
  {
    id: "bond-2026-A",
    issuer: "Government of Ghana",
    name: "Ghana Diaspora Infrastructure Bond — Series A 2026",
    target: 250_000_000,
    raised: 187_400_000,
    coupon: 9.5,
    tenor: "5 years",
    currency: "USD",
    status: "open",
    closes: "2026-09-30",
    backedProjects: 412,
    investors: 6_180,
  },
  {
    id: "bond-2025-M",
    issuer: "Accra Metropolitan Assembly",
    name: "AMA Diaspora Sanitation Bond 2025",
    target: 40_000_000,
    raised: 40_000_000,
    coupon: 8.25,
    tenor: "3 years",
    currency: "GHS",
    status: "fully-subscribed",
    closes: "2025-12-15",
    backedProjects: 64,
    investors: 1_240,
  },
];

const PROJECT_POOL = [
  { sector: "Road infrastructure", count: 184, verifiedGHS: 78_400_000 },
  { sector: "Educational facilities", count: 98, verifiedGHS: 41_200_000 },
  { sector: "Health facilities", count: 64, verifiedGHS: 38_600_000 },
  { sector: "Affordable housing", count: 41, verifiedGHS: 18_100_000 },
  { sector: "Agricultural value-chain", count: 25, verifiedGHS: 11_100_000 },
];

const HOLDERS_BY_COUNTRY = [
  { c: "United States", flag: "🇺🇸", count: 1_840 },
  { c: "United Kingdom", flag: "🇬🇧", count: 1_220 },
  { c: "Canada", flag: "🇨🇦", count: 810 },
  { c: "Germany", flag: "🇩🇪", count: 540 },
  { c: "Italy", flag: "🇮🇹", count: 420 },
  { c: "Netherlands", flag: "🇳🇱", count: 310 },
  { c: "Australia", flag: "🇦🇺", count: 240 },
  { c: "Others (40+)", flag: "🌍", count: 800 },
];

function series(start: number) {
  let v = start; const out: { v: number }[] = [];
  for (let i = 0; i < 40; i++) { v += Math.sin(i / 3) * 1.5 + 1.6; out.push({ v: Math.round(v) }); }
  return out;
}

export default function DiasporaBondPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Landmark className="h-3 w-3" /> Sovereign / municipal module
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Diaspora bond programme</h1>
        <p className="mt-1 max-w-3xl text-[14px] text-ink-dim">
          For sovereigns and municipal authorities issuing diaspora bonds backed by GhanaWatch-
          verified projects. Every cedi an investor commits is anchored to a project pool that's
          continuously trustee-verified, document-forensiced, and audit-chained — turning the
          diaspora's structural mistrust into priced confidence.
        </p>
      </div>

      {/* Active bond hero */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.25)" }}>
              <CheckCircle2 className="h-3 w-3" /> open
            </span>
            <span className="chip">issuer · {BONDS[0].issuer}</span>
            <span className="chip">closes {BONDS[0].closes}</span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">{BONDS[0].name}</h2>
          <div className="mt-2 text-[13px] text-ink-dim">
            5-year bullet, semi-annual coupon, USD-denominated. Each investor's principal is allocated across the verified-project pool below.
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <Stat label="Coupon" value={`${BONDS[0].coupon}%`} sub="semi-annual" color="#f5b800" />
            <Stat label="Tenor" value={BONDS[0].tenor} sub="bullet" />
            <Stat label="Min subscription" value="USD 500" sub="step USD 100" />
            <Stat label="Currency" value={BONDS[0].currency} sub="primary" />
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between text-[12px] text-ink-dim">
              <span>USD {BONDS[0].raised.toLocaleString()} raised</span>
              <span className="text-ink">of USD {BONDS[0].target.toLocaleString()} target</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-bg-subtle">
              <div className="h-full rounded-full bg-gradient-to-r from-accent-gold to-accent-green" style={{ width: `${(BONDS[0].raised / BONDS[0].target) * 100}%` }} />
            </div>
            <div className="mt-1 text-[11px] text-ink-muted">{((BONDS[0].raised / BONDS[0].target) * 100).toFixed(1)}% subscribed · {BONDS[0].investors.toLocaleString()} investors · {BONDS[0].backedProjects} verified projects in the pool</div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button className="btn btn-primary"><Banknote className="h-4 w-4" /> Subscribe (KYC required)</button>
            <button className="btn btn-ghost"><ScrollText className="h-4 w-4" /> Download term sheet</button>
            <button className="btn btn-ghost"><Globe2 className="h-4 w-4" /> Read prospectus</button>
          </div>
        </div>

        <div className="card p-5">
          <div className="text-[14px] font-semibold">Issuer assurances</div>
          <ul className="mt-3 space-y-2 text-[12px] text-ink-dim">
            <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> SEC-GH registered offering (No. SD/2026/0118)</li>
            <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Bank of Ghana cleared payment corridor</li>
            <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Underlying project pool 100% trustee-verified at issuance</li>
            <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> GhanaWatch ledger anchored as the issuer's evidence of works</li>
            <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Independent SOE auditor (KPMG Ghana)</li>
            <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> First-loss fund (USD 12.5M) backstops verified-fraud claims</li>
          </ul>
        </div>
      </div>

      {/* Pool composition + holder mix */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Underlying verified-project pool</div>
          <div className="divide-y divide-line">
            {PROJECT_POOL.map((p) => (
              <div key={p.sector} className="grid items-center gap-3 px-5 py-3 md:grid-cols-[1fr_120px_120px]">
                <div className="text-[13px] text-ink">{p.sector}</div>
                <div className="text-[12px] text-ink-dim">{p.count} projects</div>
                <div className="text-right text-[13px] text-ink">GHS {(p.verifiedGHS / 1e6).toFixed(1)}M</div>
              </div>
            ))}
            <div className="bg-bg-elev/40 px-5 py-3 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Total verified GHS in pool</span>
                <span className="font-semibold text-ink">GHS {(PROJECT_POOL.reduce((s, p) => s + p.verifiedGHS, 0) / 1e6).toFixed(1)}M</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Investor holders by country</div>
          <div className="divide-y divide-line">
            {HOLDERS_BY_COUNTRY.map((h) => (
              <div key={h.c} className="grid items-center gap-3 px-5 py-2.5 md:grid-cols-[28px_1fr_auto]">
                <span className="text-[18px]">{h.flag}</span>
                <span className="text-[13px] text-ink">{h.c}</span>
                <span className="text-[12px] text-ink-dim">{h.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Past issuance + redemption trail */}
      <div className="mt-6 card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Past & ongoing issuances</div>
        <table className="w-full text-[12px]">
          <thead className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            <tr className="border-b border-line">
              <th className="px-5 py-3">Bond ID</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Coupon</th>
              <th className="px-3 py-3">Tenor</th>
              <th className="px-3 py-3">Subscribed</th>
              <th className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {BONDS.map((b) => (
              <tr key={b.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3 font-mono text-ink">{b.id}</td>
                <td className="px-3 py-3 text-ink">{b.name}</td>
                <td className="px-3 py-3 text-ink">{b.coupon}%</td>
                <td className="px-3 py-3 text-ink-dim">{b.tenor}</td>
                <td className="px-3 py-3">
                  <div className="text-[11px] text-ink">
                    {b.currency} {b.raised.toLocaleString()} / {b.target.toLocaleString()}
                  </div>
                  <div className="mt-1 h-1 w-32 overflow-hidden rounded-full bg-bg-subtle">
                    <div className="h-full" style={{ width: `${(b.raised / b.target) * 100}%`, background: "#f5b800" }} />
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <span
                    className="chip capitalize"
                    style={{
                      color: b.status === "open" ? "#10b981" : "#3b82f6",
                    }}
                  >
                    {b.status.replace(/-/g, " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border border-line bg-bg-elev/40 p-6 md:grid-cols-3">
        <Block icon={Users} title="Built for sovereign / municipal issuers" body="Ghana's diaspora sends ~$7.79B home yearly — that's a deeper capital pool than most issuance programmes reach. With verified-project anchoring, the implied risk premium falls and the diaspora actually buys." />
        <Block icon={TrendingUp} title="Cheaper than Eurobonds, deeper than retail" body="Diaspora bonds historically trade 150-300 bps tighter than equivalent sovereign Eurobonds when anchored to credible verification. We provide that anchor." />
        <Block icon={Calendar} title="Continuous evidence" body="Every quarter the issuer gets a signed report on each backed project's progress; investors see anonymised pool-level updates." />
      </div>
    </div>
  );
}

function Stat({ label, value, sub, color }: any) {
  return (
    <div className="rounded-md border border-line bg-bg-elev/40 p-3">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      <div className="mt-1 text-[18px] font-semibold" style={{ color: color || "#e8eaf0" }}>{value}</div>
      {sub && <div className="text-[10px] text-ink-muted">{sub}</div>}
    </div>
  );
}

function Block({ icon: Icon, title, body }: any) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent-gold" />
        <div className="text-[14px] font-semibold">{title}</div>
      </div>
      <p className="text-[12px] text-ink-dim">{body}</p>
    </div>
  );
}
