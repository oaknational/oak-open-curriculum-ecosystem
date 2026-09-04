/**
 * Thread-progressions view (G3 c1) — bounded anchored retrieval of one
 * thread's curriculum-ordered unit sequences over the one curriculum graph
 * corpus.
 *
 * Two anchor modes, discovery → detail:
 *
 * - **subject + keyStage** — discovery: bounded thread DESCRIPTORS (no
 *   sequences), so the caller finds the thread slug to anchor by;
 * - **threadSlug** — detail: ONE thread's full progression (median threads
 *   are small; the largest observed spans 162 placements) — never all
 *   threads.
 *
 * A thread is a tag; the order is the curriculum's. A progression is served
 * per subject: each run is the thread's units in that subject's curriculum
 * order — years ascending across the primary and secondary phases, Oak's
 * authored unit order within a year, "All years" units last — and a thread
 * spanning several subjects returns parallel runs, never an interleaved
 * chain. `year` rides each entry as data.
 *
 * The underlying sequence map lives in the `thread-progressions-projection`
 * module, constructed once at module load (the EEF and G2 precedent).
 */

import type {
  GraphCorpusSequence,
  GraphCorpusThreadNode,
  GraphCorpusThreadNodeId,
  GraphCorpusUnitNode,
} from '@oaknational/sdk-codegen/graph-corpus';

import { mustGet } from './projection-helpers.js';
import {
  buildCurriculumThreadProgressionsProjection,
  type CurriculumThreadProgressionsProjection,
} from './thread-progressions-projection.js';

/** One step of a subject run: the unit at its curriculum position. */
export interface ThreadProgressionEntry {
  readonly unit: GraphCorpusUnitNode;
  /** The placement's teaching year (`undefined` = an "All years" unit). */
  readonly year: number | undefined;
}

/** One thread's units within one subject, in that subject's curriculum order. */
export interface SubjectProgression {
  readonly subject: string;
  readonly totalUnits: number;
  readonly entries: readonly ThreadProgressionEntry[];
}

/** One thread's full progression: one curriculum-ordered run per subject it spans. */
export interface ThreadProgression {
  readonly thread: GraphCorpusThreadNode;
  readonly totalUnits: number;
  readonly progressions: readonly SubjectProgression[];
}

/** Thread-anchored result: `threads` carries zero or one progression (set semantics). */
export interface ThreadProgressionSubgraph {
  readonly threads: readonly ThreadProgression[];
  readonly resolvedAnchors: readonly GraphCorpusThreadNodeId[];
  readonly unknownAnchors: readonly string[];
}

/** A discovery descriptor: the thread without its sequences (anchor by `thread.threadSlug` next). */
export interface ThreadDescriptor {
  readonly thread: GraphCorpusThreadNode;
  readonly totalUnits: number;
  /** The subjects the thread runs through, sorted. */
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

/** The unique subjects the thread sequences run through, sorted. */
function sequencedSubjects(p: CurriculumThreadProgressionsProjection): readonly string[] {
  const subjects = new Set<string>();
  for (const sequences of p.sequencesByThreadId.values()) {
    for (const sequence of sequences) {
      subjects.add(sequence.subject);
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

/** Joins one subject sequence's placements to their unit nodes. */
function subjectProgression(sequence: GraphCorpusSequence): SubjectProgression {
  const entries = sequence.placements.map((placement): ThreadProgressionEntry => ({
    unit: mustGet(projection.unitsById, placement.unitId),
    year: placement.year,
  }));
  return { subject: sequence.subject, totalUnits: entries.length, entries };
}

/** Builds one thread's progression: one curriculum-ordered run per subject. */
function progressionEntry(id: GraphCorpusThreadNodeId): ThreadProgression {
  const progressions = (projection.sequencesByThreadId.get(id) ?? []).map(subjectProgression);
  const totalUnits = progressions.reduce((sum, run) => sum + run.totalUnits, 0);
  return { thread: mustGet(projection.threadsById, id), totalUnits, progressions };
}

/**
 * Returns one thread's full progression (the detail anchor): one
 * curriculum-ordered run per subject the thread spans. An unknown thread
 * slug is reported in `unknownAnchors`, not errored, and returns a
 * well-formed empty result on the same projection path.
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

/** Builds a discovery descriptor from one thread's subject sequences. */
function describeThread(
  id: GraphCorpusThreadNodeId,
  sequences: readonly GraphCorpusSequence[],
): ThreadDescriptor {
  const totalUnits = sequences.reduce((sum, sequence) => sum + sequence.placements.length, 0);
  const subjects = [...new Set(sequences.map((sequence) => sequence.subject))].sort((a, b) =>
    a.localeCompare(b),
  );
  return { thread: mustGet(projection.threadsById, id), totalUnits, subjects };
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
  for (const [threadId, sequences] of projection.sequencesByThreadId) {
    const matches = sequences.some(
      (sequence) =>
        sequence.subject === subject &&
        sequence.placements.some(
          (placement) => mustGet(projection.unitsById, placement.unitId).keyStage === keyStage,
        ),
    );
    if (matches) {
      matching.push(describeThread(threadId, sequences));
    }
  }
  matching.sort((a, b) => a.thread.id.localeCompare(b.thread.id));
  return { subject, keyStage, threads: matching };
}
