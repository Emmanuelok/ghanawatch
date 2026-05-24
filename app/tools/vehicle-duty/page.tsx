import { DutyCalculator } from "./calculator";
import { Car } from "lucide-react";

export const metadata = { title: "Vehicle Duty Calculator — GhanaWatch" };

export default function VehicleDutyPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Car className="h-3 w-3" /> Tool
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Ghana vehicle import duty calculator</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          A simplified estimator modelled on GRA Customs duty + VAT + NHIL + GETFund + ECOWAS levy +
          processing fees. Useful for sanity-checking what your clearing agent quotes you at Tema or
          Takoradi. Not a substitute for the official GRA worksheet.
        </p>
      </div>
      <DutyCalculator />
    </div>
  );
}
