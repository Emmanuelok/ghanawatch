"use client";
import { useState } from "react";
import { X, ShieldCheck, Check, Loader2, MapPin, Camera, Ruler, FileText } from "lucide-react";
import { TRUSTEES } from "@/lib/mock-data";
import type { Trustee } from "@/lib/types";

const SCOPES = [
  { id: "photos", label: "Geo-stamped site photos (4+ angles)", icon: Camera, hours: 2 },
  { id: "drone", label: "Drone overhead survey", icon: Camera, hours: 3 },
  { id: "boundary", label: "Boundary measurement + GPS corners", icon: Ruler, hours: 4 },
  { id: "boq", label: "BOQ-vs-on-site material reconciliation", icon: FileText, hours: 5 },
  { id: "interview", label: "Manager interview + signed statement", icon: FileText, hours: 2 },
];

export function DispatchModal({
  open,
  onClose,
  trustee: initial,
  projectName,
}: {
  open: boolean;
  onClose: () => void;
  trustee?: Trustee;
  projectName?: string;
}) {
  const [step, setStep] = useState(1);
  const [trustee, setTrustee] = useState<Trustee | undefined>(initial);
  const [scope, setScope] = useState<string[]>(["photos"]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const t = trustee ?? initial ?? TRUSTEES[0];
  const totalHours = scope.reduce((s, id) => s + (SCOPES.find((x) => x.id === id)?.hours ?? 0), 0);
  const estimateGHS = 600 + scope.length * 450;

  function submit() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1100);
  }

  function close() {
    setTimeout(() => {
      setStep(1);
      setSubmitted(false);
      setNotes("");
      setScope(["photos"]);
    }, 200);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-[min(680px,96vw)] overflow-hidden rounded-2xl border border-line bg-bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <div className="text-[15px] font-semibold">Dispatch a trustee</div>
            {projectName && <div className="text-[12px] text-ink-dim">{projectName}</div>}
          </div>
          <button onClick={close} className="grid h-8 w-8 place-items-center rounded-md text-ink-dim hover:bg-bg-elev">
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-green/15 text-accent-green">
              <Check className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-[18px] font-semibold">Dispatch confirmed</h3>
            <p className="mx-auto mt-2 max-w-md text-[13px] text-ink-dim">
              {t.name} has been notified. They typically respond within {t.responseHours}h. You'll see
              the geo-stamped evidence and signed report appear in this project's audit ledger as
              soon as it's uploaded.
            </p>
            <button onClick={close} className="btn btn-primary mt-6">Done</button>
          </div>
        ) : (
          <>
            <Steps current={step} />

            {step === 1 && (
              <div className="p-5">
                <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Selected trustee</div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {TRUSTEES.filter((x) => x.availableNow)
                    .slice(0, 3)
                    .map((cand) => (
                      <button
                        key={cand.id}
                        onClick={() => setTrustee(cand)}
                        className={`text-left rounded-xl border p-4 transition-colors ${
                          t.id === cand.id
                            ? "border-accent-gold bg-accent-gold/5"
                            : "border-line bg-bg-elev/40 hover:border-line/80"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-accent-gold to-accent-green text-[12px] font-semibold text-bg">
                            {cand.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-semibold">{cand.name}</div>
                            <div className="truncate text-[11px] text-ink-dim">{cand.profession}</div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[11px]">
                          <span className="text-ink-muted">★ {cand.rating}</span>
                          <span className="text-accent-green">~{cand.responseHours}h response</span>
                        </div>
                      </button>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setStep(2)} className="btn btn-primary">Next: scope</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-5">
                <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Scope of visit</div>
                <div className="mt-3 space-y-2">
                  {SCOPES.map((s) => {
                    const checked = scope.includes(s.id);
                    const Icon = s.icon;
                    return (
                      <label
                        key={s.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                          checked ? "border-accent-gold/50 bg-accent-gold/5" : "border-line bg-bg-elev/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setScope((cur) =>
                              cur.includes(s.id) ? cur.filter((x) => x !== s.id) : [...cur, s.id],
                            )
                          }
                          className="h-4 w-4 accent-amber-500"
                        />
                        <Icon className="h-4 w-4 text-ink-muted" />
                        <span className="flex-1 text-[13px]">{s.label}</span>
                        <span className="text-[11px] text-ink-muted">~{s.hours}h</span>
                      </label>
                    );
                  })}
                </div>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Anything specific the trustee should check / photograph?"
                  className="input mt-4 resize-none"
                />

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-[12px] text-ink-dim">
                    Estimate: <span className="font-semibold text-ink">GHS {estimateGHS.toLocaleString()}</span>{" "}
                    · {totalHours}h on site
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setStep(1)} className="btn btn-ghost">Back</button>
                    <button onClick={() => setStep(3)} disabled={scope.length === 0} className="btn btn-primary disabled:opacity-50">
                      Next: review
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="p-5">
                <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Review & confirm</div>
                <div className="mt-3 space-y-3 rounded-xl border border-line bg-bg-elev/40 p-4 text-[13px]">
                  <Row label="Trustee" value={`${t.name} (${t.profession})`} />
                  <Row label="Scope" value={scope.map((id) => SCOPES.find((s) => s.id === id)?.label).join(", ")} />
                  <Row label="Notes" value={notes || "—"} />
                  <Row label="ETA" value={`Within ${t.responseHours}h response, typically <72h on-site`} />
                  <Row label="Estimate" value={`GHS ${estimateGHS.toLocaleString()}`} />
                  <Row label="Escrow" value="Fee held in escrow; released on your sign-off of the report" />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => setStep(2)} className="btn btn-ghost">Back</button>
                  <button onClick={submit} disabled={submitting} className="btn btn-primary">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    {submitting ? "Dispatching…" : "Confirm dispatch"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Steps({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 border-b border-line bg-bg-elev/40 px-5 py-3 text-[11px]">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-2">
          <span
            className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold ${
              current >= n ? "bg-accent-gold text-bg" : "bg-bg-subtle text-ink-muted"
            }`}
          >
            {n}
          </span>
          <span className={current >= n ? "text-ink" : "text-ink-muted"}>
            {n === 1 ? "Trustee" : n === 2 ? "Scope" : "Review"}
          </span>
          {n < 3 && <span className="h-px w-8 bg-line" />}
        </div>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-ink-muted">{label}</span>
      <span className="max-w-[68%] text-right text-ink">{value}</span>
    </div>
  );
}
