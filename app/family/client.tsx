"use client";
import { useState } from "react";
import { Plus, ShieldCheck, Heart, User, Star, Crown, Check } from "lucide-react";

type Person = {
  id: string;
  name: string;
  relation: string;
  generation: number; // 0 = parents, 1 = self/siblings, 2 = children
  position: number; // x position within generation
  kyc: boolean;
  role: string[];
  inGhana: boolean;
  contact?: string;
  isMe?: boolean;
};

const PEOPLE: Person[] = [
  { id: "p1", name: "Joseph Mensah", relation: "Father", generation: 0, position: 0, kyc: true, role: ["Next of kin", "Co-signer"], inGhana: true, contact: "+233 24 555 1101" },
  { id: "p2", name: "Grace Mensah", relation: "Mother", generation: 0, position: 1, kyc: true, role: ["Next of kin"], inGhana: true, contact: "+233 24 555 1102" },
  { id: "p3", name: "Akosua Mensah", relation: "You", generation: 1, position: 0, kyc: true, role: ["Diaspora owner"], inGhana: false, contact: "Toronto", isMe: true },
  { id: "p4", name: "Kwame Mensah", relation: "Brother", generation: 1, position: 1, kyc: true, role: ["Manager (Kasoa)"], inGhana: true, contact: "+233 24 555 1104" },
  { id: "p5", name: "Adwoa Mensah", relation: "Sister", generation: 1, position: 2, kyc: false, role: [], inGhana: false, contact: "Hamburg" },
  { id: "p6", name: "Yaw Owusu-Mensah", relation: "Cousin", generation: 1, position: 3, kyc: true, role: ["Witness"], inGhana: true },
  { id: "p7", name: "Kofi Mensah", relation: "Son", generation: 2, position: 0, kyc: false, role: ["Beneficiary"], inGhana: false, contact: "Toronto" },
  { id: "p8", name: "Ama Mensah", relation: "Daughter", generation: 2, position: 1, kyc: false, role: ["Beneficiary"], inGhana: false, contact: "Toronto" },
];

const W = 1000;
const H = 540;
const GEN_Y = [80, 270, 460];

function nodePos(p: Person, count: number) {
  const spacing = (W - 100) / Math.max(1, count - 1);
  const x = count === 1 ? W / 2 : 50 + p.position * spacing;
  return { x, y: GEN_Y[p.generation] };
}

export function FamilyTree() {
  const [selected, setSelected] = useState<string | null>("p4");

  const byGen: Record<number, Person[]> = { 0: [], 1: [], 2: [] };
  for (const p of PEOPLE) byGen[p.generation].push(p);

  const sel = PEOPLE.find((p) => p.id === selected) ?? null;

  // Edges: parents → siblings in generation 1; me → my children
  const edges: { from: Person; to: Person }[] = [];
  for (const p of byGen[1]) {
    if (p.id === "p6") continue; // cousin doesn't connect to your parents
    for (const par of byGen[0]) edges.push({ from: par, to: p });
  }
  for (const c of byGen[2]) {
    const me = byGen[1].find((p) => p.isMe)!;
    edges.push({ from: me, to: c });
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="card overflow-hidden p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <defs>
            <linearGradient id="edge" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#222633" />
              <stop offset="100%" stopColor="#1a1d27" />
            </linearGradient>
          </defs>
          {edges.map((e, i) => {
            const a = nodePos(e.from, byGen[e.from.generation].length);
            const b = nodePos(e.to, byGen[e.to.generation].length);
            const mid = (a.y + b.y) / 2;
            return (
              <path
                key={i}
                d={`M ${a.x},${a.y + 30} C ${a.x},${mid} ${b.x},${mid} ${b.x},${b.y - 30}`}
                stroke="#2f3445"
                strokeWidth={1.4}
                fill="none"
              />
            );
          })}
          {PEOPLE.map((p) => {
            const { x, y } = nodePos(p, byGen[p.generation].length);
            const active = selected === p.id;
            const color = p.isMe ? "#f5b800" : p.kyc ? "#10b981" : "#9aa0b0";
            return (
              <g
                key={p.id}
                transform={`translate(${x - 70}, ${y - 30})`}
                onClick={() => setSelected(p.id)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  width="140"
                  height="60"
                  rx="10"
                  fill={active ? "rgba(245,184,0,0.10)" : "#13151d"}
                  stroke={active ? "#f5b800" : color === "#10b981" ? "rgba(16,185,129,0.3)" : "#2f3445"}
                  strokeWidth={active ? 2 : 1}
                />
                <text x="70" y="22" fontSize="12" fontWeight={600} textAnchor="middle" fill="#e8eaf0">
                  {p.name}
                </text>
                <text x="70" y="38" fontSize="9.5" textAnchor="middle" fill="#9aa0b0">
                  {p.relation}{p.isMe ? " ★" : ""}
                </text>
                <circle cx="125" cy="14" r="5" fill={color} />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="space-y-4">
        {sel && (
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent-gold to-accent-green text-[13px] font-bold text-bg">
                {sel.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold">{sel.name}</div>
                <div className="text-[11px] text-ink-dim">{sel.relation} {sel.isMe ? "· that's you" : ""}</div>
              </div>
              {sel.kyc ? (
                <span className="ml-auto chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.25)" }}>
                  <ShieldCheck className="h-3 w-3" /> KYC
                </span>
              ) : (
                <span className="ml-auto chip">unverified</span>
              )}
            </div>
            <div className="mt-3 grid gap-1 text-[12px]">
              <Row k="In Ghana" v={sel.inGhana ? "Yes" : "No"} />
              {sel.contact && <Row k="Contact" v={sel.contact} />}
              <Row k="Roles" v={sel.role.length ? sel.role.join(" · ") : "—"} />
            </div>
            {!sel.kyc && (
              <button className="btn btn-primary mt-4 w-full justify-center text-[12px] py-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Invite to verify
              </button>
            )}
          </div>
        )}

        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><Heart className="h-4 w-4 text-accent-gold" /> Why a verified family circle?</div>
          <ul className="space-y-2 text-[12px] text-ink-dim">
            <li>· Ghanaian estate law is multi-party — your next of kin needs to be named & verified now, not after a crisis.</li>
            <li>· Co-signers on high-value projects must be from your circle.</li>
            <li>· Beneficiaries inherit your verified projects automatically on succession events.</li>
            <li>· In dispute proceedings, the circle becomes your standing witness panel.</li>
          </ul>
          <button className="btn btn-ghost mt-4 w-full justify-center text-[12px] py-1.5">
            <Plus className="h-3.5 w-3.5" /> Add a family member
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ink-muted">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}
