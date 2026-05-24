import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Camera,
  FileText,
  Users,
  Fingerprint,
  Stamp,
  ExternalLink,
  Globe,
  MapPin,
  Calendar,
  Banknote,
  GanttChartSquare,
  TrendingUp,
} from "lucide-react";
import {
  getProject,
  getDocsByProject,
  getPhotosByProject,
  getAuditByProject,
  getCasesByProject,
  SIGNATORIES,
  TRUSTEES,
} from "@/lib/mock-data";
import { shortHash } from "@/lib/hash";

export const metadata = { title: "Verified project — GhanaWatch" };

export default async function PublicVerificationCard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const docs = getDocsByProject(id);
  const photos = getPhotosByProject(id);
  const audit = getAuditByProject(id);
  const cases = getCasesByProject(id);
  const signers = SIGNATORIES[id] ?? [];
  const cardHash = shortHash(`vcard:${id}:${audit[0]?.hash ?? ""}`);

  // Recommend a trustee like project page does
  const trustee =
    project.sector === "real-estate"
      ? TRUSTEES.find((t) => t.id === "tr-2")
      : project.sector === "construction"
      ? TRUSTEES.find((t) => t.id === "tr-1")
      : project.sector === "vehicle-import"
      ? TRUSTEES.find((t) => t.id === "tr-5")
      : project.sector === "medical"
      ? TRUSTEES.find((t) => t.id === "tr-4")
      : TRUSTEES.find((t) => t.id === "tr-3");

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="card relative overflow-hidden">
        {/* Hero ribbon */}
        <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-accent-gold to-accent-green px-12 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-bg shadow-lg">
          GhanaWatch verified
        </div>

        <div className="border-b border-line bg-bg-elev/40 p-8">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-accent-gold to-accent-green">
              <Shield className="h-4 w-4 text-bg" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold">GhanaWatch</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Public verification card</div>
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight md:text-3xl">{project.name}</h1>
          <div className="mt-1 flex items-center gap-1 text-[13px] text-ink-dim">
            <MapPin className="h-3.5 w-3.5" /> {project.location}, {project.region}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)" }}>
              <ShieldCheck className="h-3 w-3" /> KYC owner verified
            </span>
            <span className="chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)" }}>
              <ShieldCheck className="h-3 w-3" /> Trustee dispatched
            </span>
            <span className="chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)" }}>
              <ShieldCheck className="h-3 w-3" /> Audit chain intact
            </span>
            {cases.length === 0 && (
              <span className="chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)" }}>
                <ShieldCheck className="h-3 w-3" /> No open forensic cases
              </span>
            )}
            {cases.length > 0 && (
              <span className="chip" style={{ color: "#f59e0b", borderColor: "rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.08)" }}>
                {cases.length} active forensic case{cases.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-8 p-8">
          {/* Scores */}
          <div className="grid grid-cols-3 gap-3">
            <Score label="Trust score" value={project.trustScore} max={100} color="#10b981" />
            <Score label="Risk score" value={project.riskScore} max={100} color={project.riskScore > 60 ? "#ef4444" : project.riskScore > 40 ? "#f59e0b" : "#10b981"} />
            <Score label="Progress" value={project.progress} max={100} color="#f5b800" />
          </div>

          {/* Project meta */}
          <div className="grid gap-3 text-[13px] md:grid-cols-2">
            <Row icon={Globe} label="Diaspora owner" value={`${project.diasporaOwner} · ${project.ownerLocation}`} />
            <Row icon={Users} label="Manager on ground" value={`${project.managedBy} (${project.managedByRelation})`} />
            <Row icon={Banknote} label="Budget" value={`GHS ${project.budgetGHS.toLocaleString()}`} />
            <Row icon={Calendar} label="Timeline" value={`${project.startDate} → ${project.targetCompletion}`} />
          </div>

          {/* Verification breakdown */}
          <div>
            <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">What's been verified</div>
            <div className="grid gap-3 md:grid-cols-2">
              <VerifiedRow icon={Users} label="Signatories" sub={`${signers.filter((s) => s.status === "signed").length} of ${signers.length} signed, all KYC verified`} />
              <VerifiedRow icon={FileText} label="Documents" sub={`${docs.length} uploaded, ${docs.filter((d) => d.authenticityScore >= 80).length} above 80% authenticity`} />
              <VerifiedRow icon={Camera} label="Site evidence" sub={`${photos.length} geo-stamped photos, ${photos.filter((p) => p.sceneMatchScore >= 80).length} scene-matched`} />
              <VerifiedRow icon={ShieldCheck} label="Trustee" sub={trustee ? `${trustee.name} — ${trustee.profession}` : "—"} />
              <VerifiedRow icon={GanttChartSquare} label="Milestones" sub={`${project.verifiedMilestones} of ${project.totalMilestones} verified`} />
              <VerifiedRow icon={TrendingUp} label="Audit ledger" sub={`${audit.length} hash-chained events, integrity intact`} />
            </div>
          </div>

          {/* Footer / seal */}
          <div className="rounded-xl border border-accent-gold/30 bg-accent-gold/5 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-accent-gold/15 text-accent-gold">
                <Stamp className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">GhanaWatch verification</div>
                <div className="text-[11px] text-ink-dim">
                  Card sealed {new Date().toISOString().slice(0, 16).replace("T", " ")} UTC · hash{" "}
                  <span className="hash-mono">{cardHash}</span>
                </div>
              </div>
              <Link href={`/projects/${id}`} className="btn btn-ghost text-[12px] py-1.5">
                Open full project <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <p className="mt-3 text-[12px] text-ink-dim">
              You can verify this card's authenticity at any time at <code className="rounded bg-bg-elev px-1 py-0.5 text-[11px]">ghanawatch.com/verify-card/{cardHash}</code>.
              Forward this link to anyone — family, lawyer, bank — to prove the project is under
              independent verification.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-[12px] text-ink-muted">
        Public verification cards expose only what the project owner has marked public. Sensitive
        financial details and personal info are never included.
      </div>
    </div>
  );
}

function Score({ label, value, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="rounded-xl border border-line bg-bg-elev/40 p-4 text-center">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
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

function VerifiedRow({ icon: Icon, label, sub }: any) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-line bg-bg-elev/40 p-3">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent-green/15 text-accent-green">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-ink">{label}</span>
          <Fingerprint className="h-3 w-3 text-ink-muted" />
        </div>
        <div className="text-[11px] text-ink-dim">{sub}</div>
      </div>
    </div>
  );
}
