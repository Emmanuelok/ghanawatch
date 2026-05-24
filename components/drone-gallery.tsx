"use client";
import { useState } from "react";
import { Camera, Play, Calendar, MapPin, Fingerprint, Ruler } from "lucide-react";
import type { Project } from "@/lib/types";

type Capture = {
  id: string;
  ts: string;
  altitudeM: number;
  durationSec: number;
  coverageSqm: number;
  trustee: string;
  hash: string;
};

function captures(projectId: string): Capture[] {
  const now = new Date("2026-05-24T09:00:00Z").getTime();
  const minus = (d: number) => new Date(now - d * 86400000).toISOString();
  return [
    { id: `dr-1-${projectId}`, ts: minus(2), altitudeM: 35, durationSec: 187, coverageSqm: 2400, trustee: "Akua Yawson", hash: "0x4f1c…a82b" },
    { id: `dr-2-${projectId}`, ts: minus(18), altitudeM: 40, durationSec: 220, coverageSqm: 2400, trustee: "Akua Yawson", hash: "0x9b2e…71fa" },
    { id: `dr-3-${projectId}`, ts: minus(45), altitudeM: 30, durationSec: 165, coverageSqm: 2400, trustee: "Kojo Owusu", hash: "0x77c8…2ee0" },
    { id: `dr-4-${projectId}`, ts: minus(75), altitudeM: 50, durationSec: 240, coverageSqm: 2400, trustee: "Kojo Owusu", hash: "0xab19…44d3" },
  ];
}

const PALETTE = [
  "linear-gradient(135deg, #14532d, #16a34a 60%, #facc15)",
  "linear-gradient(135deg, #1e3a8a, #0ea5e9 60%, #fde047)",
  "linear-gradient(135deg, #4c1d95, #c026d3 70%, #fb923c)",
  "linear-gradient(135deg, #064e3b, #10b981 60%, #f5b800)",
];

export function DroneGallery({ project }: { project: Project }) {
  const list = captures(project.id);
  const [active, setActive] = useState(list[0]);

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="card overflow-hidden">
        {/* Big "video" tile */}
        <div className="relative aspect-video w-full" style={{ background: PALETTE[list.indexOf(active) % PALETTE.length] }}>
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-bg/40 backdrop-blur">
              <Play className="ml-1 h-7 w-7 text-white" />
            </div>
          </div>
          <div className="absolute left-4 top-4 flex flex-col gap-1.5">
            <span className="chip" style={{ background: "rgba(0,0,0,0.55)", borderColor: "transparent", color: "#fff" }}>
              <Camera className="h-3 w-3" /> drone overhead
            </span>
            <span className="chip" style={{ background: "rgba(0,0,0,0.55)", borderColor: "transparent", color: "#fff" }}>
              <MapPin className="h-3 w-3" /> {project.lat.toFixed(4)}, {project.lng.toFixed(4)}
            </span>
          </div>
          <div className="absolute bottom-4 right-4 text-right text-[11px] text-white/85">
            {active.altitudeM}m altitude · {active.durationSec}s · {active.coverageSqm.toLocaleString()} m²
          </div>
        </div>

        <div className="p-5">
          <div className="text-[14px] font-semibold">
            {new Date(active.ts).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
          </div>
          <div className="mt-1 text-[12px] text-ink-dim">Captured by trustee {active.trustee}</div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[12px] md:grid-cols-4">
            <Stat icon={Calendar} label="Captured" value={active.ts.slice(0, 10)} />
            <Stat icon={Ruler} label="Altitude" value={`${active.altitudeM} m`} />
            <Stat icon={Play} label="Duration" value={`${active.durationSec}s`} />
            <Stat icon={Fingerprint} label="Hash" value={active.hash} mono />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Capture timeline ({list.length})</div>
        <div className="divide-y divide-line">
          {list.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className={`flex w-full items-center gap-3 px-5 py-3 text-left transition-colors ${
                active.id === c.id ? "bg-bg-elev/60" : "hover:bg-bg-elev/40"
              }`}
            >
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded" style={{ background: PALETTE[i % PALETTE.length] }} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-semibold">{new Date(c.ts).toLocaleDateString("en-GB", { dateStyle: "medium" })}</div>
                <div className="text-[11px] text-ink-muted">{c.trustee} · {c.altitudeM}m · {c.durationSec}s</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, mono }: any) {
  return (
    <div className="rounded-md border border-line bg-bg-elev/40 p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-ink-muted">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`mt-1 text-[12.5px] text-ink ${mono ? "hash-mono" : ""}`}>{value}</div>
    </div>
  );
}
