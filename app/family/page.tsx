import { FamilyTree } from "./client";
import { Users } from "lucide-react";

export const metadata = { title: "Family circle — GhanaWatch" };

export default function FamilyPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Users className="h-3 w-3" /> Family circle
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your verified family circle.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Map who's in your family for the platform's purposes — co-signers, next-of-kin,
          beneficiaries. Each verified member gets a role on your projects and a place on the
          ledger. Critical because Ghanaian estate law is multi-party by default.
        </p>
      </div>
      <FamilyTree />
    </div>
  );
}
