"use client";
import { useState } from "react";
import { CloudRain, Zap, Route, Waves, Sun, AlertTriangle, Info } from "lucide-react";

type Layer = "flood" | "coastal" | "grid" | "roads" | "drought";

const LAYERS: { id: Layer; label: string; icon: any; color: string; desc: string }[] = [
  { id: "flood", label: "Flood zones", icon: CloudRain, color: "#3b82f6", desc: "30-year flood probability per region" },
  { id: "coastal", label: "Coastal erosion", icon: Waves, color: "#06b6d4", desc: "5m/yr erosion projection 2026-2046" },
  { id: "grid", label: "ECG grid coverage", icon: Zap, color: "#f5b800", desc: "Power reliability hours/month" },
  { id: "roads", label: "Road quality", icon: Route, color: "#8b5cf6", desc: "Paved-road % within 5 km" },
  { id: "drought", label: "Drought risk", icon: Sun, color: "#ef4444", desc: "12-month drought probability" },
];

const REGION_RISK: Record<string, Record<Layer, number>> = {
  "Greater Accra": { flood: 72, coastal: 58, grid: 82, roads: 91, drought: 22 },
  "Ashanti": { flood: 38, coastal: 0, grid: 78, roads: 84, drought: 31 },
  "Central": { flood: 56, coastal: 48, grid: 71, roads: 76, drought: 26 },
  "Western": { flood: 64, coastal: 81, grid: 64, roads: 62, drought: 18 },
  "Eastern": { flood: 42, coastal: 0, grid: 72, roads: 71, drought: 28 },
  "Volta": { flood: 71, coastal: 44, grid: 58, roads: 56, drought: 35 },
  "Northern": { flood: 28, coastal: 0, grid: 41, roads: 38, drought: 78 },
  "Bono": { flood: 33, coastal: 0, grid: 51, roads: 51, drought: 58 },
  "Upper East": { flood: 22, coastal: 0, grid: 34, roads: 31, drought: 88 },
  "Upper West": { flood: 19, coastal: 0, grid: 28, roads: 27, drought: 91 },
};

function color(v: number) {
  if (v >= 70) return "#ef4444";
  if (v >= 40) return "#f59e0b";
  return "#10b981";
}

export function ClimateClient() {
  const [layer, setLayer] = useState<Layer>("flood");
  const [region, setRegion] = useState<string | null>("Greater Accra");

  const meta = LAYERS.find((l) => l.id === layer)!;
  const regionData = region ? REGION_RISK[region] : null;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="card overflow-hidden">
        {/* Layer chooser */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-line p-2">
          {LAYERS.map((l) => {
            const I = l.icon;
            const active = layer === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setLayer(l.id)}
                className={`flex items-center gap-2 shrink-0 rounded-md px-3 py-1.5 text-[12px] ${
                  active ? "bg-bg-subtle text-ink" : "text-ink-dim hover:bg-bg-elev hover:text-ink"
                }`}
              >
                <I className="h-3.5 w-3.5" style={{ color: l.color }} />
                {l.label}
              </button>
            );
          })}
        </div>

        {/* Map */}
        <div className="aspect-[5/6] w-full p-4">
          <svg viewBox="0 0 500 600" className="h-full w-full">
            {/* Stylised Ghana */}
            <path
              d="M 200 60 L 280 75 L 340 110 L 360 170 L 350 230 L 365 290 L 360 350 L 340 410 L 300 470 L 260 510 L 220 520 L 175 510 L 145 470 L 130 410 L 125 350 L 115 290 L 130 230 L 145 170 L 165 110 Z"
              fill="rgba(245,184,0,0.03)"
              stroke="#2f3445"
              strokeWidth={1.5}
            />
            {/* Region heat blobs */}
            {Object.entries(REGION_RISK).map(([rn, vals], i) => {
              const positions: Record<string, [number, number, number]> = {
                "Greater Accra": [310, 460, 38],
                "Central": [240, 480, 34],
                "Western": [170, 450, 40],
                "Ashanti": [240, 320, 50],
                "Eastern": [310, 380, 36],
                "Volta": [340, 280, 40],
                "Bono": [180, 280, 36],
                "Northern": [220, 180, 60],
                "Upper East": [275, 90, 30],
                "Upper West": [170, 100, 30],
              };
              const [cx, cy, r] = positions[rn] ?? [250, 300, 30];
              const v = vals[layer];
              const c = color(v);
              const selected = region === rn;
              return (
                <g key={rn} onClick={() => setRegion(rn)} style={{ cursor: "pointer" }}>
                  <circle cx={cx} cy={cy} r={r} fill={c} fillOpacity={0.35} stroke={selected ? "#f5b800" : "transparent"} strokeWidth={selected ? 2 : 0} />
                  <text x={cx} y={cy - 2} textAnchor="middle" fontSize="10.5" fill="#e8eaf0" fontWeight={500}>{rn}</text>
                  <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fontWeight={700} fill="#fff">{v}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="border-t border-line bg-bg-elev/40 px-5 py-3 flex items-center gap-3 text-[11px] text-ink-muted">
          <Info className="h-3.5 w-3.5 text-accent-gold" />
          <span>{meta.label} — {meta.desc}. Click a region for breakdown.</span>
        </div>
      </div>

      <div className="space-y-4">
        {region && regionData && (
          <div className="card p-5">
            <div className="text-[14px] font-semibold">{region}</div>
            <div className="mt-3 space-y-3">
              {LAYERS.map((l) => {
                const v = regionData[l.id];
                const c = color(v);
                const I = l.icon;
                return (
                  <div key={l.id}>
                    <div className="flex items-baseline justify-between text-[12px]">
                      <span className="flex items-center gap-1.5 text-ink"><I className="h-3 w-3" style={{ color: l.color }} /> {l.label}</span>
                      <span className="font-semibold" style={{ color: c }}>{v}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
                      <div className="h-full" style={{ width: `${v}%`, background: c }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><AlertTriangle className="h-4 w-4 text-accent-gold" /> What to do with this</div>
          <ul className="space-y-2 text-[12px] text-ink-dim">
            <li>· If your plot is in a high-flood zone, raise the slab and budget for elevated drainage.</li>
            <li>· On coastal-erosion belts (Western, Central), set back from the shoreline by ≥150m.</li>
            <li>· Low-grid regions need solar + inverter built into the BOQ.</li>
            <li>· Insurance premiums adjust automatically per region risk.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
