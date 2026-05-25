import Link from "next/link";
import { Heart, ShieldCheck, GraduationCap, HeartPulse, Home, Check } from "lucide-react";

export const metadata = { title: "Hardship & pro-bono — GhanaWatch" };

const TIERS = [
  { name: "Healthcare emergency", desc: "Verifying medical-care money flow for a sick family member when you can't afford the platform.", fee: "Free", icon: HeartPulse, color: "#ef4444" },
  { name: "School fees", desc: "Verifying a single child's school fees per term.", fee: "Free up to GHS 5K/term", icon: GraduationCap, color: "#3b82f6" },
  { name: "Funeral assistance", desc: "Coordinating + auditing a funeral when the family is in crisis.", fee: "Subsidised", icon: Heart, color: "#8b5cf6" },
  { name: "First-time home build", desc: "First diaspora-funded home build below GHS 250K total budget.", fee: "50% discount Year 1", icon: Home, color: "#10b981" },
];

const APPLICATIONS = [
  { name: "M.A. (Toronto)", tier: "Healthcare emergency", amount: "GHS 12,400", status: "approved · waived", approvedAt: "2026-05-22" },
  { name: "K.O. (London)", tier: "School fees (3 terms)", amount: "GHS 7,200", status: "approved · waived", approvedAt: "2026-05-21" },
  { name: "Y.A. (Birmingham)", tier: "First-time home build", amount: "GHS 165,000 budget", status: "approved · 50% discount", approvedAt: "2026-05-15" },
  { name: "E.F. (Hamburg)", tier: "Funeral assistance", amount: "GHS 22,000", status: "approved · subsidised", approvedAt: "2026-05-11" },
];

export default function HardshipPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Heart className="h-3 w-3" /> Hardship & pro-bono
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Verification shouldn't cost the people who need it most.</h1>
        <p className="mt-1 max-w-3xl text-[14px] text-ink-dim">
          GhanaWatch's hardship programme waives or subsidises fees for diaspora users who fund
          healthcare, school fees, funerals, or first-time low-budget home builds. Funded by the
          Guard / Syndicate / Institutional tiers. No paperwork beyond income attestation.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((t) => {
          const I = t.icon;
          return (
            <div key={t.name} className="card p-5">
              <div
                className="grid h-10 w-10 place-items-center rounded-lg"
                style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}
              >
                <I className="h-5 w-5" style={{ color: t.color }} />
              </div>
              <div className="mt-3 text-[14px] font-semibold">{t.name}</div>
              <p className="mt-1 text-[12px] text-ink-dim">{t.desc}</p>
              <div className="mt-3 text-[12px]" style={{ color: t.color }}>{t.fee}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 card p-6">
        <div className="text-[14px] font-semibold">How it works</div>
        <ol className="mt-3 space-y-2 text-[13px] text-ink-dim">
          <li>1. Apply via the form below — takes 4 minutes.</li>
          <li>2. We confirm via income attestation (a recent payslip, tax return, or community-leader letter).</li>
          <li>3. Approval typically lands in 48h. No bank statements asked, no humiliation.</li>
          <li>4. Once approved, the platform features (escrow, forensics, trustee dispatch, ledger) work the same as a paid plan — just at the subsidised rate.</li>
        </ol>
        <button className="btn btn-primary mt-5"><ShieldCheck className="h-4 w-4" /> Apply for hardship cover</button>
      </div>

      <div className="mt-8 card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Recent approvals (anonymised)</div>
        <table className="w-full text-[12px]">
          <thead className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            <tr className="border-b border-line">
              <th className="px-5 py-3">Applicant</th>
              <th className="px-3 py-3">Tier</th>
              <th className="px-3 py-3">Amount</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-5 py-3 text-right">Approved</th>
            </tr>
          </thead>
          <tbody>
            {APPLICATIONS.map((a) => (
              <tr key={a.name} className="border-b border-line last:border-0">
                <td className="px-5 py-3 text-ink">{a.name}</td>
                <td className="px-3 py-3 text-ink-dim">{a.tier}</td>
                <td className="px-3 py-3 text-ink">{a.amount}</td>
                <td className="px-3 py-3 text-accent-green flex items-center gap-1.5"><Check className="h-3 w-3" /> {a.status}</td>
                <td className="px-5 py-3 text-right text-ink-muted">{a.approvedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 card p-6 text-center">
        <div className="mb-2 text-[14px] font-semibold">Want to fund the programme?</div>
        <p className="mx-auto max-w-md text-[13px] text-ink-dim">Paid plans contribute 1% of revenue to the hardship pool. Institutional partners can match.</p>
        <Link href="/pricing" className="btn btn-primary mt-4">See pricing tiers</Link>
      </div>
    </div>
  );
}
