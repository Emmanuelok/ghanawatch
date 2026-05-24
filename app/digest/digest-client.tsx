"use client";
import { useState } from "react";
import {
  Mail,
  MessageCircle,
  Phone,
  Hash,
  Plus,
  Trash2,
  Send,
  Bell,
  Calendar,
  Clock,
  Eye,
  Save,
  Check,
  ShieldAlert,
} from "lucide-react";
import { PROJECTS } from "@/lib/mock-data";

type Channel = "email" | "sms" | "whatsapp" | "slack" | "push";
type Trigger =
  | "any-critical-alert"
  | "doc-score-below"
  | "off-site-photo"
  | "trustee-report-uploaded"
  | "milestone-ready-to-sign"
  | "weekly-summary"
  | "ledger-daily"
  | "case-decided";

type Rule = {
  id: string;
  trigger: Trigger;
  threshold?: number;
  channel: Channel;
  contact: string;
  active: boolean;
  schedule?: string;
};

const TRIGGER_LABEL: Record<Trigger, string> = {
  "any-critical-alert": "Any critical alert opens",
  "doc-score-below": "Document authenticity drops below…",
  "off-site-photo": "Off-site photo flagged",
  "trustee-report-uploaded": "Trustee report uploaded",
  "milestone-ready-to-sign": "Milestone ready for your biometric sign-off",
  "weekly-summary": "Weekly portfolio summary",
  "ledger-daily": "Daily audit ledger digest",
  "case-decided": "Forensic case status changes",
};

const CHANNEL_ICON = {
  email: Mail,
  sms: Phone,
  whatsapp: MessageCircle,
  slack: Hash,
  push: Bell,
} as const;

const DEFAULT_RULES: Rule[] = [
  { id: "r-1", trigger: "any-critical-alert", channel: "sms", contact: "+1 416 555 0142", active: true },
  { id: "r-2", trigger: "any-critical-alert", channel: "whatsapp", contact: "+1 416 555 0142", active: true },
  { id: "r-3", trigger: "doc-score-below", threshold: 70, channel: "email", contact: "akosua@example.com", active: true },
  { id: "r-4", trigger: "off-site-photo", channel: "push", contact: "iPhone (Akosua)", active: true },
  { id: "r-5", trigger: "weekly-summary", channel: "email", contact: "akosua@example.com", active: true, schedule: "Sundays 9:00 Toronto" },
  { id: "r-6", trigger: "ledger-daily", channel: "slack", contact: "#kasoa-build (Family GTA)", active: false, schedule: "07:30 Toronto daily" },
];

export function DigestBuilder() {
  const [rules, setRules] = useState<Rule[]>(DEFAULT_RULES);
  const [scope, setScope] = useState<string>("all");
  const [saved, setSaved] = useState(false);

  function addRule() {
    setRules((rs) => [
      ...rs,
      { id: `r-${Date.now()}`, trigger: "any-critical-alert", channel: "email", contact: "", active: true },
    ]);
  }
  function update<K extends keyof Rule>(id: string, k: K, v: Rule[K]) {
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r)));
  }
  function remove(id: string) {
    setRules((rs) => rs.filter((r) => r.id !== id));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-semibold">Scope</div>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="rounded-md border border-line bg-bg-elev px-2 py-1 text-[12px] text-ink outline-none"
            >
              <option value="all">All my projects (portfolio-wide)</option>
              {PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <div className="text-[14px] font-semibold">Rules ({rules.length})</div>
            <button onClick={addRule} className="btn btn-ghost text-[12px] py-1.5"><Plus className="h-3.5 w-3.5" /> Add rule</button>
          </div>
          <div className="divide-y divide-line">
            {rules.map((r) => {
              const Icon = CHANNEL_ICON[r.channel];
              return (
                <div key={r.id} className="grid items-start gap-3 px-5 py-4 md:grid-cols-[1fr_1fr_auto]">
                  <div className="space-y-2">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Trigger</div>
                    <select
                      value={r.trigger}
                      onChange={(e) => update(r.id, "trigger", e.target.value as Trigger)}
                      className="input"
                    >
                      {(Object.keys(TRIGGER_LABEL) as Trigger[]).map((t) => (
                        <option key={t} value={t}>{TRIGGER_LABEL[t]}</option>
                      ))}
                    </select>
                    {r.trigger === "doc-score-below" && (
                      <div className="flex items-center gap-2 text-[12px]">
                        <span className="text-ink-muted">Threshold (%):</span>
                        <input
                          type="number"
                          min="10"
                          max="95"
                          value={r.threshold ?? 70}
                          onChange={(e) => update(r.id, "threshold", Number(e.target.value))}
                          className="input max-w-[100px] py-1.5"
                        />
                      </div>
                    )}
                    {(r.trigger === "weekly-summary" || r.trigger === "ledger-daily") && (
                      <div className="flex items-center gap-2 text-[12px] text-ink-muted">
                        <Calendar className="h-3 w-3" />
                        <input
                          value={r.schedule ?? ""}
                          onChange={(e) => update(r.id, "schedule", e.target.value)}
                          placeholder="e.g. Sundays 9:00 Toronto"
                          className="input py-1.5 text-[12px]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Channel</div>
                    <div className="flex items-center gap-1">
                      {(["email", "sms", "whatsapp", "push", "slack"] as Channel[]).map((c) => {
                        const I = CHANNEL_ICON[c];
                        const active = r.channel === c;
                        return (
                          <button
                            key={c}
                            onClick={() => update(r.id, "channel", c)}
                            className={`grid h-8 w-8 place-items-center rounded-md ${
                              active ? "bg-accent-gold/15 text-accent-gold border border-accent-gold/30" : "border border-line bg-bg-elev text-ink-dim hover:text-ink"
                            }`}
                            title={c}
                          >
                            <I className="h-3.5 w-3.5" />
                          </button>
                        );
                      })}
                    </div>
                    <input
                      value={r.contact}
                      onChange={(e) => update(r.id, "contact", e.target.value)}
                      placeholder={r.channel === "email" ? "you@example.com" : r.channel === "slack" ? "#channel" : "+1…"}
                      className="input py-1.5"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex cursor-pointer items-center gap-2 text-[12px] text-ink-dim">
                      <input type="checkbox" checked={r.active} onChange={(e) => update(r.id, "active", e.target.checked)} className="h-4 w-4 accent-amber-500" />
                      Active
                    </label>
                    <button onClick={() => remove(r.id)} className="grid h-8 w-8 place-items-center rounded-md text-ink-muted hover:bg-bg-elev hover:text-risk-high">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {saved && <span className="inline-flex items-center gap-1.5 text-[12px] text-accent-green"><Check className="h-3.5 w-3.5" /> Saved</span>}
          <button onClick={save} className="btn btn-primary"><Save className="h-4 w-4" /> Save rules</button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Eye className="h-4 w-4 text-accent-gold" /> Preview — what arrives</div>
          <DigestPreview />
        </div>

        <div className="card p-5">
          <div className="mb-3 text-[14px] font-semibold">Smart rules already running</div>
          <ul className="space-y-2 text-[12px] text-ink-dim">
            <li className="flex items-start gap-2"><Bell className="mt-0.5 h-3 w-3 shrink-0 text-accent-gold" />Critical alerts bypass Do-Not-Disturb on iOS / Android.</li>
            <li className="flex items-start gap-2"><Bell className="mt-0.5 h-3 w-3 shrink-0 text-accent-gold" />SMS auto-retries 3× if delivery report fails (Ghana network coverage).</li>
            <li className="flex items-start gap-2"><Bell className="mt-0.5 h-3 w-3 shrink-0 text-accent-gold" />WhatsApp uses the verified GhanaWatch business number.</li>
            <li className="flex items-start gap-2"><Bell className="mt-0.5 h-3 w-3 shrink-0 text-accent-gold" />Slack messages link to a one-click "approve milestone" deep link.</li>
            <li className="flex items-start gap-2"><Bell className="mt-0.5 h-3 w-3 shrink-0 text-accent-gold" />Email digests embed signed hash references so you can verify offline.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function DigestPreview() {
  return (
    <div className="rounded-lg border border-line bg-bg-elev/60 p-4 text-[12px]">
      <div className="flex items-center gap-2 border-b border-line pb-2">
        <Mail className="h-4 w-4 text-accent-gold" />
        <div>
          <div className="text-[12px] font-semibold text-ink">GhanaWatch Weekly · Sunday May 24, 2026</div>
          <div className="text-[10px] text-ink-muted">akosua@example.com · digest #43 · hash 0xab12…f8c4</div>
        </div>
      </div>
      <div className="space-y-3 pt-3 text-[12px] text-ink-dim">
        <p>Akosua — your portfolio summary for the week of May 17 – 24, 2026:</p>
        <div className="rounded-md border border-line bg-bg-elev/40 p-3">
          <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Trust score</div>
          <div className="text-[18px] font-semibold text-ink">73 <span className="text-[11px] text-ink-muted">(↓ 3 vs last week)</span></div>
        </div>
        <ul className="space-y-1.5">
          <li className="flex items-start gap-2"><Clock className="mt-0.5 h-3 w-3 shrink-0 text-risk-high" />🚨 Off-site photo flagged on Kasoa build — 1.18 km from parcel.</li>
          <li className="flex items-start gap-2"><Clock className="mt-0.5 h-3 w-3 shrink-0 text-risk-med" />⚠ Cement receipt forensics: 41% (font + pixel tampering).</li>
          <li className="flex items-start gap-2"><Clock className="mt-0.5 h-3 w-3 shrink-0 text-accent-green" />✓ Milestone 4 verified by Trustee Kojo Owusu (drone + 6 ground angles).</li>
          <li className="flex items-start gap-2"><Clock className="mt-0.5 h-3 w-3 shrink-0 text-ink-muted" />· 217 ledger events committed, chain integrity intact.</li>
        </ul>
        <p className="text-[11px] text-ink-muted">2 actions need your sign-off — open the app to approve.</p>
      </div>
    </div>
  );
}
