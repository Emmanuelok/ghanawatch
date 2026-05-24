"use client";
import { useState } from "react";
import { Copy, MessageCircle, Mail, Share2, Gift, Trophy, Check } from "lucide-react";

const REFERRED = [
  { id: "r-1", name: "Yaa Asantewaa", country: "🇺🇸 New York", status: "verified", joinedAt: "2026-04-12", reward: "1 month Guard" },
  { id: "r-2", name: "Kojo Asare", country: "🇦🇺 Sydney", status: "verified", joinedAt: "2026-04-19", reward: "1 month Guard" },
  { id: "r-3", name: "Mawuli Agbeko", country: "🇺🇸 Atlanta", status: "pending", joinedAt: "2026-05-21", reward: "pending verification" },
];

export function ReferralsClient() {
  const link = "https://ghanawatch.com/r/AKOSUA-83F2";
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  const milestones = [
    { count: 1, label: "1 month Guard free" },
    { count: 3, label: "Premium trustee priority" },
    { count: 5, label: "Free for life ⭐" },
    { count: 10, label: "Annual GhanaWatch dinner invite" },
  ];
  const current = REFERRED.filter((r) => r.status === "verified").length;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="card p-6">
          <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Your unique link</div>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-line bg-bg-elev/40 p-3">
            <code className="flex-1 truncate text-[13px] text-accent-gold">{link}</code>
            <button onClick={copy} className="btn btn-ghost text-[12px] py-1.5">
              {copied ? <><Check className="h-3.5 w-3.5 text-accent-green" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <a href={`https://wa.me/?text=${encodeURIComponent("Hey — I've been using GhanaWatch to verify my projects back home. Genuinely solves the trust problem. Try it: " + link)}`} target="_blank" rel="noreferrer" className="btn btn-primary text-[12px] py-1.5"><MessageCircle className="h-3.5 w-3.5" /> Share via WhatsApp</a>
            <a href={`mailto:?subject=GhanaWatch&body=${encodeURIComponent("I think you'd find this useful: " + link)}`} className="btn btn-ghost text-[12px] py-1.5"><Mail className="h-3.5 w-3.5" /> Email</a>
            <button className="btn btn-ghost text-[12px] py-1.5"><Share2 className="h-3.5 w-3.5" /> Share sheet</button>
          </div>
        </div>

        {/* Milestones */}
        <div className="card mt-6 p-6">
          <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Trophy className="h-4 w-4 text-accent-gold" /> Reward milestones</div>
          <div className="space-y-3">
            {milestones.map((m) => {
              const done = current >= m.count;
              const pct = Math.min(100, (current / m.count) * 100);
              return (
                <div key={m.count}>
                  <div className="flex items-baseline justify-between text-[12px]">
                    <span className={done ? "text-accent-green font-semibold" : "text-ink"}>{m.count} verified referrals · {m.label}</span>
                    <span className="text-ink-muted">{current}/{m.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
                    <div className="h-full transition-all" style={{ width: `${pct}%`, background: done ? "#10b981" : "#f5b800" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Referrals table */}
        <div className="card mt-6 overflow-hidden">
          <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Your referrals</div>
          <div className="divide-y divide-line">
            {REFERRED.map((r) => (
              <div key={r.id} className="grid items-center gap-3 px-5 py-3 md:grid-cols-[1fr_1fr_auto_auto]">
                <div className="text-[13px] text-ink">{r.name}</div>
                <div className="text-[12px] text-ink-dim">{r.country}</div>
                <div className="text-[11px] text-ink-muted">{r.joinedAt}</div>
                <span className="chip" style={{ color: r.status === "verified" ? "#10b981" : "#f59e0b" }}>
                  {r.status === "verified" ? <Check className="h-3 w-3" /> : null} {r.reward}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="card p-5">
        <div className="flex items-center gap-2 text-[14px] font-semibold"><Gift className="h-4 w-4 text-accent-gold" /> The pitch</div>
        <p className="mt-3 text-[13px] text-ink-dim">
          When you talk to other Ghanaians abroad about GhanaWatch, here's what's worked:
        </p>
        <ul className="mt-3 space-y-2 text-[12px] text-ink-dim">
          <li>· "It's the verification layer between you and your brother."</li>
          <li>· "It checks every receipt with AI vision."</li>
          <li>· "It dispatches licensed trustees to your site."</li>
          <li>· "Court-admissible evidence pack if it ever goes south."</li>
          <li>· "Even my aunt uses the WhatsApp bot — no new app to install."</li>
        </ul>
        <div className="mt-4 rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-3 text-[12px] text-ink-dim">
          <Gift className="mr-1 inline h-3 w-3 text-accent-gold" />
          You're 2 referrals from <strong className="text-ink">free for life.</strong>
        </div>
      </aside>
    </div>
  );
}
