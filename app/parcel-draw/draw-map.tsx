"use client";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { Pencil, Trash2, Check, Square, Ruler, Save, MapPin } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

// Same dark style used in the main map.
const DARK_STYLE: any = {
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
      attribution: "© OpenStreetMap contributors © CARTO",
    },
  },
  layers: [
    { id: "bg", type: "background", paint: { "background-color": "#0e1116" } },
    { id: "base", type: "raster", source: "base" },
  ],
};

type LngLat = [number, number];

export default function DrawMap() {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const pointsRef = useRef<LngLat[]>([]);
  const [points, setPoints] = useState<LngLat[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [closed, setClosed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: DARK_STYLE,
      center: [-0.1421, 5.6512], // East Legon
      zoom: 17,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new maplibregl.ScaleControl(), "bottom-left");
    map.addControl(new maplibregl.FullscreenControl(), "top-right");

    map.on("load", () => {
      map.addSource("draw-line", { type: "geojson", data: lineFC([]) });
      map.addSource("draw-fill", { type: "geojson", data: polyFC([]) });
      map.addSource("draw-pts", { type: "geojson", data: ptsFC([]) });
      map.addLayer({
        id: "draw-fill",
        type: "fill",
        source: "draw-fill",
        paint: { "fill-color": "#f5b800", "fill-opacity": 0.16 },
      });
      map.addLayer({
        id: "draw-line",
        type: "line",
        source: "draw-line",
        paint: { "line-color": "#f5b800", "line-width": 2 },
      });
      map.addLayer({
        id: "draw-pts",
        type: "circle",
        source: "draw-pts",
        paint: {
          "circle-radius": 5,
          "circle-color": "#f5b800",
          "circle-stroke-color": "#0a0b0f",
          "circle-stroke-width": 2,
        },
      });
    });

    map.on("click", (e) => {
      if (!drawingRef.current || closedRef.current) return;
      const lngLat: LngLat = [e.lngLat.lng, e.lngLat.lat];
      const next = [...pointsRef.current, lngLat];
      pointsRef.current = next;
      setPoints(next);
      updateLayers(map, next, false);
    });

    map.on("dblclick", (e) => {
      if (!drawingRef.current || pointsRef.current.length < 3) return;
      e.preventDefault();
      finish(map);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refs that mirror state for use in event handlers
  const drawingRef = useRef(false);
  const closedRef = useRef(false);
  useEffect(() => { drawingRef.current = drawing; }, [drawing]);
  useEffect(() => { closedRef.current = closed; }, [closed]);

  function start() {
    pointsRef.current = [];
    setPoints([]);
    setDrawing(true);
    setClosed(false);
    setSaved(false);
    const m = mapRef.current!;
    updateLayers(m, [], false);
  }

  function finish(map?: maplibregl.Map) {
    if (pointsRef.current.length < 3) return;
    setDrawing(false);
    setClosed(true);
    updateLayers(map ?? mapRef.current!, pointsRef.current, true);
  }

  function clear() {
    pointsRef.current = [];
    setPoints([]);
    setDrawing(false);
    setClosed(false);
    setSaved(false);
    const m = mapRef.current;
    if (m) updateLayers(m, [], false);
  }

  function save() {
    setSaved(true);
  }

  // Search → centre on a Ghana point (rough mock: a few well-known places)
  function goTo(place: string) {
    const points: Record<string, LngLat> = {
      "east legon": [-0.1421, 5.6512],
      "kasoa": [-0.4156, 5.5421],
      "kumasi adum": [-1.6244, 6.6884],
      "tema port": [0.012, 5.671],
      "ho": [0.471, 6.612],
      "korle bu": [-0.2295, 5.5358],
      "tamale": [-0.8393, 9.4008],
      "takoradi": [-1.7554, 4.8845],
    };
    const k = Object.keys(points).find((p) => place.toLowerCase().includes(p));
    if (k) {
      const m = mapRef.current;
      if (m) m.flyTo({ center: points[k], zoom: 17, essential: true });
    }
  }

  const area = closed ? polygonAreaSqM(points) : 0;
  const centroid = closed && points.length ? avg(points) : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <div className="flex items-center gap-2 rounded-md border border-line bg-bg-elev px-3 py-1.5 text-[12px]">
            <MapPin className="h-3.5 w-3.5 text-ink-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") goTo(search); }}
              placeholder="Jump to (Kasoa, East Legon, Ho, Tamale…)"
              className="bg-transparent text-[12px] outline-none placeholder:text-ink-muted w-56"
            />
            <button onClick={() => goTo(search)} className="text-[11px] text-ink-dim hover:text-ink">Go</button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {!drawing && !closed && (
              <button onClick={start} className="btn btn-primary text-[12px] py-1.5"><Pencil className="h-3.5 w-3.5" /> Start drawing</button>
            )}
            {drawing && (
              <>
                <span className="chip">{points.length} point{points.length === 1 ? "" : "s"} dropped</span>
                <button onClick={() => finish()} disabled={points.length < 3} className="btn btn-primary text-[12px] py-1.5 disabled:opacity-40">
                  <Check className="h-3.5 w-3.5" /> Finish (or double-click)
                </button>
              </>
            )}
            {(closed || points.length > 0) && (
              <button onClick={clear} className="btn btn-ghost text-[12px] py-1.5"><Trash2 className="h-3.5 w-3.5" /> Clear</button>
            )}
          </div>
        </div>
        <div ref={ref} className="h-[640px]" />
      </div>

      <div className="space-y-4">
        <div className="card p-5">
          <div className="text-[14px] font-semibold">Boundary stats</div>
          {closed ? (
            <div className="mt-3 space-y-2 text-[12px]">
              <Row k="Vertices" v={`${points.length}`} />
              <Row k="Area" v={`${(area).toLocaleString(undefined, { maximumFractionDigits: 0 })} m² · ${(area / 4046.86).toFixed(2)} acres`} />
              <Row k="Centroid" v={centroid ? `${centroid[1].toFixed(5)}, ${centroid[0].toFixed(5)}` : "—"} />
              <Row k="Perimeter" v={`${(perimeter(points)).toFixed(0)} m`} />
            </div>
          ) : (
            <div className="mt-2 text-[12px] text-ink-dim">
              {drawing
                ? "Click on the map to drop corner points. Need ≥3 points to close."
                : "Start drawing to begin."}
            </div>
          )}
        </div>

        {closed && (
          <div className="card p-5">
            <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><Save className="h-4 w-4 text-accent-gold" /> Anchor to ledger</div>
            <p className="text-[12px] text-ink-dim">
              We hash this GeoJSON and anchor it to a project's audit ledger. Every future site
              photo's GPS gets checked against it (off-parcel photos auto-flag).
            </p>
            <button onClick={save} disabled={saved} className="btn btn-primary mt-4 w-full justify-center disabled:opacity-50">
              {saved ? <><Check className="h-4 w-4" /> Anchored</> : <><Save className="h-4 w-4" /> Save & anchor</>}
            </button>
          </div>
        )}

        {closed && (
          <div className="card p-5">
            <div className="mb-2 text-[14px] font-semibold">GeoJSON</div>
            <pre className="max-h-48 overflow-auto rounded-md bg-bg-elev/60 p-3 text-[10.5px] text-ink-dim">
{JSON.stringify({ type: "Polygon", coordinates: [[...points, points[0]]] }, null, 2)}
            </pre>
          </div>
        )}

        <div className="card p-5 text-[12px] text-ink-dim">
          <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-ink">
            <Square className="h-4 w-4 text-accent-gold" /> Tips
          </div>
          <ul className="space-y-1.5">
            <li>· Zoom in (mouse-wheel) before placing points for precision.</li>
            <li>· Try to walk the boundary with the manager on GhanaWatch mobile if possible — phone GPS gives the most accurate corners.</li>
            <li>· You can still record a parcel without walking — use this drawer plus the licensed surveyor's site plan reference.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function updateLayers(map: maplibregl.Map, pts: LngLat[], closed: boolean) {
  if (!map.getSource("draw-pts")) return;
  (map.getSource("draw-pts") as any).setData(ptsFC(pts));
  const lineCoords = closed && pts.length > 2 ? [...pts, pts[0]] : pts;
  (map.getSource("draw-line") as any).setData(lineFC(lineCoords));
  if (closed && pts.length > 2) {
    (map.getSource("draw-fill") as any).setData(polyFC(pts));
  } else {
    (map.getSource("draw-fill") as any).setData(polyFC([]));
  }
}

function ptsFC(pts: LngLat[]) {
  return {
    type: "FeatureCollection" as const,
    features: pts.map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: p },
      properties: {},
    })),
  };
}
function lineFC(pts: LngLat[]) {
  return {
    type: "FeatureCollection" as const,
    features: pts.length >= 2 ? [{ type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: pts }, properties: {} }] : [],
  };
}
function polyFC(pts: LngLat[]) {
  if (pts.length < 3) return { type: "FeatureCollection" as const, features: [] };
  return {
    type: "FeatureCollection" as const,
    features: [{ type: "Feature" as const, geometry: { type: "Polygon" as const, coordinates: [[...pts, pts[0]]] }, properties: {} }],
  };
}

function polygonAreaSqM(pts: LngLat[]): number {
  if (pts.length < 3) return 0;
  // Spherical excess approximation (Shoelace with degree→metre at the centroid latitude)
  const lats = pts.map((p) => p[1]);
  const meanLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const mPerDegLat = 110_574;
  const mPerDegLng = 111_320 * Math.cos((meanLat * Math.PI) / 180);
  const cartesian = pts.map(([lng, lat]) => [lng * mPerDegLng, lat * mPerDegLat] as const);
  let sum = 0;
  for (let i = 0; i < cartesian.length; i++) {
    const [x1, y1] = cartesian[i];
    const [x2, y2] = cartesian[(i + 1) % cartesian.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

function perimeter(pts: LngLat[]): number {
  if (pts.length < 2) return 0;
  const ring = [...pts, pts[0]];
  const lats = pts.map((p) => p[1]);
  const meanLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const mPerDegLat = 110_574;
  const mPerDegLng = 111_320 * Math.cos((meanLat * Math.PI) / 180);
  let d = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const dx = (ring[i + 1][0] - ring[i][0]) * mPerDegLng;
    const dy = (ring[i + 1][1] - ring[i][1]) * mPerDegLat;
    d += Math.hypot(dx, dy);
  }
  return d;
}

function avg(pts: LngLat[]): LngLat {
  const x = pts.reduce((a, b) => a + b[0], 0) / pts.length;
  const y = pts.reduce((a, b) => a + b[1], 0) / pts.length;
  return [x, y];
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ink-muted">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}
