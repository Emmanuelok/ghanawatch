import { NextRequest, NextResponse } from "next/server";
import { getAnthropic, SYSTEM_PROMPT, offlineInvestigatorReply } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const messages: { role: "user" | "assistant"; content: string }[] = Array.isArray(body.messages)
    ? body.messages
    : [];
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
