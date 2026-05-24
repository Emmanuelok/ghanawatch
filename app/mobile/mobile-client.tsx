"use client";
import { useState } from "react";
import {
  Bell,
  ShieldAlert,
  Camera,
  Home,
  ScrollText,
  AlertTriangle,
  ChevronRight,
  Fingerprint,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { PROJECTS, ALERTS } from "@/lib/mock-data";

type Screen = "home" | "alerts" | "project" | "approve";

export function MobileAppPreview() {
  const [screen, setScreen] = useState<Screen>("home");
  const [approveOpen, setApproveOpen] = useState(false);

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[auto_1fr]">
      <div>
        <div className="relative mx-auto w-[330px] overflow-hidden rounded-[40px] border-4 border-line bg-bg-card shadow-2xl">
          <div className="flex items-center justify-between bg-bg-card px-6 py-2 text-[10px] text-ink-dim">
            <span>9:24</span>
            <span>·· ··</span>
          </div>
          <div className="relative h-[640px] overflow-hidden bg-bg">
            {screen === "home" && <HomeScreen onTap={setScreen} onApprove={() => setApproveOpen(true)} />}
            {screen === "alerts" && <AlertsScreen onTap={setScreen} />}
            {screen === "project" && <ProjectScreen onTap={setScreen} />}
            {screen === "approve" && <ApproveScreen onDone={() => setScreen("home")} />}
          </div>
          {/* Tab bar */}
          <div className="grid grid-cols-4 border-t border-line bg-bg-elev py-2 text-[10px]">
            <Tab Icon={Home} label="Home" active={screen === "home"} onClick={() => setScreen("home")} />
            <Tab Icon={Bell} label="Alerts" active={screen === "alerts"} onClick={() => setScreen("alerts")} />
            <Tab Icon={ScrollText} label="Ledger" active={false} onClick={() => {}} />
            <Tab Icon={Fingerprint} label="Approve" active={screen === "approve"} onClick={() => setScreen("approve")} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card title="Native push the moment something flags">
          <p className="text-[13px] text-ink-dim">A critical alert wakes the screen, plays a tone, and bypasses Do-Not-Disturb. The diaspora user can pause disbursement with a single tap from the lock screen.</p>
        </Card>
        <Card title="Biometric milestone approval">
          <p className="text-[13px] text-ink-dim">Funds release only after the diaspora user authenticates with FaceID / fingerprint on their own device. The biometric is bound to the audit ledger entry — no possibility of remote forgery.</p>
        </Card>
        <Card title="Capture for the diaspora user too">
          <p className="text-[13px] text-ink-dim">Travelling home for a site visit? The app lets you geo-stamp your own photos and sign them as the diaspora user — they become first-party evidence in the ledger.</p>
        </Card>
        <Card title="Works on Android & iOS">
          <p className="text-[13px] text-ink-dim">Native apps via Expo. Encrypted device storage. Biometric-gated app open. Works offline; syncs when you're back online.</p>
        </Card>
      </div>
    </div>
  );
}

function HomeScreen({ onTap, onApprove }: { onTap: (s: Screen) => void; onApprove: () => void }) {
  return (
    <div className="space-y-3 p-4">
      <div>
        <div className="text-[11px] text-ink-dim">Good morning,</div>
        <div className="text-[18px] font-semibold">Akosua</div>
      </div>
      <div className="rounded-xl border border-line bg-bg-elev p-3">
        <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Portfolio</div>
        <div className="mt-1 text-[24px] font-semibold tracking-tight">GHS 2.35M</div>
        <div className="text-[11px] text-ink-dim">8 projects · 7 active</div>
      </div>
      <button
        onClick={() => onTap("alerts")}
        className="flex w-full items-center gap-3 rounded-xl border border-risk-high/30 bg-risk-high/5 p-3 text-left"
      >
        <ShieldAlert className="h-5 w-5 text-risk-high" />
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold text-risk-high">2 critical alerts</div>
          <div className="text-[11px] text-ink-dim">Tap to review</div>
        </div>
        <ChevronRight className="h-4 w-4 text-ink-muted" />
      </button>
      <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Active projects</div>
      {PROJECTS.slice(0, 3).map((p) => (
        <button
          key={p.id}
          onClick={() => onTap("project")}
          className="flex w-full items-center gap-3 rounded-xl border border-line bg-bg-elev/60 p-3 text-left"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: p.risk === "high" ? "#ef4444" : p.risk === "med" ? "#f59e0b" : "#10b981" }} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-semibold">{p.name}</div>
            <div className="text-[10px] text-ink-dim">{p.progress}% · GHS {(p.spentGHS / 1000).toFixed(0)}K</div>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-ink-muted" />
        </button>
      ))}
      <button onClick={onApprove} className="flex w-full items-center gap-2 rounded-xl bg-accent-gold p-3 text-[12px] font-semibold text-bg">
        <Fingerprint className="h-4 w-4" /> Approve milestone (M4 — GHS 140K)
      </button>
    </div>
  );
}

function AlertsScreen({ onTap }: { onTap: (s: Screen) => void }) {
  return (
    <div className="space-y-2 p-4">
      <button onClick={() => onTap("home")} className="text-[11px] text-ink-dim">← Back</button>
      <div className="mt-2 text-[18px] font-semibold">Alerts</div>
      {ALERTS.slice(0, 5).map((a) => (
        <div key={a.id} className="rounded-xl border border-line bg-bg-elev/60 p-3">
          <div className="flex items-center gap-2">
            <span className={`chip ${a.severity === "critical" ? "risk-high" : "risk-med"} uppercase`}>{a.severity}</span>
            <div className="text-[11px] text-ink-muted">{a.category}</div>
          </div>
          <div className="mt-1 text-[12px] font-semibold">{a.title}</div>
          <div className="mt-0.5 text-[10px] text-ink-dim">{a.detail.slice(0, 90)}…</div>
        </div>
      ))}
    </div>
  );
}

function ProjectScreen({ onTap }: { onTap: (s: Screen) => void }) {
  const p = PROJECTS[0];
  return (
    <div className="space-y-3 p-4">
      <button onClick={() => onTap("home")} className="text-[11px] text-ink-dim">← Back</button>
      <div className="text-[16px] font-semibold">{p.name}</div>
      <div className="text-[11px] text-ink-dim">{p.location}</div>
      <div className="rounded-xl border border-line bg-bg-elev/60 p-3">
        <div className="flex items-center justify-between text-[11px] text-ink-dim">
          <span>Progress</span><span className="font-semibold text-ink">{p.progress}%</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-bg-subtle">
          <div className="h-full rounded-full bg-gradient-to-r from-accent-gold to-accent-green" style={{ width: `${p.progress}%` }} />
        </div>
      </div>
      <button className="flex w-full items-center justify-between rounded-xl border border-line bg-bg-elev/60 p-3 text-left">
        <span className="flex items-center gap-2 text-[12px]"><Camera className="h-4 w-4 text-accent-gold" /> Request fresh photo</span>
        <ChevronRight className="h-3.5 w-3.5 text-ink-muted" />
      </button>
      <button className="flex w-full items-center justify-between rounded-xl border border-line bg-bg-elev/60 p-3 text-left">
        <span className="flex items-center gap-2 text-[12px]"><ShieldCheck className="h-4 w-4 text-accent-green" /> Dispatch trustee</span>
        <ChevronRight className="h-3.5 w-3.5 text-ink-muted" />
      </button>
      <button className="flex w-full items-center justify-between rounded-xl border border-line bg-bg-elev/60 p-3 text-left">
        <span className="flex items-center gap-2 text-[12px]"><AlertTriangle className="h-4 w-4 text-risk-high" /> Pause disbursement</span>
        <ChevronRight className="h-3.5 w-3.5 text-ink-muted" />
      </button>
    </div>
  );
}

function ApproveScreen({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<"idle" | "scan" | "ok">("idle");
  return (
    <div className="grid h-full place-items-center p-6">
      <div className="text-center">
        <div className="text-[12px] uppercase tracking-[0.12em] text-ink-muted">Approve milestone</div>
        <div className="mt-1 text-[15px] font-semibold">Kasoa 4-Bed · M4 First-floor decking</div>
        <div className="mt-1 text-[12px] text-ink-dim">Releases GHS 140,000 to Kwame Mensah</div>
        <div className="mx-auto mt-8 grid h-32 w-32 place-items-center rounded-full border-2 border-accent-gold/40 bg-bg-elev/60">
          {stage === "idle" && <Fingerprint className="h-12 w-12 text-accent-gold" />}
          {stage === "scan" && <Fingerprint className="h-12 w-12 animate-pulse text-accent-gold" />}
          {stage === "ok" && <ShieldCheck className="h-12 w-12 text-accent-green" />}
        </div>
        {stage === "idle" && (
          <button
            onClick={() => { setStage("scan"); setTimeout(() => setStage("ok"), 1100); }}
            className="btn btn-primary mt-6"
          >
            Hold to approve
          </button>
        )}
        {stage === "ok" && (
          <div className="mt-6">
            <div className="text-[12px] text-accent-green">Released ✓</div>
            <button onClick={onDone} className="btn btn-ghost mt-3 text-[12px] py-1.5">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Tab({ Icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className="grid place-items-center gap-1 py-1">
      <Icon className={`h-4 w-4 ${active ? "text-accent-gold" : "text-ink-muted"}`} />
      <span className={active ? "text-ink" : "text-ink-muted"}>{label}</span>
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="mb-1 text-[14px] font-semibold">{title}</div>
      {children}
    </div>
  );
}
