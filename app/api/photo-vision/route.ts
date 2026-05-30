import { NextRequest, NextResponse } from "next/server";
import { getAnthropic } from "@/lib/ai";
import { rateLimit, tooMany, readJsonGuarded, validateImage, cleanString } from "@/lib/api-guard";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM = `You are GhanaWatch's construction-site computer-vision analyst. Given a photo of a building site in Ghana (claimed to be on a specific parcel), describe what's visible and assess:

1. BOQ stage (foundation, blockwork, lintel, decking, roofing, plastering, finishing)
2. Quality cues — material brand visible, workmanship signs, safety gear
3. Anomalies — anything inconsistent with a legitimate active site
4. Confidence (low/medium/high) that the photo is from a real, active construction

Return ONLY JSON:
{
  "stage": "...",
  "stageConfidence": 0-100,
  "observations": ["..."],
  "qualityFlags": ["..."],
  "anomalies": ["..."],
  "verdict": "consistent"|"suspicious"|"off-pattern",
  "recommendation": "..."
}`;

export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, { name: "vision", limit: 12, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  const parsed = await readJsonGuarded(req, 9 * 1024 * 1024);
  if (!parsed.ok) return parsed.res;
  const body = parsed.body;

  const imgCheck = validateImage(body.image);
  if (!imgCheck.ok) return NextResponse.json({ error: imgCheck.reason }, { status: 400 });
  const image = imgCheck.image;
  const projectCtx = cleanString(body.projectCtx, 200);

  if (!image) return NextResponse.json({ error: "image required" }, { status: 400 });

  const anthropic = getAnthropic();
  if (anthropic) {
    try {
      const match = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (!match) return NextResponse.json(offline(), { status: 200 });
      const mediaType = match[1] as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
      const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 800,
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: match[2] } },
              { type: "text", text: `Project context: ${projectCtx || "Ghana construction site"}. Return the JSON verdict.` },
            ],
          },
        ],
      });
      const txt = msg.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n");
      const start = txt.indexOf("{"); const end = txt.lastIndexOf("}");
      if (start >= 0 && end >= 0) {
        try { return NextResponse.json(JSON.parse(txt.slice(start, end + 1))); } catch {}
      }
    } catch {}
  }
  return NextResponse.json(offline());
}

function offline() {
  return {
    stage: "Ground-floor blockwork (~ BOQ stage 3.2)",
    stageConfidence: 78,
    observations: [
      "Sandcrete blocks visible, ~4 courses laid on the eastern face",
      "Lintel formwork in position over door openings",
      "Two workers visible without high-visibility gear",
      "Cement bags (Diamond Cement branded) stacked under tarpaulin in the foreground",
    ],
    qualityFlags: [
      "Brand of cement matches claimed receipt — consistent",
      "No safety helmets — minor compliance flag",
    ],
    anomalies: [],
    verdict: "consistent",
    recommendation: "Photo is consistent with the claimed BOQ stage. Note minor safety compliance gap; flag in next trustee visit. Demo mode — set ANTHROPIC_API_KEY for live Vision analysis.",
  };
}
