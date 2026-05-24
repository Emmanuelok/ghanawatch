import { ParcelDrawClient } from "./draw-client";
import { Pencil } from "lucide-react";

export const metadata = { title: "Draw Parcel — GhanaWatch" };

export default function ParcelDrawPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Pencil className="h-3 w-3" /> Parcel drawer
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Mark your parcel's boundary</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Click to drop corner points; double-click (or "Finish") to close the polygon. We compute
          the area, centroid, and a GeoJSON we anchor to your project's audit ledger so every
          future site photo's GPS gets boundary-checked.
        </p>
      </div>
      <ParcelDrawClient />
    </div>
  );
}
