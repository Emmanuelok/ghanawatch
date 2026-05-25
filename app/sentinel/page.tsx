import { Shield, Cpu, Globe, AlertOctagon, Lock, Activity, ServerCog, Bug } from "lucide-react";
import { Sparkline } from "@/components/sparkline";

export const metadata = { title: "Sentinel SOC — GhanaWatch" };

const KPIS = [
  { label: "Sentinel signals (24h)", value: "1,842", color: "#3b82f6", trend: gen(120) },
  { label: "P1 incidents (30d)", value: "0", color: "#10b981", trend: gen(40) },
  { label: "WAF blocks (24h)", value: "8,412", color: "#f5b800", trend: gen(180) },
  { label: "MTTR (P2 last 90d)", value: "11m 42s", color: "#10b981", trend: gen(80).reverse() },
];

const SIGNALS = [
  { ts: "09:18", sev: "info", body: "Anomalous geolocation login — analyst Ama Sarpong from Tema (typical: Accra). MFA passed, allowed.", source: "Identity" },
  { ts: "08:51", sev: "warn", body: "Credential-stuffing burst from /29 ASN — 412 attempts blocked at WAF. Subnet rate-limited.", source: "WAF" },
  { ts: "08:14", sev: "info", body: "Daily Merkle root anchored to Bitcoin (block 884,118). Confirmation in 7 confs.", source: "Ledger" },
  { ts: "07:33", sev: "warn", body: "Vendor MoMo API latency 3.2× baseline. Failover to GhanaPay backup successful.", source: "Vendor svc" },
  { ts: "07:01", sev: "info", body: "Sanctions list refresh — OFAC SDN +14 entries, EU CFSP +3. Indexed.", source: "Sanctions" },
  { ts: "03:42", sev: "warn", body: "Spike in cement-receipt forensic flags from a single ASN (Vodafone Ghana). Investigating cluster.", source: "Forensics" },
  { ts: "01:00", sev: "info", body: "Backup completed (eu-central-1, ap-southeast-2, us-east-1). 11.4 TB. Integrity OK.", source: "Backups" },
];

function gen(n: number) {
  const out: { v: number }[] = []; let v = 50;
  for (let i = 0; i < n; i++) { v += Math.sin(i / 3) * 4 + 1; out.push({ v: Math.round(v) }); }
  return out;
}

export default function SentinelPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Shield className="h-3 w-3" /> Sentinel SOC
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Platform security operations.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          The view for the GhanaWatch internal security team — and a transparency window for
          institutional partners. Identity events, WAF traffic, ledger integrity, vendor service
          health, sanctions index, backup posture.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="card p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{k.label}</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-semibold tracking-tight" style={{ color: k.color }}>{k.value}</span>
              <Sparkline data={k.trend.slice(-40)} color={k.color} width={92} height={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Signals feed</div>
          <div className="divide-y divide-line max-h-[520px] overflow-y-auto scroll-shadow">
            {SIGNALS.map((s, i) => {
              const colour = s.sev === "warn" ? "#f59e0b" : "#9aa0b0";
              return (
                <div key={i} className="grid items-start gap-3 px-5 py-3 md:grid-cols-[60px_1fr_auto]">
                  <span className="font-mono text-[11px] text-ink-muted">{s.ts}</span>
                  <span className="text-[12.5px] text-ink">{s.body}</span>
                  <div className="flex items-center gap-2">
                    <span className="chip text-[10px]">{s.source}</span>
                    <span className="chip text-[10px] uppercase" style={{ color: colour, borderColor: `${colour}30` }}>{s.sev}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <Card icon={Cpu} title="Compute health" sub="Auto-scaled across 3 regions">
            <ul className="space-y-1 text-[12px] text-ink-dim">
              <li>· eu-central-1: 412 RPS, p95 142ms</li>
              <li>· us-east-1: 304 RPS, p95 168ms</li>
              <li>· ap-southeast-2: 88 RPS, p95 188ms</li>
            </ul>
          </Card>
          <Card icon={Lock} title="Key rotation" sub="HSM-managed">
            <ul className="space-y-1 text-[12px] text-ink-dim">
              <li>· Audit-ledger signing key: rotated 9d ago</li>
              <li>· OAuth client secrets: 21d</li>
              <li>· Slack/Teams app tokens: 4d</li>
            </ul>
          </Card>
          <Card icon={Bug} title="Bug bounty" sub="Open invitations">
            <ul className="space-y-1 text-[12px] text-ink-dim">
              <li>· P1: USD 25K  ·  P2: USD 5K</li>
              <li>· 11 reports closed in 2026</li>
              <li>· Avg time-to-triage: 4h 12m</li>
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Card2 icon={ServerCog} label="Uptime 90d" value="99.96%" />
        <Card2 icon={Globe} label="Edge POPs" value="14" />
        <Card2 icon={AlertOctagon} label="WAF rules" value="284" />
        <Card2 icon={Activity} label="DR drill" value="2026-04-22" sub="passed" />
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, sub, children }: any) {
  return (
    <div className="card p-5">
      <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold">
        <Icon className="h-4 w-4 text-accent-gold" /> {title}
      </div>
      <div className="text-[11px] text-ink-muted">{sub}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Card2({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-2 text-xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="text-[11px] text-accent-green">{sub}</div>}
    </div>
  );
}
