import {
  Award,
  ShieldCheck,
  Users,
  Camera,
  FileText,
  Banknote,
  Sparkles,
  Heart,
  Lock,
  Star,
  TrendingUp,
} from "lucide-react";

export const metadata = { title: "Achievements — GhanaWatch" };

const BADGES = [
  { id: "b-1", title: "First step", desc: "Completed identity verification.", icon: ShieldCheck, color: "#10b981", earned: true, ts: "2026-01-12" },
  { id: "b-2", title: "Project launched", desc: "First project under verification.", icon: Sparkles, color: "#f5b800", earned: true, ts: "2026-01-14" },
  { id: "b-3", title: "Photo discipline", desc: "10 consecutive on-site site photos.", icon: Camera, color: "#3b82f6", earned: true, ts: "2026-02-22" },
  { id: "b-4", title: "Trustee believer", desc: "Dispatched 3 trustees.", icon: Users, color: "#8b5cf6", earned: true, ts: "2026-03-30" },
  { id: "b-5", title: "Forensic eye", desc: "Document forensics caught one flag for you.", icon: FileText, color: "#ef4444", earned: true, ts: "2026-04-10" },
  { id: "b-6", title: "Court-ready", desc: "Generated your first sealed evidence pack.", icon: Lock, color: "#10b981", earned: true, ts: "2026-04-19" },
  { id: "b-7", title: "Five thousand cedi saver", desc: "Avoided GHS 5K+ in fraud loss.", icon: Banknote, color: "#f5b800", earned: true, ts: "2026-05-04" },
  { id: "b-8", title: "Hometown champion", desc: "Joined a hometown room.", icon: Heart, color: "#ec4899", earned: true, ts: "2026-05-07" },
  { id: "b-9", title: "AI investigator", desc: "Used AI Investigator 10 times.", icon: Sparkles, color: "#06b6d4", earned: true, ts: "2026-05-12" },
  { id: "b-10", title: "Half a million tracked", desc: "Reached GHS 500K under tracked value.", icon: TrendingUp, color: "#f5b800", earned: true, ts: "2026-05-18" },
  { id: "b-11", title: "Refer 5", desc: "Get 5 diaspora friends verified.", icon: Star, color: "#f5b800", earned: false, progress: "2/5" },
  { id: "b-12", title: "Year 1", desc: "12 months on GhanaWatch.", icon: Award, color: "#10b981", earned: false, progress: "5/12 months" },
  { id: "b-13", title: "Million-cedi diaspora", desc: "GHS 1M+ tracked value.", icon: Banknote, color: "#f5b800", earned: false, progress: "GHS 2.35M tracked - earned next tier" },
  { id: "b-14", title: "Zero-flag year", desc: "12 months with no critical flags.", icon: ShieldCheck, color: "#10b981", earned: false, progress: "in progress" },
];

const TIERS = [
  { name: "Bronze", req: "5+ badges", colour: "#cd7f32", current: false },
  { name: "Silver", req: "10+ badges", colour: "#c0c0c0", current: true },
  { name: "Gold", req: "15+ badges", colour: "#f5b800", current: false },
  { name: "Platinum", req: "20+ badges + 12 months", colour: "#e5e4e2", current: false },
];

export default function AchievementsPage() {
  const earned = BADGES.filter((b) => b.earned).length;
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Award className="h-3 w-3" /> Achievements
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your track record on GhanaWatch.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Badges aren't vanity — they're public-facing signals of safe practice. Diaspora users with
          higher tiers get faster trustee dispatch, lower escrow fees, and priority human review.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {TIERS.map((t) => (
          <div key={t.name} className={`card p-5 ${t.current ? "border-accent-gold/60 glow-gold" : ""}`}>
            <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{t.req}</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight" style={{ color: t.colour }}>{t.name}</div>
            {t.current && <div className="mt-1 text-[11px] text-accent-gold">★ current tier</div>}
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-baseline justify-between">
        <div className="text-[14px] font-semibold">{earned} / {BADGES.length} badges earned</div>
        <div className="text-[11px] text-ink-muted">5 more to reach Gold</div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bg-subtle">
        <div className="h-full bg-gradient-to-r from-accent-gold to-accent-green" style={{ width: `${(earned / BADGES.length) * 100}%` }} />
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {BADGES.map((b) => {
          const I = b.icon;
          return (
            <div key={b.id} className={`card p-5 ${b.earned ? "" : "opacity-60"}`}>
              <div className="flex items-start gap-3">
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                  style={{ background: b.earned ? `${b.color}15` : "rgba(154,160,176,0.08)", border: `1px solid ${b.earned ? b.color + "30" : "#222633"}` }}
                >
                  {b.earned ? <I className="h-5 w-5" style={{ color: b.color }} /> : <Lock className="h-4 w-4 text-ink-muted" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold">{b.title}</div>
                  <div className="mt-0.5 text-[12px] text-ink-dim">{b.desc}</div>
                  {b.earned ? (
                    <div className="mt-2 text-[10px] text-accent-green">Earned {b.ts}</div>
                  ) : (
                    <div className="mt-2 text-[10px] text-ink-muted">{(b as any).progress}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
