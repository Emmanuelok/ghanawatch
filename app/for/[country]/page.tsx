import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Users,
  Globe,
  Banknote,
  Check,
} from "lucide-react";

const COUNTRIES: Record<string, {
  name: string;
  flag: string;
  diasporaSize: string;
  topSectors: string[];
  remittanceCorridorUSD: string;
  fxQuirk: string;
  partner: string;
  testimonial: { quote: string; by: string; location: string };
  cities: string[];
  tax: string;
}> = {
  uk: {
    name: "United Kingdom",
    flag: "🇬🇧",
    diasporaSize: "~245,000",
    topSectors: ["Real estate", "Construction", "Funerals"],
    remittanceCorridorUSD: "$2.1B/yr",
    fxQuirk: "GBP/GHS volatility — average 8% swing per quarter. We display dual-currency.",
    partner: "Wise (corridor) + Stanbic Ghana (trust)",
    testimonial: {
      quote: "I sent £42K from London for an East Legon plot. GhanaWatch caught a title overlap in week 3 — the indenture I had wasn't actually clear.",
      by: "Nana Yaw B.",
      location: "London",
    },
    cities: ["London", "Birmingham", "Manchester", "Bristol", "Leeds"],
    tax: "UK foreign-asset rules require HMRC disclosure on overseas holdings above £50K — we generate the SA106 schedule.",
  },
  us: {
    name: "United States",
    flag: "🇺🇸",
    diasporaSize: "~340,000",
    topSectors: ["Vehicle import", "Real estate", "Construction", "Medical"],
    remittanceCorridorUSD: "$2.8B/yr",
    fxQuirk: "USD is the platform's quoting base for diaspora bonds. Easy.",
    partner: "Zelle / Wise / Stripe + Stanbic Ghana",
    testimonial: {
      quote: "Auntie was handling our Korle Bu medical care. The trustee nurse on GhanaWatch attended ward rounds and confirmed bills daily. Made the difference.",
      by: "Kojo A.",
      location: "Sydney (via US)",
    },
    cities: ["New York", "Atlanta", "Houston", "Washington DC", "Chicago", "Los Angeles"],
    tax: "FATCA + FBAR — we generate the FinCEN 114 schedule and IRS 8938 if foreign holdings cross threshold.",
  },
  ca: {
    name: "Canada",
    flag: "🇨🇦",
    diasporaSize: "~78,000",
    topSectors: ["Construction", "Funerals", "Family wealth"],
    remittanceCorridorUSD: "$420M/yr",
    fxQuirk: "CAD/GHS via two-leg FX — we surface the all-in cost upfront.",
    partner: "Wise / Interac + Stanbic Ghana",
    testimonial: {
      quote: "I'm in Toronto. My brother's been the man on the ground in Kasoa. Now I trust him AND verify, on every milestone.",
      by: "Akosua M.",
      location: "Toronto",
    },
    cities: ["Toronto", "Montreal", "Calgary", "Vancouver", "Ottawa"],
    tax: "CRA foreign-property disclosure (T1135) — we generate the schedule for tax season.",
  },
  de: {
    name: "Germany",
    flag: "🇩🇪",
    diasporaSize: "~52,000",
    topSectors: ["Business / trading", "Real estate"],
    remittanceCorridorUSD: "$310M/yr",
    fxQuirk: "EUR/GHS spread tightest via SEPA — we route accordingly.",
    partner: "Wise / N26 + Ecobank Ghana",
    testimonial: {
      quote: "Aus Hamburg habe ich einen Kosmetik-Shop in Adum aufgemacht. Die WhatsApp-Bot-Funktion mit Tante Grace ist Gold wert.",
      by: "Esi F.",
      location: "Hamburg",
    },
    cities: ["Hamburg", "Berlin", "Frankfurt", "Munich", "Düsseldorf"],
    tax: "Auslandsvermögen ab €50K an das Finanzamt — wir erzeugen die jährliche Anlage AUS.",
  },
};

export default async function ForCountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const c = COUNTRIES[country.toLowerCase()];
  if (!c) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="text-center">
        <div className="text-[64px]">{c.flag}</div>
        <div className="mt-3 text-[12px] uppercase tracking-[0.14em] text-ink-muted">For the diaspora in</div>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight md:text-5xl">{c.name}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] text-ink-dim">
          GhanaWatch is built to protect every cedi you send home. Here's how we tune the platform
          for {c.name}-based diaspora.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/onboarding" className="btn btn-primary">Get started <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/tour" className="btn btn-ghost">4-minute tour</Link>
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-4">
        <Stat icon={Users} label="Ghanaian diaspora" value={c.diasporaSize} />
        <Stat icon={Banknote} label="Annual remittance" value={c.remittanceCorridorUSD} />
        <Stat icon={Globe} label="Major cities" value={`${c.cities.length}`} sub={c.cities.slice(0, 3).join(", ") + "…"} />
        <Stat icon={ShieldCheck} label="Local partner" value={c.partner.split(" + ")[0]} sub={`+ ${c.partner.split(" + ")[1]}`} />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><TrendingUp className="h-4 w-4 text-accent-gold" /> Top sectors for {c.name}-based diaspora</div>
          <ul className="space-y-1.5 text-[13px] text-ink-dim">
            {c.topSectors.map((s) => (
              <li key={s} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent-green" /> {s}</li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <div className="mb-2 text-[14px] font-semibold">FX corridor</div>
          <p className="text-[13px] text-ink-dim">{c.fxQuirk}</p>
        </div>
        <div className="card p-6 lg:col-span-2">
          <div className="mb-2 text-[14px] font-semibold">Tax & disclosure helpers</div>
          <p className="text-[13px] text-ink-dim">{c.tax}</p>
        </div>
      </div>

      <div className="mt-12 card p-8">
        <div className="mb-3 text-[11px] uppercase tracking-[0.12em] text-ink-muted">From a {c.name} user</div>
        <blockquote className="text-[18px] leading-relaxed text-ink">"{c.testimonial.quote}"</blockquote>
        <div className="mt-3 text-[12px] text-ink-muted">— {c.testimonial.by}, {c.testimonial.location}</div>
      </div>

      <div className="mt-12 grid gap-3 md:grid-cols-3">
        {(Object.keys(COUNTRIES) as (keyof typeof COUNTRIES)[]).filter((k) => k !== country.toLowerCase()).map((k) => (
          <Link key={k} href={`/for/${k}`} className="card card-hover p-5">
            <div className="flex items-center gap-3">
              <span className="text-[28px]">{COUNTRIES[k].flag}</span>
              <div>
                <div className="text-[13px] font-semibold">For diaspora in {COUNTRIES[k].name}</div>
                <div className="text-[11px] text-ink-dim">{COUNTRIES[k].diasporaSize} Ghanaians</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-2 text-xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-ink-muted">{sub}</div>}
    </div>
  );
}
