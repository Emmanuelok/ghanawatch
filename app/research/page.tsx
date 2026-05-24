import { ExternalLink, AlertCircle, TrendingUp, Globe2 } from "lucide-react";

export const metadata = { title: "The research — GhanaWatch" };

const sources = [
  {
    title: "Ghana Diaspora Investment Mistakes & How to Avoid Them",
    url: "https://www.proptisgh.com/diaspora-ghana-property-mistakes/",
    source: "Prop-Tis Ghana",
  },
  {
    title: "Diaspora Caution: How to Buy Property Safely from Abroad",
    url: "https://housinginghana.com/articles/diaspora-caution-how-to-buy-property-safely-from-abroad",
    source: "Housing In Ghana",
  },
  {
    title: "The Trust Gap: Why Diaspora Professionals Hesitate to Invest Back Home",
    url: "https://medium.com/@langovest/a-the-trust-gap-why-diaspora-professionals-hesitate-to-invest-back-home-ac715e5e9abf",
    source: "Langovest / Medium",
  },
  {
    title: "Chaotic Land Ownership Records Shock Ghana's Supreme Court",
    url: "https://africanlii.org/article/20200326/chaotic-land-ownership-records-shock-ghanas-supreme-court",
    source: "AfricanLII",
  },
  {
    title: "Buying Property in Ghana: Risks, Scams and Pitfalls (2026)",
    url: "https://theafricanvestor.com/blogs/news/ghana-risks-pitfalls",
    source: "The Africanvestor",
  },
  {
    title: "Legal & Institutional Weaknesses in Ghana's Real Estate Sector",
    url: "https://www.acecnltd.com/legal-and-institutional-weaknesses-in-ghanas-real-estate-sector-part-9-how-prolonged-litigation-is-incentivizing-land-fraud-rather-than-deterring-it/",
    source: "ACEC Network",
  },
  {
    title: "Ghana Reoccurring Scams (Trade.gov)",
    url: "https://www.trade.gov/market-intelligence/ghana-reoccurring-scams",
    source: "U.S. International Trade Administration",
  },
  {
    title: "U.S. Embassy Ghana — Scams",
    url: "https://gh.usembassy.gov/services/scams/",
    source: "U.S. Embassy in Accra",
  },
  {
    title: "Ghana's Diaspora Emerges as Key Development Partner — Record $7.8B Remittances",
    url: "https://www.ghanaweb.com/GhanaHomePage/business/Ghana-s-diaspora-emerges-as-key-development-partner-with-record-7-8-billion-remittances-2023654",
    source: "GhanaWeb",
  },
  {
    title: "Ghana Lands Commission — LC Online Portal",
    url: "https://onlineservices.lc.gov.gh/",
    source: "Lands Commission",
  },
  {
    title: "How Funerals Keep Africa Poor",
    url: "https://davidoks.blog/p/how-funerals-keep-africa-poor",
    source: "David Oks",
  },
  {
    title: "U.S. Embassy — Funeral and Mortuary Services in Ghana",
    url: "https://gh.usembassy.gov/wp-content/uploads/sites/215/2025/04/Funeral-and-Mortuary-Services-in-Ghana-2022.pdf",
    source: "U.S. Embassy in Accra",
  },
  {
    title: "Pencil Home — Build Your Dream Home from Anywhere",
    url: "https://pencilhomes.com/",
    source: "Pencil Homes (NG)",
  },
  {
    title: "DiasporaBuild",
    url: "https://www.diasporabuild.com/",
    source: "DiasporaBuild",
  },
  {
    title: "ToSi — Ghana's Construction App",
    url: "https://www.tosiapp.com/",
    source: "ToSi",
  },
];

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="max-w-3xl">
        <div className="chip mb-4">Research</div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          The pain we're solving — and why no one has solved it yet.
        </h1>
        <p className="mt-3 text-[15px] text-ink-dim">
          GhanaWatch was scoped from a deep review of academic, governmental, and journalistic
          sources. Here is the evidence base and what it told us.
        </p>
      </div>

      {/* HEADLINE FINDINGS */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Finding
          big="GHS 7.79B"
          label="Remittances to Ghana in 2025"
          sub="Up from US$6.65B in 2024 — 6% of GDP. Source: Bank of Ghana, GhanaWeb."
          icon={TrendingUp}
        />
        <Finding
          big="56%"
          label="of diaspora Africans cite corruption / mismanagement"
          sub="As the #1 barrier to investing back home. Source: Commonwealth Secretariat survey."
          icon={AlertCircle}
        />
        <Finding
          big="13"
          label="Buyers found on one Ghanaian plot"
          sub="Documented in cases reviewed by Ghana's Supreme Court. Source: AfricanLII."
          icon={Globe2}
        />
      </div>

      {/* DEEP DIVE */}
      <div className="mt-12 space-y-6">
        <Section title="1. The problem is huge — and growing">
          <p>
            Ghana is the second-largest remittance recipient in sub-Saharan Africa. In 2025,
            cumulative remittances reached US$7.79 billion (up from US$6.65 billion in 2024).
            Remittances account for ~6% of GDP. The diaspora is ~8.9 million people. Yet over half
            of that money flows through informal channels of trust — relatives, friends, ground
            agents — with no independent verification layer.
          </p>
        </Section>

        <Section title="2. The trust gap is the binding constraint">
          <p>
            A Commonwealth Secretariat survey found <strong className="text-ink">more than 56% of
            respondents identified corruption as the main barrier to investing back home</strong>.
            Anecdotally, virtually every Ghanaian abroad has either lost money themselves or knows
            someone who has — to land scams, ghost construction, funeral inflation, hospital
            ransoms, or auntie's 'running costs'.
          </p>
        </Section>

        <Section title="3. The fraud patterns are well-known and very specific">
          <ul>
            <li><strong className="text-ink">Land double-sales</strong> — the Supreme Court has documented single plots sold to as many as 13 buyers (e.g. <em>Dora Boateng v Mackeown Investments</em>).</li>
            <li><strong className="text-ink">Stool / family land</strong> sold by one elder without collective consent.</li>
            <li><strong className="text-ink">Fake / unnotarised powers of attorney</strong> 'on behalf of a relative abroad'.</li>
            <li><strong className="text-ink">Ghost construction</strong> — foundation laid, funds spent, no progress for 14+ months.</li>
            <li><strong className="text-ink">Inflated material receipts</strong> — cement, rebar, roofing — with cash-only vendors.</li>
            <li><strong className="text-ink">Tema port 'last-minute penalty'</strong> on vehicle imports — no GRA receipt.</li>
            <li><strong className="text-ink">Funeral cost doubling</strong> — befitting funerals can cost $15-$20K in a $1,500-median-income country.</li>
            <li><strong className="text-ink">Hospital bill inflation</strong> at teaching hospitals, particularly during long admissions.</li>
          </ul>
        </Section>

        <Section title="4. Existing solutions are narrow agency services">
          <p>
            We reviewed the existing landscape: <em>DiasporaBuild</em>, <em>House of Diaspora</em>,
            <em> Pencil Home</em> (Nigeria), <em>ToSi</em> (Ghana materials), <em>NCDF DAHP</em> (US
            African housing escrow). All operate as <strong className="text-ink">service providers</strong>:
            you hand over your project to them, and they manage it for a fee. None offer:
          </p>
          <ul>
            <li>Cross-sector coverage (real estate + construction + vehicles + business + medical + funeral + agriculture + education).</li>
            <li>AI document forensics tuned to Ghanaian vendor / agency patterns.</li>
            <li>Geo-stamped, scene-matched site verification with EXIF integrity scoring.</li>
            <li>An immutable, hash-chained audit ledger.</li>
            <li>Court-admissible evidence pack generation.</li>
            <li>A trustee network you can <em>dispatch</em> rather than hire wholesale.</li>
          </ul>
          <p>
            That gap is the GhanaWatch opportunity — and the bet is that diaspora users don't want
            to outsource their project, they want to verify it.
          </p>
        </Section>

        <Section title="5. The Ghanaian infrastructure is finally catching up">
          <p>
            The Lands Commission has launched the LC Online Portal, the Enterprise Land Information
            System (ELIS), and a 5-year transformation programme that began Q1 2026. The GRA's
            digital customs portal is reasonably mature. Korle Bu and other teaching hospitals
            increasingly issue digital billing. The pieces for systematic cross-checking are
            falling into place — what's missing is the application layer that consumes them and
            packages the result for a diaspora user. That's GhanaWatch.
          </p>
        </Section>

        <Section title="6. Conclusion: the problem is real, the gap is unsolved, and the time is now">
          <p>
            With GHS 7.79B in remittances flowing yearly, even capturing 1% of that flow under a
            verification umbrella represents GHS 78M of protected diaspora wealth annually. With
            56% of the diaspora actively concerned about misuse, the demand is established. With
            registries digitising and AI forensics maturing, the supply is finally feasible.
            GhanaWatch is the integrated product that meets that moment.
          </p>
        </Section>
      </div>

      {/* SOURCES */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Sources reviewed</h2>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {sources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="card card-hover flex items-start gap-3 p-3 text-[13px]"
            >
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-gold" />
              <div className="min-w-0">
                <div className="truncate font-medium text-ink">{s.title}</div>
                <div className="text-[11px] text-ink-muted">{s.source}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function Finding({ big, label, sub, icon: Icon }: any) {
  return (
    <div className="card p-5">
      <div className="mb-3 inline-grid h-9 w-9 place-items-center rounded-lg border border-line bg-bg-elev">
        <Icon className="h-4 w-4 text-accent-gold" />
      </div>
      <div className="text-3xl font-semibold tracking-tight">{big}</div>
      <div className="mt-1 text-[13px] font-medium">{label}</div>
      <div className="mt-1 text-[12px] text-ink-dim">{sub}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <div className="mb-3 text-[16px] font-semibold tracking-tight">{title}</div>
      <div className="space-y-3 text-[14px] leading-relaxed text-ink-dim [&_ul]:my-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}
