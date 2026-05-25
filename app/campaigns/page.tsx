import { Mail, MessageCircle, Bell, Users, TrendingUp, Calendar, Send, Sparkles } from "lucide-react";

export const metadata = { title: "Customer success campaigns — GhanaWatch" };

const CAMPAIGNS = [
  { id: "c-1", name: "Onboarding day-0 → day-30", channel: "email + push", sent: 8_412, openRate: 71, ctr: 38, conv: 24, active: true },
  { id: "c-2", name: "First trustee dispatch nudge (day 7)", channel: "WhatsApp + push", sent: 6_180, openRate: 88, ctr: 52, conv: 41, active: true },
  { id: "c-3", name: "Quarterly trust-report digest", channel: "email", sent: 9_240, openRate: 64, ctr: 28, conv: 18, active: true },
  { id: "c-4", name: "Diaspora bond Series A awareness", channel: "email + in-app", sent: 8_950, openRate: 58, ctr: 21, conv: 12, active: true },
  { id: "c-5", name: "Hometown room invite (regional match)", channel: "push", sent: 3_420, openRate: 81, ctr: 64, conv: 48, active: true },
  { id: "c-6", name: "Stalled-project re-engagement (60d inactive)", channel: "WhatsApp + email", sent: 412, openRate: 78, ctr: 44, conv: 32, active: false },
];

const NUDGES = [
  { time: "09:00", title: "Morning portfolio summary", channel: "email", segment: "Guard tier" },
  { time: "12:30", title: "Lunchtime: any actions needed?", channel: "push", segment: "All users with open alerts" },
  { time: "15:00", title: "Trustee dispatch suggestion", channel: "WhatsApp", segment: "Users with milestone due in 7d" },
  { time: "20:00", title: "End-of-day ledger commit", channel: "email digest opt-in", segment: "Subscribed" },
];

export default function CampaignsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Mail className="h-3 w-3" /> Customer success
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Drip campaigns + smart nudges.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          The platform automates onboarding, education, retention, and re-engagement across email,
          WhatsApp, and push. Templated by GhanaWatch's customer success team; sent only when the
          user's signal-state warrants it.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Kpi icon={Users} label="Reached (30d)" value="8,950" />
        <Kpi icon={TrendingUp} label="Avg open rate" value="74%" color="#10b981" />
        <Kpi icon={MessageCircle} label="Avg CTR" value="42%" color="#f5b800" />
        <Kpi icon={Send} label="Active campaigns" value={`${CAMPAIGNS.filter((c) => c.active).length}`} />
      </div>

      <div className="mt-8 card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 px-5 py-3 text-[14px] font-semibold">Active campaigns</div>
        <table className="w-full text-[12px]">
          <thead className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            <tr className="border-b border-line">
              <th className="px-5 py-3">Campaign</th>
              <th className="px-3 py-3">Channels</th>
              <th className="px-3 py-3 text-right">Sent</th>
              <th className="px-3 py-3 text-right">Open</th>
              <th className="px-3 py-3 text-right">CTR</th>
              <th className="px-3 py-3 text-right">Conversion</th>
              <th className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3 text-ink">{c.name}</td>
                <td className="px-3 py-3 text-ink-dim">{c.channel}</td>
                <td className="px-3 py-3 text-right text-ink-dim">{c.sent.toLocaleString()}</td>
                <td className="px-3 py-3 text-right">{c.openRate}%</td>
                <td className="px-3 py-3 text-right">{c.ctr}%</td>
                <td className="px-3 py-3 text-right font-semibold text-accent-green">{c.conv}%</td>
                <td className="px-5 py-3 text-right">
                  <span className="chip" style={{ color: c.active ? "#10b981" : "#9aa0b0" }}>{c.active ? "active" : "paused"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Calendar className="h-4 w-4 text-accent-gold" /> Today's scheduled nudges</div>
          <div className="space-y-2">
            {NUDGES.map((n, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md border border-line bg-bg-elev/40 p-3">
                <span className="font-mono text-[11px] text-ink-muted">{n.time}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold">{n.title}</div>
                  <div className="text-[10px] text-ink-dim">{n.channel} → {n.segment}</div>
                </div>
                <Bell className="h-3.5 w-3.5 text-ink-muted" />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Sparkles className="h-4 w-4 text-accent-gold" /> AI-generated message previews</div>
          <div className="space-y-3 text-[12px]">
            <div className="rounded-md border border-line bg-bg-elev/40 p-3">
              <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">WhatsApp · Kwame Mensah (Manager)</div>
              <div className="mt-1 text-ink">Hi Kwame 👋 reminder: cement re-supply for Akosua's site is due. Want to use the RFQ marketplace to get bids?</div>
            </div>
            <div className="rounded-md border border-line bg-bg-elev/40 p-3">
              <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Email · Akosua Mensah (Diaspora user)</div>
              <div className="mt-1 text-ink">Hey Akosua, your trustee Kojo's site visit landed: 1 cleared milestone + 1 open alert. Tap to review and approve M4.</div>
            </div>
            <div className="rounded-md border border-line bg-bg-elev/40 p-3">
              <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Push · All Greater Accra users</div>
              <div className="mt-1 text-ink">⚠ New fraud pattern alert in East Legon Hills — read more before your next title transaction.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, color }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight" style={color ? { color } : {}}>{value}</div>
    </div>
  );
}
