"use client";
import { useEffect, useState } from "react";
import { MousePointer2 } from "lucide-react";

type Cursor = { id: string; name: string; color: string; x: number; y: number; tx: number; ty: number };

const PEERS: Omit<Cursor, "x" | "y" | "tx" | "ty">[] = [
  { id: "p-1", name: "Kojo Owusu", color: "#10b981" },
  { id: "p-2", name: "Esi Ofori", color: "#8b5cf6" },
];

export function CursorPresence() {
  const [cursors, setCursors] = useState<Cursor[]>(
    PEERS.map((p) => ({ ...p, x: 200, y: 200, tx: 200, ty: 200 })),
  );

  // Random walk targets
  useEffect(() => {
    const id = setInterval(() => {
      setCursors((cs) =>
        cs.map((c) => ({
          ...c,
          tx: Math.max(60, Math.min((typeof window !== "undefined" ? window.innerWidth : 1400) - 60, c.tx + (Math.random() - 0.5) * 240)),
          ty: Math.max(80, Math.min((typeof window !== "undefined" ? window.innerHeight : 800) - 80, c.ty + (Math.random() - 0.5) * 180)),
        })),
      );
    }, 2200);
    return () => clearInterval(id);
  }, []);

  // Smooth follow
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setCursors((cs) =>
        cs.map((c) => ({
          ...c,
          x: c.x + (c.tx - c.x) * 0.04,
          y: c.y + (c.ty - c.y) * 0.04,
        })),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {cursors.map((c) => (
        <div
          key={c.id}
          className="absolute transition-transform"
          style={{ transform: `translate(${c.x}px, ${c.y}px)` }}
        >
          <MousePointer2 className="h-4 w-4 -rotate-12" style={{ color: c.color, fill: c.color }} />
          <div
            className="ml-3 -mt-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white shadow-md"
            style={{ background: c.color }}
          >
            {c.name}
          </div>
        </div>
      ))}
    </div>
  );
}
