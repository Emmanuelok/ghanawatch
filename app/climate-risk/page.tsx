import { ClimateClient } from "./client";
import { CloudRain } from "lucide-react";

export const metadata = { title: "Climate & infrastructure risk — GhanaWatch" };

export default function ClimateRiskPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <CloudRain className="h-3 w-3" /> Climate & infrastructure overlay
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Climate & infrastructure risk overlay.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Layer flood zones, coastal erosion, ECG grid coverage, road quality, and projected sea
          level rise over Ghana's regions. Useful when picking where to build, or assessing
          existing exposure on land you already hold.
        </p>
      </div>
      <ClimateClient />
    </div>
  );
}
