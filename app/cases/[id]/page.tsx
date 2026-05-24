import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  Banknote,
  Calendar,
  User,
  ScrollText,
  Sparkles,
  Lightbulb,
  ShieldAlert,
  FileText,
  ArrowRight,
} from "lucide-react";
import {
  getCase,
  PROJECTS,
  DOCUMENTS,
  SITE_PHOTOS,
  ALERTS,
} from "@/lib/mock-data";
import { CaseActions } from "./actions";

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getCase(id);
  if (!c) notFound();
  const project = PROJECTS.find((p) => p.id === c.projectId);
  const sevColor =
    c.severity === "critical"
      ? "#ef4444"
      : c.severity === "high"
      ? "#f59e0b"
      : c.severity === "med"
      ? "#3b82f6"
      : "#9aa0b0";

  // gather evidence items
  const evidence = c.evidenceItemIds
    .map((eid) => {
      const d = DOCUMENTS.find((x) => x.id === eid);
      if (d) return { kind: "doc" as const, item: d };
      const p = SITE_PHOTOS.find((x) => x.id === eid);
      if (p) return { kind: "photo" as const, item: p };
      const a = ALERTS.find((x) => x.id === eid);
      if (a) return { kind: "alert" as const, item: a };
      return null;
    })
    .filter(Boolean) as Array<
    | { kind: "doc"; item: (typeof DOCUMENTS)[number] }
    | { kind: "photo"; item: (typeof SITE_PHOTOS)[number] }
    | { kind: "alert"; item: (typeof ALERTS)[number] }
  >;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <Link href="/cases" className="mb-6 inline-flex items-center gap-2 text-[12px] text-ink-dim hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> All cases
      </Link>

      <div className="card overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="chip uppercase tracking-wider"
              style={{ color: sevColor, borderColor: `${sevColor}30`, background: `${sevColor}10` }}
            >
              <ShieldAlert className="h-3 w-3" /> {c.severity}
            </span>
            <span className="chip">{c.status.replace("-", " ")}</span>
            {project && <Link href={`/projects/${project.id}`} className="chip">{project.name}</Link>}
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{c.title}</h1>
          <p className="mt-3 max-w-4xl text-[14px] text-ink-dim">{c.summary}</p>

          <div className="mt-5 grid gap-3 text-[13px] md:grid-cols-4">
            <Field icon={User} label="Lead" value={c.lead} />
            <Field icon={Calendar} label="Opened" value={c.openedAt.slice(0, 10)} />
            <Field icon={Calendar} label="Last update" value={c.lastUpdated.slice(0, 10)} />
            <Field icon={Banknote} label="Potential exposure" value={`GHS ${c.potentialLossGHS.toLocaleString()}`} />
          </div>
        </div>

        <CaseActions caseId={c.id} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Hypothesis */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-accent-gold" />
            <div className="text-[14px] font-semibold">Investigator's hypothesis</div>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-dim">{c.hypothesis}</p>
        </div>

        {/* Actions */}
        <div className="card p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-gold" />
            <div className="text-[14px] font-semibold">Recommended actions</div>
          </div>
          <ol className="mt-3 space-y-2 text-[13px]">
            {c.recommendedActions.map((a, i) => (
              <li key={i} className="flex gap-2 text-ink-dim">
                <span className="font-semibold text-ink">{i + 1}.</span>
                <span>{a}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Timeline */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-accent-gold" />
            <div className="text-[14px] font-semibold">Case timeline</div>
          </div>
          <div className="mt-4 space-y-3">
            {c.timeline.map((t, i) => (
              <div key={i} className="flex gap-3 text-[13px]">
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line bg-bg-elev text-[10px] text-ink-muted">
                  {i + 1}
                </div>
                <div>
                  <div className="text-ink">{t.note}</div>
                  <div className="mt-0.5 text-[11px] text-ink-muted">
                    {t.actor} · {new Date(t.ts).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence */}
        <div className="card p-5">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent-gold" />
            <div className="text-[14px] font-semibold">Evidence ledger</div>
          </div>
          <div className="mt-3 space-y-2">
            {evidence.map((e, i) => {
              if (e.kind === "doc") {
                return (
                  <div key={i} className="rounded-lg border border-line bg-bg-elev/40 p-3 text-[12px]">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">DOC · {e.item.type}</div>
                    <div className="mt-1 text-ink">{e.item.name}</div>
                    <div className="mt-1 text-ink-dim">authenticity: {e.item.authenticityScore}%</div>
                  </div>
                );
              }
              if (e.kind === "photo") {
                return (
                  <div key={i} className="rounded-lg border border-line bg-bg-elev/40 p-3 text-[12px]">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">PHOTO · site</div>
                    <div className="mt-1 text-ink">{e.item.caption}</div>
                    <div className="mt-1 text-ink-dim">
                      scene match {e.item.sceneMatchScore}% · GPS Δ {e.item.distanceM}m
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className="rounded-lg border border-line bg-bg-elev/40 p-3 text-[12px]">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">ALERT · {e.item.severity}</div>
                  <div className="mt-1 text-ink">{e.item.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {project && (
        <div className="mt-6">
          <Link href={`/projects/${project.id}`} className="btn btn-ghost">
            Open underlying project <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

function Field({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" />
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.1em] text-ink-muted">{label}</div>
        <div className="truncate text-[13px] text-ink">{value}</div>
      </div>
    </div>
  );
}
