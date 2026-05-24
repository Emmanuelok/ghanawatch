import { MobileAppPreview } from "./mobile-client";
import { Smartphone } from "lucide-react";

export const metadata = { title: "Diaspora Mobile — GhanaWatch" };

export default function MobilePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Smartphone className="h-3 w-3" /> Diaspora app preview
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your projects, in your pocket.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Push alerts the instant something flags. Tap to dispatch a trustee. Approve milestones via
          biometric on the device. The diaspora user's life-line to what's happening back home.
        </p>
      </div>
      <MobileAppPreview />
    </div>
  );
}
