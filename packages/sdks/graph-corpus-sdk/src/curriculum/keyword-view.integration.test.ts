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
 * {@link MAX_KEYWORD_LIMIT} ceiling) with honest totals, and each entry
 * carries every definition its in-scope lessons author, each naming those
 * lessons by slug (slug-sorted, windowed at
 * {@link KEYWORD_DEFINITION_LESSON_LIMIT}). These tests exercise the REAL
 * corpus and check results against reference indexes built here from
 * `graphCorpus.edges` and `graphCorpus.keywordDefinitions` (same corpus
 * source), plus implementation-independent ordering and boundedness
 * invariants — the invariants, not the reference counts, are the assertions
 * that survive an equivalent reimplementation.
 */
import { unwrapErr } from '@oaknational/result';
import {
  graphCorpus,
  type GraphCorpusKeywordDefinition,
  type GraphCorpusNode,
} from '@oaknational/sdk-codegen/graph-corpus';
import { describe, expect, it } from 'vitest';

import { KEYWORD_DEFINITION_LESSON_LIMIT } from './keyword-definitions.js';
import {
  DEFAULT_KEYWORD_LIMIT,
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

/** Reference definition rows: keyword id → its lesson-authored definitions (from keywordDefinitions). */
const definitionRowsByKeywordId = (() => {
  const rows = new Map<string, GraphCorpusKeywordDefinition[]>();
  for (const row of graphCorpus.keywordDefinitions) {
    const existing = rows.get(row.keywordId);
    if (existing) {
      existing.push(row);
    } else {
      rows.set(row.keywordId, [row]);
    }
  }
  return rows;
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

  it('serves exactly the definitions its in-scope lessons author, never another scope’s', () => {
    // The R1 defect: one definition per term, taken from whichever lesson
    // sorted first corpus-wide, was served in every scope.
    const inRichScope = (lessonId: string): boolean => {
      const lesson = lessonNodesById.get(lessonId);
      return (
        lesson?.kind === 'lesson' &&
        lesson.subject === richAnchor.subject &&
        lesson.keyStage === richAnchor.keyStage
      );
    };
    const result = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage, {
      limit: MAX_KEYWORD_LIMIT,
    });

    const { keywords } = unwrapOk(result);
    // The check only discriminates if some keyword here has several definitions.
    expect(keywords.some((entry) => entry.definitions.length > 1)).toBe(true);
    for (const entry of keywords) {
      const expected = (definitionRowsByKeywordId.get(entry.keyword.id) ?? [])
        .map((row) => ({
          term: row.term,
          definition: row.definition,
          scopedLessonCount: row.lessonIds.filter(inRichScope).length,
        }))
        .filter((row) => row.scopedLessonCount > 0);
      const served = entry.definitions.map(({ term, definition, scopedLessonCount }) => ({
        term,
        definition,
        scopedLessonCount,
      }));
      expect(served).toHaveLength(expected.length);
      expect(served).toStrictEqual(expect.arrayContaining(expected));
      const counts = served.map((definition) => definition.scopedLessonCount);
      expect(counts).toStrictEqual([...counts].sort((a, b) => b - a));
    }
  });

  it('names the in-scope lessons that author each definition, slug-sorted and windowed', () => {
    const result = keywordsForSubjectKeyStage(richAnchor.subject, richAnchor.keyStage);

    const top = required(unwrapOk(result).keywords[0], 'rich anchor returned no keywords');
    expect(top.definitions.length).toBeGreaterThan(0);
    for (const definition of top.definitions) {
      const row = required(
        definitionRowsByKeywordId
          .get(top.keyword.id)
          ?.find((r) => r.term === definition.term && r.definition === definition.definition),
        'served definition has no corpus row',
      );
      expect(definition.lessonSlugs).toHaveLength(
        Math.min(definition.scopedLessonCount, KEYWORD_DEFINITION_LESSON_LIMIT),
      );
      expect(definition.hasMoreLessons).toBe(
        definition.scopedLessonCount > KEYWORD_DEFINITION_LESSON_LIMIT,
      );
      expect(definition.lessonSlugs).toStrictEqual(
        [...definition.lessonSlugs].sort((a, b) => a.localeCompare(b)),
      );
      for (const lessonSlug of definition.lessonSlugs) {
        expect(lessonNodesById.get(`lesson:${lessonSlug}`)).toMatchObject({
          subject: richAnchor.subject,
          keyStage: richAnchor.keyStage,
        });
        expect(row.lessonIds).toContain(`lesson:${lessonSlug}`);
      }
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
      // Count fidelity: the scoped counts are bounded by the unit's lesson
      // set, and below the lesson window a definition's count must equal its
      // visible (all in-unit) lessons — an out-of-unit lesson inflating a
      // count would break this without needing a recomputed reference.
      expect(entry.scopedLessonCount).toBeLessThanOrEqual(unitLessonIds.size);
      for (const definition of entry.definitions) {
        expect(definition.lessonSlugs).toHaveLength(
          Math.min(definition.scopedLessonCount, KEYWORD_DEFINITION_LESSON_LIMIT),
        );
        for (const lessonSlug of definition.lessonSlugs) {
          expect(unitLessonIds.has(`lesson:${lessonSlug}`)).toBe(true);
        }
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
      const authoredHere = (definitionRowsByKeywordId.get(entry.keyword.id) ?? []).filter((row) =>
        row.lessonIds.some((lessonId) => lessonId === keywordedLesson),
      );
      expect(entry.definitions).toHaveLength(authoredHere.length);
      for (const definition of entry.definitions) {
        expect(definition.lessonSlugs).toStrictEqual([bareSlug(keywordedLesson)]);
      }
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
