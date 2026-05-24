import { CheckCircle2, AlertCircle, AlertTriangle, Activity, ScrollText } from "lucide-react";

export const metadata = { title: "Status — GhanaWatch" };

type Status = "operational" | "degraded" | "outage";

const COMPONENTS: { name: string; status: Status; sub?: string; uptime90: number }[] = [
  { name: "API (REST)", status: "operational", uptime90: 99.98 },
  { name: "API (Webhooks)", status: "operational", uptime90: 99.97 },
  { name: "Document forensics (AI vision)", status: "operational", uptime90: 99.95 },
  { name: "AI Investigator", status: "operational", uptime90: 99.96 },
  { name: "AI Dossier generation", status: "operational", uptime90: 99.94 },
  { name: "Audit ledger anchoring", status: "operational", uptime90: 100.00 },
  { name: "Lands Commission cross-check", status: "degraded", sub: "Increased latency (~12s p95)", uptime90: 99.41 },
  { name: "Trustee dispatch", status: "operational", uptime90: 99.99 },
  { name: "WhatsApp manager bot", status: "operational", uptime90: 99.92 },
  { name: "SMS delivery (Ghana corridors)", status: "operational", uptime90: 99.88 },
  { name: "Mobile (iOS / Android)", status: "operational", uptime90: 99.93 },
  { name: "MapLibre tile delivery", status: "operational", uptime90: 99.99 },
  { name: "GRA Customs portal sync", status: "operational", uptime90: 99.74 },
  { name: "Korle Bu hospital portal sync", status: "operational", uptime90: 99.46 },
  { name: "Mobile-money merchant resolution", status: "operational", uptime90: 99.90 },
];

const INCIDENTS = [
  {
    id: "INC-2026-0042",
    title: "Lands Commission cross-check latency above SLA",
    status: "Investigating",
    severity: "minor",
    startedAt: "2026-05-24T06:18Z",
    components: ["Lands Commission cross-check"],
    updates: [
      { ts: "2026-05-24T08:42Z", body: "Upstream LC API returning 8-15s response times. We're caching previously-fetched parcel responses and triaging only fresh queries through the slower path." },
      { ts: "2026-05-24T06:42Z", body: "We've contacted the Lands Commission technical team and confirmed they're aware of an upstream slowdown." },
      { ts: "2026-05-24T06:18Z", body: "We detected elevated p95 latency on LC cross-check calls (>10s)." },
    ],
  },
  {
    id: "INC-2026-0041",
    title: "WhatsApp manager-bot delivery delays (NW Ghana corridors)",
    status: "Resolved",
    severity: "minor",
    startedAt: "2026-05-22T13:02Z",
    components: ["WhatsApp manager bot", "SMS delivery (Ghana corridors)"],
    updates: [
      { ts: "2026-05-22T18:11Z", body: "Resolved. Provider confirmed network restored; delivery latency back to baseline." },
      { ts: "2026-05-22T13:38Z", body: "Provider acknowledged. We're auto-retrying delayed messages." },
      { ts: "2026-05-22T13:02Z", body: "Detected SMS+WhatsApp delivery delays affecting Upper East / Upper West corridors." },
    ],
  },
  {
    id: "INC-2026-0040",
    title: "Audit ledger hash anchoring delay (12 min)",
    status: "Resolved",
    severity: "low",
    startedAt: "2026-05-18T22:01Z",
    components: ["Audit ledger anchoring"],
    updates: [
      { ts: "2026-05-18T22:14Z", body: "Resolved. Hash committed. No data loss; chain integrity confirmed by re-verification." },
      { ts: "2026-05-18T22:01Z", body: "Delayed daily anchoring run due to queue backlog. Investigating." },
    ],
  },
];

const CHANGELOG = [
  { ts: "2026-05-24", title: "v5: Digest builder, templates, deep-KYC, dev API, per-project chat" },
  { ts: "2026-05-23", title: "v4: KYC, analyst review desk, become-a-trustee, insurance, mobile preview, hometown rooms" },
  { ts: "2026-05-22", title: "v3: MapLibre tile map, vehicle duty calculator, ledger explorer, manager bot mockup" },
  { ts: "2026-05-21", title: "v2: Cases workspace, knowledge base, vision-based doc forensics" },
  { ts: "2026-05-20", title: "v1: Initial release — dashboard, projects, document forensics, AI investigator, audit ledger" },
];

const statusMeta = {
  operational: { color: "#10b981", label: "Operational", icon: CheckCircle2 },
  degraded: { color: "#f59e0b", label: "Degraded", icon: AlertCircle },
  outage: { color: "#ef4444", label: "Outage", icon: AlertTriangle },
} as const;

export default function StatusPage() {
  const anyDegraded = COMPONENTS.some((c) => c.status !== "operational");
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            <Activity className="h-3 w-3" /> Status
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">All systems</h1>
        </div>
        <span
          className="chip text-[12px]"
          style={{
            color: anyDegraded ? "#f59e0b" : "#10b981",
            background: anyDegraded ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)",
            borderColor: anyDegraded ? "rgba(245,158,11,0.25)" : "rgba(16,185,129,0.25)",
          }}
        >
          {anyDegraded ? "Partial degradation" : "All systems operational"}
        </span>
      </div>

      {/* Component statuses */}
      <div className="mt-8 card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[12px] text-ink-muted">
          90-day uptime per component
        </div>
        <div className="divide-y divide-line">
          {COMPONENTS.map((c) => {
            const m = statusMeta[c.status];
            const Icon = m.icon;
            return (
              <div key={c.name} className="grid items-center gap-3 px-5 py-3 md:grid-cols-[1fr_2fr_120px]">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: m.color }} />
                  <div>
                    <div className="text-[13px] text-ink">{c.name}</div>
                    {c.sub && <div className="text-[11px]" style={{ color: m.color }}>{c.sub}</div>}
                  </div>
                </div>
                <UptimeBar uptime={c.uptime90} />
                <div className="text-right text-[12px] font-semibold tracking-tight">{c.uptime90.toFixed(2)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incidents */}
      <div className="mt-8">
        <div className="mb-3 text-[14px] font-semibold">Recent incidents</div>
        <div className="space-y-3">
          {INCIDENTS.map((i) => (
            <div key={i.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="chip capitalize"
                      style={{
                        color: i.status === "Resolved" ? "#10b981" : "#f59e0b",
                      }}
                    >
                      {i.status}
                    </span>
                    <span className="chip capitalize">{i.severity}</span>
                    <span className="font-mono text-[11px] text-ink-muted">{i.id}</span>
                  </div>
                  <div className="mt-2 text-[15px] font-semibold">{i.title}</div>
                  <div className="mt-1 text-[11px] text-ink-muted">
                    Components: {i.components.join(", ")} · started {i.startedAt}
                  </div>
                </div>
              </div>
              <ol className="mt-4 space-y-2 border-l border-line pl-4 text-[12px]">
                {i.updates.map((u, k) => (
                  <li key={k}>
                    <div className="text-ink">{u.body}</div>
                    <div className="mt-0.5 text-[11px] text-ink-muted">{u.ts}</div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Changelog */}
      <div className="mt-8">
        <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold">
          <ScrollText className="h-4 w-4 text-accent-gold" /> Recent changes
        </div>
        <div className="card overflow-hidden">
          <div className="divide-y divide-line">
            {CHANGELOG.map((c) => (
              <div key={c.title} className="grid items-center gap-3 px-5 py-3 md:grid-cols-[100px_1fr]">
                <span className="font-mono text-[11px] text-ink-muted">{c.ts}</span>
                <span className="text-[13px] text-ink">{c.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-bg-elev/40 p-6 text-[12px] text-ink-dim">
        Subscribe for incident notifications: webhook, RSS, email.
      </div>
    </div>
  );
}

function UptimeBar({ uptime }: { uptime: number }) {
  // 90 daily bars; lower uptime → more red bars.
  const days = 90;
  const failures = Math.round(((100 - uptime) / 100) * days);
  return (
    <div className="flex gap-[1px]">
      {Array.from({ length: days }, (_, i) => {
        const fail = i >= days - failures;
        const partial = i === days - failures - 1 && uptime % 1 !== 0;
        return (
          <span
            key={i}
            className="h-3 w-[3px] rounded-sm"
            style={{
              background: fail ? "#ef4444" : partial ? "#f59e0b" : "#10b981",
              opacity: fail ? 0.85 : 0.6,
            }}
          />
        );
      })}
    </div>
  );
}
