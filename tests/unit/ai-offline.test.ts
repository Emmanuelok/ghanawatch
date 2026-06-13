import { describe, it, expect } from "vitest";
import { offlineInvestigatorReply, SYSTEM_PROMPT, getAnthropic } from "@/lib/ai";

describe("offline investigator fallback", () => {
  it("is deterministic for the same input", () => {
    const a = offlineInvestigatorReply("my brother is building a house in Kasoa");
    const b = offlineInvestigatorReply("my brother is building a house in Kasoa");
    expect(a).toBe(b);
  });

  it("routes land scenarios to land guidance", () => {
    const r = offlineInvestigatorReply("buying a plot of land, indenture from a stool elder").toLowerCase();
    expect(r).toContain("lands commission");
  });

  it("routes construction scenarios to construction guidance", () => {
    const r = offlineInvestigatorReply("the cement receipts for my build look strange").toLowerCase();
    expect(r).toMatch(/boq|receipt|trustee/);
  });

  it("routes vehicle scenarios to customs guidance", () => {
    const r = offlineInvestigatorReply("clearing agent at Tema added a duty penalty").toLowerCase();
    expect(r).toMatch(/gra|duty|vin/);
  });

  it("always returns non-empty actionable text", () => {
    for (const s of ["medical korle bu", "funeral costs", "shop business", "random query"]) {
      expect(offlineInvestigatorReply(s).length).toBeGreaterThan(50);
    }
  });
});

describe("environment wiring", () => {
  it("SYSTEM_PROMPT mentions Ghana context", () => {
    expect(SYSTEM_PROMPT.toLowerCase()).toContain("ghana");
  });
  it("getAnthropic returns null without an API key", () => {
    const prev = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    expect(getAnthropic()).toBeNull();
    if (prev) process.env.ANTHROPIC_API_KEY = prev;
  });
});
