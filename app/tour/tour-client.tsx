"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ScanFace,
  Sparkles,
  Camera,
  Banknote,
  Users,
  ShieldCheck,
  ScrollText,
  Share2,
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Verify your identity", icon: ScanFace, body: "Ghana Card / passport, selfie liveness, phone OTP, AML watchlist scan — all in 4 minutes.", cta: { label: "Open identity", href: "/identity" }, color: "#f5b800" },
  { id: 2, title: "Launch your first project", icon: Sparkles, body: "Sector-tailored intake. We pre-load milestones, document templates, and recommend the right trustee.", cta: { label: "Onboarding wizard", href: "/onboarding" }, color: "#10b981" },
  { id: 3, title: "Invite the manager via WhatsApp", icon: Users, body: "Your brother / contractor / aunt joins through the GhanaWatch bot — no new app to install.", cta: { label: "Manager bot preview", href: "/manager" }, color: "#3b82f6" },
  { id: 4, title: "Capture site evidence", icon: Camera, body: "Every photo is geo-stamped, scene-matched, hash-anchored. Off-site or off-scene? Auto-flagged.", cta: { label: "See site evidence", href: "/projects/kasoa-4bed" }, color: "#8b5cf6" },
  { id: 5, title: "Forensic-verify every document", icon: ShieldCheck, body: "Claude vision reads the receipt; pixel tampering, font drift, AI-generation probability — all scored.", cta: { label: "Try the verifier", href: "/verify" }, color: "#ef4444" },
  { id: 6, title: "Release on milestone evidence only", icon: Banknote, body: "Funds in escrow release only when trustee + AI + your biometric all agree.", cta: { label: "Funding flow", href: "/funding" }, color: "#f5b800" },
  { id: 7, title: "Audit-ledger every event", icon: ScrollText, body: "Daily Merkle root anchored to Bitcoin and Polygon. Verifiable forever.", cta: { label: "Chain anchor", href: "/anchor" }, color: "#10b981" },
  { id: 8, title: "Share a public verification card", icon: Share2, body: "One link to prove to family / lawyer / bank that everything is under independent verification.", cta: { label: "See a public card", href: "/v/east-legon-plot" }, color: "#3b82f6" },
];

export function TourClient() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (active >= STEPS.length - 1) {
        setPlaying(false);
        return;
      }
      setActive((a) => a + 1);
    }, 3000);
    return () => clearTimeout(t);
  }, [playing, active]);

  const step = STEPS[active];
  const Icon = step.icon;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="card overflow-hidden">
        {/* Big preview tile */}
        <div className="relative aspect-video w-full p-10" style={{ background: `radial-gradient(ellipse at 30% 30%, ${step.color}30, transparent 60%), radial-gradient(ellipse at 70% 70%, ${step.color}15, transparent 60%)` }}>
          <div className="absolute left-6 top-6 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            <span className="font-mono">{String(active + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}</span>
          </div>
          <div className="grid h-full place-items-center">
            <div className="text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-bg-elev/60 backdrop-blur" style={{ color: step.color }}>
                <Icon className="h-10 w-10" />
              </div>
              <h2 className="mt-5 max-w-md text-balance text-3xl font-semibold tracking-tight">{step.title}</h2>
              <p className="mx-auto mt-3 max-w-md text-[14px] text-ink-dim">{step.body}</p>
              <Link href={step.cta.href} className="btn btn-primary mt-6">{step.cta.label} <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 border-t border-line p-4">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="btn btn-primary text-[12px] py-1.5"
          >
            {playing ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Auto-play</>}
          </button>
          <button onClick={() => { setActive(0); setPlaying(false); }} className="btn btn-ghost text-[12px] py-1.5"><RotateCcw className="h-3.5 w-3.5" /> Reset</button>
          <div className="ml-auto flex items-center gap-2">
            <button disabled={active === 0} onClick={() => setActive((a) => Math.max(0, a - 1))} className="btn btn-ghost text-[12px] py-1.5 disabled:opacity-40">← Previous</button>
            <button disabled={active === STEPS.length - 1} onClick={() => setActive((a) => Math.min(STEPS.length - 1, a + 1))} className="btn btn-ghost text-[12px] py-1.5 disabled:opacity-40">Next →</button>
          </div>
        </div>

        {/* Progress strip */}
        <div className="flex gap-1 border-t border-line p-3">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="h-1 flex-1 rounded-full overflow-hidden bg-bg-subtle"
            >
              <div
                className="h-full transition-all"
                style={{
                  width: i < active ? "100%" : i === active ? "100%" : "0%",
                  background: i <= active ? STEPS[i].color : "transparent",
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <aside className="card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">All steps</div>
        <div className="divide-y divide-line max-h-[520px] overflow-y-auto scroll-shadow">
          {STEPS.map((s, i) => {
            const I = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={`flex w-full items-start gap-3 px-5 py-3 text-left transition-colors ${
                  active === i ? "bg-bg-elev/60" : "hover:bg-bg-elev/40"
                }`}
              >
                <div
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
                  style={{ background: `${s.color}15`, color: s.color }}
                >
                  <I className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-[12.5px] ${active === i ? "font-semibold text-ink" : "text-ink-dim"}`}>{s.title}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
