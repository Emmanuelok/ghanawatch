"use client";
import { useState, useMemo } from "react";
import {
  Search,
  Book,
  Sparkles,
  Camera,
  Banknote,
  ScanFace,
  Users,
  MessageCircle,
  Shield,
  ScrollText,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";

type Article = { id: string; cat: string; title: string; excerpt: string; icon: any; readMin: number };

const ARTICLES: Article[] = [
  { id: "a-1", cat: "Getting started", title: "How GhanaWatch works in 5 minutes", excerpt: "A short tour of verification, escrow, trustees, and audit ledger.", icon: Sparkles, readMin: 5 },
  { id: "a-2", cat: "Getting started", title: "Onboarding a new project end-to-end", excerpt: "From identity verification to first trustee dispatch.", icon: Book, readMin: 7 },
  { id: "a-3", cat: "KYC & verification", title: "Why we ask for Ghana Card", excerpt: "And what we don't store or share.", icon: ScanFace, readMin: 4 },
  { id: "a-4", cat: "KYC & verification", title: "Liveness check — what to do if it fails", excerpt: "Lighting, glasses, head movement tips.", icon: ScanFace, readMin: 3 },
  { id: "a-5", cat: "Documents", title: "What makes a 'good' receipt", excerpt: "Letterhead, stamp, TIN, MoMo merchant ID, line items.", icon: ScrollText, readMin: 6 },
  { id: "a-6", cat: "Documents", title: "How to challenge an AI verdict", excerpt: "When you think the AI got it wrong, the human review desk is one click away.", icon: Shield, readMin: 4 },
  { id: "a-7", cat: "Site evidence", title: "Why off-site photos get flagged", excerpt: "GPS, scene match, and how to keep photos clean.", icon: Camera, readMin: 4 },
  { id: "a-8", cat: "Site evidence", title: "Drone overhead — when it's worth it", excerpt: "For sites > 0.5 acre, the marginal value is high.", icon: Camera, readMin: 5 },
  { id: "a-9", cat: "Escrow & funds", title: "How milestone escrow releases work", excerpt: "Trustee + evidence + your biometric sign-off.", icon: Banknote, readMin: 6 },
  { id: "a-10", cat: "Escrow & funds", title: "Cancelling an order or holding a release", excerpt: "Step-by-step.", icon: Banknote, readMin: 3 },
  { id: "a-11", cat: "Trustees", title: "How to choose the right trustee", excerpt: "Sector, region, license body, response time.", icon: Users, readMin: 5 },
  { id: "a-12", cat: "Trustees", title: "What a trustee will and won't do", excerpt: "Scope guide.", icon: Users, readMin: 4 },
  { id: "a-13", cat: "Disputes", title: "Raising a dispute step-by-step", excerpt: "When negotiation, mediation, and arbitration each make sense.", icon: ScrollText, readMin: 7 },
  { id: "a-14", cat: "Mobile app", title: "Setting up biometric milestone approval", excerpt: "FaceID, Touch ID, Android.", icon: Sparkles, readMin: 4 },
  { id: "a-15", cat: "Privacy & data", title: "Data we collect — and don't sell", excerpt: "Plain-English DPA summary.", icon: Shield, readMin: 5 },
];

const QUICK_LINKS = [
  { title: "Open the onboarding wizard", href: "/onboarding", icon: Sparkles },
  { title: "Verify a document right now", href: "/verify", icon: Shield },
  { title: "Dispatch a trustee", href: "/network", icon: Users },
  { title: "View live activity", href: "/activity", icon: Camera },
  { title: "Talk to the AI Investigator", href: "/investigator", icon: MessageCircle },
  { title: "API & webhooks", href: "/developers", icon: Book },
];

export function HelpClient() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return ARTICLES;
    return ARTICLES.filter((a) =>
      a.title.toLowerCase().includes(t) ||
      a.excerpt.toLowerCase().includes(t) ||
      a.cat.toLowerCase().includes(t),
    );
  }, [q]);

  const grouped = useMemo(() => {
    const g: Record<string, Article[]> = {};
    for (const a of filtered) (g[a.cat] ??= []).push(a);
    return g;
  }, [filtered]);

  return (
    <div className="mt-8">
      <div className="relative max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search 'milestone', 'KYC', 'dispute', 'WhatsApp'…"
          className="input pl-10 text-[15px] py-3"
        />
      </div>

      <div className="mt-8">
        <div className="mb-3 text-[14px] font-semibold">Quick links</div>
        <div className="grid gap-2 md:grid-cols-3">
          {QUICK_LINKS.map((q) => (
            <a key={q.href} href={q.href} className="card card-hover flex items-center gap-3 px-4 py-3">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-accent-gold/15 text-accent-gold">
                <q.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 text-[13px] font-semibold">{q.title}</div>
              <ChevronRight className="h-4 w-4 text-ink-muted" />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {Object.entries(grouped).map(([cat, arr]) => (
          <section key={cat}>
            <div className="mb-3 text-[14px] font-semibold">{cat}</div>
            <div className="grid gap-2 md:grid-cols-2">
              {arr.map((a) => {
                const Icon = a.icon;
                return (
                  <a key={a.id} href={`#${a.id}`} className="card card-hover flex items-start gap-3 p-4">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-bg-elev">
                      <Icon className="h-4 w-4 text-accent-gold" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold">{a.title}</div>
                      <div className="mt-0.5 text-[12px] text-ink-dim">{a.excerpt}</div>
                      <div className="mt-2 text-[10px] text-ink-muted">{a.readMin} min read</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <div className="card grid place-items-center px-6 py-16 text-center text-[13px] text-ink-dim">
            No articles match — message support directly.
          </div>
        )}
      </div>

      <div className="mt-12 grid gap-4 rounded-2xl border border-line bg-bg-elev/40 p-6 md:grid-cols-3">
        <Contact icon={Mail} title="Email" body="support@ghanawatch.com" sub="4h response (paid), 24h response (free)" />
        <Contact icon={MessageCircle} title="WhatsApp" body="+233 50 222 9999" sub="Mon-Sat 8am-9pm (Accra time)" />
        <Contact icon={Phone} title="Phone (institutional only)" body="+233 30 277 2225" sub="9am-5pm Mon-Fri" />
      </div>
    </div>
  );
}

function Contact({ icon: Icon, title, body, sub }: any) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2"><Icon className="h-4 w-4 text-accent-gold" /><div className="text-[13px] font-semibold">{title}</div></div>
      <div className="text-[13px] text-ink">{body}</div>
      <div className="mt-1 text-[11px] text-ink-muted">{sub}</div>
    </div>
  );
}
