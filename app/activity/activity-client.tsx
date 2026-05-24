"use client";
import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Camera,
  FileText,
  Banknote,
  Users,
  AlertTriangle,
  IdCard,
  Settings,
  Pause,
  Play,
} from "lucide-react";
import { LIVE_EVENTS } from "@/lib/mock-data";
import type { LiveEvent } from "@/lib/types";

const ICON = {
  verify: ShieldCheck,
  site: Camera,
  doc: FileText,
  payment: Banknote,
  trustee: Users,
  case: AlertTriangle,
  kyc: IdCard,
  system: Settings,
} as const;

const COLOR: Record<string, string> = {
  verify: "#10b981",
  site: "#f5b800",
  doc: "#3b82f6",
  payment: "#10b981",
  trustee: "#8b5cf6",
  case: "#ef4444",
  kyc: "#ec4899",
  system: "#9aa0b0",
};

const TEMPLATES: Omit<LiveEvent, "id" | "ts">[] = [
  { category: "verify", message: "Receipt verified for Aluworks roofing sheets order (97% authenticity)", region: "Eastern", amountGHS: 18200 },
  { category: "site", message: "Geo-stamped photo passed scene-match check (94%) — Kumasi shop fit-out", region: "Ashanti" },
  { category: "doc", message: "GRA duty receipt cross-matched with portal — Tema-bound Toyota Camry", region: "Greater Accra" },
  { category: "kyc", message: "Manager KYC complete — Ghana Card + Assembly Member attestation", region: "Volta" },
  { category: "case", message: "Forensic case opened — duplicate-signature pattern on funeral vendor invoices", region: "Western" },
  { category: "trustee", message: "Trustee Akua Yawson accepted boundary verification job (East Legon)", region: "Greater Accra" },
  { category: "payment", message: "Milestone released — Tamale SHS school fees term 2", region: "Northern", amountGHS: 4500 },
  { category: "verify", message: "Indenture cross-checked with Lands Commission — clean", region: "Central" },
  { category: "site", message: "Off-site photo flagged — 800m from registered parcel", region: "Greater Accra" },
  { category: "kyc", message: "Diaspora user verified — selfie liveness passed, 96% match", region: "Greater Accra" },
  { category: "doc", message: "Korle Bu surgery receipt verified against hospital portal", region: "Greater Accra", amountGHS: 12300 },
  { category: "trustee", message: "Drone overhead by Trustee F. Adeli — Ho poultry farm", region: "Volta" },
  { category: "verify", message: "Vehicle VIN cross-matched between BoL, GRA portal and dashboard photo", region: "Greater Accra" },
  { category: "system", message: "Hourly audit hash committed across 1,487 active projects" },
  { category: "case", message: "Hometown association alert: 3 East Legon Hills overlaps in 14 days", region: "Greater Accra" },
  { category: "payment", message: "Escrow funded — GHS 320,000 for Adum cosmetics shop expansion", region: "Ashanti", amountGHS: 320000 },
];

export function ActivityFeed() {
  const [events, setEvents] = useState<LiveEvent[]>(LIVE_EVENTS);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const seq = useRef(LIVE_EVENTS.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      seq.current += 1;
      const t = TEMPLATES[seq.current % TEMPLATES.length];
      const ev: LiveEvent = {
        ...t,
        id: `live-${seq.current}`,
        ts: new Date().toISOString(),
      };
      setEvents((prev) => [ev, ...prev].slice(0, 60));
    }, 3200);
    return () => clearInterval(id);
  }, [paused]);

  const filtered = filter === "all" ? events : events.filter((e) => e.category === filter);

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setPaused((p) => !p)} className="btn btn-ghost text-[12px] py-1.5">
          {paused ? <><Play className="h-3.5 w-3.5" /> Resume</> : <><Pause className="h-3.5 w-3.5" /> Pause</>}
        </button>
        <span className="chip">
          <span className={`grid h-1.5 w-1.5 place-items-center rounded-full ${paused ? "bg-ink-muted" : "bg-accent-green animate-pulse"}`} />
          {paused ? "Paused" : "Streaming"}
        </span>
        <div className="ml-auto flex items-center gap-1 overflow-x-auto rounded-lg border border-line bg-bg-elev p-1 text-[11px]">
          {["all", "verify", "site", "doc", "payment", "kyc", "trustee", "case", "system"].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`whitespace-nowrap rounded-md px-2.5 py-1 capitalize ${
                filter === c ? "bg-bg-card text-ink" : "text-ink-dim hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="divide-y divide-line max-h-[640px] overflow-y-auto scroll-shadow">
          {filtered.map((e, i) => {
            const Icon = ICON[e.category];
            const color = COLOR[e.category];
            const fresh = i === 0 && !paused;
            return (
              <div
                key={e.id}
                className={`flex items-start gap-3 px-5 py-3 transition-colors ${fresh ? "animate-slide-up bg-accent-gold/5" : ""}`}
              >
                <div
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md"
                  style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] text-ink">{e.message}</div>
                  <div className="mt-0.5 text-[11px] text-ink-muted">
                    {e.region && <>{e.region} · </>}
                    {fresh ? "just now" : relTime(e.ts)}
                    {e.amountGHS && <> · GHS {e.amountGHS.toLocaleString()}</>}
                  </div>
                </div>
                <span className="chip uppercase text-[10px]">{e.category}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function relTime(iso: string) {
  const t = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - t);
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
