"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Shield, Menu, X, Search, Command, ChevronDown } from "lucide-react";
import { NotificationBell } from "./notification-bell";
import { CurrencySelector } from "./currency-context";

const primary = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/map", label: "Map" },
  { href: "/cases", label: "Cases" },
  { href: "/verify", label: "Verify" },
  { href: "/investigator", label: "AI" },
];

const moreGroups = [
  {
    title: "Tools",
    items: [
      { href: "/tools", label: "All tools" },
      { href: "/tools/vehicle-duty", label: "Vehicle duty calculator" },
      { href: "/tools/cost-simulator", label: "Build cost simulator" },
      { href: "/benchmarks", label: "Market benchmarks" },
      { href: "/parcel-draw", label: "Draw parcel boundary" },
      { href: "/ledger", label: "Ledger explorer" },
      { href: "/activity", label: "Live activity" },
      { href: "/digest", label: "Digest builder" },
      { href: "/templates", label: "Document templates" },
      { href: "/compare", label: "Compare projects" },
      { href: "/funding", label: "Fund escrow" },
      { href: "/escrow-contract", label: "Smart-contract escrow" },
      { href: "/alerts", label: "Smart alerts" },
      { href: "/anchor", label: "Blockchain anchor" },
      { href: "/email-forensics", label: "Email forensics" },
      { href: "/scenarios", label: "Scenario planner" },
      { href: "/reports", label: "Reports library" },
      { href: "/assets", label: "Asset registry" },
      { href: "/red-team", label: "AI red-team" },
      { href: "/climate-risk", label: "Climate & infra risk" },
      { href: "/forecasting", label: "AI fraud forecasting" },
      { href: "/rfq", label: "RFQ marketplace" },
      { href: "/claims", label: "Insurance claims" },
      { href: "/esg", label: "ESG & carbon" },
      { href: "/succession", label: "Succession plan" },
      { href: "/integrations", label: "Integrations (Slack/Teams…)" },
    ],
  },
  {
    title: "Trust & people",
    items: [
      { href: "/identity", label: "Identity / KYC" },
      { href: "/review", label: "Analyst review desk" },
      { href: "/network", label: "Trustee network" },
      { href: "/network/become-a-trustee", label: "Become a trustee" },
      { href: "/network/become-a-trustee/deep-kyc", label: "Trustee deep KYC" },
      { href: "/manager", label: "Manager bot preview" },
      { href: "/reputation", label: "Reputation network" },
      { href: "/mediation", label: "Mediation room" },
    ],
  },
  {
    title: "Community & build",
    items: [
      { href: "/onboarding", label: "Get started (onboarding)" },
      { href: "/portfolios", label: "Portfolios" },
      { href: "/family", label: "Family circle" },
      { href: "/community", label: "Hometown rooms" },
      { href: "/governance", label: "Hometown governance" },
      { href: "/demo", label: "Guided demo" },
      { href: "/vendors", label: "Verified vendors" },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/disputes", label: "Disputes & ADR" },
      { href: "/insurance", label: "Fraud insurance" },
      { href: "/mobile", label: "Mobile app preview" },
      { href: "/knowledge", label: "Fraud knowledge base" },
      { href: "/sectors", label: "Sectors" },
      { href: "/developers", label: "API & webhooks" },
      { href: "/help", label: "Help center" },
      { href: "/achievements", label: "Achievements" },
      { href: "/referrals", label: "Refer & earn" },
      { href: "/languages", label: "Languages (Twi, Ewe, Pidgin…)" },
      { href: "/tour", label: "Interactive product tour" },
      { href: "/for/uk", label: "For UK diaspora" },
      { href: "/for/us", label: "For US diaspora" },
      { href: "/for/ca", label: "For Canadian diaspora" },
      { href: "/for/de", label: "For German diaspora" },
      { href: "/hardship", label: "Hardship & pro-bono" },
      { href: "/transparency", label: "Public transparency" },
      { href: "/status", label: "Platform status" },
    ],
  },
  {
    title: "Institutional",
    items: [
      { href: "/compliance", label: "Compliance dashboard" },
      { href: "/diaspora-bond", label: "Diaspora bond programme" },
      { href: "/embassy", label: "Embassy desk" },
      { href: "/partners", label: "Partners & case studies" },
      { href: "/whitelabel", label: "White-label studio" },
      { href: "/government", label: "Government partnerships" },
      { href: "/sentinel", label: "Sentinel SOC" },
    ],
  },
];

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

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
          {primary.map((l) => {
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
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13px] text-ink-dim hover:bg-bg-elev hover:text-ink"
            >
              More <ChevronDown className="h-3 w-3" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-9 z-50 w-[860px] overflow-hidden rounded-xl border border-line bg-bg-card shadow-2xl">
                <div className="grid grid-cols-4 divide-x divide-line">
                  {moreGroups.map((g) => (
                    <div key={g.title} className="p-4">
                      <div className="mb-2 text-[10px] uppercase tracking-[0.14em] text-ink-muted">{g.title}</div>
                      <div className="space-y-0.5">
                        {g.items.map((it) => (
                          <Link
                            key={it.href}
                            href={it.href}
                            onClick={() => setMoreOpen(false)}
                            className="block rounded-md px-2 py-1.5 text-[13px] text-ink-dim hover:bg-bg-elev hover:text-ink"
                          >
                            {it.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
          <div className="hidden md:block"><CurrencySelector /></div>
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
            {primary.map((l) => {
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
            {moreGroups.flatMap((g) => g.items).map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-[13.5px] text-ink-dim"
              >
                {it.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
