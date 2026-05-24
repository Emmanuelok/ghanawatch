"use client";
import { createContext, useContext, useEffect, useState, useMemo } from "react";

export type Currency = "GHS" | "USD" | "GBP" | "CAD" | "EUR";

const RATES: Record<Currency, { rate: number; symbol: string }> = {
  GHS: { rate: 1,       symbol: "GHS" },
  USD: { rate: 0.0625,  symbol: "$" },
  GBP: { rate: 0.0488,  symbol: "£" },
  CAD: { rate: 0.0858,  symbol: "CA$" },
  EUR: { rate: 0.0574,  symbol: "€" },
};

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (ghs: number, opts?: { dual?: boolean; compact?: boolean }) => string;
};

const C = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("GHS");

  useEffect(() => {
    try {
      const v = localStorage.getItem("gw_currency") as Currency | null;
      if (v && RATES[v]) setCurrencyState(v);
    } catch {}
  }, []);

  function setCurrency(c: Currency) {
    setCurrencyState(c);
    try { localStorage.setItem("gw_currency", c); } catch {}
  }

  const value = useMemo<Ctx>(() => {
    function format(ghs: number, opts: { dual?: boolean; compact?: boolean } = {}) {
      const r = RATES[currency];
      const converted = ghs * r.rate;
      const fmt = (n: number) => {
        if (opts.compact) {
          if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
          if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
          return `${n.toFixed(0)}`;
        }
        return Math.round(n).toLocaleString();
      };
      const primary = `${r.symbol} ${fmt(converted)}`;
      if (!opts.dual || currency === "GHS") return primary;
      return `${primary} · GHS ${fmt(ghs)}`;
    }
    return { currency, setCurrency, format };
  }, [currency]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useCurrency() {
  const v = useContext(C);
  if (!v) {
    // Safe fallback so non-wrapped components don't crash
    return {
      currency: "GHS" as Currency,
      setCurrency: () => {},
      format: (ghs: number) => `GHS ${ghs.toLocaleString()}`,
    };
  }
  return v;
}

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
      className="rounded-md border border-line bg-bg-elev px-2 py-1.5 text-[12px] text-ink-dim outline-none hover:text-ink"
      aria-label="Display currency"
    >
      {(Object.keys(RATES) as Currency[]).map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
}
