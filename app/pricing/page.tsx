import Link from "next/link";
import { Check, Shield, Sparkles, Users, Building2 } from "lucide-react";

export const metadata = { title: "Pricing — GhanaWatch" };

const plans = [
  {
    id: "watch",
    name: "Watch",
    tagline: "For one project, one diaspora user.",
    price: "Free",
    sub: "Forever",
    icon: Shield,
    features: [
      "1 active project",
      "5 document forensic scans / month",
      "Geo-stamped site photos (basic)",
      "Audit ledger (90-day retention)",
      "AI Investigator (rate-limited)",
      "Email alerts",
    ],
    cta: "Start free",
    href: "/new-project",
  },
  {
    id: "guard",
    name: "Guard",
    tagline: "For the diaspora user with multiple projects back home.",
    price: "GHS 280",
    sub: "/month (~ £15)",
    highlight: true,
    icon: Sparkles,
    features: [
      "Up to 8 active projects",
      "Unlimited document forensic scans",
      "Vision-based receipt + photo analysis",
      "Audit ledger (lifetime)",
      "AI Investigator (unlimited)",
      "Lands Commission cross-check (10 / month)",
      "Trustee dispatch at network rates",
      "Court-admissible evidence packs",
      "Multi-currency display (GHS, USD, GBP, CAD, EUR)",
      "SMS + WhatsApp alerts",
    ],
    cta: "Upgrade to Guard",
    href: "/settings",
  },
  {
    id: "syndicate",
    name: "Syndicate",
    tagline: "For families pooling, churches, hometown associations.",
    price: "GHS 1,200",
    sub: "/month",
    icon: Users,
    features: [
      "Up to 40 active projects",
      "Multiple owners + role-based access",
      "Pooled escrow with contributor ledger",
      "Bulk trustee dispatch at 20% discount",
      "Quarterly forensic audit report",
      "Custom branding for the association",
      "API access (10K req / month)",
      "Dedicated trustee onboarding",
    ],
    cta: "Talk to us",
    href: "/settings",
  },
  {
    id: "institutional",
    name: "Institutional",
    tagline: "Banks, MTOs, embassies, diaspora bond programmes.",
    price: "Custom",
    sub: "Annual contract",
    icon: Building2,
    features: [
      "Unlimited projects, users, regions",
      "White-label & SSO",
      "Volume document forensics (millions/mo)",
      "Bank / MTO compliance feeds",
      "Custom Lands Commission, GRA, hospital integrations",
      "Dedicated CSM + trustee bench",
      "On-prem audit ledger anchoring",
      "99.9% SLA",
    ],
    cta: "Contact sales",
    href: "/settings",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14">
      <div className="mx-auto max-w-2xl text-center">
        <div className="chip mx-auto mb-4">Pricing</div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          Free for one project. Powerful for portfolios. Custom for institutions.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] text-ink-dim">
          Start free for your first project back home. Upgrade when you have more than one venture
          to protect, or when your family / hometown association wants to pool.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className={`card relative flex flex-col p-6 ${p.highlight ? "border-accent-gold/60 glow-gold" : ""}`}
            >
              {p.highlight && (
                <div className="absolute right-4 top-4 chip" style={{ color: "#f5b800", borderColor: "rgba(245,184,0,0.3)", background: "rgba(245,184,0,0.08)" }}>
                  Most popular
                </div>
              )}
              <div className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-bg-elev">
                <Icon className="h-4 w-4 text-accent-gold" />
              </div>
              <div className="mt-4">
                <div className="text-[16px] font-semibold">{p.name}</div>
                <div className="mt-1 text-[12px] text-ink-dim">{p.tagline}</div>
              </div>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight">{p.price}</span>
                <span className="text-[12px] text-ink-muted">{p.sub}</span>
              </div>
              <ul className="mt-5 space-y-2 text-[13px]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-ink-dim">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 grow" />
              <Link href={p.href} className={`btn w-full justify-center ${p.highlight ? "btn-primary" : "btn-ghost"}`}>
                {p.cta}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-16 grid gap-4 rounded-2xl border border-line bg-bg-elev/40 p-8 md:grid-cols-3">
        <Fact title="0.4%" label="Average escrow + dispatch fee on disbursed amounts (Guard plan)" />
        <Fact title="< 72h" label="Trustee on-site time, all regions" />
        <Fact title="100%" label="Of trustees verified against a Ghanaian regulator" />
      </div>
    </div>
  );
}

function Fact({ title, label }: { title: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-semibold tracking-tight gradient-text">{title}</div>
      <div className="mt-1 text-[13px] text-ink-dim">{label}</div>
    </div>
  );
}
