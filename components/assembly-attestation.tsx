import { ShieldCheck, MapPin, Stamp } from "lucide-react";

export type AssemblyAttestation = {
  electoralArea: string;
  district: string;
  assemblyMember: string;
  partyAffiliation?: string;
  electedYear: number;
  attestedFor: string; // name of the manager being attested
  attestedAt: string;
  documentRef: string; // attestation form reference number
  contactNumber: string;
  signatureHash: string;
};

export function AssemblyAttestationCard({ a }: { a: AssemblyAttestation }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stamp className="h-4 w-4 text-accent-gold" />
          <div className="text-[14px] font-semibold">Assembly Member attestation</div>
        </div>
        <span className="chip" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.25)" }}>
          <ShieldCheck className="h-3 w-3" /> attested
        </span>
      </div>
      <p className="mt-1 text-[12px] text-ink-dim">
        On-ground civic verification: your manager's identity and residence have been attested by
        the elected Assembly Member of their electoral area — the Ghanaian institutional
        equivalent of a notarised attestation.
      </p>

      <div className="mt-4 rounded-md border border-line bg-bg-elev/40 p-4 text-[12px]">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          <MapPin className="h-3 w-3" /> {a.electoralArea} · {a.district} District Assembly
        </div>
        <div className="mt-3 grid gap-2">
          <Row k="Assembly Member" v={`Hon. ${a.assemblyMember} (elected ${a.electedYear}${a.partyAffiliation ? `, ${a.partyAffiliation}` : ""})`} />
          <Row k="Attested" v={a.attestedFor} />
          <Row k="Document" v={a.documentRef} />
          <Row k="Attested on" v={a.attestedAt.slice(0, 10)} />
          <Row k="Contact" v={a.contactNumber} />
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[11px]">
          <Stamp className="h-3 w-3 text-accent-gold" />
          <span className="text-ink-muted">signed hash</span>
          <span className="hash-mono">{a.signatureHash}</span>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-ink-muted">
        Assembly Members are elected representatives at the local-government level under the Local
        Governance Act 2016 (Act 936). Their attestation is recognised by Ghanaian banks, courts,
        and the Lands Commission for residency / identity confirmation.
      </p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ink-muted">{k}</span>
      <span className="ml-3 max-w-[68%] text-right text-ink">{v}</span>
    </div>
  );
}
