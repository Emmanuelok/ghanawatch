"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Star, ShieldCheck, MapPin, Banknote, Clock, ArrowUpRight, Store } from "lucide-react";
import { VENDORS } from "@/lib/mock-data";
import type { Vendor } from "@/lib/types";

const CATEGORIES = ["all", "cement", "rebar", "roofing", "blocks", "tiles", "paint", "plumbing", "electrical", "hardware", "timber", "aluminum"] as const;

const PRICE_BAND_COLOR = { budget: "#10b981", mid: "#f5b800", premium: "#8b5cf6" } as const;

export function VendorsClient() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("all");
  const [region, setRegion] = useState("all");

  const regions = ["all", ...Array.from(new Set(VENDORS.map((v) => v.region)))];

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return VENDORS.filter((v) => {
      if (cat !== "all" && v.category !== cat) return false;
      if (region !== "all" && v.region !== region) return false;
      if (!t) return true;
      return (
        v.name.toLowerCase().includes(t) ||
        v.city.toLowerCase().includes(t) ||
        v.region.toLowerCase().includes(t) ||
        v.productLines.join(" ").toLowerCase().includes(t)
      );
    });
  }, [q, cat, region]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vendor, product, city, region…" className="input pl-9" />
        </div>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="input md:max-w-[200px]">
          {regions.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="mt-3 flex items-center gap-1 overflow-x-auto rounded-lg border border-line bg-bg-elev p-1 text-[11px]">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`whitespace-nowrap rounded-md px-2.5 py-1.5 capitalize ${
              cat === c ? "bg-bg-card text-ink" : "text-ink-dim hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => <VendorCard key={v.id} v={v} />)}
        {filtered.length === 0 && <div className="card col-span-full grid place-items-center px-6 py-16 text-center text-[13px] text-ink-dim">No vendors match.</div>}
      </div>
    </div>
  );
}

function VendorCard({ v }: { v: Vendor }) {
  const color = PRICE_BAND_COLOR[v.priceBand];
  return (
    <div className="card card-hover overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-accent-gold/30 to-accent-green/30 text-[12px] font-semibold text-ink">
                {v.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold">{v.name}</div>
                <div className="text-[11px] text-ink-dim capitalize">{v.category}</div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[12px] text-ink-dim">
              <MapPin className="h-3 w-3" /> {v.city}, {v.region}
            </div>
          </div>
          <span className="chip" style={{ color, borderColor: `${color}30`, background: `${color}10` }}>
            {v.priceBand}
          </span>
        </div>

        <p className="mt-3 text-[12.5px] text-ink-dim">{v.bio}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {v.productLines.slice(0, 3).map((p) => (
            <span key={p} className="chip text-[10px]">{p}</span>
          ))}
          {v.productLines.length > 3 && <span className="chip text-[10px]">+{v.productLines.length - 3}</span>}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-3 text-[11px] text-ink-dim">
          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-accent-gold" /> {v.rating} ({v.reviewCount.toLocaleString()})</span>
          <span className="flex items-center gap-1"><Store className="h-3 w-3 text-accent-gold" /> {v.jobsCompleted.toLocaleString()} jobs</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-accent-gold" /> {v.responseHours}h response</span>
          <span className="flex items-center gap-1"><Banknote className="h-3 w-3 text-accent-gold" /> {v.yearsActive}y trading</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line pt-3 text-[10px]">
          {v.licensed && <span className="chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.25)" }}><ShieldCheck className="h-2.5 w-2.5" /> GRA TIN</span>}
          {v.letterheadVerified && <span className="chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.25)" }}><ShieldCheck className="h-2.5 w-2.5" /> Letterhead</span>}
          <span className="chip"><ShieldCheck className="h-2.5 w-2.5 text-accent-green" /> MoMo verified</span>
        </div>

        <Link href={`/marketplace?vendor=${v.id}`} className="btn btn-primary mt-4 w-full justify-center text-[12px] py-1.5">
          See products <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
