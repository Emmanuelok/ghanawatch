"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Camera,
  Banknote,
  AlertTriangle,
  IdCard,
  Users,
  ScrollText,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";

export function RotatingHero({ words }: { words: { text: string; color: string }[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length]);
  const w = words[i];
  return (
    <span
      key={i}
      className="inline-block animate-slide-up"
      style={{ color: w.color }}
    >
      {w.text}
    </span>
  );
}

const TICKER_ITEMS = [
  { icon: ShieldCheck, color: "#10b981", text: "Diamond Cement receipt verified · 98% — Tamale 3-Bed Build" },
  { icon: AlertTriangle, color: "#ef4444", text: "Off-site photo flagged · 1.18 km from parcel — Kasoa 4-Bed" },
  { icon: Camera, color: "#f5b800", text: "Drone overhead by trustee F. Adeli — Ho poultry farm coop 80%" },
  { icon: IdCard, color: "#ec4899", text: "Diaspora user verified · Ghana Card + selfie liveness — Greater Accra" },
  { icon: Banknote, color: "#10b981", text: "Milestone 4 released · GHS 140K — Kasoa 4-Bed Build" },
  { icon: Users, color: "#8b5cf6", text: "Trustee Kojo Owusu accepted dispatch · ETA 24h — Kasoa" },
  { icon: ScrollText, color: "#3b82f6", text: "Daily Merkle root committed to Bitcoin · 0xae34f8…91d2c0" },
  { icon: AlertTriangle, color: "#f59e0b", text: "Forensic case opened · duplicate-receipt pattern — Adum Cosmetics" },
  { icon: ShieldCheck, color: "#10b981", text: "Korle Bu surgery bill cross-matched · 99% — GHS 18,500" },
  { icon: Sparkles, color: "#f5b800", text: "AI dossier generated for case-1 · East Legon Hills" },
];

export function LiveTicker() {
  return (
    <div className="ticker flex gap-12 whitespace-nowrap text-[13px]">
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((it, i) => {
        const I = it.icon;
        return (
          <span key={i} className="inline-flex items-center gap-2">
            <I className="h-3.5 w-3.5" style={{ color: it.color }} />
            <span className="text-ink-dim">{it.text}</span>
            <span className="text-ink-muted">·</span>
          </span>
        );
      })}
    </div>
  );
}

export function PersonaCard({
  href, icon: Icon, color, who, title, points, cta,
}: {
  href: string; icon: any; color: string; who: string; title: string; points: string[]; cta: string;
}) {
  return (
    <Link href={href} className="bento-card group flex flex-col p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">{who}</div>
      </div>
      <div className="mt-4 text-[18px] font-semibold leading-tight tracking-tight">{title}</div>
      <ul className="mt-3 space-y-1.5 text-[12.5px] text-ink-dim">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color }} />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-4">
        <div className="inline-flex items-center gap-1 text-[12px] font-semibold transition-transform group-hover:translate-x-1" style={{ color }}>
          {cta} <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}

export function BentoFeature({
  title, desc, icon: Icon, color, className = "", big, href,
}: {
  title: string; desc: string; icon: any; color: string; className?: string; big?: boolean; href: string;
}) {
  return (
    <Link href={href} className={`bento-card group relative flex flex-col p-5 ${className}`}>
      <div
        className="absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
        style={{ background: `radial-gradient(circle, ${color}, transparent 60%)` }}
      />
      <div className="relative">
        <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div className={`mt-4 font-semibold tracking-tight ${big ? "text-[22px]" : "text-[15px]"}`}>{title}</div>
        <p className={`mt-1 text-ink-dim ${big ? "text-[13.5px] leading-relaxed" : "text-[12px]"}`}>{desc}</p>
      </div>
      <div className="relative mt-auto pt-4">
        <ArrowRight className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export function AnimatedNumber({ to, decimals = 0, duration = 1400 }: { to: number; decimals?: number; duration?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{v.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}</>;
}
