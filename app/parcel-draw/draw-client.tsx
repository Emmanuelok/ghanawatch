"use client";
import dynamic from "next/dynamic";

const DrawMap = dynamic(() => import("./draw-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[640px] place-items-center text-[12px] text-ink-muted">Loading map…</div>
  ),
});

export function ParcelDrawClient() {
  return (
    <div className="mt-8">
      <DrawMap />
    </div>
  );
}
