import { VerifyClient } from "./verify-client";
import { FileSearch, ShieldCheck, Brain, Layers } from "lucide-react";

export const metadata = { title: "Document Verification — GhanaWatch" };

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="max-w-2xl">
        <div className="chip mb-4"><FileSearch className="h-3 w-3 text-accent-gold" /> Forensic engine</div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Document verification</h1>
        <p className="mt-3 text-[15px] text-ink-dim">
          Drop a description of any document — receipt, invoice, indenture, BoL, permit, hospital bill —
          and the engine returns an authenticity verdict with a forensic breakdown grounded in
          Ghanaian agency patterns (Lands Commission, GRA, Korle Bu, KEEDA, MoFA).
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <VerifyClient />

        <div className="space-y-4">
          <div className="card p-5">
            <div className="mb-3 text-[14px] font-semibold">What the engine checks</div>
            <ul className="space-y-3 text-[13px] text-ink-dim">
              <Check icon={Brain} text="AI-generation probability (ChatGPT, MidJourney, GANs)" />
              <Check icon={Layers} text="Font + rendering consistency across the doc" />
              <Check icon={ShieldCheck} text="Pixel-level tampering & compression anomalies" />
              <Check icon={FileSearch} text="EXIF / PDF metadata integrity" />
              <Check icon={ShieldCheck} text="Vendor stamp pattern matching (GRA, Korle Bu, etc.)" />
              <Check icon={Layers} text="Duplicate-hash detection across your portfolio" />
              <Check icon={Brain} text="Cross-reference with registry data where available" />
            </ul>
          </div>
          <div className="card p-5">
            <div className="mb-3 text-[14px] font-semibold">Demo mode</div>
            <p className="text-[13px] text-ink-dim">
              Without an Anthropic API key, the engine returns a deterministic demo verdict tailored
              to the doc type you describe. Set <code className="rounded bg-bg-elev px-1.5 py-0.5">ANTHROPIC_API_KEY</code> on Vercel for live AI forensic reasoning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Check({ icon: Icon, text }: any) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-gold" />
      <span>{text}</span>
    </li>
  );
}
