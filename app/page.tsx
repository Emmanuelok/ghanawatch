import Link from "next/link";
import {
  Shield,
  ScanSearch,
  MapPin,
  GanttChartSquare,
  Sparkles,
  AlertTriangle,
  Eye,
  FileSearch,
  Users,
  Lock,
  BadgeCheck,
  ArrowRight,
  Banknote,
  Brain,
  Zap,
  Layers,
} from "lucide-react";
import { SECTOR_META } from "@/components/sector-icon";
import { PLATFORM_STATS } from "@/lib/mock-data";

const sectors = Object.entries(SECTOR_META) as [keyof typeof SECTOR_META, any][];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero-grad relative">
        <div className="mx-auto max-w-7xl px-5 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-bg-elev/60 px-3 py-1 text-[11px] text-ink-dim">
              <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-accent-green" />
              For the 8.9M+ Ghanaians living abroad · GHS 7.79B sent home in 2025
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Verify every cedi, every document, every brick of your{" "}
              <span className="gradient-text">investment back home.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-[15px] leading-relaxed text-ink-dim md:text-[17px]">
              GhanaWatch is the AI intelligence platform that protects diaspora Ghanaians from fraud,
              ghost projects, double land sales, fake receipts, and "trust me, it's going well." We
              verify documents forensically, geo-stamp every site photo, anchor every event in an
              immutable audit ledger — and dispatch licensed trustees on demand.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/dashboard" className="btn btn-primary">
                Open the live demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/research" className="btn btn-ghost">
                See the research
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
              {[
                ["GHS 18.4M", "remittances tracked"],
                ["GHS 2.18M", "fraud prevented (2025)"],
                ["14,872", "documents analysed"],
                ["1,240", "vetted trustees"],
              ].map(([v, l]) => (
                <div key={l} className="bg-bg-elev p-5">
                  <div className="text-xl font-semibold tracking-tight md:text-2xl">{v}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="border-y border-line bg-bg-elev/30">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div>
              <div className="chip mb-4">
                <AlertTriangle className="h-3 w-3 text-accent-red" /> The diaspora trust gap
              </div>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                The #1 reason Ghanaians abroad lose their savings isn't bad luck — it's the absence
                of independent verification.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-dim">
                A Commonwealth Secretariat survey found <span className="text-ink">56% of diaspora
                Africans</span> cite corruption and mismanagement as the #1 barrier to investing back
                home. In Ghana, the Supreme Court has documented <span className="text-ink">single
                land plots sold to as many as 13 different buyers</span>. Ghost construction projects,
                fake receipts, inflated funeral bills, hospital ransoms, and "auntie said it's all
                going well" stories drain billions in remittance value every year.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">
                Existing tools either (a) are narrow agency services that take over your project, or
                (b) require you to fly home. No platform exists that lets you verify what's
                happening — across every sector — with forensic AI, geo-stamped evidence, and an
                immutable audit trail.
              </p>
              <p className="mt-5 text-[15px] font-medium text-ink">That's what GhanaWatch is.</p>
            </div>

            {/* Pain examples */}
            <div className="grid gap-3">
              {[
                {
                  title: "Kasoa, Central Region",
                  body: "Akosua sent £42,000 from Toronto for her family home. 14 months in, her brother had only laid the foundation. Receipts didn't match material on site.",
                  flag: "Ghost construction",
                },
                {
                  title: "East Legon Hills, Accra",
                  body: "Nana Yaw paid GHS 1.25M from London for a 2.5-acre plot. On registration, the Lands Commission flagged a competing claim from 2019. Stool elder's signature didn't match prior samples.",
                  flag: "Title overlap / double-sale",
                },
                {
                  title: "Adum, Kumasi",
                  body: "Esi sent funds for a cosmetics shop from Hamburg. The 'rent top-up' receipt her aunt sent had a 94% signature match with the previous one — same handwriting, different date.",
                  flag: "Duplicate-receipt fraud",
                },
              ].map((c) => (
                <div key={c.title} className="card card-hover p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-[12px] uppercase tracking-[0.12em] text-ink-muted">{c.title}</div>
                    <span className="chip risk-high">{c.flag}</span>
                  </div>
                  <p className="text-[14px] leading-relaxed text-ink-dim">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE SOLVE IT — the intelligence stack */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-12 max-w-2xl">
          <div className="chip mb-4"><Brain className="h-3 w-3 text-accent-gold" /> The intelligence stack</div>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Seven layers of forensic verification, working continuously.
          </h2>
          <p className="mt-4 text-[15px] text-ink-dim">
            We don't replace your contractor or your auntie. We give you the independent verification
            layer they've never had to face — across every sector you fund from abroad.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: ScanSearch,
              title: "AI Document Forensics",
              desc: "Every receipt, invoice, indenture, BoL, permit and bill runs through a multi-model forensic engine: font consistency, pixel tampering, EXIF metadata, AI-generation probability, duplicate-hash detection, vendor pattern matching.",
            },
            {
              icon: MapPin,
              title: "Geo-stamped Site Verification",
              desc: "Every site photo is GPS + time-anchored, scene-matched against prior verified imagery, and cross-referenced with the registered parcel. Off-site, off-time, or off-scene photos are auto-flagged.",
            },
            {
              icon: Layers,
              title: "Lands Commission Cross-Check",
              desc: "We cross-reference every parcel, indenture, and site plan against Ghana's Lands Commission registry (LC Online, GELIS). Boundary overlap, competing claims, stool consent gaps — surfaced before you pay.",
            },
            {
              icon: GanttChartSquare,
              title: "Immutable Audit Ledger",
              desc: "Every event — upload, payment, verification, alert — is hash-chained and signed. You and a court can reconstruct the full chain of custody at any time. No retroactive edits.",
            },
            {
              icon: Users,
              title: "Vetted Trustee Network",
              desc: "Dispatch licensed surveyors, QSs, conveyancers, clearing agents, doctors, and ag-extension officers for on-site verification within 72 hours. License-verified against the relevant Ghanaian regulator.",
            },
            {
              icon: Lock,
              title: "Milestone Escrow",
              desc: "Funds release only when a milestone is independently verified — by document forensics, site evidence, and trustee attestation. No more lump-sum 'just send everything'.",
            },
            {
              icon: Sparkles,
              title: "AI Investigator",
              desc: "Conversational forensic assistant. Describe what's happening, and it draws a red-flag map, a verification plan, and recommends actions — grounded in Ghanaian agencies and norms.",
            },
            {
              icon: AlertTriangle,
              title: "Real-time Fraud Signals",
              desc: "Duplicate-receipt hashes, signature variance, off-pattern vendor stamps, GPS anomalies, BOQ-vs-photo mismatch — all detected continuously and surfaced as ranked alerts.",
            },
            {
              icon: BadgeCheck,
              title: "Court-Admissible Evidence Packs",
              desc: "Generate a sealed, hash-anchored PDF evidence pack at any time, ready for litigation, insurance claim, or police report. Signed metadata, ledger excerpt, all forensics in one bundle.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-bg p-6">
              <div className="mb-4 inline-grid h-9 w-9 place-items-center rounded-lg border border-line bg-bg-elev">
                <f.icon className="h-4 w-4 text-accent-gold" />
              </div>
              <div className="mb-2 text-[15px] font-semibold tracking-tight">{f.title}</div>
              <p className="text-[13px] leading-relaxed text-ink-dim">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTORS */}
      <section className="border-t border-line bg-bg-elev/30">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="chip mb-4"><Zap className="h-3 w-3 text-accent-gold" /> Coverage</div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">One platform. Every sector you fund from abroad.</h2>
            </div>
            <Link href="/sectors" className="btn btn-ghost">All sectors →</Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3">
            {sectors.map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <div key={key} className="card card-hover flex items-start gap-3 p-5">
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
                    style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}
                  >
                    <Icon size={18} style={{ color: meta.color }} />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold">{meta.label}</div>
                    <div className="mt-0.5 text-[12px] text-ink-dim">{sectorBlurb(key as any)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DIFFERENTIATION */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="chip mb-4"><Eye className="h-3 w-3 text-accent-gold" /> Why now, why us</div>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              The market has agency services. It does not have a verification intelligence layer.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-dim">
              DiasporaBuild, House of Diaspora, Pencil Home — these are <em>service providers</em>. You
              have to entrust your project to them, then hope. GhanaWatch is different: you keep
              whoever you trust on the ground (your brother, your contractor, your lawyer), and we
              give you the independent forensic verification layer over the top.
            </p>
            <ul className="mt-6 space-y-2.5 text-[14px]">
              {[
                "Works with any contractor, any agent, any relative",
                "Cross-sector (real estate, construction, vehicles, business, medical, funeral, agri, education)",
                "Forensic-first: document AI + scene-matching + geo + ledger",
                "Court-admissible evidence packs out of the box",
                "Trustee network you can dispatch in 72 hours",
              ].map((l) => (
                <li key={l} className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                  <span className="text-ink-dim">{l}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Comparison */}
          <div className="card overflow-hidden">
            <div className="border-b border-line bg-bg-elev px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-ink-muted">
              How GhanaWatch differs
            </div>
            <table className="w-full text-[13px]">
              <thead className="text-left text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                <tr className="border-b border-line">
                  <th className="px-5 py-3">Capability</th>
                  <th className="px-3 py-3 text-center">Agency services</th>
                  <th className="px-3 py-3 text-center">Banks / MoMo</th>
                  <th className="px-5 py-3 text-right">GhanaWatch</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Document forensic AI", false, false, true],
                  ["Geo-stamped site verification", "partial", false, true],
                  ["Immutable audit ledger", false, false, true],
                  ["Lands Commission cross-check", "partial", false, true],
                  ["Multi-sector coverage", false, false, true],
                  ["AI investigator", false, false, true],
                  ["Trustee dispatch network", true, false, true],
                  ["Court-admissible evidence pack", false, false, true],
                ].map(([cap, agency, bank, gw], i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 text-ink-dim">{cap as string}</td>
                    <td className="px-3 py-3 text-center">{mark(agency as any)}</td>
                    <td className="px-3 py-3 text-center">{mark(bank as any)}</td>
                    <td className="px-5 py-3 text-right">{mark(gw as any)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="card relative overflow-hidden p-10 text-center md:p-16">
          <div className="hero-grad pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
            <div className="chip mx-auto"><Banknote className="h-3 w-3 text-accent-gold" /> Built for the diaspora</div>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Stop hoping. Start verifying.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-ink-dim">
              Open the live demo. Walk through a real flagged construction project. See the document
              forensics, geo-stamped photos, and the audit ledger that no one can rewrite.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/dashboard" className="btn btn-primary">Open the live demo <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/verify" className="btn btn-ghost">Try document verification</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function sectorBlurb(key: string) {
  const m: Record<string, string> = {
    construction: "BOQ-anchored milestones, material receipts, drone progress checks.",
    "real-estate": "Title + indenture forensics, Lands Commission overlap detection.",
    "vehicle-import": "BoL + VIN + GRA duty cross-match, clearing-agent registry.",
    business: "Vendor invoice forensics, till audits, monthly trustee shops.",
    education: "School fee receipt verification, attendance attestation.",
    funeral: "Mortuary fee-list cross-check, vendor + contributor ledger audit.",
    medical: "Hospital bill template match, ward visit trustee verification.",
    agriculture: "Yield audits, feed supplier validation, drone farm imagery.",
    remittance: "Track every transfer's downstream use with verifiable evidence.",
  };
  return m[key];
}

function mark(v: boolean | "partial") {
  if (v === true)
    return <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-accent-green/15 text-accent-green">✓</span>;
  if (v === "partial")
    return <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-accent-gold/15 text-accent-gold">~</span>;
  return <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-ink-muted/15 text-ink-muted">—</span>;
}
