import {
  HardHat,
  LandPlot,
  Car,
  Briefcase,
  GraduationCap,
  Flower2,
  HeartPulse,
  Wheat,
  Banknote,
} from "lucide-react";
import type { Sector } from "@/lib/types";

const map: Record<Sector, { icon: any; label: string; color: string }> = {
  construction: { icon: HardHat, label: "Construction", color: "#f5b800" },
  "real-estate": { icon: LandPlot, label: "Real Estate / Land", color: "#00a86b" },
  "vehicle-import": { icon: Car, label: "Vehicle Import", color: "#3b82f6" },
  business: { icon: Briefcase, label: "Business / Venture", color: "#8b5cf6" },
  education: { icon: GraduationCap, label: "Education", color: "#ec4899" },
  funeral: { icon: Flower2, label: "Funeral", color: "#94a3b8" },
  medical: { icon: HeartPulse, label: "Medical Care", color: "#ef4444" },
  agriculture: { icon: Wheat, label: "Agriculture", color: "#22c55e" },
  remittance: { icon: Banknote, label: "Remittance", color: "#06b6d4" },
};

export function SectorIcon({ sector, size = 18 }: { sector: Sector; size?: number }) {
  const m = map[sector];
  const Icon = m.icon;
  return <Icon size={size} style={{ color: m.color }} />;
}

export function SectorBadge({ sector }: { sector: Sector }) {
  const m = map[sector];
  const Icon = m.icon;
  return (
    <span
      className="chip"
      style={{ color: m.color, borderColor: `${m.color}30`, background: `${m.color}10` }}
    >
      <Icon size={12} />
      {m.label}
    </span>
  );
}

export const SECTOR_META = map;
