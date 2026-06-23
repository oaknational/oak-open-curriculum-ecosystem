/**
 * Keyword view (G4b c2) — bounded anchored frequency-ranked keyword retrieval
 * over the one curriculum graph corpus.
 *
 * The anchor is `subject` + `keyStage` (lesson attributes — keywords reach
 * them via their placing lessons), narrowable by unit and lesson slugs.
 * Ranking is by in-scope placement count (how many anchor-matching lessons
 * place the keyword), descending — the bounded "most relevant vocabulary for
 * this teaching context" contract — with the kind-qualified keyword id as the
 * deterministic tie-break.
 *
 * Results are bounded top-N ({@link DEFAULT_KEYWORD_LIMIT} default, ceiling
 * {@link MAX_KEYWORD_LIMIT}) with honest totals (`totalMatchingKeywords`,
 * `hasMore`). Each entry is decorated with its in-scope placing lessons
 * (id-sorted, windowed at {@link KEYWORD_LESSON_DECORATION_LIMIT} with
 * `hasMoreLessons`) — richness arrives via edge traversal on the one-graph
 * substrate, never a fat node.
 *
 * The underlying indexes live in the `keyword-projection` module, constructed
 * once at module load (the EEF precedent).
 */

import { ok, err, type Result } from '@oaknational/result';
import {
  type GraphCorpusKeywordNode,
  type GraphCorpusLessonNode,
  type GraphCorpusLessonNodeId,
  type GraphCorpusNodeId,
  type GraphCorpusUnitNodeId,
} from '@oaknational/sdk-codegen/graph-corpus';

import { resolveAnchors, type ResolvedAnchors } from './anchor-resolution.js';
import {
  buildCurriculumKeywordProjection,
  type CurriculumKeywordProjection,
} from './keyword-projection.js';

/** Default top-N keyword bound — a lean page of ranked vocabulary for one teaching context. */
export const DEFAULT_KEYWORD_LIMIT = 25;

/** Inclusive top-N ceiling; a larger limit is `KeywordLimitInvalid` (bounded-retrieval contract). */
export const MAX_KEYWORD_LIMIT = 100;

/** Per-keyword in-scope lesson decoration window (id-sorted; `hasMoreLessons` marks the cut). */
export const KEYWORD_LESSON_DECORATION_LIMIT = 10;

/** One ranked keyword with its in-scope placement count and windowed lesson decoration. */
export interface KeywordLessons {
  readonly keyword: GraphCorpusKeywordNode;
  readonly scopedLessonCount: number;
  readonly lessons: readonly GraphCorpusLessonNode[];
  readonly hasMoreLessons: boolean;
}

/** Anchored result: ranked bounded keywords with honest totals and anchor resolution reports. */
export interface KeywordSubgraph {
  readonly keywords: readonly KeywordLessons[];
  readonly totalMatchingKeywords: number;
  readonly limit: number;
  readonly hasMore: boolean;
  readonly resolvedUnitAnchors: readonly GraphCorpusUnitNodeId[];
  readonly unknownUnitAnchors: readonly string[];
  readonly resolvedLessonAnchors: readonly GraphCorpusLessonNodeId[];
  readonly unknownLessonAnchors: readonly string[];
}

/** Caller options: unit/lesson narrowing (empty ≡ absent) and the top-N limit. */
export interface KeywordRetrievalOptions {
  readonly unitSlugs?: readonly string[];
  readonly lessonSlugs?: readonly string[];
  readonly limit?: number;
}

/** The limit failed validation: it must be an integer in [1, max]. */
export interface KeywordLimitInvalid {
  readonly kind: 'KeywordLimitInvalid';
  readonly limit: number;
  readonly maxLimit: number;
}

/** The keyword projection, constructed once at module load (EEF precedent). */
const projection: CurriculumKeywordProjection = buildCurriculumKeywordProjection();

/** Resolves the caller limit against the default and the [1, max] validity contract. */
function validateLimit(limit: number | undefined): Result<number, KeywordLimitInvalid> {
  const resolved = limit ?? DEFAULT_KEYWORD_LIMIT;
  if (!Number.isInteger(resolved) || resolved < 1 || resolved > MAX_KEYWORD_LIMIT) {
    return err({ kind: 'KeywordLimitInvalid', limit: resolved, maxLimit: MAX_KEYWORD_LIMIT });
  }
  return ok(resolved);
}

/** Builds one ranked entry: the keyword with its id-sorted, windowed in-scope lessons. */
function keywordEntry(
  keyword: GraphCorpusKeywordNode,
  scopedLessons: readonly GraphCorpusLessonNode[],
): KeywordLessons {
  const sorted = [...scopedLessons].sort((a, b) => a.id.localeCompare(b.id));
  return {
    keyword,
    scopedLessonCount: sorted.length,
    lessons: sorted.slice(0, KEYWORD_LESSON_DECORATION_LIMIT),
    hasMoreLessons: sorted.length > KEYWORD_LESSON_DECORATION_LIMIT,
  };
}

/** The resolved narrowing state: anchor reports plus the ACTIVE lesson-id restriction sets. */
interface NarrowingScope {
  readonly units: ResolvedAnchors<GraphCorpusUnitNodeId>;
  readonly lessons: ResolvedAnchors<GraphCorpusLessonNodeId>;
  readonly unitLessonIds: ReadonlySet<GraphCorpusNodeId> | undefined;
  readonly lessonAnchorIds: ReadonlySet<GraphCorpusNodeId> | undefined;
}

/**
 * Resolves the unit/lesson narrowing options into anchor reports and
 * restriction sets. A narrowing is ACTIVE only when its slug list is
 * non-empty (empty ≡ absent); an inactive narrowing restricts nothing.
 */
function resolveNarrowing(options: KeywordRetrievalOptions): NarrowingScope {
  const unitSlugs = options.unitSlugs ?? [];
  const lessonSlugs = options.lessonSlugs ?? [];
  const units = resolveAnchors(
    unitSlugs,
    (slug): GraphCorpusUnitNodeId => `unit:${slug}`,
    projection.unitsById,
  );
  const lessons = resolveAnchors(
    lessonSlugs,
    (slug): GraphCorpusLessonNodeId => `lesson:${slug}`,
    projection.lessonsById,
  );
  return {
    units,
    lessons,
    unitLessonIds:
      unitSlugs.length > 0
        ? new Set(
            units.resolved.flatMap((unitId) =>
              (projection.lessonsByUnitId.get(unitId) ?? []).map((lesson) => lesson.id),
            ),
          )
        : undefined,
    lessonAnchorIds:
      lessonSlugs.length > 0 ? new Set<GraphCorpusNodeId>(lessons.resolved) : undefined,
  };
}

/** Whether a lesson is in the anchored scope: subject+keyStage match plus every active narrowing. */
function lessonInScope(
  lesson: GraphCorpusLessonNode,
  subject: string,
  keyStage: string,
  scope: NarrowingScope,
): boolean {
  return (
    lesson.subject === subject &&
    lesson.keyStage === keyStage &&
    (scope.unitLessonIds === undefined || scope.unitLessonIds.has(lesson.id)) &&
    (scope.lessonAnchorIds === undefined || scope.lessonAnchorIds.has(lesson.id))
  );
}

/** Fans out scope lessons to their keywords and ranks: scoped count descending, id ascending. */
function rankScopedKeywords(
  subject: string,
  keyStage: string,
  scope: NarrowingScope,
): readonly KeywordLessons[] {
  const scopedLessonsByKeyword = new Map<
    GraphCorpusNodeId,
    { readonly keyword: GraphCorpusKeywordNode; readonly lessons: GraphCorpusLessonNode[] }
  >();
  for (const lesson of projection.lessonsById.values()) {
    if (!lessonInScope(lesson, subject, keyStage, scope)) {
      continue;
    }
    for (const keyword of projection.keywordsByLessonId.get(lesson.id) ?? []) {
      const entry = scopedLessonsByKeyword.get(keyword.id);
      if (entry) {
        entry.lessons.push(lesson);
      } else {
        scopedLessonsByKeyword.set(keyword.id, { keyword, lessons: [lesson] });
      }
    }
  }
  return [...scopedLessonsByKeyword.values()]
    .map(({ keyword, lessons: scoped }) => keywordEntry(keyword, scoped))
    .sort(
      (a, b) =>
        b.scopedLessonCount - a.scopedLessonCount || a.keyword.id.localeCompare(b.keyword.id),
    );
}

/**
 * Returns the bounded frequency-ranked keywords for one teaching context.
 *
 * The scope is every lesson matching the `subject` + `keyStage` anchor,
 * intersected with the unit and lesson narrowings when given (an empty
 * narrowing list is equivalent to absent). Unknown narrowing slugs are
 * reported, not errors; an unknown subject or key stage returns a well-formed
 * empty result on the same path. The limit validates before any anchor work.
 *
 * @param subject - The anchor subject (a corpus key, e.g. `maths` — not free text).
 * @param keyStage - The anchor key stage (a corpus key, e.g. `ks2`).
 * @param options - Optional unit/lesson narrowing and the top-N limit
 *   (default {@link DEFAULT_KEYWORD_LIMIT}, ceiling {@link MAX_KEYWORD_LIMIT}).
 */
export function keywordsForSubjectKeyStage(
  subject: string,
  keyStage: string,
  options: KeywordRetrievalOptions = {},
): Result<KeywordSubgraph, KeywordLimitInvalid> {
  const validated = validateLimit(options.limit);
  if (!validated.ok) {
    return err(validated.error);
  }
  const limit = validated.value;
  const scope = resolveNarrowing(options);
  const ranked = rankScopedKeywords(subject, keyStage, scope);
  return ok({
    keywords: ranked.slice(0, limit),
    totalMatchingKeywords: ranked.length,
    limit,
    hasMore: ranked.length > limit,
    resolvedUnitAnchors: scope.units.resolved,
    unknownUnitAnchors: scope.units.unknown,
    resolvedLessonAnchors: scope.lessons.resolved,
    unknownLessonAnchors: scope.lessons.unknown,
  });
}
