/**
 * RRF Score Normalisation for Transcript Availability.
 *
 * Documents without transcripts can only appear in 2 of 4 RRF retrievers
 * (structure-only). This module provides score normalisation to ensure
 * fair ranking regardless of transcript availability.
 *
 * ## The Problem
 *
 * The 4-way RRF combines:
 * 1. BM25 on content (requires transcript)
 * 2. ELSER on content (requires transcript)
 * 3. BM25 on structure (always available)
 * 4. ELSER on structure (always available)
 *
 * With RRF formula `score = Σ 1/(k + rank_i)` and k=60:
 * - Document with transcript at rank #1 in all 4: score = 4 × 1/61 ≈ 0.066
 * - Document without transcript at rank #1 in both 2: score = 2 × 1/61 ≈ 0.033
 *
 * This 50% penalty is architecturally wrong. Metadata-only is the baseline;
 * transcripts are a bonus.
 *
 * ## The Fix
 *
 * Normalise scores by multiplying by `TOTAL_RETRIEVERS / applicableRetrievers`.
 * For transcript-less documents: 4/2 = 2x multiplier.
 *
 * @see ADR-094 has_transcript field
 * @see ADR-095 Missing transcript handling
 * @see ADR-099 Transcript-aware RRF normalisation
 * @packageDocumentation
 */

/**
 * Minimum shape required for RRF result normalisation.
 *
 * Extends to allow additional `_source` fields to pass through.
 */
export interface RrfResultWithTranscript {
  readonly _id: string;
  readonly _score: number;
  readonly _source: {
    readonly has_transcript: boolean;
  };
}

/**
 * Number of retrievers in the 4-way RRF architecture.
 * @internal
 */
const TOTAL_RETRIEVERS = 4;

/**
 * Number of retrievers applicable to documents without transcripts.
 * These documents can only match structure-based retrievers.
 * @internal
 */
const STRUCTURE_ONLY_RETRIEVERS = 2;

/**
 * Normalises RRF scores to account for transcript availability.
 *
 * Documents without transcripts can only appear in 2 of 4 retrievers
 * (structure-only). This function normalises scores so that a document
 * ranking #1 in all APPLICABLE retrievers gets the same normalised score,
 * regardless of how many retrievers apply to it.
 *
 * The function:
 * 1. Multiplies transcript-less document scores by 2 (4/2 normalisation factor)
 * 2. Leaves transcript-having document scores unchanged (4/4 = 1x factor)
 * 3. Re-sorts results by normalised score (descending, stable)
 *
 * @param results - RRF search results with `has_transcript` in `_source`
 * @returns New array with normalised `_score` values, sorted by normalised score
 *
 * @example Basic usage
 * ```typescript
 * const results = [
 *   { _id: '1', _score: 0.066, _source: { has_transcript: true } },
 *   { _id: '2', _score: 0.033, _source: { has_transcript: false } },
 * ];
 * const normalised = normaliseRrfScores(results);
 * // normalised[0]._score === 0.066 (unchanged)
 * // normalised[1]._score === 0.066 (doubled)
 * ```
 *
 * @example Re-sorting after normalisation
 * ```typescript
 * const results = [
 *   { _id: 'with', _score: 0.050, _source: { has_transcript: true } },
 *   { _id: 'without', _score: 0.030, _source: { has_transcript: false } },
 * ];
 * const normalised = normaliseRrfScores(results);
 * // Before: with (0.050) > without (0.030)
 * // After:  without (0.060) > with (0.050)
 * // normalised[0]._id === 'without'
 * ```
 *
 * @remarks
 * - This function is pure: it does not mutate inputs
 * - Sorting is stable: equal normalised scores preserve original order
 * - Additional `_source` fields are preserved in output
 *
 * @see ADR-099 for architectural rationale
 */
export function normaliseRrfScores<T extends RrfResultWithTranscript>(results: readonly T[]): T[] {
  if (results.length === 0) {
    return [];
  }

  // Create new objects with normalised scores
  const normalised = results.map((doc) => {
    const applicableRetrievers = doc._source.has_transcript
      ? TOTAL_RETRIEVERS
      : STRUCTURE_ONLY_RETRIEVERS;
    const normalisationFactor = TOTAL_RETRIEVERS / applicableRetrievers;

    return {
      ...doc,
      _score: doc._score * normalisationFactor,
    };
  });

  // Sort by normalised score descending (stable sort preserves order for equal scores)
  return normalised.sort((a, b) => b._score - a._score);
}
