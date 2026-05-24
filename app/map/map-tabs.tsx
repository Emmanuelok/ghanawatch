"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Layers, Globe } from "lucide-react";
import { GhanaMap } from "@/components/ghana-map";
import type { Project } from "@/lib/types";

const MapLibreMap = dynamic(() => import("@/components/maplibre-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[620px] place-items-center text-[12px] text-ink-muted">
      Loading interactive map…
    </div>
  ),
});

export function MapTabs({ projects }: { projects: Project[] }) {
  const [tab, setTab] = useState<"overview" | "tiles">("tiles");
  return (
    <>
      <div className="flex items-center gap-1 border-b border-line p-2">
        <button
          onClick={() => setTab("tiles")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] transition-colors ${
            tab === "tiles" ? "bg-bg-subtle text-ink" : "text-ink-dim hover:bg-bg-elev hover:text-ink"
          }`}
        >
          <Layers className="h-3.5 w-3.5" /> Interactive map (tiles)
        </button>
        <button
          onClick={() => setTab("overview")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] transition-colors ${
            tab === "overview" ? "bg-bg-subtle text-ink" : "text-ink-dim hover:bg-bg-elev hover:text-ink"
          }`}
        >
          <Globe className="h-3.5 w-3.5" /> Country overview (region heat)
        </button>
      </div>
      {tab === "tiles" ? (
        <MapLibreMap projects={projects} height={620} />
      ) : (
        <div className="p-2"><GhanaMap projects={projects} height={620} /></div>
      )}
    </>
  );
}
