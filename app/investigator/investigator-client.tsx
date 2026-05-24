"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Bot, User2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "My brother is building a house in Kasoa and the cement receipts look strange — what should I check?",
  "I'm about to buy a 2-acre plot in East Legon Hills. The seller wants payment in 48h. How do I verify the title?",
  "My clearing agent at Tema says duty jumped by GHS 8,000 last minute. Is that legit?",
  "Auntie has been managing my cosmetics shop in Adum for 3 months. She hasn't sent photos in 3 weeks.",
  "My dad is at Korle Bu for surgery. The bills feel high and the cashier asked for cash payment.",
];

export function Investigator() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm the GhanaWatch AI Investigator. Tell me what's happening on the ground. I'll draft the red flags, a verification plan, and the immediate actions you should take. The more specific (region, agency, amounts in GHS, who's managing), the sharper my answer.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/investigator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "(no reply)" }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry — the investigator hit a snag. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex h-[640px] flex-col overflow-hidden">
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto scroll-shadow p-5"
      >
        {messages.map((m, i) => (
          <MsgBubble key={i} msg={m} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-[13px] text-ink-dim">
            <Loader2 className="h-4 w-4 animate-spin text-accent-gold" />
            Investigator is reasoning…
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="border-t border-line bg-bg-elev/40 p-3">
          <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-ink-muted">Try a scenario</div>
          <div className="flex flex-wrap gap-1.5">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="chip cursor-pointer hover:bg-bg-subtle"
              >
                {s.slice(0, 44)}…
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-line p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Describe the situation. Be specific."
            className="input resize-none"
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="btn btn-primary disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MsgBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${
          isUser ? "border-line bg-bg-elev" : "border-accent-gold/30 bg-accent-gold/15"
        }`}
      >
        {isUser ? <User2 className="h-3.5 w-3.5 text-ink-dim" /> : <Bot className="h-3.5 w-3.5 text-accent-gold" />}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${
          isUser ? "bg-accent-gold/10 text-ink" : "bg-bg-elev/60 text-ink"
        }`}
      >
        <Markdownish text={msg.content} />
      </div>
    </div>
  );
}

// Minimal markdown-ish renderer: headings, bold, lists.
function Markdownish({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuf: string[] = [];
  const flushList = () => {
    if (listBuf.length) {
      out.push(
        <ul key={out.length} className="my-2 ml-4 list-disc space-y-1">
          {listBuf.map((l, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inline(l) }} />
          ))}
        </ul>,
      );
      listBuf = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("### ")) {
      flushList();
      out.push(
        <div key={out.length} className="mt-2 text-[14px] font-semibold text-ink">
          {line.slice(4)}
        </div>,
      );
    } else if (line.startsWith("## ")) {
      flushList();
      out.push(
        <div key={out.length} className="mt-2 text-[15px] font-semibold text-ink">
          {line.slice(3)}
        </div>,
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuf.push(line.slice(2));
    } else if (line === "---") {
      flushList();
      out.push(<hr key={out.length} className="my-2 border-line" />);
    } else if (line === "") {
      flushList();
      out.push(<div key={out.length} className="h-2" />);
    } else {
      flushList();
      out.push(<p key={out.length} dangerouslySetInnerHTML={{ __html: inline(line) }} />);
    }
  }
  flushList();
  return <>{out}</>;
}

function inline(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-ink">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="text-ink-dim">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-bg-elev px-1 py-0.5 text-[12px]">$1</code>');
}
