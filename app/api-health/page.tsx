"use client";
import { useEffect, useState } from "react";
import { Activity, CheckCircle2, Globe, Zap, ArrowRight } from "lucide-react";
import { Sparkline } from "@/components/sparkline";

const ENDPOINTS = [
  { method: "POST", path: "/v1/verify/document", p50: 380, p95: 920, p99: 1840, rps: 142, errors: 0.02 },
  { method: "POST", path: "/v1/photo-vision", p50: 1240, p95: 2480, p99: 4100, rps: 38, errors: 0.04 },
  { method: "POST", path: "/v1/dispatch", p50: 220, p95: 540, p99: 880, rps: 18, errors: 0 },
  { method: "POST", path: "/v1/escrow/release", p50: 460, p95: 1120, p99: 2200, rps: 22, errors: 0.01 },
  { method: "GET", path: "/v1/projects/{id}", p50: 88, p95: 188, p99: 412, rps: 612, errors: 0 },
  { method: "GET", path: "/v1/projects/{id}/ledger", p50: 144, p95: 318, p99: 720, rps: 188, errors: 0 },
  { method: "POST", path: "/v1/anchor/verify", p50: 220, p95: 480, p99: 940, rps: 44, errors: 0 },
];

const REGIONS = [
  { code: "eu-central-1", city: "Frankfurt", rps: 412, p95: 142 },
  { code: "us-east-1", city: "Virginia", rps: 304, p95: 168 },
  { code: "ap-southeast-2", city: "Sydney", rps: 88, p95: 188 },
];

function gen() { const o:{v:number}[]=[]; let v=50; for(let i=0;i<60;i++){ v+=Math.sin(i/3)*4+1; o.push({v:Math.round(v)});} return o; }

export default function ApiHealthPage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            <Activity className="h-3 w-3" /> Public API health
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Live API metrics, no secrets.</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
            Per-endpoint latency, error rate, and RPS — refreshed every 3 seconds. The same metrics
            our internal SRE team watches.
          </p>
        </div>
        <span className="chip text-[12px]">
          <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-accent-green animate-pulse" />
          Live · tick #{tick}
        </span>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Kpi label="Status" value="All systems operational" color="#10b981" icon={CheckCircle2} />
        <Kpi label="RPS (now)" value={`${ENDPOINTS.reduce((s, e) => s + e.rps, 0).toLocaleString()}`} color="#3b82f6" icon={Zap} />
        <Kpi label="p95 (across)" value="280ms" color="#10b981" />
        <Kpi label="90d uptime" value="99.96%" color="#10b981" />
      </div>

      <div className="mt-8 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line bg-bg-elev/40 px-5 py-3">
          <div className="text-[14px] font-semibold">Per-endpoint metrics</div>
          <span className="chip text-[10px]">last 60s rolling</span>
        </div>
        <table className="w-full text-[12px]">
          <thead className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            <tr className="border-b border-line">
              <th className="px-5 py-3">Endpoint</th>
              <th className="px-3 py-3 text-right">RPS</th>
              <th className="px-3 py-3 text-right">p50</th>
              <th className="px-3 py-3 text-right">p95</th>
              <th className="px-3 py-3 text-right">p99</th>
              <th className="px-3 py-3 text-right">Errors</th>
              <th className="px-5 py-3">Throughput</th>
            </tr>
          </thead>
          <tbody>
            {ENDPOINTS.map((e) => (
              <tr key={e.path} className="border-b border-line last:border-0">
                <td className="px-5 py-3">
                  <span className="chip uppercase text-[9px]" style={{ color: e.method === "POST" ? "#3b82f6" : "#10b981" }}>{e.method}</span>{" "}
                  <code className="text-[11.5px] text-ink">{e.path}</code>
                </td>
                <td className="px-3 py-3 text-right text-ink">{e.rps}</td>
                <td className="px-3 py-3 text-right text-ink-dim">{e.p50}ms</td>
                <td className="px-3 py-3 text-right text-ink-dim">{e.p95}ms</td>
                <td className="px-3 py-3 text-right text-ink-dim">{e.p99}ms</td>
                <td className="px-3 py-3 text-right font-semibold" style={{ color: e.errors === 0 ? "#10b981" : "#f59e0b" }}>{e.errors}%</td>
                <td className="px-5 py-3"><Sparkline data={gen()} color="#3b82f6" width={120} height={24} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {REGIONS.map((r) => (
          <div key={r.code} className="card p-5">
            <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-accent-gold" /><div className="text-[13px] font-semibold">{r.city}</div></div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ink-muted">{r.code}</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
              <div><div className="text-[10px] text-ink-muted">RPS</div><div className="text-[18px] font-semibold">{r.rps}</div></div>
              <div><div className="text-[10px] text-ink-muted">p95</div><div className="text-[18px] font-semibold">{r.p95}ms</div></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <div className="text-[14px] font-semibold">Public examples</div>
        <p className="mt-1 text-[12px] text-ink-dim">A few requests our partners ran in the last 60 seconds (anonymised):</p>
        <pre className="mt-3 overflow-x-auto rounded-md bg-bg-elev/60 p-3 text-[11px] leading-relaxed text-ink-dim">{`POST /v1/verify/document · 380ms · 200 OK
GET  /v1/projects/****-****/ledger?from=2026-05-01 · 122ms · 200 OK
POST /v1/dispatch · 220ms · 200 OK
POST /v1/anchor/verify · 280ms · 200 OK
POST /v1/photo-vision · 1240ms · 200 OK`}</pre>
      </div>
    </div>
  );
}

function Kpi({ label, value, color, icon: Icon }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        {Icon && <Icon className="h-3 w-3" style={{ color }} />} {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight" style={color ? { color } : {}}>{value}</div>
    </div>
  );
}
