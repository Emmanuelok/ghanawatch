"use client";
import { useState } from "react";
import {
  Vote,
  Wallet,
  Calendar,
  Users,
  Check,
  Sparkles,
  ChevronRight,
  Mic2,
  FileText,
  Award,
} from "lucide-react";

const ROOM = {
  name: "Kasoa Sons & Daughters (Toronto)",
  members: 184,
  treasury: 612_000,
  active: 27,
};

const PROPOSALS = [
  { id: "pr-1", title: "Fund Kasoa Library — Phase 2 roofing (GHS 48,000)", status: "voting", endsIn: "2d 4h", yes: 86, no: 14, quorum: 92, total: 184, type: "spend" },
  { id: "pr-2", title: "Approve Trustee K. Owusu for all 2026 association projects", status: "voting", endsIn: "5d", yes: 142, no: 8, quorum: 92, total: 184, type: "operational" },
  { id: "pr-3", title: "Increase monthly member dues from GHS 50 → GHS 75", status: "voting", endsIn: "9d 6h", yes: 64, no: 88, quorum: 92, total: 184, type: "policy" },
  { id: "pr-4", title: "Elect 2026-2027 Executive Committee", status: "scheduled", endsIn: "Opens 2026-06-15", yes: 0, no: 0, quorum: 92, total: 184, type: "election" },
  { id: "pr-5", title: "Approve Q4 2025 audit", status: "passed", endsIn: "Passed 18 Mar", yes: 168, no: 4, quorum: 92, total: 184, type: "operational" },
];

const TREASURY = [
  { ts: "2026-05-22", to: "Member dues (Q2 collection)", amount: +18_000, kind: "in" },
  { ts: "2026-05-18", to: "Kasoa Library Phase 1 (final payment)", amount: -62_000, kind: "out" },
  { ts: "2026-05-15", to: "Trustee F. Adeli (library site survey)", amount: -1_800, kind: "out" },
  { ts: "2026-05-04", to: "Sponsored seat for Eleanor B. (school fees)", amount: -2_400, kind: "out" },
  { ts: "2026-04-30", to: "Member dues (May)", amount: +9_200, kind: "in" },
];

const AGM = {
  date: "2026-06-15",
  location: "Hybrid (Toronto + Live video)",
  agendaItems: [
    "Chairperson's address — outgoing committee",
    "Q4 2025 audited financial statements",
    "Election of 2026-2027 Executive (Chair, Treasurer, Secretary, 4 council)",
    "Vote on Kasoa Library Phase 2 (GHS 48,000)",
    "Open floor — member proposals",
    "Closing prayer + community singing",
  ],
};

export function GovernanceClient() {
  const [tab, setTab] = useState<"proposals" | "treasury" | "agm" | "members">("proposals");

  return (
    <div className="mt-8">
      <div className="card overflow-hidden">
        <div className="grid items-center gap-4 border-b border-line bg-bg-elev/40 p-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Association</div>
            <div className="mt-1 text-[20px] font-semibold tracking-tight">{ROOM.name}</div>
            <div className="mt-1 text-[12px] text-ink-dim">{ROOM.members.toLocaleString()} verified members · {ROOM.active} active community projects</div>
          </div>
          <div className="rounded-xl border border-line bg-bg p-4 text-center">
            <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">Treasury</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-accent-gold">GHS {ROOM.treasury.toLocaleString()}</div>
            <div className="text-[10px] text-ink-muted">held in association escrow</div>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-line">
          {(["proposals", "treasury", "agm", "members"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative shrink-0 px-4 py-3 text-[13px] capitalize ${
                tab === t ? "text-ink" : "text-ink-dim hover:text-ink"
              }`}
            >
              {t === "agm" ? "AGM" : t}
              {tab === t && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent-gold" />}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "proposals" && <Proposals />}
          {tab === "treasury" && <Treasury />}
          {tab === "agm" && <Agm />}
          {tab === "members" && <Members />}
        </div>
      </div>
    </div>
  );
}

function Proposals() {
  return (
    <div className="space-y-3">
      {PROPOSALS.map((p) => {
        const pct = ((p.yes + p.no) / p.total) * 100;
        const quorum = ((p.yes + p.no) / p.quorum) * 100;
        const color = p.status === "passed" ? "#10b981" : p.status === "scheduled" ? "#9aa0b0" : "#f5b800";
        return (
          <div key={p.id} className="rounded-xl border border-line bg-bg-elev/40 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip uppercase tracking-wider" style={{ color, borderColor: `${color}30`, background: `${color}10` }}>
                {p.status}
              </span>
              <span className="chip capitalize text-[10px]">{p.type}</span>
              <span className="ml-auto text-[11px] text-ink-muted">{p.endsIn}</span>
            </div>
            <div className="mt-2 text-[14px] font-semibold">{p.title}</div>

            {(p.status === "voting" || p.status === "passed") && (
              <div className="mt-3 space-y-2">
                <div>
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className="text-accent-green">Yes · {p.yes}</span>
                    <span className="text-risk-high">No · {p.no}</span>
                  </div>
                  <div className="mt-1 flex h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
                    <div className="bg-accent-green" style={{ width: `${(p.yes / p.total) * 100}%` }} />
                    <div className="bg-risk-high" style={{ width: `${(p.no / p.total) * 100}%` }} />
                  </div>
                </div>
                <div className="flex items-baseline justify-between text-[11px] text-ink-muted">
                  <span>Quorum {Math.min(100, Math.round(quorum))}%</span>
                  <span>{p.yes + p.no} / {p.total} voted</span>
                </div>
              </div>
            )}

            {p.status === "voting" && (
              <div className="mt-4 flex gap-2">
                <button className="btn btn-primary text-[12px] py-1.5"><Check className="h-3.5 w-3.5" /> Vote yes</button>
                <button className="btn btn-ghost text-[12px] py-1.5">Vote no</button>
                <button className="btn btn-ghost text-[12px] py-1.5">Abstain</button>
                <span className="ml-auto text-[11px] text-ink-muted">Secret ballot · KYC-verified members only</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Treasury() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="mb-2 text-[14px] font-semibold">Recent transactions</div>
        <div className="rounded-xl border border-line">
          <table className="w-full text-[12px]">
            <thead className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-muted">
              <tr className="border-b border-line">
                <th className="px-4 py-2">When</th>
                <th className="px-4 py-2">Memo</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {TREASURY.map((t, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  <td className="px-4 py-2.5 text-ink-dim">{t.ts}</td>
                  <td className="px-4 py-2.5 text-ink">{t.to}</td>
                  <td className="px-4 py-2.5 text-right font-semibold" style={{ color: t.amount > 0 ? "#10b981" : "#ef4444" }}>
                    {t.amount > 0 ? "+" : ""}GHS {Math.abs(t.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card p-5">
        <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><Wallet className="h-4 w-4 text-accent-gold" /> Treasury policy</div>
        <ul className="space-y-2 text-[12px] text-ink-dim">
          <li>· 2-of-3 signatories (Chair, Treasurer, GhanaWatch oracle) for any out &gt; GHS 5,000.</li>
          <li>· Monthly member statement auto-published.</li>
          <li>· Yearly audit by independent CA.</li>
          <li>· Treasury reports anchored to Bitcoin daily.</li>
        </ul>
      </div>
    </div>
  );
}

function Agm() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-xl border border-line bg-bg-elev/40 p-5">
        <div className="flex items-center gap-2 text-[14px] font-semibold"><Calendar className="h-4 w-4 text-accent-gold" /> Annual General Meeting</div>
        <div className="mt-2 text-[20px] font-semibold tracking-tight">{AGM.date}</div>
        <div className="text-[12px] text-ink-dim">{AGM.location} · 14:00 EST / 18:00 UTC</div>
        <div className="mt-4 text-[11px] uppercase tracking-[0.12em] text-ink-muted">Agenda</div>
        <ol className="mt-2 space-y-2 text-[12.5px]">
          {AGM.agendaItems.map((a, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="font-mono text-[11px] text-ink-muted">{i + 1}.</span>
              <span className="text-ink-dim">{a}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex gap-2">
          <button className="btn btn-primary text-[12px] py-1.5"><Check className="h-3.5 w-3.5" /> RSVP yes (148/184 so far)</button>
          <button className="btn btn-ghost text-[12px] py-1.5">Add to calendar</button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><Mic2 className="h-4 w-4 text-accent-gold" /> Election candidates</div>
          <ul className="space-y-2 text-[12px]">
            <li className="flex items-center gap-2 text-ink-dim"><Award className="h-3 w-3 text-accent-gold" /> <span>Akosua Mensah — Chair (re-election)</span></li>
            <li className="flex items-center gap-2 text-ink-dim"><Award className="h-3 w-3 text-accent-gold" /> <span>Yaw Boateng — Treasurer (incoming)</span></li>
            <li className="flex items-center gap-2 text-ink-dim"><Award className="h-3 w-3 text-accent-gold" /> <span>Esi Forson — Secretary (re-election)</span></li>
          </ul>
        </div>
        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><FileText className="h-4 w-4 text-accent-gold" /> Pre-AGM packet</div>
          <div className="text-[12px] text-ink-dim">Q4 statements, audit letter, candidate manifestos.</div>
          <button className="btn btn-ghost mt-3 text-[12px] py-1.5 w-full justify-center">Download (PDF, 28 pages)</button>
        </div>
      </div>
    </div>
  );
}

function Members() {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <div className="text-[14px] font-semibold">{ROOM.members} members</div>
        <div className="text-[11px] text-ink-muted">All KYC-verified · 178 active in last 30d</div>
      </div>
      <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="card p-3">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-bg-elev text-[10px] font-semibold text-ink-dim">
                {String.fromCharCode(65 + (i % 26))}M
              </div>
              <div className="min-w-0">
                <div className="truncate text-[12px] font-semibold">Member {1841 + i}</div>
                <div className="text-[10px] text-ink-muted">Toronto · joined 2024</div>
              </div>
              <Check className="ml-auto h-3 w-3 text-accent-green" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
