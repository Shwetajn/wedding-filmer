/** FNV-1a — small, dependency-free, and avalanches well even for near-identical seeds (e.g. "c1-p1" vs "c1-p2"). */
export function hash(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** deterministic pseudo-random float in [-range, range], stable per seed */
export function jitter(seed: string, range: number): number {
  const n = (hash(seed) % 1000) / 1000;
  return (n * 2 - 1) * range;
}

/** deterministic pseudo-random float in [0, 1), stable per seed */
export function unit(seed: string): number {
  return (hash(seed) % 1000) / 1000;
}
