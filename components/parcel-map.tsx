"use client";
import dynamic from "next/dynamic";
import type { Project } from "@/lib/types";

const MapLibreMap = dynamic(() => import("@/components/maplibre-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[420px] place-items-center text-[12px] text-ink-muted">Loading map…</div>
  ),
});

export function ParcelMap({ project }: { project: Project }) {
  return (
    <MapLibreMap
      projects={[project]}
      height={460}
      initialCenter={[project.lng, project.lat]}
      initialZoom={17}
      parcelProjectId={project.id}
    />
  );
}
