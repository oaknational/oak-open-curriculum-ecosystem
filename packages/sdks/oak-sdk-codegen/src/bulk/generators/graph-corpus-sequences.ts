/**
 * Graph-corpus sequence builder (G3): each thread's units per subject, in
 * that subject's authored curriculum order.
 *
 * @remarks
 * A thread is a tag on units; the order is the curriculum's. The bulk
 * `sequence` array is "the ordered list of units for the subject sequence":
 * within one year its order is Oak's authored unit order (the API's
 * `unitOrder`), while the years themselves interleave in the array, so a
 * thread's units within one subject run year-ascending and, within a year,
 * in array order — the primary file's years, then the secondary file's.
 * Units taught across all years ("All years", primary PE) carry no year and
 * are listed after the year-placed units. A thread spanning several subjects
 * (the modern foreign languages share one set of grammar and skill threads)
 * emits one sequence per subject: Oak authors no order across subjects, so
 * the runs are never interleaved. The bulk `unit.threads[].order` is the
 * thread's display index, constant per thread, and orders nothing. Ordering
 * cannot ride the corpus's attribute-less `{source, type, target}` edges,
 * so it is emitted as its own corpus section.
 *
 * Determinism: sequences emit sorted by (threadId, subject); placements sort
 * by (year, sequence slug, sequence index) with year-less placements last —
 * a total order within one subject, so the artefact is identical regardless
 * of bulk-FILE enumeration order. The order WITHIN a file is upstream data
 * and is preserved, not normalised away. Exact-duplicate placements (same
 * unit, same year within one run — the KS4 tier and exam-board variants of a
 * unit) collapse to one and are counted; a unit recurring at distinct years
 * is a real revisit and is preserved.
 */
import type { ExtractedThread, ThreadUnit } from '../extractors/thread-extractor.js';
import { compareRank } from './graph-corpus-ordered-sections.js';

import {
  threadNodeId,
  unitNodeId,
  type GraphCorpusSequence,
  type GraphCorpusSequencePlacement,
} from './graph-corpus-types.js';

/** The built sequence set plus collapse provenance. */
export interface SequenceBuild {
  readonly sequences: readonly GraphCorpusSequence[];
  /** Identical (threadId, subject, unitId, year) placements collapsed beyond the first. */
  readonly collapsedIdenticalPlacements: number;
}

/** One thread's member units within one subject, in curriculum order. */
export interface SubjectRun {
  readonly subject: string;
  readonly units: readonly ThreadUnit[];
}

/** Year-less ("All years") units sort after every year-placed unit. */
function yearRank(unit: ThreadUnit): number {
  return unit.year ?? Number.POSITIVE_INFINITY;
}

/**
 * Compares two thread units by curriculum position within one subject: year
 * ascending (year-less last), then the bulk sequence index (Oak's authored
 * order within the year). A year belongs to exactly one phase, so the
 * primary file's years precede the secondary file's by construction. The
 * sequence slug is the SECOND tie-break — it separates year-less ("All
 * years") units drawn from different files, where the phase suffix happens
 * to sort primary before secondary; that alphabetical agreement is a
 * coincidence of the naming scheme, not a guaranteed phase order, and
 * nothing here relies on it beyond determinism. The unit's index within its
 * own bulk sequence is the FINAL tie-break, and those indexes are unique per
 * sequence slug by construction, so no residual tie can reach the end of the
 * chain.
 *
 * @param a - The first thread unit
 * @param b - The second thread unit
 * @returns A negative/zero/positive comparator value for `Array.prototype.sort`
 */
export function compareSequencePositions(a: ThreadUnit, b: ThreadUnit): number {
  return (
    compareRank(yearRank(a), yearRank(b)) ||
    a.sequenceSlug.localeCompare(b.sequenceSlug) ||
    a.sequenceIndex - b.sequenceIndex
  );
}

/**
 * Groups one thread's units per subject and orders each group by curriculum
 * position; groups are subject-sorted. Shared by the sequence builder and
 * the chain-edge builder so both carry ONE ordering basis.
 *
 * @param thread - An extracted thread with its member units
 * @returns The thread's subject runs, each in curriculum order
 */
export function subjectRuns(thread: ExtractedThread): readonly SubjectRun[] {
  const bySubject = new Map<string, ThreadUnit[]>();
  for (const unit of thread.units) {
    const run = bySubject.get(unit.subject);
    if (run === undefined) {
      bySubject.set(unit.subject, [unit]);
    } else {
      run.push(unit);
    }
  }
  return [...bySubject.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([subject, units]) => ({ subject, units: [...units].sort(compareSequencePositions) }));
}

/** Builds one run's placements, collapsing exact (unitId, year) duplicates. */
function buildPlacements(run: SubjectRun): {
  readonly placements: readonly GraphCorpusSequencePlacement[];
  readonly collapsed: number;
} {
  const seen = new Set<string>();
  const placements: GraphCorpusSequencePlacement[] = [];
  let collapsed = 0;
  for (const unit of run.units) {
    const unitId = unitNodeId(unit.unitSlug);
    const key = `${unitId}#${String(unit.year)}`;
    if (seen.has(key)) {
      collapsed += 1;
      continue;
    }
    seen.add(key);
    placements.push({ unitId, year: unit.year });
  }
  return { placements, collapsed };
}

/**
 * Builds the thread→unit sequence set from extracted threads: one sequence
 * per (thread, subject), sorted by (threadId, subject), each in the
 * subject's authored curriculum order, exact-duplicate placements collapsed
 * and counted.
 *
 * @param threads - Extracted threads with their bulk placements
 * @returns The deterministic sequence set plus collapse provenance
 */
export function buildSequences(threads: readonly ExtractedThread[]): SequenceBuild {
  let collapsedIdenticalPlacements = 0;
  const sequences = [...threads]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .flatMap((thread) =>
      subjectRuns(thread).map((run): GraphCorpusSequence => {
        const { placements, collapsed } = buildPlacements(run);
        collapsedIdenticalPlacements += collapsed;
        return { threadId: threadNodeId(thread.slug), subject: run.subject, placements };
      }),
    );
  return { sequences, collapsedIdenticalPlacements };
}
