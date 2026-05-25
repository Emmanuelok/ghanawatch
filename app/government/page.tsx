import Link from "next/link";
import { Building, ShieldCheck, FileText, Check, ArrowRight, Globe } from "lucide-react";

export const metadata = { title: "Government partnerships — GhanaWatch" };

const PARTNERS = [
  {
    name: "Lands Commission",
    short: "LC",
    integration: "Live API for parcel cross-check + caveat filing",
    sla: "p95 < 4s",
    cases: "612 LC-cross-checks/day",
    impact: "1,182 title overlaps detected since integration",
    docs: [
      "GhanaWatch parcel ref → LC indenture / folio lookup",
      "Caveat filing (Form LC-7) directly from forensic case",
      "Lands archive signature samples for verification",
    ],
  },
  {
    name: "Ghana Revenue Authority",
    short: "GRA",
    integration: "Customs duty calculator + receipt verification",
    sla: "p95 < 2s",
    cases: "4,800 duty cross-checks/month",
    impact: "GHS 18M+ in inflated duty caught at Tema corridor",
    docs: [
      "HS code lookup for vehicle imports",
      "Receipt serial + QR verification",
      "Bonded warehouse status pull",
    ],
  },
  {
    name: "Bank of Ghana",
    short: "BoG",
    integration: "Compliance feed for diaspora-bond programmes",
    sla: "Quarterly settlement",
    cases: "1 sovereign bond + 1 municipal active",
    impact: "USD 187M+ raised via verified-pool anchoring",
    docs: [
      "AML compliance dashboard mirror",
      "FX corridor reporting",
      "SAR co-filing protocol",
    ],
  },
  {
    name: "Korle Bu / Komfo Anokye / Ridge Hospital",
    short: "GHS",
    integration: "Hospital billing portal cross-check",
    sla: "p95 < 6s",
    cases: "412 receipt verifications/month",
    impact: "Bill inflation caught on 4.2% of cross-checks",
    docs: [
      "Patient billing portal lookup (read-only)",
      "Hospital cashier receipt template registry",
    ],
  },
  {
    name: "Ministry of Foreign Affairs",
    short: "MFA",
    integration: "Diaspora liaison + consular case routing",
    sla: "Same-day escalation",
    cases: "Diaspora Summit 2026 partner",
    impact: "Joint trustee accreditation pilot",
    docs: [
      "Diaspora user verification portal",
      "Consular escalation API",
    ],
  },
  {
    name: "Ghana Police Service — Land Fraud Unit",
    short: "GPS-LFU",
    integration: "Sealed evidence pack delivery",
    sla: "1h delivery",
    cases: "38 active investigations",
    impact: "12 arrests + 3 convictions to date",
    docs: [
      "Chain-of-custody evidence transfer",
      "Witness scheduling protocol",
    ],
  },
];

export default function GovernmentPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Building className="h-3 w-3" /> Government partnerships
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Working with Ghana's institutions, openly.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          GhanaWatch only works because Ghanaian institutions cooperate. These are the live
          partnerships, the integration scope, the SLAs, and the measurable impact.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {PARTNERS.map((p) => (
          <div key={p.name} className="card p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent-gold to-accent-green text-[12px] font-bold text-bg">
                {p.short}
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold">{p.name}</div>
                <div className="text-[11px] text-ink-dim">{p.integration}</div>
              </div>
              <span className="ml-auto chip" style={{ color: "#10b981" }}>
                <ShieldCheck className="h-3 w-3" /> active
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
              <Stat k="SLA" v={p.sla} />
              <Stat k="Volume" v={p.cases} />
            </div>
            <div className="mt-3 rounded-md border border-accent-green/30 bg-accent-green/5 p-3 text-[12.5px] text-accent-green">
              {p.impact}
            </div>
            <div className="mt-3">
              <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-ink-muted">Integration scope</div>
              <ul className="space-y-1 text-[12px]">
                {p.docs.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-ink-dim">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-green" />{d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 card relative overflow-hidden p-10 text-center">
        <div className="hero-grad pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <Globe className="mx-auto h-7 w-7 text-accent-gold" />
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight">Are you a Ghanaian agency? Let's talk.</h2>
          <p className="mx-auto mt-2 max-w-xl text-[14px] text-ink-dim">
            We integrate on your terms — your data residency, your audit log access, your SLAs.
            Most integrations land in 4-8 weeks.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href="/developers" className="btn btn-primary">API & webhooks <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/partners" className="btn btn-ghost">Case studies</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-line bg-bg-elev/40 p-2.5">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{k}</div>
      <div className="mt-0.5 text-[12.5px] text-ink">{v}</div>
    </div>
  );
}
