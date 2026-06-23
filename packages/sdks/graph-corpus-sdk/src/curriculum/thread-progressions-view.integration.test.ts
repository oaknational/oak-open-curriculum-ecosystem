/**
 * Integration tests for the thread-progressions view (G3 c1).
 *
 * @remarks
 * TDD: these tests describe the view's bounded anchored retrieval over the
 * real generated corpus — the describing surface en route to the
 * `get-thread-progressions` wire envelope (plan `graph-tools-value-redesign`,
 * deliverable G3):
 * - the detail anchor returns ONE thread's full year-ordered progression
 *   (year ascending, year-less placements last, unitId tie-break) — never the
 *   whole 164-thread estate;
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
import { required } from './test-helpers.js';

/** A thread slug with at least one placement, chosen deterministically (first emitted sequence). */
const firstSequence = required(
  graphCorpus.sequences.find((sequence) => sequence.placements.length > 0),
  'corpus has no non-empty sequence to anchor the view tests',
);
const KNOWN_THREAD_SLUG: string = firstSequence.threadId.slice(
  firstSequence.threadId.indexOf(':') + 1,
);

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
  it('indexes every corpus sequence with integrity-checked endpoints', () => {
    const projection = buildCurriculumThreadProgressionsProjection();

    expect(projection.sequencesByThreadId.size).toBe(graphCorpus.sequences.length);
    expect(projection.sequencesByThreadId.size).toBeGreaterThan(0);
  });
});

describe('progressionForThread (detail anchor)', () => {
  it('returns one thread’s full year-ordered progression', () => {
    const result = progressionForThread(KNOWN_THREAD_SLUG);

    expect(result.unknownAnchors).toEqual([]);
    expect(result.resolvedAnchors).toEqual([`thread:${KNOWN_THREAD_SLUG}`]);
    expect(result.threads).toHaveLength(1);

    const progression = result.threads[0];
    expect(progression?.thread.threadSlug).toBe(KNOWN_THREAD_SLUG);
    expect(progression?.totalUnits).toBe(progression?.entries.length);
    expect(progression?.entries.length).toBeGreaterThan(0);
  });

  it('orders entries year-ascending with year-less entries last', () => {
    const result = progressionForThread(KNOWN_THREAD_SLUG);
    const entries = result.threads[0]?.entries ?? [];

    const years = entries.map((entry) => entry.year);
    const yeared = years.filter((year): year is number => year !== undefined);
    const yearlessTail = years.slice(yeared.length);

    expect([...yeared].sort((a, b) => a - b)).toEqual(yeared);
    expect(yearlessTail.every((year) => year === undefined)).toBe(true);
  });

  it('joins every entry to its full unit node (slug, title, subject, keyStage)', () => {
    const result = progressionForThread(KNOWN_THREAD_SLUG);

    for (const entry of result.threads[0]?.entries ?? []) {
      expect(entry.unit.kind).toBe('unit');
      expect(entry.unit.unitSlug.length).toBeGreaterThan(0);
      expect(entry.unit.unitTitle.length).toBeGreaterThan(0);
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
  it('returns bounded descriptors whose threads each carry a matching member unit', () => {
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

    expect(result.threads[0]).not.toHaveProperty('entries');
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
    expect(threadProgressionStats.threadCount).toBe(graphCorpus.sequences.length);
    expect(threadProgressionStats.threadCount).toBeGreaterThan(0);
  });

  it('derives subjectsCovered from sequenced units only (thread coverage by construction)', () => {
    const placedUnitIds = new Set(
      graphCorpus.sequences.flatMap((sequence) =>
        sequence.placements.map((placement) => placement.unitId),
      ),
    );
    const sequencedSubjects = new Set(
      graphCorpus.nodes
        .filter((node) => node.kind === 'unit' && placedUnitIds.has(node.id))
        .map((node) => (node.kind === 'unit' ? node.subject : '')),
    );

    expect(new Set(threadProgressionStats.subjectsCovered)).toEqual(sequencedSubjects);
    expect(threadProgressionStats.subjectsCovered.length).toBeGreaterThan(0);
  });
});
