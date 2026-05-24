import { Code2, Terminal, Webhook, Key, Shield, ArrowRight, Copy } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Developers — GhanaWatch" };

const EVENTS = [
  { name: "document.verified", desc: "Document forensic verification completed (any verdict)." },
  { name: "document.flagged", desc: "Document scored below 80% authenticity." },
  { name: "site.photo.received", desc: "New geo-stamped site photo uploaded by manager or trustee." },
  { name: "site.photo.flagged", desc: "Site photo failed scene-match or GPS check." },
  { name: "milestone.ready", desc: "Milestone evidence complete — ready for owner sign-off." },
  { name: "milestone.released", desc: "Funds disbursed from escrow to counterparty." },
  { name: "trustee.dispatched", desc: "A trustee accepted a dispatch request." },
  { name: "trustee.report.uploaded", desc: "Trustee uploaded their on-site report." },
  { name: "case.opened", desc: "Forensic case opened on a project." },
  { name: "case.analyst.decision", desc: "Human analyst signed off on a case." },
  { name: "kyc.verified", desc: "A user (diaspora / manager / trustee) reached Enhanced KYC." },
  { name: "ledger.daily.committed", desc: "Daily hash-chain commitment finalised." },
];

const ENDPOINTS = [
  { method: "POST", path: "/v1/projects", desc: "Create a project under the verification umbrella." },
  { method: "GET",  path: "/v1/projects/{id}", desc: "Fetch a project with current trust + risk scores." },
  { method: "POST", path: "/v1/projects/{id}/documents", desc: "Submit a document for forensic verification." },
  { method: "POST", path: "/v1/projects/{id}/photos", desc: "Submit a geo-stamped site photo." },
  { method: "POST", path: "/v1/projects/{id}/dispatch", desc: "Request a trustee dispatch." },
  { method: "GET",  path: "/v1/projects/{id}/ledger", desc: "Retrieve hash-chained audit ledger for a project." },
  { method: "GET",  path: "/v1/benchmarks", desc: "Market-rate benchmarks (materials, labour, customs, etc.)." },
  { method: "POST", path: "/v1/verify/document", desc: "Standalone forensic verification of a document." },
  { method: "POST", path: "/v1/insurance/quote", desc: "Generate a fraud-insurance quote." },
  { method: "GET",  path: "/v1/trustees", desc: "Search the trustee network by region / profession." },
];

const PARTNERS = [
  { name: "Banks & MTOs", desc: "Mirror your customer's diaspora projects into your fraud-risk model. Compliance feed for outbound remittance corridors." },
  { name: "Diaspora bond programmes", desc: "Project-level verification feeds for sovereign / municipal diaspora bond issuances." },
  { name: "Embassies & consulates", desc: "Automated case escalation for diaspora-fraud assistance requests." },
  { name: "Insurers", desc: "Real-time underwriting signals for diaspora-investment cover." },
];

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Code2 className="h-3 w-3" /> Developers
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">API & Webhooks</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Wire GhanaWatch into your bank, MTO, embassy desk, diaspora-bond programme, or insurer.
          REST + webhooks, signed payloads, sandbox keys, OpenAPI spec, SDKs for TypeScript and
          Python.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Endpoints" value={`${ENDPOINTS.length}+`} />
        <Stat label="Webhook events" value={`${EVENTS.length}+`} />
        <Stat label="Sandbox + production" value="Both" />
        <Stat label="SLA (Institutional)" value="99.9%" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[12px] font-semibold">REST API — selected endpoints</div>
          <div className="divide-y divide-line">
            {ENDPOINTS.map((e) => (
              <div key={e.path} className="grid items-center gap-3 px-5 py-3 md:grid-cols-[80px_1fr_2fr]">
                <span
                  className="chip uppercase"
                  style={{
                    color: e.method === "POST" ? "#3b82f6" : e.method === "GET" ? "#10b981" : "#f59e0b",
                    borderColor: `${e.method === "POST" ? "#3b82f6" : e.method === "GET" ? "#10b981" : "#f59e0b"}30`,
                  }}
                >
                  {e.method}
                </span>
                <code className="text-[12px] text-ink">{e.path}</code>
                <span className="text-[12px] text-ink-dim">{e.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[12px] font-semibold">Webhook events</div>
          <div className="divide-y divide-line max-h-[440px] overflow-y-auto scroll-shadow">
            {EVENTS.map((e) => (
              <div key={e.name} className="px-5 py-3">
                <code className="text-[12px] text-accent-gold">{e.name}</code>
                <div className="mt-0.5 text-[12px] text-ink-dim">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Block title="Example — verify a document" icon={Terminal}>
          <pre className="overflow-x-auto rounded-md bg-bg-elev/60 p-4 text-[11.5px] leading-relaxed text-ink-dim">{`# bash
curl -X POST https://api.ghanawatch.com/v1/verify/document \\
  -H "Authorization: Bearer $GW_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "land-title",
    "text": "Stool land indenture for plot in East Legon Hills…",
    "image_base64": "<...>"
  }'

# response
{
  "verdict": "flagged",
  "score": 62,
  "summary": "Stool land sold by single elder; LC cross-check returned an overlap.",
  "flags": [
    "Lands Commission overlap on 0.8-acre easter portion",
    "Stool elder signature variance 22% vs reference"
  ],
  "forensics": {
    "fontConsistency": 88,
    "pixelTampering": 9,
    "aiGenerated": 4,
    "chainOfCustody": 70,
    "metadataIntact": true,
    "vendorPatternMatch": false
  },
  "recommendation": "Open a forensic case; request notarised POA; engage a licensed surveyor.",
  "hash": "0x1f3c7a82…d0e44b1c"
}`}</pre>
        </Block>

        <Block title="Webhook payload (signed)" icon={Webhook}>
          <pre className="overflow-x-auto rounded-md bg-bg-elev/60 p-4 text-[11.5px] leading-relaxed text-ink-dim">{`POST https://your-bank.example/webhooks/ghanawatch
GhanaWatch-Signature: t=1716544123,v1=8f30c41a…
Content-Type: application/json

{
  "id": "evt_01HZ4X9P…",
  "type": "case.opened",
  "created": "2026-05-24T09:01:33Z",
  "data": {
    "project_id": "east-legon-plot",
    "case_id": "case-1",
    "severity": "critical",
    "exposure_ghs": 1250000,
    "owner": { "id": "u_8841", "country": "UK" }
  },
  "ledger_hash": "0xae34f8…91d2c0"
}`}</pre>
        </Block>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Block title="Authentication" icon={Key}>
          <p className="text-[13px] text-ink-dim">
            Bearer tokens, scoped per-project. Sandbox keys start with{" "}
            <code className="rounded bg-bg-elev px-1 py-0.5 text-[11px]">gw_test_</code>; production
            with <code className="rounded bg-bg-elev px-1 py-0.5 text-[11px]">gw_live_</code>. All
            webhook deliveries are HMAC-SHA256 signed using your endpoint secret; we recommend
            verifying the timestamp window.
          </p>
        </Block>
        <Block title="Compliance & SLA" icon={Shield}>
          <p className="text-[13px] text-ink-dim">
            Institutional tier ships a signed BAA + DPA, custom data-residency, IP allowlisting,
            SIEM hooks, and a dedicated CSM. SOC 2 Type II in progress.
          </p>
        </Block>
      </div>

      <div className="mt-12">
        <div className="mb-4 text-[14px] font-semibold">Built for institutional partners</div>
        <div className="grid gap-3 md:grid-cols-2">
          {PARTNERS.map((p) => (
            <div key={p.name} className="card p-5">
              <div className="text-[14px] font-semibold">{p.name}</div>
              <p className="mt-1 text-[12px] text-ink-dim">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-bg-elev/40 p-6">
        <div className="flex-1">
          <div className="text-[15px] font-semibold">Ready to build?</div>
          <p className="text-[12px] text-ink-dim">Grab a sandbox key (no credit card) and you'll have your first webhook firing in under 10 minutes.</p>
        </div>
        <Link href="/settings" className="btn btn-ghost">Open settings</Link>
        <Link href="/pricing" className="btn btn-primary">Talk to sales <ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function Block({ title, icon: Icon, children }: any) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center gap-2"><Icon className="h-4 w-4 text-accent-gold" /><div className="text-[14px] font-semibold">{title}</div></div>
      {children}
    </div>
  );
}
