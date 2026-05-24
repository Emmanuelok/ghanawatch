import Link from "next/link";
import { PROJECTS } from "@/lib/mock-data";
import { SectorBadge } from "@/components/sector-icon";
import { ProjectThumbnail } from "@/components/project-thumbnail";
import { Sparkline } from "@/components/sparkline";
import { ArrowUpRight, AlertTriangle, MapPin, User, Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[12px] uppercase tracking-[0.14em] text-ink-muted">Portfolio</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">All projects</h1>
          <p className="mt-1 text-[14px] text-ink-dim">
            Every venture you fund from abroad, continuously verified.
          </p>
        </div>
        <Link href="/new-project" className="btn btn-primary"><Plus className="h-4 w-4" /> New project</Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <Link key={p.id} href={`/projects/${p.id}`} className="card card-hover overflow-hidden">
            <ProjectThumbnail sector={p.sector} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold">{p.name}</div>
                  <div className="mt-1 flex items-center gap-1 text-[12px] text-ink-dim">
                    <MapPin className="h-3 w-3" />
                    {p.location}
                  </div>
                </div>
                <span className={`chip ${p.risk === "high" ? "risk-high" : p.risk === "med" ? "risk-med" : "risk-low"}`}>
                  {p.riskScore}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-[13px] text-ink-dim">{p.summary}</p>

              <div className="mt-4 flex items-center gap-2">
                <SectorBadge sector={p.sector} />
                {p.alerts > 0 && (
                  <span className="chip risk-high"><AlertTriangle className="h-3 w-3" /> {p.alerts}</span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-[12px]">
                <div>
                  <div className="text-ink-muted">Budget</div>
                  <div className="font-semibold text-ink">GHS {(p.budgetGHS / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-ink-muted">Progress</div>
                  <div className="font-semibold text-ink">{p.progress}%</div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-ink-muted">
                      <User className="h-3 w-3" /> {p.managedBy} <span className="opacity-70">({p.managedByRelation})</span>
                    </span>
                    <span className="text-ink-muted">Trust history</span>
                  </div>
                  <div className="mt-1">
                    <Sparkline
                      data={p.trustHistory.slice(-30)}
                      width={260}
                      height={28}
                      color={p.risk === "high" ? "#ef4444" : p.risk === "med" ? "#f59e0b" : "#10b981"}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[12px] text-ink-dim">
                <span>Open project</span>
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
