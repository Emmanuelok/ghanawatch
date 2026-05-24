import { Box, ExternalLink, Lock, ShieldCheck, Banknote, FileCode2, Check } from "lucide-react";

export const metadata = { title: "Smart contract escrow — GhanaWatch" };

const CONTRACT = {
  address: "0x4f1c11a82b6c81f81c44d3abc77b0f1c41a82b6c",
  chain: "Base (Coinbase L2)",
  deployed: "2026-04-12T14:22Z",
  abi: "GhanaWatchEscrow v1.4",
  totalLocked: "USDC 4,182,000",
  releasedLifetime: "USDC 2,118,500",
  activeMilestones: 187,
  txCount: 1248,
};

const RELEASES = [
  { ts: "2026-05-22T11:14Z", project: "Kasoa 4-Bed", milestone: "M4 — First floor decking", amount: "USDC 9,090", txid: "0x9b3f4e21a8dc77b0f1c41a82b6c…", signers: 3 },
  { ts: "2026-05-19T09:02Z", project: "Tema Civic Import", milestone: "M5 — Yard release", amount: "USDC 540", txid: "0xab12f4c4abc77b0f81e88d2c0193…", signers: 2 },
  { ts: "2026-05-12T16:30Z", project: "Ho Poultry Farm", milestone: "M2 — Coop construction", amount: "USDC 909", txid: "0x4f1c11a82b6c81f81c44d3abc77b0f…", signers: 3 },
];

const CODE = `// GhanaWatchEscrow.sol  (excerpt)
function releaseMilestone(uint256 projectId, uint256 milestoneId)
  external
  onlyAuthorisedSigners
  requireTrusteeAttestation(projectId, milestoneId)
  requireOwnerBiometric(projectId, milestoneId)
{
    Milestone storage m = milestones[projectId][milestoneId];
    require(!m.released, "already released");
    require(m.evidenceHashCount >= REQUIRED_EVIDENCE, "insufficient evidence");
    require(block.timestamp >= m.notBefore, "embargo not lifted");

    m.released = true;
    usdc.safeTransfer(m.beneficiary, m.amount);
    emit MilestoneReleased(projectId, milestoneId, m.amount, m.beneficiary);
}`;

export default function EscrowContractPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Box className="h-3 w-3" /> Smart contract escrow
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">On-chain escrow, GhanaWatch trust-minimised.</h1>
        <p className="mt-1 max-w-3xl text-[14px] text-ink-dim">
          For diaspora users who want trust-minimised escrow instead of bank-held trust. Funds are
          locked in a Solidity contract on Base; release requires three independent signatures
          (you / trustee / GhanaWatch oracle) plus your biometric. If GhanaWatch disappears
          tomorrow, your funds are still recoverable from the contract.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Total locked" value={CONTRACT.totalLocked} icon={Lock} color="#f5b800" />
        <Stat label="Released lifetime" value={CONTRACT.releasedLifetime} icon={Banknote} color="#10b981" />
        <Stat label="Active milestones" value={`${CONTRACT.activeMilestones}`} icon={ShieldCheck} color="#3b82f6" />
        <Stat label="Tx count" value={`${CONTRACT.txCount.toLocaleString()}`} icon={Box} color="#8b5cf6" />
      </div>

      <div className="mt-6 card p-5">
        <div className="flex flex-wrap items-center gap-3 text-[12px]">
          <span className="chip"><Box className="h-3 w-3" /> {CONTRACT.chain}</span>
          <span className="chip">{CONTRACT.abi}</span>
          <span className="chip">Deployed {CONTRACT.deployed.slice(0, 10)}</span>
          <a href="#" className="ml-auto btn btn-ghost text-[11px] py-1.5">
            View on BaseScan <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="mt-3 rounded-md border border-line bg-bg-elev/60 p-3">
          <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Address</div>
          <div className="hash-mono text-[12px]">{CONTRACT.address}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line bg-bg-elev/40 px-5 py-3">
            <div className="text-[14px] font-semibold">Recent releases</div>
            <span className="chip text-[10px]">{RELEASES.length} on this page</span>
          </div>
          <div className="divide-y divide-line">
            {RELEASES.map((r) => (
              <div key={r.txid} className="grid items-center gap-3 px-5 py-3 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="text-[13px] font-semibold">{r.project}</div>
                  <div className="mt-0.5 text-[11px] text-ink-dim">{r.milestone}</div>
                  <div className="mt-1 hash-mono">{r.txid}</div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-ink-muted">
                    <span>{r.ts.slice(0, 16).replace("T", " ")}</span>
                    <span>·</span>
                    <span>{r.signers}/3 signatures</span>
                    <Check className="h-3 w-3 text-accent-green" />
                  </div>
                </div>
                <div className="text-right text-[15px] font-semibold text-accent-gold">{r.amount}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold">
            <FileCode2 className="h-4 w-4 text-accent-gold" /> Release function (open source)
          </div>
          <pre className="overflow-x-auto rounded-md bg-bg-elev/60 p-3 text-[11px] leading-relaxed text-ink-dim">
{CODE}
          </pre>
          <ul className="mt-3 space-y-1.5 text-[12px] text-ink-dim">
            <li className="flex items-start gap-2"><Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-green" /> 3-of-3 multisig (owner / trustee / GhanaWatch oracle)</li>
            <li className="flex items-start gap-2"><Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-green" /> Biometric required at release time</li>
            <li className="flex items-start gap-2"><Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-green" /> Evidence-hash count threshold enforced on-chain</li>
            <li className="flex items-start gap-2"><Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-green" /> Time-lock prevents premature release</li>
            <li className="flex items-start gap-2"><Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-green" /> Owner recovery if GhanaWatch keys are lost (30-day cooldown)</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 card p-5 text-[12px] text-ink-dim">
        <strong className="text-ink">Why on-chain?</strong> Some diaspora users prefer not to rely
        on Stanbic + GhanaWatch jointly. The contract removes single-party trust — even if every
        GhanaWatch employee walked off tomorrow, you'd still be able to recover your funds after
        the 30-day cooldown. The trade-off: small per-release gas fees + USDC volatility.
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, color }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        <Icon className="h-3 w-3" style={{ color }} /> {label}
      </div>
      <div className="mt-2 text-xl font-semibold tracking-tight" style={{ color }}>{value}</div>
    </div>
  );
}
