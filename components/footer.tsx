import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-bg-elev/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent-gold to-accent-green">
              <Shield className="h-4 w-4 text-bg" strokeWidth={2.5} />
            </div>
            <div className="text-[15px] font-semibold">GhanaWatch</div>
          </div>
          <p className="mt-3 max-w-xs text-[13px] text-ink-dim">
            The intelligence platform for diaspora Ghanaians who want to verify every cedi, every document, and every brick — back home.
          </p>
        </div>

        <div>
          <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">Platform</div>
          <ul className="space-y-2 text-[13px]">
            <li><Link href="/dashboard" className="text-ink-dim hover:text-ink">Dashboard</Link></li>
            <li><Link href="/projects" className="text-ink-dim hover:text-ink">Projects</Link></li>
            <li><Link href="/verify" className="text-ink-dim hover:text-ink">Document forensics</Link></li>
            <li><Link href="/investigator" className="text-ink-dim hover:text-ink">AI Investigator</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">Coverage</div>
          <ul className="space-y-2 text-[13px]">
            <li><Link href="/sectors" className="text-ink-dim hover:text-ink">Sectors</Link></li>
            <li><Link href="/network" className="text-ink-dim hover:text-ink">Trustee network</Link></li>
            <li><Link href="/research" className="text-ink-dim hover:text-ink">The research</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">Trust signals</div>
          <ul className="space-y-2 text-[13px] text-ink-dim">
            <li>Lands Commission cross-check</li>
            <li>GRA Customs registry</li>
            <li>Medical & Dental Council verified trustees</li>
            <li>Immutable hash-chained audit ledger</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-5 text-[12px] text-ink-muted md:flex-row md:items-center">
          <div>© 2026 GhanaWatch · Built for the Ghanaian diaspora · 🇬🇭</div>
          <div className="flex items-center gap-4">
            <span>Demo build — no live financial accounts are connected.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
