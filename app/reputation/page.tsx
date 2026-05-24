import Link from "next/link";
import { Star, ShieldCheck, Briefcase, Users, ArrowUpRight } from "lucide-react";
import { TRUSTEES, VENDORS, PROJECTS } from "@/lib/mock-data";

export const metadata = { title: "Reputation — GhanaWatch" };

export default function ReputationPage() {
  const trustees = TRUSTEES.slice(0, 4);
  const vendors = VENDORS.slice(0, 4);
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Star className="h-3 w-3" /> Reputation network
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Track record, in the open.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Every person and vendor on GhanaWatch has a reputation page. Diaspora users build trust
          over time as their projects close cleanly. Trustees and vendors earn their rank from
          verified jobs, never paid reviews. Managers earn ground-truth reputation from each
          milestone they ship without flags.
        </p>
      </div>

      <Section title="Top trustees" items={trustees.map((t) => ({
        href: `/reputation/${t.id}`, name: t.name, sub: t.profession,
        rating: t.rating, jobs: t.jobsCompleted, region: t.region,
        avatar: t.avatar, verifier: t.verifiedBy,
      }))} />

      <Section title="Top vendors" items={vendors.map((v) => ({
        href: `/reputation/${v.id}`, name: v.name, sub: `${v.category}`,
        rating: v.rating, jobs: v.jobsCompleted, region: `${v.city} · ${v.region}`,
        avatar: v.name.split(" ").map((w) => w[0]).slice(0, 2).join(""), verifier: `GRA TIN ${v.gra_tin}`,
      }))} />

      <Section title="Diaspora owners (anonymised)" items={PROJECTS.slice(0, 4).map((p, i) => ({
        href: `/reputation/owner-${i + 1}`,
        name: `Owner #${(i + 1) * 7841}`,
        sub: `${p.region} · ${p.sector}`,
        rating: 4.4 + (i % 3) * 0.15,
        jobs: i + 2,
        region: p.ownerLocation,
        avatar: "?",
        verifier: "KYC verified",
      }))} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="mt-10">
      <div className="mb-4 text-[14px] font-semibold">{title}</div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="card card-hover p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent-gold/30 to-accent-green/30 text-[12px] font-semibold text-ink">
                {it.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-semibold">{it.name}</div>
                <div className="truncate text-[11px] text-ink-dim">{it.sub}</div>
              </div>
              <span className="chip"><Star className="h-3 w-3 text-accent-gold" /> {it.rating.toFixed(1)}</span>
            </div>
            <div className="mt-3 grid gap-1 text-[11px] text-ink-dim">
              <span className="flex items-center gap-1.5"><Briefcase className="h-3 w-3 text-ink-muted" /> {it.jobs} jobs</span>
              <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-ink-muted" /> {it.region}</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-accent-green" /> {it.verifier}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[12px] text-ink-dim">
              <span>View track record</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
