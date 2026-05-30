"use client";
import { useState } from "react";
import {
  Check,
  Loader2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ScanFace,
  Phone,
  Users,
  Calendar,
  Sparkles,
  MessageCircle,
  Plus,
  Copy,
  Trash2,
  UserPlus,
} from "lucide-react";
import { SECTOR_META } from "@/components/sector-icon";
import { TRUSTEES } from "@/lib/mock-data";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const STEPS = ["You", "Project", "Manager", "Co-signers", "Trustee", "Launch"];

type Signer = { id: string; name: string; role: string; contact: string };

export function OnboardingClient() {
  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Step 1 — YOU
  const [fullName, setFullName] = useState("");
  const [countryAbroad, setCountryAbroad] = useState("Canada");
  const [phone, setPhone] = useState("+1 ");
  const [livenessDone, setLivenessDone] = useState(false);

  // Step 2 — PROJECT
  const [sector, setSector] = useState<keyof typeof SECTOR_META>("construction");
  const [projectName, setProjectName] = useState("");
  const [region, setRegion] = useState("Greater Accra");
  const [budget, setBudget] = useState(250000);

  // Step 3 — MANAGER
  const [managerName, setManagerName] = useState("");
  const [managerRelation, setManagerRelation] = useState("Brother");
  const [managerPhone, setManagerPhone] = useState("+233 ");
  // Deterministic invite token derived from the inputs — stable across SSR/client
  // render (Math.random() here would cause a hydration mismatch).
  const inviteToken = Math.abs(
    [...`${projectName}|${managerName}`].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7),
  )
    .toString(36)
    .slice(0, 7)
    .padStart(7, "0");
  const inviteLink = `https://wa.me/233502222999?text=${encodeURIComponent(
    `Hi ${managerName || "manager"}, please join the GhanaWatch project "${projectName || "..."}" — link: gw.app/m/${inviteToken}`,
  )}`;

  // Step 4 — CO-SIGNERS
  const [signers, setSigners] = useState<Signer[]>([
    { id: "s-1", name: "", role: "next-of-kin", contact: "" },
  ]);
  function addSigner() {
    setSigners((s) => [...s, { id: `s-${Date.now()}`, name: "", role: "witness", contact: "" }]);
  }
  function rmSigner(id: string) {
    setSigners((s) => s.filter((x) => x.id !== id));
  }

  // Step 5 — TRUSTEE
  const recommendedTrustee = (() => {
    if (sector === "real-estate") return TRUSTEES.find((t) => t.id === "tr-2")!;
    if (sector === "construction") return TRUSTEES.find((t) => t.id === "tr-1")!;
    if (sector === "vehicle-import") return TRUSTEES.find((t) => t.id === "tr-5")!;
    if (sector === "medical") return TRUSTEES.find((t) => t.id === "tr-4")!;
    if (sector === "agriculture") return TRUSTEES.find((t) => t.id === "tr-6")!;
    return TRUSTEES.find((t) => t.id === "tr-3")!;
  })();
  const [trusteeBooked, setTrusteeBooked] = useState(false);

  const canNext: Record<Step, boolean> = {
    1: fullName.length > 2 && livenessDone && phone.length > 5,
    2: projectName.length > 2 && budget > 0,
    3: managerName.length > 1 && managerPhone.length > 6,
    4: true, // signers are optional
    5: true, // trustee selection optional but recommended
    6: true,
  };

  function next() {
    if (step < 6) setStep((s) => (s + 1) as Step);
    else launch();
  }
  function back() { setStep((s) => Math.max(1, s - 1) as Step); }

  function launch() {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1400);
  }

  if (done) {
    return (
      <div className="card mt-8 p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-green/15 text-accent-green">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">You're live ✓</h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] text-ink-dim">
          <strong className="text-ink">{projectName}</strong> is now under the verification umbrella.
          We've messaged <strong className="text-ink">{managerName}</strong> on WhatsApp, invited
          your co-signers to verify, and {trusteeBooked ? `booked ${recommendedTrustee.name.split(",")[0]} for the initial site visit.` : "saved your trustee preference."}
        </p>
        <div className="mt-6 grid gap-2 rounded-lg border border-line bg-bg-elev/40 p-4 text-left text-[12px]">
          <Row k="Project" v={projectName} />
          <Row k="Sector" v={SECTOR_META[sector].label} />
          <Row k="Region" v={region} />
          <Row k="Budget" v={`GHS ${budget.toLocaleString()}`} />
          <Row k="Manager invited" v={`${managerName} (${managerRelation}) · ${managerPhone}`} />
          <Row k="Co-signers" v={`${signers.filter((s) => s.name).length} added`} />
          <Row k="Trustee" v={trusteeBooked ? `${recommendedTrustee.name} — dispatched` : "Saved — not yet dispatched"} />
        </div>
        <div className="mt-6 flex justify-center gap-2">
          <a href="/dashboard" className="btn btn-primary">Open dashboard</a>
          <a href="/projects" className="btn btn-ghost">All projects</a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <ProgressBar current={step} />

      <div className="card mt-5 p-6">
        {step === 1 && (
          <Section icon={ScanFace} title="Step 1 — Verify yourself">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Full name (as on your government ID)">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
              </Field>
              <Field label="Country abroad">
                <select value={countryAbroad} onChange={(e) => setCountryAbroad(e.target.value)} className="input">
                  {["Canada", "United Kingdom", "United States", "Germany", "France", "Italy", "Australia", "Netherlands", "Spain", "South Africa", "Other"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Mobile (for critical alerts)">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
              </Field>
              <Field label="Selfie liveness">
                {livenessDone ? (
                  <div className="input flex items-center gap-2 text-accent-green"><Check className="h-4 w-4" /> Verified · 97% match</div>
                ) : (
                  <button onClick={() => setLivenessDone(true)} className="btn btn-ghost w-full justify-center"><ScanFace className="h-4 w-4" /> Run liveness check</button>
                )}
              </Field>
            </div>
            <p className="mt-3 text-[11px] text-ink-muted">
              We run a full KYC + AML in the background. You can complete it later from /identity if you prefer.
            </p>
          </Section>
        )}

        {step === 2 && (
          <Section icon={Sparkles} title="Step 2 — Tell us about the project">
            <div className="space-y-3">
              <Field label="Sector">
                <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
                  {(Object.keys(SECTOR_META) as (keyof typeof SECTOR_META)[]).slice(0, 5).map((k) => {
                    const m = SECTOR_META[k] as any;
                    const I = m.icon;
                    const selected = sector === k;
                    return (
                      <button
                        key={k}
                        onClick={() => setSector(k)}
                        className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-colors ${
                          selected ? "border-accent-gold bg-accent-gold/5" : "border-line bg-bg-elev/40 hover:border-line/70"
                        }`}
                      >
                        <I size={16} style={{ color: m.color }} />
                        <span className="truncate text-[12px]">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Project name"><input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. 4-bedroom family home" className="input" /></Field>
                <Field label="Region">
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="input">
                    {["Greater Accra", "Ashanti", "Central", "Western", "Eastern", "Volta", "Northern", "Bono", "Upper East", "Upper West"].map((r) => <option key={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Budget (GHS)"><input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="input" /></Field>
              </div>
            </div>
          </Section>
        )}

        {step === 3 && (
          <Section icon={MessageCircle} title="Step 3 — Invite your manager on the ground">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Their name"><input value={managerName} onChange={(e) => setManagerName(e.target.value)} className="input" placeholder="e.g. Kwame Mensah" /></Field>
              <Field label="Relationship">
                <select value={managerRelation} onChange={(e) => setManagerRelation(e.target.value)} className="input">
                  {["Brother", "Sister", "Cousin", "Aunt", "Uncle", "Father", "Mother", "Friend", "Contractor", "Lawyer", "Clearing Agent", "Doctor", "Other"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Their WhatsApp number (Ghana)">
                <input value={managerPhone} onChange={(e) => setManagerPhone(e.target.value)} className="input" />
              </Field>
              <Field label="Personalised invite preview">
                <div className="input text-[11px] text-ink-dim">
                  "Hi {managerName || "_____"}, please join the GhanaWatch project '{projectName || "_____"}' — verify via gw.app/m/..."
                </div>
              </Field>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a href={inviteLink} target="_blank" rel="noreferrer" className="btn btn-primary"><MessageCircle className="h-4 w-4" /> Send WhatsApp invite</a>
              <button onClick={() => navigator.clipboard.writeText(inviteLink)} className="btn btn-ghost"><Copy className="h-4 w-4" /> Copy link</button>
            </div>
            <p className="mt-3 text-[11px] text-ink-muted">
              When they tap the link, the GhanaWatch bot guides them through Ghana Card upload, an Assembly-Member attestation, and biometric setup — no app install needed.
            </p>
          </Section>
        )}

        {step === 4 && (
          <Section icon={UserPlus} title="Step 4 — Add co-signers (recommended for &gt; GHS 100K)">
            <p className="text-[12px] text-ink-dim">
              A second verified human (next of kin, lawyer, or witness) co-signs consequential
              decisions. This is exactly how Ghanaian conveyancing already works — encoded here in
              the UI.
            </p>
            <div className="mt-4 space-y-2">
              {signers.map((s, i) => (
                <div key={s.id} className="grid items-end gap-2 rounded-md border border-line bg-bg-elev/40 p-3 md:grid-cols-[1fr_140px_1fr_auto]">
                  <Field label={`Co-signer #${i + 1}`}>
                    <input value={s.name} onChange={(e) => setSigners((arr) => arr.map((x) => x.id === s.id ? { ...x, name: e.target.value } : x))} className="input py-1.5" placeholder="Full name" />
                  </Field>
                  <Field label="Role">
                    <select value={s.role} onChange={(e) => setSigners((arr) => arr.map((x) => x.id === s.id ? { ...x, role: e.target.value } : x))} className="input py-1.5">
                      <option value="next-of-kin">Next of kin</option>
                      <option value="co-investor">Co-investor</option>
                      <option value="witness">Witness</option>
                      <option value="lawyer">Lawyer</option>
                    </select>
                  </Field>
                  <Field label="Phone / email">
                    <input value={s.contact} onChange={(e) => setSigners((arr) => arr.map((x) => x.id === s.id ? { ...x, contact: e.target.value } : x))} className="input py-1.5" placeholder="+233 ... or @" />
                  </Field>
                  <button onClick={() => rmSigner(s.id)} className="grid h-9 w-9 place-items-center rounded-md text-ink-muted hover:bg-bg-elev hover:text-risk-high">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button onClick={addSigner} className="btn btn-ghost text-[12px] py-1.5"><Plus className="h-3.5 w-3.5" /> Add another co-signer</button>
            </div>
          </Section>
        )}

        {step === 5 && (
          <Section icon={Users} title="Step 5 — Pre-book your first trustee visit">
            <div className="rounded-xl border border-line bg-bg-elev/40 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent-gold to-accent-green text-[13px] font-semibold text-bg">
                  {recommendedTrustee.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold">{recommendedTrustee.name}</div>
                  <div className="text-[11px] text-ink-dim">{recommendedTrustee.profession} · {recommendedTrustee.region}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                    <span className="chip">★ {recommendedTrustee.rating}</span>
                    <span className="chip">{recommendedTrustee.jobsCompleted} jobs</span>
                    <span className="chip">{recommendedTrustee.feeRange}</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[12px] text-ink-dim">
                We recommend booking an initial visit within the first 30 days — establishes a
                ground-truth baseline and the trustee can vet your manager in person.
              </p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setTrusteeBooked(true)} className="btn btn-primary text-[12px] py-1.5">
                  {trusteeBooked ? <><Check className="h-3.5 w-3.5" /> Booked</> : <><Calendar className="h-3.5 w-3.5" /> Book initial visit (~72h)</>}
                </button>
                <button className="btn btn-ghost text-[12px] py-1.5">Pick a different trustee</button>
              </div>
            </div>
          </Section>
        )}

        {step === 6 && (
          <Section icon={Sparkles} title="Step 6 — Review & launch">
            <div className="grid gap-3 md:grid-cols-2">
              <Card title="You">
                <Row k="Name" v={fullName || "—"} />
                <Row k="Country abroad" v={countryAbroad} />
                <Row k="Phone" v={phone} />
                <Row k="Liveness" v={livenessDone ? "Verified" : "Pending"} />
              </Card>
              <Card title="Project">
                <Row k="Name" v={projectName || "—"} />
                <Row k="Sector" v={SECTOR_META[sector].label} />
                <Row k="Region" v={region} />
                <Row k="Budget" v={`GHS ${budget.toLocaleString()}`} />
              </Card>
              <Card title="Manager">
                <Row k="Name" v={managerName || "—"} />
                <Row k="Relation" v={managerRelation} />
                <Row k="WhatsApp" v={managerPhone} />
              </Card>
              <Card title="Co-signers">
                <Row k="Count" v={`${signers.filter((s) => s.name).length}`} />
                {signers.filter((s) => s.name).map((s) => (
                  <Row key={s.id} k={s.role} v={s.name} />
                ))}
              </Card>
              <Card title="Trustee" full>
                <Row k="Recommendation" v={recommendedTrustee.name} />
                <Row k="Booked now" v={trusteeBooked ? "Yes" : "No (book later)"} />
              </Card>
            </div>
            <div className="mt-4 rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-4 text-[12px] text-ink-dim">
              <strong className="text-ink">On launch, GhanaWatch will:</strong> create the project,
              send the WhatsApp invite to {managerName || "your manager"}, email each co-signer to
              verify, {trusteeBooked ? `dispatch ${recommendedTrustee.name.split(",")[0]} within 72h` : "save the trustee preference"}, anchor a Genesis ledger
              event for the project, and apply the right milestone + document templates for your
              sector.
            </div>
          </Section>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <button onClick={back} disabled={step === 1} className="btn btn-ghost disabled:opacity-40"><ArrowLeft className="h-3.5 w-3.5" /> Back</button>
          {step < 6 ? (
            <button onClick={next} disabled={!canNext[step]} className="btn btn-primary disabled:opacity-50">Continue <ArrowRight className="h-3.5 w-3.5" /></button>
          ) : (
            <button onClick={next} disabled={submitting} className="btn btn-primary">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {submitting ? "Launching…" : "Launch project"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ current }: { current: number }) {
  return (
    <div>
      <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
        {STEPS.map((l, i) => {
          const n = i + 1;
          return (
            <div key={l} className="flex shrink-0 items-center gap-2">
              <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold ${
                current >= n ? "bg-accent-gold text-bg" : "bg-bg-subtle text-ink-muted"
              }`}>{n}</span>
              <span className={current >= n ? "text-ink" : "text-ink-muted"}>{l}</span>
              {n < STEPS.length && <span className="h-px w-6 bg-line" />}
            </div>
          );
        })}
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-bg-subtle">
        <div className="h-full bg-gradient-to-r from-accent-gold to-accent-green transition-all duration-500" style={{ width: `${(current / STEPS.length) * 100}%` }} />
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: any) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent-gold" />
        <div className="text-[15px] font-semibold tracking-tight">{title}</div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      {children}
    </label>
  );
}

function Card({ title, full, children }: { title: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border border-line bg-bg-elev/40 p-4 ${full ? "md:col-span-2" : ""}`}>
      <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{title}</div>
      <div className="space-y-1 text-[12px]">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-ink-muted capitalize">{k}</span>
      <span className="max-w-[68%] text-right text-ink">{v}</span>
    </div>
  );
}
