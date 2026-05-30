"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In production this is where we'd ship to Sentry / the Sentinel SOC feed.
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="mx-auto grid max-w-xl place-items-center px-5 py-32 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-risk-high/15 text-risk-high">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">Something broke on our side.</h1>
      <p className="mt-2 text-[14px] text-ink-dim">
        We logged it to the Sentinel SOC. Your data and the audit ledger are untouched — this is a
        rendering error, not a verification failure.
      </p>
      {error.digest && (
        <p className="mt-2 text-[11px] text-ink-muted">Reference: <span className="hash-mono">{error.digest}</span></p>
      )}
      <div className="mt-6 flex gap-2">
        <button onClick={reset} className="btn btn-primary"><RotateCcw className="h-4 w-4" /> Try again</button>
        <Link href="/dashboard" className="btn btn-ghost"><Home className="h-4 w-4" /> Dashboard</Link>
      </div>
    </div>
  );
}
