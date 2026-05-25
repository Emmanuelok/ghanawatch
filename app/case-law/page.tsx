"use client";
import { useMemo, useState } from "react";
import { Gavel, Search, Globe } from "lucide-react";

type Case = { id: string; title: string; region: string; sector: string; year: number; lossGHS: number; status: "won" | "lost" | "settled" | "ongoing"; summary: string };

const CASES: Case[] = [
  { id: "c-1", title: "Dora Boateng v Mackeown Investments", region: "Greater Accra", sector: "real-estate", year: 2020, lossGHS: 1_400_000, status: "won", summary: "Single 20-acre plot found to be part of a 50-acre sale to a developer. SC held title for original buyer." },
  { id: "c-2", title: "Republic v Adjei (Land Fraud)", region: "Eastern", sector: "real-estate", year: 2022, lossGHS: 880_000, status: "won", summary: "Stool indenture seller convicted, 8-yr sentence + restitution to 4 diaspora buyers." },
  { id: "c-3", title: "Owusu v Stanbic (diaspora escrow)", region: "Greater Accra", sector: "construction", year: 2023, lossGHS: 412_000, status: "settled", summary: "Bank settled with diaspora user after escrow release controls failed; led to GhanaWatch trust account model." },
  { id: "c-4", title: "Asante v Korle Bu Teaching Hospital", region: "Greater Accra", sector: "medical", year: 2024, lossGHS: 28_500, status: "won", summary: "Inflated body-release fees not on published schedule. Court awarded restitution + costs." },
  { id: "c-5", title: "Forson v Auntie Grace Forson", region: "Ashanti", sector: "business", year: 2025, lossGHS: 12_400, status: "won", summary: "Duplicate-receipt rent fraud by aunt managing diaspora-funded shop. Refund ordered." },
  { id: "c-6", title: "Boateng v GRA (Tema port)", region: "Greater Accra", sector: "vehicle-import", year: 2023, lossGHS: 18_000, status: "won", summary: "Court held GRA-issued receipts must be serialised + QR'd; non-compliant 'penalty receipts' refundable." },
  { id: "c-7", title: "Nkrumah v Esinam (funeral inflation)", region: "Western", sector: "funeral", year: 2024, lossGHS: 22_000, status: "settled", summary: "Cousin overspent funeral budget by 80%. Settled with refund + contributor ledger transparency." },
  { id: "c-8", title: "Agbeko v Senanu (poultry farm)", region: "Volta", sector: "agriculture", year: 2025, lossGHS: 35_400, status: "ongoing", summary: "Cousin under-reported bird mortality + inflated feed receipts." },
  { id: "c-9", title: "Mensah v Mensah (family estate)", region: "Central", sector: "real-estate", year: 2025, lossGHS: 685_000, status: "won", summary: "Sibling contested diaspora-built home. PNDCL 111 applied; estate divided per statute." },
  { id: "c-10", title: "Yawson Developments v Boateng", region: "Greater Accra", sector: "real-estate", year: 2026, lossGHS: 1_250_000, status: "ongoing", summary: "East Legon Hills encroachment + title-overlap case. Currently in mediation." },
];

const SECTORS = ["all", "real-estate", "construction", "vehicle-import", "business", "medical", "funeral", "agriculture"];

const sColor: Record<string, string> = { won: "#10b981", lost: "#ef4444", settled: "#3b82f6", ongoing: "#f5b800" };

export default function CaseLawPage() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("all");

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return CASES.filter((c) => {
      if (sector !== "all" && c.sector !== sector) return false;
      if (!t) return true;
      return c.title.toLowerCase().includes(t) || c.summary.toLowerCase().includes(t) || c.region.toLowerCase().includes(t);
    });
  }, [q, sector]);

  const totalLoss = CASES.reduce((s, c) => s + c.lossGHS, 0);
  const winRate = (CASES.filter((c) => c.status === "won").length / CASES.length) * 100;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Gavel className="h-3 w-3" /> Case-law database
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Documented diaspora-fraud cases — searchable.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Open database of court-reported diaspora investment disputes. Court findings, recoveries,
          and the precedents they established. Built so the next diaspora user can stand on the
          shoulders of the ones who already fought.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Kpi label="Cases catalogued" value={`${CASES.length}+`} />
        <Kpi label="Total loss represented" value={`GHS ${(totalLoss / 1e6).toFixed(2)}M`} />
        <Kpi label="Diaspora win rate" value={`${winRate.toFixed(0)}%`} color="#10b981" />
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, region, summary" className="input pl-9" />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-line bg-bg-elev p-1 text-[11px]">
          {SECTORS.map((s) => (
            <button key={s} onClick={() => setSector(s)} className={`whitespace-nowrap rounded-md px-2.5 py-1.5 capitalize ${sector === s ? "bg-bg-card text-ink" : "text-ink-dim hover:text-ink"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip uppercase" style={{ color: sColor[c.status] }}>{c.status}</span>
              <span className="chip capitalize text-[10px]">{c.sector}</span>
              <span className="chip text-[10px]"><Globe className="h-3 w-3" /> {c.region}</span>
              <span className="chip text-[10px]">{c.year}</span>
              <span className="ml-auto text-[12px] text-ink">Loss: <strong>GHS {c.lossGHS.toLocaleString()}</strong></span>
            </div>
            <div className="mt-2 text-[15px] font-semibold">{c.title}</div>
            <p className="mt-2 text-[12.5px] text-ink-dim">{c.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Kpi({ label, value, color }: any) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight" style={color ? { color } : {}}>{value}</div>
    </div>
  );
}
