import { HelpClient } from "./help-client";
import { HelpCircle } from "lucide-react";

export const metadata = { title: "Help center — GhanaWatch" };

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <HelpCircle className="h-3 w-3" /> Help center
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">How can we help?</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Search articles, tutorials, common questions, and how-tos. Or message the support team
          directly — we reply within 4 hours for paid plans.
        </p>
      </div>
      <HelpClient />
    </div>
  );
}
