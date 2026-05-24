import Link from "next/link";
import {
  Anchor,
  Fingerprint,
  Globe,
  ExternalLink,
  ShieldCheck,
  Box,
  Layers,
} from "lucide-react";

export const metadata = { title: "Blockchain anchor — GhanaWatch" };

const ANCHORS = [
  { ts: "2026-05-24T00:00Z", chain: "Bitcoin", txid: "9b3f4e21a8dc77b0f1c41a82b6cd0eef9b3f4e21a8dc77b0f1c41a82b6cd0eef", events: 14_872, merkle: "0xae34f8b29cd1442e91d2c0bf771a1b39ae34f8b29cd1442e91d2c0bf771a1b39" },
  { ts: "2026-05-23T00:00Z", chain: "Polygon", txid: "0x77c8a82bf81c44d3192e22e699c811b342a8244177c8a82bf81c44d3192e22e699c811b342a82441", events: 14_488, merkle: "0xab12f4c4abc77b0f81e88d2c0193ab12f4c4abc77b0f81e88d2c0193" },
  { ts: "2026-05-22T00:00Z", chain: "Polygon", txid: "0x4f1c11a82b6c81f81c44d3abc77b0f4f1c11a82b6c81f81c44d3abc77b0f4f1c11a82b6c81f81c44d3", events: 14_211, merkle: "0x9b2e71fa44d3ab19f81c81e88c8112ee" },
  { ts: "2026-05-21T00:00Z", chain: "Bitcoin", txid: "ab19f81c44d39c81812ee0eef9b3f4e21a8dc77b0f1c41a82b6cd0eef9b3f4e21", events: 13_968, merkle: "0xea1d4f81c44d2c0bf771a1b39ae34f8b2" },
  { ts: "2026-05-20T00:00Z", chain: "Polygon", txid: "0xea1d4f81c44d2c0bf771a1b39ae34f8b29cd1442e91d2c0bf771a1b39ae34f8b2", events: 13_701, merkle: "0xa82441ab19f81c44d3192e22e699c811" },
];

function explorerUrl(chain: string, txid: string) {
  if (chain === "Bitcoin") return `https://mempool.space/tx/${txid}`;
  return `https://polygonscan.com/tx/${txid}`;
}

export default function AnchorPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Anchor className="h-3 w-3" /> Public chain anchor
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Every day's audit ledger, anchored to a public chain.</h1>
        <p className="mt-1 max-w-3xl text-[14px] text-ink-dim">
          We compute a Merkle root over every audit-ledger event committed in the previous 24 hours
          and publish it to Bitcoin and Polygon. That gives any auditor, court, or insurance
          investigator a public, tamper-evident timestamp for every event we've ever recorded. You
          don't have to trust GhanaWatch — you can verify against the public chain.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Kpi label="Days anchored" value="612" sub="since 2024-09" />
        <Kpi label="Events anchored" value="2.18M" sub="cumulative" />
        <Kpi label="Chains" value="2" sub="Bitcoin + Polygon" />
        <Kpi label="Anchor cadence" value="Daily 00:00 UTC" />
      </div>

      <div className="mt-8 card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Recent anchor commits</div>
        <div className="divide-y divide-line">
          {ANCHORS.map((a) => (
            <div key={a.ts} className="grid gap-3 px-5 py-4 md:grid-cols-[140px_auto_1fr_auto]">
              <div>
                <div className="text-[13px] font-semibold">{a.ts.slice(0, 10)}</div>
                <div className="text-[10px] text-ink-muted">00:00 UTC</div>
              </div>
              <span
                className="chip text-[10px] self-start"
                style={{
                  color: a.chain === "Bitcoin" ? "#f7931a" : "#8247e5",
                  borderColor: a.chain === "Bitcoin" ? "rgba(247,147,26,0.25)" : "rgba(130,71,229,0.25)",
                }}
              >
                <Box className="h-3 w-3" /> {a.chain}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[11px] text-ink-muted">
                  <Fingerprint className="h-3 w-3" /> Merkle root
                </div>
                <div className="hash-mono truncate">{a.merkle}</div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-ink-muted">
                  <Globe className="h-3 w-3" /> txid
                </div>
                <div className="hash-mono truncate">{a.txid}</div>
              </div>
              <a
                href={explorerUrl(a.chain, a.txid)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost text-[12px] py-1.5 self-start"
              >
                View on {a.chain === "Bitcoin" ? "mempool.space" : "Polygonscan"} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 card p-6">
        <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold">
          <Layers className="h-4 w-4 text-accent-gold" /> How verification works
        </div>
        <ol className="space-y-2 text-[13px] text-ink-dim">
          <li><strong className="text-ink">1.</strong> Every audit ledger event is hashed and signed at write-time.</li>
          <li><strong className="text-ink">2.</strong> At 00:00 UTC, GhanaWatch computes the Merkle root of all events from the prior 24h.</li>
          <li><strong className="text-ink">3.</strong> The root is published as a 32-byte OP_RETURN on Bitcoin and a smart-contract event on Polygon.</li>
          <li><strong className="text-ink">4.</strong> Any auditor can request the Merkle proof for a specific event and verify it leads to the published root.</li>
          <li><strong className="text-ink">5.</strong> No GhanaWatch employee can alter past events without breaking the chain on the public ledger.</li>
        </ol>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <a href="#" className="card card-hover flex items-center gap-3 p-4">
            <ShieldCheck className="h-5 w-5 text-accent-gold" />
            <div className="flex-1">
              <div className="text-[13px] font-semibold">Verify an event</div>
              <div className="text-[11px] text-ink-dim">Paste an event hash, get a Merkle proof + chain link</div>
            </div>
            <ExternalLink className="h-4 w-4 text-ink-muted" />
          </a>
          <a href="/developers" className="card card-hover flex items-center gap-3 p-4">
            <Box className="h-5 w-5 text-accent-gold" />
            <div className="flex-1">
              <div className="text-[13px] font-semibold">Anchor verification API</div>
              <div className="text-[11px] text-ink-dim">/v1/anchor/verify — REST + webhook</div>
            </div>
            <ExternalLink className="h-4 w-4 text-ink-muted" />
          </a>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="text-[11px] text-ink-muted">{sub}</div>}
    </div>
  );
}
