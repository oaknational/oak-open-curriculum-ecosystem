/**
 * Kind-qualified node identity for the graph corpus — the id vocabulary and
 * its mints.
 *
 * @remarks
 * The corpus's foundation module: node ids are minted at generation from
 * `(kind, source key)` and every other corpus shape is expressed in terms of
 * them. It is deliberately the bottom of the generator's import graph — it
 * imports nothing from its siblings, so the core vocabulary
 * (`graph-corpus-types.ts`) and the ordered projections
 * (`graph-corpus-ordered-sections.ts`) can both depend on identity without
 * depending on each other.
 *
 * The five prefixes are mutually exclusive and none is a prefix of another, so
 * a `startsWith` check is a sound narrowing of {@link GraphCorpusNodeId}.
 */

import { normaliseKeyword } from '../extractors/keyword-extractor.js';

/** A kind-qualified unit node id. */
export type GraphCorpusUnitNodeId = `unit:${string}`;
/** A kind-qualified thread node id. */
export type GraphCorpusThreadNodeId = `thread:${string}`;
/** A kind-qualified lesson node id. */
export type GraphCorpusLessonNodeId = `lesson:${string}`;
/** A kind-qualified misconception node id (content-hash mint). */
export type GraphCorpusMisconceptionNodeId = `misconception:${string}`;
/** A kind-qualified keyword node id (normalised-term mint, lc+trim). */
export type GraphCorpusKeywordNodeId = `keyword:${string}`;

/** A kind-qualified graph-corpus node id. */
export type GraphCorpusNodeId =
  | GraphCorpusUnitNodeId
  | GraphCorpusThreadNodeId
  | GraphCorpusLessonNodeId
  | GraphCorpusMisconceptionNodeId
  | GraphCorpusKeywordNodeId;

/** Mints the kind-qualified id for a unit node. */
export function unitNodeId(unitSlug: string): GraphCorpusUnitNodeId {
  return `unit:${unitSlug}`;
}

/** Mints the kind-qualified id for a thread node. */
export function threadNodeId(threadSlug: string): GraphCorpusThreadNodeId {
  return `thread:${threadSlug}`;
}

/** Mints the kind-qualified id for a lesson node. */
export function lessonNodeId(lessonSlug: string): GraphCorpusLessonNodeId {
  return `lesson:${lessonSlug}`;
}

/**
 * Mints the kind-qualified id for a keyword node from the term.
 *
 * @remarks
 * Normalises internally (lc+trim via {@link normaliseKeyword}), so the mint
 * is stable for raw and already-normalised inputs alike.
 */
export function keywordNodeId(term: string): GraphCorpusKeywordNodeId {
  return `keyword:${normaliseKeyword(term)}`;
}
