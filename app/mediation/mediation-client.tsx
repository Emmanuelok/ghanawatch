"use client";
import { useState, useEffect, useRef } from "react";
import { CursorPresence } from "@/components/cursor-presence";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  MessageCircle,
  Users,
  ShieldCheck,
  FileText,
  Camera,
  Send,
} from "lucide-react";

const PARTICIPANTS = [
  { id: "p1", name: "Nana Yaw Boateng", role: "Claimant (diaspora)", color: "#f5b800", muted: false, video: true, speaking: false },
  { id: "p2", name: "Nii Agyemang", role: "Respondent (vendor)", color: "#ef4444", muted: true, video: true, speaking: false },
  { id: "p3", name: "Hon. K. Ofori", role: "Mediator (GhanaWatch-ADR)", color: "#10b981", muted: false, video: true, speaking: true },
  { id: "p4", name: "Esi Ofori, Esq.", role: "Claimant's counsel", color: "#8b5cf6", muted: true, video: true, speaking: false },
  { id: "p5", name: "Akua Yawson", role: "Surveyor (witness)", color: "#3b82f6", muted: true, video: false, speaking: false },
];

type ChatMsg = { who: string; color: string; text: string; ts: string };

export function MediationRoom() {
  const [chat, setChat] = useState<ChatMsg[]>([
    { who: "Hon. K. Ofori (Mediator)", color: "#10b981", text: "Welcome everyone. I've shared the mediation agenda. We'll have 90 minutes today.", ts: "09:00" },
    { who: "Nana Yaw Boateng", color: "#f5b800", text: "Thank you. I've uploaded the Lands Commission record and the trustee's encroachment photos.", ts: "09:01" },
    { who: "Hon. K. Ofori (Mediator)", color: "#10b981", text: "Received. I see EXHIBIT-LC-04 and PHOTO-PH-4 — both hash-anchored.", ts: "09:01" },
    { who: "Nii Agyemang", color: "#ef4444", text: "I dispute the encroachment claim. The northern boundary peg has been moved.", ts: "09:03" },
    { who: "Akua Yawson (Surveyor)", color: "#3b82f6", text: "I can address the peg question — my drone footage from 4 May shows the original peg position. Sharing screen.", ts: "09:04" },
  ]);
  const [draft, setDraft] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [chat]);

  function send() {
    if (!draft.trim()) return;
    const now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setChat((c) => [...c, { who: "You", color: "#9aa0b0", text: draft, ts: now }]);
    setDraft("");
  }

  return (
    <>
      <CursorPresence />
    <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        {/* Video grid */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line bg-bg-elev/40 px-5 py-3">
            <div>
              <div className="text-[14px] font-semibold">East Legon Hills — Mediation Session 2</div>
              <div className="flex items-center gap-2 text-[11px] text-ink-dim">
                <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-accent-red animate-pulse" />
                Live · recording · transcribing
              </div>
            </div>
            <span className="chip text-[11px]">52:18 elapsed</span>
          </div>
          <div className="grid gap-2 p-3 md:grid-cols-2 lg:grid-cols-3">
            {PARTICIPANTS.map((p) => (
              <ParticipantTile key={p.id} p={p} />
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-t border-line bg-bg-elev/40 px-5 py-4">
            <RoundBtn icon={Mic} label="Mute" />
            <RoundBtn icon={Video} label="Video" />
            <RoundBtn icon={ScreenShare} label="Share" />
            <RoundBtn icon={MessageCircle} label="Chat" active />
            <button className="grid h-10 w-10 place-items-center rounded-full bg-risk-high text-white"><PhoneOff className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Live transcript */}
        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold">
            <FileText className="h-4 w-4 text-accent-gold" /> Live transcript (auto-anchored)
          </div>
          <div className="space-y-2 text-[13px] text-ink-dim">
            <Tr name="Hon. K. Ofori (Mediator)" t="09:51:18" body="So as I understand the surveyor's evidence, the peg in question was photographed at coordinates -0.14130, 5.65095 on 4 May, and the current position is 14 metres east of that point." color="#10b981" />
            <Tr name="Akua Yawson (Surveyor)" t="09:51:34" body="That's correct. I have three reference images at three different angles. The original peg cap is visible in two of them." color="#3b82f6" />
            <Tr name="Nii Agyemang" t="09:52:02" body="I would like to call my own surveyor to give counter-evidence next session." color="#ef4444" />
            <Tr name="Hon. K. Ofori (Mediator)" t="09:52:12" body="Granted. We'll schedule that for Thursday at 14:00. In the meantime, the parties are reminded the escrow remains paused." color="#10b981" />
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        {/* Chat */}
        <div className="card flex h-[420px] flex-col overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">In-room chat</div>
          <div ref={ref} className="flex-1 space-y-3 overflow-y-auto scroll-shadow p-4">
            {chat.map((m, i) => (
              <div key={i}>
                <div className="flex items-baseline gap-2 text-[11px]">
                  <span className="font-semibold" style={{ color: m.color }}>{m.who}</span>
                  <span className="text-ink-muted">{m.ts}</span>
                </div>
                <div className="mt-0.5 text-[13px] text-ink">{m.text}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-line p-3">
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                placeholder="Send a message to the room"
                className="input"
              />
              <button onClick={send} disabled={!draft.trim()} className="btn btn-primary disabled:opacity-40"><Send className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        {/* Exhibits */}
        <div className="card p-5">
          <div className="mb-3 text-[14px] font-semibold">Shared exhibits</div>
          <div className="space-y-2">
            <Exhibit icon={FileText} label="EXHIBIT-LC-04 — Lands Commission record" hash="0xab7d…f81c" />
            <Exhibit icon={Camera} label="PHOTO-PH-4 — Encroachment evidence (8 angles)" hash="0x9c11…22e6" />
            <Exhibit icon={FileText} label="EXHIBIT-SP-02 — Site plan (licensed surveyor)" hash="0x4f1c…a82b" />
          </div>
        </div>

        <div className="card p-5 text-[12px] text-ink-dim">
          <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-ink">
            <ShieldCheck className="h-4 w-4 text-accent-green" /> Room compliance
          </div>
          <ul className="space-y-1.5">
            <li>· Recording stored encrypted; auto-deletes after 6 months unless escalated.</li>
            <li>· Transcript hash-anchored every 60 seconds.</li>
            <li>· Mediator + counsel are KYC-verified GhanaWatch participants.</li>
          </ul>
        </div>
      </aside>
    </div>
    </>
  );
}

function ParticipantTile({ p }: { p: any }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-bg-elev">
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 30% 30%, ${p.color}30, transparent 70%)` }}
      />
      {!p.video && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-14 w-14 place-items-center rounded-full text-[16px] font-semibold text-bg" style={{ background: p.color }}>
            {p.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
          </div>
        </div>
      )}
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between text-[10px] text-white">
        <div className="rounded bg-black/50 px-2 py-0.5">
          <div className="font-semibold">{p.name}</div>
          <div className="opacity-80 text-[9px]">{p.role}</div>
        </div>
        <div className="flex items-center gap-1">
          {p.muted ? <MicOff className="h-3 w-3 text-risk-high" /> : <Mic className="h-3 w-3 text-accent-green" />}
          {!p.video && <VideoOff className="h-3 w-3 text-ink-muted" />}
        </div>
      </div>
      {p.speaking && (
        <div className="pointer-events-none absolute inset-0 ring-2 ring-accent-green/70 rounded-xl animate-pulse" />
      )}
    </div>
  );
}

function RoundBtn({ icon: Icon, label, active }: any) {
  return (
    <button className={`grid h-10 w-10 place-items-center rounded-full border ${active ? "border-accent-gold/40 bg-accent-gold/10 text-accent-gold" : "border-line bg-bg-elev text-ink-dim hover:text-ink"}`} aria-label={label}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Tr({ name, t, body, color }: any) {
  return (
    <div>
      <div className="text-[11px]">
        <span className="font-semibold" style={{ color }}>{name}</span>
        <span className="ml-2 text-ink-muted">{t}</span>
      </div>
      <div className="mt-0.5 text-[12.5px]">{body}</div>
    </div>
  );
}

function Exhibit({ icon: Icon, label, hash }: any) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-line bg-bg-elev/40 p-3">
      <Icon className="h-4 w-4 shrink-0 text-accent-gold" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] text-ink">{label}</div>
        <div className="hash-mono">{hash}</div>
      </div>
    </div>
  );
}
