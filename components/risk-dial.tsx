export function RiskDial({ score, size = 140 }: { score: number; size?: number }) {
  const r = (size - 18) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const dash = (pct / 100) * c;
  const color = pct >= 70 ? "#ef4444" : pct >= 40 ? "#f59e0b" : "#10b981";
  const label = pct >= 70 ? "High Risk" : pct >= 40 ? "Medium" : "Low Risk";
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1a1d27" strokeWidth={10} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-[26px] font-semibold leading-none" style={{ color }}>
          {pct}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      </div>
    </div>
  );
}

export function TrustGauge({ score }: { score: number }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Trust Score</span>
        <span className="text-[18px] font-semibold" style={{ color }}>
          {score}
          <span className="ml-0.5 text-[12px] text-ink-muted">/100</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}
