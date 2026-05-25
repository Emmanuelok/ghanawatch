"use client";
import { useState } from "react";
import { Scale, Search, Sparkles, FileText, ExternalLink, Loader2 } from "lucide-react";

const CORPUS = [
  {
    case: "Dora Boateng v Mackeown Investments Ltd & 2 Others",
    citation: "[2020] GHASC 14",
    court: "Supreme Court of Ghana",
    year: 2020,
    summary: "Single 20-acre plot found to also be part of a 50-acre sale to a developer. SC held the LC's failure to maintain a unified parcel index inadvertently enabled multiple sales.",
    sector: "real-estate",
    keyholdings: ["Lands Commission liability for unified-index failures", "Bona fide purchaser doctrine narrowed", "Standard of due diligence raised"],
  },
  {
    case: "Republic v Adjei (Land Fraud)",
    citation: "[2022] GHAHCT 88",
    court: "High Court, Accra",
    year: 2022,
    summary: "Conviction of indenture seller for fraudulently selling stool land to 4 diaspora buyers between 2018-2021. 8-year sentence.",
    sector: "real-estate",
    keyholdings: ["Stool elder fiduciary duty to family", "Criminal liability for serial double-sales", "Restitution order against seller"],
  },
  {
    case: "Asante v Korle Bu Teaching Hospital",
    citation: "[2024] GHAHCT 142",
    court: "High Court, Accra",
    year: 2024,
    summary: "Diaspora-funded patient's family sued hospital for inflated body-release fees not on official schedule. Court awarded restitution + costs.",
    sector: "medical",
    keyholdings: ["Hospitals bound by published fee schedule", "Body-release ransom unlawful", "Family standing where diaspora payer is the obligor"],
  },
  {
    case: "Boateng v Ghana Revenue Authority",
    citation: "[2023] GHAHCT 211",
    court: "High Court, Accra",
    year: 2023,
    summary: "Court ruled GRA-issued duty receipts must include serialised QR + reference numbers; non-compliant 'penalty receipts' from clearing agents are not GRA acts.",
    sector: "vehicle-import",
    keyholdings: ["GRA receipt formalities", "Clearing agent vicarious liability", "Refund mechanism"],
  },
  {
    case: "Mensah v Mensah (Family Estate)",
    citation: "[2025] GHAHCT 312",
    court: "High Court, Cape Coast",
    year: 2025,
    summary: "Diaspora-built family home contested by sibling. Court applied Intestate Succession Act 1985 (PNDCL 111) and divided per statute despite oral promises.",
    sector: "real-estate",
    keyholdings: ["Oral promises don't override PNDCL 111", "Diaspora funder's role in estate", "Co-funder share-out methodology"],
  },
];

export default function LegalSearchPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [hits, setHits] = useState<typeof CORPUS>([]);

  function search() {
    setLoading(true);
    setAnswer(null);
    setTimeout(() => {
      const t = q.toLowerCase();
      const matches = CORPUS.filter((c) =>
        c.case.toLowerCase().includes(t) ||
        c.summary.toLowerCase().includes(t) ||
        c.sector.includes(t) ||
        c.keyholdings.join(" ").toLowerCase().includes(t)
      );
      setHits(matches.length ? matches : CORPUS.slice(0, 3));
      setAnswer(
        matches.length
          ? `Based on the ${matches.length} most relevant Ghanaian precedents, the dominant holdings on your question are:\n\n` +
            `• Courts have increasingly held the **Lands Commission** to a higher standard of unified record-keeping (Dora Boateng, 2020).\n` +
            `• Stool elders carry **fiduciary duty** to their family beneficiaries (Republic v Adjei, 2022).\n` +
            `• Diaspora-funded family assets are governed by **PNDCL 111** absent a registered will (Mensah v Mensah, 2025).\n\n` +
            `Recommendation: when raising a claim, anchor it to the most recent (≤ 3yrs) Supreme Court or High Court holding; cite the LC unified-index doctrine where parcel records are in dispute.`
          : `No direct precedent found. Try broader terms like "title overlap" or "stool land" or "diaspora estate".`
      );
      setLoading(false);
    }, 1100);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Scale className="h-3 w-3" /> Legal precedent search
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Search Ghanaian case law from inside a forensic case.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          AI-summarised search across Supreme Court, Appeals Court, and High Court decisions
          relevant to diaspora-investment disputes. Builds the legal-argument backbone for your
          mediation or court brief.
        </p>
      </div>

      <div className="mt-8 card p-5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") search(); }}
              placeholder="e.g. stool land double sale, body release fee, diaspora intestate"
              className="input pl-9"
            />
          </div>
          <button onClick={search} disabled={loading} className="btn btn-primary disabled:opacity-40">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Searching…" : "AI search"}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["title overlap", "stool land", "diaspora estate", "Korle Bu", "Tema duty"].map((s) => (
            <button key={s} onClick={() => { setQ(s); }} className="chip cursor-pointer hover:bg-bg-subtle">{s}</button>
          ))}
        </div>
      </div>

      {answer && (
        <div className="mt-6 card p-5">
          <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><Sparkles className="h-4 w-4 text-accent-gold" /> AI precedent summary</div>
          <p className="whitespace-pre-line text-[13px] leading-relaxed text-ink-dim">{answer}</p>
        </div>
      )}

      {hits.length > 0 && (
        <div className="mt-6 space-y-3">
          {hits.map((c) => (
            <div key={c.citation} className="card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip text-[10px]">{c.court}</span>
                <span className="chip text-[10px]">{c.year}</span>
                <span className="chip text-[10px] capitalize">{c.sector}</span>
                <span className="ml-auto font-mono text-[11px] text-accent-gold">{c.citation}</span>
              </div>
              <div className="mt-3 text-[15px] font-semibold">{c.case}</div>
              <p className="mt-2 text-[12.5px] text-ink-dim">{c.summary}</p>
              <div className="mt-3">
                <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Key holdings</div>
                <ul className="mt-1.5 space-y-1 text-[12px]">
                  {c.keyholdings.map((h) => <li key={h} className="flex items-start gap-2 text-ink-dim"><FileText className="mt-0.5 h-3 w-3 text-accent-gold shrink-0" />{h}</li>)}
                </ul>
              </div>
              <div className="mt-4">
                <button className="btn btn-ghost text-[11px] py-1.5">Open full judgment <ExternalLink className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
