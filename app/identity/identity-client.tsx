"use client";
import { useState, useEffect } from "react";
import {
  Check,
  Loader2,
  Camera,
  IdCard,
  Phone,
  ShieldCheck,
  ScanFace,
  Building2,
  Globe,
  FileSearch,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5;

export function IdentityClient() {
  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState(false);

  // Form fields
  const [idType, setIdType] = useState("ghana-card");
  const [idNumber, setIdNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("Ghana");
  const [phone, setPhone] = useState("+233 ");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [livenessState, setLivenessState] = useState<"idle" | "starting" | "active" | "done">("idle");
  const [livenessMatch, setLivenessMatch] = useState<number | null>(null);
  const [addrUploaded, setAddrUploaded] = useState(false);
  const [amlState, setAmlState] = useState<"idle" | "checking" | "clear" | "issue">("idle");

  // Liveness animation
  useEffect(() => {
    if (livenessState !== "active") return;
    const t = setTimeout(() => {
      setLivenessState("done");
      setLivenessMatch(97);
    }, 2400);
    return () => clearTimeout(t);
  }, [livenessState]);

  // AML simulation
  useEffect(() => {
    if (amlState !== "checking") return;
    const t = setTimeout(() => setAmlState("clear"), 1600);
    return () => clearTimeout(t);
  }, [amlState]);

  function sendOtp() {
    setOtpSent(true);
    setOtp("");
  }
  function verifyOtp() {
    setOtpVerifying(true);
    setTimeout(() => setOtpVerifying(false), 900);
  }

  const canNext: Record<Step, boolean> = {
    1: idType.length > 0 && idNumber.length >= 8 && fullName.length > 2 && dob.length > 0,
    2: livenessState === "done",
    3: otpSent && otp.length === 6 && !otpVerifying,
    4: addrUploaded,
    5: amlState === "clear",
  };

  function next() {
    if (step < 5) setStep((s) => (s + 1) as Step);
    else setDone(true);
  }

  if (done) {
    return (
      <div className="mt-8 card p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-green/15 text-accent-green">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Identity verified ✓</h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-ink-dim">
          You now have <strong className="text-ink">Enhanced KYC</strong> status — sufficient for
          escrow up to GHS 5,000,000 per project. You can manage your verification anytime from
          Settings.
        </p>
        <div className="mt-6 grid gap-2 rounded-lg border border-line bg-bg-elev/40 p-4 text-left text-[12px]">
          <Row k="Name on file" v={fullName} />
          <Row k="ID type" v={idType.replace("-", " ")} />
          <Row k="ID number" v={`${idNumber.slice(0, 4)}••••${idNumber.slice(-4)}`} />
          <Row k="Phone" v={phone} />
          <Row k="Liveness match" v={`${livenessMatch ?? "—"}%`} />
          <Row k="AML / PEP / sanctions" v="Clear" />
          <Row k="Verification level" v="Enhanced" />
          <Row k="Expires" v="2027-05-24" />
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
            <div className="flex items-center gap-2"><IdCard className="h-4 w-4 text-accent-gold" /><div className="text-[14px] font-semibold">Government-issued ID</div></div>
            <p className="mt-1 text-[12px] text-ink-dim">Ghana Card is preferred. Passport or driver's licence also accepted.</p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Field label="ID type">
                <select value={idType} onChange={(e) => setIdType(e.target.value)} className="input">
                  <option value="ghana-card">Ghana Card</option>
                  <option value="passport">Passport</option>
                  <option value="drivers-license">Driver's licence</option>
                  <option value="voter-id">Voter ID</option>
                </select>
              </Field>
              <Field label="ID number">
                <input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder={idType === "ghana-card" ? "GHA-XXXXXXXXX-X" : "Passport number"} className="input" />
              </Field>
              <Field label="Full name (as on ID)">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="As printed on the card" className="input" />
              </Field>
              <Field label="Date of birth">
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="input" />
              </Field>
              <Field label="Nationality">
                <select value={nationality} onChange={(e) => setNationality(e.target.value)} className="input">
                  {["Ghana", "Nigeria", "United Kingdom", "Canada", "United States", "Germany", "Australia", "France", "Italy", "Netherlands", "Other"].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Field>
              <Field label="Upload ID photo">
                <button className="input flex items-center justify-between gap-2 text-left">
                  <span className="text-ink-dim">Front of card / passport bio page</span>
                  <Camera className="h-4 w-4 text-ink-muted" />
                </button>
              </Field>
            </div>
            <p className="mt-3 text-[11px] text-ink-muted">
              We run OCR + chip-data check (where supported by Ghana Card). The image is encrypted
              at rest and not used for training.
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center gap-2"><ScanFace className="h-4 w-4 text-accent-gold" /><div className="text-[14px] font-semibold">Selfie + liveness check</div></div>
            <p className="mt-1 text-[12px] text-ink-dim">Look at the camera, then slowly turn your head left, then right. We match your face against the ID photo (target ≥85%).</p>

            <div className="mt-5 grid place-items-center">
              <div className="relative grid h-56 w-56 place-items-center rounded-full border-2 border-accent-gold/50 bg-bg-elev/40">
                {livenessState === "idle" && <Camera className="h-10 w-10 text-ink-muted" />}
                {livenessState === "starting" && <Loader2 className="h-10 w-10 animate-spin text-accent-gold" />}
                {livenessState === "active" && (
                  <div className="grid place-items-center">
                    <div className="absolute inset-0 animate-pulse rounded-full border-4 border-accent-gold/30" />
                    <ScanFace className="h-12 w-12 text-accent-gold" />
                    <div className="mt-2 text-[11px] text-ink-dim">Turn your head…</div>
                  </div>
                )}
                {livenessState === "done" && (
                  <div className="grid place-items-center text-accent-green">
                    <Check className="h-12 w-12" />
                    <div className="mt-2 text-[13px] font-semibold">Match {livenessMatch}%</div>
                  </div>
                )}
              </div>
              {livenessState === "idle" && (
                <button
                  onClick={() => { setLivenessState("starting"); setTimeout(() => setLivenessState("active"), 600); }}
                  className="btn btn-primary mt-5"
                >
                  Start liveness check
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent-gold" /><div className="text-[14px] font-semibold">Phone verification</div></div>
            <p className="mt-1 text-[12px] text-ink-dim">We send a 6-digit code by SMS. This is the number we'll use for critical alerts.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Field label="Mobile number">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="+233 24 ..." />
              </Field>
              <div className="flex items-end">
                <button onClick={sendOtp} disabled={phone.length < 10} className="btn btn-ghost disabled:opacity-40">
                  {otpSent ? "Resend code" : "Send code"}
                </button>
              </div>
            </div>
            {otpSent && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Field label="6-digit code">
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="······"
                    className="input tracking-[0.6em] text-center"
                  />
                </Field>
                <div className="flex items-end">
                  <button onClick={verifyOtp} disabled={otp.length !== 6 || otpVerifying} className="btn btn-primary disabled:opacity-40">
                    {otpVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {otpVerifying ? "Verifying…" : "Verify"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-accent-gold" /><div className="text-[14px] font-semibold">Proof of address</div></div>
            <p className="mt-1 text-[12px] text-ink-dim">A utility bill, bank statement, or government letter dated within the last 3 months.</p>
            <div className="mt-4">
              <button
                onClick={() => setAddrUploaded(true)}
                className={`grid w-full place-items-center rounded-xl border-2 border-dashed p-10 transition-colors ${
                  addrUploaded ? "border-accent-green/40 bg-accent-green/5 text-accent-green" : "border-line bg-bg-elev/40 text-ink-dim"
                }`}
              >
                {addrUploaded ? <><Check className="h-8 w-8" /><div className="mt-2 text-[13px]">utility-bill-2026-03.pdf uploaded</div></> : <><Camera className="h-8 w-8" /><div className="mt-2 text-[13px]">Click to upload</div></>}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <div className="flex items-center gap-2"><FileSearch className="h-4 w-4 text-accent-gold" /><div className="text-[14px] font-semibold">AML · PEP · sanctions screen</div></div>
            <p className="mt-1 text-[12px] text-ink-dim">We check your name against the OFAC SDN, UN Consolidated, UK HMT, EU CFSP, FATF and Ghana-specific watchlists. This typically completes in seconds.</p>

            {amlState === "idle" && (
              <button onClick={() => setAmlState("checking")} className="btn btn-primary mt-5"><Globe className="h-4 w-4" /> Run screening</button>
            )}
            {amlState === "checking" && (
              <div className="mt-5 grid place-items-center rounded-xl border border-line bg-bg-elev/40 py-10 text-[13px] text-ink-dim">
                <Loader2 className="mb-3 h-6 w-6 animate-spin text-accent-gold" />
                Running against 7 watchlists…
              </div>
            )}
            {amlState === "clear" && (
              <div className="mt-5 rounded-xl border border-accent-green/30 bg-accent-green/5 p-5">
                <div className="flex items-center gap-2 text-[14px] font-semibold text-accent-green">
                  <Check className="h-4 w-4" /> Clear on all 7 watchlists
                </div>
                <ul className="mt-3 grid grid-cols-2 gap-1 text-[11px] text-ink-dim">
                  {["OFAC SDN", "UN Consolidated", "UK HMT", "EU CFSP", "FATF", "PEP global", "Ghana sanctions index"].map((w) => (
                    <li key={w} className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-accent-green" /> {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <button onClick={() => setStep((s) => Math.max(1, s - 1) as Step)} disabled={step === 1} className="btn btn-ghost disabled:opacity-40">Back</button>
          <button onClick={next} disabled={!canNext[step]} className="btn btn-primary disabled:opacity-50">
            {step === 5 ? "Complete verification" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Steps({ current }: { current: number }) {
  const labels = ["ID", "Liveness", "Phone", "Address", "AML"];
  return (
    <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ink-muted">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}
