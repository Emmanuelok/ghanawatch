"use client";
import { useState } from "react";
import { Palette, Building2, Globe, Eye, Check, Shield } from "lucide-react";

const PRESETS = [
  { id: "stanbic", name: "Stanbic Bank Ghana", primary: "#005c9c", secondary: "#00d188", logo: "SB" },
  { id: "mtn", name: "MTN MoMo", primary: "#ffcb05", secondary: "#003366", logo: "MTN" },
  { id: "wise", name: "Wise", primary: "#00b9ff", secondary: "#163300", logo: "W" },
  { id: "embassy", name: "British High Commission", primary: "#012169", secondary: "#c8102e", logo: "🇬🇧" },
];

export default function WhitelabelPage() {
  const [active, setActive] = useState(PRESETS[0]);
  const [name, setName] = useState(active.name);
  const [primary, setPrimary] = useState(active.primary);
  const [secondary, setSecondary] = useState(active.secondary);

  function pick(p: any) { setActive(p); setName(p.name); setPrimary(p.primary); setSecondary(p.secondary); }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Palette className="h-3 w-3" /> White-label
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Ship GhanaWatch under your brand.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          For banks, MTOs, embassies, sovereign issuers. Same engine, your colours, your domain,
          your support team. Customer-facing surfaces become yours; the underlying audit ledger
          stays GhanaWatch (with verifier attribution).
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <div className="card p-5">
            <div className="mb-3 text-[14px] font-semibold">Brand presets</div>
            <div className="grid gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => pick(p)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    active.id === p.id ? "border-accent-gold/60 bg-accent-gold/5" : "border-line bg-bg-elev/40 hover:border-line/70"
                  }`}
                >
                  <div
                    className="grid h-8 w-8 place-items-center rounded-md text-[11px] font-bold"
                    style={{ background: p.primary, color: p.id === "mtn" ? "#000" : "#fff" }}
                  >
                    {p.logo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold">{p.name}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-4 w-4 rounded" style={{ background: p.primary }} />
                    <span className="h-4 w-4 rounded" style={{ background: p.secondary }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3 text-[14px] font-semibold">Custom</div>
            <div className="space-y-3">
              <Field label="Brand name">
                <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
              </Field>
              <Field label="Primary colour">
                <div className="flex items-center gap-2">
                  <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="h-9 w-12 rounded-md border border-line bg-bg-elev" />
                  <input value={primary} onChange={(e) => setPrimary(e.target.value)} className="input" />
                </div>
              </Field>
              <Field label="Secondary colour">
                <div className="flex items-center gap-2">
                  <input type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="h-9 w-12 rounded-md border border-line bg-bg-elev" />
                  <input value={secondary} onChange={(e) => setSecondary(e.target.value)} className="input" />
                </div>
              </Field>
              <Field label="Custom domain (CNAME)">
                <input defaultValue="protect.stanbicbank.com.gh" className="input" />
              </Field>
              <Field label="Support email">
                <input defaultValue="diaspora-protect@stanbicbank.com.gh" className="input" />
              </Field>
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3 text-[14px] font-semibold">Toggles</div>
            <ul className="space-y-2 text-[12px]">
              {[
                "Show GhanaWatch attribution in footer (recommended)",
                "Use your SSO (SAML / OIDC)",
                "Mirror events to your SIEM",
                "Restrict to your customers only",
                "Hide marketplace + diaspora-bond modules",
                "Show your support hotline in app",
              ].map((l, i) => (
                <li key={l} className="flex items-center justify-between rounded-md border border-line bg-bg-elev/40 px-3 py-2.5">
                  <span className="text-ink">{l}</span>
                  <input type="checkbox" defaultChecked={i < 4} className="h-4 w-4 accent-amber-500" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live preview */}
        <div className="card overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[12px] text-ink-muted flex items-center gap-2"><Eye className="h-3.5 w-3.5" /> Live preview · protect.{name.toLowerCase().replace(/[^a-z]/g, "")}.com.gh</div>

          <div style={{ background: "#0a0b0f" }}>
            {/* Nav */}
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-md text-[12px] font-bold" style={{ background: primary, color: "#fff" }}>
                  {active.logo}
                </div>
                <div className="text-[14px] font-semibold">{name}</div>
                <span className="ml-2 text-[10px] text-ink-muted">· powered by GhanaWatch</span>
              </div>
              <button className="rounded-md px-3 py-1.5 text-[12px] font-semibold" style={{ background: primary, color: "#fff" }}>
                Open app
              </button>
            </div>

            {/* Hero */}
            <div className="px-8 py-12 text-center">
              <h2 className="text-3xl font-semibold tracking-tight">Verify every cedi you send home.</h2>
              <p className="mx-auto mt-3 max-w-md text-[14px] text-ink-dim">
                {name} customers can now anchor every diaspora project to independent verification.
              </p>
              <div className="mt-5 flex justify-center gap-2">
                <button className="rounded-md px-4 py-2 text-[13px] font-semibold" style={{ background: primary, color: "#fff" }}>
                  Get started
                </button>
                <button className="rounded-md px-4 py-2 text-[13px] font-semibold" style={{ background: "transparent", color: secondary, border: `1px solid ${secondary}` }}>
                  See the tour
                </button>
              </div>
            </div>

            <div className="grid gap-3 border-t border-line p-5 md:grid-cols-3">
              {["Document forensics", "Geo-stamped sites", "Audit ledger"].map((f) => (
                <div key={f} className="rounded-xl border border-line bg-bg-elev/40 p-4">
                  <div className="flex items-center gap-2 text-[12px] font-semibold">
                    <div className="h-2 w-2 rounded-full" style={{ background: primary }} />
                    {f}
                  </div>
                  <div className="mt-1 text-[11px] text-ink-dim">Branded under {name}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-line bg-bg-elev/60 px-5 py-3 text-[10px] text-ink-muted text-center">
              © 2026 {name} · Verification engine by GhanaWatch
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 card p-6">
        <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><Shield className="h-4 w-4 text-accent-gold" /> Compliance under white-label</div>
        <ul className="grid gap-2 text-[13px] text-ink-dim md:grid-cols-2">
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> The audit ledger remains GhanaWatch-controlled — your customers can independently verify.</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Your support team handles all customer correspondence.</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> You file your own SARs; we provide the evidence pack.</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Your DPA is layered over our DPC registration.</li>
        </ul>
      </div>
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
