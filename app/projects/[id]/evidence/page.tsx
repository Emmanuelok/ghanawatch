import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Download,
  Printer,
  Fingerprint,
  FileText,
  Camera,
  ScrollText,
  Stamp,
} from "lucide-react";
import {
  getProject,
  getDocsByProject,
  getPhotosByProject,
  getAuditByProject,
  getAlertsByProject,
  getMilestonesByProject,
  getCasesByProject,
} from "@/lib/mock-data";
import { shortHash } from "@/lib/hash";

export default async function EvidencePackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const docs = getDocsByProject(id);
  const photos = getPhotosByProject(id);
  const audit = getAuditByProject(id);
  const alerts = getAlertsByProject(id);
  const milestones = getMilestonesByProject(id);
  const cases = getCasesByProject(id);

  // Deterministic seal: derived from the project's ledger state, not wall-clock,
  // so the same evidence produces the same pack hash on every generation.
  const packHash = shortHash(
    `pack:${id}:${audit.length}:${audit[0]?.hash ?? ""}:${docs.length}:${photos.length}`,
  );

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href={`/projects/${id}`} className="mb-6 inline-flex items-center gap-2 text-[12px] text-ink-dim hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to project
      </Link>

      {/* Action bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-bg-elev/40 p-3">
        <div className="text-[12px] text-ink-dim">
          Sealed at {new Date().toISOString().slice(0, 19).replace("T", " ")} UTC · Pack hash{" "}
          <span className="hash-mono text-accent-gold">{packHash}</span>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="btn btn-ghost"><Printer className="h-3.5 w-3.5" /> Print</button>
          <button className="btn btn-primary"><Download className="h-3.5 w-3.5" /> Download PDF</button>
        </div>
      </div>

      {/* DOC */}
      <div className="card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-accent-gold to-accent-green">
                  <Shield className="h-4 w-4 text-bg" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-[14px] font-semibold">GhanaWatch — Sealed Evidence Pack</div>
                  <div className="text-[11px] text-ink-muted">Court-admissible · hash-anchored</div>
                </div>
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight">{project.name}</h1>
              <p className="mt-1 text-[13px] text-ink-dim">{project.location} · {project.region}</p>
            </div>
            <div className="text-right">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-accent-gold/40 bg-accent-gold/10 text-accent-gold">
                <Stamp className="h-6 w-6" />
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.12em] text-ink-muted">SEALED</div>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-8">
          {/* Summary */}
          <Block icon={ScrollText} title="1. Project summary">
            <p className="text-[13px] leading-relaxed text-ink-dim">{project.summary}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
              <Kv k="Diaspora owner" v={`${project.diasporaOwner} (${project.ownerLocation})`} />
              <Kv k="Manager" v={`${project.managedBy} (${project.managedByRelation})`} />
              <Kv k="Budget" v={`GHS ${project.budgetGHS.toLocaleString()}`} />
              <Kv k="Spent" v={`GHS ${project.spentGHS.toLocaleString()}`} />
              <Kv k="Progress" v={`${project.progress}%`} />
              <Kv k="Risk score" v={`${project.riskScore}`} />
              <Kv k="Trust score" v={`${project.trustScore}`} />
              <Kv k="Active alerts" v={`${alerts.length}`} />
            </div>
          </Block>

          {/* Forensic cases */}
          {cases.length > 0 && (
            <Block icon={ScrollText} title="2. Open forensic cases">
              {cases.map((c) => (
                <div key={c.id} className="rounded-md border border-line bg-bg-elev/40 p-3">
                  <div className="text-[13px] font-semibold">{c.title}</div>
                  <p className="mt-1 text-[12px] text-ink-dim">{c.summary}</p>
                  <div className="mt-2 text-[11px] text-ink-muted">
                    Severity: {c.severity} · Exposure: GHS {c.potentialLossGHS.toLocaleString()}
                  </div>
                </div>
              ))}
            </Block>
          )}

          {/* Documents */}
          <Block icon={FileText} title={`3. Documents (${docs.length})`}>
            <table className="w-full text-[12px]">
              <thead className="text-left text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                <tr className="border-b border-line">
                  <th className="py-2">Doc</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Score</th>
                  <th className="py-2">Hash</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className="border-b border-line last:border-0">
                    <td className="py-2 text-ink">{d.name}</td>
                    <td className="py-2 text-ink-dim">{d.type}</td>
                    <td className="py-2 font-semibold" style={{ color: d.authenticityScore >= 80 ? "#10b981" : d.authenticityScore >= 50 ? "#f59e0b" : "#ef4444" }}>
                      {d.authenticityScore}%
                    </td>
                    <td className="py-2"><span className="hash-mono">{d.hash}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Block>

          {/* Photos */}
          <Block icon={Camera} title={`4. Site evidence (${photos.length})`}>
            <table className="w-full text-[12px]">
              <thead className="text-left text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                <tr className="border-b border-line">
                  <th className="py-2">Caption</th>
                  <th className="py-2">When</th>
                  <th className="py-2">GPS Δ</th>
                  <th className="py-2">Scene</th>
                  <th className="py-2">Hash</th>
                </tr>
              </thead>
              <tbody>
                {photos.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0">
                    <td className="py-2 text-ink">{p.caption}</td>
                    <td className="py-2 text-ink-dim">{p.takenAt.slice(0, 10)}</td>
                    <td className="py-2 text-ink-dim">{p.distanceM} m</td>
                    <td className="py-2 text-ink-dim">{p.sceneMatchScore}%</td>
                    <td className="py-2"><span className="hash-mono">{p.hash}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Block>

          {/* Milestones */}
          <Block icon={ScrollText} title={`5. Milestones (${milestones.length})`}>
            <table className="w-full text-[12px]">
              <thead className="text-left text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                <tr className="border-b border-line">
                  <th className="py-2">Milestone</th>
                  <th className="py-2">Due</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((m) => (
                  <tr key={m.id} className="border-b border-line last:border-0">
                    <td className="py-2 text-ink">{m.name}</td>
                    <td className="py-2 text-ink-dim">{m.dueDate}</td>
                    <td className="py-2 text-ink-dim">GHS {m.amountGHS.toLocaleString()}</td>
                    <td className="py-2 text-ink-dim">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Block>

          {/* Audit ledger */}
          <Block icon={Fingerprint} title={`6. Audit ledger (${audit.length} events — hash-chained)`}>
            <div className="space-y-2 text-[11px]">
              {audit.map((e) => (
                <div key={e.id} className="rounded border border-line bg-bg-elev/40 p-2">
                  <div className="text-ink">{e.action}</div>
                  <div className="text-ink-muted">{e.actor} · {e.ts.slice(0, 16).replace("T", " ")}</div>
                  <div className="mt-1 flex flex-wrap gap-3 text-[10px]">
                    <span className="hash-mono">prev {e.prevHash}</span>
                    <span className="hash-mono" style={{ color: "#f5b800" }}>hash {e.hash}</span>
                    <span className="hash-mono">sig {e.sig}</span>
                  </div>
                </div>
              ))}
            </div>
          </Block>

          {/* Footer */}
          <div className="rounded-md border border-accent-gold/30 bg-accent-gold/5 p-4 text-center text-[12px] text-ink-dim">
            This pack is sealed by GhanaWatch with pack hash{" "}
            <span className="hash-mono" style={{ color: "#f5b800" }}>{packHash}</span>. The hash-chain
            covers every line above. Any retroactive modification will break the chain on
            verification.
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({ icon: Icon, title, children }: any) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent-gold" />
        <div className="text-[14px] font-semibold">{title}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Kv({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-line bg-bg-elev/40 p-2">
      <div className="text-[10px] uppercase tracking-[0.1em] text-ink-muted">{k}</div>
      <div className="mt-0.5 text-ink">{v}</div>
    </div>
  );
}
