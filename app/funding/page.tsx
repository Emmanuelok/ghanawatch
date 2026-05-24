import { FundingClient } from "./funding-client";
import { Banknote } from "lucide-react";

export const metadata = { title: "Fund Escrow — GhanaWatch" };

export default function FundingPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Banknote className="h-3 w-3" /> Fund escrow
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Move money into milestone escrow.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          MoMo, Wise, Stripe, bank transfer, or stablecoin — funds land in a regulated trust
          account in Ghana and release only on verified milestone evidence. No counterparty sees a
          cedi until you sign off.
        </p>
      </div>
      <FundingClient />
    </div>
  );
}
