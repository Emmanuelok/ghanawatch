import { describe, it, expect } from "vitest";
import {
  PROJECTS,
  DOCUMENTS,
  SITE_PHOTOS,
  MILESTONES,
  ALERTS,
  AUDIT_EVENTS,
  FORENSIC_CASES,
  SIGNATORIES,
  TRUSTEES,
  VENDORS,
  PRODUCTS,
  DISPUTES,
  BENCHMARKS,
} from "@/lib/mock-data";
import { PARCELS } from "@/lib/parcels";
import { chainHash } from "@/lib/hash";

const projectIds = new Set(PROJECTS.map((p) => p.id));

describe("referential integrity", () => {
  it("every document points at a real project", () => {
    for (const d of DOCUMENTS) expect(projectIds.has(d.projectId), d.id).toBe(true);
  });
  it("every site photo points at a real project", () => {
    for (const p of SITE_PHOTOS) expect(projectIds.has(p.projectId), p.id).toBe(true);
  });
  it("every milestone points at a real project", () => {
    for (const m of MILESTONES) expect(projectIds.has(m.projectId), m.id).toBe(true);
  });
  it("every alert points at a real project", () => {
    for (const a of ALERTS) expect(projectIds.has(a.projectId), a.id).toBe(true);
  });
  it("every forensic case points at a real project", () => {
    for (const c of FORENSIC_CASES) expect(projectIds.has(c.projectId), c.id).toBe(true);
  });
  it("case evidence ids resolve to a doc, photo, or alert", () => {
    const docIds = new Set(DOCUMENTS.map((d) => d.id));
    const photoIds = new Set(SITE_PHOTOS.map((p) => p.id));
    const alertIds = new Set(ALERTS.map((a) => a.id));
    for (const c of FORENSIC_CASES) {
      for (const ev of c.evidenceItemIds) {
        const ok = docIds.has(ev) || photoIds.has(ev) || alertIds.has(ev);
        expect(ok, `${c.id} → ${ev}`).toBe(true);
      }
    }
  });
  it("signatory + parcel keys are real projects", () => {
    for (const id of Object.keys(SIGNATORIES)) expect(projectIds.has(id), id).toBe(true);
    for (const id of Object.keys(PARCELS)) expect(projectIds.has(id), id).toBe(true);
  });
  it("every product points at a real vendor", () => {
    const vendorIds = new Set(VENDORS.map((v) => v.id));
    for (const p of PRODUCTS) expect(vendorIds.has(p.vendorId), p.id).toBe(true);
  });
  it("every dispute points at a real project", () => {
    for (const d of DISPUTES) expect(projectIds.has(d.projectId), d.id).toBe(true);
  });
});

describe("project shape", () => {
  it("ids are unique", () => {
    expect(new Set(PROJECTS.map((p) => p.id)).size).toBe(PROJECTS.length);
  });
  it("has valid coordinates and non-empty history series", () => {
    for (const p of PROJECTS) {
      expect(Number.isFinite(p.lat), p.id).toBe(true);
      expect(Number.isFinite(p.lng), p.id).toBe(true);
      expect(p.trustHistory.length).toBeGreaterThan(0);
      expect(p.riskHistory.length).toBeGreaterThan(0);
      expect(p.spentGHS).toBeLessThanOrEqual(p.budgetGHS);
      expect(p.riskScore).toBeGreaterThanOrEqual(0);
      expect(p.riskScore).toBeLessThanOrEqual(100);
    }
  });
});

describe("audit ledger integrity", () => {
  it("forms an unbroken hash chain from genesis", () => {
    let prev = "0x000000000000000000";
    for (const e of AUDIT_EVENTS) {
      expect(e.prevHash, e.id).toBe(prev);
      const payload = `${e.id}|${e.ts}|${e.actor}|${e.action}|${e.category}|${e.ref ?? ""}`;
      expect(chainHash(prev, payload), e.id).toBe(e.hash);
      prev = e.hash;
    }
  });
});

describe("benchmarks + trustees sane", () => {
  it("benchmark percentiles are ordered p10 <= median <= p90", () => {
    for (const b of BENCHMARKS) {
      expect(b.p10).toBeLessThanOrEqual(b.medianGHS);
      expect(b.medianGHS).toBeLessThanOrEqual(b.p90);
    }
  });
  it("trustee ratings within 0..5", () => {
    for (const t of TRUSTEES) {
      expect(t.rating).toBeGreaterThanOrEqual(0);
      expect(t.rating).toBeLessThanOrEqual(5);
    }
  });
});
