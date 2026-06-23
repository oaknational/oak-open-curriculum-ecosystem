/**
 * Graph-corpus node builders (G1a + G2): unit nodes (thread ∪ prior-knowledge
 * ∪ lesson-hosting sources, slug-sorted), thread and lesson nodes
 * (slug-sorted, lessons deduped) — all deterministic, order-independent
 * output. The misconception builder (the mint-rule dedup machinery) lives in
 * `graph-corpus-misconception-nodes.ts`.
 */
import type { ExtractedLesson, ExtractedPriorKnowledge } from '../extractors/index.js';
import type { ExtractedThread } from '../extractors/thread-extractor.js';

import {
  lessonNodeId,
  threadNodeId,
  unitNodeId,
  type GraphCorpusLessonNode,
  type GraphCorpusThreadNode,
  type GraphCorpusUnitNode,
} from './graph-corpus-types.js';

/** Mutable unit-node accumulator used during construction. */
interface UnitAccumulator {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly subject: string;
  readonly keyStage: string;
  readonly year: number | undefined;
  readonly priorKnowledge: string[];
  readonly threadSlugs: string[];
}

/** The unit metadata any source (thread unit, PK entry, lesson record) provides. */
interface UnitMetadataSource {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly subject: string;
  readonly keyStage: string;
  readonly year: number | undefined;
}

/**
 * Ensures (creating on first sight from the source's metadata) the
 * accumulator for a unit. Sources are visited threads-first, then
 * prior-knowledge, then lesson placements; first-seen metadata wins.
 */
function ensureUnit(
  byUnit: Map<string, UnitAccumulator>,
  unit: UnitMetadataSource,
): UnitAccumulator {
  const existing = byUnit.get(unit.unitSlug);
  if (existing) {
    return existing;
  }
  const created: UnitAccumulator = {
    unitSlug: unit.unitSlug,
    unitTitle: unit.unitTitle,
    subject: unit.subject,
    keyStage: unit.keyStage,
    year: unit.year,
    priorKnowledge: [],
    threadSlugs: [],
  };
  byUnit.set(unit.unitSlug, created);
  return created;
}

/**
 * Builds the unit node set: thread units ∪ prior-knowledge units ∪
 * lesson-hosting units (the G1a integrity rule — a unit that exists in the
 * bulk source is emitted rather than leaving a dangling placement edge).
 * Sorted by unit slug; threadSlugs AND priorKnowledge sorted per node for
 * order-independence (the bulk file enumeration is unsorted, and a stable
 * sort by unitSlug alone preserves encounter order within one unit).
 */
export function buildUnitNodes(
  priorKnowledge: readonly ExtractedPriorKnowledge[],
  threads: readonly ExtractedThread[],
  lessons: readonly ExtractedLesson[],
): readonly GraphCorpusUnitNode[] {
  const byUnit = new Map<string, UnitAccumulator>();
  for (const thread of [...threads].sort((a, b) => a.slug.localeCompare(b.slug))) {
    for (const unit of thread.units) {
      const node = ensureUnit(byUnit, unit);
      if (!node.threadSlugs.includes(thread.slug)) {
        node.threadSlugs.push(thread.slug);
      }
    }
  }
  for (const pk of [...priorKnowledge].sort((a, b) => a.unitSlug.localeCompare(b.unitSlug))) {
    ensureUnit(byUnit, pk).priorKnowledge.push(pk.requirement);
  }
  for (const lesson of lessons) {
    ensureUnit(byUnit, { ...lesson, year: undefined });
  }
  return [...byUnit.values()]
    .sort((a, b) => a.unitSlug.localeCompare(b.unitSlug))
    .map((node) => ({
      ...node,
      threadSlugs: [...node.threadSlugs].sort((a, b) => a.localeCompare(b)),
      priorKnowledge: [...node.priorKnowledge].sort((a, b) => a.localeCompare(b)),
      kind: 'unit' as const,
      id: unitNodeId(node.unitSlug),
    }));
}

/** Builds the thread node set, slug-sorted. */
export function buildThreadNodes(
  threads: readonly ExtractedThread[],
): readonly GraphCorpusThreadNode[] {
  return [...threads]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((thread) => ({
      kind: 'thread' as const,
      id: threadNodeId(thread.slug),
      threadSlug: thread.slug,
      title: thread.title,
      firstYear: thread.firstYear,
      lastYear: thread.lastYear,
    }));
}

/** Builds the lesson node set, deduplicated by slug (first-seen metadata), slug-sorted. */
export function buildLessonNodes(
  lessons: readonly ExtractedLesson[],
): readonly GraphCorpusLessonNode[] {
  const bySlug = new Map<string, ExtractedLesson>();
  for (const lesson of [...lessons].sort((a, b) => a.lessonSlug.localeCompare(b.lessonSlug))) {
    if (!bySlug.has(lesson.lessonSlug)) {
      bySlug.set(lesson.lessonSlug, lesson);
    }
  }
  return [...bySlug.values()].map((lesson) => ({
    kind: 'lesson' as const,
    id: lessonNodeId(lesson.lessonSlug),
    lessonSlug: lesson.lessonSlug,
    lessonTitle: lesson.lessonTitle,
    subject: lesson.subject,
    keyStage: lesson.keyStage,
  }));
}
