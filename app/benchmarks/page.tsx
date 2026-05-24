import { BenchmarksClient } from "./benchmarks-client";
import { BENCHMARKS } from "@/lib/mock-data";
import { LineChart, TrendingUp } from "lucide-react";

export const metadata = { title: "Benchmarks — GhanaWatch" };

export default function BenchmarksPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <TrendingUp className="h-3 w-3" /> Benchmarks
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Market rates, by region.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          What things actually cost in Ghana — materials, labour, customs duty, funeral, medical,
          education. Each entry has a regional median plus 10th / 90th percentile so you can spot a
          quote that's outside the bell.
        </p>
      </div>
      <BenchmarksClient benchmarks={BENCHMARKS} />
    </div>
  );
}
