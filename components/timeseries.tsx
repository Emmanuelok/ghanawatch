export function TimeSeries({
  series,
  height = 180,
  yMax,
  yMin,
  showAxis = true,
}: {
  series: { name: string; color: string; data: { d: string; v: number }[] }[];
  height?: number;
  yMax?: number;
  yMin?: number;
  showAxis?: boolean;
}) {
  if (!series.length || !series[0].data.length) return null;
  const W = 720;
  const H = height;
  const pad = { l: showAxis ? 32 : 8, r: 8, t: 12, b: showAxis ? 22 : 8 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const all = series.flatMap((s) => s.data.map((d) => d.v));
  const mx = yMax ?? Math.max(...all);
  const mn = yMin ?? Math.min(...all);
  const range = Math.max(1, mx - mn);
  const len = series[0].data.length;

  const xAt = (i: number) => pad.l + (i / (len - 1)) * innerW;
  const yAt = (v: number) => pad.t + innerH - ((v - mn) / range) * innerH;

  const gridLines = 4;
  const grid = Array.from({ length: gridLines + 1 }, (_, i) => {
    const y = pad.t + (i / gridLines) * innerH;
    const v = Math.round(mx - (i / gridLines) * range);
    return { y, v };
  });

  const xTicks = [0, Math.floor(len / 2), len - 1];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H}>
        {/* Grid */}
        {grid.map((g, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={g.y} y2={g.y} stroke="#1a1d27" strokeDasharray="3 4" />
            {showAxis && (
              <text x={pad.l - 6} y={g.y + 3} fontSize="9" textAnchor="end" fill="#6b7280">
                {g.v}
              </text>
            )}
          </g>
        ))}

        {/* X axis labels */}
        {showAxis &&
          xTicks.map((i) => (
            <text key={i} x={xAt(i)} y={H - 6} fontSize="9" textAnchor="middle" fill="#6b7280">
              {series[0].data[i].d.slice(5)}
            </text>
          ))}

        {/* Lines */}
        {series.map((s) => {
          const path = s.data
            .map((d, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(d.v).toFixed(1)}`)
            .join(" ");
          const area = `${path} L${xAt(len - 1).toFixed(1)},${pad.t + innerH} L${xAt(0).toFixed(1)},${pad.t + innerH} Z`;
          const id = `g-${s.color.replace("#", "")}-${s.name.replace(/\W/g, "")}`;
          return (
            <g key={s.name}>
              <defs>
                <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill={`url(#${id})`} />
              <path d={path} fill="none" stroke={s.color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
            </g>
          );
        })}
      </svg>

      {series.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-ink-dim">
          {series.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
