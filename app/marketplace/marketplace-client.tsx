"use client";
import { useState, useMemo } from "react";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  Banknote,
  Truck,
  Loader2,
  Check,
} from "lucide-react";
import { PRODUCTS, VENDORS, PROJECTS } from "@/lib/mock-data";
import type { Product } from "@/lib/types";

const CATS = ["all", "cement", "rebar", "blocks", "tiles", "paint", "plumbing", "timber", "aluminum"] as const;

export function MarketplaceClient() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [project, setProject] = useState(PROJECTS[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [orderedId, setOrderedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (!t) return true;
      return p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t);
    });
  }, [q, cat]);

  function add(id: string) {
    const p = PRODUCTS.find((p) => p.id === id)!;
    setCart((c) => ({ ...c, [id]: Math.max(p.minOrder, (c[id] ?? 0) + p.minOrder) }));
  }
  function inc(id: string, qty: number) {
    setCart((c) => {
      const next = { ...c };
      const n = (next[id] ?? 0) + qty;
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  }
  function remove(id: string) {
    setCart((c) => {
      const n = { ...c };
      delete n[id];
      return n;
    });
  }

  const lines = Object.entries(cart).map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id)!;
    return { p, qty, total: p.priceGHS * qty };
  });
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const delivery = subtotal > 0 ? 320 : 0;
  const escrowFee = Math.round(subtotal * 0.012);
  const total = subtotal + delivery + escrowFee;

  function checkout() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOrderedId(`ORD-${Date.now().toString().slice(-6)}`);
      setCart({});
    }, 1200);
  }

  if (orderedId) {
    return (
      <div className="card mt-8 p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-green/15 text-accent-green">
          <Check className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Order placed — funds in escrow</h2>
        <p className="mx-auto mt-2 max-w-md text-[13px] text-ink-dim">
          Order <span className="font-mono text-ink">{orderedId}</span> anchored to your project's
          audit ledger. Vendor notified. Funds release on confirmed delivery (geo-stamped photo by
          your manager).
        </p>
        <button onClick={() => setOrderedId(null)} className="btn btn-primary mt-6">Place another order</button>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="input pl-9" />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-line bg-bg-elev p-1 text-[11px]">
            {CATS.map((c) => (
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
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {filtered.map((p) => <ProductCard key={p.id} p={p} qty={cart[p.id] ?? 0} onAdd={() => add(p.id)} onInc={(q) => inc(p.id, q)} />)}
        </div>
      </div>

      {/* Cart sidebar */}
      <aside className="sticky top-24 self-start">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line bg-bg-elev/40 px-5 py-3">
            <div className="flex items-center gap-2 text-[14px] font-semibold">
              <ShoppingBag className="h-4 w-4 text-accent-gold" /> Cart
            </div>
            <span className="chip">{lines.length} item{lines.length === 1 ? "" : "s"}</span>
          </div>

          <div className="max-h-[280px] divide-y divide-line overflow-y-auto scroll-shadow">
            {lines.length === 0 && <div className="px-5 py-8 text-center text-[12px] text-ink-muted">Cart is empty.</div>}
            {lines.map(({ p, qty, total }) => (
              <div key={p.id} className="grid items-center gap-3 px-5 py-3 md:grid-cols-[1fr_auto_auto]">
                <div className="min-w-0">
                  <div className="truncate text-[12.5px] font-semibold">{p.name}</div>
                  <div className="text-[10px] text-ink-muted">GHS {p.priceGHS} · {qty} {p.unit}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => inc(p.id, -p.minOrder)} className="grid h-6 w-6 place-items-center rounded-md border border-line text-ink-dim hover:bg-bg-elev"><Minus className="h-3 w-3" /></button>
                  <button onClick={() => inc(p.id, p.minOrder)} className="grid h-6 w-6 place-items-center rounded-md border border-line text-ink-dim hover:bg-bg-elev"><Plus className="h-3 w-3" /></button>
                  <button onClick={() => remove(p.id)} className="grid h-6 w-6 place-items-center rounded-md text-ink-muted hover:text-risk-high"><Trash2 className="h-3 w-3" /></button>
                </div>
                <div className="text-right text-[12px] font-semibold">GHS {total.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="space-y-1 border-t border-line p-5 text-[12px]">
            <Row k="Subtotal" v={`GHS ${subtotal.toLocaleString()}`} />
            <Row k="Delivery" v={`GHS ${delivery.toLocaleString()}`} />
            <Row k="Escrow fee (1.2%)" v={`GHS ${escrowFee.toLocaleString()}`} />
            <div className="my-2 border-t border-line" />
            <Row k="Total" v={`GHS ${total.toLocaleString()}`} bold />
          </div>

          <div className="border-t border-line p-5 space-y-3">
            <label className="block">
              <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-ink-muted">Charge to project</div>
              <select value={project} onChange={(e) => setProject(e.target.value)} className="input">
                {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <button onClick={checkout} disabled={lines.length === 0 || submitting} className="btn btn-primary w-full justify-center disabled:opacity-40">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {submitting ? "Locking escrow…" : "Place order (funds in escrow)"}
            </button>
            <p className="text-[10.5px] text-ink-muted">Vendor doesn't see a cedi until your manager geo-stamps delivery on site.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ProductCard({ p, qty, onAdd, onInc }: { p: Product; qty: number; onAdd: () => void; onInc: (n: number) => void }) {
  const vendor = VENDORS.find((v) => v.id === p.vendorId)!;
  return (
    <div className="card overflow-hidden">
      <div className="relative h-32 w-full" style={{ background: `linear-gradient(135deg, ${p.imageColor}30, ${p.imageColor}10)` }}>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-[12px] uppercase tracking-[0.2em] text-ink-dim">{p.category}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="text-[13px] font-semibold leading-tight">{p.name}</div>
        <div className="mt-1 text-[11px] text-ink-dim">{vendor.name}</div>
        <p className="mt-2 line-clamp-2 text-[11.5px] text-ink-dim">{p.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-[16px] font-semibold tracking-tight">GHS {p.priceGHS.toLocaleString()}</div>
            <div className="text-[10px] text-ink-muted">per {p.unit}</div>
          </div>
          {qty === 0 ? (
            <button onClick={onAdd} className="btn btn-primary text-[11px] py-1.5"><Plus className="h-3 w-3" /> Add</button>
          ) : (
            <div className="flex items-center gap-1">
              <button onClick={() => onInc(-p.minOrder)} className="grid h-7 w-7 place-items-center rounded-md border border-line text-ink-dim hover:bg-bg-elev"><Minus className="h-3 w-3" /></button>
              <span className="min-w-[40px] text-center text-[12px] font-semibold">{qty}</span>
              <button onClick={() => onInc(p.minOrder)} className="grid h-7 w-7 place-items-center rounded-md border border-line text-ink-dim hover:bg-bg-elev"><Plus className="h-3 w-3" /></button>
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-ink-muted">
          <Truck className="h-3 w-3" /> {p.deliveryDays}d · min {p.minOrder} {p.unit}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ink-muted">{k}</span>
      <span className={bold ? "text-[14px] font-semibold text-ink" : "text-ink"}>{v}</span>
    </div>
  );
}
