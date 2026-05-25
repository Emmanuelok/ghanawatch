import { TrendingUp, AlertTriangle, Lightbulb, Calendar, Globe } from "lucide-react";
import { TimeSeries } from "@/components/timeseries";

export const metadata = { title: "Fraud forecasting — GhanaWatch" };

function ser(name: string, base: number, vol: number, drift: number, days = 90) {
  const data: { d: string; v: number }[] = [];
  let v = base;
  const start = new Date("2026-02-23").getTime();
  for (let i = 0; i < days; i++) {
    v += Math.sin(i / 4) * vol + drift + (Math.random() - 0.5) * vol * 0.4;
    data.push({ d: new Date(start + i * 86400000).toISOString().slice(0, 10), v: Math.max(0, Math.round(v)) });
  }
  return { name, color: "#f5b800", data };
}

// 90 past + 90 forecast
const PAST_HISTORICAL = ser("Historical signals", 38, 4, 0.18);
const FORECAST = {
  name: "AI 90-day forecast",
  color: "#ef4444",
  data: (() => {
    const data: { d: string; v: number }[] = [];
    let v = PAST_HISTORICAL.data[PAST_HISTORICAL.data.length - 1].v;
    const start = new Date(PAST_HISTORICAL.data[PAST_HISTORICAL.data.length - 1].d).getTime() + 86400000;
    for (let i = 0; i < 90; i++) {
      v += Math.sin(i / 5) * 5 + 0.6;
      data.push({ d: new Date(start + i * 86400000).toISOString().slice(0, 10), v: Math.max(0, Math.round(v)) });
    }
    return data;
  })(),
};

const PROJECTIONS = [
  { region: "Greater Accra", current: 612, projected: 738, dir: "up", driver: "East Legon Hills indenture cluster expanding to Adjiringanor estates", confidence: "high" },
  { region: "Ashanti", current: 311, projected: 348, dir: "up", driver: "Adum vendor-fraud cluster — duplicate-receipt pattern", confidence: "medium" },
  { region: "Western", current: 102, projected: 98, dir: "down", driver: "Funeral inflation campaign of 2025 has cooled", confidence: "medium" },
  { region: "Northern", current: 56, projected: 84, dir: "up", driver: "SHS-fee forgery pattern detected by 2 hometown rooms", confidence: "high" },
];

const HOTSPOTS = [
  { name: "Lands Commission look-alike emails", growth: "+44%", actions: "Push email-forensics module to all UK + US users; warn via WhatsApp." },
  { name: "Tema port duty-uplift pattern", growth: "+18%", actions: "GRA partnership: deeper API integration on duty receipt verification." },
  { name: "Mortuary fee inflation (Western)", growth: "−12%", actions: "Hometown association awareness has tamed this." },
];

export default function ForecastingPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <TrendingUp className="h-3 w-3" /> AI fraud-trend forecasting
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Where the fraud goes next — projected 90 days.</h1>
        <p className="mt-1 max-w-3xl text-[14px] text-ink-dim">
          The platform's collective intelligence projects the next 90 days of fraud activity by
          pattern, region, and sector. Useful for prioritising trustee bench capacity, planning
          partner outreach, and getting in front of patterns before they reach the next victim.
        </p>
      </div>

      <div className="mt-8 card p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-[14px] font-semibold">Network fraud signals — 180 days</div>
            <div className="text-[11px] text-ink-dim">90 days historical + 90-day AI forecast (dashed gradient region)</div>
          </div>
          <span className="chip"><TrendingUp className="h-3 w-3 text-risk-high" /> projected +24% by mid-August</span>
        </div>
        <TimeSeries
          height={220}
          yMin={0}
          yMax={90}
          series={[
            { ...PAST_HISTORICAL, name: "Historical (last 90d)", color: "#10b981" },
            FORECAST,
          ]}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Regional projections (next 90d)</div>
          <table className="w-full text-[12px]">
            <thead className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-muted">
              <tr className="border-b border-line">
                <th className="px-5 py-3">Region</th>
                <th className="px-3 py-3">Current cases</th>
                <th className="px-3 py-3">Projected</th>
                <th className="px-3 py-3">Driver</th>
                <th className="px-5 py-3 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {PROJECTIONS.map((p) => {
                const colour = p.dir === "up" ? "#ef4444" : "#10b981";
                return (
                  <tr key={p.region} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 text-ink">{p.region}</td>
                    <td className="px-3 py-3 text-ink-dim">{p.current}</td>
                    <td className="px-3 py-3 font-semibold" style={{ color: colour }}>
                      {p.projected} ({p.dir === "up" ? "+" : ""}{Math.round(((p.projected - p.current) / p.current) * 100)}%)
                    </td>
                    <td className="px-3 py-3 text-ink-dim">{p.driver}</td>
                    <td className="px-5 py-3 text-right text-[11px] capitalize" style={{ color: p.confidence === "high" ? "#10b981" : "#f59e0b" }}>{p.confidence}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          {HOTSPOTS.map((h) => (
            <div key={h.name} className="card p-5">
              <div className="flex items-center justify-between text-[14px] font-semibold">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-accent-gold" />
                  {h.name}
                </div>
                <span className="chip" style={{ color: h.growth.startsWith("+") ? "#ef4444" : "#10b981" }}>{h.growth}</span>
              </div>
              <p className="mt-2 text-[12px] text-ink-dim"><Lightbulb className="mr-1 inline h-3 w-3 text-accent-gold" /> {h.actions}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 card p-6">
        <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><Calendar className="h-4 w-4 text-accent-gold" /> Recommended platform actions for Q3 2026</div>
        <ul className="space-y-2 text-[13px] text-ink-dim">
          <li>· <strong className="text-ink">Trustee bench expansion:</strong> add 18 trustees in Greater Accra to absorb projected East Legon load.</li>
          <li>· <strong className="text-ink">Push email-forensics module</strong> to all UK + US users via in-app banner + email.</li>
          <li>· <strong className="text-ink">Joint advisory</strong> with Lands Commission on the Nii Agyemang cluster — protect the next-3-victims.</li>
          <li>· <strong className="text-ink">Education-sector watchlist:</strong> auto-watch all SHS fee uploads from Tamale corridor for the next 60 days.</li>
        </ul>
      </div>
    </div>
  );
}
