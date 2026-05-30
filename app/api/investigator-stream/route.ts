import { NextRequest } from "next/server";
import { getAnthropic, SYSTEM_PROMPT, offlineInvestigatorReply } from "@/lib/ai";
import { rateLimit, tooMany, readJsonGuarded, sanitizeMessages } from "@/lib/api-guard";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, { name: "investigator-stream", limit: 30, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  const parsed = await readJsonGuarded(req, 256 * 1024);
  if (!parsed.ok) return parsed.res;

  const messages = sanitizeMessages(parsed.body.messages, { maxMessages: 20, maxLen: 6000 });
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") {
    return new Response(JSON.stringify({ error: "Empty conversation" }), { status: 400 });
  }

  const encoder = new TextEncoder();
  const anthropic = getAnthropic();

  const stream = new ReadableStream({
    async start(controller) {
      function send(data: any) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        if (anthropic) {
          const s = await anthropic.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 900,
            system: SYSTEM_PROMPT,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
          });
          for await (const ev of s) {
            if (ev.type === "content_block_delta" && (ev.delta as any).type === "text_delta") {
              send({ type: "delta", text: (ev.delta as any).text });
            }
          }
          send({ type: "done" });
          controller.close();
          return;
        }
      } catch (e) {
        // fall through to offline
      }

      // Offline streaming — emit the deterministic reply char by char
      const text = offlineInvestigatorReply(last.content);
      // Stream in word chunks for a snappier feel
      const tokens = text.split(/(\s+)/);
      for (const t of tokens) {
        send({ type: "delta", text: t });
        await new Promise((r) => setTimeout(r, 18));
      }
      send({ type: "done" });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
