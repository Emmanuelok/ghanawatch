import { NextRequest, NextResponse } from "next/server";
import { getAnthropic } from "@/lib/ai";
import {
  getCase,
  PROJECTS,
  getDocsByProject,
  getPhotosByProject,
  getAuditByProject,
  getAlertsByProject,
} from "@/lib/mock-data";
import { rateLimit, tooMany, readJsonGuarded, cleanString } from "@/lib/api-guard";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You are GhanaWatch's senior forensic analyst. Produce a sealed, court-quality forensic dossier for a Ghanaian diaspora investment case.

Output strictly markdown. Use these sections:
## Executive Summary
## Background & Parties
## Evidence Inventory
## Forensic Analysis
## Hypothesis & Theory of the Case
## Recommended Actions (immediate, 7-day, 30-day)
## Litigation / Escalation Pathway
## Annex: Hash-chain Integrity

Be specific to Ghanaian institutions: Lands Commission (LC Online, GELIS), GRA, Ghana Police Service Land Fraud Unit, General Legal Council, Korle Bu / Komfo Anokye, MoFA, etc. Reference Ghanaian law where relevant (Land Act 2020 Act 1036, Conveyancing Act 1973 NRCD 175, Limitation Act 1972 Act 54). Cite the case's documents and photos by name where appropriate.

Be concise but thorough. ~700-1100 words. No fluff.`;

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { name: "dossier", limit: 10, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  const parsed = await readJsonGuarded(req, 16 * 1024);
  if (!parsed.ok) return parsed.res;
  const caseId = cleanString(parsed.body.caseId, 64);
  if (!caseId) return NextResponse.json({ error: "caseId required" }, { status: 400 });

  const c = getCase(caseId);
  if (!c) return NextResponse.json({ error: "Case not found" }, { status: 404 });
  const proj = PROJECTS.find((p) => p.id === c.projectId);
  const docs = getDocsByProject(c.projectId);
  const photos = getPhotosByProject(c.projectId);
  const audit = getAuditByProject(c.projectId);
  const alerts = getAlertsByProject(c.projectId);

  const userPrompt = `CASE: ${c.title}
Severity: ${c.severity}
Status: ${c.status}
Lead: ${c.lead}
Opened: ${c.openedAt}
Potential exposure: GHS ${c.potentialLossGHS.toLocaleString()}

PROJECT: ${proj?.name} — ${proj?.location}, ${proj?.region}
Diaspora owner: ${proj?.diasporaOwner} (${proj?.ownerLocation})
Manager on ground: ${proj?.managedBy} (${proj?.managedByRelation})
Budget: GHS ${proj?.budgetGHS.toLocaleString()}, ${proj?.progress}% progress

CASE SUMMARY:
${c.summary}

ANALYST HYPOTHESIS (working theory, may evolve):
${c.hypothesis}

EVIDENCE INVENTORY (${c.evidenceItemIds.length} items linked to this case):
${docs
  .filter((d) => c.evidenceItemIds.includes(d.id))
  .map(
    (d) =>
      `- DOC ${d.id}: "${d.name}" (${d.type}, authenticity ${d.authenticityScore}%) — flags: ${d.flags.join("; ") || "none"} — hash ${d.hash}`,
  )
  .join("\n")}
${photos
  .filter((p) => c.evidenceItemIds.includes(p.id))
  .map(
    (p) =>
      `- PHOTO ${p.id}: "${p.caption}" — GPS Δ ${p.distanceM}m, scene match ${p.sceneMatchScore}%, AI: ${p.aiAnalysis} — hash ${p.hash}`,
  )
  .join("\n")}
${alerts
  .filter((a) => c.evidenceItemIds.includes(a.id))
  .map((a) => `- ALERT ${a.id} (${a.severity}): ${a.title} — ${a.detail}`)
  .join("\n")}

CASE TIMELINE:
${c.timeline.map((t) => `- ${t.ts.slice(0, 16).replace("T", " ")} · ${t.actor} · ${t.note}`).join("\n")}

EXISTING RECOMMENDED ACTIONS (from the case lead):
${c.recommendedActions.map((a, i) => `${i + 1}. ${a}`).join("\n")}

LATEST AUDIT LEDGER EVENTS (showing chain integrity):
${audit
  .slice(0, 6)
  .map((e) => `- ${e.ts.slice(0, 16).replace("T", " ")} · ${e.actor} · ${e.action} · hash ${e.hash}`)
  .join("\n")}

Produce the dossier now.`;

  const anthropic = getAnthropic();
  if (!anthropic) {
    return NextResponse.json({ markdown: offlineDossier(c, proj, docs, photos, alerts) });
  }

  try {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2200,
      system: SYSTEM,
      messages: [{ role: "user", content: userPrompt }],
    });
    const md =
      msg.content
        .filter((b: any) => b.type === "text")
        .map((b: any) => b.text)
        .join("\n") || "(no content)";
    return NextResponse.json({ markdown: md });
  } catch (e: any) {
    return NextResponse.json({ markdown: offlineDossier(c, proj, docs, photos, alerts) });
  }
}

function offlineDossier(c: any, proj: any, docs: any[], photos: any[], alerts: any[]) {
  return `## Executive Summary
This dossier documents the GhanaWatch forensic investigation into **${c.title}**, opened ${c.openedAt.slice(0, 10)} on the project **${proj?.name}** held by **${proj?.diasporaOwner}** (resident in ${proj?.ownerLocation}). The case has been classified **${c.severity.toUpperCase()}** by the case lead, with a potential exposure of **GHS ${c.potentialLossGHS.toLocaleString()}**. Multiple converging signals — document forensics, on-site evidence, and registry cross-checks — support the working hypothesis stated below. Immediate, 7-day and 30-day actions are recommended.

## Background & Parties
- **Diaspora owner:** ${proj?.diasporaOwner} — ${proj?.ownerLocation}
- **Project:** ${proj?.name}, ${proj?.location}, ${proj?.region}
- **On-ground manager / counterparty:** ${proj?.managedBy} (${proj?.managedByRelation})
- **Budget / current spend:** GHS ${proj?.budgetGHS.toLocaleString()} / GHS ${proj?.spentGHS.toLocaleString()}
- **Case lead:** ${c.lead}

## Evidence Inventory
${docs.filter((d) => c.evidenceItemIds.includes(d.id)).length} documents and ${photos.filter((p) => c.evidenceItemIds.includes(p.id)).length} site evidence items are linked to this case, along with ${alerts.filter((a) => c.evidenceItemIds.includes(a.id)).length} system alerts. Each item is hash-anchored to the project's immutable audit ledger; any retroactive modification will break the chain on verification.

Key items:
${docs
  .filter((d) => c.evidenceItemIds.includes(d.id))
  .map((d) => `- **${d.name}** (${d.type}, authenticity ${d.authenticityScore}%)`)
  .join("\n")}
${photos
  .filter((p) => c.evidenceItemIds.includes(p.id))
  .map((p) => `- **${p.caption}** — GPS Δ ${p.distanceM}m, scene match ${p.sceneMatchScore}%`)
  .join("\n")}

## Forensic Analysis
Document forensics flagged a clustered pattern of anomalies inconsistent with authentic Ghanaian vendor / agency issuance. Site evidence corroborates the document signal. Lands Commission cross-checks (where applicable) returned material discrepancies. The signal density across three independent channels (document, site, registry) raises the case above the platform's auto-investigation threshold.

## Hypothesis & Theory of the Case
${c.hypothesis}

## Recommended Actions
**Immediate (0-48h):**
${c.recommendedActions
  .slice(0, 2)
  .map((a: string, i: number) => `${i + 1}. ${a}`)
  .join("\n")}

**7-day:**
${c.recommendedActions
  .slice(2, 4)
  .map((a: string, i: number) => `${i + 3}. ${a}`)
  .join("\n")}

**30-day:**
${c.recommendedActions
  .slice(4)
  .map((a: string, i: number) => `${i + 5}. ${a}`)
  .join("\n")}

## Litigation / Escalation Pathway
Depending on the response from the counterparty:
1. **Caveat & cease-and-desist** under the Land Act 2020 (Act 1036) where the case touches title.
2. **Police escalation** to the Ghana Police Service Land Fraud Unit; sealed evidence pack provided.
3. **Civil claim** for breach + fraud — note the limitation periods under the Limitation Act 1972 (Act 54).
4. **Regulatory referral** (GRA / General Legal Council / Lands Commission) where the counterparty is licensed.

## Annex: Hash-chain Integrity
The full audit ledger is hash-chained from genesis. Every action — document upload, site evidence, payment, milestone release, alert generation — is signed and chained. This dossier is itself anchored and time-stamped.

*Demo mode — set ANTHROPIC_API_KEY in the deployment environment to enable a live, AI-synthesised dossier.*`;
}
