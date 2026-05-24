"use client";
import { useMemo, useState } from "react";
import { FileText, Download, Search, Eye, ShieldCheck } from "lucide-react";

type Template = {
  id: string;
  name: string;
  sector: string;
  type: string;
  description: string;
  statute: string;
  preview: string[];
};

const TEMPLATES: Template[] = [
  {
    id: "t-1",
    name: "Land indenture (freehold / leasehold)",
    sector: "real-estate",
    type: "land-title",
    description: "Standard indenture template aligned with the Land Act 2020 (Act 1036). Includes recital, parcel reference, surveyor stamp pane, consent of head of family / stool elder block, and witness signatures.",
    statute: "Land Act 2020 (Act 1036) · Conveyancing Act 1973 (NRCD 175)",
    preview: [
      "THIS INDENTURE made this ____ day of ____ 20__",
      "BETWEEN [Vendor / Stool], represented by ____",
      "AND [Purchaser of diaspora address ____]",
      "WHEREAS the parcel known as ____ measuring ____ acres / sq.m",
      "AND WHEREAS the head of family / Council of Elders has consented vide ____",
      "WITNESS by Hon. (Assembly Member) ____ and Surv. ____",
    ],
  },
  {
    id: "t-2",
    name: "Notarised Power of Attorney",
    sector: "any",
    type: "poa",
    description: "POA template for diaspora-side notarisation + apostille. Covers scope-limited authority (e.g. signing on a specific parcel only, with cap on financial commitments).",
    statute: "Powers of Attorney Act 1998 (Act 549) · Hague Apostille Convention",
    preview: [
      "I, [Principal full name] of [Diaspora address], …",
      "do hereby appoint [Attorney full name + Ghana Card #] of [Ghana address]",
      "as my lawful attorney for the limited purpose of: ____",
      "with cap on financial commitments not exceeding GHS ____",
      "Valid for ____ months from execution date.",
      "Notarised by ____  Apostille ref: ____",
    ],
  },
  {
    id: "t-3",
    name: "Bill of Quantities (BOQ) — residential build",
    sector: "construction",
    type: "boq",
    description: "Standard BOQ structure: preliminaries, substructure, superstructure, roofing, fittings, externals. Aligned with NCA / GhIS guidelines.",
    statute: "National Building Regulations 1996 (LI 1630)",
    preview: [
      "Section A — Preliminaries (site clearing, setting out, hoarding)",
      "Section B — Substructure (excavation, blinding, foundation, DPC)",
      "Section C — Superstructure (blockwork, lintels, decking)",
      "Section D — Roofing & ceiling",
      "Section E — Internal fittings & finishes",
      "Section F — Externals (driveway, fencing, landscaping)",
    ],
  },
  {
    id: "t-4",
    name: "Vendor invoice / receipt",
    sector: "any",
    type: "invoice",
    description: "Compliant vendor invoice with TIN, MoMo merchant ID, line items, VAT, and QR for verification. Matches GRA-issued template.",
    statute: "VAT Act 2013 (Act 870) · GRA Practice Notes",
    preview: [
      "Vendor letterhead · TIN: ____ · MoMo Merchant: ____",
      "Invoice #____  Date: ____  Project ref: ____",
      "Line items with unit price, quantity, total",
      "Subtotal · VAT (15%) · NHIL (2.5%) · GETFund (2.5%)",
      "QR code linking to GhanaWatch verification page",
    ],
  },
  {
    id: "t-5",
    name: "Contractor agreement (milestone-based)",
    sector: "construction",
    type: "contract",
    description: "Diaspora-friendly milestone-based contractor agreement with escrow clause, dispute resolution under Ghana ADR, and trustee verification trigger.",
    statute: "Contracts Act 1960 (Act 25) · Alternative Dispute Resolution Act 2010 (Act 798)",
    preview: [
      "Parties: [Owner — diaspora] and [Contractor — Ghana]",
      "Scope: as per BOQ Rev.____",
      "Milestones: 7 numbered milestones, each tied to trustee verification",
      "Payments via GhanaWatch escrow, released on milestone verification",
      "Disputes: ADR with GhIS-appointed arbitrator",
      "Variations: written approval required, no oral changes",
    ],
  },
  {
    id: "t-6",
    name: "Funeral contributor ledger",
    sector: "funeral",
    type: "ledger",
    description: "Transparent contributor + vendor ledger for funeral organising committees. Locks in who paid what and which vendor received which payment.",
    statute: "—",
    preview: [
      "Decedent · Date of death · Burial date · Committee chair",
      "Contributors table: name, contact, contribution GHS, MoMo ref",
      "Vendors table: name, item/service, agreed price, paid GHS, MoMo merchant ID, receipt",
      "Reconciliation: total contributions vs total spend, surplus / deficit",
      "Signatures: 3 committee members + 1 family witness",
    ],
  },
  {
    id: "t-7",
    name: "Tenancy agreement (commercial shop)",
    sector: "business",
    type: "lease",
    description: "Commercial tenancy template with rent schedule, deposit handling, renewal terms, and dispute mechanism.",
    statute: "Conveyancing Act 1973 (NRCD 175) · Rent Act 1963 (Act 220)",
    preview: [
      "Landlord (with Ghana Card #) · Tenant",
      "Premises: ____ (with site plan reference)",
      "Term, rent, payment schedule (monthly / quarterly)",
      "Deposit (≤ 6 months per Rent Act 220)",
      "Use, repairs, sub-letting clauses",
      "Termination, dispute resolution",
    ],
  },
  {
    id: "t-8",
    name: "Trustee on-site report",
    sector: "any",
    type: "report",
    description: "Standardised report for a trustee's on-site visit. Captures geo-stamped photo references, BOQ stage match, anomalies, and signed verdict.",
    statute: "—",
    preview: [
      "Trustee: name, license, regulator",
      "Visit timestamp, GPS, weather",
      "Geo-stamped photo references (hashes)",
      "BOQ stage observed vs claimed",
      "Material reconciliation (quantities, brands)",
      "Anomalies / red flags noted",
      "Verdict (verified / inconclusive / fail) with signature",
    ],
  },
];

export function TemplatesClient() {
  const [q, setQ] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return TEMPLATES;
    return TEMPLATES.filter((x) =>
      x.name.toLowerCase().includes(t) ||
      x.description.toLowerCase().includes(t) ||
      x.statute.toLowerCase().includes(t) ||
      x.sector.toLowerCase().includes(t),
    );
  }, [q]);

  const preview = previewId ? TEMPLATES.find((t) => t.id === previewId) : null;

  return (
    <div className="mt-8">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates, statutes, sectors…" className="input pl-9" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((t) => (
          <div key={t.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent-gold" />
                  <div className="text-[15px] font-semibold">{t.name}</div>
                </div>
                <p className="mt-2 text-[12px] text-ink-dim">{t.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="chip uppercase">{t.sector}</span>
                  <span className="chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.25)" }}>
                    <ShieldCheck className="h-3 w-3" /> GhanaWatch-reviewed
                  </span>
                </div>
                {t.statute && (
                  <div className="mt-3 border-t border-line pt-3 text-[11px] text-ink-muted">
                    Statute: {t.statute}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => setPreviewId(t.id)} className="btn btn-ghost text-[12px] py-1.5"><Eye className="h-3.5 w-3.5" /> Preview</button>
              <button className="btn btn-primary text-[12px] py-1.5"><Download className="h-3.5 w-3.5" /> Download .docx</button>
              <button className="btn btn-ghost text-[12px] py-1.5"><Download className="h-3.5 w-3.5" /> .pdf</button>
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setPreviewId(null)}>
          <div className="w-[min(680px,96vw)] max-h-[88vh] overflow-y-auto rounded-2xl border border-line bg-bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent-gold" />
              <div className="text-[16px] font-semibold">{preview.name}</div>
            </div>
            <p className="mt-2 text-[12px] text-ink-dim">{preview.description}</p>
            <div className="mt-4 rounded-md border border-line bg-bg-elev/40 p-4 text-[12px]">
              <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-ink-muted">Preview</div>
              <ol className="space-y-1.5 text-ink-dim">
                {preview.preview.map((p, i) => (
                  <li key={i} className="flex gap-2"><span className="text-ink-muted">{i + 1}.</span><span>{p}</span></li>
                ))}
              </ol>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setPreviewId(null)} className="btn btn-ghost">Close</button>
              <button className="btn btn-primary"><Download className="h-3.5 w-3.5" /> Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
