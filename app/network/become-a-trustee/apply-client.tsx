"use client";
import { useState } from "react";
import { Check, Loader2, Award } from "lucide-react";

const PROFESSIONS = [
  "Quantity Surveyor",
  "Licensed Land Surveyor",
  "Conveyancing Lawyer",
  "Customs Clearing Agent",
  "Medical Care Coordinator",
  "Agricultural Extension Officer",
  "Civil Engineer",
  "Architect",
];

const REGULATORS: Record<string, string> = {
  "Quantity Surveyor": "Ghana Institution of Surveyors",
  "Licensed Land Surveyor": "Ghana Institution of Surveyors",
  "Conveyancing Lawyer": "General Legal Council",
  "Customs Clearing Agent": "GRA / Customs Division",
  "Medical Care Coordinator": "Medical & Dental Council",
  "Agricultural Extension Officer": "Ministry of Food & Agriculture",
  "Civil Engineer": "Engineering Council of Ghana",
  "Architect": "Architects Registration Council",
};

export function TrusteeApplyClient() {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState(PROFESSIONS[0]);
  const [licenseNo, setLicenseNo] = useState("");
  const [years, setYears] = useState(8);
  const [region, setRegion] = useState("Greater Accra");
  const [phone, setPhone] = useState("+233 ");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1100);
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-green/15 text-accent-green">
          <Check className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-[18px] font-semibold">Application received</h2>
        <p className="mx-auto mt-2 max-w-md text-[13px] text-ink-dim">
          Welcome to the pipeline, {name}. We'll verify your license with{" "}
          <strong className="text-ink">{REGULATORS[profession]}</strong> within 5 business days and
          email you the skill-test brief. The full process typically takes 18 days.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Award className="h-4 w-4 text-accent-gold" /> Apply now</div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="As on your professional license" /></Field>
        <Field label="Profession">
          <select value={profession} onChange={(e) => setProfession(e.target.value)} className="input">
            {PROFESSIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="License authority">
          <input readOnly value={REGULATORS[profession]} className="input opacity-70" />
        </Field>
        <Field label="License number"><input value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} className="input" placeholder="e.g. GhIS-2017-441" /></Field>
        <Field label="Years of practice">
          <input type="range" min="2" max="40" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full" />
          <div className="text-[12px] text-ink-dim">{years} years</div>
        </Field>
        <Field label="Primary region">
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="input">
            {["Greater Accra", "Ashanti", "Central", "Western", "Eastern", "Volta", "Northern", "Bono", "Upper East", "Upper West"].map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Mobile number"><input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" /></Field>
      </div>
      <button onClick={submit} disabled={submitting || !name || !licenseNo} className="btn btn-primary mt-5 w-full justify-center disabled:opacity-40">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
        {submitting ? "Submitting…" : "Submit application"}
      </button>
      <p className="mt-3 text-[11px] text-ink-muted">
        By submitting you consent to GhanaWatch contacting your regulator and 2 referees, and to a
        Ghana Police clearance check. Application fee: free. Approval is at GhanaWatch's discretion.
      </p>
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
