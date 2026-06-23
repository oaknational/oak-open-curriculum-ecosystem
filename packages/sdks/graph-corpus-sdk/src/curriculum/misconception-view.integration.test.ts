/**
 * Integration test (G2 c2): the misconception view describes bounded anchored
 * retrieval of the thread→unit→lesson→misconception chain over the real
 * emitted corpus.
 *
 * @remarks
 * Anchors per the owner ratification (2026-06-09): lesson (leaf, ≤2 items),
 * unit (core), thread (bounded with heavy-tail semantics — a unit-granular
 * window, since one mega-thread spans 77% of its subject's units). These
 * tests exercise the REAL corpus and check results against INDEPENDENT
 * reference adjacency computed here from `graphCorpus.edges`, so they specify
 * behaviour without mirroring the implementation. Reachability honesty is
 * data, not prose: thread results echo their window against `totalUnits`, and
 * unit entries carry their `threadSlugs` (an empty list is a thread-unreachable
 * unit — thread-anchored results are never subject-complete).
 */
import { graphCorpus } from '@oaknational/sdk-codegen/graph-corpus';
import { describe, expect, it } from 'vitest';

import { buildCurriculumMisconceptionProjection } from './misconception-projection.js';
import {
  DEFAULT_THREAD_UNIT_LIMIT,
  MAX_THREAD_UNIT_LIMIT,
  misconceptionsForLessons,
  misconceptionsForThread,
  misconceptionsForUnits,
} from './misconception-view.js';
import { bareSlug, required } from './test-helpers.js';

/** Independent reference adjacency: source id → sorted target ids, per edge type. */
function referenceAdjacency(edgeType: string): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();
  for (const edge of graphCorpus.edges) {
    if (edge.type !== edgeType) {
      continue;
    }
    const existing = adjacency.get(edge.source);
    if (existing) {
      existing.push(edge.target);
    } else {
      adjacency.set(edge.source, [edge.target]);
    }
  }
  for (const targets of adjacency.values()) {
    targets.sort((a, b) => a.localeCompare(b));
  }
  return adjacency;
}

const unitsByThread = referenceAdjacency('containsUnit');
const lessonsByUnit = referenceAdjacency('containsLesson');
const misconceptionsByLesson = referenceAdjacency('addressesMisconception');

/** A lesson with at least one misconception, chosen deterministically. */
const lessonWithMisconceptions = required(
  [...misconceptionsByLesson.keys()].sort((a, b) => a.localeCompare(b))[0],
  'corpus has no lesson with a misconception',
);

/** A lesson carrying NO misconception (well-formed absence — six exist on the pinned corpus). */
const lessonWithoutMisconceptions = required(
  graphCorpus.nodes
    .filter((node) => node.kind === 'lesson' && !misconceptionsByLesson.has(node.id))
    .map((node) => node.id)
    .sort((a, b) => a.localeCompare(b))[0],
  'corpus has no lesson without misconceptions',
);

/** A unit with at least one lesson, chosen deterministically. */
const unitWithLessons = required(
  [...lessonsByUnit.keys()].sort((a, b) => a.localeCompare(b))[0],
  'corpus has no unit with lessons',
);

/** Reference reverse-placement: lesson id → the unit ids placing it (from `lessonsByUnit`). */
function referencePlacements(): Map<string, string[]> {
  const placements = new Map<string, string[]>();
  for (const [unitId, lessonIds] of lessonsByUnit) {
    for (const lessonId of lessonIds) {
      const units = placements.get(lessonId);
      if (units) {
        units.push(unitId);
      } else {
        placements.set(lessonId, [unitId]);
      }
    }
  }
  return placements;
}

/** A lesson placed in MORE than one unit (the multi-placement shape; 473 exist). */
const multiPlacedLesson = required(
  [...referencePlacements().entries()]
    .filter(([, unitIds]) => unitIds.length > 1)
    .map(([lessonId, unitIds]) => ({
      lessonId,
      unitIds: [...unitIds].sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.lessonId.localeCompare(b.lessonId))[0],
  'corpus has no multi-placed lesson',
);

/** The thread with the most units — the heavy-tail (mega-thread) fixture. */
const megaThread = required(
  [...unitsByThread.entries()]
    .map(([threadId, unitIds]) => ({ threadId, unitCount: unitIds.length }))
    .sort((a, b) => b.unitCount - a.unitCount || a.threadId.localeCompare(b.threadId))[0],
  'corpus has no thread with units',
);

describe('misconception view — bounded anchored chain retrieval', () => {
  it('returns a lesson anchor with its misconceptions matching the reference adjacency', () => {
    const result = misconceptionsForLessons([bareSlug(lessonWithMisconceptions)]);

    expect(result.resolvedAnchors).toStrictEqual([lessonWithMisconceptions]);
    expect(result.unknownAnchors).toStrictEqual([]);
    expect(result.lessons).toHaveLength(1);
    const entry = result.lessons[0];
    expect(entry?.lesson.id).toBe(lessonWithMisconceptions);
    expect(entry?.misconceptions.map((m) => m.id)).toStrictEqual(
      misconceptionsByLesson.get(lessonWithMisconceptions),
    );
  });

  it('returns a well-formed empty misconception list for a lesson with none', () => {
    const result = misconceptionsForLessons([bareSlug(lessonWithoutMisconceptions)]);

    expect(result.resolvedAnchors).toStrictEqual([lessonWithoutMisconceptions]);
    expect(result.lessons).toHaveLength(1);
    expect(result.lessons[0]?.misconceptions).toStrictEqual([]);
  });

  it('reports unknown lesson anchors and resolves known ones in a mixed list', () => {
    const known = bareSlug(lessonWithMisconceptions);
    const result = misconceptionsForLessons([known, 'no-such-lesson-slug-xyz']);

    expect(result.resolvedAnchors).toStrictEqual([lessonWithMisconceptions]);
    expect(result.unknownAnchors).toStrictEqual(['no-such-lesson-slug-xyz']);
    expect(result.lessons).toHaveLength(1);
  });

  it('returns a well-formed empty result for an empty lesson anchor list', () => {
    const result = misconceptionsForLessons([]);

    expect(result.lessons).toStrictEqual([]);
    expect(result.resolvedAnchors).toStrictEqual([]);
    expect(result.unknownAnchors).toStrictEqual([]);
  });

  it('de-duplicates a repeated anchor slug (anchors are a set)', () => {
    const slug = bareSlug(lessonWithMisconceptions);
    const result = misconceptionsForLessons([slug, slug]);

    expect(result.resolvedAnchors).toStrictEqual([lessonWithMisconceptions]);
    expect(result.lessons).toHaveLength(1);
  });

  it('returns a unit anchor with every lesson of the unit and their misconceptions', () => {
    const result = misconceptionsForUnits([bareSlug(unitWithLessons)]);

    expect(result.resolvedAnchors).toStrictEqual([unitWithLessons]);
    expect(result.units).toHaveLength(1);
    const entry = result.units[0];
    expect(entry?.unit.id).toBe(unitWithLessons);
    expect(entry?.lessons.map((l) => l.lesson.id)).toStrictEqual(
      lessonsByUnit.get(unitWithLessons),
    );
    for (const lessonEntry of entry?.lessons ?? []) {
      expect(lessonEntry.misconceptions.map((m) => m.id)).toStrictEqual(
        misconceptionsByLesson.get(lessonEntry.lesson.id) ?? [],
      );
    }
  });

  it('returns a multi-placed lesson under each of its placing units (placement-as-edge)', () => {
    const result = misconceptionsForUnits(multiPlacedLesson.unitIds.map(bareSlug));

    expect(result.units.map((u) => u.unit.id)).toStrictEqual(multiPlacedLesson.unitIds);
    for (const unitEntry of result.units) {
      expect(unitEntry.lessons.map((l) => l.lesson.id)).toContain(multiPlacedLesson.lessonId);
    }
  });

  it('reports unknown unit anchors with a well-formed empty result', () => {
    const result = misconceptionsForUnits(['no-such-unit-slug-xyz']);

    expect(result.units).toStrictEqual([]);
    expect(result.resolvedAnchors).toStrictEqual([]);
    expect(result.unknownAnchors).toStrictEqual(['no-such-unit-slug-xyz']);
  });

  it('windows a mega-thread to the default unit limit with honest totals (heavy tail)', () => {
    const result = misconceptionsForThread(bareSlug(megaThread.threadId));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.resolvedAnchors).toStrictEqual([megaThread.threadId]);
    const entry = required(result.value.threads[0], 'mega-thread anchor resolved no entry');
    const referenceUnits = required(
      unitsByThread.get(megaThread.threadId),
      'mega-thread has no reference units',
    );
    expect(entry.thread.id).toBe(megaThread.threadId);
    expect(entry.totalUnits).toBe(megaThread.unitCount);
    expect(entry.unitOffset).toBe(0);
    expect(entry.unitLimit).toBe(DEFAULT_THREAD_UNIT_LIMIT);
    expect(entry.units.map((u) => u.unit.id)).toStrictEqual(
      referenceUnits.slice(0, DEFAULT_THREAD_UNIT_LIMIT),
    );
    expect(entry.hasMore).toBe(megaThread.unitCount > DEFAULT_THREAD_UNIT_LIMIT);
  });

  it('pages a thread window deterministically: the second page is the next disjoint slice', () => {
    const first = misconceptionsForThread(bareSlug(megaThread.threadId), {
      unitOffset: 0,
      unitLimit: 5,
    });
    const second = misconceptionsForThread(bareSlug(megaThread.threadId), {
      unitOffset: 5,
      unitLimit: 5,
    });

    expect(first.ok && second.ok).toBe(true);
    if (!first.ok || !second.ok) {
      return;
    }
    const reference = unitsByThread.get(megaThread.threadId) ?? [];
    expect(first.value.threads[0]?.units.map((u) => u.unit.id)).toStrictEqual(
      reference.slice(0, 5),
    );
    expect(second.value.threads[0]?.units.map((u) => u.unit.id)).toStrictEqual(
      reference.slice(5, 10),
    );
  });

  it('returns an empty window with hasMore false for an offset beyond the thread length', () => {
    const result = misconceptionsForThread(bareSlug(megaThread.threadId), {
      unitOffset: megaThread.unitCount,
      unitLimit: 5,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const entry = result.value.threads[0];
    expect(entry?.units).toStrictEqual([]);
    expect(entry?.hasMore).toBe(false);
    expect(entry?.totalUnits).toBe(megaThread.unitCount);
  });

  it('accepts a window exactly at the unit-limit ceiling (inclusive upper bound)', () => {
    const result = misconceptionsForThread(bareSlug(megaThread.threadId), {
      unitLimit: MAX_THREAD_UNIT_LIMIT,
    });

    expect(result.ok).toBe(true);
  });

  it('rejects a window beyond the unit-limit ceiling', () => {
    const result = misconceptionsForThread(bareSlug(megaThread.threadId), {
      unitLimit: MAX_THREAD_UNIT_LIMIT + 1,
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('ThreadWindowInvalid');
  });

  it('rejects a negative offset and a non-positive limit', () => {
    const negativeOffset = misconceptionsForThread(bareSlug(megaThread.threadId), {
      unitOffset: -1,
    });
    const zeroLimit = misconceptionsForThread(bareSlug(megaThread.threadId), { unitLimit: 0 });

    expect(negativeOffset.ok).toBe(false);
    expect(zeroLimit.ok).toBe(false);
  });

  it('validates the window before anchor resolution: an invalid window errs on an unknown thread', () => {
    const result = misconceptionsForThread('no-such-thread-slug-xyz', {
      unitLimit: MAX_THREAD_UNIT_LIMIT + 1,
    });

    expect(result.ok).toBe(false);
  });

  it('reports an unknown thread anchor with a well-formed empty result', () => {
    const result = misconceptionsForThread('no-such-thread-slug-xyz');

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.threads).toStrictEqual([]);
    expect(result.value.resolvedAnchors).toStrictEqual([]);
    expect(result.value.unknownAnchors).toStrictEqual(['no-such-thread-slug-xyz']);
  });

  it('exposes thread reachability on unit entries: threadSlugs is the membership surface', () => {
    const result = misconceptionsForUnits([bareSlug(unitWithLessons)]);

    const entry = result.units[0];
    expect(Array.isArray(entry?.unit.threadSlugs)).toBe(true);
  });

  it('constructs the module-load projection within a generous startup-cost bound', () => {
    const start = performance.now();
    buildCurriculumMisconceptionProjection();
    const elapsedMs = performance.now() - start;
    // Map-building over ~27k nodes / ~32k edges; 500ms is a generous, non-flaky ceiling.
    expect(elapsedMs).toBeLessThan(500);
  });
});
