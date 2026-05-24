import { ReviewClient } from "./review-client";
import { ShieldAlert, UsersRound } from "lucide-react";

export const metadata = { title: "Human Analyst Review — GhanaWatch" };

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <UsersRound className="h-3 w-3" /> Human-in-the-loop
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Analyst review desk</h1>
        <p className="mt-1 max-w-3xl text-[14px] text-ink-dim">
          Every high-severity AI flag is reviewed by a real, credentialed human analyst before any
          consequential action. Analysts are GhanaWatch staff — qualified surveyors, lawyers, ex-EOCO
          fraud investigators — with personal accountability for each decision. The diaspora user
          sees the analyst's name, license, and signed verdict on every case.
        </p>
      </div>
      <ReviewClient />
    </div>
  );
}
