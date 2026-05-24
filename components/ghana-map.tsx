"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { REGION_RISK } from "@/lib/mock-data";

// Stylised SVG outline of Ghana (simplified). Coordinates approximate.
const GHANA_OUTLINE =
  "M 320,40 L 380,55 L 440,80 L 510,110 L 545,160 L 568,225 L 555,290 L 545,355 L 575,400 L 580,455 L 558,520 L 520,575 L 478,610 L 440,650 L 405,705 L 370,755 L 335,790 L 295,800 L 258,790 L 222,765 L 198,720 L 188,665 L 175,610 L 158,548 L 152,485 L 158,420 L 175,355 L 200,295 L 235,235 L 268,175 L 285,115 L 302,68 Z";

// Project lat/lng → SVG x/y mapping.
// Ghana approx bounding box: lat 4.5–11.2, lng -3.3–1.2
function project(lat: number, lng: number) {
  const x = ((lng + 3.3) / 4.5) * 720 + 10;
  const y = 820 - ((lat - 4.4) / 7.0) * 780;
  return [x, y] as const;
}

export function GhanaMap({
  projects,
  height = 560,
  showLegend = true,
  showRegions = true,
}: {
  projects: Project[];
  height?: number;
  showLegend?: boolean;
  showRegions?: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const regions = useMemo(() => {
    if (!showRegions) return [];
    // pseudo region pins — approximate centroids
    const r: { name: string; lat: number; lng: number }[] = [
      { name: "Greater Accra", lat: 5.7, lng: -0.1 },
      { name: "Central", lat: 5.4, lng: -1.05 },
      { name: "Western", lat: 5.2, lng: -2.3 },
      { name: "Eastern", lat: 6.4, lng: -0.6 },
      { name: "Volta", lat: 6.95, lng: 0.45 },
      { name: "Ashanti", lat: 6.8, lng: -1.45 },
      { name: "Bono", lat: 7.85, lng: -2.4 },
      { name: "Northern", lat: 9.6, lng: -0.85 },
      { name: "Upper East", lat: 10.7, lng: -0.9 },
      { name: "Upper West", lat: 10.45, lng: -2.25 },
    ];
    return r;
  }, [showRegions]);

  function regionColor(name: string): string {
    const r = REGION_RISK[name];
    if (!r) return "rgba(245,184,0,0.05)";
    const s = r.riskScore;
    if (s >= 60) return "rgba(239,68,68,0.32)";
    if (s >= 40) return "rgba(245,158,11,0.28)";
    if (s >= 20) return "rgba(16,185,129,0.22)";
    return "rgba(16,185,129,0.16)";
  }

  return (
    <div className="relative">
      <svg viewBox="0 0 740 820" width="100%" height={height} className="block">
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="100%" r="80%">
            <stop offset="0%" stopColor="rgba(245,184,0,0.07)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <pattern id="grid-bg" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#161924" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width="740" height="820" fill="url(#grid-bg)" />
        <rect width="740" height="820" fill="url(#oceanGlow)" />

        {/* Ghana outline filled with heat */}
        <path d={GHANA_OUTLINE} fill="rgba(245,184,0,0.04)" stroke="#2f3445" strokeWidth="1.4" />

        {/* Region heat circles */}
        {regions.map((r) => {
          const [x, y] = project(r.lat, r.lng);
          const risk = REGION_RISK[r.name];
          const radius = risk ? 30 + Math.sqrt(risk.activeProjects) * 2.4 : 18;
          return (
            <g key={r.name}>
              <circle
                cx={x}
                cy={y}
                r={radius}
                fill={regionColor(r.name)}
                stroke="rgba(255,255,255,0.05)"
              />
              <text
                x={x}
                y={y + 4}
                fontSize="10"
                fontWeight="500"
                textAnchor="middle"
                fill="#9aa0b0"
              >
                {r.name}
              </text>
            </g>
          );
        })}

        {/* Project pins */}
        {projects.map((p) => {
          const [x, y] = project(p.lat, p.lng);
          const color = p.risk === "high" ? "#ef4444" : p.risk === "med" ? "#f59e0b" : "#10b981";
          const isHovered = hovered === p.id;
          return (
            <g key={p.id} onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)}>
              <Link href={`/projects/${p.id}`}>
                <g style={{ cursor: "pointer" }}>
                  <circle cx={x} cy={y} r={isHovered ? 14 : 10} fill={color} fillOpacity="0.15" />
                  <circle cx={x} cy={y} r={isHovered ? 9 : 6} fill={color} stroke="#0a0b0f" strokeWidth="2" />
                  {p.alerts > 0 && (
                    <circle cx={x + 6} cy={y - 6} r={3.5} fill="#ef4444" stroke="#0a0b0f" strokeWidth="1.5" />
                  )}
                  {isHovered && (
                    <g>
                      <rect
                        x={x + 14}
                        y={y - 32}
                        width={220}
                        height={64}
                        rx={8}
                        fill="#13151d"
                        stroke="#222633"
                      />
                      <text x={x + 24} y={y - 14} fontSize="11" fill="#e8eaf0" fontWeight="600">
                        {p.name.length > 30 ? p.name.slice(0, 30) + "…" : p.name}
                      </text>
                      <text x={x + 24} y={y + 2} fontSize="9" fill="#9aa0b0">
                        {p.location} · Risk {p.riskScore}
                      </text>
                      <text x={x + 24} y={y + 18} fontSize="9" fill="#9aa0b0">
                        GHS {(p.budgetGHS / 1000).toFixed(0)}K · {p.progress}%
                      </text>
                    </g>
                  )}
                </g>
              </Link>
            </g>
          );
        })}
      </svg>

      {showLegend && (
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 rounded-lg border border-line bg-bg-elev/80 p-3 backdrop-blur">
          <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Risk</div>
          <div className="space-y-1 text-[11px]">
            <Legend color="#ef4444" label="High (60+)" />
            <Legend color="#f59e0b" label="Medium (40-59)" />
            <Legend color="#10b981" label="Low (0-39)" />
          </div>
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-ink-dim">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}
