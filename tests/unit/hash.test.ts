import { describe, it, expect } from "vitest";
import { shortHash, chainHash, fakeSig } from "@/lib/hash";

describe("hash utilities", () => {
  it("shortHash is deterministic and 0x-prefixed", () => {
    expect(shortHash("abc")).toBe(shortHash("abc"));
    expect(shortHash("abc")).toMatch(/^0x[0-9a-f]+$/);
    expect(shortHash("abc")).not.toBe(shortHash("abd"));
  });

  it("shortHash returns a fixed-length 18-char string", () => {
    expect(shortHash("x")).toHaveLength(18);
    expect(shortHash("a much longer input string here")).toHaveLength(18);
  });

  it("chainHash binds prev + payload (order matters)", () => {
    const a = chainHash("0xprev", "payload");
    expect(a).toBe(chainHash("0xprev", "payload"));
    expect(a).not.toBe(chainHash("0xother", "payload"));
    expect(a).not.toBe(chainHash("0xprev", "payload2"));
  });

  it("fakeSig is deterministic", () => {
    expect(fakeSig("seed")).toBe(fakeSig("seed"));
    expect(fakeSig("seed")).not.toBe(fakeSig("seed2"));
  });
});
