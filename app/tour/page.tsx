import { TourClient } from "./tour-client";
import { Play } from "lucide-react";

export const metadata = { title: "Product tour — GhanaWatch" };

export default function TourPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Play className="h-3 w-3" /> Interactive tour
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">A 4-minute interactive product tour.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Walk through the diaspora user journey with annotated screens. Each step is a
          self-contained chapter — fast-forward, rewind, or jump to whatever you care about most.
        </p>
      </div>
      <TourClient />
    </div>
  );
}
