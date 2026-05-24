"use client";
import { useState } from "react";
import { User, Bell, KeyRound, Globe, ShieldCheck, Save, Check } from "lucide-react";

type Tab = "profile" | "notifications" | "security" | "preferences" | "api";

export function SettingsClient() {
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  function save() { setSaved(true); setTimeout(() => setSaved(false), 1500); }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[200px_1fr]">
      <aside className="space-y-1">
        {([
          ["profile", "Profile", User],
          ["notifications", "Notifications", Bell],
          ["security", "Security", ShieldCheck],
          ["preferences", "Preferences", Globe],
          ["api", "API & integrations", KeyRound],
        ] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id as Tab)}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] ${
              tab === id ? "bg-bg-elev text-ink" : "text-ink-dim hover:bg-bg-elev/50 hover:text-ink"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </aside>

      <div className="card p-6">
        {tab === "profile" && (
          <Section title="Profile">
            <Field label="Full name" defaultValue="Akosua Mensah" />
            <Field label="Email" defaultValue="akosua@example.com" />
            <Field label="Phone (where the SMS alerts go)" defaultValue="+1 416 555 0142" />
            <Field label="Current location" defaultValue="Toronto, Canada" />
            <Field label="Home town in Ghana" defaultValue="Kasoa, Central Region" />
          </Section>
        )}

        {tab === "notifications" && (
          <Section title="How we reach you">
            <Toggle label="Critical alerts via SMS" defaultOn />
            <Toggle label="Critical alerts via WhatsApp" defaultOn />
            <Toggle label="Warning alerts via email" defaultOn />
            <Toggle label="Weekly trust report" defaultOn />
            <Toggle label="Daily ledger digest" defaultOn={false} />
            <Toggle label="Trustee responses (push)" defaultOn />
          </Section>
        )}

        {tab === "security" && (
          <Section title="Security">
            <Field label="Change password" placeholder="••••••••" type="password" />
            <Toggle label="Two-factor authentication (SMS)" defaultOn />
            <Toggle label="Two-factor authentication (TOTP)" defaultOn={false} />
            <Toggle label="Require trustee biometric for on-site evidence" defaultOn />
            <Toggle label="Lock the audit ledger after a critical case" defaultOn={false} />
          </Section>
        )}

        {tab === "preferences" && (
          <Section title="Display preferences">
            <Field label="Display currency" defaultValue="GHS / CAD (dual)" />
            <Field label="Default region" defaultValue="Greater Accra" />
            <Field label="Date format" defaultValue="DD/MM/YYYY" />
            <Toggle label="Show benchmarks alongside amounts" defaultOn />
            <Toggle label="Auto-translate Twi / Pidgin in trustee notes" defaultOn />
          </Section>
        )}

        {tab === "api" && (
          <Section title="API & integrations">
            <Field label="API key (read-only)" defaultValue="gw_live_********c8f1" />
            <Toggle label="Webhook on critical alert" defaultOn />
            <Toggle label="Slack notifications" defaultOn={false} />
            <Toggle label="Notion mirror of audit ledger" defaultOn={false} />
            <Toggle label="Export evidence packs to Google Drive" defaultOn />
          </Section>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-4">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-accent-green">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          <button onClick={save} className="btn btn-primary"><Save className="h-4 w-4" /> Save changes</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 text-[15px] font-semibold tracking-tight">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, ...props }: any) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      <input className="input" {...props} />
    </label>
  );
}

function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-md border border-line bg-bg-elev/40 px-3 py-2.5 text-[13px]">
      <span className="text-ink">{label}</span>
      <input type="checkbox" defaultChecked={defaultOn} className="h-4 w-4 accent-amber-500" />
    </label>
  );
}
