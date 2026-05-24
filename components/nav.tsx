"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Activity } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/verify", label: "Verify Doc" },
  { href: "/investigator", label: "AI Investigator" },
  { href: "/network", label: "Trustee Network" },
  { href: "/sectors", label: "Sectors" },
  { href: "/research", label: "Research" },
];

export function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent-gold to-accent-green">
            <Shield className="h-4 w-4 text-bg" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight">GhanaWatch</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              Trust · Verification · Intelligence
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = path === l.href || (l.href !== "/" && path?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                  active ? "bg-bg-subtle text-ink" : "text-ink-dim hover:bg-bg-elev hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-md border border-line bg-bg-elev px-2.5 py-1 text-[11px] text-ink-dim md:flex">
            <Activity className="h-3 w-3 text-accent-green" />
            Live ledger
          </div>
          <Link href="/dashboard" className="btn btn-primary py-1.5 text-[13px]">
            Open app
          </Link>
        </div>
      </div>
    </header>
  );
}
