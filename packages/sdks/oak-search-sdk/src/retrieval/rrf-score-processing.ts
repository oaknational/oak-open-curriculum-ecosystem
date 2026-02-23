/**
 * Post-RRF score processing — normalisation, filtering, and clamping utilities.
 *
 * These functions operate on the RRF-scored hits AFTER Elasticsearch returns
 * them, adjusting scores for fairness (transcript normalisation) and removing
 * low-quality matches (score filtering).
 *
 * @see rrf-query-builders.ts for the query construction side
 * @see rrf-query-helpers.ts for filter builders and highlight configs
 */

import type { SearchLessonsIndexDoc } from '@oaknational/curriculum-sdk/public/search.js';
import type { EsHit } from '../internal/types.js';

// ---------------------------------------------------------------------------
// Score normalisation
// ---------------------------------------------------------------------------

/** Hit with normalised score for transcript availability (ADR-099). */
export interface NormalisedHit {
  readonly _id: string;
  readonly _score: number;
  readonly _source: SearchLessonsIndexDoc;
  readonly _highlight?: Readonly<Record<string, readonly string[]>>;
}

/**
 * Normalise RRF scores for transcript availability (ADR-099).
 *
 * Lessons WITHOUT a transcript are UP-WEIGHTED by factor 2 to compensate
 * for their absence from transcript-based retrievers. In 4-way RRF,
 * transcript lessons can appear in all 4 retrievers (BM25/ELSER on both
 * content and structure), while non-transcript lessons can only appear
 * in the 2 structure retrievers. The 2x multiplier ensures fair comparison
 * by normalising scores to what a non-transcript lesson WOULD score if
 * it had appeared in all 4 retrievers at the same ranks.
 *
 * @param hits - Raw ES hits with optional _score
 * @returns Hits with normalised scores, sorted by score descending
 *
 * @see docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md
 */
export function normaliseTranscriptScores(
  hits: readonly EsHit<SearchLessonsIndexDoc>[],
): NormalisedHit[] {
  const mapped = hits.map((hit) => ({
    _id: hit._id,
    _score: hit._score ?? 0,
    _source: hit._source,
    _highlight: hit.highlight,
    has_transcript: hit._source.has_transcript,
  }));

  const normalised = mapped.map((doc) => {
    const factor = doc.has_transcript ? 1 : 2;
    return {
      _id: doc._id,
      _score: doc._score * factor,
      _source: doc._source,
      _highlight: doc._highlight,
    };
  });

  return normalised.sort((a, b) => b._score - a._score);
}

// ---------------------------------------------------------------------------
// Score filtering
// ---------------------------------------------------------------------------

/** Any hit-like object with a numeric score. */
interface ScoredHit {
  readonly _score: number;
}

/**
 * Filter hits by a minimum score threshold (inclusive).
 *
 * Addresses the "volume problem" where ES returns thousands of results
 * for short queries by discarding hits below a meaningful score.
 * Generic over hit type so it works for lessons, units, and any future scope.
 */
export function filterByMinScore<T extends ScoredHit>(hits: readonly T[], minScore: number): T[] {
  return hits.filter((hit) => hit._score >= minScore);
}

/**
 * Default minimum score threshold for post-RRF filtering.
 *
 * With rank_constant=60 and 4-way RRF, a transcript-having document
 * ranked #1 in 2 of 4 retrievers scores 2/61 = 0.033. A threshold
 * of 0.04 would filter out such results. The value 0.02 requires
 * a document to appear in at least 2 retrievers at reasonable positions,
 * filtering out the ELSER-only near-zero tail without losing legitimate
 * 2-retriever matches.
 *
 * @see rrf-query-builders.ts `buildFourWayRetriever` — the `rank_constant`
 *   (currently 60) is mathematically coupled to this threshold. If
 *   `rank_constant` changes, this value must be recalibrated.
 */
export const DEFAULT_MIN_SCORE = 0.02;

// ---------------------------------------------------------------------------
// Clamping utilities
// ---------------------------------------------------------------------------

/** Clamp size to valid range [1, 100], default 25. */
export function clampSize(size: number | undefined): number {
  const n = typeof size === 'number' && Number.isFinite(size) ? size : 25;
  return Math.min(Math.max(n, 1), 100);
}

/** Clamp pagination offset to non-negative, default 0. */
export function clampFrom(from: number | undefined): number {
  return typeof from === 'number' && Number.isFinite(from) && from >= 0 ? from : 0;
}
