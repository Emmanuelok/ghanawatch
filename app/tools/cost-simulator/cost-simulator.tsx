"use client";
import { useMemo, useState } from "react";
import { Calculator, Home, Hammer } from "lucide-react";

type Finish = "basic" | "mid" | "premium";
const FINISH_MULT: Record<Finish, number> = { basic: 0.85, mid: 1.0, premium: 1.45 };

const REGION_MULT: Record<string, number> = {
  "Greater Accra": 1.15,
  "Ashanti": 1.0,
  "Central": 0.95,
  "Eastern": 0.95,
  "Western": 0.95,
  "Volta": 0.9,
  "Northern": 0.85,
  "Upper East": 0.82,
  "Upper West": 0.82,
  "Bono": 0.9,
};

const BASE_PER_SQM = 2_650; // GHS per sq m for a standard 1-storey, mid-finish in Ashanti baseline

export function CostSimulator() {
  const [storeys, setStoreys] = useState(1);
  const [bedrooms, setBedrooms] = useState(3);
  const [sqm, setSqm] = useState(220);
  const [finish, setFinish] = useState<Finish>("mid");
  const [region, setRegion] = useState("Greater Accra");
  const [land, setLand] = useState(85_000);
  const [pro, setPro] = useState(0.08);
  const [contingency, setContingency] = useState(0.10);

  const res = useMemo(() => {
    const storeyMult = storeys === 1 ? 1 : storeys === 2 ? 1.65 : 2.3;
    const constructionPerSqm = BASE_PER_SQM * FINISH_MULT[finish] * REGION_MULT[region];
    const construction = constructionPerSqm * sqm * storeyMult;
    const professional = construction * pro;
    const cont = (construction + professional) * contingency;
    const total = land + construction + professional + cont;

    const breakdown = [
      { name: "Substructure & foundation", pct: 0.12 },
      { name: "Walls & lintels (blockwork)", pct: 0.14 },
      { name: "Decking (if 2+ storey)", pct: storeys >= 2 ? 0.12 : 0 },
      { name: "Roofing", pct: 0.10 },
      { name: "Doors / windows", pct: 0.06 },
      { name: "Plumbing", pct: 0.06 },
      { name: "Electrical", pct: 0.06 },
      { name: "Plastering & painting", pct: 0.10 },
      { name: "Floor & wall tiling", pct: 0.08 },
      { name: "Kitchen & bath fittings", pct: 0.06 },
      { name: "External works (fence, drive)", pct: 0.06 },
      { name: "Labour overhead", pct: 0.04 },
    ];
    const sum = breakdown.reduce((s, b) => s + b.pct, 0);
    const lines = breakdown
      .filter((b) => b.pct > 0)
      .map((b) => ({ ...b, amount: (construction * b.pct) / sum }));

    const duration = Math.max(8, Math.round((sqm * storeyMult) / 18));

    return { construction, professional, cont, total, lines, duration, constructionPerSqm };
  }, [sqm, storeys, finish, region, land, pro, contingency]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Home className="h-4 w-4 text-accent-gold" /> The build</div>
        <div className="space-y-3">
          <Field label="Region">
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="input">
              {Object.keys(REGION_MULT).map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Number of storeys">
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setStoreys(n)}
                  className={`flex-1 rounded-md border py-2 text-[12px] ${
                    storeys === n ? "border-accent-gold bg-accent-gold/10 text-ink" : "border-line bg-bg-elev/40 text-ink-dim hover:text-ink"
                  }`}
                >
                  {n}-storey
                </button>
              ))}
            </div>
          </Field>
          <Field label={`Floor area per storey: ${sqm} m²`}>
            <input type="range" min="60" max="500" step="10" value={sqm} onChange={(e) => setSqm(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label="Bedrooms">
            <input type="number" min="1" max="10" value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className="input" />
          </Field>
          <Field label="Finish quality">
            <div className="flex gap-2">
              {(["basic", "mid", "premium"] as Finish[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFinish(f)}
                  className={`flex-1 rounded-md border py-2 text-[12px] capitalize ${
                    finish === f ? "border-accent-gold bg-accent-gold/10 text-ink" : "border-line bg-bg-elev/40 text-ink-dim hover:text-ink"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Field>
          <Field label={`Land cost: GHS ${land.toLocaleString()}`}>
            <input type="range" min="0" max="800000" step="5000" value={land} onChange={(e) => setLand(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label={`Professional fees: ${(pro * 100).toFixed(0)}% of build`}>
            <input type="range" min="0" max="0.18" step="0.01" value={pro} onChange={(e) => setPro(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label={`Contingency: ${(contingency * 100).toFixed(0)}%`}>
            <input type="range" min="0" max="0.25" step="0.01" value={contingency} onChange={(e) => setContingency(Number(e.target.value))} className="w-full" />
          </Field>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Calculator className="h-4 w-4 text-accent-gold" /> Estimate (GHS)</div>

        <div className="rounded-xl border border-accent-gold/30 bg-accent-gold/5 p-5 text-center">
          <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">All-in estimate</div>
          <div className="mt-1 text-4xl font-semibold tracking-tight text-accent-gold">GHS {Math.round(res.total).toLocaleString()}</div>
          <div className="mt-1 text-[12px] text-ink-dim">~ GHS {Math.round(res.constructionPerSqm).toLocaleString()}/m² construction</div>
        </div>

        <div className="mt-4 space-y-1 rounded-md border border-line bg-bg-elev/40 p-4 text-[12px]">
          <Line k="Land" v={land} />
          <Line k="Construction" v={res.construction} />
          <Line k={`Professional fees (${(pro * 100).toFixed(0)}%)`} v={res.professional} />
          <Line k={`Contingency (${(contingency * 100).toFixed(0)}%)`} v={res.cont} />
          <div className="my-1 border-t border-line" />
          <Line k="Total" v={res.total} bold />
          <div className="my-1 border-t border-line" />
          <div className="flex items-baseline justify-between text-[11px] text-ink-muted">
            <span>Indicative build duration</span>
            <span className="text-ink">{res.duration} months</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted"><Hammer className="h-3 w-3" /> Construction breakdown</div>
          <div className="space-y-1.5">
            {res.lines.map((l) => {
              const pct = (l.amount / res.construction) * 100;
              return (
                <div key={l.name}>
                  <div className="flex items-baseline justify-between text-[11.5px]">
                    <span className="text-ink-dim">{l.name}</span>
                    <span className="text-ink">GHS {Math.round(l.amount).toLocaleString()}</span>
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-bg-subtle">
                    <div className="h-full bg-accent-gold" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p className="mt-3 text-[10.5px] text-ink-muted">
          Indicative only. Always commission a licensed quantity surveyor for the final BOQ before
          breaking ground.
        </p>
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

function Line({ k, v, bold }: { k: string; v: number; bold?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between py-1 ${bold ? "font-semibold" : ""}`}>
      <span className={bold ? "text-ink" : "text-ink-dim"}>{k}</span>
      <span className={bold ? "text-[16px] text-ink" : "text-ink"}>GHS {Math.round(v).toLocaleString()}</span>
    </div>
  );
}
