import { NextRequest, NextResponse } from "next/server";
import { getAnthropic, SYSTEM_PROMPT, offlineInvestigatorReply } from "@/lib/ai";
import { rateLimit, tooMany, readJsonGuarded, sanitizeMessages } from "@/lib/api-guard";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { name: "investigator", limit: 30, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  const parsed = await readJsonGuarded(req, 256 * 1024);
  if (!parsed.ok) return parsed.res;

  const messages = sanitizeMessages(parsed.body.messages, { maxMessages: 20, maxLen: 6000 });
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") {
    return NextResponse.json({ error: "Empty conversation" }, { status: 400 });
  }

  const anthropic = getAnthropic();
  if (!anthropic) {
    return NextResponse.json({ reply: offlineInvestigatorReply(last.content) });
  }

  try {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const text =
      msg.content
        .filter((b: any) => b.type === "text")
        .map((b: any) => b.text)
        .join("\n") || "(no reply)";
    return NextResponse.json({ reply: text });
  } catch (e: any) {
    return NextResponse.json({ reply: offlineInvestigatorReply(last.content) });
  }
}
