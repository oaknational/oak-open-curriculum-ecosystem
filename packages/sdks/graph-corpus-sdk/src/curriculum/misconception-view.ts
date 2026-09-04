/**
 * Misconception view (G2 c2) — bounded anchored retrieval of the
 * thread→unit→lesson→misconception chain over the one curriculum graph corpus.
 *
 * Anchors per the owner ratification (2026-06-09):
 *
 * - **lesson** — the near-trivial leaf (every lesson carries ≤2 misconceptions);
 * - **unit** — the core anchor (2–11 KB typical bodies);
 * - **thread** — bounded with heavy-tail semantics: thread bodies reach ~262 KB
 *   and one maths mega-thread spans 77% of its subject's units, so thread
 *   results are windowed unit-granularly ({@link DEFAULT_THREAD_UNIT_LIMIT}
 *   units per page, ceiling {@link MAX_THREAD_UNIT_LIMIT}).
 *
 * Reachability honesty is carried as data: thread results echo their window
 * against `totalUnits` with a `hasMore` marker, and unit entries carry the
 * corpus `threadSlugs` membership (an empty list marks a thread-unreachable
 * unit — 15.7% of english-secondary units carry no thread, so thread-anchored
 * results are never subject-complete).
 *
 * The underlying adjacency lives in the `misconception-projection` module,
 * constructed once at module load (the EEF precedent).
 */

import { ok, err, type Result } from '@oaknational/result';
import {
  type GraphCorpusLessonNode,
  type GraphCorpusLessonNodeId,
  type GraphCorpusMisconceptionNode,
  type GraphCorpusThreadNode,
  type GraphCorpusThreadNodeId,
  type GraphCorpusUnitNode,
  type GraphCorpusUnitNodeId,
} from '@oaknational/sdk-codegen/graph-corpus';

import { resolveAnchors } from './anchor-resolution.js';
import {
  buildCurriculumMisconceptionProjection,
  type CurriculumMisconceptionProjection,
} from './misconception-projection.js';
import { mustGet } from './projection-helpers.js';

/** Default unit-window size for thread anchors — bounds the heavy tail while returning median threads whole. */
export const DEFAULT_THREAD_UNIT_LIMIT = 10;

/** Inclusive unit-window ceiling; a larger window is `ThreadWindowInvalid` (bounded-retrieval contract). */
export const MAX_THREAD_UNIT_LIMIT = 25;

/** A lesson with its misconceptions (id-sorted; empty is well-formed absence). */
export interface LessonMisconceptions {
  readonly lesson: GraphCorpusLessonNode;
  readonly misconceptions: readonly GraphCorpusMisconceptionNode[];
}

/** A unit with every lesson the corpus places in it, each carrying its misconceptions. */
export interface UnitMisconceptions {
  readonly unit: GraphCorpusUnitNode;
  readonly lessons: readonly LessonMisconceptions[];
}

/** Lesson-anchored result: entries for resolved anchors, unknown slugs reported (not an error). */
export interface LessonMisconceptionsSubgraph {
  readonly lessons: readonly LessonMisconceptions[];
  readonly resolvedAnchors: readonly GraphCorpusLessonNodeId[];
  readonly unknownAnchors: readonly string[];
}

/** Unit-anchored result: entries for resolved anchors, unknown slugs reported (not an error). */
export interface UnitMisconceptionsSubgraph {
  readonly units: readonly UnitMisconceptions[];
  readonly resolvedAnchors: readonly GraphCorpusUnitNodeId[];
  readonly unknownAnchors: readonly string[];
}

/** One thread's unit-granular window with honest coverage metadata. */
export interface ThreadMisconceptions {
  readonly thread: GraphCorpusThreadNode;
  readonly totalUnits: number;
  readonly unitOffset: number;
  readonly unitLimit: number;
  readonly hasMore: boolean;
  readonly units: readonly UnitMisconceptions[];
}

/** Thread-anchored result: `threads` carries zero or one windowed entry (set semantics). */
export interface ThreadMisconceptionsSubgraph {
  readonly threads: readonly ThreadMisconceptions[];
  readonly resolvedAnchors: readonly GraphCorpusThreadNodeId[];
  readonly unknownAnchors: readonly string[];
}

/** The caller-adjustable unit window for a thread anchor. */
export interface ThreadMisconceptionsWindow {
  readonly unitOffset?: number;
  readonly unitLimit?: number;
}

/** The window failed validation: offset must be a non-negative integer, limit an integer in [1, max]. */
export interface ThreadWindowInvalid {
  readonly kind: 'ThreadWindowInvalid';
  readonly unitOffset: number;
  readonly unitLimit: number;
  readonly maxUnitLimit: number;
}

/** The misconception projection, constructed once at module load (EEF precedent). */
const projection: CurriculumMisconceptionProjection = buildCurriculumMisconceptionProjection();

/** Builds one lesson entry: the lesson with its (possibly empty) id-sorted misconceptions. */
function lessonEntry(lesson: GraphCorpusLessonNode): LessonMisconceptions {
  return { lesson, misconceptions: projection.misconceptionsByLessonId.get(lesson.id) ?? [] };
}

/**
 * Builds one unit entry: the unit with every placed lesson and their
 * misconceptions, the lessons in Oak's authored teaching order (MCP-682 — the
 * corpus `unitLessonRuns` section, not the id-sorted edge set).
 */
function unitEntry(unit: GraphCorpusUnitNode): UnitMisconceptions {
  const lessons = projection.lessonsByUnitId.get(unit.id) ?? [];
  return { unit, lessons: lessons.map(lessonEntry) };
}

/** Resolves the caller window against the defaults and the [0, max] validity contract. */
function validateThreadWindow(
  window: ThreadMisconceptionsWindow,
): Result<{ readonly unitOffset: number; readonly unitLimit: number }, ThreadWindowInvalid> {
  const unitOffset = window.unitOffset ?? 0;
  const unitLimit = window.unitLimit ?? DEFAULT_THREAD_UNIT_LIMIT;
  const offsetValid = Number.isInteger(unitOffset) && unitOffset >= 0;
  const limitValid =
    Number.isInteger(unitLimit) && unitLimit >= 1 && unitLimit <= MAX_THREAD_UNIT_LIMIT;
  if (!offsetValid || !limitValid) {
    return err({
      kind: 'ThreadWindowInvalid',
      unitOffset,
      unitLimit,
      maxUnitLimit: MAX_THREAD_UNIT_LIMIT,
    });
  }
  return ok({ unitOffset, unitLimit });
}

/**
 * Returns the misconceptions for the given anchor lessons (the leaf anchor —
 * every lesson carries at most two). Unknown slugs are reported in
 * `unknownAnchors`; an empty or fully-unknown anchor list returns a
 * well-formed empty result on the same projection path.
 *
 * @param lessonSlugs - Anchor lesson slugs (corpus keys, not free text).
 */
export function misconceptionsForLessons(
  lessonSlugs: readonly string[],
): LessonMisconceptionsSubgraph {
  const { resolved, unknown } = resolveAnchors(
    lessonSlugs,
    (slug): GraphCorpusLessonNodeId => `lesson:${slug}`,
    projection.lessonsById,
  );
  const lessons = resolved.map((id) => lessonEntry(mustGet(projection.lessonsById, id)));
  return { lessons, resolvedAnchors: resolved, unknownAnchors: unknown };
}

/**
 * Returns the misconceptions for the given anchor units (the core anchor),
 * grouped per placed lesson, each unit's lessons in Oak's authored teaching
 * order. A lesson placed in several anchor units appears
 * under each (placement is an edge, not a property). Unknown slugs are
 * reported in `unknownAnchors`.
 *
 * @param unitSlugs - Anchor unit slugs (corpus keys, not free text).
 */
export function misconceptionsForUnits(unitSlugs: readonly string[]): UnitMisconceptionsSubgraph {
  const { resolved, unknown } = resolveAnchors(
    unitSlugs,
    (slug): GraphCorpusUnitNodeId => `unit:${slug}`,
    projection.unitsById,
  );
  const units = resolved.map((id) => unitEntry(mustGet(projection.unitsById, id)));
  return { units, resolvedAnchors: resolved, unknownAnchors: unknown };
}

/**
 * Builds one thread's windowed entry over the thread's units in Oak's
 * curriculum order — years ascending within each subject, the subject's
 * authored unit order within a year, one subject's run completed before the
 * next begins (MCP-682). A page therefore reads as a progression, which is
 * what a numbered window claims to be.
 */
function threadEntry(
  id: GraphCorpusThreadNodeId,
  unitOffset: number,
  unitLimit: number,
): ThreadMisconceptions {
  const allUnits = projection.unitsByThreadId.get(id) ?? [];
  const windowUnits = allUnits.slice(unitOffset, unitOffset + unitLimit);
  return {
    thread: mustGet(projection.threadsById, id),
    totalUnits: allUnits.length,
    unitOffset,
    unitLimit,
    hasMore: unitOffset + windowUnits.length < allUnits.length,
    units: windowUnits.map(unitEntry),
  };
}

/**
 * Returns one thread's misconceptions as a unit-granular window (the
 * heavy-tail anchor: thread bodies reach ~262 KB, so the window — not a whole
 * thread — is the unit of retrieval). The window validates before anchor
 * resolution; an unknown thread slug is reported, not an error, and returns a
 * well-formed empty result.
 *
 * @param threadSlug - The anchor thread slug (a corpus key, not free text).
 * @param window - Optional unit window; defaults to offset 0, limit
 *   {@link DEFAULT_THREAD_UNIT_LIMIT}, ceiling {@link MAX_THREAD_UNIT_LIMIT}.
 */
export function misconceptionsForThread(
  threadSlug: string,
  window: ThreadMisconceptionsWindow = {},
): Result<ThreadMisconceptionsSubgraph, ThreadWindowInvalid> {
  const validated = validateThreadWindow(window);
  if (!validated.ok) {
    return err(validated.error);
  }
  const { unitOffset, unitLimit } = validated.value;

  const { resolved, unknown } = resolveAnchors(
    [threadSlug],
    (slug): GraphCorpusThreadNodeId => `thread:${slug}`,
    projection.threadsById,
  );
  const threads = resolved.map((id) => threadEntry(id, unitOffset, unitLimit));
  return ok({ threads, resolvedAnchors: resolved, unknownAnchors: unknown });
}
