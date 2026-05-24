"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Phone, MoreVertical, Mic, Paperclip, Camera, MapPin, Check, CheckCheck, Image as ImageIcon } from "lucide-react";

type Msg =
  | { from: "user" | "bot"; t: "text"; text: string; time: string }
  | { from: "user" | "bot"; t: "image"; caption: string; time: string }
  | { from: "user" | "bot"; t: "card"; title: string; lines: string[]; time: string; status?: "ok" | "warn" };

const SCRIPT: Msg[] = [
  { from: "bot", t: "text", text: "Hi Kwame 👋 The site visit window for Milestone 4 starts today. Can you send a quick photo when you reach the site?", time: "8:14" },
  { from: "user", t: "text", text: "Yes boss, on my way now. Will send in 30 minutes", time: "8:15" },
  { from: "user", t: "image", caption: "1st floor blockwork in progress", time: "8:47" },
  { from: "bot", t: "card", title: "Photo received — running checks…", lines: ["GPS: -0.4221, 5.5345", "Distance from registered parcel: 1.18 km", "Scene match vs prior: 38%", "EXIF intact: yes"], time: "8:47" },
  { from: "bot", t: "text", text: "Kwame, this photo's GPS is 1.18 km from the Kasoa parcel. The background also doesn't match prior photos. Are you on a different site today?", time: "8:48" },
  { from: "user", t: "text", text: "Oh, I'm at the supplier yard. Forgot. Let me send a real one when I reach.", time: "8:50" },
  { from: "bot", t: "text", text: "No problem. I'll wait. (I've still logged this one to the ledger as 'off-site reference'.)", time: "8:50" },
  { from: "user", t: "image", caption: "Now at the actual site", time: "10:22" },
  { from: "bot", t: "card", title: "Photo verified ✓", lines: ["GPS: -0.4156, 5.5421 — on parcel (Δ 8m)", "Scene match vs prior verified: 94%", "Stage match: matches BOQ stage 4.2 (lintel work)"], time: "10:22", status: "ok" },
  { from: "bot", t: "text", text: "Looking good. Do you have the receipt for the cement bags from yesterday? Diamond Cement, 45 bags?", time: "10:23" },
  { from: "user", t: "image", caption: "Cement receipt", time: "10:25" },
  { from: "bot", t: "card", title: "⚠ Receipt forensics flagged", lines: ["Vendor: Diamond Cement Ghana — letterhead OK", "Amount: GHS 14,400 (45 bags @ GHS 320)", "Benchmark median: GHS 105/bag → expected GHS 4,725", "Font inconsistency: Helvetica → Arial mid-document", "Pixel tampering detected in amount field"], time: "10:25", status: "warn" },
  { from: "bot", t: "text", text: "Kwame — the amount field on this receipt looks edited, and GHS 320 per bag is 3× the market rate. I'm going to ask the supplier directly. Can you share their phone number?", time: "10:26" },
];

export function ManagerBotPreview() {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (shown >= SCRIPT.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 1100 + (SCRIPT[shown]?.t === "card" ? 600 : 0));
    return () => clearTimeout(t);
  }, [shown]);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [shown]);

  function reset() { setShown(0); }

  return (
    <div className="mx-auto w-full max-w-[400px]">
      {/* Phone frame */}
      <div className="overflow-hidden rounded-[36px] border-2 border-line bg-bg-card shadow-2xl">
        {/* Status bar */}
        <div className="flex items-center justify-between bg-[#075e54] px-5 py-2 text-[11px] text-white/90">
          <span>9:24</span>
          <span>● ● ●</span>
        </div>
        {/* Whatsapp header */}
        <div className="flex items-center gap-3 bg-[#075e54] px-3 py-3 text-white">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent-gold to-accent-green text-[12px] font-bold text-bg">GW</div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold">GhanaWatch Bot</div>
            <div className="text-[11px] opacity-80">Online · Kasoa 4-bed project</div>
          </div>
          <Phone className="h-4 w-4 opacity-80" />
          <MoreVertical className="h-4 w-4 opacity-80" />
        </div>
        {/* Message area */}
        <div
          ref={ref}
          className="relative max-h-[560px] min-h-[480px] space-y-2 overflow-y-auto scroll-shadow p-3"
          style={{
            background:
              "repeating-linear-gradient(45deg, #0b1411 0px, #0b1411 12px, #0e1814 12px, #0e1814 24px)",
          }}
        >
          {SCRIPT.slice(0, shown).map((m, i) => (
            <MessageBubble key={i} msg={m} />
          ))}
          {shown < SCRIPT.length && (
            <div className="flex gap-1 px-3 py-2 text-[11px] text-white/60">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" style={{ animationDelay: "300ms" }} />
            </div>
          )}
        </div>
        {/* Composer */}
        <div className="flex items-center gap-2 bg-[#1f2c33] px-3 py-2">
          <div className="flex items-center gap-2 rounded-full bg-[#2a3942] px-3 py-2 flex-1">
            <Paperclip className="h-4 w-4 text-white/50" />
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message"
              className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/40"
            />
            <Camera className="h-4 w-4 text-white/50" />
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-[#00a884] text-white">
            {draft ? <Send className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="mt-3 flex justify-center">
        <button onClick={reset} className="btn btn-ghost text-[11px]">Replay conversation</button>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  const isBot = msg.from === "bot";
  return (
    <div className={`flex ${isBot ? "" : "justify-end"}`}>
      <div
        className={`max-w-[88%] rounded-lg px-3 py-2 text-[12.5px] leading-[1.4] text-white ${
          isBot ? "bg-[#202c33]" : "bg-[#005c4b]"
        }`}
        style={{ borderTopLeftRadius: isBot ? 2 : 10, borderTopRightRadius: isBot ? 10 : 2 }}
      >
        {msg.t === "text" && <div>{msg.text}</div>}
        {msg.t === "image" && (
          <div>
            <div className="grid h-32 w-56 place-items-center rounded-md bg-black/40">
              <ImageIcon className="h-6 w-6 text-white/50" />
            </div>
            <div className="mt-1 text-[11px] opacity-80">{msg.caption}</div>
            <div className="mt-1 flex items-center gap-1 text-[10px] opacity-60">
              <MapPin className="h-2.5 w-2.5" /> attached photo
            </div>
          </div>
        )}
        {msg.t === "card" && (
          <div
            className={`rounded-md border p-2 ${
              msg.status === "warn"
                ? "border-amber-400/40 bg-amber-400/10"
                : msg.status === "ok"
                ? "border-emerald-400/40 bg-emerald-400/10"
                : "border-white/15 bg-white/5"
            }`}
          >
            <div className="text-[12px] font-semibold">{msg.title}</div>
            <ul className="mt-1 space-y-0.5">
              {msg.lines.map((l) => (
                <li key={l} className="text-[11px] opacity-90">· {l}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-1 flex items-center justify-end gap-0.5 text-[9px] opacity-60">
          <span>{msg.time}</span>
          {!isBot && <CheckCheck className="h-2.5 w-2.5 text-sky-400" />}
        </div>
      </div>
    </div>
  );
}
