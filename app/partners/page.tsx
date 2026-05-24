import Link from "next/link";
import { Building2, ArrowRight, Quote, TrendingUp, Users, Globe, ShieldCheck, Check } from "lucide-react";

export const metadata = { title: "Partners & case studies — GhanaWatch" };

const PARTNERS = [
  "Stanbic Bank Ghana", "Ecobank", "Access Bank Ghana", "MTN Mobile Money",
  "Wise", "PayPal Xoom", "Western Union", "Ria Money Transfer",
  "Bank of Ghana", "Ghana Revenue Authority", "Lands Commission",
  "British High Commission", "U.S. Embassy", "High Commission of Canada",
  "Ghana Investment Promotion Centre", "Ministry of Foreign Affairs",
];

const CASE_STUDIES = [
  {
    name: "Stanbic Bank Ghana — Diaspora corridor compliance feed",
    tag: "Bank · KYC + AML",
    impact: "−42% in-corridor fraud loss",
    body: "Stanbic plugged GhanaWatch's compliance feed into their diaspora remittance corridor. Every inbound transfer that touched a flagged project / vendor / counterparty triggered an additional review step. Net loss to corridor fraud fell 42% in the first 9 months. The bank also surfaced 14 SARs they would not otherwise have filed.",
    quote: "We're seeing diaspora fraud signals 3-4 weeks earlier than our previous tooling caught them. The webhook integration was clean — done in a sprint.",
    quoteBy: "Head of Compliance, Stanbic Bank Ghana",
  },
  {
    name: "Ghana Diaspora Infrastructure Bond — Verified project pool",
    tag: "Sovereign · Capital markets",
    impact: "187M of 250M USD raised in 9 months",
    body: "The Ministry of Finance used GhanaWatch's verified-project pool as the anchoring evidence for the 2026 Series A diaspora bond. Pool composition is independently audited per quarter; investors see signed pool-level reports. Coupon priced 220 bps inside equivalent Eurobonds.",
    quote: "Diaspora investors don't price political risk — they price the credibility of execution evidence. GhanaWatch gave us that evidence at scale.",
    quoteBy: "Director, Debt Management Division, Ministry of Finance",
  },
  {
    name: "British High Commission Accra — Consular case desk",
    tag: "Embassy · Consular assistance",
    impact: "38 active cases on the platform",
    body: "The British High Commission uses the GhanaWatch Embassy Desk to triage and track diaspora-fraud consular assistance cases involving UK citizens. Sealed evidence packs accelerate hand-off to Ghana Police Land Fraud Unit by an average of 18 days.",
    quote: "When a UK national walks in with a fraud case, having GhanaWatch open in another tab means we know what's already been verified before they finish the first sentence.",
    quoteBy: "Senior Consular Officer, British High Commission",
  },
  {
    name: "MTN Mobile Money — Merchant ID verification API",
    tag: "MTO · KYC for vendors",
    impact: "1.2M lookups / month",
    body: "MTN integrated GhanaWatch's vendor verification API to cross-check MoMo merchant IDs requested by diaspora users. False-merchant signups in the affected corridor dropped 67% over 6 months.",
    quote: "It's the cleanest 'is this a real Ghanaian vendor' API in the market. We route every diaspora-flagged merchant through it.",
    quoteBy: "Product Lead, MTN MoMo",
  },
];

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Building2 className="h-3 w-3" /> For institutional partners
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
          Banks, MTOs, embassies, sovereign issuers — built on GhanaWatch.
        </h1>
        <p className="mt-3 text-[15px] text-ink-dim">
          The diaspora trust layer for serious institutions. White-label, on-prem audit-ledger
          anchoring, custom regulator integrations, dedicated CSM. Below — four customers showing
          what real deployment looks like.
        </p>
      </div>

      {/* Partner logos */}
      <div className="mt-10">
        <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">Trusted by</div>
        <div className="grid gap-2 rounded-2xl border border-line bg-bg-elev/40 p-6 md:grid-cols-4 lg:grid-cols-6">
          {PARTNERS.map((p) => (
            <div key={p} className="grid h-14 place-items-center rounded-md border border-line bg-bg-card text-center text-[11px] font-semibold text-ink-dim">
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <Stat icon={Globe} label="Countries served" value="47" />
        <Stat icon={Users} label="Diaspora users" value="8,950+" />
        <Stat icon={ShieldCheck} label="Compliance feeds" value="4 active" />
        <Stat icon={TrendingUp} label="Avg corridor-fraud reduction" value="−38%" />
      </div>

      {/* Case studies */}
      <div className="mt-12">
        <div className="mb-4 text-[14px] font-semibold">Case studies</div>
        <div className="space-y-5">
          {CASE_STUDIES.map((c) => (
            <div key={c.name} className="card grid gap-5 p-6 lg:grid-cols-[2fr_1fr]">
              <div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                  <span className="chip">{c.tag}</span>
                  <span className="chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.25)" }}>{c.impact}</span>
                </div>
                <h3 className="mt-3 text-[18px] font-semibold tracking-tight">{c.name}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">{c.body}</p>
              </div>
              <div className="rounded-xl border border-line bg-bg-elev/40 p-5">
                <Quote className="h-5 w-5 text-accent-gold" />
                <p className="mt-3 text-[13px] italic text-ink">"{c.quote}"</p>
                <div className="mt-3 text-[11px] text-ink-muted">— {c.quoteBy}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What you get */}
      <div className="mt-12 card p-6">
        <div className="mb-3 text-[14px] font-semibold">What institutional partners get</div>
        <ul className="grid gap-2 text-[13px] text-ink-dim md:grid-cols-2">
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> White-label deployment + SSO</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Volume document forensics (millions / month)</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Bank / MTO compliance feeds (REST + webhook)</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Custom LC / GRA / hospital integrations</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> On-prem audit-ledger anchoring</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> SOC 2 Type II + ISO 27001 reports</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Dedicated CSM + 24/7 SLA</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Dedicated trustee bench for partner-priority dispatches</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-10 card relative overflow-hidden p-10 text-center md:p-14">
        <div className="hero-grad pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Bring GhanaWatch into your institution.</h2>
          <p className="mx-auto mt-3 max-w-xl text-[14px] text-ink-dim">
            Pilot in 30 days. Full deployment in 90. Custom corridor integration in 6 months.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Link href="/pricing" className="btn btn-primary">Talk to sales <ArrowRight className="h-3.5 w-3.5" /></Link>
            <Link href="/developers" className="btn btn-ghost">See the API</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
