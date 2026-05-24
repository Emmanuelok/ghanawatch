import { KnowledgeClient } from "./knowledge-client";
import { BookOpen } from "lucide-react";

export const metadata = { title: "Fraud Knowledge Base — GhanaWatch" };

export default function KnowledgePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="max-w-2xl">
        <div className="chip mb-4"><BookOpen className="h-3 w-3 text-accent-gold" /> Fraud knowledge base</div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Every fraud pattern Ghanaians in the diaspora encounter — documented.
        </h1>
        <p className="mt-3 text-[15px] text-ink-dim">
          Each pattern includes the warning signals to watch for, countermeasures to deploy, and
          documented case examples. Built from court records, embassy bulletins, and signals from
          our own platform.
        </p>
      </div>
      <KnowledgeClient />
    </div>
  );
}
