"use client";
import { useState } from "react";
import { Plug, Check, Loader2, ExternalLink, Settings, X } from "lucide-react";

type State = "off" | "connecting" | "on";

const APPS = [
  { id: "slack", name: "Slack", logo: "S", colour: "#611f69", desc: "Per-channel alerts, /gw slash commands, evidence-pack delivery." },
  { id: "teams", name: "Microsoft Teams", logo: "T", colour: "#5059c9", desc: "Tabs in Teams channels, bot for incident triage." },
  { id: "linear", name: "Linear", logo: "L", colour: "#5e6ad2", desc: "Auto-file Linear issues on critical alerts." },
  { id: "notion", name: "Notion", logo: "N", colour: "#000000", desc: "Mirror your project ledger into a Notion database." },
  { id: "drive", name: "Google Drive", logo: "G", colour: "#4285f4", desc: "Push sealed evidence packs to a Drive folder." },
  { id: "zapier", name: "Zapier", logo: "Z", colour: "#ff4a00", desc: "1,000+ apps via Zapier on any webhook event." },
  { id: "sheets", name: "Google Sheets", logo: "X", colour: "#0f9d58", desc: "Stream the audit ledger to a sheet for accountants." },
  { id: "1pass", name: "1Password", logo: "1", colour: "#0572ec", desc: "Store API keys and trustee credentials in 1Password." },
];

const SLASH_CMDS = [
  "/gw status",
  "/gw projects",
  "/gw alerts",
  "/gw dispatch <trustee> <project>",
  "/gw pack <project>",
  "/gw chain verify <hash>",
];

export default function IntegrationsPage() {
  const [states, setStates] = useState<Record<string, State>>({ slack: "on", drive: "on" });

  function toggle(id: string) {
    setStates((s) => ({ ...s, [id]: s[id] === "on" ? "off" : "connecting" }));
    setTimeout(() => setStates((s) => ({ ...s, [id]: s[id] === "connecting" ? "on" : s[id] })), 1100);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Plug className="h-3 w-3" /> Integrations
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Pipe GhanaWatch into the rest of your stack.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          One-click OAuth into Slack, Teams, Linear, Notion, Drive, Sheets, 1Password, Zapier.
          Per-project channels, slash commands, evidence-pack delivery, ledger mirroring.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {APPS.map((a) => {
          const st = states[a.id] ?? "off";
          return (
            <div key={a.id} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg text-[14px] font-bold text-white" style={{ background: a.colour }}>
                  {a.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold">{a.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.12em]" style={{ color: st === "on" ? "#10b981" : "#9aa0b0" }}>
                    {st === "on" ? "connected" : st === "connecting" ? "connecting…" : "not connected"}
                  </div>
                </div>
                {st === "on" && <Check className="h-4 w-4 text-accent-green" />}
              </div>
              <p className="mt-3 text-[12px] text-ink-dim">{a.desc}</p>
              <button onClick={() => toggle(a.id)} disabled={st === "connecting"} className={`btn mt-3 w-full justify-center text-[12px] py-1.5 ${st === "on" ? "btn-ghost" : "btn-primary"} disabled:opacity-40`}>
                {st === "connecting" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : st === "on" ? <Settings className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                {st === "connecting" ? "Authorising…" : st === "on" ? "Manage" : "Connect via OAuth"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Slack deeper view */}
      <div className="mt-12 card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Slack — what shipping looks like</div>
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="border-b border-line p-5 lg:border-b-0 lg:border-r">
            <div className="mb-3 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Slash commands</div>
            <ul className="space-y-1.5 text-[12px]">
              {SLASH_CMDS.map((c) => <li key={c} className="font-mono text-ink-dim">{c}</li>)}
            </ul>
          </div>
          <div className="p-5">
            <div className="mb-3 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Example incoming alert</div>
            <div className="rounded-lg border border-[#611f69]/40 bg-[#19171d] p-3 text-[12px] text-[#dcdde1]">
              <div className="flex items-center gap-2 text-[11px] text-[#9aa0b0]">
                <div className="grid h-6 w-6 place-items-center rounded bg-[#611f69] text-[10px] font-bold text-white">GW</div>
                <span className="font-semibold text-white">GhanaWatch Bot</span>
                <span className="ml-auto">9:24 AM</span>
              </div>
              <div className="mt-2 rounded border-l-2 border-[#ef4444] bg-[#1a1d27] p-2 text-[11.5px]">
                <div className="font-semibold text-white">🚨 Off-site photo detected — Kasoa 4-Bed</div>
                <div className="mt-1 text-[#9aa0b0]">Photo submitted by Kwame Mensah is 1.18 km from the registered parcel.</div>
                <div className="mt-2 flex gap-2">
                  <button className="rounded bg-[#611f69] px-2 py-1 text-[10px] text-white">Dispatch trustee</button>
                  <button className="rounded border border-[#9aa0b0]/30 px-2 py-1 text-[10px] text-[#9aa0b0]">Open project</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
