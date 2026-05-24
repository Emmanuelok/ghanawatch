import Link from "next/link";
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Banknote,
  Users,
  FileSearch,
  Globe2,
  ArrowUpRight,
  ArrowRight,
  Clock,
} from "lucide-react";
import { PROJECTS, ALERTS, AUDIT_EVENTS, PLATFORM_STATS } from "@/lib/mock-data";
import { SectorBadge } from "@/components/sector-icon";
import { ProjectThumbnail } from "@/components/project-thumbnail";
import { TrustGauge } from "@/components/risk-dial";

export default function Dashboard() {
  const totalBudget = PROJECTS.reduce((s, p) => s + p.budgetGHS, 0);
  const totalSpent = PROJECTS.reduce((s, p) => s + p.spentGHS, 0);
  const activeAlerts = ALERTS.length;
  const projectsByRisk = {
    high: PROJECTS.filter((p) => p.risk === "high").length,
    med: PROJECTS.filter((p) => p.risk === "med").length,
    low: PROJECTS.filter((p) => p.risk === "low").length,
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[12px] uppercase tracking-[0.14em] text-ink-muted">Diaspora dashboard</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Welcome back, Akosua</h1>
          <p className="mt-1 text-[14px] text-ink-dim">
            Toronto, Canada · You are watching {PROJECTS.length} projects across {new Set(PROJECTS.map((p) => p.region)).size} regions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/verify" className="btn btn-ghost"><FileSearch className="h-4 w-4" /> Verify a document</Link>
          <Link href="/projects" className="btn btn-primary">All projects <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>

      {/* TOP STATS */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard
          icon={Banknote}
          label="Tracked value"
          value={`GHS ${(totalBudget / 1e6).toFixed(2)}M`}
          sub={`${((totalSpent / totalBudget) * 100).toFixed(0)}% deployed`}
          accent="#f5b800"
        />
        <StatCard
          icon={ShieldCheck}
          label="Fraud prevented (you)"
          value="GHS 412,000"
          sub="3 flagged transactions blocked"
          accent="#10b981"
        />
        <StatCard
          icon={AlertTriangle}
          label="Open alerts"
          value={`${activeAlerts}`}
          sub={`${ALERTS.filter((a) => a.severity === "critical").length} critical · ${ALERTS.filter((a) => a.severity === "warning").length} warning`}
          accent="#ef4444"
        />
        <StatCard
          icon={Activity}
          label="Audit events (30d)"
          value="217"
          sub="Hash chain intact ✓"
          accent="#3b82f6"
        />
      </div>

      {/* MAIN GRID */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* LEFT — projects + portfolio */}
        <div className="space-y-6">
          {/* Risk distribution */}
          <div className="card p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold">Portfolio risk distribution</div>
                <div className="text-[12px] text-ink-dim">Risk score updated every 4 hours from forensic + site signals</div>
              </div>
              <span className="chip"><TrendingUp className="h-3 w-3" /> 2 projects worsened this week</span>
            </div>

            <div className="flex h-3 w-full overflow-hidden rounded-full bg-bg-subtle">
              <div className="bg-risk-low" style={{ width: `${(projectsByRisk.low / PROJECTS.length) * 100}%` }} />
              <div className="bg-risk-med" style={{ width: `${(projectsByRisk.med / PROJECTS.length) * 100}%` }} />
              <div className="bg-risk-high" style={{ width: `${(projectsByRisk.high / PROJECTS.length) * 100}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-[12px]">
              <div>
                <div className="text-[22px] font-semibold text-risk-low">{projectsByRisk.low}</div>
                <div className="text-ink-muted">Low risk</div>
              </div>
              <div>
                <div className="text-[22px] font-semibold text-risk-med">{projectsByRisk.med}</div>
                <div className="text-ink-muted">Medium</div>
              </div>
              <div>
                <div className="text-[22px] font-semibold text-risk-high">{projectsByRisk.high}</div>
                <div className="text-ink-muted">High risk</div>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div className="text-[15px] font-semibold">Active projects</div>
              <Link href="/projects" className="text-[12px] text-ink-dim hover:text-ink">View all →</Link>
            </div>
            <div className="divide-y divide-line">
              {PROJECTS.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-bg-elev/50"
                >
                  <div className="hidden md:block">
                    <div className="h-12 w-16 overflow-hidden rounded-md">
                      <ProjectThumbnail sector={p.sector} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-[14px] font-semibold">{p.name}</div>
                      {p.alerts > 0 && (
                        <span className="chip risk-high"><AlertTriangle className="h-3 w-3" /> {p.alerts}</span>
                      )}
                    </div>
                    <div className="mt-0.5 truncate text-[12px] text-ink-dim">
                      {p.location} · Managed by {p.managedBy} ({p.managedByRelation})
                    </div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-bg-subtle">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent-gold to-accent-green"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="hidden text-right md:block">
                    <div className="text-[13px] font-semibold">GHS {(p.spentGHS / 1000).toFixed(0)}K</div>
                    <div className="text-[11px] text-ink-muted">of {p.budgetGHS.toLocaleString()}</div>
                  </div>
                  <div className={`chip ${p.risk === "high" ? "risk-high" : p.risk === "med" ? "risk-med" : "risk-low"}`}>
                    {p.riskScore}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink-muted" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — alerts + recent audit */}
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="text-[14px] font-semibold">Active alerts</div>
              <span className="chip risk-high">{activeAlerts}</span>
            </div>
            <div className="divide-y divide-line">
              {ALERTS.slice(0, 5).map((a) => {
                const proj = PROJECTS.find((p) => p.id === a.projectId);
                return (
                  <Link
                    key={a.id}
                    href={`/projects/${a.projectId}`}
                    className="block px-5 py-3.5 transition-colors hover:bg-bg-elev/50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                          a.severity === "critical"
                            ? "bg-risk-high/15 text-risk-high"
                            : "bg-risk-med/15 text-risk-med"
                        }`}
                      >
                        <AlertTriangle className="h-3 w-3" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-semibold">{a.title}</div>
                        <div className="mt-0.5 line-clamp-2 text-[12px] text-ink-dim">{a.detail}</div>
                        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-ink-muted">
                          <span>{proj?.name}</span>
                          <span>·</span>
                          <span>{relTime(a.ts)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="text-[14px] font-semibold">Live audit ledger</div>
              <span className="chip">
                <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-accent-green" />
                hash-chain ok
              </span>
            </div>
            <div className="max-h-[400px] divide-y divide-line overflow-y-auto scroll-shadow">
              {AUDIT_EVENTS.slice(0, 10).map((e) => (
                <div key={e.id} className="px-5 py-3">
                  <div className="text-[12px] text-ink">{e.action}</div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-muted">
                    <Clock className="h-3 w-3" />
                    {relTime(e.ts)}
                    <span>·</span>
                    <span>{e.actor}</span>
                  </div>
                  <div className="hash-mono mt-1.5">{e.hash}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PLATFORM STATS */}
      <div className="mt-8 grid gap-4 rounded-2xl border border-line bg-bg-elev/40 p-6 md:grid-cols-4">
        <PlatformStat icon={Globe2} label="Countries served" value={`${PLATFORM_STATS.countriesServed}`} />
        <PlatformStat icon={Users} label="Diaspora users" value={PLATFORM_STATS.diasporaUsers.toLocaleString()} />
        <PlatformStat icon={ShieldCheck} label="Trustees active" value={PLATFORM_STATS.trusteesActive.toLocaleString()} />
        <PlatformStat icon={FileSearch} label="Documents analysed" value={PLATFORM_STATS.documentsAnalyzed.toLocaleString()} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, accent }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
        <div
          className="grid h-7 w-7 place-items-center rounded-md"
          style={{ background: `${accent}15`, color: accent }}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-0.5 text-[12px] text-ink-dim">{sub}</div>
    </div>
  );
}

function PlatformStat({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-bg-elev">
        <Icon className="h-4 w-4 text-accent-gold" />
      </div>
      <div>
        <div className="text-[18px] font-semibold leading-none">{value}</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
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
  const m = Math.floor(diff / 60000);
  return `${m}m ago`;
}
