import { MarketplaceClient } from "./marketplace-client";
import { ShoppingBag } from "lucide-react";

export const metadata = { title: "Marketplace — GhanaWatch" };

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <ShoppingBag className="h-3 w-3" /> Marketplace
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Buy direct, with escrow.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Browse products from GhanaWatch-verified vendors. Funds held in escrow; released only
          when your manager confirms delivery on site (geo-stamped photo, trustee witness on large
          orders). Every order anchored to your project's audit ledger.
        </p>
      </div>
      <MarketplaceClient />
    </div>
  );
}
