import { TRUSTEES } from "@/lib/mock-data";
import { Shield, Star, MapPin, Briefcase, Clock3, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Trustee Network — GhanaWatch" };

export default function NetworkPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="max-w-2xl">
        <div className="chip mb-4"><Shield className="h-3 w-3 text-accent-gold" /> Verified humans on the ground</div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Trustee network</h1>
        <p className="mt-3 text-[15px] text-ink-dim">
          Licensed surveyors, quantity surveyors, conveyancing lawyers, GRA-licensed clearing agents,
          doctors and MoFA-trained agricultural officers — vetted against the relevant Ghanaian
          regulator and dispatched on demand to verify your project in person.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Kpi label="Trustees active" value="1,240" />
        <Kpi label="Average dispatch time" value="38h" />
        <Kpi label="Regulator-verified" value="100%" />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {TRUSTEES.map((t) => (
          <div key={t.id} className="card p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent-gold to-accent-green text-[14px] font-semibold text-bg">
                {t.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold">{t.name}</div>
                <div className="text-[12px] text-ink-dim">{t.profession}</div>
              </div>
              <span className="chip"><Star className="h-3 w-3" />{t.rating}</span>
            </div>

            <p className="mt-3 text-[13px] text-ink-dim">{t.bio}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {t.specialties.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>

            <div className="mt-4 grid gap-2 border-t border-line pt-4 text-[12px]">
              <Row icon={MapPin} label="Region" value={t.region} />
              <Row icon={Briefcase} label="Jobs completed" value={`${t.jobsCompleted} · ${t.yearsActive}y experience`} />
              <Row icon={CheckCircle2} label="Verified by" value={t.verifiedBy} />
              <Row icon={Clock3} label="Fee range" value={t.feeRange} />
            </div>

            <button className="btn btn-primary mt-4 w-full justify-center">Dispatch trustee</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3 w-3 shrink-0 text-ink-muted" />
      <div className="min-w-0">
        <span className="text-ink-muted">{label}: </span>
        <span className="text-ink">{value}</span>
      </div>
    </div>
  );
}
