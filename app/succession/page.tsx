import { Heart, ShieldCheck, FileText, Users, Lock, Clock, Check } from "lucide-react";

export const metadata = { title: "Succession plan — GhanaWatch" };

const STEPS = [
  { n: "0–24h", title: "Triggering event recorded", body: "Family member (next-of-kin) confirms the event via biometric + 2-of-3 multi-party verification (next-of-kin, family lawyer, hometown association chair).", icon: ShieldCheck },
  { n: "24–72h", title: "Account state frozen", body: "All escrow disbursements paused. No new payments outbound. Asset registry frozen at the moment of trigger.", icon: Lock },
  { n: "Day 3", title: "Sealed evidence pack auto-generated", body: "Court-quality evidence pack of every project, asset, ledger entry, and contributor handed to your designated executor.", icon: FileText },
  { n: "Day 7–30", title: "Estate proceedings", body: "Beneficiaries named in your succession plan inherit project ownership. Probate documents auto-prepared per Ghanaian Intestate Succession Act 1985 (PNDCL 111) or your registered will.", icon: Users },
  { n: "Day 30–90", title: "Final settlement", body: "Escrow distributed per your plan. Trustees finish in-flight milestones for beneficiaries. Assets re-registered.", icon: Heart },
];

const PLAN = [
  { person: "Joseph Mensah (Father)", role: "Primary executor", share: "—", contact: "+233 24 555 1101", verified: true },
  { person: "Kwame Mensah (Brother)", role: "Co-executor + secondary", share: "—", contact: "+233 24 555 1104", verified: true },
  { person: "Esi Ofori, Esq.", role: "Family lawyer (estate)", share: "—", contact: "esi@oforilegal.gh", verified: true },
  { person: "Kofi Mensah (Son)", role: "Beneficiary", share: "50%", contact: "Toronto", verified: false },
  { person: "Ama Mensah (Daughter)", role: "Beneficiary", share: "50%", contact: "Toronto", verified: false },
];

export default function SuccessionPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Heart className="h-3 w-3" /> Disaster recovery & succession
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">What happens when something happens to you.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          The hardest conversation, made operational. If you become incapacitated or pass on, your
          family doesn't lose access to your Ghanaian holdings — and they aren't left fighting in
          court for years. Pre-name your executors, your beneficiaries, the share-out; the platform
          executes.
        </p>
      </div>

      <div className="mt-8 card p-6">
        <div className="mb-1 text-[14px] font-semibold">Your succession status</div>
        <div className="text-[12px] text-ink-dim">Last updated 2026-04-12 · stored in HSM, encrypted at rest, recoverable only by 2-of-3 designated executors</div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Stat label="Executors" value="2 named · KYC verified" color="#10b981" />
          <Stat label="Beneficiaries" value="2 named · 0 KYC" color="#f59e0b" />
          <Stat label="Will reference" value="Registered with Ofori Chambers" color="#10b981" />
        </div>
      </div>

      <div className="mt-8 card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Your succession circle</div>
        <table className="w-full text-[12px]">
          <thead className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            <tr className="border-b border-line">
              <th className="px-5 py-3">Person</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Share</th>
              <th className="px-3 py-3">Contact</th>
              <th className="px-5 py-3 text-right">KYC</th>
            </tr>
          </thead>
          <tbody>
            {PLAN.map((p) => (
              <tr key={p.person} className="border-b border-line last:border-0">
                <td className="px-5 py-3 text-ink">{p.person}</td>
                <td className="px-3 py-3 text-ink-dim">{p.role}</td>
                <td className="px-3 py-3 text-ink">{p.share}</td>
                <td className="px-3 py-3 text-ink-dim">{p.contact}</td>
                <td className="px-5 py-3 text-right">
                  {p.verified ? (
                    <span className="chip" style={{ color: "#10b981" }}><Check className="h-3 w-3" /> verified</span>
                  ) : (
                    <button className="chip" style={{ color: "#f59e0b" }}>Invite</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <div className="mb-3 text-[14px] font-semibold">If something happens — the timeline</div>
        <div className="space-y-3">
          {STEPS.map((s, i) => {
            const I = s.icon;
            return (
              <div key={s.n} className="card grid items-start gap-4 p-5 md:grid-cols-[80px_36px_1fr]">
                <div className="text-[12px] font-mono uppercase tracking-[0.12em] text-accent-gold">{s.n}</div>
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-gold/15 text-accent-gold">
                  <I className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold">{s.title}</div>
                  <p className="mt-1 text-[12.5px] text-ink-dim">{s.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 card p-6">
        <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><Clock className="h-4 w-4 text-accent-gold" /> What you should do now</div>
        <ul className="space-y-1.5 text-[13px] text-ink-dim">
          <li>· Invite both children to complete KYC — it'll save a month of friction later.</li>
          <li>· Confirm the share-out (currently 50/50) with your registered will.</li>
          <li>· Schedule the annual succession-review reminder (we'll send it).</li>
          <li>· Optionally name a hometown-association co-witness for the trigger.</li>
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-line bg-bg-elev/40 p-4">
      <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      <div className="mt-1 text-[15px] font-semibold" style={{ color }}>{value}</div>
    </div>
  );
}
