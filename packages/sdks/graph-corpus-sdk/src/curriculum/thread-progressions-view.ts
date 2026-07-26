/**
 * Thread-progressions view (G3 c1) — bounded anchored retrieval of one
 * thread's year-ordered unit sequence over the one curriculum graph corpus.
 *
 * Two anchor modes, discovery → detail:
 *
 * - **subject + keyStage** — discovery: bounded thread DESCRIPTORS (no
 *   sequences), so the caller finds the thread slug to anchor by;
 * - **threadSlug** — detail: ONE thread's full year-ordered sequence (median
 *   threads are small; the largest observed spans 77 placements) — never all
 *   164 threads.
 *
 * Ordering honesty is carried as data and doc: the progression axis is the
 * placement's teaching year (the bulk exports no authoritative within-thread
 * unit ordering — see the projection module); within one year the order is
 * not curricular and ties break deterministically by unitId.
 *
 * The underlying sequence map lives in the `thread-progressions-projection`
 * module, constructed once at module load (the EEF and G2 precedent).
 */

import type {
  GraphCorpusThreadNode,
  GraphCorpusThreadNodeId,
  GraphCorpusUnitNode,
} from '@oaknational/sdk-codegen/graph-corpus';

import { mustGet } from './projection-helpers.js';
import {
  buildCurriculumThreadProgressionsProjection,
  type CurriculumThreadProgressionsProjection,
} from './thread-progressions-projection.js';

/** One step of a thread's progression: the unit at its placement year. */
export interface ThreadProgressionEntry {
  readonly unit: GraphCorpusUnitNode;
  /** The placement's teaching year (`undefined` = an "All years" unit, sorted last). */
  readonly year: number | undefined;
}

/** One thread's full year-ordered progression. */
export interface ThreadProgression {
  readonly thread: GraphCorpusThreadNode;
  readonly totalUnits: number;
  readonly entries: readonly ThreadProgressionEntry[];
}

/** Thread-anchored result: `threads` carries zero or one progression (set semantics). */
export interface ThreadProgressionSubgraph {
  readonly threads: readonly ThreadProgression[];
  readonly resolvedAnchors: readonly GraphCorpusThreadNodeId[];
  readonly unknownAnchors: readonly string[];
}

/** A discovery descriptor: the thread without its sequence (anchor by `thread.threadSlug` next). */
export interface ThreadDescriptor {
  readonly thread: GraphCorpusThreadNode;
  readonly totalUnits: number;
  /** The unique subjects of the thread's member units, sorted. */
  readonly subjects: readonly string[];
}

/** Discovery result: every thread with a member unit matching the subject + keyStage anchor. */
export interface ThreadDiscovery {
  readonly subject: string;
  readonly keyStage: string;
  readonly threads: readonly ThreadDescriptor[];
}

/** Interpolator-continuity stats over the corpus's thread estate. */
export interface ThreadProgressionStats {
  readonly threadCount: number;
  readonly subjectsCovered: readonly string[];
}

/** The thread-progressions projection, constructed once at module load. */
const projection: CurriculumThreadProgressionsProjection =
  buildCurriculumThreadProgressionsProjection();

/** The unique subjects carried by the units the thread sequences place, sorted. */
function sequencedSubjects(p: CurriculumThreadProgressionsProjection): readonly string[] {
  const subjects = new Set<string>();
  for (const sequence of p.sequencesByThreadId.values()) {
    for (const placement of sequence.placements) {
      subjects.add(mustGet(p.unitsById, placement.unitId).subject);
    }
  }
  return [...subjects].sort((a, b) => a.localeCompare(b));
}

/**
 * Thread-estate stats for description interpolation (the consumers that
 * previously interpolated the legacy threadProgressionGraph stats). Both
 * fields derive from the sequences themselves — never from corpus-wide unit
 * stats — so "N threads across M subjects" describes thread coverage by
 * construction, not by coincidence.
 */
export const threadProgressionStats: ThreadProgressionStats = {
  threadCount: projection.sequencesByThreadId.size,
  subjectsCovered: sequencedSubjects(projection),
};

/** Builds one thread's progression by joining its sequence placements to unit nodes. */
function progressionEntry(id: GraphCorpusThreadNodeId): ThreadProgression {
  const sequence = projection.sequencesByThreadId.get(id);
  const entries = (sequence?.placements ?? []).map((placement): ThreadProgressionEntry => ({
    unit: mustGet(projection.unitsById, placement.unitId),
    year: placement.year,
  }));
  return { thread: mustGet(projection.threadsById, id), totalUnits: entries.length, entries };
}

/**
 * Returns one thread's full year-ordered progression (the detail anchor). An
 * unknown thread slug is reported in `unknownAnchors`, not errored, and
 * returns a well-formed empty result on the same projection path.
 *
 * @param threadSlug - The anchor thread slug (a corpus key, not free text).
 */
export function progressionForThread(threadSlug: string): ThreadProgressionSubgraph {
  const id: GraphCorpusThreadNodeId = `thread:${threadSlug}`;
  if (!projection.threadsById.has(id)) {
    return { threads: [], resolvedAnchors: [], unknownAnchors: [threadSlug] };
  }
  return { threads: [progressionEntry(id)], resolvedAnchors: [id], unknownAnchors: [] };
}

/** Builds a discovery descriptor from one thread's member units. */
function describeThread(id: GraphCorpusThreadNodeId): ThreadDescriptor {
  const sequence = projection.sequencesByThreadId.get(id);
  const placements = sequence?.placements ?? [];
  const subjects = [
    ...new Set(placements.map((p) => mustGet(projection.unitsById, p.unitId).subject)),
  ].sort((a, b) => a.localeCompare(b));
  return { thread: mustGet(projection.threadsById, id), totalUnits: placements.length, subjects };
}

/**
 * Returns the discovery descriptors for every thread with at least one member
 * unit matching the subject AND key stage (the discovery anchor — sequences
 * are deliberately absent; anchor `progressionForThread` with a returned
 * thread's slug for the ordered detail). An unmatched anchor returns a
 * well-formed empty result on the same projection path.
 *
 * @param subject - The anchor subject (a corpus key, e.g. `maths`).
 * @param keyStage - The anchor key stage (a corpus key, e.g. `ks2`).
 */
export function progressionsForSubjectKeyStage(subject: string, keyStage: string): ThreadDiscovery {
  const matching: ThreadDescriptor[] = [];
  for (const sequence of projection.sequencesByThreadId.values()) {
    const matches = sequence.placements.some((placement) => {
      const unit = mustGet(projection.unitsById, placement.unitId);
      return unit.subject === subject && unit.keyStage === keyStage;
    });
    if (matches) {
      matching.push(describeThread(sequence.threadId));
    }
  }
  matching.sort((a, b) => a.thread.id.localeCompare(b.thread.id));
  return { subject, keyStage, threads: matching };
}
