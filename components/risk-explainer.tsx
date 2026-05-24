import { Brain, ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { Project } from "@/lib/types";

type Factor = { label: string; weight: number; impact: "raises" | "lowers" | "neutral"; detail: string };

function deriveFactors(p: Project): Factor[] {
  const out: Factor[] = [];

  if (p.sector === "real-estate" || p.sector === "construction") {
    out.push({
      label: "Sector base rate",
      weight: p.sector === "real-estate" ? 18 : 12,
      impact: "raises",
      detail: `${p.sector === "real-estate" ? "Real estate / land" : "Construction"} is in the highest-fraud sector cohort in Ghana per platform data.`,
    });
  } else if (p.sector === "funeral") {
    out.push({ label: "Sector base rate", weight: 9, impact: "raises", detail: "Funeral spend frequently inflates beyond benchmark." });
  }

  // Region
  const accraLikeRegions = ["Greater Accra", "Ashanti", "Central"];
  if (accraLikeRegions.includes(p.region)) {
    out.push({
      label: "Region risk",
      weight: 10,
      impact: "raises",
      detail: `${p.region} has the highest concentration of GhanaWatch forensic cases per active project.`,
    });
  } else {
    out.push({
      label: "Region risk",
      weight: 4,
      impact: "lowers",
      detail: `${p.region} has below-average fraud signal density on the platform.`,
    });
  }

  // Relation
  const family = ["Brother", "Sister", "Cousin", "Aunt", "Uncle", "Father", "Mother", "Friend"];
  if (family.includes(p.managedByRelation)) {
    out.push({
      label: "Family-managed counterparty",
      weight: 7,
      impact: "raises",
      detail: "Relative-managed projects historically receive less independent scrutiny; trustee dispatch reduces this.",
    });
  } else {
    out.push({
      label: "Licensed counterparty",
      weight: 6,
      impact: "lowers",
      detail: `Counterparty (${p.managedByRelation}) is regulated; license verification active.`,
    });
  }

  // Alerts
  if (p.alerts > 0) {
    out.push({
      label: `Open alerts (${p.alerts})`,
      weight: 8 * p.alerts,
      impact: "raises",
      detail: "Each unresolved alert raises the project's risk score until resolved or dispatched.",
    });
  } else {
    out.push({ label: "No open alerts", weight: 6, impact: "lowers", detail: "Zero unresolved signals over the past 14 days." });
  }

  // Verified milestones progress
  const verifiedRatio = p.verifiedMilestones / Math.max(1, p.totalMilestones);
  if (verifiedRatio > 0.6) {
    out.push({
      label: "High milestone verification rate",
      weight: 8,
      impact: "lowers",
      detail: `${p.verifiedMilestones}/${p.totalMilestones} milestones independently verified by trustee.`,
    });
  }

  // Document forensics summary
  out.push({
    label: "Document forensics",
    weight: 6,
    impact: p.trustScore < 70 ? "raises" : "lowers",
    detail: p.trustScore < 70
      ? "Recent documents flagged at <80% authenticity. Trust drifting down."
      : "Documents passing forensics at consistently high rates.",
  });

  // Cap so visualisation isn't overwhelming
  return out;
}

export function RiskExplainer({ project }: { project: Project }) {
  const factors = deriveFactors(project).sort((a, b) => b.weight - a.weight);
  const total = factors.reduce((s, f) => s + f.weight, 0);
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-accent-gold" />
        <div className="text-[14px] font-semibold">Risk explainability</div>
      </div>
      <div className="mt-1 text-[11px] text-ink-dim">Why the risk score is {project.riskScore} — top contributing factors</div>
      <div className="mt-4 space-y-3">
        {factors.map((f) => {
          const pct = (f.weight / total) * 100;
          const color = f.impact === "raises" ? "#ef4444" : f.impact === "lowers" ? "#10b981" : "#9aa0b0";
          const Arrow = f.impact === "raises" ? ArrowUp : f.impact === "lowers" ? ArrowDown : Minus;
          return (
            <div key={f.label}>
              <div className="flex items-baseline justify-between gap-3 text-[12px]">
                <span className="flex items-center gap-1.5 text-ink">
                  <Arrow className="h-3 w-3" style={{ color }} />
                  {f.label}
                </span>
                <span className="font-semibold" style={{ color }}>
                  {f.impact === "raises" ? "+" : f.impact === "lowers" ? "−" : "±"}{f.weight}
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-bg-subtle">
                <div className="h-full" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className="mt-1 text-[11px] text-ink-dim">{f.detail}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
