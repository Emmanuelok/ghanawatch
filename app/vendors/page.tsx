import { VendorsClient } from "./vendors-client";
import { Store } from "lucide-react";

export const metadata = { title: "Verified Vendors — GhanaWatch" };

export default function VendorsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Store className="h-3 w-3" /> Verified vendors
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Vendor directory</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Every vendor here has been verified by GhanaWatch: GRA TIN cross-checked, MoMo merchant ID
          resolved, letterhead samples on file, license verified with the relevant trade body. Buy
          through them and your receipts auto-verify against the forensic engine.
        </p>
      </div>
      <VendorsClient />
    </div>
  );
}
