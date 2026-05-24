import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  Award,
  Quote,
  Check,
} from "lucide-react";
import { TRUSTEES, VENDORS } from "@/lib/mock-data";
import { Sparkline } from "@/components/sparkline";

export default async function ReputationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trustee = TRUSTEES.find((t) => t.id === id);
  const vendor = VENDORS.find((v) => v.id === id);
  if (!trustee && !vendor) notFound();

  const subject = trustee
    ? {
        kind: "Trustee" as const,
        name: trustee.name,
        profession: trustee.profession,
        bio: trustee.bio,
        region: trustee.region,
        rating: trustee.rating,
        jobs: trustee.jobsCompleted,
        years: trustee.yearsActive,
        avatar: trustee.avatar,
        verifier: trustee.verifiedBy,
        specialties: trustee.specialties,
      }
    : vendor
    ? {
        kind: "Vendor" as const,
        name: vendor.name,
        profession: vendor.category,
        bio: vendor.bio,
        region: `${vendor.city} · ${vendor.region}`,
        rating: vendor.rating,
        jobs: vendor.jobsCompleted,
        years: vendor.yearsActive,
        avatar: vendor.name.split(" ").map((w) => w[0]).slice(0, 2).join(""),
        verifier: `GRA TIN ${vendor.gra_tin}`,
        specialties: vendor.productLines,
      }
    : null!;

  // Reputation history (mock series)
  const ratingHistory: { v: number }[] = Array.from({ length: 24 }, (_, i) => ({
    v: Math.round((4.3 + Math.sin(i / 4) * 0.15 + (i / 60)) * 10) / 10,
  }));
  const jobsHistory: { v: number }[] = Array.from({ length: 24 }, (_, i) => ({
    v: Math.round((subject.jobs / 24) * (i + 1)),
  }));

  const REVIEWS = [
    { author: "Akosua M. — Toronto", date: "2026-05-12", rating: 5, body: "Independent, thorough, photos within 24h. Saved me from releasing on a flagged milestone." },
    { author: "Nana Yaw B. — London", date: "2026-04-30", rating: 5, body: "Communication was top-tier. Drone footage + 8 ground angles. Caught the encroachment we didn't know about." },
    { author: "Esi F. — Hamburg", date: "2026-04-11", rating: 4, body: "Slightly delayed by weather but the report itself was excellent." },
    { author: "Kojo A. — Sydney", date: "2026-03-28", rating: 5, body: "Hospital visit attestation arrived within 6 hours. Made all the difference." },
  ];

  const BADGES = [
    { label: "100+ verified jobs", icon: Award },
    { label: "Zero disputes 12 months", icon: ShieldCheck },
    { label: "<24h median response", icon: TrendingUp },
    { label: "Top 5% in region", icon: Star },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link href="/reputation" className="mb-6 inline-flex items-center gap-2 text-[12px] text-ink-dim hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Reputation network
      </Link>

      <div className="card overflow-hidden">
        <div className="border-b border-line bg-bg-elev/40 p-6">
          <div className="flex flex-wrap items-start gap-5">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-accent-gold to-accent-green text-[18px] font-bold text-bg">
              {subject.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                <ShieldCheck className="h-3 w-3 text-accent-green" /> {subject.kind} · KYC + license verified
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{subject.name}</h1>
              <div className="text-[13px] text-ink-dim">{subject.profession}</div>
              <p className="mt-3 max-w-xl text-[13px] text-ink-dim">{subject.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {subject.specialties.map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <Stat label="Rating" value={subject.rating.toFixed(2)} sub={`${REVIEWS.length}+ reviews`} color="#f5b800" />
              <Stat label="Jobs" value={`${subject.jobs.toLocaleString()}`} sub={`${subject.years}y active`} color="#10b981" />
            </div>
          </div>
        </div>

        <div className="grid divide-line p-6 md:grid-cols-2 md:divide-x md:p-0">
          <div className="md:p-6">
            <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">Rating history</div>
            <div className="text-[28px] font-semibold">{subject.rating.toFixed(2)} <span className="text-[11px] text-ink-muted">/ 5</span></div>
            <Sparkline data={ratingHistory} color="#f5b800" width={460} height={48} />
          </div>
          <div className="mt-6 md:mt-0 md:p-6">
            <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">Jobs delivered</div>
            <div className="text-[28px] font-semibold">{subject.jobs.toLocaleString()}</div>
            <Sparkline data={jobsHistory} color="#10b981" width={460} height={48} />
          </div>
        </div>

        <div className="border-t border-line p-6">
          <div className="mb-3 text-[14px] font-semibold">Badges earned</div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {BADGES.map((b) => {
              const I = b.icon;
              return (
                <div key={b.label} className="flex items-center gap-3 rounded-xl border border-line bg-bg-elev/40 p-4">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-accent-gold/15 text-accent-gold">
                    <I className="h-4 w-4" />
                  </div>
                  <span className="text-[12.5px]">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-line p-6">
          <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold"><Quote className="h-4 w-4 text-accent-gold" /> Verified reviews</div>
          <div className="space-y-3">
            {REVIEWS.map((r) => (
              <div key={r.body} className="rounded-md border border-line bg-bg-elev/40 p-4">
                <div className="flex items-center justify-between text-[11px] text-ink-muted">
                  <span>{r.author}</span>
                  <span>{r.date}</span>
                </div>
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3" style={{ color: i < r.rating ? "#f5b800" : "#3a3f4d", fill: i < r.rating ? "#f5b800" : "transparent" }} />
                  ))}
                </div>
                <p className="mt-2 text-[13px] text-ink">"{r.body}"</p>
                <div className="mt-2 text-[10px] text-ink-muted"><Check className="mr-1 inline h-3 w-3 text-accent-green" /> Reviewer is a KYC-verified GhanaWatch user with a closed project</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, color }: any) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      <div className="mt-1 text-[24px] font-semibold" style={{ color: color || "#e8eaf0" }}>{value}</div>
      <div className="text-[10px] text-ink-muted">{sub}</div>
    </div>
  );
}
