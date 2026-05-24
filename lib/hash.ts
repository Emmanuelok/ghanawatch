// Deterministic short hash for demo audit ledger (non-crypto; visual only).
export function shortHash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const hex = (h >>> 0).toString(16).padStart(8, "0");
  return `0x${hex}${hex.split("").reverse().join("")}`.slice(0, 18);
}

export function chainHash(prev: string, payload: string): string {
  return shortHash(prev + "|" + payload);
}

export function fakeSig(seed: string): string {
  return shortHash("sig:" + seed) + shortHash("v:" + seed).slice(2);
}
