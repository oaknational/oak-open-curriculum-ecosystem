/**
 * Integration tests for the thread-progressions view (G3 c1).
 *
 * @remarks
 * TDD: these tests describe the view's bounded anchored retrieval over the
 * real generated corpus — the describing surface en route to the
 * `get-thread-progressions` wire envelope (plan `graph-tools-value-redesign`,
 * deliverable G3):
 * - the detail anchor returns ONE thread's full progression as one
 *   curriculum-ordered run per subject the thread spans (years ascending,
 *   year-less entries last, Oak's authored unit order within a year) — never
 *   the whole thread estate, never a cross-subject interleave;
 * - the discovery anchor returns bounded thread descriptors (no sequences) so
 *   a caller can find the slug to anchor by;
 * - unknown anchors are reported, not errored; empties are well-formed on the
 *   same projection path;
 * - the stats surface carries the corpus thread stats (the interpolator
 *   continuity contract for tool-guidance descriptions).
 */
import { describe, expect, it } from 'vitest';

import { graphCorpus } from './graph-corpus.js';
import { buildCurriculumThreadProgressionsProjection } from './thread-progressions-projection.js';
import {
  progressionForThread,
  progressionsForSubjectKeyStage,
  threadProgressionStats,
} from './thread-progressions-view.js';
import { bareSlug, required } from './test-helpers.js';

/** A thread slug with at least one placement, chosen deterministically (first emitted sequence). */
const firstSequence = required(
  graphCorpus.sequences.find((sequence) => sequence.placements.length > 0),
  'corpus has no non-empty sequence to anchor the view tests',
);
const KNOWN_THREAD_SLUG: string = bareSlug(firstSequence.threadId);

/** Sequences per thread id, to find a thread the corpus runs through several subjects. */
const sequenceCountByThread = new Map<string, number>();
for (const sequence of graphCorpus.sequences) {
  sequenceCountByThread.set(
    sequence.threadId,
    (sequenceCountByThread.get(sequence.threadId) ?? 0) + 1,
  );
}
const multiSubjectThread = required(
  [...sequenceCountByThread.entries()]
    .filter(([, count]) => count > 1)
    .sort(([a], [b]) => a.localeCompare(b))[0],
  'corpus has no thread spanning several subjects (the modern-language threads do)',
);
const MULTI_SUBJECT_THREAD_SLUG: string = bareSlug(multiSubjectThread[0]);
const MULTI_SUBJECT_RUN_COUNT: number = multiSubjectThread[1];

/** A (subject, keyStage) pair carried by a sequenced unit, chosen deterministically. */
const placedUnitIds = new Set(
  graphCorpus.sequences.flatMap((sequence) =>
    sequence.placements.map((placement) => placement.unitId),
  ),
);
const sequencedUnit = required(
  graphCorpus.nodes.find((node) => node.kind === 'unit' && placedUnitIds.has(node.id)),
  'corpus has no sequenced unit to derive a subject+keyStage anchor',
);
const KNOWN_SUBJECT: string = sequencedUnit.kind === 'unit' ? sequencedUnit.subject : '';
const KNOWN_KEY_STAGE: string = sequencedUnit.kind === 'unit' ? sequencedUnit.keyStage : '';

describe('thread-progressions projection', () => {
  it('indexes every corpus sequence under its thread with integrity-checked endpoints', () => {
    const projection = buildCurriculumThreadProgressionsProjection();

    expect(projection.sequencesByThreadId.size).toBe(sequenceCountByThread.size);
    expect(
      [...projection.sequencesByThreadId.values()].reduce((sum, list) => sum + list.length, 0),
    ).toBe(graphCorpus.sequences.length);
    expect(projection.sequencesByThreadId.size).toBeGreaterThan(0);
  });
});

describe('progressionForThread (detail anchor)', () => {
  it('returns one thread’s full progression as per-subject runs', () => {
    const result = progressionForThread(KNOWN_THREAD_SLUG);

    expect(result.unknownAnchors).toEqual([]);
    expect(result.resolvedAnchors).toEqual([`thread:${KNOWN_THREAD_SLUG}`]);
    expect(result.threads).toHaveLength(1);

    const progression = result.threads[0];
    expect(progression?.thread.threadSlug).toBe(KNOWN_THREAD_SLUG);
    expect(progression?.progressions.length).toBeGreaterThan(0);
    expect(progression?.totalUnits).toBe(
      progression?.progressions.reduce((sum, run) => sum + run.entries.length, 0),
    );
    for (const run of progression?.progressions ?? []) {
      expect(run.totalUnits).toBe(run.entries.length);
      expect(run.entries.length).toBeGreaterThan(0);
    }
  });

  it('orders each run year-ascending with year-less entries last', () => {
    const result = progressionForThread(KNOWN_THREAD_SLUG);

    for (const run of result.threads[0]?.progressions ?? []) {
      const years = run.entries.map((entry) => entry.year);
      const yeared = years.filter((year): year is number => year !== undefined);
      const yearlessTail = years.slice(yeared.length);

      expect([...yeared].sort((a, b) => a - b)).toEqual(yeared);
      expect(yearlessTail.every((year) => year === undefined)).toBe(true);
    }
  });

  it('serves at least one same-year group in an order the alphabet would not produce', () => {
    // The defect this view was corrected for served same-year units sorted by
    // unit slug. Proving the negative on real data: somewhere in the corpus a
    // same-year group must disagree with alphabetical order, or the corpus is
    // still alphabetical however the comparator reads.
    const alphabeticalGroups: number[] = [];
    const disagreeingGroups: number[] = [];

    for (const sequence of graphCorpus.sequences) {
      const byYear = new Map<string, string[]>();
      for (const placement of sequence.placements) {
        const key = String(placement.year);
        byYear.set(key, [...(byYear.get(key) ?? []), placement.unitId]);
      }
      for (const unitIds of byYear.values()) {
        if (unitIds.length < 2) {
          continue;
        }
        const alphabetical = [...unitIds].sort((a, b) => a.localeCompare(b));
        const matchesAlphabet = alphabetical.every((id, index) => id === unitIds[index]);
        (matchesAlphabet ? alphabeticalGroups : disagreeingGroups).push(unitIds.length);
      }
    }

    expect(alphabeticalGroups.length + disagreeingGroups.length).toBeGreaterThan(0);
    expect(disagreeingGroups.length).toBeGreaterThan(0);
  });

  it('keeps every run within its own subject', () => {
    const result = progressionForThread(KNOWN_THREAD_SLUG);

    for (const run of result.threads[0]?.progressions ?? []) {
      for (const entry of run.entries) {
        expect(entry.unit.subject).toBe(run.subject);
      }
    }
  });

  it('returns one run per subject for a thread spanning subjects, subject-sorted and never interleaved', () => {
    const result = progressionForThread(MULTI_SUBJECT_THREAD_SLUG);
    const runs = result.threads[0]?.progressions ?? [];

    expect(runs).toHaveLength(MULTI_SUBJECT_RUN_COUNT);
    const subjects = runs.map((run) => run.subject);
    expect([...subjects].sort((a, b) => a.localeCompare(b))).toEqual(subjects);
    expect(new Set(subjects).size).toBe(subjects.length);
  });

  it('joins every entry to its full unit node (slug, title, subject, keyStage)', () => {
    const result = progressionForThread(KNOWN_THREAD_SLUG);

    for (const run of result.threads[0]?.progressions ?? []) {
      for (const entry of run.entries) {
        expect(entry.unit.kind).toBe('unit');
        expect(entry.unit.unitSlug.length).toBeGreaterThan(0);
        expect(entry.unit.unitTitle.length).toBeGreaterThan(0);
      }
    }
  });

  it('reports an unknown thread slug and returns a well-formed empty result', () => {
    const result = progressionForThread('no-such-thread');

    expect(result.threads).toEqual([]);
    expect(result.resolvedAnchors).toEqual([]);
    expect(result.unknownAnchors).toEqual(['no-such-thread']);
  });
});

describe('progressionsForSubjectKeyStage (discovery anchor)', () => {
  it('returns bounded descriptors whose threads each run through the anchor subject', () => {
    const result = progressionsForSubjectKeyStage(KNOWN_SUBJECT, KNOWN_KEY_STAGE);

    expect(result.threads.length).toBeGreaterThan(0);
    expect(result.threads.length).toBeLessThan(threadProgressionStats.threadCount);
    for (const descriptor of result.threads) {
      expect(descriptor.subjects).toContain(KNOWN_SUBJECT);
      expect(descriptor.totalUnits).toBeGreaterThan(0);
    }
  });

  it('returns descriptors without sequences (discovery, not detail)', () => {
    const result = progressionsForSubjectKeyStage(KNOWN_SUBJECT, KNOWN_KEY_STAGE);

    expect(result.threads[0]).not.toHaveProperty('progressions');
  });

  it('returns a well-formed empty result for an unmatched anchor', () => {
    const result = progressionsForSubjectKeyStage('no-such-subject', 'ks2');

    expect(result.threads).toEqual([]);
    expect(result.subject).toBe('no-such-subject');
    expect(result.keyStage).toBe('ks2');
  });
});

describe('threadProgressionStats (interpolator continuity)', () => {
  it('counts the threads the sequences cover', () => {
    expect(threadProgressionStats.threadCount).toBe(sequenceCountByThread.size);
    expect(threadProgressionStats.threadCount).toBeGreaterThan(0);
  });

  it('derives subjectsCovered from the sequences themselves (thread coverage by construction)', () => {
    const sequencedSubjects = new Set(graphCorpus.sequences.map((sequence) => sequence.subject));

    expect(new Set(threadProgressionStats.subjectsCovered)).toEqual(sequencedSubjects);
    expect(threadProgressionStats.subjectsCovered.length).toBeGreaterThan(0);
  });
});
