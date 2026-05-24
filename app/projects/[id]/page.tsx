import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  User,
  Calendar,
  Banknote,
  Shield,
  Globe2,
  ShieldCheck,
  Camera,
  GanttChartSquare,
  MessageSquare,
  ScrollText,
  TrendingUp,
} from "lucide-react";
import {
  getProject,
  getDocsByProject,
  getPhotosByProject,
  getMilestonesByProject,
  getAuditByProject,
  getAlertsByProject,
  getCasesByProject,
  TRUSTEES,
  BENCHMARKS,
} from "@/lib/mock-data";
import { ProjectThumbnail } from "@/components/project-thumbnail";
import { SectorBadge } from "@/components/sector-icon";
import { RiskDial, TrustGauge } from "@/components/risk-dial";
import { DocumentCard } from "@/components/document-card";
import { SitePhotoCard } from "@/components/site-photo-card";
import { AuditLedger } from "@/components/audit-ledger";
import { MilestoneList } from "@/components/milestone-list";
import { TimeSeries } from "@/components/timeseries";
import { Sparkline } from "@/components/sparkline";
import { RiskExplainer } from "@/components/risk-explainer";
import { ParcelMap } from "@/components/parcel-map";
import { SignatoriesPanel } from "@/components/signatories";
import { AssemblyAttestationCard, type AssemblyAttestation } from "@/components/assembly-attestation";
import { ProjectChat } from "@/components/project-chat";
import { ProjectHealth } from "@/components/project-health";
import { DroneGallery } from "@/components/drone-gallery";
import { PresenceIndicator } from "@/components/presence-indicator";
import { ExpectedProgress } from "@/components/expected-progress";
import { TimeMachine } from "@/components/time-machine";
import { PARCELS } from "@/lib/parcels";
import { SIGNATORIES } from "@/lib/mock-data";
import { ProjectTabs } from "./tabs";
import { ProjectActions } from "./project-actions";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const docs = getDocsByProject(id);
  const photos = getPhotosByProject(id);
  const milestones = getMilestonesByProject(id);
  const audit = getAuditByProject(id);
  const alerts = getAlertsByProject(id);
  const cases = getCasesByProject(id);

  const trustee =
    project.sector === "real-estate"
      ? TRUSTEES.find((t) => t.id === "tr-2")
      : project.sector === "construction"
      ? TRUSTEES.find((t) => t.id === "tr-1")
      : project.sector === "vehicle-import"
      ? TRUSTEES.find((t) => t.id === "tr-5")
      : project.sector === "medical"
      ? TRUSTEES.find((t) => t.id === "tr-4")
      : project.sector === "agriculture"
      ? TRUSTEES.find((t) => t.id === "tr-6")
      : TRUSTEES.find((t) => t.id === "tr-3");

  const benchmarks = relevantBenchmarks(project.sector);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/projects" className="inline-flex items-center gap-2 text-[12px] text-ink-dim hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> All projects
        </Link>
        <PresenceIndicator projectName={project.name} />
      </div>

      <div className="card overflow-hidden">
        <ProjectThumbnail sector={project.sector} />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <SectorBadge sector={project.sector} />
                <span className={`chip ${project.risk === "high" ? "risk-high" : project.risk === "med" ? "risk-med" : "risk-low"}`}>
                  Risk {project.riskScore}
                </span>
                {alerts.length > 0 && (
                  <span className="chip risk-high">
                    <AlertTriangle className="h-3 w-3" /> {alerts.length} active alerts
                  </span>
                )}
                {cases.length > 0 && (
                  <Link href={`/cases/${cases[0].id}`} className="chip risk-high hover:opacity-90">
                    <Shield className="h-3 w-3" /> {cases.length} forensic case{cases.length > 1 ? "s" : ""}
                  </Link>
                )}
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{project.name}</h1>
              <p className="mt-2 max-w-3xl text-[14px] text-ink-dim">{project.summary}</p>

              <div className="mt-5 grid gap-4 text-[13px] md:grid-cols-3">
                <Field icon={MapPin} label="Location" value={`${project.location}, ${project.region}`} />
                <Field icon={Globe2} label="Diaspora owner" value={`${project.diasporaOwner} · ${project.ownerLocation}`} />
                <Field icon={User} label="Managed by" value={`${project.managedBy} (${project.managedByRelation})`} />
                <Field icon={Calendar} label="Timeline" value={`${project.startDate} → ${project.targetCompletion}`} />
                <Field icon={Banknote} label="Budget" value={`GHS ${project.budgetGHS.toLocaleString()} (${Math.round((project.spentGHS / project.budgetGHS) * 100)}% deployed)`} />
                <Field icon={GanttChartSquare} label="Progress" value={`${project.progress}%`} />
              </div>
            </div>

            <div className="flex w-full items-center gap-6 rounded-xl border border-line bg-bg-elev/40 p-5 md:w-auto">
              <RiskDial score={project.riskScore} />
              <div className="min-w-[180px]">
                <TrustGauge score={project.trustScore} />
                <div className="mt-2"><Sparkline data={project.trustHistory.slice(-40)} color="#10b981" width={180} height={28} /></div>
                <div className="mt-4 space-y-1.5 text-[12px]">
                  <Row label="Milestones verified" value={`${project.verifiedMilestones}/${project.totalMilestones}`} />
                  <Row label="Documents" value={`${docs.length}`} />
                  <Row label="Site evidence" value={`${photos.length}`} />
                  <Row label="Audit events" value={`${audit.length}`} />
                </div>
              </div>
            </div>
          </div>

          <ProjectActions projectId={project.id} projectName={project.name} trustee={trustee!} />
        </div>
      </div>

      {/* ALERT BAR */}
      {alerts.length > 0 && (
        <div className="mt-6 rounded-xl border border-risk-high/30 bg-risk-high/5 p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-risk-high" />
            <div className="text-[14px] font-semibold text-risk-high">
              {alerts.length} active alert{alerts.length > 1 ? "s" : ""} require your attention
            </div>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {alerts.map((a) => (
              <div key={a.id} className="rounded-lg border border-line bg-bg-elev/60 p-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`chip ${a.severity === "critical" ? "risk-high" : "risk-med"}`}
                    style={{ textTransform: "uppercase" }}
                  >
                    {a.severity}
                  </span>
                  <span className="text-[13px] font-semibold">{a.title}</span>
                </div>
                <p className="mt-1 text-[12px] text-ink-dim">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI HEALTH + EXPECTED PROGRESS */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ProjectHealth projectId={project.id} />
        <ExpectedProgress project={project} />
      </div>

      <div className="mt-4">
        <TimeMachine project={project} events={audit} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[14px] font-semibold">Trust score · risk score</div>
              <div className="text-[11px] text-ink-dim">Since project creation, daily snapshot</div>
            </div>
            <span className="chip"><TrendingUp className="h-3 w-3" /> Updated 4h ago</span>
          </div>
          <TimeSeries
            height={180}
            yMin={0}
            yMax={100}
            series={[
              { name: "Trust", color: "#10b981", data: project.trustHistory },
              { name: "Risk", color: "#ef4444", data: project.riskHistory },
            ]}
          />
        </div>
        <RiskExplainer project={project} />
      </div>

      {SIGNATORIES[project.id] && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <SignatoriesPanel signatories={SIGNATORIES[project.id]} />
          <AssemblyAttestationCard a={buildAttestation(project.id, project.managedBy, project.location)} />
        </div>
      )}

      {benchmarks.length > 0 && (
        <div className="mt-4 card p-5">
          <div className="text-[14px] font-semibold">Sector benchmarks</div>
          <div className="text-[11px] text-ink-dim">Median market rates for this project's sector / region — flag any quote outside the p10/p90 band</div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {benchmarks.map((b) => (
              <div key={b.id} className="rounded-md border border-line bg-bg-elev/40 p-3 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-ink">{b.item}</span>
                  <span className="font-semibold text-ink">GHS {b.medianGHS.toLocaleString()}</span>
                </div>
                <div className="mt-1 text-[11px] text-ink-muted">
                  per {b.unit} · {b.region} · p10 {b.p10.toLocaleString()} / p90 {b.p90.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ProjectTabs
        docsTab={
          <div className="grid gap-3 md:grid-cols-2">
            {docs.map((d) => (
              <DocumentCard key={d.id} doc={d} />
            ))}
            {docs.length === 0 && <Empty>No documents uploaded yet.</Empty>}
          </div>
        }
        photosTab={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {photos.map((p) => (
              <SitePhotoCard key={p.id} photo={p} />
            ))}
            {photos.length === 0 && <Empty>No site evidence yet — request a photo or dispatch a trustee.</Empty>}
          </div>
        }
        mapTab={
          <div className="card overflow-hidden p-2">
            <ParcelMap project={project} />
            {PARCELS[project.id] && (
              <div className="border-t border-line p-4 text-[12px]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-ink-muted">Parcel:</span>{" "}
                    <span className="text-ink">{PARCELS[project.id].meta.name}</span>
                  </div>
                  <span
                    className={`chip ${
                      PARCELS[project.id].meta.status === "encroachment"
                        ? "risk-high"
                        : PARCELS[project.id].meta.status === "disputed"
                        ? "risk-med"
                        : "risk-low"
                    }`}
                  >
                    {PARCELS[project.id].meta.status}
                  </span>
                </div>
                {PARCELS[project.id].meta.encroachment && (
                  <p className="mt-2 text-ink-dim">
                    {PARCELS[project.id].meta.encroachment!.note} (red overlay)
                  </p>
                )}
              </div>
            )}
          </div>
        }
        milestonesTab={
          milestones.length > 0 ? <MilestoneList milestones={milestones} /> : <Empty>No milestones defined.</Empty>
        }
        ledgerTab={<AuditLedger events={audit} />}
        casesTab={
          cases.length === 0 ? (
            <Empty>No forensic cases open. Threshold-crossing signals will auto-open one.</Empty>
          ) : (
            <div className="space-y-3">
              {cases.map((c) => (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="card card-hover block p-5"
                >
                  <div className="flex items-center gap-2">
                    <span className="chip risk-high uppercase tracking-wider">{c.severity}</span>
                    <span className="chip">{c.status.replace("-", " ")}</span>
                  </div>
                  <div className="mt-2 text-[15px] font-semibold">{c.title}</div>
                  <p className="mt-1 text-[13px] text-ink-dim">{c.summary}</p>
                  <div className="mt-3 text-[11px] text-ink-muted">
                    Lead: {c.lead} · Exposure: GHS {c.potentialLossGHS.toLocaleString()}
                  </div>
                </Link>
              ))}
            </div>
          )
        }
        trusteeTab={
          trustee && (
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-accent-gold to-accent-green text-[16px] font-semibold text-bg">
                    {trustee.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-[16px] font-semibold">{trustee.name}</div>
                    <div className="text-[13px] text-ink-dim">{trustee.profession}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="chip"><Shield className="h-3 w-3" /> Verified by {trustee.verifiedBy}</span>
                      <span className="chip">★ {trustee.rating}</span>
                      <span className="chip">{trustee.jobsCompleted} jobs · {trustee.yearsActive}y experience</span>
                      {trustee.availableNow && <span className="chip risk-low">Available now</span>}
                    </div>
                    <p className="mt-3 text-[13px] text-ink-dim">{trustee.bio}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {trustee.specialties.map((s) => (
                        <span key={s} className="chip">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[13px]">
                  <Row label="Region" value={trustee.region} />
                  <Row label="Fee range" value={trustee.feeRange} />
                  <Row label="Typical response" value={`${trustee.responseHours}h`} />
                </div>
              </div>
              <div className="card p-5">
                <div className="text-[14px] font-semibold">How trustee dispatch works</div>
                <ol className="mt-3 space-y-3 text-[13px] text-ink-dim">
                  <li><strong className="text-ink">1.</strong> You approve a scope (photos, BOQ check, boundary survey, ward visit).</li>
                  <li><strong className="text-ink">2.</strong> Trustee accepts in &lt; 24h; deposit held in escrow.</li>
                  <li><strong className="text-ink">3.</strong> On-site visit within 72h. Geo-stamped photos + signed report uploaded.</li>
                  <li><strong className="text-ink">4.</strong> Report becomes a ledger event; fee released on your sign-off.</li>
                </ol>
              </div>
            </div>
          )
        }
        chatTab={<ProjectChat projectId={project.id} />}
        droneTab={<DroneGallery project={project} />}
      />
    </div>
  );
}

function relevantBenchmarks(sector: string) {
  if (sector === "construction") return BENCHMARKS.filter((b) => ["material","labor"].includes(b.category)).slice(0, 5);
  if (sector === "real-estate") return BENCHMARKS.filter((b) => b.category === "labor").slice(0, 3);
  if (sector === "vehicle-import") return BENCHMARKS.filter((b) => b.category === "import-duty");
  if (sector === "funeral") return BENCHMARKS.filter((b) => b.category === "funeral");
  if (sector === "medical") return BENCHMARKS.filter((b) => b.category === "medical");
  if (sector === "education") return BENCHMARKS.filter((b) => b.category === "education");
  return [];
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="card grid place-items-center px-6 py-16 text-center text-[13px] text-ink-dim">
      {children}
    </div>
  );
}

function buildAttestation(projectId: string, manager: string, location: string): AssemblyAttestation {
  const electoralArea =
    projectId === "kasoa-4bed" ? "Akweley · Awutu Senya East"
      : projectId === "east-legon-plot" ? "Adjiringanor · Ayawaso West"
      : projectId === "kumasi-shop" ? "Adum · Subin"
      : projectId === "ho-poultry" ? "Ho Central · Ho Municipal"
      : projectId === "takoradi-funeral" ? "Effia · Effia-Kwesimintsim"
      : projectId === "tamale-school" ? "Tamale South · Tamale Metropolitan"
      : "Various";
  const district = location.split(",").slice(-1)[0]?.trim() || "—";
  const assemblyMember =
    projectId === "kasoa-4bed" ? "Comfort Owusu-Pomaa"
      : projectId === "east-legon-plot" ? "Edward Asante Boateng"
      : projectId === "kumasi-shop" ? "Yaa Konadu Twumasi"
      : projectId === "ho-poultry" ? "Mawuli Senanu Agbeko"
      : projectId === "takoradi-funeral" ? "Esther Aidoo"
      : projectId === "tamale-school" ? "Alhaji Ibrahim Tahidu"
      : "—";
  const docRef = `AM-ATT/2026/${projectId.slice(0, 5).toUpperCase()}-${Math.abs(hashCode(projectId)) % 10000}`;
  return {
    electoralArea,
    district,
    assemblyMember,
    electedYear: 2023,
    attestedFor: manager,
    attestedAt: "2026-04-02",
    documentRef: docRef,
    contactNumber: "+233 24 555 " + (String(Math.abs(hashCode(projectId)) % 10000).padStart(4, "0")),
    signatureHash: "0x" + Math.abs(hashCode(projectId + manager)).toString(16).padStart(10, "0").slice(0, 10) + "…",
  };
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
