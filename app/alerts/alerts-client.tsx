"use client";
import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Bell,
  Check,
  MapPin,
  Users,
  Banknote,
  ScanSearch,
  AlertTriangle,
  Power,
} from "lucide-react";

type Trigger = "network-cluster" | "regional-spike" | "vendor-flagged" | "trustee-overbooked" | "fraud-pattern-published" | "benchmark-divergence";
type Rule = {
  id: string;
  name: string;
  trigger: Trigger;
  region?: string;
  sector?: string;
  threshold?: number;
  active: boolean;
  lastFired?: string;
  fireCount30d: number;
};

const TRIGGER_LABEL: Record<Trigger, string> = {
  "network-cluster": "Network-wide fraud cluster detected (≥3 cases linked)",
  "regional-spike": "Risk score for a region spikes above threshold",
  "vendor-flagged": "Any verified vendor gets flagged",
  "trustee-overbooked": "Trustee response time exceeds threshold",
  "fraud-pattern-published": "New fraud pattern published in Knowledge Base",
  "benchmark-divergence": "Material price diverges >20% from benchmark",
};

const TRIGGER_ICON: Record<Trigger, any> = {
  "network-cluster": ScanSearch,
  "regional-spike": MapPin,
  "vendor-flagged": AlertTriangle,
  "trustee-overbooked": Users,
  "fraud-pattern-published": Bell,
  "benchmark-divergence": Banknote,
};

const SEED: Rule[] = [
  { id: "sa-1", name: "East Legon Hills cluster watch", trigger: "network-cluster", region: "Greater Accra", active: true, lastFired: "2026-05-22", fireCount30d: 2 },
  { id: "sa-2", name: "Construction material spike", trigger: "benchmark-divergence", sector: "construction", threshold: 25, active: true, lastFired: "2026-05-19", fireCount30d: 4 },
  { id: "sa-3", name: "New Tema port fraud pattern", trigger: "fraud-pattern-published", sector: "vehicle-import", active: true, fireCount30d: 0 },
  { id: "sa-4", name: "Ashanti regional risk spike", trigger: "regional-spike", region: "Ashanti", threshold: 60, active: false, fireCount30d: 0 },
];

export function AlertsClient() {
  const [rules, setRules] = useState<Rule[]>(SEED);
  const [saved, setSaved] = useState(false);

  function add() {
    setRules((r) => [...r, {
      id: `sa-${Date.now()}`,
      name: "New rule",
      trigger: "network-cluster",
      active: true,
      fireCount30d: 0,
    }]);
  }
  function update<K extends keyof Rule>(id: string, k: K, v: Rule[K]) {
    setRules((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)));
  }
  function remove(id: string) { setRules((r) => r.filter((x) => x.id !== id)); }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="mt-8">
      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Kpi label="Active rules" value={`${rules.filter((r) => r.active).length}`} />
        <Kpi label="Fired (30d)" value={`${rules.reduce((s, r) => s + r.fireCount30d, 0)}`} />
        <Kpi label="Of which true-positive" value="71%" sub="across the network" />
        <Kpi label="Avg time-to-fire" value="38m" />
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div className="text-[14px] font-semibold">Your rules</div>
          <button onClick={add} className="btn btn-ghost text-[12px] py-1.5"><Plus className="h-3.5 w-3.5" /> Add rule</button>
        </div>
        <div className="divide-y divide-line">
          {rules.map((r) => {
            const Icon = TRIGGER_ICON[r.trigger];
            return (
              <div key={r.id} className="grid items-start gap-3 px-5 py-4 md:grid-cols-[1fr_1.4fr_120px_auto]">
                <div>
                  <input
                    value={r.name}
                    onChange={(e) => update(r.id, "name", e.target.value)}
                    className="input py-1.5 text-[13px] font-semibold"
                  />
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-ink-muted">
                    {r.lastFired && <><Bell className="h-3 w-3" /> Last fired {r.lastFired}</>}
                    <span>·</span>
                    <span>{r.fireCount30d} hits in 30d</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-accent-gold" />
                    <select
                      value={r.trigger}
                      onChange={(e) => update(r.id, "trigger", e.target.value as Trigger)}
                      className="input py-1.5 text-[12px]"
                    >
                      {(Object.keys(TRIGGER_LABEL) as Trigger[]).map((t) => (
                        <option key={t} value={t}>{TRIGGER_LABEL[t]}</option>
                      ))}
                    </select>
                  </div>
                  {(r.trigger === "regional-spike" || r.trigger === "network-cluster") && (
                    <input
                      placeholder="Filter by region (optional)"
                      value={r.region ?? ""}
                      onChange={(e) => update(r.id, "region", e.target.value)}
                      className="input py-1.5 text-[12px]"
                    />
                  )}
                  {(r.trigger === "benchmark-divergence" || r.trigger === "fraud-pattern-published") && (
                    <input
                      placeholder="Filter by sector (optional)"
                      value={r.sector ?? ""}
                      onChange={(e) => update(r.id, "sector", e.target.value)}
                      className="input py-1.5 text-[12px]"
                    />
                  )}
                  {(r.trigger === "regional-spike" || r.trigger === "benchmark-divergence" || r.trigger === "trustee-overbooked") && (
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className="text-ink-muted">Threshold:</span>
                      <input
                        type="number"
                        value={r.threshold ?? 0}
                        onChange={(e) => update(r.id, "threshold", Number(e.target.value))}
                        className="input py-1.5 max-w-[100px]"
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => update(r.id, "active", !r.active)}
                  className={`flex items-center gap-2 self-start rounded-md border px-3 py-1.5 text-[12px] ${
                    r.active ? "border-accent-green/30 bg-accent-green/5 text-accent-green" : "border-line text-ink-muted"
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  {r.active ? "Active" : "Paused"}
                </button>
                <button onClick={() => remove(r.id)} className="grid h-8 w-8 self-start place-items-center rounded-md text-ink-muted hover:bg-bg-elev hover:text-risk-high">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        {saved && <span className="inline-flex items-center gap-1.5 text-[12px] text-accent-green"><Check className="h-3.5 w-3.5" /> Saved</span>}
        <button onClick={save} className="btn btn-primary"><Save className="h-4 w-4" /> Save rules</button>
      </div>

      <div className="mt-8 card p-6">
        <div className="mb-2 text-[14px] font-semibold">Why network-wide alerts matter</div>
        <p className="text-[13px] text-ink-dim">
          A single duplicate-receipt flag is noise. <strong className="text-ink">Three of them
          inside 14 days with the same MoMo merchant ID</strong> is a fraud cluster — and the third
          diaspora user shouldn't have to be the third victim. Smart alerts let the platform's
          collective intelligence reach you before you become evidence.
        </p>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="text-[11px] text-ink-muted">{sub}</div>}
    </div>
  );
}
