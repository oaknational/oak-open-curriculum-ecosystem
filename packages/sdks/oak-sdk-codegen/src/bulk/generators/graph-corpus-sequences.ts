/**
 * Graph-corpus sequence builder (G3): year-ordered thread→unit placement data.
 *
 * @remarks
 * The bulk exports no authoritative within-thread unit ordering —
 * `unit.threads[].order` is the THREAD's display index (constant across every
 * placement of a thread; schema: "Display/order index for the thread"), so
 * the progression axis is the placement's teaching YEAR, the axis the thread
 * concept itself advertises (`firstYear`→`lastYear`). Ordering cannot ride
 * the corpus's attribute-less `{source, type, target}` edges, so it is
 * emitted as its own corpus section (the ordered projection's source per the
 * plan's emission-ownership table).
 *
 * Determinism: sequences emit threadId-sorted; placements sort by
 * `(year, unitId)` with year-less placements last — a total order, so the
 * artefact is identical regardless of bulk-file enumeration order (the same
 * order-independence contract the node and edge builders hold).
 * Exact-duplicate placements (same thread, same unit, same year — the same
 * placement fact restated by sibling sequence files) collapse to one and are
 * counted; a unit recurring at distinct years is a real revisit and is
 * preserved.
 */
import type { ExtractedThread } from '../extractors/thread-extractor.js';

import {
  threadNodeId,
  unitNodeId,
  type GraphCorpusSequence,
  type GraphCorpusSequencePlacement,
} from './graph-corpus-types.js';

/** The built sequence set plus collapse provenance. */
export interface SequenceBuild {
  readonly sequences: readonly GraphCorpusSequence[];
  /** Identical (threadId, unitId, year) placements collapsed beyond the first. */
  readonly collapsedIdenticalPlacements: number;
}

/**
 * Compares placements by (year, unitId), year-less placements last — a total
 * order, so any placement sort is deterministic regardless of encounter order.
 *
 * @param a - The first placement (unitId plus optional teaching year)
 * @param b - The second placement (unitId plus optional teaching year)
 * @returns A negative/zero/positive comparator value for `Array.prototype.sort`
 */
export function comparePlacements(
  a: { readonly unitId: string; readonly year: number | undefined },
  b: { readonly unitId: string; readonly year: number | undefined },
): number {
  if (a.year !== b.year) {
    if (a.year === undefined) {
      return 1;
    }
    if (b.year === undefined) {
      return -1;
    }
    return a.year - b.year;
  }
  return a.unitId.localeCompare(b.unitId);
}

/** Builds one thread's placements, collapsing exact (unitId, year) duplicates. */
function buildPlacements(thread: ExtractedThread): {
  readonly placements: readonly GraphCorpusSequencePlacement[];
  readonly collapsed: number;
} {
  const seen = new Set<string>();
  const placements: GraphCorpusSequencePlacement[] = [];
  let collapsed = 0;
  for (const unit of thread.units) {
    const unitId = unitNodeId(unit.unitSlug);
    const key = `${unitId}#${String(unit.year)}`;
    if (seen.has(key)) {
      collapsed += 1;
      continue;
    }
    seen.add(key);
    placements.push({ unitId, year: unit.year });
  }
  return { placements: [...placements].sort(comparePlacements), collapsed };
}

/**
 * Builds the year-ordered thread→unit sequence set from extracted threads:
 * threadId-sorted sequences whose placements sort by (year, unitId) with
 * year-less placements last, exact-duplicate placements collapsed and
 * counted.
 *
 * @param threads - Extracted threads with their bulk placement years
 * @returns The deterministic sequence set plus collapse provenance
 */
export function buildSequences(threads: readonly ExtractedThread[]): SequenceBuild {
  let collapsedIdenticalPlacements = 0;
  const sequences = [...threads]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((thread): GraphCorpusSequence => {
      const { placements, collapsed } = buildPlacements(thread);
      collapsedIdenticalPlacements += collapsed;
      return { threadId: threadNodeId(thread.slug), placements };
    });
  return { sequences, collapsedIdenticalPlacements };
}
