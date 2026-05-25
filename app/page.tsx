"use client";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  ScanSearch,
  Sparkles,
  ArrowRight,
  Camera,
  ScrollText,
  Users,
  Brain,
  Banknote,
  Globe,
  Building2,
  AlertTriangle,
  Lock,
  Layers,
  TrendingUp,
  Zap,
  Eye,
  Heart,
  HardHat,
  LandPlot,
  Car,
  Briefcase,
  GraduationCap,
  Flower2,
  HeartPulse,
  Wheat,
  MessageCircle,
  Star,
  ChevronRight,
  Play,
  Map as MapIcon,
  Fingerprint,
  Bot,
  Cpu,
  Gavel,
} from "lucide-react";
import { LiveTicker, RotatingHero, PersonaCard, BentoFeature, AnimatedNumber } from "@/components/landing";

const SECTORS = [
  { icon: HardHat, label: "Construction", color: "#f5b800" },
  { icon: LandPlot, label: "Land & Real Estate", color: "#00a86b" },
  { icon: Car, label: "Vehicle Import", color: "#3b82f6" },
  { icon: Briefcase, label: "Business", color: "#8b5cf6" },
  { icon: GraduationCap, label: "Education", color: "#ec4899" },
  { icon: Flower2, label: "Funerals", color: "#94a3b8" },
  { icon: HeartPulse, label: "Medical", color: "#ef4444" },
  { icon: Wheat, label: "Agriculture", color: "#22c55e" },
];

const PARTNERS = [
  "Stanbic Bank Ghana", "Ecobank", "MTN MoMo", "Wise", "PayPal Xoom",
  "Lands Commission", "Bank of Ghana", "Ghana Revenue Authority",
  "British High Commission", "U.S. Embassy", "High Commission of Canada",
  "Embassy of Germany", "Korle Bu Teaching Hospital", "Komfo Anokye",
  "Diamond Cement", "Aluworks", "GHACEM", "Western Union",
];

const TESTIMONIALS = [
  {
    quote: "GhanaWatch caught a title overlap in week 3. I was about to release £42K for a plot that wasn't actually clear.",
    by: "Nana Yaw B.",
    location: "🇬🇧 London",
    role: "Diaspora owner · East Legon Hills plot",
  },
  {
    quote: "My brother is the man on the ground in Kasoa. Now I trust him AND verify, on every milestone. Best 280 cedis I spend each month.",
    by: "Akosua M.",
    location: "🇨🇦 Toronto",
    role: "Diaspora owner · 4-bedroom build",
  },
  {
    quote: "We've seen diaspora fraud signals 3-4 weeks earlier than our previous tooling. The webhook integration took a sprint.",
    by: "Head of Compliance",
    location: "🇬🇭 Accra",
    role: "Stanbic Bank Ghana",
  },
  {
    quote: "Diaspora investors don't price political risk — they price the credibility of execution evidence. GhanaWatch gave us that.",
    by: "Director, Debt Management",
    location: "🇬🇭 Accra",
    role: "Ministry of Finance · Diaspora Bond Series A",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="mesh-bg absolute inset-0" />
        <div className="absolute -left-32 top-20 h-[500px] w-[500px] rounded-full bg-accent-gold/25 blob" />
        <div className="absolute -right-32 top-40 h-[500px] w-[500px] rounded-full bg-accent-green/20 blob b2" />
        <div className="absolute left-1/3 top-[400px] h-[400px] w-[400px] rounded-full bg-violet-500/15 blob b3" />

        <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-32 md:pt-28 md:pb-40">
          <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-elev/80 px-3 py-1 text-[11px] backdrop-blur">
                <span className="live-dot" />
                <span className="text-ink-dim">8,950 diaspora users · GHS 18.4M tracked · 1,240 trustees live</span>
              </div>

              <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
                Verify every cedi.
                <br />
                <RotatingHero
                  words={[
                    { text: "Build the home.", color: "#f5b800" },
                    { text: "Buy the land.", color: "#00a86b" },
                    { text: "Send to family.", color: "#ef4444" },
                    { text: "Import the car.", color: "#3b82f6" },
                    { text: "Bury the dead.", color: "#94a3b8" },
                    { text: "Save the patient.", color: "#ec4899" },
                  ]}
                />
                <br />
                <span className="gradient-text">Without leaving home.</span>
              </h1>

              <p className="mt-6 max-w-xl text-balance text-[16px] leading-relaxed text-ink-dim md:text-[18px]">
                The intelligence platform for the <strong className="text-ink">8.9 million Ghanaians abroad</strong>
                {" "}who send <strong className="text-ink">$7.79 billion home every year</strong>. AI document forensics,
                geo-stamped site verification, immutable audit ledger, licensed trustees, escrow,
                court-admissible evidence — all working <em className="text-ink">with</em> whoever
                you already trust on the ground.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/onboarding" className="btn btn-primary text-[15px] px-5 py-3">
                  Get started · free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/tour" className="btn btn-ghost text-[15px] px-5 py-3">
                  <Play className="h-4 w-4" /> 4-min product tour
                </Link>
                <Link href="/demo" className="btn btn-ghost text-[15px] px-5 py-3">
                  Watch the scripted demo
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] text-ink-muted">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-accent-green" /> SOC 2 in progress</span>
                <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-accent-green" /> Stanbic Trust account</span>
                <span className="flex items-center gap-1.5"><Fingerprint className="h-3.5 w-3.5 text-accent-green" /> Chain-anchored daily</span>
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-accent-green" /> 1,240 licensed trustees</span>
              </div>
            </div>

            {/* Floating UI preview */}
            <div className="relative">
              <FloatingPreview />
            </div>
          </div>
        </div>

        {/* Live activity ticker */}
        <div className="relative border-y border-line bg-bg-elev/40 py-3">
          <div className="scroll-marquee overflow-hidden">
            <LiveTicker />
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-12 max-w-3xl">
          <div className="chip mb-4"><Eye className="h-3 w-3 text-accent-gold" /> Built for everyone in the loop</div>
          <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Whatever role you play in the diaspora investment chain, GhanaWatch has a path for you.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <PersonaCard
            href="/onboarding"
            icon={Globe}
            color="#f5b800"
            who="I'm a diaspora Ghanaian"
            title="Protect what you send home."
            points={["Verify every receipt with AI", "Track every brick of construction", "Dispatch trustees in 72h"]}
            cta="Get started · free"
          />
          <PersonaCard
            href="/manager"
            icon={MessageCircle}
            color="#10b981"
            who="I'm managing a project on the ground"
            title="Stay on WhatsApp. No new app."
            points={["Snap a receipt, the bot does the rest", "Geo-stamped progress in seconds", "Be the trusted manager, transparently"]}
            cta="See the manager bot"
          />
          <PersonaCard
            href="/network/become-a-trustee"
            icon={ShieldCheck}
            color="#3b82f6"
            who="I'm a licensed surveyor / lawyer / clearing agent"
            title="Get verifiable diaspora work."
            points={["Paid through escrow within 24h", "GhanaWatch handles client acquisition", "PI insurance included"]}
            cta="Become a trustee"
          />
          <PersonaCard
            href="/vendors"
            icon={Building2}
            color="#8b5cf6"
            who="I'm a vendor (cement, rebar, tiles…)"
            title="Get diaspora customers, paid by escrow."
            points={["GRA TIN + MoMo verification", "Bid on RFQs", "Payment locked the moment they buy"]}
            cta="Join the marketplace"
          />
          <PersonaCard
            href="/compliance"
            icon={Banknote}
            color="#ec4899"
            who="I'm a bank / MTO / sovereign issuer"
            title="Compliance feed for your corridor."
            points={["Document forensics API", "SAR/STR queue + workflow", "White-label or embed"]}
            cta="See the institutional view"
          />
          <PersonaCard
            href="/embassy"
            icon={Globe}
            color="#06b6d4"
            who="I'm a consular desk officer"
            title="One workspace for citizen-fraud cases."
            points={["Sealed evidence packs", "Bilateral with GPS Land Fraud Unit", "Citizen-by-citizenship queue"]}
            cta="Open embassy desk"
          />
        </div>
      </section>

      {/* THE BIG PROBLEM */}
      <section className="relative overflow-hidden border-y border-line bg-bg-elev/30">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="relative mx-auto max-w-7xl px-5 py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="chip mb-4">
                <AlertTriangle className="h-3 w-3 text-accent-red" /> The diaspora trust gap
              </div>
              <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                <span className="text-accent-red">56%</span> of diaspora Africans say corruption is the #1 barrier to investing back home.
              </h2>
              <p className="mt-6 text-[16px] leading-relaxed text-ink-dim">
                Ghana's Supreme Court has recorded a single land plot sold to{" "}
                <strong className="text-accent-gold">13 different buyers</strong>. Ghost
                construction, fake receipts, inflated funeral bills, hospital ransoms, and "auntie
                said it's all going well" drain billions of remittance value yearly.
              </p>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-dim">
                Existing tools are either narrow agency services that take over your project, or
                require you to fly home. <strong className="text-ink">No platform exists that lets
                you verify what's happening — across every sector — with forensic AI, geo-stamped
                evidence, and an immutable audit trail.</strong>
              </p>
              <p className="mt-6 text-[18px] font-semibold tracking-tight">
                That's what GhanaWatch is.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { city: "Kasoa, Central Region", flag: "Ghost construction", body: "Akosua sent £42,000 from Toronto for her family home. 14 months in, her brother had only laid the foundation. Receipts didn't match material on site.", c: "#ef4444" },
                { city: "East Legon Hills, Accra", flag: "Title overlap / double-sale", body: "Nana Yaw paid GHS 1.25M from London for a 2.5-acre plot. On registration, the Lands Commission flagged a competing claim from 2019. Stool elder's signature didn't match prior samples.", c: "#f59e0b" },
                { city: "Adum, Kumasi", flag: "Duplicate-receipt fraud", body: "Esi sent funds for a cosmetics shop from Hamburg. The 'rent top-up' receipt her aunt sent had a 94% signature match with the previous one.", c: "#8b5cf6" },
                { city: "Tema Port", flag: "Last-minute duty 'penalty'", body: "Yaa shipped a Civic from New York. Her clearing agent added a GHS 8,000 'penalty' the morning of release, with no GRA receipt.", c: "#3b82f6" },
              ].map((c) => (
                <div key={c.city} className="gradient-border p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">{c.city}</div>
                    <span className="chip" style={{ color: c.c, borderColor: `${c.c}40`, background: `${c.c}10` }}>
                      <AlertTriangle className="h-3 w-3" /> {c.flag}
                    </span>
                  </div>
                  <p className="text-[14px] leading-relaxed text-ink-dim">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — bento */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-12 max-w-3xl">
          <div className="chip mb-4"><Brain className="h-3 w-3 text-accent-gold" /> The intelligence stack</div>
          <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Twelve layers of verification — all working continuously, all visible to you.
          </h2>
          <p className="mt-5 text-[16px] text-ink-dim">
            We don't replace your contractor or your auntie. We give you the independent
            verification layer they've never had to face.
          </p>
        </div>

        <div className="grid auto-rows-[180px] gap-4 md:grid-cols-4">
          <BentoFeature title="AI Document Forensics" desc="Receipts, invoices, indentures — every doc forensiced for font drift, pixel tampering, AI generation, vendor pattern." icon={ScanSearch} color="#f5b800" className="md:col-span-2 md:row-span-2" big href="/verify" />
          <BentoFeature title="Geo-stamped Sites" desc="GPS + scene-match every photo against prior verified ones." icon={Camera} color="#00a86b" href="/projects/kasoa-4bed" />
          <BentoFeature title="Vetted Trustees" desc="1,240 licensed surveyors, lawyers, QSs, doctors dispatched in 72h." icon={Users} color="#3b82f6" href="/network" />
          <BentoFeature title="Immutable Audit Ledger" desc="Every event hash-chained, daily Merkle root anchored to Bitcoin + Polygon." icon={ScrollText} color="#8b5cf6" className="md:col-span-2" href="/ledger" />
          <BentoFeature title="Lands Commission Cross-Check" desc="Live API for parcel + indenture verification." icon={Layers} color="#ec4899" href="/government" />
          <BentoFeature title="Milestone Escrow" desc="Funds release only on verified evidence + your biometric." icon={Lock} color="#10b981" href="/funding" />
          <BentoFeature title="AI Investigator" desc="Conversational forensic assistant grounded in Ghanaian agencies & law." icon={Bot} color="#f5b800" className="md:col-span-2" href="/investigator" />
          <BentoFeature title="Insurance Cover" desc="Fraud cover priced from your project's own signals." icon={ShieldCheck} color="#06b6d4" href="/insurance" />
          <BentoFeature title="Court-Admissible Evidence Packs" desc="One-click sealed PDFs ready for litigation, insurance, or police." icon={Gavel} color="#ef4444" href="/projects/east-legon-plot/evidence" />
          <BentoFeature title="Smart-Contract Escrow" desc="Optional on-chain USDC escrow on Base. 3-of-3 multisig." icon={Cpu} color="#8b5cf6" href="/escrow-contract" />
          <BentoFeature title="WhatsApp Manager Bot" desc="The on-ground person stays on WhatsApp. No new app." icon={MessageCircle} color="#10b981" href="/manager" />
        </div>
      </section>

      {/* SECTORS */}
      <section className="border-y border-line bg-bg-elev/30 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 max-w-2xl">
            <div className="chip mb-4"><Zap className="h-3 w-3 text-accent-gold" /> Cross-sector</div>
            <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Every sector you fund from abroad — one platform.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
            {SECTORS.map((s) => (
              <Link key={s.label} href="/sectors" className="bento-card group flex flex-col items-center justify-center gap-3 p-6">
                <div className="grid h-14 w-14 place-items-center rounded-2xl transition-transform group-hover:scale-110" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                  <s.icon style={{ color: s.color }} className="h-7 w-7" />
                </div>
                <span className="text-center text-[13px] font-semibold">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE STATS */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-40" />
        <div className="relative mx-auto max-w-7xl px-5 py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="chip mb-4"><TrendingUp className="h-3 w-3 text-accent-gold" /> Live metrics</div>
              <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                The numbers, in the open.
              </h2>
              <p className="mt-5 max-w-md text-[15px] text-ink-dim">
                A diaspora trust platform that won't show its numbers is asking you to trust on
                faith. So here are ours — refreshed live, no curation.
              </p>
              <Link href="/transparency" className="btn btn-ghost mt-6">Full transparency dashboard <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatTile label="Diaspora users" suffix="+" target={8950} color="#f5b800" />
              <StatTile label="Active projects" target={1487} color="#00a86b" />
              <StatTile label="Tracked value (GHS)" suffix="M" target={18.4} decimals={1} color="#3b82f6" />
              <StatTile label="Fraud prevented (GHS)" suffix="M" target={2.18} decimals={2} color="#ef4444" />
              <StatTile label="Licensed trustees" target={1240} color="#8b5cf6" />
              <StatTile label="Documents analysed" target={14872} color="#ec4899" />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-line bg-bg-elev/20 py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 max-w-2xl">
            <div className="chip mb-4"><Star className="h-3 w-3 text-accent-gold" /> What they say</div>
            <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">From the diaspora and the institutions.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <div key={t.by} className="gradient-border p-6">
                <div className="text-3xl text-accent-gold opacity-50">"</div>
                <p className="-mt-2 text-[16px] leading-relaxed text-ink">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent-gold to-accent-green text-[12px] font-bold text-bg">
                    {t.by.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold">{t.by} <span className="ml-1 text-[12px] text-ink-muted">{t.location}</span></div>
                    <div className="text-[11px] text-ink-dim">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-6 text-center text-[11px] uppercase tracking-[0.14em] text-ink-muted">Trusted by · partners + integrators</div>
          <div className="scroll-marquee overflow-hidden">
            <div className="ticker flex gap-8 whitespace-nowrap">
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <span key={i} className="rounded-md border border-line bg-bg-elev/40 px-4 py-2 text-[12.5px] font-semibold text-ink-dim">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTIONS */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="gradient-border overflow-hidden">
          <div className="grid items-center gap-8 p-10 md:grid-cols-2 md:p-14">
            <div>
              <div className="chip mb-4"><Building2 className="h-3 w-3 text-accent-gold" /> Institutional</div>
              <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Banks, MTOs, embassies, sovereign issuers — built on GhanaWatch.
              </h2>
              <p className="mt-4 max-w-md text-[14px] text-ink-dim">
                White-label, on-prem ledger anchoring, custom regulator integrations, dedicated CSM.
                Pilot in 30 days; full deployment in 90.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/partners" className="btn btn-primary">Case studies <ArrowRight className="h-3.5 w-3.5" /></Link>
                <Link href="/developers" className="btn btn-ghost">API & webhooks</Link>
                <Link href="/whitelabel" className="btn btn-ghost">White-label studio</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Corridor fraud reduction", value: "−38%", icon: TrendingUp },
                { label: "Bond raised (verified pool)", value: "USD 187M", icon: Banknote },
                { label: "Active partners", value: "16+", icon: Globe },
                { label: "Embassy cases", value: "143", icon: Users },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-line bg-bg-elev/40 p-4">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                    <s.icon className="h-3 w-3 text-accent-gold" /> {s.label}
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-60" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-gold/10 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-5 py-32 text-center">
          <div className="chip mx-auto mb-6"><Heart className="h-3 w-3 text-accent-red" /> Why we built this</div>
          <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Every Ghanaian abroad has either lost money — or knows someone who has.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-ink-dim">
            $7.79 billion goes home from the diaspora every year. The single biggest force in
            Ghana's economy is also its most invisible, most under-protected, most exploited.
            GhanaWatch is the layer between trust and verification — built so the next Ghanaian
            abroad doesn't have to be the next victim.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/onboarding" className="btn btn-primary text-[15px] px-5 py-3">Start free <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/research" className="btn btn-ghost text-[15px] px-5 py-3">Read the research</Link>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-8 text-center">
          <div className="chip mx-auto mb-4"><MapIcon className="h-3 w-3 text-accent-gold" /> Jump in</div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Pick the door that matches what you need today.</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {[
            { label: "Verify a document", href: "/verify", icon: ScanSearch },
            { label: "Talk to AI Investigator", href: "/investigator", icon: Bot },
            { label: "Build cost simulator", href: "/tools/cost-simulator", icon: Cpu },
            { label: "Look up Ghana case law", href: "/case-law", icon: Gavel },
            { label: "Browse the marketplace", href: "/marketplace", icon: Briefcase },
            { label: "Check market rates", href: "/benchmarks", icon: TrendingUp },
            { label: "Email forensics", href: "/email-forensics", icon: ShieldCheck },
            { label: "AI fraud forecast", href: "/forecasting", icon: Brain },
            { label: "Run the scripted demo", href: "/demo", icon: Play },
            { label: "Open the platform map", href: "/map", icon: MapIcon },
            { label: "Hometown rooms", href: "/community", icon: Users },
            { label: "Vehicle duty calc", href: "/tools/vehicle-duty", icon: Car },
          ].map((q) => (
            <Link key={q.href} href={q.href} className="bento-card group flex items-center gap-3 p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-bg-elev">
                <q.icon className="h-4 w-4 text-accent-gold" />
              </div>
              <div className="flex-1 text-[13px] font-semibold">{q.label}</div>
              <ChevronRight className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="absolute inset-0 mesh-bg" />
        <div className="relative mx-auto max-w-5xl px-5 py-28 text-center">
          <h2 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Stop hoping. <span className="gradient-text">Start verifying.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[16px] text-ink-dim">
            12-minute onboarding. Free for your first project. Add a project, invite your
            manager, dispatch your first trustee — by lunchtime.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/onboarding" className="btn btn-primary text-[15px] px-6 py-3">Open the live app <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/pricing" className="btn btn-ghost text-[15px] px-6 py-3">See pricing</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StatTile({ label, target, prefix = "", suffix = "", decimals = 0, color }: any) {
  return (
    <div className="gradient-border p-5">
      <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl" style={{ color }}>
        {prefix}<AnimatedNumber to={target} decimals={decimals} />{suffix}
      </div>
    </div>
  );
}

function FloatingPreview() {
  return (
    <div className="relative h-[480px]">
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 float-y">
        <div className="gradient-border p-5 backdrop-blur w-[260px]">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">
            <Shield className="h-3 w-3 text-accent-gold" /> East Legon Hills · Risk
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="relative">
              <svg width="84" height="84" className="-rotate-90">
                <circle cx="42" cy="42" r="34" stroke="#1a1d27" strokeWidth="8" fill="none" />
                <circle cx="42" cy="42" r="34" stroke="#ef4444" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${(84 / 100) * 213} 213`} />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-[22px] font-bold text-risk-high">84</div>
            </div>
            <div>
              <div className="text-[12px] text-ink">3 critical alerts</div>
              <div className="text-[10px] text-ink-muted">Title overlap detected · Lands Commission</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-4 float-y" style={{ animationDelay: "-2s" }}>
        <div className="gradient-border p-3">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-accent-green/15">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-green" />
            </div>
            <div className="text-[12px]">
              <div className="font-semibold text-ink">Receipt verified</div>
              <div className="text-[10px] text-ink-muted">GHS 28,750 · Aluworks · 94%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-12 float-y" style={{ animationDelay: "-4s" }}>
        <div className="gradient-border p-3">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-accent-red/15">
              <AlertTriangle className="h-3.5 w-3.5 text-accent-red" />
            </div>
            <div className="text-[12px]">
              <div className="font-semibold text-ink">Off-site photo</div>
              <div className="text-[10px] text-ink-muted">1.18 km off parcel · Kasoa</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-2 float-y" style={{ animationDelay: "-3s" }}>
        <div className="gradient-border p-3">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-accent-gold to-accent-green text-[10px] font-bold text-bg">KO</div>
            <div className="text-[12px]">
              <div className="font-semibold text-ink">Kojo Owusu accepted</div>
              <div className="text-[10px] text-ink-muted">Site visit · ETA 24h</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 right-4 float-y" style={{ animationDelay: "-5s" }}>
        <div className="gradient-border p-3">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-violet-500/15">
              <Fingerprint className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div className="text-[12px]">
              <div className="font-semibold text-ink">Ledger anchored</div>
              <div className="hash-mono text-[10px]">0xae34f8…91d2c0</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
        <div className="h-32 w-32 rounded-full border border-accent-gold/40 pulse-ring" />
      </div>
      <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: "1s" }}>
        <div className="h-32 w-32 rounded-full border border-accent-gold/30 pulse-ring" />
      </div>
    </div>
  );
}
