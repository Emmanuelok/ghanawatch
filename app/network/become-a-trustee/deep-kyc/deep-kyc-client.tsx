"use client";
import { useState } from "react";
import {
  Check,
  Loader2,
  Plus,
  Trash2,
  Fingerprint,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  MapPin,
  FileText,
  Save,
} from "lucide-react";

type Address = { id: string; from: string; to: string; line: string; region: string };

export function DeepKycClient() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Address history
  const [addresses, setAddresses] = useState<Address[]>([
    { id: "a-1", from: "2024-01", to: "Present", line: "Plot 18, Adjiringanor", region: "Greater Accra" },
    { id: "a-2", from: "2020-06", to: "2024-01", line: "House 12, Akweley Hills", region: "Central" },
  ]);
  // Criminal & professional
  const [criminal, setCriminal] = useState<"none" | "minor" | "major">("none");
  const [criminalNote, setCriminalNote] = useState("");
  const [bankruptcy, setBankruptcy] = useState<"no" | "yes">("no");
  const [pendingLitigation, setPendingLitigation] = useState<"no" | "yes">("no");
  // Conflicts of interest
  const [familyInPlatform, setFamilyInPlatform] = useState(false);
  const [businessOwnership, setBusinessOwnership] = useState(false);
  const [coiNotes, setCoiNotes] = useState("");
  // PI insurance
  const [piInsured, setPiInsured] = useState(true);
  const [piProvider, setPiProvider] = useState("Hollard Ghana");
  const [piCover, setPiCover] = useState(500000);
  // Continuous monitoring
  const [continuousMonitoring, setContinuousMonitoring] = useState(true);
  const [biometricRefresh, setBiometricRefresh] = useState(true);

  function addAddress() {
    setAddresses((a) => [...a, { id: `a-${Date.now()}`, from: "", to: "", line: "", region: "Greater Accra" }]);
  }
  function updateAddress(id: string, k: keyof Address, v: string) {
    setAddresses((a) => a.map((x) => (x.id === id ? { ...x, [k]: v } : x)));
  }
  function removeAddress(id: string) {
    setAddresses((a) => a.filter((x) => x.id !== id));
  }

  function submit() {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1400);
  }

  if (submitted) {
    return (
      <div className="card mt-8 p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-green/15 text-accent-green">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Deep KYC submitted</h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-ink-dim">
          We've kicked off Police clearance request, 5-year address verification with each regional
          Assembly Member, and PI insurance confirmation. We'll email you when each completes — full
          deep-KYC typically lands in 14 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {/* 5-year address history */}
      <Section icon={MapPin} title="5-year address history">
        <p className="mb-3 text-[12px] text-ink-dim">Cover the last 5 years. Gaps are OK if you flag them. We verify with the local Assembly Member of each electoral area.</p>
        <div className="space-y-2">
          {addresses.map((a) => (
            <div key={a.id} className="grid items-end gap-2 rounded-md border border-line bg-bg-elev/40 p-3 md:grid-cols-[1fr_1fr_2fr_1fr_auto]">
              <Field label="From"><input type="month" value={a.from} onChange={(e) => updateAddress(a.id, "from", e.target.value)} className="input py-1.5" /></Field>
              <Field label="To"><input value={a.to} onChange={(e) => updateAddress(a.id, "to", e.target.value)} className="input py-1.5" /></Field>
              <Field label="Address line"><input value={a.line} onChange={(e) => updateAddress(a.id, "line", e.target.value)} className="input py-1.5" placeholder="House / Plot, Street, Town" /></Field>
              <Field label="Region">
                <select value={a.region} onChange={(e) => updateAddress(a.id, "region", e.target.value)} className="input py-1.5">
                  {["Greater Accra", "Ashanti", "Central", "Western", "Eastern", "Volta", "Northern", "Bono", "Upper East", "Upper West"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <button onClick={() => removeAddress(a.id)} className="grid h-9 w-9 place-items-center rounded-md text-ink-muted hover:bg-bg-elev hover:text-risk-high">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addAddress} className="btn btn-ghost mt-3 text-[12px] py-1.5"><Plus className="h-3.5 w-3.5" /> Add address</button>
      </Section>

      {/* Criminal record + civil */}
      <Section icon={Fingerprint} title="Criminal record & civil history">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Any criminal record in the past 10 years?">
            <select value={criminal} onChange={(e) => setCriminal(e.target.value as any)} className="input">
              <option value="none">None</option>
              <option value="minor">Minor (traffic / misdemeanour)</option>
              <option value="major">Major (felony / fraud / financial crime)</option>
            </select>
          </Field>
          <Field label="Bankruptcy / insolvency?">
            <select value={bankruptcy} onChange={(e) => setBankruptcy(e.target.value as any)} className="input">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
          <Field label="Pending civil litigation?">
            <select value={pendingLitigation} onChange={(e) => setPendingLitigation(e.target.value as any)} className="input">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
        </div>
        {criminal !== "none" && (
          <div className="mt-3">
            <Field label="Brief description (we still verify everything via Ghana Police clearance)">
              <textarea rows={3} value={criminalNote} onChange={(e) => setCriminalNote(e.target.value)} className="input resize-none" />
            </Field>
          </div>
        )}
        <div className="mt-3 rounded-md border border-line bg-bg-elev/40 p-3 text-[11px] text-ink-muted">
          <AlertTriangle className="mr-1 inline h-3 w-3 text-accent-gold" />
          A major financial-crime conviction is an automatic disqualifier. Minor records are reviewed
          case-by-case.
        </div>
      </Section>

      {/* Conflict of interest */}
      <Section icon={AlertTriangle} title="Conflict-of-interest disclosure">
        <div className="space-y-2">
          <Toggle label="Family member is also a diaspora user on GhanaWatch" checked={familyInPlatform} onChange={setFamilyInPlatform} />
          <Toggle label="I own / part-own a business that has been a vendor on any GhanaWatch project" checked={businessOwnership} onChange={setBusinessOwnership} />
        </div>
        {(familyInPlatform || businessOwnership) && (
          <div className="mt-3">
            <Field label="Tell us more — we'll flag projects you cannot be dispatched to">
              <textarea rows={3} value={coiNotes} onChange={(e) => setCoiNotes(e.target.value)} className="input resize-none" />
            </Field>
          </div>
        )}
      </Section>

      {/* Professional indemnity insurance */}
      <Section icon={FileText} title="Professional indemnity insurance">
        <Toggle label="I hold a current PI policy" checked={piInsured} onChange={setPiInsured} />
        {piInsured && (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Field label="Provider"><input value={piProvider} onChange={(e) => setPiProvider(e.target.value)} className="input" /></Field>
            <Field label="Cover (GHS)"><input type="number" value={piCover} onChange={(e) => setPiCover(Number(e.target.value))} className="input" /></Field>
          </div>
        )}
        <p className="mt-3 text-[11px] text-ink-muted">
          If you don't hold PI, GhanaWatch can sponsor a group policy at GHS 1,800/yr that covers up
          to GHS 500,000 per claim. Required for high-value dispatches (&gt; GHS 250K).
        </p>
      </Section>

      {/* Continuous monitoring */}
      <Section icon={ShieldCheck} title="Continuous monitoring consent">
        <Toggle label="Auto-refresh my Police clearance every 12 months" checked={continuousMonitoring} onChange={setContinuousMonitoring} />
        <Toggle label="Biometric face match before each dispatch (≥85% required)" checked={biometricRefresh} onChange={setBiometricRefresh} />
        <p className="mt-2 text-[11px] text-ink-muted">
          We will re-check sanctions lists, court filings, and Police clearance status nightly.
        </p>
      </Section>

      <div className="flex items-center justify-end gap-3">
        <button onClick={submit} disabled={submitting} className="btn btn-primary">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Submitting…" : "Submit deep KYC"}
        </button>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: any) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent-gold" />
        <div className="text-[14px] font-semibold">{title}</div>
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

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-md border border-line bg-bg-elev/40 px-3 py-2.5 text-[12px]">
      <span className="text-ink">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-amber-500" />
    </label>
  );
}
