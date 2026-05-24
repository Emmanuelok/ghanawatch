"use client";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const NAMES = [
  { initials: "KO", color: "#10b981", role: "Trustee" },
  { initials: "AM", color: "#f5b800", role: "You" },
  { initials: "EO", color: "#8b5cf6", role: "Lawyer" },
];

export function PresenceIndicator({ projectName }: { projectName?: string }) {
  const [count, setCount] = useState(NAMES.length);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => Math.max(1, Math.min(5, c + (Math.random() > 0.5 ? 1 : -1))));
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-bg-elev/60 px-2 py-1 text-[11px]">
      <div className="flex -space-x-2">
        {NAMES.slice(0, Math.min(count, NAMES.length)).map((n, i) => (
          <div
            key={n.initials + i}
            className="grid h-5 w-5 place-items-center rounded-full border-2 border-bg-card text-[9px] font-semibold text-bg"
            style={{ background: n.color }}
            title={`${n.initials} · ${n.role}`}
          >
            {n.initials}
          </div>
        ))}
        {count > NAMES.length && (
          <div className="grid h-5 w-5 place-items-center rounded-full border-2 border-bg-card bg-bg-subtle text-[9px] font-semibold text-ink-dim">
            +{count - NAMES.length}
          </div>
        )}
      </div>
      <span className="flex items-center gap-1 text-ink-dim">
        <Eye className="h-3 w-3 text-accent-green" />
        {count} viewing
      </span>
    </div>
  );
}
