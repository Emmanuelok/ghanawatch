"use client";
import { useState } from "react";
import { FileSearch, Camera, Flag, ScrollText, Users, ShieldAlert, Map, MessageCircle } from "lucide-react";

type Tab = "docs" | "photos" | "map" | "milestones" | "ledger" | "cases" | "trustee" | "chat";

export function ProjectTabs({
  docsTab,
  photosTab,
  mapTab,
  milestonesTab,
  ledgerTab,
  casesTab,
  trusteeTab,
  chatTab,
}: {
  docsTab: React.ReactNode;
  photosTab: React.ReactNode;
  mapTab: React.ReactNode;
  milestonesTab: React.ReactNode;
  ledgerTab: React.ReactNode;
  casesTab: React.ReactNode;
  trusteeTab: React.ReactNode;
  chatTab: React.ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("docs");
  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "docs", label: "Documents (forensics)", icon: FileSearch },
    { id: "photos", label: "Site evidence", icon: Camera },
    { id: "map", label: "Parcel map", icon: Map },
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "milestones", label: "Milestones / escrow", icon: Flag },
    { id: "ledger", label: "Audit ledger", icon: ScrollText },
    { id: "cases", label: "Forensic cases", icon: ShieldAlert },
    { id: "trustee", label: "Trustee", icon: Users },
  ];

  return (
    <div className="mt-8">
      <div className="flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((t) => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex shrink-0 items-center gap-2 px-4 py-3 text-[13px] transition-colors ${
                active ? "text-ink" : "text-ink-dim hover:text-ink"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent-gold" />}
            </button>
          );
        })}
      </div>

      <div className="mt-6 animate-fade-in">
        {tab === "docs" && docsTab}
        {tab === "photos" && photosTab}
        {tab === "map" && mapTab}
        {tab === "chat" && chatTab}
        {tab === "milestones" && milestonesTab}
        {tab === "ledger" && ledgerTab}
        {tab === "cases" && casesTab}
        {tab === "trustee" && trusteeTab}
      </div>
    </div>
  );
}
