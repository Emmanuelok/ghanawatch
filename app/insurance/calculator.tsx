"use client";
import { useMemo, useState } from "react";
import { Check, ShieldPlus, Sparkles } from "lucide-react";
import { PROJECTS } from "@/lib/mock-data";

const SECTOR_RATE: Record<string, number> = {
  construction: 0.038,
  "real-estate": 0.062,
  "vehicle-import": 0.024,
  business: 0.034,
  medical: 0.018,
  funeral: 0.028,
  agriculture: 0.026,
  education: 0.012,
  remittance: 0.022,
};

export function InsuranceCalculator() {
  const [projectId, setProjectId] = useState(PROJECTS[1].id);
  const [coverageGHS, setCoverageGHS] = useState(500_000);
  const [hasTrusteeDispatch, setHasTrusteeDispatch] = useState(true);
  const [hasFamilyCosigner, setHasFamilyCosigner] = useState(true);
  const [escrowOnly, setEscrowOnly] = useState(true);
  const [region, setRegion] = useState("Greater Accra");
  const [sector, setSector] = useState("real-estate");

  const project = PROJECTS.find((p) => p.id === projectId);

  // When a project is chosen, sync sector/region
  function pickProject(id: string) {
    setProjectId(id);
    const p = PROJECTS.find((p) => p.id === id);
    if (p) {
      setSector(p.sector);
      setRegion(p.region);
      setCoverageGHS(Math.min(p.budgetGHS, 5_000_000));
    }
  }

  const quote = useMemo(() => {
    const base = SECTOR_RATE[sector] ?? 0.03;
    let multiplier = 1;
    if (project) {
      // Risk pricing: higher risk score → higher premium
      multiplier = 0.6 + (project.riskScore / 100) * 1.2;
    }
    // Discounts
    let discount = 0;
    if (hasTrusteeDispatch) discount += 0.18;
    if (hasFamilyCosigner) discount += 0.12;
    if (escrowOnly) discount += 0.20;
    const effective = base * multiplier * (1 - Math.min(0.45, discount));
    const premium = Math.round(effective * coverageGHS);
    const deductible = Math.round(coverageGHS * 0.05);
    return {
      baseRate: base,
      multiplier,
      discount,
      effective,
      premium,
      coverage: coverageGHS,
      deductible,
    };
  }, [sector, project, hasTrusteeDispatch, hasFamilyCosigner, escrowOnly, coverageGHS]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold">
          <Sparkles className="h-4 w-4 text-accent-gold" /> Quote configuration
        </div>
        <div className="space-y-3">
          <Field label="Project">
            <select value={projectId} onChange={(e) => pickProject(e.target.value)} className="input">
              {PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — risk {p.riskScore}</option>
              ))}
            </select>
          </Field>
          <Field label="Sector">
            <select value={sector} onChange={(e) => setSector(e.target.value)} className="input">
              {Object.keys(SECTOR_RATE).map((k) => (
                <option key={k} value={k}>{k} — base {(SECTOR_RATE[k] * 100).toFixed(2)}%</option>
              ))}
            </select>
          </Field>
          <Field label={`Coverage cap: GHS ${coverageGHS.toLocaleString()}`}>
            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={coverageGHS}
              onChange={(e) => setCoverageGHS(Number(e.target.value))}
              className="w-full"
            />
          </Field>

          <div className="mt-3 space-y-2 border-t border-line pt-3">
            <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Risk reducers</div>
            <Toggle label="Trustee dispatch at every milestone (−18%)" checked={hasTrusteeDispatch} onChange={setHasTrusteeDispatch} />
            <Toggle label="Family co-signer / next of kin (−12%)" checked={hasFamilyCosigner} onChange={setHasFamilyCosigner} />
            <Toggle label="Funds held in milestone escrow only (−20%)" checked={escrowOnly} onChange={setEscrowOnly} />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-1 flex items-center gap-2 text-[14px] font-semibold">
          <ShieldPlus className="h-4 w-4 text-accent-gold" /> Annual quote
        </div>
        <div className="text-[11px] text-ink-dim">Underwritten by the GhanaWatch Reserve</div>

        <div className="mt-5 rounded-xl border border-accent-gold/30 bg-accent-gold/5 p-5 text-center">
          <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Annual premium</div>
          <div className="mt-1 text-4xl font-semibold tracking-tight text-accent-gold">
            GHS {quote.premium.toLocaleString()}
          </div>
          <div className="mt-1 text-[12px] text-ink-dim">
            ≈ GHS {Math.round(quote.premium / 12).toLocaleString()}/month
          </div>
        </div>

        <div className="mt-5 space-y-2 rounded-md border border-line bg-bg-elev/40 p-4 text-[12px]">
          <Row k="Coverage cap" v={`GHS ${quote.coverage.toLocaleString()}`} />
          <Row k="Deductible (5%)" v={`GHS ${quote.deductible.toLocaleString()}`} />
          <Row k="Base sector rate" v={`${(quote.baseRate * 100).toFixed(2)}%`} />
          <Row k="Risk multiplier" v={`×${quote.multiplier.toFixed(2)}`} />
          <Row k="Discounts applied" v={`−${(Math.min(0.45, quote.discount) * 100).toFixed(0)}%`} />
          <Row k="Effective rate" v={`${(quote.effective * 100).toFixed(3)}%`} highlight />
        </div>

        <div className="mt-4 space-y-1.5 text-[12px]">
          <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">What's covered</div>
          <Bullet>Title forgery, double-sale, ghost construction</Bullet>
          <Bullet>Material diversion confirmed by forensic case</Bullet>
          <Bullet>Vehicle import substitution / customs fraud</Bullet>
          <Bullet>Trustee or counterparty malpractice</Bullet>
        </div>
        <div className="mt-3 space-y-1.5 text-[12px]">
          <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Not covered</div>
          <BulletX>Acts of God (flood, fire, civil unrest) — buy separately</BulletX>
          <BulletX>Currency devaluation or market loss</BulletX>
          <BulletX>Off-platform side payments</BulletX>
        </div>

        <button className="btn btn-primary mt-5 w-full justify-center">Bind coverage</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-md border border-line bg-bg-elev/40 px-3 py-2 text-[12px]">
      <span className="text-ink">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-amber-500" />
    </label>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ink-muted">{k}</span>
      <span className={highlight ? "font-semibold text-accent-gold" : "text-ink"}>{v}</span>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return <div className="flex items-start gap-2 text-ink-dim"><Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-green" /><span>{children}</span></div>;
}

function BulletX({ children }: { children: React.ReactNode }) {
  return <div className="flex items-start gap-2 text-ink-dim"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-risk-high" /><span>{children}</span></div>;
}
