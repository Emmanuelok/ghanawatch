"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { REGION_RISK } from "@/lib/mock-data";
import geo from "@/lib/ghana-geo.json";

type GeoFeature = {
  type: "Feature";
  properties: { name: string; iso: string };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
};

// Web Mercator projection (degrees → planar). Same units on both axes.
function mercator(lng: number, lat: number) {
  const x = (lng * Math.PI) / 180;
  const y = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return [x, y] as const;
}

function regionColor(name: string, hovered: string | null): string {
  const key = name.replace(/ Region$/, "");
  const r = REGION_RISK[key];
  const hl = hovered === name ? 0.35 : 0;
  if (!r) return `rgba(245,184,0,${0.04 + hl})`;
  const s = r.riskScore;
  if (s >= 60) return `rgba(239,68,68,${0.32 + hl})`;
  if (s >= 40) return `rgba(245,158,11,${0.28 + hl})`;
  if (s >= 20) return `rgba(16,185,129,${0.22 + hl})`;
  return `rgba(16,185,129,${0.16 + hl})`;
}

export function GhanaMap({
  projects,
  height = 560,
  showLegend = true,
  showLabels = true,
}: {
  projects: Project[];
  height?: number;
  showLegend?: boolean;
  showLabels?: boolean;
}) {
  const features = (geo as { features: GeoFeature[] }).features;
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // Compute projection bounds from all polygon coords.
  const projection = useMemo(() => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const f of features) {
      const polys =
        f.geometry.type === "Polygon"
          ? [f.geometry.coordinates as number[][][]]
          : (f.geometry.coordinates as number[][][][]);
      for (const poly of polys) {
        for (const ring of poly) {
          for (const [lng, lat] of ring) {
            const [x, y] = mercator(lng, lat);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
    }
    const W = 760, H = 820;
    const padX = 30, padY = 30;
    const dx = maxX - minX, dy = maxY - minY;
    const scale = Math.min((W - padX * 2) / dx, (H - padY * 2) / dy);
    const offsetX = (W - dx * scale) / 2 - minX * scale;
    const offsetY = (H - dy * scale) / 2 + maxY * scale;
    return {
      W,
      H,
      project(lng: number, lat: number): [number, number] {
        const [x, y] = mercator(lng, lat);
        return [x * scale + offsetX, -y * scale + offsetY];
      },
    };
  }, [features]);

  // Build SVG paths per feature.
  const paths = useMemo(() => {
    return features.map((f) => {
      const polys =
        f.geometry.type === "Polygon"
          ? [f.geometry.coordinates as number[][][]]
          : (f.geometry.coordinates as number[][][][]);
      const d: string[] = [];
      for (const poly of polys) {
        for (const ring of poly) {
          ring.forEach(([lng, lat], i) => {
            const [x, y] = projection.project(lng, lat);
            d.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
          });
          d.push("Z");
        }
      }
      // Centroid for label placement — use bbox center
      let cx = 0, cy = 0, n = 0;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const poly of polys) {
        for (const ring of poly) {
          for (const [lng, lat] of ring) {
            const [x, y] = projection.project(lng, lat);
            cx += x; cy += y; n++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      const labelX = (minX + maxX) / 2;
      const labelY = (minY + maxY) / 2;
      return { name: f.properties.name, d: d.join(" "), labelX, labelY, w: maxX - minX, h: maxY - minY };
    });
  }, [features, projection]);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${projection.W} ${projection.H}`} width="100%" height={height} className="block">
        <defs>
          <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#161924" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="map-glow" cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor="rgba(245,184,0,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="region-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        <rect width={projection.W} height={projection.H} fill="url(#map-grid)" />
        <rect width={projection.W} height={projection.H} fill="url(#map-glow)" />

        {/* Region polygons */}
        {paths.map((p) => (
          <path
            key={p.name}
            d={p.d}
            fill={regionColor(p.name, hovered)}
            stroke="#2f3445"
            strokeWidth={hovered === p.name ? 1.4 : 0.8}
            onMouseEnter={() => setHovered(p.name)}
            onMouseLeave={() => setHovered(null)}
            style={{ transition: "fill 0.15s, stroke-width 0.15s", cursor: "default" }}
          />
        ))}

        {/* Region labels */}
        {showLabels &&
          paths.map((p) => {
            // Only show label if region has enough space
            if (p.w < 40 || p.h < 18) return null;
            return (
              <g key={`l-${p.name}`} pointerEvents="none">
                <text
                  x={p.labelX}
                  y={p.labelY}
                  fontSize={p.w > 110 ? 11 : 9}
                  fontWeight={500}
                  textAnchor="middle"
                  fill={hovered === p.name ? "#e8eaf0" : "#9aa0b0"}
                  style={{ transition: "fill 0.15s" }}
                >
                  {p.name}
                </text>
              </g>
            );
          })}

        {/* Project pins */}
        {projects.map((p) => {
          const [x, y] = projection.project(p.lng, p.lat);
          const color = p.risk === "high" ? "#ef4444" : p.risk === "med" ? "#f59e0b" : "#10b981";
          const isHovered = hoveredPin === p.id;
          return (
            <g
              key={p.id}
              onMouseEnter={() => setHoveredPin(p.id)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <Link href={`/projects/${p.id}`}>
                <g style={{ cursor: "pointer" }}>
                  <circle cx={x} cy={y} r={isHovered ? 14 : 9} fill={color} fillOpacity="0.18" />
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 7 : 5}
                    fill={color}
                    stroke="#0a0b0f"
                    strokeWidth="2"
                  />
                  {p.alerts > 0 && (
                    <circle cx={x + 5} cy={y - 5} r={3} fill="#ef4444" stroke="#0a0b0f" strokeWidth="1.5" />
                  )}
                </g>
              </Link>
              {isHovered && (
                <g pointerEvents="none">
                  <rect
                    x={x + 12}
                    y={y - 36}
                    width={236}
                    height={66}
                    rx={8}
                    fill="#13151d"
                    stroke="#222633"
                  />
                  <text x={x + 22} y={y - 18} fontSize="11" fill="#e8eaf0" fontWeight="600">
                    {p.name.length > 32 ? p.name.slice(0, 32) + "…" : p.name}
                  </text>
                  <text x={x + 22} y={y - 4} fontSize="9" fill="#9aa0b0">
                    {p.location} · Risk {p.riskScore}
                  </text>
                  <text x={x + 22} y={y + 12} fontSize="9" fill="#9aa0b0">
                    GHS {(p.budgetGHS / 1000).toFixed(0)}K · {p.progress}%
                  </text>
                  <text x={x + 22} y={y + 26} fontSize="9" fill="#f5b800">
                    {p.managedBy} ({p.managedByRelation})
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Compass / North arrow */}
        <g transform={`translate(${projection.W - 50}, 40)`} pointerEvents="none">
          <circle r="14" fill="#13151d" stroke="#222633" />
          <text y="-6" fontSize="9" textAnchor="middle" fill="#9aa0b0">N</text>
          <path d="M 0 4 L -3 -4 L 0 -1 L 3 -4 Z" fill="#f5b800" />
        </g>

        {/* Scale (approx) */}
        <g transform={`translate(30, ${projection.H - 36})`} pointerEvents="none">
          {(() => {
            const [x1] = projection.project(-1.0, 5.5);
            const [x2] = projection.project(0.0, 5.5);
            const widthPx = Math.abs(x2 - x1);
            const kmPerDeg = 111;
            const km = Math.round(kmPerDeg * 1);
            return (
              <>
                <line x1={0} y1={0} x2={widthPx} y2={0} stroke="#9aa0b0" strokeWidth="2" />
                <line x1={0} y1={-4} x2={0} y2={4} stroke="#9aa0b0" strokeWidth="2" />
                <line x1={widthPx} y1={-4} x2={widthPx} y2={4} stroke="#9aa0b0" strokeWidth="2" />
                <text x={widthPx / 2} y={-8} fontSize="10" textAnchor="middle" fill="#9aa0b0">
                  ≈ {km} km
                </text>
              </>
            );
          })()}
        </g>
      </svg>

      {showLegend && (
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 rounded-lg border border-line bg-bg-elev/85 p-3 backdrop-blur">
          <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Regional risk</div>
          <div className="space-y-1 text-[11px]">
            <Legend color="#ef4444" label="High (60+)" />
            <Legend color="#f59e0b" label="Medium (40-59)" />
            <Legend color="#10b981" label="Low (0-39)" />
            <Legend color="#9aa0b0" label="Project pin" border />
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-3 text-[9px] text-ink-muted opacity-80">
        Boundaries:{" "}
        <a
          href="https://www.geoboundaries.org/"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-ink-dim"
        >
          geoBoundaries
        </a>{" "}
        (CC BY 4.0) · Ghana ADM1, 16 regions
      </div>
    </div>
  );
}

function Legend({ color, label, border }: { color: string; label: string; border?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-ink-dim">
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: color, border: border ? `1px solid ${color}` : undefined }}
      />
      {label}
    </div>
  );
}
