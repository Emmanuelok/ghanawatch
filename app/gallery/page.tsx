"use client";
import { useState } from "react";
import { Camera, MapPin, Calendar, Fingerprint, Download, Search, Filter, Grid3x3, Maximize2 } from "lucide-react";

type Photo = { id: string; project: string; trustee: string; ts: string; tags: string[]; verified: boolean; hash: string; gradient: string };

const PALETTE = [
  "linear-gradient(135deg, #14532d, #16a34a 60%, #facc15)",
  "linear-gradient(135deg, #1e3a8a, #0ea5e9 60%, #fde047)",
  "linear-gradient(135deg, #4c1d95, #c026d3 70%, #fb923c)",
  "linear-gradient(135deg, #7c2d12, #ea580c 60%, #facc15)",
  "linear-gradient(135deg, #064e3b, #10b981 60%, #f5b800)",
  "linear-gradient(135deg, #1e293b, #3b82f6 60%, #e879f9)",
  "linear-gradient(135deg, #581c87, #a855f7 60%, #fb923c)",
  "linear-gradient(135deg, #064e3b, #14b8a6 60%, #fbbf24)",
  "linear-gradient(135deg, #831843, #ec4899 60%, #fef08a)",
  "linear-gradient(135deg, #1f2937, #6b7280 60%, #fbbf24)",
];

function gen(n: number): Photo[] {
  const projs = ["Kasoa 4-bed", "East Legon Plot", "Tema Civic", "Adum Cosmetics", "Ho Poultry", "Korle Bu Care"];
  const trustees = ["Kojo Owusu", "Akua Yawson", "Fafa Adeli", "Esi Ofori", "Ato Bekoe"];
  const tags = ["lintel", "foundation", "blockwork", "roofing", "encroachment", "drone", "boundary", "coop", "yard"];
  const out: Photo[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      id: `ph-${i}`,
      project: projs[i % projs.length],
      trustee: trustees[i % trustees.length],
      ts: `2026-${String(5 - (i % 5)).padStart(2, "0")}-${String(((i * 3) % 28) + 1).padStart(2, "0")}`,
      tags: [tags[i % tags.length], tags[(i + 3) % tags.length]],
      verified: i % 7 !== 0,
      hash: `0x${(Math.abs(Math.sin(i) * 1e8) | 0).toString(16).padStart(8, "0")}…${(Math.abs(Math.cos(i) * 1e8) | 0).toString(16).padStart(4, "0")}`,
      gradient: PALETTE[i % PALETTE.length],
    });
  }
  return out;
}

const PHOTOS = gen(24);

export default function GalleryPage() {
  const [active, setActive] = useState<Photo | null>(null);
  const [q, setQ] = useState("");

  const filtered = PHOTOS.filter((p) => !q || p.project.toLowerCase().includes(q.toLowerCase()) || p.tags.join(" ").includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            <Camera className="h-3 w-3" /> Evidence gallery
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Every photo, organised + searchable.</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
            Stored in encrypted object storage. Each photo is hash-anchored to the project ledger
            and downloadable as part of a sealed evidence pack.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-ink-dim">
          <span>Object storage: <strong className="text-ink">11.4 TB</strong></span>
          <span>·</span>
          <span>{PHOTOS.length} shown of 14,872</span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search project, tag, trustee" className="input pl-9" />
        </div>
        <button className="btn btn-ghost text-[12px] py-2"><Filter className="h-3.5 w-3.5" /> Filter</button>
        <button className="btn btn-ghost text-[12px] py-2"><Grid3x3 className="h-3.5 w-3.5" /> Grid</button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {filtered.map((p) => (
          <button key={p.id} onClick={() => setActive(p)} className="group relative aspect-square overflow-hidden rounded-xl">
            <div className="absolute inset-0" style={{ background: p.gradient }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute left-2 top-2 flex flex-wrap gap-1">
              {p.tags.map((t) => <span key={t} className="rounded bg-black/50 px-1.5 py-0.5 text-[9px] font-medium text-white">{t}</span>)}
            </div>
            {p.verified && (
              <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-accent-green/85 text-[10px] text-white">✓</span>
            )}
            <div className="absolute bottom-2 left-2 right-2 text-[10px] text-white">
              <div className="truncate font-semibold">{p.project}</div>
              <div className="opacity-80">{p.ts} · {p.trustee}</div>
            </div>
            <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
              <Maximize2 className="h-5 w-5 text-white" />
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-6 backdrop-blur" onClick={() => setActive(null)}>
          <div className="card w-[min(900px,96vw)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video w-full" style={{ background: active.gradient }} />
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip uppercase" style={{ color: active.verified ? "#10b981" : "#f59e0b" }}>{active.verified ? "verified" : "pending"}</span>
                {active.tags.map((t) => <span key={t} className="chip text-[10px]">{t}</span>)}
              </div>
              <div className="mt-3 grid gap-2 text-[13px] md:grid-cols-2">
                <Row icon={MapPin} k="Project" v={active.project} />
                <Row icon={Calendar} k="Date" v={active.ts} />
                <Row icon={Camera} k="Captured by" v={active.trustee} />
                <Row icon={Fingerprint} k="Hash" v={active.hash} mono />
              </div>
              <div className="mt-4 flex gap-2">
                <button className="btn btn-primary text-[12px] py-1.5"><Download className="h-3.5 w-3.5" /> Download original</button>
                <button onClick={() => setActive(null)} className="btn btn-ghost text-[12px] py-1.5">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ icon: Icon, k, v, mono }: any) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" />
      <div className="min-w-0">
        <span className="text-ink-muted">{k}: </span>
        <span className={mono ? "hash-mono" : "text-ink"}>{v}</span>
      </div>
    </div>
  );
}
