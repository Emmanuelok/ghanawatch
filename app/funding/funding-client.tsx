"use client";
import { useMemo, useState } from "react";
import {
  Banknote,
  CreditCard,
  Smartphone,
  Globe,
  Check,
  Loader2,
  Wallet,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { PROJECTS } from "@/lib/mock-data";

type Method = "momo" | "card" | "wise" | "bank" | "crypto";

const METHODS: { id: Method; name: string; sub: string; icon: any; fee: number; etaMin: number }[] = [
  { id: "momo", name: "Mobile Money", sub: "MTN MoMo · Telecel · AT Money", icon: Smartphone, fee: 0.005, etaMin: 1 },
  { id: "card", name: "Credit / debit card", sub: "Stripe — Visa, Mastercard, AmEx", icon: CreditCard, fee: 0.029, etaMin: 1 },
  { id: "wise", name: "Wise transfer", sub: "Multi-currency, low FX spread", icon: Globe, fee: 0.006, etaMin: 1440 },
  { id: "bank", name: "Bank transfer", sub: "SWIFT / SEPA → Stanbic Ghana", icon: Wallet, fee: 0.002, etaMin: 2880 },
  { id: "crypto", name: "USDC / USDT", sub: "Stablecoin on Polygon / Base", icon: Globe, fee: 0.003, etaMin: 10 },
];

const FX: Record<string, number> = { GHS: 1, USD: 15.4, GBP: 19.6, EUR: 16.7, CAD: 11.4 };

export function FundingClient() {
  const [project, setProject] = useState(PROJECTS[0].id);
  const [method, setMethod] = useState<Method>("momo");
  const [amountGHS, setAmountGHS] = useState(50_000);
  const [currency, setCurrency] = useState("GHS");
  const [submitting, setSubmitting] = useState(false);
  const [ref, setRef] = useState<string | null>(null);

  const m = METHODS.find((x) => x.id === method)!;
  const fee = Math.round(amountGHS * m.fee);
  const total = amountGHS + fee;
  const fx = FX[currency];
  const totalLocal = total / fx;

  function fund() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setRef(`ESC-${Date.now().toString().slice(-8)}`);
    }, 1500);
  }

  if (ref) {
    return (
      <div className="card mt-8 p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-green/15 text-accent-green">
          <Check className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Escrow funded</h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-ink-dim">
          GHS {amountGHS.toLocaleString()} now held in regulated trust for{" "}
          <strong className="text-ink">{PROJECTS.find((p) => p.id === project)?.name}</strong>.
          Reference <span className="font-mono text-ink">{ref}</span>. Releases on verified
          milestone evidence only.
        </p>
        <button onClick={() => setRef(null)} className="btn btn-primary mt-6">Fund another project</button>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div className="card p-5">
          <div className="text-[14px] font-semibold">Project</div>
          <select value={project} onChange={(e) => setProject(e.target.value)} className="input mt-2">
            {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="card p-5">
          <div className="text-[14px] font-semibold">Amount</div>
          <div className="mt-3 grid items-center gap-3 md:grid-cols-[1fr_120px]">
            <input
              type="number"
              value={amountGHS}
              onChange={(e) => setAmountGHS(Number(e.target.value) || 0)}
              className="input text-[24px] font-semibold"
            />
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input">
              {Object.keys(FX).map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="mt-2 text-[12px] text-ink-dim">≈ {currency} {totalLocal.toFixed(2)} at today's FX</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[10_000, 50_000, 100_000, 250_000].map((a) => (
              <button key={a} onClick={() => setAmountGHS(a)} className="chip cursor-pointer hover:bg-bg-subtle">+ GHS {a.toLocaleString()}</button>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-3 text-[14px] font-semibold">Payment method</div>
          <div className="grid gap-2">
            {METHODS.map((opt) => {
              const Icon = opt.icon;
              const selected = method === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setMethod(opt.id)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    selected ? "border-accent-gold bg-accent-gold/5" : "border-line bg-bg-elev/40 hover:border-line/70"
                  }`}
                >
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-bg-elev">
                    <Icon className="h-4 w-4 text-accent-gold" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold">{opt.name}</div>
                    <div className="text-[11px] text-ink-dim">{opt.sub}</div>
                  </div>
                  <div className="text-right text-[11px] text-ink-muted">
                    fee {(opt.fee * 100).toFixed(2)}% · ETA {opt.etaMin < 60 ? `${opt.etaMin}m` : `${(opt.etaMin / 60).toFixed(0)}h`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="card sticky top-24 self-start p-5">
        <div className="text-[14px] font-semibold">Summary</div>
        <div className="mt-3 space-y-1.5 text-[13px]">
          <Row k="Funding amount" v={`GHS ${amountGHS.toLocaleString()}`} />
          <Row k={`${m.name} fee`} v={`GHS ${fee.toLocaleString()}`} />
          <div className="my-1 border-t border-line" />
          <Row k="Total in GHS" v={`GHS ${total.toLocaleString()}`} bold />
          <Row k="In your currency" v={`${currency} ${totalLocal.toFixed(2)}`} />
        </div>

        <div className="mt-4 rounded-md border border-accent-gold/30 bg-accent-gold/5 p-3 text-[11px] text-ink-dim">
          <ShieldCheck className="mr-1 inline h-3 w-3 text-accent-gold" />
          Funds held in a regulated trust account at Stanbic Bank Ghana under the Banks &
          Specialised Deposit-Taking Institutions Act 2016 (Act 930).
        </div>

        <button onClick={fund} disabled={submitting || amountGHS <= 0} className="btn btn-primary mt-5 w-full justify-center disabled:opacity-40">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
          {submitting ? "Locking funds…" : "Fund escrow"}
        </button>
        <p className="mt-2 text-[10.5px] text-ink-muted">By funding, you agree to the GhanaWatch escrow terms and the milestone release schedule for this project.</p>
      </aside>
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ink-muted">{k}</span>
      <span className={bold ? "text-[15px] font-semibold text-ink" : "text-ink"}>{v}</span>
    </div>
  );
}
