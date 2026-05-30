import { NextRequest, NextResponse } from "next/server";
import { getAnthropic } from "@/lib/ai";
import {
  getProject,
  getDocsByProject,
  getPhotosByProject,
  getAlertsByProject,
  getCasesByProject,
} from "@/lib/mock-data";
import { rateLimit, tooMany, readJsonGuarded, cleanString } from "@/lib/api-guard";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM = `You are GhanaWatch's project health narrator. Given a project snapshot, write a 3-4 sentence executive narrative (English, plain) that an owner abroad can read in 10 seconds to know where the project stands. Tone: candid, specific, no fluff. End with a one-line "Next best action".`;

export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, { name: "health", limit: 20, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  const parsed = await readJsonGuarded(req, 16 * 1024);
  if (!parsed.ok) return parsed.res;
  const projectId = cleanString(parsed.body.projectId, 64);
  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "not found" }, { status: 404 });

  const docs = getDocsByProject(projectId);
  const photos = getPhotosByProject(projectId);
  const alerts = getAlertsByProject(projectId);
  const cases = getCasesByProject(projectId);

  const ctx = `PROJECT: ${project.name}, ${project.location}, ${project.region}
Sector: ${project.sector}
Owner: ${project.diasporaOwner} (${project.ownerLocation})
Manager: ${project.managedBy} (${project.managedByRelation})
Budget: GHS ${project.budgetGHS.toLocaleString()} (spent GHS ${project.spentGHS.toLocaleString()}, ${project.progress}%)
Trust score: ${project.trustScore} / Risk score: ${project.riskScore}
Milestones verified: ${project.verifiedMilestones} of ${project.totalMilestones}
Active alerts (${alerts.length}): ${alerts.map((a) => `[${a.severity}] ${a.title}`).join("; ")}
Open forensic cases (${cases.length}): ${cases.map((c) => c.title).join("; ")}
Documents: ${docs.length} on file, ${docs.filter((d) => d.authenticityScore < 70).length} flagged at <70% authenticity
Site evidence: ${photos.length} photos, ${photos.filter((p) => p.flagged).length} flagged

Recent flags: ${alerts.slice(0, 3).map((a) => a.detail).join(" | ") || "none in last 14 days"}.

Write the executive narrative.`;

  const anthropic = getAnthropic();
  if (anthropic) {
    try {
      const msg = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 320,
        system: SYSTEM,
        messages: [{ role: "user", content: ctx }],
      });
      const text =
        msg.content
          .filter((b: any) => b.type === "text")
          .map((b: any) => b.text)
          .join("\n") || offline(project, alerts.length, cases.length);
      return NextResponse.json({ text });
    } catch {
      // fall through
    }
  }
  return NextResponse.json({ text: offline(project, alerts.length, cases.length) });
}

function offline(p: any, alertCount: number, caseCount: number) {
  const tone =
    p.riskScore >= 70
      ? "needs urgent attention"
      : p.riskScore >= 40
      ? "is healthy with some active flags"
      : "is on track";

  const flags =
    alertCount === 0
      ? "no active alerts"
      : `${alertCount} alert${alertCount === 1 ? "" : "s"} open`;

  const cases =
    caseCount === 0
      ? "no forensic cases"
      : `${caseCount} forensic case${caseCount === 1 ? "" : "s"} under review`;

  const next =
    p.riskScore >= 60
      ? "Dispatch the trustee within 72h and pause the next disbursement until a fresh on-site report lands."
      : p.verifiedMilestones < p.totalMilestones - 1
      ? "Schedule the trustee for the next milestone boundary so funds release cleanly."
      : "Continue current cadence; review weekly digest.";

  return `${p.name} ${tone}. The project is ${p.progress}% complete with GHS ${p.spentGHS.toLocaleString()} of GHS ${p.budgetGHS.toLocaleString()} deployed; trust score ${p.trustScore}, risk ${p.riskScore}. Currently ${flags} and ${cases}; ${p.verifiedMilestones} of ${p.totalMilestones} milestones independently verified by trustee.

Next best action: ${next}`;
}
