"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Benchmark } from "@/lib/types";

const CATS = ["all", "material", "labor", "import-duty", "funeral", "medical", "education"] as const;

export function BenchmarksClient({ benchmarks }: { benchmarks: Benchmark[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const [quote, setQuote] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return benchmarks
      .filter((b) => (cat === "all" ? true : b.category === cat))
      .filter((b) => !t || b.item.toLowerCase().includes(t) || b.region.toLowerCase().includes(t));
  }, [benchmarks, q, cat]);

  const quoteNum = Number(quote.replace(/,/g, ""));

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search item / region…" className="input pl-9" />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-line bg-bg-elev p-1 text-[12px]">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 capitalize ${
                cat === c ? "bg-bg-card text-ink" : "text-ink-dim hover:text-ink"
              }`}
            >
              {c.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-dim">
        <span>Test a quote: GHS</span>
        <input
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="e.g. 8400"
          className="input max-w-[160px] py-1.5"
        />
        <span className="text-ink-muted">— we'll show every benchmark you're above or below.</span>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {filtered.map((b) => {
          const aboveP90 = quoteNum && quoteNum > b.p90;
          const belowP10 = quoteNum && quoteNum < b.p10;
          const inBand = quoteNum && quoteNum >= b.p10 && quoteNum <= b.p90;
          return (
            <div key={b.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold">{b.item}</div>
                  <div className="text-[11px] text-ink-dim">per {b.unit} · {b.region} · updated {b.updated}</div>
                </div>
                <span className="chip uppercase">{b.category}</span>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline justify-between text-[12px] text-ink-dim">
                  <span>p10 GHS {b.p10.toLocaleString()}</span>
                  <span className="text-ink text-[14px] font-semibold">median GHS {b.medianGHS.toLocaleString()}</span>
                  <span>p90 GHS {b.p90.toLocaleString()}</span>
                </div>
                <BellChart median={b.medianGHS} p10={b.p10} p90={b.p90} quote={quoteNum || undefined} />
                {quoteNum > 0 && (
                  <div
                    className={`mt-2 text-[12px] ${
                      aboveP90 ? "text-risk-high" : belowP10 ? "text-risk-med" : "text-accent-green"
                    }`}
                  >
                    Your quote GHS {quoteNum.toLocaleString()} is{" "}
                    {aboveP90
                      ? `${(((quoteNum - b.medianGHS) / b.medianGHS) * 100).toFixed(0)}% above median — flag.`
                      : belowP10
                      ? `${(((b.medianGHS - quoteNum) / b.medianGHS) * 100).toFixed(0)}% below median — verify, may be too-good-to-be-true.`
                      : `within the typical band.`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BellChart({ median, p10, p90, quote }: { median: number; p10: number; p90: number; quote?: number }) {
  const W = 320, H = 50;
  const min = Math.min(p10, quote ?? p10) * 0.85;
  const max = Math.max(p90, quote ?? p90) * 1.15;
  const xAt = (v: number) => ((v - min) / (max - min)) * W;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="mt-2">
      <rect x={xAt(p10)} y={H / 2 - 6} width={xAt(p90) - xAt(p10)} height={12} fill="#10b981" fillOpacity="0.15" rx={4} />
      <line x1={xAt(median)} x2={xAt(median)} y1={H / 2 - 10} y2={H / 2 + 10} stroke="#10b981" strokeWidth={2} />
      <text x={xAt(median)} y={H / 2 - 14} textAnchor="middle" fontSize="9" fill="#10b981">median</text>
      {quote != null && (
        <>
          <line x1={xAt(quote)} x2={xAt(quote)} y1={2} y2={H - 2} stroke="#f5b800" strokeWidth={2} strokeDasharray="3 3" />
          <text x={xAt(quote)} y={H - 2} textAnchor="middle" fontSize="9" fill="#f5b800">your quote</text>
        </>
      )}
    </svg>
  );
}
