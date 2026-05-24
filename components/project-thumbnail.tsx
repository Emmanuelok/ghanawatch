import { SectorIcon } from "./sector-icon";
import type { Sector } from "@/lib/types";

export function ProjectThumbnail({ sector, label }: { sector: Sector; label?: string }) {
  // Decorative SVG-only thumbnail (no external images)
  const bg: Record<Sector, string> = {
    construction: "from-amber-500/20 via-amber-500/5 to-transparent",
    "real-estate": "from-emerald-500/20 via-emerald-500/5 to-transparent",
    "vehicle-import": "from-blue-500/20 via-blue-500/5 to-transparent",
    business: "from-violet-500/20 via-violet-500/5 to-transparent",
    education: "from-pink-500/20 via-pink-500/5 to-transparent",
    funeral: "from-slate-500/20 via-slate-500/5 to-transparent",
    medical: "from-red-500/20 via-red-500/5 to-transparent",
    agriculture: "from-green-500/20 via-green-500/5 to-transparent",
    remittance: "from-cyan-500/20 via-cyan-500/5 to-transparent",
  };
  return (
    <div
      className={`relative grid h-32 w-full place-items-center overflow-hidden rounded-t-[13px] bg-gradient-to-br ${bg[sector]}`}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="200" height="100" fill="url(#grid)" />
      </svg>
      <div className="grid h-14 w-14 place-items-center rounded-full border border-line bg-bg/60 backdrop-blur">
        <SectorIcon sector={sector} size={26} />
      </div>
      {label && (
        <div className="absolute bottom-2 left-3 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          {label}
        </div>
      )}
    </div>
  );
}
