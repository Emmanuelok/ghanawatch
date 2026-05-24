"use client";
import { useMemo, useState } from "react";
import { Mail, ShieldAlert, ShieldCheck, AlertTriangle, Loader2, FileSearch } from "lucide-react";

const SAMPLE = `From: lawyer.kwame@lands-commission-gh.com
Subject: URGENT: Your East Legon plot title transfer

Dear Mr. Boateng,

Greetings from Accra. I am writing on behalf of the Lands Commission. Our records show that there is a third-party claim being processed on your East Legon Hills plot (Vol 2024/Folio 188). To prevent the transfer, you must immediately pay the protective filing fee of GHS 18,500 today.

Please send the funds via MTN MoMo to the merchant number below. Time is of the essence.

MoMo: 024 559 1188 (Lands Commission Office — Accra)

Send confirmation by reply email.

Regards,
Barr. Kwame Owusu
Senior Land Officer
Lands Commission, Accra`;

type Score = {
  verdict: "safe" | "suspicious" | "fraud";
  authenticity: number;
  signals: { label: string; severity: "info" | "warning" | "critical"; detail: string }[];
  archetype?: string;
  recommendation: string;
};

function analyse(text: string): Score {
  const t = text.toLowerCase();
  const signals: Score["signals"] = [];
  let score = 90;

  // Domain check
  const fromMatch = text.match(/From:\s*([^\n]+)/i);
  if (fromMatch && /lands-commission-gh\.com|landscommissiongh|lcgh|ghanalands/.test(fromMatch[1].toLowerCase())) {
    signals.push({ label: "Look-alike domain", severity: "critical", detail: "The domain mimics Lands Commission but the real LC uses lc.gov.gh. Likely typosquatting." });
    score -= 30;
  }
  if (fromMatch && /\.(gov\.gh)/.test(fromMatch[1])) {
    signals.push({ label: "Government domain — superficially OK", severity: "info", detail: "Sender uses a .gov.gh address. Verify by calling the LC directly on +233 30 268 1444 — never trust the email's contact details alone." });
  }

  // Urgency
  if (/\b(urgent|today|immediately|right now|asap)\b/.test(t)) {
    signals.push({ label: "Urgency / time pressure", severity: "warning", detail: "Classic fraud cue. Genuine LC processes do not collapse to a same-day deadline." });
    score -= 14;
  }

  // Money request
  if (/(ghs|gh¢|cedis?)\s*\d/.test(t)) {
    signals.push({ label: "Explicit money ask in the body", severity: "warning", detail: "A cedi amount is named in the body — no legitimate LC notice asks for payment via email." });
    score -= 12;
  }

  // MoMo to personal number
  if (/momo:?\s*[0-9 -]{8,}/.test(t)) {
    signals.push({ label: "MoMo to a phone number", severity: "critical", detail: "Real institutional payments go to merchant codes or bank accounts — never to a personal MoMo number." });
    score -= 22;
  }

  // Lands Commission specific patterns
  if (t.includes("lands commission") || t.includes("title transfer")) {
    signals.push({ label: "Lands Commission topic", severity: "info", detail: "If genuine, the LC would issue a written notice via post or your registered lawyer, not email." });
  }

  if (t.includes("protective filing fee") || t.includes("processing fee") || t.includes("caveat fee")) {
    signals.push({ label: "Synthetic fee name", severity: "critical", detail: "\"Protective filing fee\" is not an LC fee category. This phrasing is a known scam signature." });
    score -= 18;
  }

  // Generic greeting / poor formatting
  if (/dear (mr|mrs|miss|sir|madam)/.test(t)) {
    signals.push({ label: "Generic salutation", severity: "info", detail: "Mass-mailing pattern. Real LC correspondence cites your file number." });
  }

  // Encouraging reply
  if (t.includes("send confirmation by reply") || t.includes("reply to this email")) {
    signals.push({ label: "Reply-to harvest pattern", severity: "warning", detail: "The 'reply for confirmation' line is bait to start a multi-message social-engineering thread." });
    score -= 8;
  }

  score = Math.max(0, Math.min(100, score));
  const verdict: Score["verdict"] = score >= 75 ? "safe" : score >= 40 ? "suspicious" : "fraud";

  const archetype =
    verdict === "fraud"
      ? "Land/title impersonation fraud — Lands Commission look-alike"
      : verdict === "suspicious"
      ? "Possible advance-fee fraud variant"
      : undefined;

  const recommendation =
    verdict === "fraud"
      ? "Do not reply. Do not pay. Forward to GhanaWatch case-open queue; we'll dispatch a trustee to confirm with the actual Lands Commission desk and file a SAR. Block the sender."
      : verdict === "suspicious"
      ? "Don't act on it yet. Call the agency on a number you find independently (not the one in the email)."
      : "No obvious fraud signals. Still verify the sender via a second channel before transacting.";

  return { verdict, authenticity: score, signals, archetype, recommendation };
}

export function EmailForensicsClient() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Score | null>(null);

  function run() {
    setLoading(true);
    setTimeout(() => {
      setResult(analyse(text));
      setLoading(false);
    }, 700);
  }

  const color = result?.verdict === "fraud" ? "#ef4444" : result?.verdict === "suspicious" ? "#f59e0b" : "#10b981";

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Mail className="h-4 w-4 text-accent-gold" /> The email</div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={18}
          placeholder="Paste the full email — headers, body, signatures."
          className="input resize-none font-mono text-[12px]"
        />
        <div className="mt-3 flex items-center gap-2">
          <button onClick={run} disabled={loading || !text.trim()} className="btn btn-primary disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}
            {loading ? "Analysing…" : "Run forensic analysis"}
          </button>
          <button onClick={() => { setText(SAMPLE); setResult(null); }} className="btn btn-ghost text-[12px] py-1.5">Load sample</button>
        </div>
      </div>

      <div className="space-y-4">
        {!result && (
          <div className="card grid place-items-center px-6 py-16 text-center text-[13px] text-ink-dim">
            Paste an email on the left or load the sample to see the analysis.
          </div>
        )}
        {result && (
          <>
            <div className="card p-5">
              <div className="flex items-center gap-2">
                <div
                  className="grid h-10 w-10 place-items-center rounded-lg"
                  style={{ background: `${color}15`, color }}
                >
                  {result.verdict === "safe" ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Verdict</div>
                  <div className="text-[20px] font-semibold capitalize" style={{ color }}>{result.verdict} · {result.authenticity}%</div>
                </div>
              </div>
              {result.archetype && (
                <div className="mt-3 rounded-md border border-line bg-bg-elev/40 p-3 text-[12.5px] text-ink">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Archetype</span>
                  <div>{result.archetype}</div>
                </div>
              )}
            </div>

            <div className="card p-5">
              <div className="mb-3 text-[14px] font-semibold">Signals detected ({result.signals.length})</div>
              <div className="space-y-3">
                {result.signals.map((s, i) => {
                  const c = s.severity === "critical" ? "#ef4444" : s.severity === "warning" ? "#f59e0b" : "#9aa0b0";
                  return (
                    <div key={i} className="rounded-md border border-line bg-bg-elev/40 p-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5" style={{ color: c }} />
                        <span className="text-[12.5px] font-semibold text-ink">{s.label}</span>
                        <span className="ml-auto chip uppercase text-[10px]" style={{ color: c, borderColor: `${c}30` }}>{s.severity}</span>
                      </div>
                      <p className="mt-1 text-[11.5px] text-ink-dim">{s.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card p-5">
              <div className="mb-1 text-[14px] font-semibold">Recommendation</div>
              <p className="text-[13px] text-ink-dim">{result.recommendation}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
