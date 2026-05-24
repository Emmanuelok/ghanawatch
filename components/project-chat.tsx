"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, MapPin, Shield, ShieldCheck, FileText, Camera } from "lucide-react";

type Msg = {
  id: string;
  who: "owner" | "manager" | "trustee" | "lawyer" | "system";
  name: string;
  initials: string;
  text: string;
  ts: string;
  attach?: { kind: "doc" | "photo" | "location"; label: string };
};

const SEED: Msg[] = [
  {
    id: "m-1",
    who: "system",
    name: "GhanaWatch",
    initials: "",
    text: "Thread created. KYC-verified participants: Akosua Mensah (owner), Kwame Mensah (brother / manager), Kojo Owusu (trustee), Esi Ofori (lawyer).",
    ts: minus(7, 0),
  },
  {
    id: "m-2",
    who: "owner",
    name: "Akosua Mensah",
    initials: "AM",
    text: "Kwame, just got the alert about the cement receipt. Can you take a fresh photo of the cement stack on site and resend the actual invoice from Diamond Cement?",
    ts: minus(3, 5),
  },
  {
    id: "m-3",
    who: "manager",
    name: "Kwame Mensah",
    initials: "KM",
    text: "Yes sis. On my way to site now. I'll also call Diamond Cement to send a new invoice — the one I sent was a photocopy.",
    ts: minus(3, 2),
  },
  {
    id: "m-4",
    who: "trustee",
    name: "Kojo Owusu, MGhIS",
    initials: "KO",
    text: "I'll be at the site Wednesday morning at 09:00 for the M5 re-verification. Will photograph the cement stack independently and call Diamond Cement myself.",
    ts: minus(2, 12),
  },
  {
    id: "m-5",
    who: "manager",
    name: "Kwame Mensah",
    initials: "KM",
    text: "I'm at the site now. Sending fresh photo with GPS on.",
    ts: minus(2, 1),
  },
  {
    id: "m-6",
    who: "manager",
    name: "Kwame Mensah",
    initials: "KM",
    text: "Cement on site — 45 bags stacked.",
    ts: minus(2, 0.9),
    attach: { kind: "photo", label: "Cement stack — 5.5419, -0.4159 · scene match 91%" },
  },
  {
    id: "m-7",
    who: "lawyer",
    name: "Esi Ofori, Esq.",
    initials: "EO",
    text: "If Diamond Cement confirm the new invoice independently, we can close the doc-forensic flag. If they say the original invoice was never issued, we open a case for invoice forgery.",
    ts: minus(2, 0.5),
  },
  {
    id: "m-8",
    who: "owner",
    name: "Akosua Mensah",
    initials: "AM",
    text: "Sounds good. Thank you all. Trustee Kojo — please pause the M5 disbursement until you've done your visit.",
    ts: minus(1, 8),
  },
];

const COLOR: Record<string, string> = {
  owner: "#f5b800",
  manager: "#3b82f6",
  trustee: "#10b981",
  lawyer: "#8b5cf6",
  system: "#9aa0b0",
};
const ROLE: Record<string, string> = {
  owner: "Diaspora owner",
  manager: "Manager (brother)",
  trustee: "Trustee · QS",
  lawyer: "Lawyer",
  system: "GhanaWatch",
};

function minus(days: number, hours = 0) {
  return new Date(new Date("2026-05-24T09:00:00Z").getTime() - days * 86400000 - hours * 3600000).toISOString();
}

export function ProjectChat({ projectId: _ }: { projectId: string }) {
  const [msgs, setMsgs] = useState<Msg[]>(SEED);
  const [draft, setDraft] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  function send() {
    if (!draft.trim()) return;
    setMsgs((ms) => [
      ...ms,
      {
        id: `m-${Date.now()}`,
        who: "owner",
        name: "Akosua Mensah",
        initials: "AM",
        text: draft,
        ts: new Date().toISOString(),
      },
    ]);
    setDraft("");
  }

  return (
    <div className="card flex h-[640px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div>
          <div className="text-[14px] font-semibold">Project chat</div>
          <div className="text-[11px] text-ink-dim">Encrypted · KYC-verified participants only · all messages hashed to the audit ledger</div>
        </div>
        <div className="flex items-center gap-1">
          {["AM", "KM", "KO", "EO"].map((i, idx) => (
            <div
              key={i}
              className="grid h-6 w-6 place-items-center rounded-full border-2 border-bg-card text-[10px] font-semibold text-bg"
              style={{ background: ["#f5b800", "#3b82f6", "#10b981", "#8b5cf6"][idx], marginLeft: idx > 0 ? -8 : 0 }}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      <div ref={ref} className="flex-1 space-y-4 overflow-y-auto scroll-shadow p-5">
        {msgs.map((m) => (
          <ChatBubble key={m.id} msg={m} />
        ))}
      </div>

      <div className="border-t border-line p-3">
        <div className="flex items-end gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-md text-ink-muted hover:bg-bg-elev hover:text-ink">
            <Paperclip className="h-4 w-4" />
          </button>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Reply as Akosua Mensah…"
            className="input resize-none"
          />
          <button onClick={send} disabled={!draft.trim()} className="btn btn-primary disabled:opacity-40">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-ink-muted">
          <Shield className="h-3 w-3 text-accent-green" />
          End-to-end encrypted. Every message hash is anchored to the project's audit ledger.
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ msg }: { msg: Msg }) {
  if (msg.who === "system") {
    return (
      <div className="grid place-items-center">
        <div className="rounded-full bg-bg-elev/60 px-3 py-1.5 text-[11px] text-ink-muted">
          {msg.text}
        </div>
      </div>
    );
  }
  const color = COLOR[msg.who];
  return (
    <div className="flex gap-3">
      <div
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-bg"
        style={{ background: color }}
      >
        {msg.initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-[13px] font-semibold text-ink">{msg.name}</span>
          <span className="chip" style={{ color, borderColor: `${color}30`, background: `${color}10` }}>
            <ShieldCheck className="h-3 w-3" /> {ROLE[msg.who]}
          </span>
          <span className="text-[11px] text-ink-muted">{relTime(msg.ts)}</span>
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-ink">{msg.text}</p>
        {msg.attach && (
          <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-line bg-bg-elev/40 px-3 py-2 text-[12px]">
            {msg.attach.kind === "doc" && <FileText className="h-3.5 w-3.5 text-accent-gold" />}
            {msg.attach.kind === "photo" && <Camera className="h-3.5 w-3.5 text-accent-gold" />}
            {msg.attach.kind === "location" && <MapPin className="h-3.5 w-3.5 text-accent-gold" />}
            <span className="text-ink-dim">{msg.attach.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function relTime(iso: string) {
  const t = new Date(iso).getTime();
  const now = new Date("2026-05-24T09:00:00Z").getTime();
  const diff = Math.max(0, now - t);
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h > 0) return `${h}h ago`;
  return `${Math.floor(diff / 60000)}m ago`;
}
