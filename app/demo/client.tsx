"use client";
import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Camera,
  FileText,
  Users,
  Banknote,
  Stamp,
  Gavel,
  Check,
} from "lucide-react";

const BEATS = [
  { t: "Day 0", actor: "Akosua Mensah", color: "#f5b800", icon: Sparkles, body: "Launches the project: 4-bedroom family home in Kasoa. Identity verified. GHS 685K escrow funded via Wise → Stanbic trust account." },
  { t: "Day 0", actor: "Kwame Mensah (brother)", color: "#3b82f6", icon: Users, body: "Receives WhatsApp invite. Verifies Ghana Card. Assembly Member attests residence in Akweley. Manager-side KYC complete." },
  { t: "Day 4", actor: "GhanaWatch", color: "#10b981", icon: ShieldCheck, body: "Trustee Kojo Owusu (MGhIS) accepts dispatch. Site-clearing milestone verified. Disburses GHS 22K to manager." },
  { t: "Day 38", actor: "Kwame Mensah", color: "#3b82f6", icon: Camera, body: "Uploads site photo — first-floor blockwork. Geo-stamp confirms on parcel. Scene-match 91% vs prior verified images." },
  { t: "Day 41", actor: "Kwame Mensah", color: "#3b82f6", icon: FileText, body: "Uploads cement receipt — GHS 14,400 for 45 bags from Diamond Cement." },
  { t: "Day 41", actor: "GhanaWatch AI", color: "#ef4444", icon: AlertTriangle, body: "Cement receipt flagged — 41% authenticity. Pixel tampering in the total field; font shifts Helvetica→Arial mid-document. Routes to analyst review." },
  { t: "Day 42", actor: "Ama Sarpong (analyst, Bar-GH 2014-822)", color: "#8b5cf6", icon: ShieldCheck, body: "Reviews. Confirms AI verdict. Recommends pause + trustee dispatch for surprise count." },
  { t: "Day 43", actor: "Kojo Owusu (Trustee)", color: "#10b981", icon: Camera, body: "Surprise visit. Photographs cement stack: only 45 bags on site. Calls Diamond Cement directly — confirms GHS 14,400 was never invoiced; legit price for 45 bags is GHS 4,725. Manager admits to mark-up." },
  { t: "Day 43", actor: "Akosua Mensah", color: "#f5b800", icon: Gavel, body: "Opens dispute via the project page. Funds for Milestone 5 auto-pause in escrow." },
  { t: "Day 45", actor: "GhanaWatch ADR", color: "#8b5cf6", icon: Users, body: "Mediation room scheduled. Kwame, Akosua, Esi Ofori (counsel), Kojo Owusu (witness) — all attend." },
  { t: "Day 49", actor: "Mediator (Hon. K. Ofori)", color: "#10b981", icon: Check, body: "Settlement: Kwame refunds GHS 9,675 + agrees to direct-to-vendor escrow disbursement for all future material purchases. Dispute resolved in-favour-claimant." },
  { t: "Day 50", actor: "GhanaWatch", color: "#f5b800", icon: Stamp, body: "Project resumes. Daily audit ledger commits Merkle root to Bitcoin + Polygon. Project trust score: 71 → 84." },
];

const ICON_MAP = { Sparkles, Users, ShieldCheck, Camera, FileText, AlertTriangle, Gavel, Check, Stamp, Banknote } as any;

export function DemoClient() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (idx >= BEATS.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setIdx((i) => i + 1), 3200);
    return () => clearTimeout(t);
  }, [playing, idx]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="card overflow-hidden">
        <div className="relative aspect-video w-full p-10" style={{ background: `radial-gradient(ellipse at 30% 30%, ${BEATS[idx].color}30, transparent 60%), radial-gradient(ellipse at 70% 70%, ${BEATS[idx].color}15, transparent 60%)` }}>
          <div className="absolute left-6 top-6 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            Beat {idx + 1} / {BEATS.length} · {BEATS[idx].t}
          </div>
          <div className="grid h-full place-items-center">
            <div className="max-w-md text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-bg-elev/60 backdrop-blur" style={{ color: BEATS[idx].color }}>
                {(() => { const I = BEATS[idx].icon as any; return <I className="h-7 w-7" />; })()}
              </div>
              <div className="mt-4 text-[12px] uppercase tracking-[0.12em] text-ink-muted">{BEATS[idx].actor}</div>
              <p className="mt-3 text-[15px] leading-relaxed text-ink">{BEATS[idx].body}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 border-t border-line p-4">
          <button onClick={() => setIdx(0)} className="btn btn-ghost text-[12px] py-1.5"><SkipBack className="h-3.5 w-3.5" /> Restart</button>
          <button onClick={() => setIdx((i) => Math.max(0, i - 1))} className="btn btn-ghost text-[12px] py-1.5">Previous</button>
          <button onClick={() => setPlaying((p) => !p)} className="btn btn-primary text-[12px] py-1.5">
            {playing ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Auto-play</>}
          </button>
          <button onClick={() => setIdx((i) => Math.min(BEATS.length - 1, i + 1))} className="btn btn-ghost text-[12px] py-1.5">Next</button>
          <button onClick={() => setIdx(BEATS.length - 1)} className="btn btn-ghost text-[12px] py-1.5"><SkipForward className="h-3.5 w-3.5" /> End</button>
        </div>
      </div>

      <aside className="card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">All beats</div>
        <div className="max-h-[640px] divide-y divide-line overflow-y-auto scroll-shadow">
          {BEATS.map((b, i) => {
            const I = b.icon as any;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left ${i === idx ? "bg-bg-elev/60" : "hover:bg-bg-elev/40"}`}
              >
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md" style={{ background: `${b.color}15`, color: b.color }}>
                  <I className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-ink-muted">
                    <span className="font-mono">{b.t}</span>
                    <span>·</span>
                    <span>{b.actor}</span>
                  </div>
                  <div className={`mt-0.5 line-clamp-2 text-[12px] ${i === idx ? "font-semibold text-ink" : "text-ink-dim"}`}>{b.body}</div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
