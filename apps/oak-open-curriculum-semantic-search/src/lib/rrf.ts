export interface RankedId {
  id: string;
  score?: number | null;
}
export interface RrfConfig {
  k?: number;
}
export function rrfFuse(
  lists: readonly (readonly RankedId[])[],
  cfg?: RrfConfig,
): Map<string, number> {
  const k = cfg?.k ?? 60;
  const scores = new Map<string, number>();
  for (const list of lists) {
    for (let i = 0; i < list.length; i++) {
      const id = list[i]?.id;
      if (!id) continue;
      scores.set(id, (scores.get(id) ?? 0) + 1 / (k + (i + 1)));
    }
  }
  return scores;
}
