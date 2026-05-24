"use client";
import { useState } from "react";
import Link from "next/link";
import { Camera, ShieldCheck, ScrollText, MessageSquare } from "lucide-react";
import { DispatchModal } from "@/components/dispatch-modal";
import type { Trustee } from "@/lib/types";

export function ProjectActions({
  projectId,
  projectName,
  trustee,
}: {
  projectId: string;
  projectName: string;
  trustee: Trustee;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
        <button className="btn btn-primary"><Camera className="h-4 w-4" /> Request fresh site photo</button>
        <button onClick={() => setOpen(true)} className="btn btn-ghost">
          <ShieldCheck className="h-4 w-4" /> Dispatch {trustee.name.split(",")[0]}
        </button>
        <Link href={`/projects/${projectId}/evidence`} className="btn btn-ghost">
          <ScrollText className="h-4 w-4" /> Generate evidence pack
        </Link>
        <Link href="/investigator" className="btn btn-ghost">
          <MessageSquare className="h-4 w-4" /> Open investigator
        </Link>
      </div>
      <DispatchModal open={open} onClose={() => setOpen(false)} trustee={trustee} projectName={projectName} />
    </>
  );
}
