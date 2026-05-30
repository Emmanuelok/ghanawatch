import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiter + request guards for API routes.
 *
 * Two backends, selected automatically:
 *  - Upstash Redis (global, durable) when UPSTASH_REDIS_REST_URL +
 *    UPSTASH_REDIS_REST_TOKEN are set — the production answer for Vercel's
 *    multi-instance serverless fleet.
 *  - In-memory fallback otherwise — best-effort per-instance throttling that
 *    still blunts abuse + runaway AI-cost loops in a demo/MVP.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

// Periodically evict stale buckets so the Map can't grow unbounded.
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (b.resetAt < now) buckets.delete(key);
  }
}

export function clientKey(req: NextRequest): string {
  // x-forwarded-for is set by Vercel's edge; fall back to a constant in dev.
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0]!.trim() : "local";
  return ip;
}

export type RateResult = { ok: true } | { ok: false; retryAfter: number };

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/** Atomic INCR + EXPIRE(NX) via Upstash REST pipeline. Returns null on any failure. */
async function upstashHit(key: string, windowSec: number): Promise<{ count: number; ttl: number } | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(windowSec), "NX"],
        ["TTL", key],
      ]),
      // Don't let a slow KV stall the request path.
      signal: AbortSignal.timeout(800),
    });
    if (!res.ok) return null;
    const out = (await res.json()) as Array<{ result: number }>;
    const count = out[0]?.result ?? 1;
    const ttl = out[2]?.result ?? windowSec;
    return { count, ttl: ttl > 0 ? ttl : windowSec };
  } catch {
    return null; // fail-open to the in-memory limiter
  }
}

export async function rateLimit(
  req: NextRequest,
  opts: { name: string; limit: number; windowMs: number },
): Promise<RateResult> {
  const key = `rl:${opts.name}:${clientKey(req)}`;
  const windowSec = Math.ceil(opts.windowMs / 1000);

  const remote = await upstashHit(key, windowSec);
  if (remote) {
    return remote.count > opts.limit ? { ok: false, retryAfter: remote.ttl } : { ok: true };
  }

  // In-memory fallback
  const now = Date.now();
  sweep(now);
  const memKey = `${opts.name}:${clientKey(req)}`;
  const b = buckets.get(memKey);
  if (!b || b.resetAt < now) {
    buckets.set(memKey, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true };
  }
  if (b.count >= opts.limit) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true };
}

export function tooMany(retryAfter: number) {
  return NextResponse.json(
    { error: "Too many requests. Please slow down.", retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}

/** Reject oversized JSON bodies before we parse/forward them to the model. */
export async function readJsonGuarded(
  req: NextRequest,
  maxBytes: number,
): Promise<{ ok: true; body: any } | { ok: false; res: NextResponse }> {
  const lenHeader = req.headers.get("content-length");
  if (lenHeader && Number(lenHeader) > maxBytes) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Payload too large" }, { status: 413 }),
    };
  }
  const raw = await req.text();
  if (raw.length > maxBytes) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Payload too large" }, { status: 413 }),
    };
  }
  try {
    return { ok: true, body: raw ? JSON.parse(raw) : {} };
  } catch {
    return { ok: false, res: NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) };
  }
}

/** Validate a base64 data-URL image: correct prefix, allowed type, size cap. */
export function validateImage(
  image: unknown,
  maxBytes = 6 * 1024 * 1024,
): { ok: true; image: string } | { ok: false; reason: string } | { ok: true; image: undefined } {
  if (image == null) return { ok: true, image: undefined };
  if (typeof image !== "string") return { ok: false, reason: "image must be a data URL string" };
  const m = image.match(/^data:(image\/(?:jpeg|png|gif|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return { ok: false, reason: "image must be a base64 data URL (jpeg/png/gif/webp)" };
  // base64 expands ~4/3; estimate decoded size.
  const approxBytes = Math.floor((m[2].length * 3) / 4);
  if (approxBytes > maxBytes) return { ok: false, reason: "image exceeds 6MB" };
  return { ok: true, image };
}

export function cleanString(v: unknown, maxLen: number): string {
  return (v ?? "").toString().slice(0, maxLen);
}

export type ChatMsg = { role: "user" | "assistant"; content: string };

/** Validate + clamp a chat history: drop bad entries, cap turns + per-message length. */
export function sanitizeMessages(
  input: unknown,
  opts: { maxMessages: number; maxLen: number },
): ChatMsg[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (m): m is ChatMsg =>
        !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
    )
    .slice(-opts.maxMessages)
    .map((m) => ({ role: m.role, content: m.content.slice(0, opts.maxLen) }));
}
