"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { SECTOR_META } from "@/components/sector-icon";

const REGIONS = [
  "Greater Accra", "Ashanti", "Central", "Western", "Eastern", "Volta",
  "Northern", "Bono", "Upper East", "Upper West", "Oti", "Western North",
  "Bono East", "Ahafo", "Savannah", "North East",
];

const SECTOR_TEMPLATES: Record<string, { milestones: string[]; docs: string[]; trustee: string }> = {
  construction: {
    milestones: [
      "Site clearing + setting out",
      "Foundation + DPC",
      "Walls + lintels",
      "Decking",
      "Roofing",
      "Plastering + electrical",
      "Finishing + handover",
    ],
    docs: ["Building permit", "BOQ", "Site plan", "Architect drawings"],
    trustee: "Licensed Quantity Surveyor",
  },
  "real-estate": {
    milestones: [
      "Title due diligence (LC search)",
      "Site survey & boundary",
      "Indenture execution",
      "Registration + LC caveat",
    ],
    docs: ["Indenture", "Site plan (licensed surveyor)", "POA (notarised)", "Stool consent letter"],
    trustee: "Licensed Surveyor + Conveyancing Lawyer",
  },
  "vehicle-import": {
    milestones: [
      "Pre-shipment inspection",
      "Bill of Lading received",
      "Port arrival + GRA duty",
      "Yard release",
      "Inland delivery",
    ],
    docs: ["Bill of Lading", "Title / Pink Slip", "GRA duty receipt", "Clearing agent contract"],
    trustee: "Licensed Customs Clearing Agent",
  },
  business: {
    milestones: ["Premises secured", "Fit-out & inventory", "Opening", "Month-1 audit", "Month-3 audit"],
    docs: ["Lease", "Supplier invoices", "Stock list", "MoMo merchant proof"],
    trustee: "Auditor / Mystery shopper",
  },
  medical: {
    milestones: ["Admission", "Treatment plan", "Procedure", "Recovery", "Discharge"],
    docs: ["Itemised hospital bills", "Treatment plan", "Discharge summary"],
    trustee: "Medical Care Coordinator",
  },
  funeral: {
    milestones: ["Mortuary booking", "Family planning meeting", "Vendor contracts", "Burial", "Reconciliation"],
    docs: ["Mortuary receipts", "Vendor quotes", "Contributor ledger"],
    trustee: "Trustee for planning + reconciliation",
  },
  agriculture: {
    milestones: ["Land prep", "Inputs / feed", "Stocking", "Mid-cycle audit", "Harvest / sale"],
    docs: ["Lease", "Supplier invoices", "Stocking record", "Daily mortality ledger"],
    trustee: "Agricultural Extension Officer",
  },
  education: {
    milestones: ["Enrolment", "Fees term 1", "Books / uniforms", "Term reports"],
    docs: ["School portal receipts", "Attendance attestation", "Book quote"],
    trustee: "School liaison trustee",
  },
  remittance: {
    milestones: ["Send", "Receive confirmed", "Downstream receipt (within 7 days)"],
    docs: ["Bank / MoMo statement", "Downstream receipt"],
    trustee: "On-call audit (only if pattern detected)",
  },
};

export function WizardClient() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    sector: "construction",
    name: "",
    region: "Greater Accra",
    location: "",
    budgetGHS: 100000,
    target: "",
    managedBy: "",
    managedByRelation: "Brother",
    notes: "",
  });

  const template = SECTOR_TEMPLATES[form.sector];

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function next() { setStep((s) => Math.min(4, s + 1)); }
  function back() { setStep((s) => Math.max(1, s - 1)); }

  function submit() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  }

  if (submitted) {
    return (
      <div className="card mt-8 p-10 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-green/15 text-accent-green">
          <Check className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-[20px] font-semibold tracking-tight">Project initialised</h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-ink-dim">
          <strong className="text-ink">{form.name || "Untitled project"}</strong> is now under the
          verification umbrella. {template.milestones.length} milestones pre-loaded. We've notified
          {" "}<strong className="text-ink">{template.trustee}</strong> as a recommended trustee.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => router.push("/dashboard")} className="btn btn-primary">Open dashboard</button>
          <button onClick={() => router.push("/projects")} className="btn btn-ghost">All projects</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Steps current={step} />
      <div className="card mt-4 p-6">
        {step === 1 && (
          <div>
            <div className="text-[14px] font-semibold">Pick a sector</div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {Object.entries(SECTOR_META).map(([key, meta]) => {
                const Icon = (meta as any).icon;
                const selected = form.sector === key;
                return (
                  <button
                    key={key}
                    onClick={() => set("sector", key)}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                      selected ? "border-accent-gold bg-accent-gold/5" : "border-line bg-bg-elev/40 hover:border-line/70"
                    }`}
                  >
                    <div
                      className="grid h-9 w-9 place-items-center rounded-lg"
                      style={{ background: `${(meta as any).color}15`, border: `1px solid ${(meta as any).color}30` }}
                    >
                      <Icon size={18} style={{ color: (meta as any).color }} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold">{(meta as any).label}</div>
                      <div className="mt-0.5 text-[11px] text-ink-dim">
                        {SECTOR_TEMPLATES[key].milestones.length} milestone template
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-[14px] font-semibold">Project details</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Labeled label="Project name">
                <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. 4-bedroom family home" />
              </Labeled>
              <Labeled label="Region">
                <select className="input" value={form.region} onChange={(e) => set("region", e.target.value)}>
                  {REGIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Labeled>
              <Labeled label="Specific location">
                <input className="input" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Kasoa, Akweley Hills" />
              </Labeled>
              <Labeled label="Budget (GHS)">
                <input type="number" className="input" value={form.budgetGHS} onChange={(e) => set("budgetGHS", Number(e.target.value))} />
              </Labeled>
              <Labeled label="Target completion">
                <input type="date" className="input" value={form.target} onChange={(e) => set("target", e.target.value)} />
              </Labeled>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-[14px] font-semibold">Who's managing it on the ground?</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Labeled label="Name">
                <input className="input" value={form.managedBy} onChange={(e) => set("managedBy", e.target.value)} placeholder="e.g. Kwame Mensah" />
              </Labeled>
              <Labeled label="Relationship">
                <select className="input" value={form.managedByRelation} onChange={(e) => set("managedByRelation", e.target.value)}>
                  {["Brother","Sister","Cousin","Aunt","Uncle","Father","Mother","Friend","Contractor","Lawyer","Clearing Agent","Doctor","Other"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </Labeled>
              <Labeled label="Notes (optional)" full>
                <textarea rows={3} className="input resize-none" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Anything to flag from the start — past history, concerns, etc." />
              </Labeled>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-[14px] font-semibold">Review & launch</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Card title="Project">
                <Row k="Name" v={form.name || "—"} />
                <Row k="Sector" v={(SECTOR_META as any)[form.sector].label} />
                <Row k="Location" v={`${form.location || "—"} · ${form.region}`} />
                <Row k="Budget" v={`GHS ${form.budgetGHS.toLocaleString()}`} />
                <Row k="Target" v={form.target || "—"} />
              </Card>
              <Card title="Manager">
                <Row k="Name" v={form.managedBy || "—"} />
                <Row k="Relation" v={form.managedByRelation} />
                <Row k="Notes" v={form.notes || "—"} />
              </Card>
              <Card title={`${template.milestones.length} milestones (pre-loaded)`} full>
                <ol className="space-y-1 text-[12px]">
                  {template.milestones.map((m, i) => (
                    <li key={m} className="flex gap-2"><span className="text-ink-muted">M{i + 1}.</span><span className="text-ink">{m}</span></li>
                  ))}
                </ol>
              </Card>
              <Card title={`Required documents`}>
                <ul className="space-y-1 text-[12px]">
                  {template.docs.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-ink"><Check className="mt-0.5 h-3 w-3 text-accent-green" />{d}</li>
                  ))}
                </ul>
              </Card>
              <Card title="Recommended trustee">
                <div className="flex items-center gap-2 text-[13px]">
                  <ShieldCheck className="h-4 w-4 text-accent-gold" />
                  <span className="text-ink">{template.trustee}</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <button onClick={back} disabled={step === 1} className="btn btn-ghost disabled:opacity-40">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          {step < 4 ? (
            <button onClick={next} className="btn btn-primary">Continue <ArrowRight className="h-3.5 w-3.5" /></button>
          ) : (
            <button onClick={submit} disabled={submitting} className="btn btn-primary">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {submitting ? "Initialising…" : "Launch project"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Steps({ current }: { current: number }) {
  const labels = ["Sector", "Project", "Manager", "Review"];
  return (
    <div className="flex items-center gap-2 text-[11px]">
      {labels.map((l, i) => {
        const n = i + 1;
        return (
          <div key={l} className="flex items-center gap-2">
            <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold ${
              current >= n ? "bg-accent-gold text-bg" : "bg-bg-subtle text-ink-muted"
            }`}>{n}</span>
            <span className={current >= n ? "text-ink" : "text-ink-muted"}>{l}</span>
            {n < labels.length && <span className="h-px w-6 bg-line" />}
          </div>
        );
      })}
    </div>
  );
}

function Labeled({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      {children}
    </label>
  );
}

function Card({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`rounded-xl border border-line bg-bg-elev/40 p-4 ${full ? "md:col-span-2" : ""}`}>
      <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{title}</div>
      <div className="space-y-1.5 text-[13px]">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ink-muted">{k}</span>
      <span className="ml-3 max-w-[68%] text-right text-ink">{v}</span>
    </div>
  );
}
