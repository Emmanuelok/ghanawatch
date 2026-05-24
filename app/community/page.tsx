import Link from "next/link";
import { Users, ShieldCheck, MessageCircle, Banknote, MapPin } from "lucide-react";
import { HOMETOWN_ROOMS } from "@/lib/mock-data";

export const metadata = { title: "Hometown Rooms — GhanaWatch" };

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Users className="h-3 w-3" /> Community
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Hometown rooms</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Private spaces for diaspora communities (city × hometown). Pool projects, share trustees,
          warn each other about active fraud clusters. Every member is KYC-verified. No outsiders.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {HOMETOWN_ROOMS.map((r) => (
          <Link key={r.id} href={`#room-${r.id}`} className="card card-hover p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-[15px] font-semibold">{r.name}</div>
                  {r.verified && (
                    <span className="chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.25)" }}>
                      <ShieldCheck className="h-3 w-3" /> verified
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[12px] text-ink-dim">
                  <MapPin className="h-3 w-3" /> {r.region}
                </div>
              </div>
            </div>
            <p className="mt-3 text-[13px] text-ink-dim">{r.description}</p>

            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center text-[11px]">
              <Stat label="Members" value={r.members.toLocaleString()} />
              <Stat label="Active projects" value={`${r.activeProjects}`} />
              <Stat label="Pooled" value={`GHS ${(r.pooledGHS / 1000).toFixed(0)}K`} />
            </div>

            {r.lastMessage && (
              <div className="mt-4 rounded-md border border-line bg-bg-elev/40 p-3 text-[12px]">
                <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                  <MessageCircle className="h-3 w-3" /> {r.lastMessage.actor} ·{" "}
                  {new Date(r.lastMessage.ts).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </div>
                <div className="mt-1 text-ink">"{r.lastMessage.text}"</div>
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-10 card p-6">
        <div className="text-[14px] font-semibold">Why hometown rooms work</div>
        <ul className="mt-3 grid gap-2 text-[13px] text-ink-dim md:grid-cols-2">
          <li className="flex items-start gap-2"><Users className="mt-0.5 h-3.5 w-3.5 text-accent-gold" /> KYC required to join — no anonymous fraudsters.</li>
          <li className="flex items-start gap-2"><Banknote className="mt-0.5 h-3.5 w-3.5 text-accent-gold" /> Pool funds for shared projects (community libraries, clinics, schools).</li>
          <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-accent-gold" /> Share recommended trustees + warnings about local scammers.</li>
          <li className="flex items-start gap-2"><MessageCircle className="mt-0.5 h-3.5 w-3.5 text-accent-gold" /> Pattern detection: 3 members hit by the same scam? Auto-flag for the whole network.</li>
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[14px] font-semibold text-ink">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
    </div>
  );
}
