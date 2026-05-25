"use client";
import { useState } from "react";
import { Megaphone, Plus, Send, ShieldCheck, Clock, Banknote, Star, Check } from "lucide-react";

type Bid = { vendor: string; logo: string; rating: number; deliveryDays: number; priceGHS: number; warranty: string; bidAt: string };
type Rfq = {
  id: string;
  title: string;
  sector: string;
  region: string;
  qty: string;
  budgetGHS: number;
  postedAt: string;
  closes: string;
  status: "open" | "awarded" | "closed";
  bids: Bid[];
  awarded?: string;
};

const RFQS: Rfq[] = [
  {
    id: "rfq-1",
    title: "200 bags of cement + 80 Y12 rebar — Kasoa site",
    sector: "construction",
    region: "Central",
    qty: "200 bags · 80 rods",
    budgetGHS: 35_000,
    postedAt: "2026-05-22",
    closes: "2026-05-26",
    status: "open",
    bids: [
      { vendor: "Diamond Cement Ghana Ltd.", logo: "DC", rating: 4.8, deliveryDays: 1, priceGHS: 34_200, warranty: "Brand warranty", bidAt: "2026-05-22T14:18Z" },
      { vendor: "GHACEM Ghana", logo: "GH", rating: 4.7, deliveryDays: 1, priceGHS: 33_900, warranty: "Brand warranty", bidAt: "2026-05-22T16:42Z" },
      { vendor: "B5 Plus (rebar-only counter-bid)", logo: "B5", rating: 4.6, deliveryDays: 2, priceGHS: 14_120, warranty: "Mill-test cert.", bidAt: "2026-05-23T09:11Z" },
    ],
  },
  {
    id: "rfq-2",
    title: "Tile + paint package for 4-bed finishing",
    sector: "construction",
    region: "Greater Accra",
    qty: "180 sqm tile · 80L paint",
    budgetGHS: 22_000,
    postedAt: "2026-05-18",
    closes: "2026-05-23",
    status: "awarded",
    awarded: "Sun Tiles Ghana",
    bids: [
      { vendor: "Sun Tiles Ghana", logo: "ST", rating: 4.5, deliveryDays: 5, priceGHS: 20_400, warranty: "5-yr installation", bidAt: "2026-05-19T11:01Z" },
      { vendor: "Coral Paints Ltd.", logo: "CR", rating: 4.6, deliveryDays: 3, priceGHS: 7_200, warranty: "10-yr UV", bidAt: "2026-05-19T15:22Z" },
    ],
  },
];

const SECTORS = ["construction", "real-estate", "vehicle-import", "business", "agriculture"];

export default function RfqPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            <Megaphone className="h-3 w-3" /> RFQ marketplace
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Post a request, get vendor bids.</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
            Only GhanaWatch-verified vendors can bid. Lowest-price isn't always selected — rating,
            warranty, delivery time, and historical reliability all weighed.
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="btn btn-primary"><Plus className="h-4 w-4" /> Post a request</button>
      </div>

      {open && <NewRfq onClose={() => setOpen(false)} />}

      <div className="mt-8 space-y-5">
        {RFQS.map((r) => (
          <div key={r.id} className="card overflow-hidden">
            <div className="grid items-start gap-4 p-6 lg:grid-cols-[2fr_1fr]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip uppercase" style={{ color: r.status === "open" ? "#10b981" : r.status === "awarded" ? "#3b82f6" : "#9aa0b0" }}>{r.status}</span>
                  <span className="chip capitalize">{r.sector}</span>
                  <span className="chip">{r.region}</span>
                  <span className="font-mono text-[11px] text-ink-muted">{r.id}</span>
                </div>
                <div className="mt-3 text-[16px] font-semibold">{r.title}</div>
                <div className="mt-2 grid gap-1 text-[12px] text-ink-dim">
                  <span className="flex items-center gap-1.5"><Banknote className="h-3 w-3" /> Budget: GHS {r.budgetGHS.toLocaleString()}</span>
                  <span className="flex items-center gap-1.5"><Megaphone className="h-3 w-3" /> Quantity: {r.qty}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Posted {r.postedAt} · closes {r.closes}</span>
                </div>
              </div>
              <div className="rounded-xl border border-line bg-bg-elev/40 p-4 text-[12px]">
                <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{r.bids.length} verified bids</div>
                {r.awarded && (
                  <div className="mt-2 flex items-center gap-1.5 text-[12px] text-accent-green">
                    <Check className="h-3.5 w-3.5" /> Awarded to <strong>{r.awarded}</strong>
                  </div>
                )}
              </div>
            </div>
            <div className="divide-y divide-line border-t border-line">
              {r.bids.map((b, i) => {
                const awarded = r.awarded === b.vendor;
                return (
                  <div key={i} className="grid items-center gap-3 px-6 py-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-accent-gold/30 to-accent-green/30 text-[11px] font-semibold">{b.logo}</div>
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-semibold">{b.vendor}</div>
                        <div className="flex items-center gap-2 text-[10px] text-ink-muted">
                          <ShieldCheck className="h-3 w-3 text-accent-green" /> verified
                          <span>·</span>
                          <span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-accent-gold" />{b.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[12px] text-ink-dim">Delivery: <span className="text-ink">{b.deliveryDays}d</span></div>
                    <div className="text-[12px] text-ink-dim">Warranty: <span className="text-ink">{b.warranty}</span></div>
                    <div className="text-[14px] font-semibold text-accent-gold">GHS {b.priceGHS.toLocaleString()}</div>
                    {r.status === "open" ? (
                      <button className="btn btn-primary text-[11px] py-1.5">Award</button>
                    ) : (
                      awarded && <span className="chip" style={{ color: "#10b981" }}><Check className="h-3 w-3" /> winner</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewRfq({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="card w-[min(560px,96vw)] p-6">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-green/15 text-accent-green">
              <Check className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-[18px] font-semibold">Request posted</h3>
            <p className="mt-1 text-[12px] text-ink-dim">All matching verified vendors notified. Expect first bids within 4 hours.</p>
            <button onClick={onClose} className="btn btn-primary mt-4">Done</button>
          </div>
        ) : (
          <>
            <div className="text-[16px] font-semibold">New request for quote</div>
            <p className="mt-1 text-[12px] text-ink-dim">Goes to all GhanaWatch-verified vendors matching sector + region.</p>
            <div className="mt-4 space-y-3">
              <Field label="What you need"><input placeholder="e.g. 200 bags of cement + 80 Y12 rebar" className="input" /></Field>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Sector"><select className="input">{SECTORS.map((s) => <option key={s}>{s}</option>)}</select></Field>
                <Field label="Region"><select className="input"><option>Greater Accra</option><option>Ashanti</option><option>Central</option><option>Volta</option></select></Field>
                <Field label="Budget (GHS)"><input type="number" defaultValue={35000} className="input" /></Field>
                <Field label="Need by"><input type="date" className="input" /></Field>
              </div>
              <Field label="Notes (optional)"><textarea rows={3} placeholder="Delivery instructions, brand preferences…" className="input resize-none" /></Field>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={onClose} className="btn btn-ghost">Cancel</button>
              <button onClick={() => setSent(true)} className="btn btn-primary"><Send className="h-4 w-4" /> Post</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      {children}
    </label>
  );
}
