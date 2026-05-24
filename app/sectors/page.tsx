import { SECTOR_META } from "@/components/sector-icon";
import type { Sector } from "@/lib/types";

export const metadata = { title: "Sectors — GhanaWatch" };

const SECTOR_DETAIL: Record<Sector, { intro: string; pains: string[]; coverage: string[] }> = {
  construction: {
    intro:
      "From a 2-bedroom home in Kasoa to a 6-storey hostel in East Legon, construction is the #1 line item in diaspora remittances — and the #1 site of misuse.",
    pains: [
      "Ghost construction: foundation laid, fund spent, no progress for 14 months.",
      "Inflated material receipts (cement, rebar, roofing sheets).",
      "Material delivery never matches the BOQ stage.",
      "Site photos taken at the wrong site or reused from earlier weeks.",
      "Cash payments to 'masons on the day' with no receipts.",
    ],
    coverage: [
      "BOQ-anchored milestone escrow",
      "AI forensic verification on every receipt + invoice",
      "Geo-stamped site photos with scene matching to prior verified images",
      "Trustee QS visits at each milestone boundary",
      "Drone overhead audits for sites >0.5 acre",
    ],
  },
  "real-estate": {
    intro:
      "Ghana's land system carries documented cases of one plot sold to 13 different buyers. Stool / family land, weak title registration outside Accra/Tema/Kumasi, and forged powers of attorney make this the highest-fraud sector for the diaspora.",
    pains: [
      "Double-sale: same parcel sold to multiple buyers, each with seemingly valid docs.",
      "Stool / family land sold by a single elder without collective consent.",
      "Forged or unnotarised powers of attorney 'on behalf of a relative abroad'.",
      "No site plan, or a site plan from an unlicensed surveyor.",
      "Encroachment by neighbouring developers after registration delays.",
    ],
    coverage: [
      "Lands Commission cross-check (LC Online / GELIS) for overlapping claims",
      "Licensed surveyor dispatch for boundary verification",
      "Conveyancing lawyer review of indentures and POAs",
      "Notarisation / apostille verification",
      "Encroachment imagery: drone + ground photo timeline",
    ],
  },
  "vehicle-import": {
    intro:
      "Diaspora vehicle imports through Tema and Takoradi ports involve GRA duty calculation, clearing-agent margins, and a notorious 'last-minute penalty' scam.",
    pains: [
      "Duty inflated above the GRA HS-code calculation.",
      "Last-minute 'penalty fees' with no GRA receipt.",
      "VIN substitution between Bill of Lading and the vehicle delivered.",
      "Unlicensed clearing agents disappearing with funds.",
      "Vehicle held in bonded warehouse with mounting demurrage.",
    ],
    coverage: [
      "GRA duty calculator cross-check against the agent's invoice",
      "VIN match across BoL, GRA portal and dashboard photo",
      "Clearing agent license verification (GRA Customs Division registry)",
      "Yard photo with VIN visible at release",
      "Penalty receipt forensics (serial + QR check)",
    ],
  },
  business: {
    intro:
      "From cosmetics shops in Adum to barbering setups in Madina, business capital sent home often ends up co-mingled with household spending.",
    pains: [
      "Duplicate rent receipts across months.",
      "Supplier invoices without GRA TIN.",
      "Till takings 'spent on running costs' with no day-end ledger.",
      "Inventory shrinkage with no count audit.",
      "'Auntie sole-runs everything' for 9 months with no trustee visit.",
    ],
    coverage: [
      "Document forensics on every rent / supplier doc",
      "Daily till mirror via WhatsApp + monthly trustee shop visits",
      "Mystery-shopper audits",
      "Inventory counts with timestamped photos",
      "Mobile-money merchant ID verification",
    ],
  },
  education: {
    intro:
      "Education is the #1 use of remittances. Receipt forgery, ghost enrolments, and uniform / book invoices are the common abuse vectors.",
    pains: [
      "Forged school fee receipts using copy-paste templates.",
      "Books / uniforms invoiced at retail when bulk-discount applies.",
      "Ghost enrolment: fees paid for a child no longer attending.",
      "'Extra classes' invoice with no school authorisation.",
    ],
    coverage: [
      "School portal receipt cross-check (GES & private databases)",
      "Attendance attestation by trustee",
      "Book / uniform price benchmarking against published catalogues",
      "Direct settlement to school account where supported",
    ],
  },
  funeral: {
    intro:
      "A 'befitting' Ghanaian funeral costs $15,000-$20,000 — in a country with a median income of $1,500. Diaspora funeral remittances are routinely doubled and tripled by ground organisers.",
    pains: [
      "Mortuary fees inflated above the published schedule.",
      "Casket, canopy, and catering vendors with no verifiable contacts.",
      "'Family levy' with no contributor ledger.",
      "Drumming, hearse, and PA system bills duplicated.",
    ],
    coverage: [
      "Mortuary fee-list cross-check (USEmbassy / hospital schedules)",
      "Vendor phone confirmation + MoMo merchant ID match",
      "Contributor ledger audit",
      "Trustee attendance at the planning meeting",
    ],
  },
  medical: {
    intro:
      "Hospital bills, body release, and pharmacy costs are common fraud vectors — particularly at Korle Bu and Komfo Anokye where bills can run high during long admissions.",
    pains: [
      "Round-number bills with no itemisation.",
      "Pressure to pay outside the official cashier.",
      "Body release 'ransom' fees not on the receipt.",
      "Drugs sourced from outside the hospital pharmacy at inflated prices.",
    ],
    coverage: [
      "Hospital receipt template cross-check (Korle Bu, KATH, Ridge, 37 Military)",
      "Trustee ward visits + receipt validation",
      "Direct cashier settlement where supported",
      "Drug price benchmarking",
    ],
  },
  agriculture: {
    intro:
      "Diaspora-funded poultry, vegetables, and aquaculture are growing — and so are the pain points: feed price inflation, bird mortality misreporting, and ghost yields.",
    pains: [
      "Feed supplier mark-ups vs market rate.",
      "Bird mortality under-reported or padded for theft.",
      "Yield claims with no scale photos.",
      "Pond/coop dimensions not matching the funded design.",
    ],
    coverage: [
      "MoFA extension officer trustee visits",
      "Drone farm imagery + dimension verification",
      "Feed supplier price benchmarking",
      "Daily mortality WhatsApp ledger with photo",
    ],
  },
  remittance: {
    intro:
      "Even straight cash remittance is a candidate for downstream tracking — diaspora senders often want to know what an emergency transfer was actually spent on.",
    pains: [
      "'Emergency' framing with no downstream receipt.",
      "Repeated emergencies with no audit.",
      "MoMo agent cash-out with no settlement trail.",
    ],
    coverage: [
      "Downstream spend evidence requirement (receipt within 7 days)",
      "MoMo statement cross-check",
      "Pattern detection across recurring emergencies",
    ],
  },
};

export default function SectorsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="max-w-2xl">
        <div className="chip mb-4">Sectors</div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Nine sectors. One forensic intelligence layer.
        </h1>
        <p className="mt-3 text-[15px] text-ink-dim">
          GhanaWatch covers every meaningful destination for diaspora remittance — not just
          construction. Each sector ships with its own document templates, vendor registries, trustee
          specialists, and milestone definitions.
        </p>
      </div>

      <div className="mt-10 space-y-5">
        {(Object.keys(SECTOR_DETAIL) as Sector[]).map((s) => {
          const m = SECTOR_META[s];
          const d = SECTOR_DETAIL[s];
          const Icon = m.icon;
          return (
            <div key={s} className="card overflow-hidden">
              <div className="flex items-start gap-4 border-b border-line p-6">
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl"
                  style={{ background: `${m.color}15`, border: `1px solid ${m.color}30` }}
                >
                  <Icon size={22} style={{ color: m.color }} />
                </div>
                <div className="flex-1">
                  <div className="text-[18px] font-semibold">{m.label}</div>
                  <p className="mt-1 max-w-3xl text-[14px] text-ink-dim">{d.intro}</p>
                </div>
              </div>
              <div className="grid divide-line p-6 md:grid-cols-2 md:divide-x md:p-0">
                <div className="md:p-6">
                  <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">Common pain points</div>
                  <ul className="space-y-2 text-[13px]">
                    {d.pains.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-ink-dim">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-risk-high" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 md:mt-0 md:p-6">
                  <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">GhanaWatch coverage</div>
                  <ul className="space-y-2 text-[13px]">
                    {d.coverage.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-ink-dim">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-green" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
