import { describe, it, expect } from "vitest";
import { validateImage, sanitizeMessages, cleanString } from "@/lib/api-guard";

describe("validateImage", () => {
  const tinyPng = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  it("accepts a valid png data URL", () => {
    const r = validateImage(tinyPng);
    expect(r.ok).toBe(true);
  });

  it("treats null/undefined as absent (ok, no image)", () => {
    expect(validateImage(undefined)).toEqual({ ok: true, image: undefined });
    expect(validateImage(null)).toEqual({ ok: true, image: undefined });
  });

  it("rejects non-string", () => {
    const r = validateImage(123 as unknown);
    expect(r.ok).toBe(false);
  });

  it("rejects a non-image media type disguised as a data URL", () => {
    const r = validateImage("data:text/html;base64,PHNjcmlwdD4=");
    expect(r.ok).toBe(false);
  });

  it("rejects an oversized image", () => {
    const big = "data:image/png;base64," + "A".repeat(9 * 1024 * 1024);
    const r = validateImage(big);
    expect(r.ok).toBe(false);
  });
});

describe("sanitizeMessages", () => {
  it("drops invalid entries and bad roles", () => {
    const out = sanitizeMessages(
      [
        { role: "user", content: "hi" },
        { role: "system", content: "nope" },
        { role: "assistant", content: 42 },
        null,
        "string",
        { role: "assistant", content: "ok" },
      ],
      { maxMessages: 20, maxLen: 100 },
    );
    expect(out).toEqual([
      { role: "user", content: "hi" },
      { role: "assistant", content: "ok" },
    ]);
  });

  it("caps the number of turns to the most recent", () => {
    const many = Array.from({ length: 50 }, (_, i) => ({ role: "user" as const, content: `m${i}` }));
    const out = sanitizeMessages(many, { maxMessages: 5, maxLen: 100 });
    expect(out).toHaveLength(5);
    expect(out[4].content).toBe("m49");
  });

  it("truncates per-message length", () => {
    const out = sanitizeMessages([{ role: "user", content: "x".repeat(1000) }], {
      maxMessages: 20,
      maxLen: 10,
    });
    expect(out[0].content).toHaveLength(10);
  });

  it("returns [] for non-array input", () => {
    expect(sanitizeMessages("nope", { maxMessages: 20, maxLen: 10 })).toEqual([]);
    expect(sanitizeMessages(undefined, { maxMessages: 20, maxLen: 10 })).toEqual([]);
  });
});

describe("cleanString", () => {
  it("coerces and truncates", () => {
    expect(cleanString(undefined, 10)).toBe("");
    expect(cleanString(12345, 3)).toBe("123");
    expect(cleanString("abcdef", 3)).toBe("abc");
  });
});
