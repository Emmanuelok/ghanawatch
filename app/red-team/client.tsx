"use client";
import { useState } from "react";
import { Bug, Loader2, ShieldAlert, Check, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import { PROJECTS } from "@/lib/mock-data";

type Attack = {
  id: string;
  scenario: string;
  difficulty: "trivial" | "easy" | "moderate" | "hard" | "expert";
  feasibility: number;
  expectedLossGHS: number;
  detectedBy?: string;
  caughtByControl?: string;
  fix?: string;
};

function generateAttacks(projectId: string): Attack[] {
  const p = PROJECTS.find((x) => x.id === projectId);
  if (!p) return [];
  const base: Attack[] = [];

  if (p.sector === "construction") {
    base.push(
      { id: "atk-1", scenario: "Manager submits a photocopied cement receipt with the price field edited", difficulty: "easy", feasibility: 80, expectedLossGHS: 18_000, caughtByControl: "Document forensics (pixel-tampering detector caught this 3 days ago)", fix: "Confirmed — already caught." },
      { id: "atk-2", scenario: "Manager submits a site photo taken at the supplier yard, not at the parcel", difficulty: "easy", feasibility: 76, expectedLossGHS: 24_000, caughtByControl: "Geo-stamp + scene match (caught 2 days ago)", fix: "Confirmed — already caught." },
      { id: "atk-3", scenario: "Manager colludes with a vendor to inflate quantities by 40%", difficulty: "moderate", feasibility: 52, expectedLossGHS: 86_000, caughtByControl: "BOQ-vs-quantity cross-check + trustee surprise count", fix: "Trigger an unannounced trustee inventory count this week." },
      { id: "atk-4", scenario: "Subcontractor demands cash on Friday claiming the bank is closed", difficulty: "easy", feasibility: 64, expectedLossGHS: 8_000, caughtByControl: "Escrow-only policy auto-blocks side payments", fix: "Reaffirm 'no cash payments above GHS 5,000' policy with manager." },
      { id: "atk-5", scenario: "Manager forges a 'trustee report' to release a milestone early", difficulty: "hard", feasibility: 18, expectedLossGHS: 140_000, caughtByControl: "Trustee reports sign with their KYC-bound key — forgery breaks verification", fix: "Already mitigated by signing infrastructure." },
    );
  }
  if (p.sector === "real-estate") {
    base.push(
      { id: "atk-r1", scenario: "Seller's surveyor swaps a boundary peg by 14m to absorb a neighbouring plot", difficulty: "moderate", feasibility: 44, expectedLossGHS: 220_000, caughtByControl: "Independent licensed-surveyor verification by trustee", fix: "Dispatch surveyor for boundary GPS lock." },
      { id: "atk-r2", scenario: "Stool elder sells overlapping parcels to two diaspora buyers in 18 months", difficulty: "easy", feasibility: 70, expectedLossGHS: 1_250_000, caughtByControl: "Lands Commission cross-check on indenture upload", fix: "Already triggered the case for this project." },
      { id: "atk-r3", scenario: "Lawyer's 'protective filing fee' email demands GHS 18,500 MoMo to a personal number", difficulty: "trivial", feasibility: 88, expectedLossGHS: 18_500, caughtByControl: "Email forensics archetype detector", fix: "Always verify via the LC main switchboard." },
    );
  }
  if (p.sector === "vehicle-import") {
    base.push(
      { id: "atk-v1", scenario: "Clearing agent fabricates GHS 8,000 'last-minute penalty' with no GRA receipt", difficulty: "easy", feasibility: 76, expectedLossGHS: 8_000, caughtByControl: "GRA receipt cross-check + duty calculator parity", fix: "Demand serialised GRA worksheet." },
      { id: "atk-v2", scenario: "VIN substitution between the BoL and the actual vehicle delivered", difficulty: "moderate", feasibility: 28, expectedLossGHS: 95_000, caughtByControl: "VIN photo + Bill of Lading + GRA cross-match", fix: "Yard-side VIN photo before final payment." },
    );
  }
  if (p.sector === "business") {
    base.push(
      { id: "atk-b1", scenario: "Auntie reissues last month's rent receipt with a new date", difficulty: "easy", feasibility: 70, expectedLossGHS: 12_400, caughtByControl: "Duplicate-hash detection on receipt signatures", fix: "Already caught for this project — refund pending." },
      { id: "atk-b2", scenario: "Inventory shrinkage — daily counts not done", difficulty: "moderate", feasibility: 56, expectedLossGHS: 40_000, caughtByControl: "Mandatory daily till photo + monthly trustee count", fix: "Enforce WhatsApp daily till ledger." },
    );
  }
  // Always include
  base.push({
    id: "atk-x1",
    scenario: "Phishing the diaspora user via a spoofed Lands Commission email",
    difficulty: "trivial",
    feasibility: 92,
    expectedLossGHS: 18_500,
    caughtByControl: "Email forensics + diaspora user training",
    fix: "Forward all suspicious emails through /email-forensics first.",
  });

  return base;
}

export function RedTeamClient() {
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const [running, setRunning] = useState(false);
  const [attacks, setAttacks] = useState<Attack[] | null>(null);

  function run() {
    setRunning(true);
    setAttacks(null);
    setTimeout(() => {
      setAttacks(generateAttacks(projectId));
      setRunning(false);
    }, 1500);
  }

  const totalExposure = attacks ? attacks.reduce((s, a) => s + (a.expectedLossGHS * a.feasibility) / 100, 0) : 0;

  return (
    <div className="mt-8">
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Bug className="h-4 w-4 text-accent-gold" /> Configure red-team run</div>
        <div className="grid items-end gap-3 md:grid-cols-[1fr_auto]">
          <label className="block">
            <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Target project</div>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="input">
              {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <button onClick={run} disabled={running} className="btn btn-primary disabled:opacity-40">
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {running ? "Simulating…" : "Run adversarial simulation"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-ink-muted">
          The AI plays a Ghana-savvy fraudster who knows the project's setup. It tries every
          plausible attack and reports which would land.
        </p>
      </div>

      {attacks && (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Kpi label="Attack vectors tried" value={`${attacks.length}`} />
            <Kpi label="Caught by controls" value={`${attacks.filter((a) => a.caughtByControl).length}/${attacks.length}`} color="#10b981" />
            <Kpi label="Probability-weighted exposure" value={`GHS ${Math.round(totalExposure).toLocaleString()}`} color={totalExposure > 100_000 ? "#ef4444" : "#f59e0b"} />
          </div>

          <div className="mt-6 space-y-3">
            {attacks.map((a) => {
              const caught = !!a.caughtByControl;
              const color = caught ? "#10b981" : "#ef4444";
              return (
                <div key={a.id} className="card p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="chip uppercase tracking-wider"
                      style={{ color, borderColor: `${color}30`, background: `${color}10` }}
                    >
                      {caught ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                      {caught ? "caught" : "vector open"}
                    </span>
                    <span className="chip capitalize text-[10px]">difficulty: {a.difficulty}</span>
                    <span className="chip text-[10px]">feasibility {a.feasibility}%</span>
                    <span className="ml-auto text-[12px] text-ink-dim">expected loss GHS {a.expectedLossGHS.toLocaleString()}</span>
                  </div>
                  <div className="mt-3 text-[14px] font-semibold">{a.scenario}</div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {a.caughtByControl && (
                      <div className="rounded-md border border-line bg-bg-elev/40 p-3">
                        <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Caught by</div>
                        <p className="mt-1 flex items-start gap-2 text-[12.5px] text-ink-dim"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" />{a.caughtByControl}</p>
                      </div>
                    )}
                    {a.fix && (
                      <div className="rounded-md border border-line bg-bg-elev/40 p-3">
                        <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Recommended action</div>
                        <p className="mt-1 flex items-start gap-2 text-[12.5px] text-ink-dim"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-gold" />{a.fix}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function Kpi({ label, value, color }: any) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight" style={color ? { color } : {}}>{value}</div>
    </div>
  );
}
