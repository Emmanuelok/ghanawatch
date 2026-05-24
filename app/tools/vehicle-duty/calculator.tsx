"use client";
import { useMemo, useState } from "react";
import { AlertCircle, ShieldCheck, Calculator } from "lucide-react";

type Category = "sedan-small" | "sedan-mid" | "sedan-large" | "suv-mid" | "suv-large" | "pickup" | "bus-mini" | "truck";

const RATES: Record<Category, { duty: number; example: string }> = {
  "sedan-small": { duty: 0.05, example: "Honda Fit, Toyota Vitz, Kia Picanto" },
  "sedan-mid":   { duty: 0.10, example: "Honda Civic, Toyota Corolla, Nissan Sentra" },
  "sedan-large": { duty: 0.20, example: "Toyota Camry, Honda Accord" },
  "suv-mid":     { duty: 0.20, example: "Toyota RAV4, Honda CR-V" },
  "suv-large":   { duty: 0.20, example: "Toyota Highlander, Ford Explorer" },
  "pickup":      { duty: 0.05, example: "Toyota Hilux, Ford Ranger" },
  "bus-mini":    { duty: 0.05, example: "Nissan Urvan, Hyundai H100" },
  "truck":       { duty: 0.05, example: "Tata, Hyundai HD-series" },
};

export function DutyCalculator() {
  const [cif, setCif] = useState(15000); // CIF in USD
  const [usdToGhs, setUsdToGhs] = useState(15.4);
  const [category, setCategory] = useState<Category>("sedan-mid");
  const [age, setAge] = useState(7); // years
  const [agentQuote, setAgentQuote] = useState<number | "">("");

  const result = useMemo(() => {
    const cifGHS = cif * usdToGhs;
    const ageSurchargeRate = age > 10 ? 0.50 : age > 5 ? 0.20 : 0;
    const ageSurcharge = cifGHS * ageSurchargeRate;
    const dutiableValue = cifGHS + ageSurcharge;
    const importDuty = dutiableValue * RATES[category].duty;
    const vatBase = dutiableValue + importDuty;
    const vat = vatBase * 0.15;
    const nhil = vatBase * 0.025;
    const getfund = vatBase * 0.025;
    const covid = vatBase * 0.01;
    const ecowas = dutiableValue * 0.005;
    const eximbank = dutiableValue * 0.0075;
    const processing = dutiableValue * 0.01;
    const networkCharge = 250; // flat
    const totalTaxes = importDuty + vat + nhil + getfund + covid + ecowas + eximbank + processing + networkCharge;
    const landedCost = cifGHS + totalTaxes;
    return {
      cifGHS,
      ageSurcharge,
      ageSurchargeRate,
      dutiableValue,
      importDuty,
      vat, nhil, getfund, covid,
      ecowas, eximbank, processing, networkCharge,
      totalTaxes,
      landedCost,
    };
  }, [cif, usdToGhs, category, age]);

  const quote = typeof agentQuote === "number" ? agentQuote : null;
  const diff = quote !== null ? quote - result.totalTaxes : 0;
  const diffPct = quote !== null && result.totalTaxes > 0 ? (diff / result.totalTaxes) * 100 : 0;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold">
          <Calculator className="h-4 w-4 text-accent-gold" /> Vehicle details
        </div>
        <div className="space-y-3">
          <Labeled label="CIF value (USD) — cost + insurance + freight on Bill of Lading">
            <input type="number" value={cif} onChange={(e) => setCif(Number(e.target.value))} className="input" />
          </Labeled>
          <Labeled label="USD → GHS rate">
            <input type="number" step="0.01" value={usdToGhs} onChange={(e) => setUsdToGhs(Number(e.target.value))} className="input" />
          </Labeled>
          <Labeled label="Vehicle category">
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="input">
              {Object.entries(RATES).map(([k, v]) => (
                <option key={k} value={k}>{k.replace("-", " ")} — {(v.duty*100).toFixed(0)}% duty — {v.example}</option>
              ))}
            </select>
          </Labeled>
          <Labeled label="Vehicle age (years)">
            <input type="range" min="0" max="20" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full" />
            <div className="text-[12px] text-ink-dim">{age} years {age > 10 ? "· +50% over-age surcharge" : age > 5 ? "· +20% over-age surcharge" : "· no over-age surcharge"}</div>
          </Labeled>
          <Labeled label="Agent's quoted total (GHS) — optional, we'll compare">
            <input
              type="number"
              value={agentQuote}
              onChange={(e) => setAgentQuote(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 42000"
              className="input"
            />
          </Labeled>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-3 text-[14px] font-semibold">Estimate (GHS)</div>
        <div className="rounded-lg border border-line bg-bg-elev/40 p-4">
          <Line label="CIF value (cedi)" v={result.cifGHS} />
          {result.ageSurcharge > 0 && <Line label={`Over-age surcharge (+${(result.ageSurchargeRate*100).toFixed(0)}%)`} v={result.ageSurcharge} />}
          <Line label="Dutiable value" v={result.dutiableValue} strong />
          <Hr />
          <Line label={`Import duty (${(RATES[category].duty*100).toFixed(0)}%)`} v={result.importDuty} />
          <Line label="VAT (15%)" v={result.vat} />
          <Line label="NHIL (2.5%)" v={result.nhil} />
          <Line label="GETFund (2.5%)" v={result.getfund} />
          <Line label="COVID levy (1%)" v={result.covid} />
          <Line label="ECOWAS levy (0.5%)" v={result.ecowas} />
          <Line label="EXIM bank levy (0.75%)" v={result.eximbank} />
          <Line label="Processing fee (1%)" v={result.processing} />
          <Line label="GCNet / customs processing" v={result.networkCharge} />
          <Hr />
          <Line label="Total taxes + fees" v={result.totalTaxes} strong />
          <Hr />
          <Line label="Landed cost (CIF + taxes)" v={result.landedCost} highlight />
        </div>

        {quote !== null && (
          <div
            className={`mt-4 rounded-lg border p-4 ${
              Math.abs(diffPct) < 5
                ? "border-accent-green/30 bg-accent-green/5"
                : "border-risk-high/30 bg-risk-high/5"
            }`}
          >
            <div className="flex items-center gap-2">
              {Math.abs(diffPct) < 5 ? (
                <ShieldCheck className="h-4 w-4 text-accent-green" />
              ) : (
                <AlertCircle className="h-4 w-4 text-risk-high" />
              )}
              <div className="text-[13px] font-semibold">
                Agent quoted GHS {quote.toLocaleString()}
              </div>
            </div>
            <div className="mt-1 text-[12px] text-ink-dim">
              That's GHS {Math.abs(diff).toLocaleString()} ({Math.abs(diffPct).toFixed(1)}%){" "}
              {diff > 0 ? "above" : "below"} our estimate.{" "}
              {Math.abs(diffPct) > 15
                ? "Significant variance — request the GRA Duty Calculation Worksheet (serialised) and verify line by line."
                : Math.abs(diffPct) > 5
                ? "Outside the typical buffer — ask for the GRA worksheet to compare line items."
                : "Within typical fee variance."}
            </div>
          </div>
        )}

        <p className="mt-4 text-[11px] text-ink-muted">
          Rates current as of 2026-05. Always verify against the GRA Customs duty calculator
          (<a className="underline" href="https://gra.gov.gh" target="_blank" rel="noreferrer">gra.gov.gh</a>)
          and demand a serialised, QR-coded GRA worksheet.
        </p>
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      {children}
    </label>
  );
}

function Line({ label, v, strong, highlight }: { label: string; v: number; strong?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between py-1 text-[13px] ${strong ? "font-semibold" : ""}`}>
      <span className={strong || highlight ? "text-ink" : "text-ink-dim"}>{label}</span>
      <span className={highlight ? "text-[16px] font-semibold text-accent-gold" : "text-ink"}>
        GHS {v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </span>
    </div>
  );
}

function Hr() { return <div className="my-1 border-t border-line" />; }
