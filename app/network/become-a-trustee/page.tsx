import { TrusteeApplyClient } from "./apply-client";
import { TRUSTEE_APPLICATIONS } from "@/lib/mock-data";
import { ShieldCheck, Award, Users, Check } from "lucide-react";

export const metadata = { title: "Become a Trustee — GhanaWatch" };

const STAGES = [
  { id: "submitted", label: "Application submitted" },
  { id: "license-check", label: "License verification with regulator" },
  { id: "background-check", label: "Background check (Police clearance + 2 referees)" },
  { id: "skill-test", label: "Skill test (case-based assessment)" },
  { id: "references", label: "Reference checks (3 past clients)" },
  { id: "approved", label: "Approved — trustee onboarded" },
];

export default function BecomeATrusteePage() {
  const approved = TRUSTEE_APPLICATIONS.filter((a) => a.stage === "approved").length;
  const inFlight = TRUSTEE_APPLICATIONS.length - approved;
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Award className="h-3 w-3" /> Trustee accreditation
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Become a GhanaWatch trustee</h1>
        <p className="mt-3 max-w-2xl text-[15px] text-ink-dim">
          You're a licensed surveyor, conveyancing lawyer, customs clearing agent, doctor or
          extension officer? Diaspora Ghanaians depend on people like you. Join the network — get
          dispatched within 72h to verifiable assignments, paid through escrow, no upfront client
          fishing.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Kpi label="Active trustees" value="1,240" />
        <Kpi label="Pending applications" value={`${inFlight}`} />
        <Kpi label="Median time-to-approval" value="18 days" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="card p-6">
            <div className="mb-3 text-[14px] font-semibold">The accreditation pipeline</div>
            <ol className="space-y-3 text-[13px]">
              {STAGES.map((s, i) => (
                <li key={s.id} className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-gold/15 text-[11px] font-semibold text-accent-gold">{i + 1}</span>
                  <div>
                    <div className="text-ink">{s.label}</div>
                    <div className="mt-0.5 text-[11px] text-ink-muted">{stageNote(s.id)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="card mt-4 p-6">
            <div className="mb-3 text-[14px] font-semibold">What we pay</div>
            <ul className="space-y-2 text-[13px] text-ink-dim">
              <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" /> GHS 600 — 6,000 per visit, depending on scope & profession.</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" /> Released to your MoMo / bank within 24h of the diaspora user signing off your report.</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" /> 10% rolled into the GhanaWatch Trustee Reserve (paid out at year-end).</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" /> Professional liability cover up to GHS 250,000 per assignment, included.</li>
            </ul>
          </div>
        </div>

        <TrusteeApplyClient />
      </div>

      <div className="mt-12">
        <div className="mb-4 text-[14px] font-semibold">Applications in flight</div>
        <div className="card overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="text-left text-[11px] uppercase tracking-[0.1em] text-ink-muted">
              <tr className="border-b border-line">
                <th className="px-5 py-3">Applicant</th>
                <th className="px-3 py-3">Profession</th>
                <th className="px-3 py-3">Region</th>
                <th className="px-3 py-3">Stage</th>
                <th className="px-5 py-3 text-right">Applied</th>
              </tr>
            </thead>
            <tbody>
              {TRUSTEE_APPLICATIONS.map((a) => {
                const ix = STAGES.findIndex((s) => s.id === a.stage);
                return (
                  <tr key={a.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 text-ink">{a.applicant}</td>
                    <td className="px-3 py-3 text-ink-dim">{a.profession}</td>
                    <td className="px-3 py-3 text-ink-dim">{a.region}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        {STAGES.map((_, i) => (
                          <span
                            key={i}
                            className="h-1.5 w-6 rounded-full"
                            style={{ background: i <= ix ? "#f5b800" : "#1a1d27" }}
                          />
                        ))}
                      </div>
                      <div className="mt-1 text-[11px] text-ink-muted">{STAGES[ix]?.label}</div>
                    </td>
                    <td className="px-5 py-3 text-right text-ink-muted">{rel(a.appliedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function stageNote(id: string) {
  switch (id) {
    case "submitted": return "We confirm your contact details and email you the next steps.";
    case "license-check": return "We call the regulator (GhIS, GLC, MDC, MoFA, GRA) to confirm your active license.";
    case "background-check": return "Ghana Police clearance + 2 named referees who've supervised your work.";
    case "skill-test": return "Open-book case-based assessment specific to your profession (~90 min).";
    case "references": return "3 past clients (diaspora and local) interviewed by our team.";
    case "approved": return "Profile goes live; you start receiving dispatch requests within your region.";
    default: return "";
  }
}

function rel(iso: string) {
  const d = Math.floor((new Date("2026-05-24T09:00:00Z").getTime() - new Date(iso).getTime()) / 86400000);
  return `${d}d ago`;
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
