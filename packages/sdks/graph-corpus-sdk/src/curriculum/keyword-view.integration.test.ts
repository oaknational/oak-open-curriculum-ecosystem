/**
 * Integration test (G4b c2): the keyword view describes bounded anchored
 * frequency-ranked keyword retrieval over the real emitted corpus.
 *
 * @remarks
 * The anchor is `subject` + `keyStage` (lesson attributes — keywords reach
 * them via their placing lessons), narrowable by unit and lesson slugs.
 * Ranking is by in-scope placement count (`scopedLessonCount` — how many
 * anchor-matching lessons place the keyword), descending, with the
 * kind-qualified keyword id as the deterministic tie-break. Results are
 * bounded top-N ({@link DEFAULT_KEYWORD_LIMIT} default,
 * {@link MAX_KEYWORD_LIMIT} ceiling) with honest totals, and each entry is
 * decorated with its in-scope placing lessons (id-sorted, windowed at
 * {@link KEYWORD_LESSON_DECORATION_LIMIT} — richness via edge traversal,
 * never a fat node). These tests exercise the REAL corpus and check results
 * against a separately-computed reference adjacency built here from
 * `graphCorpus.edges` (same corpus source, deliberately simpler accumulation
 * than the projection's), plus implementation-independent ordering and
 * boundedness invariants — the invariants, not the reference counts, are the
 * assertions that survive an equivalent reimplementation.
 */
import { unwrapErr } from '@oaknational/result';
import { graphCorpus, type GraphCorpusNode } from '@oaknational/sdk-codegen/graph-corpus';
import { describe, expect, it } from 'vitest';

import {
  DEFAULT_KEYWORD_LIMIT,
  KEYWORD_LESSON_DECORATION_LIMIT,
  MAX_KEYWORD_LIMIT,
  keywordsForSubjectKeyStage,
} from './keyword-view.js';
import { bareSlug, required, unwrapOk } from './test-helpers.js';

/** Lesson nodes by id (reference index; string-keyed so reference adjacency ids look up directly). */
const lessonNodesById: ReadonlyMap<string, GraphCorpusNode> = new Map(
  graphCorpus.nodes.filter((node) => node.kind === 'lesson').map((node) => [node.id, node]),
);

/** Reference adjacency: lesson id → sorted keyword ids (from containsKeyword edges). */
const keywordIdsByLessonId = (() => {
  const adjacency = new Map<string, string[]>();
  for (const edge of graphCorpus.edges) {
    if (edge.type !== 'containsKeyword') {
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
})();

/** Reference adjacency: unit id → sorted lesson ids (from containsLesson edges). */
const lessonIdsByUnitId = (() => {
  const adjacency = new Map<string, string[]>();
  for (const edge of graphCorpus.edges) {
    if (edge.type !== 'containsLesson') {
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
})();

/** Reference in-scope keyword counts for a subject+keyStage: keyword id → placing-lesson count. */
function referenceScopedCounts(subject: string, keyStage: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [lessonId, keywordIds] of keywordIdsByLessonId) {
    const lesson = lessonNodesById.get(lessonId);
    if (lesson?.kind !== 'lesson') {
      continue;
    }
    if (lesson.subject !== subject || lesson.keyStage !== keyStage) {
      continue;
    }
    for (const keywordId of keywordIds) {
      counts.set(keywordId, (counts.get(keywordId) ?? 0) + 1);
    }
  }
  return counts;
}

/**
 * The (subject, keyStage) pair placing the most keyworded lessons — a
 * deterministic rich anchor guaranteed to exceed the default top-N bound.
 */
const richAnchor = required(
  (() => {
    const pairCounts = new Map<string, number>();
    for (const lessonId of keywordIdsByLessonId.keys()) {
      const lesson = lessonNodesById.get(lessonId);
      if (lesson?.kind !== 'lesson') {
        continue;
      }
      const key = `${lesson.subject}\u001f${lesson.keyStage}`;
      pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
    }
    return [...pairCounts.entries()]
      .map(([key, count]) => {
        const [subject = '', keyStage = ''] = key.split('\u001f');
        return { subject, keyStage, count };
      })
      .sort((a, b) => b.count - a.count || a.subject.localeCompare(b.subject))[0];
  })(),
  'corpus has no keyworded lessons',
);

const richCounts = referenceScopedCounts(richAnchor.subject, richAnchor.keyStage);

/** A unit (in the rich anchor's scope) whose lessons carry keywords, chosen deterministically. */
const keywordedUnit = required(
  [...lessonIdsByUnitId.entries()]
    .filter(([, lessonIds]) =>
      lessonIds.some((lessonId) => {
        const lesson = lessonNodesById.get(lessonId);
        return (
          lesson?.kind === 'lesson' &&
          lesson.subject === richAnchor.subject &&
          lesson.keyStage === richAnchor.keyStage &&
          keywordIdsByLessonId.has(lessonId)
        );
      }),
    )
    .map(([unitId]) => unitId)
    .sort((a, b) => a.localeCompare(b))[0],
  'corpus has no in-scope unit with keyworded lessons',
);

/** An in-scope lesson with keywords, chosen deterministically. */
const keywordedLesson = required(
  [...keywordIdsByLessonId.keys()]
    .filter((lessonId) => {
      const lesson = lessonNodesById.get(lessonId);
      return (
        lesson?.kind === 'lesson' &&
        lesson.subject === richAnchor.subject &&
        lesson.keyStage === richAnchor.keyStage
      );
    })
    .sort((a, b) => a.localeCompare(b))[0],
  'corpus has no in-scope keyworded lesson',
);

describe('keyword view — bounded anchored frequency-ranked retrieval', () => {
  it('returns the top in-scope keywords ranked by scoped placement count with honest totals', () => {
    const result = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage);

    const { keywords, totalMatchingKeywords, hasMore, limit } = unwrapOk(result);
    expect(limit).toBe(DEFAULT_KEYWORD_LIMIT);
    expect(totalMatchingKeywords).toBe(richCounts.size);
    expect(keywords).toHaveLength(Math.min(DEFAULT_KEYWORD_LIMIT, richCounts.size));
    expect(hasMore).toBe(richCounts.size > DEFAULT_KEYWORD_LIMIT);
    for (const entry of keywords) {
      expect(entry.scopedLessonCount).toBe(richCounts.get(entry.keyword.id));
    }
    // Ranked: scoped count descending, keyword id ascending as the tie-break.
    for (let i = 1; i < keywords.length; i += 1) {
      const prev = required(keywords[i - 1], 'ranked entry missing');
      const curr = required(keywords[i], 'ranked entry missing');
      const ordered =
        prev.scopedLessonCount > curr.scopedLessonCount ||
        (prev.scopedLessonCount === curr.scopedLessonCount &&
          prev.keyword.id.localeCompare(curr.keyword.id) < 0);
      expect(ordered).toBe(true);
    }
  });

  it('decorates each keyword with its in-scope placing lessons, id-sorted and windowed', () => {
    const result = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage);

    const top = required(unwrapOk(result).keywords[0], 'rich anchor returned no keywords');
    expect(top.lessons).toHaveLength(
      Math.min(top.scopedLessonCount, KEYWORD_LESSON_DECORATION_LIMIT),
    );
    expect(top.hasMoreLessons).toBe(top.scopedLessonCount > KEYWORD_LESSON_DECORATION_LIMIT);
    const ids = top.lessons.map((lesson) => lesson.id);
    expect(ids).toStrictEqual([...ids].sort((a, b) => a.localeCompare(b)));
    for (const lesson of top.lessons) {
      expect(lesson.subject).toBe(richAnchor.subject);
      expect(lesson.keyStage).toBe(richAnchor.keyStage);
      expect(keywordIdsByLessonId.get(lesson.id)).toContain(top.keyword.id);
    }
  });

  it('respects an explicit limit and accepts the ceiling inclusively', () => {
    const limited = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage, {
      limit: 3,
    });
    const atCeiling = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage, {
      limit: MAX_KEYWORD_LIMIT,
    });

    const limitedValue = unwrapOk(limited);
    expect(limitedValue.keywords).toHaveLength(3);
    expect(limitedValue.limit).toBe(3);
    expect(limitedValue.hasMore).toBe(true);
    expect(unwrapOk(atCeiling).limit).toBe(MAX_KEYWORD_LIMIT);
  });

  it('rejects a limit beyond the ceiling, a non-positive limit, and a non-integer limit', () => {
    const beyond = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage, {
      limit: MAX_KEYWORD_LIMIT + 1,
    });
    const zero = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage, {
      limit: 0,
    });
    const fractional = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage, {
      limit: 2.5,
    });

    for (const result of [beyond, zero, fractional]) {
      const error = unwrapErr(result);
      expect(error.kind).toBe('KeywordLimitInvalid');
      expect(error.maxLimit).toBe(MAX_KEYWORD_LIMIT);
    }
  });

  it('narrows to unit anchors: only keywords placed by in-scope lessons of those units', () => {
    const result = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage, {
      unitSlugs: [bareSlug(keywordedUnit), 'no-such-unit-slug-xyz'],
    });

    const value = unwrapOk(result);
    expect(value.resolvedUnitAnchors).toStrictEqual([keywordedUnit]);
    expect(value.unknownUnitAnchors).toStrictEqual(['no-such-unit-slug-xyz']);
    expect(value.keywords.length).toBeGreaterThan(0);
    const unitLessonIds = new Set(lessonIdsByUnitId.get(keywordedUnit) ?? []);
    for (const entry of value.keywords) {
      // Count fidelity: the scoped count is bounded by the unit's lesson set,
      // and below the decoration window it must equal the visible (all
      // in-unit) lessons — an out-of-unit lesson inflating the count would
      // break this without needing a recomputed reference.
      expect(entry.scopedLessonCount).toBeLessThanOrEqual(unitLessonIds.size);
      expect(entry.lessons).toHaveLength(
        Math.min(entry.scopedLessonCount, KEYWORD_LESSON_DECORATION_LIMIT),
      );
      for (const lesson of entry.lessons) {
        expect(unitLessonIds.has(lesson.id)).toBe(true);
      }
    }
  });

  it('returns a well-formed empty result when every unit narrowing slug is unknown', () => {
    const result = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage, {
      unitSlugs: ['no-such-unit-slug-xyz'],
    });

    const value = unwrapOk(result);
    expect(value.keywords).toStrictEqual([]);
    expect(value.totalMatchingKeywords).toBe(0);
    expect(value.hasMore).toBe(false);
    expect(value.resolvedUnitAnchors).toStrictEqual([]);
    expect(value.unknownUnitAnchors).toStrictEqual(['no-such-unit-slug-xyz']);
  });

  it('narrows to lesson anchors: scoped counts reflect only those lessons', () => {
    const result = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage, {
      lessonSlugs: [bareSlug(keywordedLesson), 'no-such-lesson-slug-xyz'],
    });

    const value = unwrapOk(result);
    expect(value.resolvedLessonAnchors).toStrictEqual([keywordedLesson]);
    expect(value.unknownLessonAnchors).toStrictEqual(['no-such-lesson-slug-xyz']);
    const referenceKeywords = keywordIdsByLessonId.get(keywordedLesson) ?? [];
    expect(value.totalMatchingKeywords).toBe(referenceKeywords.length);
    for (const entry of value.keywords) {
      expect(referenceKeywords).toContain(entry.keyword.id);
      expect(entry.scopedLessonCount).toBe(1);
      expect(entry.lessons.map((lesson) => lesson.id)).toStrictEqual([keywordedLesson]);
    }
  });

  it('treats empty narrowing lists as no narrowing (absent and [] are equivalent)', () => {
    const absent = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage);
    const empty = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage, {
      unitSlugs: [],
      lessonSlugs: [],
    });

    expect(unwrapOk(empty)).toStrictEqual(unwrapOk(absent));
  });

  it('returns a well-formed empty result for an unknown subject or key stage', () => {
    const result = keywordsForSubjectKeyStage('no-such-subject-xyz', 'ks2');

    const value = unwrapOk(result);
    expect(value.keywords).toStrictEqual([]);
    expect(value.totalMatchingKeywords).toBe(0);
    expect(value.hasMore).toBe(false);
  });

  it('validates the limit before anchor work: an invalid limit errs even on an unknown subject', () => {
    const result = keywordsForSubjectKeyStage('no-such-subject-xyz', 'ks2', {
      limit: MAX_KEYWORD_LIMIT + 1,
    });

    expect(result.ok).toBe(false);
  });

  it('is deterministic: the same anchored call returns a deeply equal result', () => {
    const first = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage, {
      limit: 10,
    });
    const second = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage, {
      limit: 10,
    });

    expect(first).toStrictEqual(second);
  });
});
