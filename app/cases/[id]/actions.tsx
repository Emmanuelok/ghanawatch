"use client";
import { useState } from "react";
import { ShieldCheck, ScrollText, MessageSquare, AlertTriangle } from "lucide-react";
import { DispatchModal } from "@/components/dispatch-modal";
import { TRUSTEES } from "@/lib/mock-data";

export function CaseActions() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-6 py-4">
        <button onClick={() => setOpen(true)} className="btn btn-primary">
          <ShieldCheck className="h-4 w-4" /> Dispatch trustee for evidence
        </button>
        <button className="btn btn-ghost"><ScrollText className="h-4 w-4" /> Generate sealed evidence pack</button>
        <button className="btn btn-ghost"><MessageSquare className="h-4 w-4" /> Brief AI Investigator</button>
        <button className="btn btn-ghost"><AlertTriangle className="h-4 w-4" /> Escalate to Police Land Fraud Unit</button>
      </div>
      <DispatchModal open={open} onClose={() => setOpen(false)} trustee={TRUSTEES[1]} projectName="Forensic case dispatch" />
    </>
  );
}
