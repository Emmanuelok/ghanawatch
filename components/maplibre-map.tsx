"use client";
import { useEffect, useRef, useState } from "react";
import maplibregl, { Map as MLMap } from "maplibre-gl";
import type { Project } from "@/lib/types";
import { PARCELS } from "@/lib/parcels";
import "maplibre-gl/dist/maplibre-gl.css";

type Style = "dark" | "light" | "satellite";

const STYLES: Record<Style, any> = {
  dark: {
    version: 8,
    sources: {
      base: {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        ],
        tileSize: 256,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attribution">CARTO</a>',
      },
    },
    layers: [
      { id: "bg", type: "background", paint: { "background-color": "#0e1116" } },
      { id: "base", type: "raster", source: "base" },
    ],
  },
  light: {
    version: 8,
    sources: {
      base: {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        ],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors © CARTO",
      },
    },
    layers: [
      { id: "bg", type: "background", paint: { "background-color": "#e8eaf0" } },
      { id: "base", type: "raster", source: "base" },
    ],
  },
  satellite: {
    version: 8,
    sources: {
      base: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "Tiles © Esri",
      },
    },
    layers: [
      { id: "bg", type: "background", paint: { "background-color": "#1a1d27" } },
      { id: "base", type: "raster", source: "base" },
    ],
  },
};

export default function MapLibreMap({
  projects,
  height = 620,
  initialCenter = [-1.2, 7.95],
  initialZoom = 6.2,
  showParcels = true,
  parcelProjectId,
}: {
  projects: Project[];
  height?: number;
  initialCenter?: [number, number];
  initialZoom?: number;
  showParcels?: boolean;
  parcelProjectId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const [style, setStyle] = useState<Style>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: STYLES[style],
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }), "bottom-left");
    map.addControl(new maplibregl.FullscreenControl(), "top-right");

    map.on("load", () => {
      setReady(true);
      buildLayers(map, projects, showParcels, parcelProjectId);
      // Attach pin interactions ONCE per map instance. They're delegated by
      // layer id ("pin-core"), so they keep working after style toggles even
      // though buildLayers recreates the layer.
      attachPinInteractions(map);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-style when toggle changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setStyle(STYLES[style]);
    map.once("styledata", () => {
      buildLayers(map, projects, showParcels, parcelProjectId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style, ready]);

  return (
    <div className="relative" style={{ height }}>
      <div ref={ref} className="h-full w-full overflow-hidden rounded-xl" />
      <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-lg border border-line bg-bg-elev/85 p-1 text-[11px] backdrop-blur">
        {(["dark", "light", "satellite"] as Style[]).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`rounded-md px-2 py-1 capitalize ${
              style === s ? "bg-bg-card text-ink" : "text-ink-dim hover:text-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// Attach hover-popup + click-navigation once per map instance. Listeners are
// delegated by layer id, so they persist across style toggles (which recreate
// the layer). Calling this more than once would stack duplicate handlers/popups.
function attachPinInteractions(map: MLMap) {
  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: "gw-popup",
    offset: 12,
  });
  map.on("mouseenter", "pin-core", (e) => {
    map.getCanvas().style.cursor = "pointer";
    const f = e.features?.[0];
    if (!f) return;
    const p = f.properties as any;
    const coords = (f.geometry as any).coordinates.slice();
    const html = `
      <div style="background:#13151d;border:1px solid #222633;border-radius:10px;padding:10px 12px;min-width:220px;color:#e8eaf0;font:500 12px/1.4 system-ui,-apple-system,sans-serif">
        <div style="font-weight:600;font-size:13px">${escapeHtml(p.name)}</div>
        <div style="color:#9aa0b0;font-size:11px;margin-top:2px">${escapeHtml(p.location)}</div>
        <div style="display:flex;justify-content:space-between;margin-top:8px;color:#9aa0b0;font-size:11px">
          <span>Risk <b style="color:${p.risk === 'high' ? '#ef4444' : p.risk === 'med' ? '#f59e0b' : '#10b981'}">${p.riskScore}</b></span>
          <span>${p.progress}%</span>
          <span>GHS ${(p.budgetGHS / 1000).toFixed(0)}K</span>
        </div>
        <div style="color:#f5b800;font-size:11px;margin-top:6px">${escapeHtml(p.managedBy)} (${escapeHtml(p.relation)})</div>
      </div>`;
    popup.setLngLat(coords).setHTML(html).addTo(map);
  });
  map.on("mouseleave", "pin-core", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
  map.on("click", "pin-core", (e) => {
    const f = e.features?.[0];
    if (!f) return;
    const p = f.properties as any;
    window.location.href = `/projects/${p.id}`;
  });
}

function buildLayers(map: MLMap, projects: Project[], showParcels: boolean, parcelProjectId?: string) {
  // Project pin source
  const pinsFC = {
    type: "FeatureCollection" as const,
    features: projects.map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
      properties: {
        id: p.id,
        name: p.name,
        risk: p.risk,
        riskScore: p.riskScore,
        alerts: p.alerts,
        location: p.location,
        budgetGHS: p.budgetGHS,
        progress: p.progress,
        managedBy: p.managedBy,
        relation: p.managedByRelation,
      },
    })),
  };

  if (!map.getSource("pins")) {
    map.addSource("pins", { type: "geojson", data: pinsFC });
  } else {
    (map.getSource("pins") as any).setData(pinsFC);
  }

  if (!map.getLayer("pin-halo")) {
    map.addLayer({
      id: "pin-halo",
      type: "circle",
      source: "pins",
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 10, 12, 22],
        "circle-color": [
          "match",
          ["get", "risk"],
          "high", "#ef4444",
          "med", "#f59e0b",
          "low", "#10b981",
          "#f5b800",
        ],
        "circle-opacity": 0.18,
      },
    });
  }
  if (!map.getLayer("pin-core")) {
    map.addLayer({
      id: "pin-core",
      type: "circle",
      source: "pins",
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 5, 12, 9],
        "circle-color": [
          "match",
          ["get", "risk"],
          "high", "#ef4444",
          "med", "#f59e0b",
          "low", "#10b981",
          "#f5b800",
        ],
        "circle-stroke-color": "#0a0b0f",
        "circle-stroke-width": 2,
      },
    });
  }

  // Parcels
  if (showParcels) {
    const parcelIds = parcelProjectId
      ? Object.keys(PARCELS).filter((k) => k === parcelProjectId)
      : Object.keys(PARCELS);

    const parcelFC = {
      type: "FeatureCollection" as const,
      features: parcelIds.map((k) => {
        const p = PARCELS[k];
        return {
          type: "Feature" as const,
          geometry: { type: "Polygon" as const, coordinates: [p.polygon] },
          properties: { id: k, name: p.meta.name, status: p.meta.status },
        };
      }),
    };
    if (!map.getSource("parcels")) {
      map.addSource("parcels", { type: "geojson", data: parcelFC });
    } else {
      (map.getSource("parcels") as any).setData(parcelFC);
    }
    if (!map.getLayer("parcels-fill")) {
      map.addLayer(
        {
          id: "parcels-fill",
          type: "fill",
          source: "parcels",
          paint: {
            "fill-color": [
              "match",
              ["get", "status"],
              "encroachment", "#ef4444",
              "disputed", "#f59e0b",
              "#10b981",
            ],
            "fill-opacity": 0.18,
          },
        },
        "pin-halo",
      );
    }
    if (!map.getLayer("parcels-outline")) {
      map.addLayer(
        {
          id: "parcels-outline",
          type: "line",
          source: "parcels",
          paint: {
            "line-color": [
              "match",
              ["get", "status"],
              "encroachment", "#ef4444",
              "disputed", "#f59e0b",
              "#10b981",
            ],
            "line-width": 2.5,
            "line-dasharray": [2, 2],
          },
        },
        "pin-halo",
      );
    }

    // Encroachment polygons
    const encFC = {
      type: "FeatureCollection" as const,
      features: parcelIds
        .map((k) => PARCELS[k])
        .filter((p) => p.meta.encroachment)
        .map((p) => ({
          type: "Feature" as const,
          geometry: { type: "Polygon" as const, coordinates: [p.meta.encroachment!.polygon] },
          properties: { note: p.meta.encroachment!.note },
        })),
    };
    if (encFC.features.length) {
      if (!map.getSource("encroach")) {
        map.addSource("encroach", { type: "geojson", data: encFC });
      } else {
        (map.getSource("encroach") as any).setData(encFC);
      }
      if (!map.getLayer("encroach-fill")) {
        map.addLayer({
          id: "encroach-fill",
          type: "fill",
          source: "encroach",
          paint: { "fill-color": "#ef4444", "fill-opacity": 0.55 },
        });
      }
      if (!map.getLayer("encroach-outline")) {
        map.addLayer({
          id: "encroach-outline",
          type: "line",
          source: "encroach",
          paint: { "line-color": "#ef4444", "line-width": 1.5 },
        });
      }
    }

    if (parcelProjectId && parcelIds.length === 1) {
      const p = PARCELS[parcelIds[0]];
      const lngs = p.polygon.map((c) => c[0]);
      const lats = p.polygon.map((c) => c[1]);
      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 80, maxZoom: 18, duration: 600 },
      );
    }
  }
}

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
