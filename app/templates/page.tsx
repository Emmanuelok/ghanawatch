import Link from "next/link";
import { FileText, Download, Shield, Search } from "lucide-react";
import { TemplatesClient } from "./templates-client";

export const metadata = { title: "Document Templates — GhanaWatch" };

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <FileText className="h-3 w-3" /> Templates library
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Proper Ghanaian documents.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Standard templates your counterparty should be using — indenture, BOQ, receipt, invoice,
          POA, contributor ledger, contractor agreement. Each is reviewed by GhanaWatch lawyers and
          aligned with Ghanaian statutes. If your counterparty's doc doesn't look like the template,
          ask why.
        </p>
      </div>
      <TemplatesClient />
    </div>
  );
}
