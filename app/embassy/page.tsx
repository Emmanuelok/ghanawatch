"use client";
import { useState, useMemo } from "react";
import {
  Globe,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Search,
  Users,
  MapPin,
} from "lucide-react";

type EmbassyCase = {
  id: string;
  citizen: string;
  passport: string;
  embassy: string;
  flag: string;
  projectName: string;
  region: string;
  amountGHS: number;
  raisedAt: string;
  severity: "low" | "med" | "high" | "critical";
  status: "open" | "investigating" | "escalated" | "resolved";
  assistanceOfficer: string;
  summary: string;
};

const CASES: EmbassyCase[] = [
  { id: "EC-2026-0188", citizen: "Nana Yaw Boateng", passport: "GBR 524118832", embassy: "British High Commission, Accra", flag: "🇬🇧", projectName: "East Legon Hills Plot", region: "Greater Accra", amountGHS: 1_250_000, raisedAt: "2026-05-08", severity: "critical", status: "investigating", assistanceOfficer: "Sarah Holloway", summary: "Title overlap detected by GhanaWatch + on-site encroachment. Citizen requests Embassy support for civil claim." },
  { id: "EC-2026-0192", citizen: "Akosua Mensah", passport: "CAN AB448211", embassy: "High Commission of Canada, Accra", flag: "🇨🇦", projectName: "4-Bedroom Family Home, Kasoa", region: "Central", amountGHS: 412_000, raisedAt: "2026-05-12", severity: "high", status: "open", assistanceOfficer: "Mathieu Tremblay", summary: "Receipt forensics + off-site photo cluster. Citizen requests guidance on next steps." },
  { id: "EC-2026-0195", citizen: "Esi Forson", passport: "DEU C0193228", embassy: "Embassy of Germany, Accra", flag: "🇩🇪", projectName: "Adum Cosmetics Shop", region: "Ashanti", amountGHS: 96_500, raisedAt: "2026-05-19", severity: "med", status: "open", assistanceOfficer: "Klaus Mertens", summary: "Duplicate-receipt fraud pattern. Citizen wants Embassy attestation for future legal action." },
  { id: "EC-2026-0198", citizen: "Kojo Asare", passport: "AUS N4118022", embassy: "Australian High Commission, Accra", flag: "🇦🇺", projectName: "Korle Bu Surgery Care", region: "Greater Accra", amountGHS: 31_200, raisedAt: "2026-05-21", severity: "low", status: "resolved", assistanceOfficer: "Helen Carmichael", summary: "Body-release inflation flagged early; resolved with hospital social work. Closed." },
  { id: "EC-2026-0199", citizen: "Mawuli Agbeko", passport: "USA 558019127", embassy: "Embassy of the United States, Accra", flag: "🇺🇸", projectName: "Ho Poultry Farm", region: "Volta", amountGHS: 18_400, raisedAt: "2026-05-22", severity: "low", status: "open", assistanceOfficer: "James Okonkwo", summary: "Feed supplier overcharge flagged. Citizen requests connection with MoFA extension officer." },
];

const EMBASSIES = [
  { name: "British High Commission", flag: "🇬🇧", cases: 38, citizens: 1_220, citizenshipPool: "GBR" },
  { name: "U.S. Embassy", flag: "🇺🇸", cases: 41, citizens: 1_840, citizenshipPool: "USA" },
  { name: "High Commission of Canada", flag: "🇨🇦", cases: 24, citizens: 810, citizenshipPool: "CAN" },
  { name: "Embassy of Germany", flag: "🇩🇪", cases: 14, citizens: 540, citizenshipPool: "DEU" },
  { name: "Embassy of Italy", flag: "🇮🇹", cases: 11, citizens: 420, citizenshipPool: "ITA" },
  { name: "Embassy of the Netherlands", flag: "🇳🇱", cases: 7, citizens: 310, citizenshipPool: "NLD" },
  { name: "Australian High Commission", flag: "🇦🇺", cases: 8, citizens: 240, citizenshipPool: "AUS" },
];

const sevColor = { critical: "#ef4444", high: "#f59e0b", med: "#3b82f6", low: "#9aa0b0" } as const;
const statusColor = { open: "#f59e0b", investigating: "#8b5cf6", escalated: "#ef4444", resolved: "#10b981" } as const;

export default function EmbassyPage() {
  const [filterEmbassy, setFilterEmbassy] = useState<string>("all");
  const [filterSev, setFilterSev] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return CASES.filter((c) => {
      if (filterEmbassy !== "all" && c.embassy.indexOf(filterEmbassy) < 0) return false;
      if (filterSev !== "all" && c.severity !== filterSev) return false;
      if (q && !`${c.citizen} ${c.passport} ${c.projectName}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [filterEmbassy, filterSev, q]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Globe className="h-3 w-3" /> Embassy desk
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Diaspora fraud assistance — Embassy view</h1>
        <p className="mt-1 max-w-3xl text-[14px] text-ink-dim">
          The view for embassies and high commissions in Accra. When one of your citizens is caught
          in a diaspora-investment fraud case, this is the desk you work from — case queue, signed
          evidence packs ready for consular use, bilateral coordination with Ghanaian authorities.
        </p>
      </div>

      {/* Embassy partners */}
      <div className="mt-8 grid gap-3 md:grid-cols-3 lg:grid-cols-4">
        {EMBASSIES.map((e) => (
          <button
            key={e.name}
            onClick={() => setFilterEmbassy(filterEmbassy === e.citizenshipPool ? "all" : e.citizenshipPool)}
            className={`card card-hover p-4 text-left ${
              filterEmbassy === e.citizenshipPool ? "border-accent-gold/60" : ""
            }`}
          >
            <div className="flex items-center gap-2 text-[18px]">{e.flag}</div>
            <div className="mt-1 text-[13px] font-semibold">{e.name}</div>
            <div className="mt-1 text-[11px] text-ink-dim">{e.citizens.toLocaleString()} verified citizens</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">open cases</span>
              <span className="text-[16px] font-semibold text-accent-gold">{e.cases}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search citizen, passport, project…"
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-bg-elev p-1 text-[12px]">
          {["all", "critical", "high", "med", "low"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterSev(s)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 capitalize ${
                filterSev === s ? "bg-bg-card text-ink" : "text-ink-dim hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Case queue */}
      <div className="mt-6 card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[12px] text-ink-muted">
          Showing {filtered.length} cases
        </div>
        <div className="divide-y divide-line">
          {filtered.map((c) => (
            <div key={c.id} className="grid items-start gap-3 px-5 py-4 md:grid-cols-[40px_1fr_auto]">
              <span className="text-[24px]">{c.flag}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="chip uppercase tracking-wider"
                    style={{ color: sevColor[c.severity], borderColor: `${sevColor[c.severity]}30`, background: `${sevColor[c.severity]}10` }}
                  >
                    {c.severity}
                  </span>
                  <span
                    className="chip capitalize"
                    style={{ color: statusColor[c.status] }}
                  >
                    {c.status}
                  </span>
                  <span className="font-mono text-[11px] text-ink-muted">{c.id}</span>
                </div>
                <div className="mt-2 text-[14px] font-semibold">
                  {c.citizen} <span className="text-ink-dim font-normal">— passport {c.passport}</span>
                </div>
                <div className="mt-0.5 text-[12px] text-ink-dim">
                  {c.embassy} · officer: <span className="text-ink">{c.assistanceOfficer}</span>
                </div>
                <p className="mt-2 max-w-2xl text-[12.5px] text-ink-dim">{c.summary}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.region}</span>
                  <span>·</span>
                  <span>Project: {c.projectName}</span>
                  <span>·</span>
                  <span>Raised: {c.raisedAt}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[18px] font-semibold tracking-tight" style={{ color: sevColor[c.severity] }}>
                  GHS {c.amountGHS.toLocaleString()}
                </div>
                <div className="mt-2 flex gap-1">
                  <button className="btn btn-ghost text-[11px] py-1.5"><Phone className="h-3 w-3" /> Call citizen</button>
                  <button className="btn btn-primary text-[11px] py-1.5"><ArrowUpRight className="h-3 w-3" /> Open case</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bilateral coordination */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold">
            <Users className="h-4 w-4 text-accent-gold" /> Bilateral coordination
          </div>
          <p className="text-[13px] text-ink-dim">
            Active coordination channels with Ghanaian authorities for consular assistance and joint
            investigations:
          </p>
          <ul className="mt-3 space-y-2 text-[12px] text-ink-dim">
            <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" /> Ghana Police Service — Land Fraud Unit (24h response)</li>
            <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" /> Economic & Organised Crime Office (EOCO)</li>
            <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" /> Lands Commission — caveat & investigation desk</li>
            <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" /> Financial Intelligence Centre (FIC)</li>
            <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" /> Ministry of Foreign Affairs — diaspora liaison</li>
          </ul>
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold">
            <Mail className="h-4 w-4 text-accent-gold" /> Embassy assistance contacts
          </div>
          <p className="text-[13px] text-ink-dim">
            GhanaWatch maintains a dedicated consular-assistance hotline + email channel per embassy
            for time-sensitive cases. Average response under 4h Mon-Fri.
          </p>
          <ul className="mt-3 space-y-2 text-[12px] text-ink-dim">
            <li>· Dedicated consular line: +233 30 (assigned per embassy)</li>
            <li>· Encrypted email channel via S/MIME</li>
            <li>· Signed PDF evidence pack delivery within 1h on request</li>
            <li>· Live AI-Investigator briefing on demand</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
