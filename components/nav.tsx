"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Shield, Activity, Menu, X, Search, Command } from "lucide-react";
import { NotificationBell } from "./notification-bell";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/map", label: "Map" },
  { href: "/cases", label: "Cases" },
  { href: "/verify", label: "Verify" },
  { href: "/investigator", label: "Investigator" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/network", label: "Trustees" },
  { href: "/sectors", label: "Sectors" },
];

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3">
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

        <nav className="hidden items-center gap-0.5 xl:flex">
          {links.map((l) => {
            const active = path === l.href || (l.href !== "/" && path?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                  active ? "bg-bg-subtle text-ink" : "text-ink-dim hover:bg-bg-elev hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
              }
            }}
            className="hidden items-center gap-1.5 rounded-md border border-line bg-bg-elev px-2.5 py-1.5 text-[11px] text-ink-muted hover:text-ink md:flex"
            aria-label="Open command palette"
          >
            <Search className="h-3 w-3" />
            <span>Search</span>
            <span className="ml-1 flex items-center gap-0.5 rounded border border-line bg-bg px-1 py-0.5 text-[9px]">
              <Command className="h-2.5 w-2.5" /> K
            </span>
          </button>
          <NotificationBell />
          <Link href="/dashboard" className="btn btn-primary hidden py-1.5 text-[13px] md:inline-flex">
            Open app
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-8 w-8 place-items-center rounded-md border border-line xl:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-bg-elev xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-1 px-5 py-3">
            {links.map((l) => {
              const active = path === l.href || (l.href !== "/" && path?.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2 text-[13.5px] ${
                    active ? "bg-bg-subtle text-ink" : "text-ink-dim"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link href="/inbox" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-[13.5px] text-ink-dim">
              Inbox
            </Link>
            <Link href="/settings" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-[13.5px] text-ink-dim">
              Settings
            </Link>
            <Link href="/pricing" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-[13.5px] text-ink-dim">
              Pricing
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
