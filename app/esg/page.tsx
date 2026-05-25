import { Leaf, TreePine, Sun, Recycle, Users, Sparkles } from "lucide-react";

export const metadata = { title: "ESG & carbon — GhanaWatch" };

const PROJECTS = [
  { name: "4-Bedroom Family Home, Kasoa", embodiedTCO2: 38.4, opTCO2: 1.8, recycledMaterial: 22, localLabour: 96, social: "12 direct jobs · 8 indirect" },
  { name: "East Legon Hills Plot (2.5 acres)", embodiedTCO2: 4.1, opTCO2: 0, recycledMaterial: 0, localLabour: 100, social: "Title clean-up — base case" },
  { name: "Adum Cosmetics Shop", embodiedTCO2: 7.8, opTCO2: 2.4, recycledMaterial: 41, localLabour: 100, social: "3 jobs · 4 supplier relationships" },
  { name: "Ho Poultry Farm (1,200-bird)", embodiedTCO2: 11.2, opTCO2: 4.6, recycledMaterial: 18, localLabour: 100, social: "7 jobs · feed corridor to MoFA co-op" },
];

const TOTAL = PROJECTS.reduce((a, p) => ({
  embodied: a.embodied + p.embodiedTCO2,
  op: a.op + p.opTCO2,
}), { embodied: 0, op: 0 });

export default function EsgPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Leaf className="h-3 w-3" /> ESG & carbon
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Track the environmental + social footprint of every project.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Carbon, recycled-content %, local-labour %, social impact (jobs, supplier relationships).
          Useful for ESG-aware diaspora investors, for grant applications, and for the next
          generation of diaspora bonds (green tranches).
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Kpi icon={TreePine} label="Embodied CO₂" value={`${TOTAL.embodied.toFixed(1)} tCO₂e`} sub="across portfolio" />
        <Kpi icon={Sun} label="Operational CO₂ / yr" value={`${TOTAL.op.toFixed(1)} tCO₂e`} sub="per annum" />
        <Kpi icon={Users} label="Direct jobs" value="22" sub="long-term + temp" />
        <Kpi icon={Recycle} label="Recycled material" value="20.3%" sub="weighted avg" />
      </div>

      <div className="mt-8 card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Per-project ESG dashboard</div>
        <table className="w-full text-[12px]">
          <thead className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            <tr className="border-b border-line">
              <th className="px-5 py-3">Project</th>
              <th className="px-3 py-3">Embodied CO₂</th>
              <th className="px-3 py-3">Op. CO₂ / yr</th>
              <th className="px-3 py-3">Recycled</th>
              <th className="px-3 py-3">Local labour</th>
              <th className="px-5 py-3">Social impact</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((p) => (
              <tr key={p.name} className="border-b border-line last:border-0">
                <td className="px-5 py-3 text-ink">{p.name}</td>
                <td className="px-3 py-3 text-ink-dim">{p.embodiedTCO2} t</td>
                <td className="px-3 py-3 text-ink-dim">{p.opTCO2} t</td>
                <td className="px-3 py-3">
                  <div className="text-ink">{p.recycledMaterial}%</div>
                  <div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-bg-subtle">
                    <div className="h-full" style={{ width: `${p.recycledMaterial}%`, background: "#10b981" }} />
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="text-ink">{p.localLabour}%</div>
                  <div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-bg-subtle">
                    <div className="h-full" style={{ width: `${p.localLabour}%`, background: "#f5b800" }} />
                  </div>
                </td>
                <td className="px-5 py-3 text-ink-dim">{p.social}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card icon={Sparkles} title="Green tranche of diaspora bonds" body="Projects that meet a defined ESG threshold qualify into a green sub-tranche of the diaspora bond, with a 25 bps coupon premium for investors." />
        <Card icon={Recycle} title="Recycled-content rebate" body="20%+ recycled material lowers your insurance premium by 5% and earns the Green Build badge." />
        <Card icon={Users} title="Local-labour multiplier" body="80%+ local labour earns a hometown-association badge and waives the platform fee on community projects." />
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        <Icon className="h-3 w-3 text-accent-green" /> {label}
      </div>
      <div className="mt-2 text-xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="text-[11px] text-ink-muted">{sub}</div>}
    </div>
  );
}

function Card({ icon: Icon, title, body }: any) {
  return (
    <div className="card p-5">
      <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold">
        <Icon className="h-4 w-4 text-accent-green" /> {title}
      </div>
      <p className="text-[12.5px] text-ink-dim">{body}</p>
    </div>
  );
}
