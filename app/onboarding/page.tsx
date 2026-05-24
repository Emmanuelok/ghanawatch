import { OnboardingClient } from "./onboarding-client";
import { Sparkles } from "lucide-react";

export const metadata = { title: "Get Started — GhanaWatch" };

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Sparkles className="h-3 w-3" /> Welcome
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Let's get your first project protected.</h1>
        <p className="mt-3 max-w-2xl text-[15px] text-ink-dim">
          Six guided steps — about 12 minutes. Verify yourself, set up the project, invite the
          manager via WhatsApp, add co-signers, schedule the first trustee visit, and you're live.
        </p>
      </div>
      <OnboardingClient />
    </div>
  );
}
