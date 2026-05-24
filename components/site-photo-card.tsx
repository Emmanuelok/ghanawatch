import { MapPin, Camera, Brain, AlertTriangle, CheckCircle2, Fingerprint } from "lucide-react";
import type { SitePhoto } from "@/lib/types";

export function SitePhotoCard({ photo }: { photo: SitePhoto }) {
  const off = photo.distanceM > 100;
  const match = photo.sceneMatchScore;
  const color = photo.flagged ? "#ef4444" : match >= 90 ? "#10b981" : "#f59e0b";

  return (
    <div className="card overflow-hidden">
      {/* Photo placeholder */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-bg-elev to-bg-subtle">
        <div className="absolute inset-0 grid place-items-center">
          <div
            className="grid h-14 w-14 place-items-center rounded-full border border-line bg-bg/60 backdrop-blur"
            style={{ color }}
          >
            <Camera className="h-6 w-6" />
          </div>
        </div>
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="chip" style={{ background: "rgba(0,0,0,0.55)" }}>
            <MapPin className="h-3 w-3" />
            {photo.latitude.toFixed(4)}, {photo.longitude.toFixed(4)}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <span
            className="chip"
            style={{
              background: photo.flagged ? "rgba(239,68,68,0.85)" : "rgba(16,185,129,0.75)",
              color: "#fff",
              borderColor: "transparent",
            }}
          >
            {photo.flagged ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
            {photo.flagged ? "Flagged" : "Verified"}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-[12px] text-ink-dim">
          {new Date(photo.takenAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} ·{" "}
          {photo.uploadedBy}
        </div>
      </div>

      <div className="p-4">
        <div className="text-[13px] font-semibold">{photo.caption}</div>
        <p className="mt-1 text-[12px] text-ink-dim">{photo.aiAnalysis}</p>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Stat label="Scene match" value={`${photo.sceneMatchScore}%`} color={match >= 90 ? "#10b981" : "#f59e0b"} />
          <Stat label="GPS Δ" value={`${photo.distanceM}m`} color={off ? "#ef4444" : "#10b981"} />
          <Stat label="EXIF" value={photo.exifIntact ? "OK" : "X"} color={photo.exifIntact ? "#10b981" : "#ef4444"} />
        </div>

        <div className="mt-3 border-t border-line pt-2.5">
          <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">AI verdict</div>
          <p className="mt-1 text-[12px] text-ink">{photo.progressDetected}</p>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-line pt-2.5">
          <Fingerprint className="h-3 w-3 text-ink-muted" />
          <span className="hash-mono">{photo.hash}</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-md border border-line bg-bg-elev/40 p-2">
      <div className="text-[15px] font-semibold" style={{ color }}>{value}</div>
      <div className="text-[10px] uppercase tracking-[0.1em] text-ink-muted">{label}</div>
    </div>
  );
}
