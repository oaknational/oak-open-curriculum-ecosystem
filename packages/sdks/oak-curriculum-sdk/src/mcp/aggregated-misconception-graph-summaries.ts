/**
 * Summary lines for the anchored `get-misconception-graph` envelope (G2).
 *
 * One-line human summaries per anchor kind, emitted alongside the
 * structuredContent as the first TextContent item. Information only, never a
 * recommendation (ADR-194: the data surface is deterministic; the agent is
 * the only reasoner).
 *
 * @see ./aggregated-misconception-graph.ts — the tool module these serve.
 */

import type {
  LessonMisconceptionsSubgraph,
  ThreadMisconceptionsSubgraph,
  UnitMisconceptionsSubgraph,
} from '@oaknational/graph-corpus-sdk/curriculum';

/** Appends the unknown-anchor clause to a summary line when any slug missed the corpus. */
function withUnknownClause(base: string, unknownAnchors: readonly string[]): string {
  if (unknownAnchors.length === 0) {
    return base;
  }
  return `${base} ${String(unknownAnchors.length)} unknown anchor slug${unknownAnchors.length === 1 ? '' : 's'} reported in unknownAnchors.`;
}

/** One-line human summary of a lesson-anchored result (information only). */
export function summariseLessons(subgraph: LessonMisconceptionsSubgraph): string {
  const misconceptionCount = subgraph.lessons.reduce(
    (count, entry) => count + entry.misconceptions.length,
    0,
  );
  return withUnknownClause(
    `Misconceptions for ${String(subgraph.resolvedAnchors.length)} anchor lesson(s): ${String(misconceptionCount)} misconception(s).`,
    subgraph.unknownAnchors,
  );
}

/** One-line human summary of a unit-anchored result (information only). */
export function summariseUnits(subgraph: UnitMisconceptionsSubgraph): string {
  const lessonCount = subgraph.units.reduce((count, entry) => count + entry.lessons.length, 0);
  return withUnknownClause(
    `Misconceptions for ${String(subgraph.resolvedAnchors.length)} anchor unit(s): ${String(lessonCount)} lesson(s) with their misconceptions.`,
    subgraph.unknownAnchors,
  );
}

/** One-line human summary of a thread-anchored window (information only). */
export function summariseThread(subgraph: ThreadMisconceptionsSubgraph): string {
  const entry = subgraph.threads[0];
  if (entry === undefined) {
    return withUnknownClause('Misconceptions for thread anchor: no thread resolved.', [
      ...subgraph.unknownAnchors,
    ]);
  }
  if (entry.units.length === 0) {
    return `Misconceptions for thread window: no units in this window (offset ${String(entry.unitOffset)} of ${String(entry.totalUnits)} units).`;
  }
  const from = entry.unitOffset + 1;
  const to = entry.unitOffset + entry.units.length;
  return `Misconceptions for thread window: units ${String(from)}–${String(to)} of ${String(entry.totalUnits)}${entry.hasMore ? ' (more available via unitOffset)' : ''}.`;
}
