"use client";
import { useCurrency } from "./currency-context";

export function Money({
  ghs,
  dual = false,
  compact = false,
}: {
  ghs: number;
  dual?: boolean;
  compact?: boolean;
}) {
  const { format } = useCurrency();
  return <>{format(ghs, { dual, compact })}</>;
}
