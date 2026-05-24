"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  FolderKanban,
  ScanSearch,
  Sparkles,
  Users,
  Layers,
  BookOpen,
  Map as MapIcon,
  Inbox,
  ScrollText,
  Settings,
  Plus,
  AlertTriangle,
  Banknote,
  Calculator,
  TrendingUp,
  Smartphone,
  Car,
} from "lucide-react";
import { PROJECTS, FORENSIC_CASES } from "@/lib/mock-data";

type Item = {
  id: string;
  label: string;
  hint?: string;
  icon: any;
  href: string;
  group: "Nav" | "Projects" | "Cases" | "Actions";
};

const NAV: Item[] = [
  { id: "dash", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", group: "Nav" },
  { id: "projects", label: "All projects", icon: FolderKanban, href: "/projects", group: "Nav" },
  { id: "verify", label: "Verify document", icon: ScanSearch, href: "/verify", group: "Nav" },
  { id: "investigator", label: "AI Investigator", icon: Sparkles, href: "/investigator", group: "Nav" },
  { id: "inbox", label: "Inbox / Alerts", icon: Inbox, href: "/inbox", group: "Nav" },
  { id: "map", label: "Map view", icon: MapIcon, href: "/map", group: "Nav" },
  { id: "cases", label: "Forensic cases", icon: AlertTriangle, href: "/cases", group: "Nav" },
  { id: "ledger", label: "Ledger explorer", icon: ScrollText, href: "/ledger", group: "Nav" },
  { id: "kb", label: "Fraud knowledge base", icon: BookOpen, href: "/knowledge", group: "Nav" },
  { id: "trustees", label: "Trustee network", icon: Users, href: "/network", group: "Nav" },
  { id: "sectors", label: "Sectors", icon: Layers, href: "/sectors", group: "Nav" },
  { id: "tools", label: "Tools", icon: Calculator, href: "/tools", group: "Nav" },
  { id: "duty", label: "Vehicle duty calculator", icon: Car, href: "/tools/vehicle-duty", group: "Nav" },
  { id: "bench", label: "Market benchmarks", icon: TrendingUp, href: "/benchmarks", group: "Nav" },
  { id: "manager", label: "Manager bot preview", icon: Smartphone, href: "/manager", group: "Nav" },
  { id: "pricing", label: "Pricing", icon: Banknote, href: "/pricing", group: "Nav" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings", group: "Nav" },
  { id: "research", label: "Research", icon: ScrollText, href: "/research", group: "Nav" },
  { id: "new", label: "New project", hint: "Start a new verified venture", icon: Plus, href: "/new-project", group: "Actions" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMod = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isMod) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQ("");
      setCursor(0);
    }
  }, [open]);

  const items: Item[] = useMemo(() => {
    const projectItems: Item[] = PROJECTS.map((p) => ({
      id: `p-${p.id}`,
      label: p.name,
      hint: `${p.location} · risk ${p.riskScore}`,
      icon: FolderKanban,
      href: `/projects/${p.id}`,
      group: "Projects",
    }));
    const caseItems: Item[] = FORENSIC_CASES.map((c) => ({
      id: `c-${c.id}`,
      label: c.title,
      hint: c.severity.toUpperCase() + " · " + c.status,
      icon: AlertTriangle,
      href: `/cases/${c.id}`,
      group: "Cases",
    }));
    return [...NAV, ...projectItems, ...caseItems];
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const t = q.toLowerCase();
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(t) ||
        (i.hint ?? "").toLowerCase().includes(t) ||
        i.group.toLowerCase().includes(t),
    );
  }, [q, items]);

  const groups = useMemo(() => {
    const g: Record<string, Item[]> = {};
    for (const i of filtered) {
      (g[i.group] ??= []).push(i);
    }
    return g;
  }, [filtered]);

  useEffect(() => {
    if (cursor >= filtered.length) setCursor(0);
  }, [filtered, cursor]);

  function activate(i: Item) {
    setOpen(false);
    router.push(i.href);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-start justify-center bg-black/60 pt-[12vh] backdrop-blur-sm">
      <div className="w-[min(640px,92vw)] overflow-hidden rounded-xl border border-line bg-bg-card shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <Search className="h-4 w-4 text-ink-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(filtered.length - 1, c + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(0, c - 1));
              } else if (e.key === "Enter" && filtered[cursor]) {
                e.preventDefault();
                activate(filtered[cursor]);
              }
            }}
            placeholder="Search projects, cases, pages — or type an action"
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-ink-muted"
          />
          <span className="chip text-[10px]">esc</span>
        </div>
        <div className="max-h-[55vh] overflow-y-auto scroll-shadow">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <div className="px-4 pt-3 text-[10px] uppercase tracking-[0.14em] text-ink-muted">{group}</div>
              <ul className="py-1">
                {items.map((i) => {
                  const idx = filtered.indexOf(i);
                  const active = idx === cursor;
                  const Icon = i.icon;
                  return (
                    <li
                      key={i.id}
                      onMouseEnter={() => setCursor(idx)}
                      onClick={() => activate(i)}
                      className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-[13px] ${
                        active ? "bg-bg-elev" : ""
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 text-ink-muted" />
                      <span className="text-ink">{i.label}</span>
                      {i.hint && <span className="ml-auto text-[11px] text-ink-muted">{i.hint}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-ink-muted">No matches.</div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-line px-4 py-2 text-[11px] text-ink-muted">
          <span>⏎ select · ↑↓ navigate</span>
          <span>⌘K to toggle</span>
        </div>
      </div>
    </div>
  );
}
