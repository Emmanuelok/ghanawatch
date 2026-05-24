"use client";
import { useState } from "react";
import { Sparkles, Loader2, Download, X, Copy, Check } from "lucide-react";

export function DossierButton({ caseId, label = "Generate AI dossier" }: { caseId: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setMarkdown(null);
    try {
      const res = await fetch("/api/dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId }),
      });
      const data = await res.json();
      setMarkdown(data.markdown);
    } catch {
      setMarkdown("Failed to generate dossier. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ghanawatch-dossier-${caseId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          if (!markdown) generate();
        }}
        className="btn btn-primary"
      >
        <Sparkles className="h-4 w-4" /> {label}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex w-[min(900px,96vw)] max-h-[88vh] flex-col overflow-hidden rounded-2xl border border-line bg-bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-gold" />
                <div className="text-[14px] font-semibold">AI Forensic Dossier</div>
                <span className="chip">case · {caseId}</span>
              </div>
              <div className="flex items-center gap-2">
                {markdown && (
                  <>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(markdown);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                      }}
                      className="btn btn-ghost text-[12px] py-1.5"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button onClick={download} className="btn btn-ghost text-[12px] py-1.5">
                      <Download className="h-3.5 w-3.5" /> .md
                    </button>
                  </>
                )}
                <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-md text-ink-dim hover:bg-bg-elev">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto scroll-shadow p-6">
              {loading && (
                <div className="grid place-items-center py-16 text-[13px] text-ink-dim">
                  <Loader2 className="mb-3 h-6 w-6 animate-spin text-accent-gold" />
                  Synthesising sealed dossier — analysing evidence chain, signals, hypothesis, and recommended actions…
                </div>
              )}
              {markdown && <Markdownish text={markdown} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Markdownish({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuf: string[] = [];
  let oListBuf: string[] = [];
  const flushList = () => {
    if (listBuf.length) {
      out.push(
        <ul key={out.length} className="my-2 ml-5 list-disc space-y-1 text-[13px] text-ink-dim">
          {listBuf.map((l, i) => (<li key={i} dangerouslySetInnerHTML={{ __html: inline(l) }} />))}
        </ul>,
      );
      listBuf = [];
    }
    if (oListBuf.length) {
      out.push(
        <ol key={out.length} className="my-2 ml-5 list-decimal space-y-1 text-[13px] text-ink-dim">
          {oListBuf.map((l, i) => (<li key={i} dangerouslySetInnerHTML={{ __html: inline(l) }} />))}
        </ol>,
      );
      oListBuf = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      flushList();
      out.push(<h2 key={out.length} className="mt-5 text-[16px] font-semibold text-ink">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      flushList();
      out.push(<h3 key={out.length} className="mt-4 text-[14px] font-semibold text-ink">{line.slice(4)}</h3>);
    } else if (/^(\*|-)\s/.test(line)) {
      listBuf.push(line.replace(/^(\*|-)\s/, ""));
    } else if (/^\d+\.\s/.test(line)) {
      oListBuf.push(line.replace(/^\d+\.\s/, ""));
    } else if (line === "") {
      flushList();
      out.push(<div key={out.length} className="h-2" />);
    } else {
      flushList();
      out.push(<p key={out.length} className="text-[13px] leading-relaxed text-ink-dim" dangerouslySetInnerHTML={{ __html: inline(line) }} />);
    }
  }
  flushList();
  return <>{out}</>;
}

function inline(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-ink">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="text-ink-dim">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-bg-elev px-1 py-0.5 text-[12px]">$1</code>');
}
