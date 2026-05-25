import Link from "next/link";
import {
  Home,
  Car,
  Briefcase,
  Wheat,
  HeartPulse,
  Banknote,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export const metadata = { title: "Asset registry — GhanaWatch" };

const ASSETS = [
  { id: "a-1", name: "4-Bedroom Family Home, Kasoa", category: "real-estate", subtype: "Residential", region: "Central", acquired: "2025-08-14", valueGHS: 685_000, currentValueGHS: 750_000, status: "under construction", verifier: "Trustee K. Owusu", projectId: "kasoa-4bed", icon: Home },
  { id: "a-2", name: "East Legon Hills Plot (2.5 acres)", category: "real-estate", subtype: "Land", region: "Greater Accra", acquired: "2025-04-02", valueGHS: 1_250_000, currentValueGHS: 1_080_000, status: "disputed title", verifier: "Survy. Akua Yawson", projectId: "east-legon-plot", icon: Home },
  { id: "a-3", name: "Honda Civic Hybrid (2019)", category: "vehicle", subtype: "Passenger car", region: "Greater Accra", acquired: "2026-02-04", valueGHS: 95_000, currentValueGHS: 92_000, status: "active", verifier: "Customs CG-2148", projectId: "tema-civic", icon: Car },
  { id: "a-4", name: "Adum Cosmetics Shop (75% stake)", category: "business", subtype: "Retail", region: "Ashanti", acquired: "2025-11-01", valueGHS: 142_000, currentValueGHS: 158_000, status: "operating", verifier: "Trustee audit Q1", projectId: "kumasi-shop", icon: Briefcase },
  { id: "a-5", name: "1,200-Bird Poultry Operation, Ho", category: "agriculture", subtype: "Poultry", region: "Volta", acquired: "2026-01-20", valueGHS: 78_000, currentValueGHS: 84_000, status: "operating", verifier: "MoFA F. Adeli", projectId: "ho-poultry", icon: Wheat },
  { id: "a-6", name: "Stanbic GHS escrow trust", category: "financial", subtype: "Cash equivalent", region: "Greater Accra", acquired: "2025-08-10", valueGHS: 412_000, currentValueGHS: 412_000, status: "in escrow", verifier: "Stanbic monthly recon", icon: Banknote },
  { id: "a-7", name: "GhanaWatch Diaspora Bond (USDC)", category: "financial", subtype: "Fixed income", region: "Sovereign", acquired: "2026-04-10", valueGHS: 47_000, currentValueGHS: 48_500, status: "Series A 2026", verifier: "SEC-GH SD/2026/0118", icon: Banknote },
];

const totals = ASSETS.reduce(
  (a, x) => ({
    cost: a.cost + x.valueGHS,
    now: a.now + x.currentValueGHS,
  }),
  { cost: 0, now: 0 },
);

export default function AssetsPage() {
  const byCat: Record<string, typeof ASSETS> = {};
  for (const a of ASSETS) (byCat[a.category] ??= []).push(a);

  const delta = totals.now - totals.cost;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Briefcase className="h-3 w-3" /> Asset registry
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Every cedi-asset you own back home.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          A continuously-updated register of every cedi-denominated asset you hold in Ghana —
          property, land, vehicles, businesses, agricultural operations, escrow holdings, bonds.
          Each line independently verified, with cost basis, current value, and the named verifier.
          The thing your accountant, lawyer, and next-of-kin will all thank you for.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Kpi label="Total assets" value={`${ASSETS.length}`} />
        <Kpi label="Cost basis" value={`GHS ${(totals.cost / 1e6).toFixed(2)}M`} />
        <Kpi label="Current value" value={`GHS ${(totals.now / 1e6).toFixed(2)}M`} color={delta >= 0 ? "#10b981" : "#ef4444"} />
        <Kpi label="Mark-to-market" value={`${delta >= 0 ? "+" : ""}GHS ${(delta / 1000).toFixed(0)}K`} icon={delta >= 0 ? TrendingUp : TrendingDown} color={delta >= 0 ? "#10b981" : "#ef4444"} sub={`${((delta / totals.cost) * 100).toFixed(1)}%`} />
      </div>

      <div className="mt-8 space-y-6">
        {Object.entries(byCat).map(([cat, list]) => {
          const sum = list.reduce((s, a) => s + a.currentValueGHS, 0);
          return (
            <section key={cat}>
              <div className="mb-3 flex items-baseline justify-between">
                <div className="text-[14px] font-semibold capitalize">{cat.replace("-", " ")} <span className="text-[11px] text-ink-muted">({list.length})</span></div>
                <div className="text-[12px] text-ink-dim">GHS {sum.toLocaleString()}</div>
              </div>
              <div className="card overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                    <tr className="border-b border-line">
                      <th className="px-5 py-3">Asset</th>
                      <th className="px-3 py-3">Region</th>
                      <th className="px-3 py-3">Acquired</th>
                      <th className="px-3 py-3 text-right">Cost</th>
                      <th className="px-3 py-3 text-right">Current</th>
                      <th className="px-3 py-3">Verifier</th>
                      <th className="px-5 py-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((a) => {
                      const I = a.icon;
                      const aDelta = a.currentValueGHS - a.valueGHS;
                      return (
                        <tr key={a.id} className="border-b border-line last:border-0">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-bg-elev"><I className="h-3.5 w-3.5 text-accent-gold" /></div>
                              <div>
                                <div className="text-[13px] font-semibold text-ink">{a.name}</div>
                                <div className="text-[10px] text-ink-muted">{a.subtype} · status: {a.status}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-ink-dim">{a.region}</td>
                          <td className="px-3 py-3 text-ink-dim">{a.acquired}</td>
                          <td className="px-3 py-3 text-right text-ink-dim">GHS {a.valueGHS.toLocaleString()}</td>
                          <td className="px-3 py-3 text-right">
                            <div className="text-ink">GHS {a.currentValueGHS.toLocaleString()}</div>
                            <div className="text-[10px]" style={{ color: aDelta >= 0 ? "#10b981" : "#ef4444" }}>
                              {aDelta >= 0 ? "+" : ""}{((aDelta / a.valueGHS) * 100).toFixed(1)}%
                            </div>
                          </td>
                          <td className="px-3 py-3 text-[11px] text-ink-dim">
                            <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-accent-green" /> {a.verifier}</span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            {a.projectId && (
                              <Link href={`/projects/${a.projectId}`} className="btn btn-ghost text-[11px] py-1.5">
                                Open <ExternalLink className="h-3 w-3" />
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, icon: Icon, color }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        <span>{label}</span>
        {Icon && <Icon className="h-3.5 w-3.5" style={{ color }} />}
      </div>
      <div className="mt-2 text-xl font-semibold tracking-tight" style={color ? { color } : {}}>{value}</div>
      {sub && <div className="text-[11px] text-ink-muted">{sub}</div>}
    </div>
  );
}
