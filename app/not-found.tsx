import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-xl place-items-center px-5 py-32 text-center">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">404</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page isn't on the ledger.</h1>
      <p className="mt-3 text-[14px] text-ink-dim">
        Nothing here. Try the dashboard or open the AI Investigator.
      </p>
      <div className="mt-6 flex gap-2">
        <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
        <Link href="/" className="btn btn-ghost">Home</Link>
      </div>
    </div>
  );
}
