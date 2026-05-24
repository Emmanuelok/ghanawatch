import { Map as MapIcon } from "lucide-react";
import { GhanaMap } from "@/components/ghana-map";
import { PROJECTS, REGION_RISK } from "@/lib/mock-data";

export const metadata = { title: "Map — GhanaWatch" };

export default function MapPage() {
  const regions = Object.entries(REGION_RISK).sort((a, b) => b[1].riskScore - a[1].riskScore);
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            <MapIcon className="h-3 w-3" /> Map view
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Where your money lives</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
            Every project and every regional risk signal on one map. Hover a pin for project detail;
            shaded circles show the per-region fraud risk score across the GhanaWatch network.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card overflow-hidden p-2">
          <GhanaMap projects={PROJECTS} height={620} />
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-[14px] font-semibold">Regional risk index</div>
            <div className="mt-3 space-y-2">
              {regions.map(([name, r]) => (
                <div key={name}>
                  <div className="flex items-baseline justify-between text-[12px]">
                    <span className="text-ink">{name}</span>
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          r.riskScore >= 60 ? "#ef4444" : r.riskScore >= 40 ? "#f59e0b" : "#10b981",
                      }}
                    >
                      {r.riskScore}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
                    <div
                      className="h-full"
                      style={{
                        width: `${r.riskScore}%`,
                        background:
                          r.riskScore >= 60 ? "#ef4444" : r.riskScore >= 40 ? "#f59e0b" : "#10b981",
                      }}
                    />
                  </div>
                  <div className="mt-1 text-[10px] text-ink-muted">
                    {r.activeProjects} projects · {r.openCases} open cases
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3 text-[14px] font-semibold">Pins on map ({PROJECTS.length})</div>
            <div className="space-y-2 text-[12px]">
              {PROJECTS.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-ink-dim">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      background:
                        p.risk === "high" ? "#ef4444" : p.risk === "med" ? "#f59e0b" : "#10b981",
                    }}
                  />
                  <span className="flex-1 truncate text-ink">{p.name}</span>
                  <span className="text-ink-muted">{p.region}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
