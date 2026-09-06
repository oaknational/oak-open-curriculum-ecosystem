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

import {
  DEFAULT_THREAD_UNIT_LIMIT,
  MAX_THREAD_UNIT_LIMIT,
  misconceptionsForLessons,
  misconceptionsForThread,
  misconceptionsForUnits,
} from './misconception-view.js';
import { bareSlug, required, unwrapOk } from './test-helpers.js';

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

/**
 * WIRING references, re-derived from the corpus's ordered sections. These
 * prove the view reads `sequences` / `unitLessonRuns` rather than the edge set
 * — they do NOT prove the ordering itself is correct, because
 * `orderedUnitsByThread` necessarily repeats the production concat-and-dedupe
 * shape, so a bug in that shape would reproduce here and still pass. The
 * ordering is proved instead by the falsification tests below (served order is
 * one the alphabet could not produce) and, at source, by the hostile-fixture
 * unit tests over the sequence and unit-lesson-run builders. Membership
 * references above come from the edges, which is what they are for.
 */
function orderedUnitsByThread(): Map<string, string[]> {
  const byThread = new Map<string, string[]>();
  for (const sequence of graphCorpus.sequences) {
    const run = byThread.get(sequence.threadId) ?? [];
    for (const placement of sequence.placements) {
      if (!run.includes(placement.unitId)) {
        run.push(placement.unitId);
      }
    }
    byThread.set(sequence.threadId, run);
  }
  return byThread;
}

function orderedLessonsByUnit(): Map<string, string[]> {
  return new Map(graphCorpus.unitLessonRuns.map((run) => [run.unitId, [...run.lessonIds]]));
}

const curriculumUnitsByThread = orderedUnitsByThread();
const curriculumLessonsByUnit = orderedLessonsByUnit();
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
    const entry = required(result.units[0], 'unit anchor resolved no entry');
    expect(entry.unit.id).toBe(unitWithLessons);
    const servedLessonIds = entry.lessons.map((l) => l.lesson.id);
    expect(servedLessonIds).toStrictEqual(curriculumLessonsByUnit.get(unitWithLessons));
    // Membership is unchanged by the ordering fix: the same lessons, reordered.
    expect([...servedLessonIds].sort((a, b) => a.localeCompare(b))).toStrictEqual(
      lessonsByUnit.get(unitWithLessons),
    );
    for (const lessonEntry of entry.lessons) {
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

  // MCP-682: the two hops Oak authors as sequences, proved separately from
  // the chain-retrieval behaviour above.
  describe('curriculum ordering', () => {
    it('serves a unit’s lessons in Oak’s authored order, not in lesson-id order', () => {
      // Chosen for the property under test: a real unit whose authored lesson
      // order DIFFERS from id order, so an id-sorted implementation fails here.
      const reordered = required(
        graphCorpus.unitLessonRuns.find((run) => {
          const idSorted = [...run.lessonIds].sort((a, b) => a.localeCompare(b));
          return run.lessonIds.length > 2 && idSorted.join() !== run.lessonIds.join();
        }),
        'corpus has no unit whose authored lesson order differs from id order',
      );

      const result = misconceptionsForUnits([bareSlug(reordered.unitId)]);
      const served = result.units[0]?.lessons.map((l) => l.lesson.id) ?? [];

      expect(served).toStrictEqual([...reordered.lessonIds]);
      expect(served).not.toStrictEqual([...served].sort((a, b) => a.localeCompare(b)));
    });

    it('preserves thread membership while reordering: the served units are the edge set', () => {
      // The ordering fix changed ORDER, not membership. Paging the whole thread
      // must return exactly the units the containsUnit edges place in it —
      // otherwise a reorder that silently dropped or duplicated a unit would
      // still satisfy every order assertion in this file.
      const served: string[] = [];
      for (let offset = 0; offset < megaThread.unitCount; offset += MAX_THREAD_UNIT_LIMIT) {
        const page = unwrapOk(
          misconceptionsForThread(bareSlug(megaThread.threadId), {
            unitOffset: offset,
            unitLimit: MAX_THREAD_UNIT_LIMIT,
          }),
        );
        served.push(...(page.threads[0]?.units ?? []).map((u) => u.unit.id));
      }

      expect(new Set(served).size).toBe(served.length);
      expect([...served].sort((a, b) => a.localeCompare(b))).toStrictEqual(
        unitsByThread.get(megaThread.threadId),
      );
    });

    it('serves a unit the curriculum revisits at two years exactly once', () => {
      // Deterministically the thread that HAS a revisited unit — the earlier
      // dedup assertion ran on the mega-thread, which was never shown to
      // contain one, so the property was exercised zero times.
      const revisited = required(
        graphCorpus.sequences.find((sequence) => {
          const ids = sequence.placements.map((placement) => placement.unitId);
          return new Set(ids).size !== ids.length;
        }),
        'corpus has no sequence that places a unit at two years',
      );
      const placements = revisited.placements.map((placement) => placement.unitId);
      const twice = required(
        placements.find((id, index) => placements.indexOf(id) !== index),
        'sequence has no repeated unit',
      );

      const result = unwrapOk(
        misconceptionsForThread(bareSlug(revisited.threadId), { unitLimit: MAX_THREAD_UNIT_LIMIT }),
      );
      const served = (result.threads[0]?.units ?? []).map((u) => u.unit.id);

      expect(served.filter((id) => id === twice)).toHaveLength(1);
      expect(result.threads[0]?.totalUnits).toBe(new Set(placements).size);
      expect(served.indexOf(twice)).toBe(placements.indexOf(twice));
    });

    it('serves a thread window in an order the alphabet could not produce', () => {
      // Falsification, independent of how the view builds its order: find a
      // thread whose curriculum order provably differs from id order, and prove
      // the served window is not the id-sorted one.
      const disagreeing = required(
        graphCorpus.sequences
          .map((sequence) => sequence.threadId)
          .find((threadId) => {
            const units = curriculumUnitsByThread.get(threadId) ?? [];
            const idSorted = [...units].sort((a, b) => a.localeCompare(b));
            return units.length > 2 && idSorted.join() !== units.join();
          }),
        'corpus has no thread whose curriculum order differs from id order',
      );

      const result = unwrapOk(
        misconceptionsForThread(bareSlug(disagreeing), { unitLimit: MAX_THREAD_UNIT_LIMIT }),
      );
      const served = (result.threads[0]?.units ?? []).map((u) => u.unit.id);
      expect(served).not.toStrictEqual([...served].sort((a, b) => a.localeCompare(b)));
    });

    it('serves authored lesson order inside a thread window too, not just at the unit anchor', () => {
      const result = unwrapOk(
        misconceptionsForThread(bareSlug(megaThread.threadId), { unitLimit: 10 }),
      );
      for (const unitEntry of result.threads[0]?.units ?? []) {
        expect(unitEntry.lessons.map((l) => l.lesson.id)).toStrictEqual(
          curriculumLessonsByUnit.get(unitEntry.unit.id) ?? [],
        );
      }
    });
  });

  it('reports unknown unit anchors with a well-formed empty result', () => {
    const result = misconceptionsForUnits(['no-such-unit-slug-xyz']);

    expect(result.units).toStrictEqual([]);
    expect(result.resolvedAnchors).toStrictEqual([]);
    expect(result.unknownAnchors).toStrictEqual(['no-such-unit-slug-xyz']);
  });

  it('windows a mega-thread to the default unit limit with honest totals (heavy tail)', () => {
    const value = unwrapOk(misconceptionsForThread(bareSlug(megaThread.threadId)));
    expect(value.resolvedAnchors).toStrictEqual([megaThread.threadId]);
    const entry = required(value.threads[0], 'mega-thread anchor resolved no entry');
    const referenceUnits = required(
      curriculumUnitsByThread.get(megaThread.threadId),
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

    const firstPage = unwrapOk(first);
    const secondPage = unwrapOk(second);
    const reference = curriculumUnitsByThread.get(megaThread.threadId) ?? [];
    expect(firstPage.threads[0]?.units.map((u) => u.unit.id)).toStrictEqual(reference.slice(0, 5));
    expect(secondPage.threads[0]?.units.map((u) => u.unit.id)).toStrictEqual(
      reference.slice(5, 10),
    );
  });

  it('returns an empty window with hasMore false for an offset beyond the thread length', () => {
    const value = unwrapOk(
      misconceptionsForThread(bareSlug(megaThread.threadId), {
        unitOffset: megaThread.unitCount,
        unitLimit: 5,
      }),
    );
    const entry = value.threads[0];
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
    const value = unwrapOk(misconceptionsForThread('no-such-thread-slug-xyz'));
    expect(value.threads).toStrictEqual([]);
    expect(value.resolvedAnchors).toStrictEqual([]);
    expect(value.unknownAnchors).toStrictEqual(['no-such-thread-slug-xyz']);
  });

  it('exposes thread reachability on unit entries: threadSlugs is the membership surface', () => {
    const result = misconceptionsForUnits([bareSlug(unitWithLessons)]);

    const entry = result.units[0];
    expect(Array.isArray(entry?.unit.threadSlugs)).toBe(true);
  });
});
