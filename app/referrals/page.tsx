import { ReferralsClient } from "./referrals-client";
import { Gift } from "lucide-react";

export const metadata = { title: "Referrals — GhanaWatch" };

export default function ReferralsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Gift className="h-3 w-3" /> Refer & earn
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Bring your community in.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Every Ghanaian abroad you refer who creates a verified project gives you both 1 month of
          Guard free. Five referrals → free for life. We do this because fraud signals get sharper
          the more diaspora users feed the platform.
        </p>
      </div>
      <ReferralsClient />
    </div>
  );
}
