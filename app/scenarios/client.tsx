"use client";
import { useMemo, useState } from "react";
import { Sliders, ArrowRight, TrendingDown, TrendingUp, Banknote } from "lucide-react";
import { PROJECTS } from "@/lib/mock-data";

export function ScenarioPlanner() {
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const project = PROJECTS.find((p) => p.id === projectId)!;

  // Levers
  const [trusteeDispatches, setTrusteeDispatches] = useState(1);
  const [familyCosigner, setFamilyCosigner] = useState(true);
  const [escrowOnly, setEscrowOnly] = useState(true);
  const [photoFrequency, setPhotoFrequency] = useState(2); // visits / week
  const [biometricRelease, setBiometricRelease] = useState(true);
  const [switchManager, setSwitchManager] = useState(false);

  const baseline = useMemo(() => ({ risk: project.riskScore, trust: project.trustScore, lossPct: 0.045 }), [project]);

  const scenario = useMemo(() => {
    let risk = baseline.risk;
    let trust = baseline.trust;
    let lossPct = baseline.lossPct;

    risk -= trusteeDispatches * 6;
    trust += trusteeDispatches * 4;
    lossPct -= trusteeDispatches * 0.008;

    if (familyCosigner) { risk -= 4; trust += 3; lossPct -= 0.006; }
    if (escrowOnly) { risk -= 9; trust += 5; lossPct -= 0.014; }
    if (biometricRelease) { risk -= 5; trust += 3; lossPct -= 0.005; }
    if (switchManager) { risk -= 12; trust -= 8; lossPct -= 0.01; }

    risk -= photoFrequency * 1.5;
    trust += photoFrequency * 1;
    lossPct -= photoFrequency * 0.002;

    risk = Math.max(0, Math.min(100, Math.round(risk)));
    trust = Math.max(0, Math.min(100, Math.round(trust)));
    lossPct = Math.max(0.002, Math.min(0.1, Number(lossPct.toFixed(4))));

    return {
      risk,
      trust,
      lossPct,
      expectedLossGHS: Math.round(project.budgetGHS * lossPct),
    };
  }, [trusteeDispatches, familyCosigner, escrowOnly, biometricRelease, photoFrequency, switchManager, baseline, project]);

  const baselineLossGHS = Math.round(project.budgetGHS * baseline.lossPct);
  const lossDelta = scenario.expectedLossGHS - baselineLossGHS;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Sliders className="h-4 w-4 text-accent-gold" /> Project & levers</div>

        <label className="mb-4 block">
          <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Project</div>
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="input">
            {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.name} — risk {p.riskScore}</option>)}
          </select>
        </label>

        <div className="space-y-5">
          <Slider label={`Trustee dispatches per quarter: ${trusteeDispatches}`} value={trusteeDispatches} setValue={setTrusteeDispatches} min={0} max={6} />
          <Slider label={`Photo capture frequency: ${photoFrequency}× / week`} value={photoFrequency} setValue={setPhotoFrequency} min={0} max={7} />
          <Toggle label="Family co-signer for releases above GHS 50K" checked={familyCosigner} onChange={setFamilyCosigner} />
          <Toggle label="Funds via milestone escrow only (no off-platform side-payments)" checked={escrowOnly} onChange={setEscrowOnly} />
          <Toggle label="Biometric release on the diaspora user's mobile" checked={biometricRelease} onChange={setBiometricRelease} />
          <Toggle label="Switch to a licensed contractor (replace family manager)" checked={switchManager} onChange={setSwitchManager} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-5">
          <div className="mb-3 text-[14px] font-semibold">Projected impact</div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <Diff label="Risk" before={baseline.risk} after={scenario.risk} better="down" />
            <Diff label="Trust" before={baseline.trust} after={scenario.trust} better="up" />
            <DiffPct label="Expected loss" before={baseline.lossPct} after={scenario.lossPct} better="down" />
          </div>

          <div className="mt-5 rounded-xl border border-accent-gold/30 bg-accent-gold/5 p-4 text-center">
            <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Annualised expected loss</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-accent-gold">GHS {scenario.expectedLossGHS.toLocaleString()}</div>
            <div className="mt-1 text-[12px]" style={{ color: lossDelta <= 0 ? "#10b981" : "#ef4444" }}>
              {lossDelta <= 0 ? "↓" : "↑"} GHS {Math.abs(lossDelta).toLocaleString()} vs current cadence
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Recommendation</div>
            <p className="text-[13px] text-ink-dim">
              {scenario.risk < baseline.risk - 10
                ? "Strong stack — most-protective configuration we can suggest without overdoing trustee fees."
                : scenario.risk < baseline.risk
                ? "Better than baseline — pick the lever that gives the most movement for the cost."
                : "You're not far from baseline. Try toggling more risk reducers."}
            </p>
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><Banknote className="h-4 w-4 text-accent-gold" /> Cost of the configuration</div>
          <ul className="space-y-1.5 text-[12px]">
            <Row k="Trustee dispatches / yr" v={`GHS ${(trusteeDispatches * 4 * 1800).toLocaleString()}`} />
            <Row k="Insurance premium adjustment" v={`GHS ${Math.round(scenario.expectedLossGHS * 0.05).toLocaleString()}`} />
            <Row k="Annual escrow fee (0.4%)" v={`GHS ${Math.round(project.budgetGHS * 0.004).toLocaleString()}`} />
          </ul>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, setValue, min, max }: { label: string; value: number; setValue: (n: number) => void; min: number; max: number }) {
  return (
    <label className="block">
      <div className="mb-1 text-[12px] text-ink-dim">{label}</div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full accent-amber-500" />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-md border border-line bg-bg-elev/40 px-3 py-2.5 text-[12px]">
      <span className="text-ink">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-amber-500" />
    </label>
  );
}

function Diff({ label, before, after, better }: { label: string; before: number; after: number; better: "up" | "down" }) {
  const delta = after - before;
  const good = better === "up" ? delta >= 0 : delta <= 0;
  return (
    <div className="rounded-md border border-line bg-bg-elev/40 p-3">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      <div className="mt-1 text-[24px] font-semibold tracking-tight">{after}</div>
      <div className="flex items-center justify-center gap-1 text-[11px]" style={{ color: good ? "#10b981" : "#ef4444" }}>
        {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {delta >= 0 ? "+" : ""}{delta} vs {before}
      </div>
    </div>
  );
}

function DiffPct({ label, before, after, better }: any) {
  const delta = after - before;
  const good = better === "up" ? delta >= 0 : delta <= 0;
  return (
    <div className="rounded-md border border-line bg-bg-elev/40 p-3">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      <div className="mt-1 text-[24px] font-semibold tracking-tight">{(after * 100).toFixed(1)}%</div>
      <div className="flex items-center justify-center gap-1 text-[11px]" style={{ color: good ? "#10b981" : "#ef4444" }}>
        {delta >= 0 ? "+" : ""}{(delta * 100).toFixed(1)} pts
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-baseline justify-between">
      <span className="text-ink-muted">{k}</span>
      <span className="text-ink">{v}</span>
    </li>
  );
}
