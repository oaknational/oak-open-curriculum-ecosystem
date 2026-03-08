/**
 * Retrieval service parameter types — per-scope search and suggestion params.
 *
 * Types that flow from the SDK codegen schema (`SearchSubjectSlug`,
 * `KeyStage`, `SearchScope`) are imported, not redefined.
 */

import type { KeyStage } from '@oaknational/sdk-codegen';
import type { SearchScope, SearchSubjectSlug } from '@oaknational/sdk-codegen/search';

/**
 * Common search parameters shared across all scopes.
 *
 * Every per-scope param type extends this base, ensuring consistent
 * parameter naming and semantics.
 */
export interface SearchParamsBase {
  /** The search query. Must be non-empty. */
  readonly query: string;

  /** Filter by subject slug. */
  readonly subject?: SearchSubjectSlug;

  /** Filter by key stage. */
  readonly keyStage?: KeyStage;

  /** Maximum number of results to return. Clamped to 1–100. Defaults to 25. */
  readonly size?: number;

  /** Offset for pagination. Defaults to 0. */
  readonly from?: number;
}

/**
 * Parameters for searching lessons.
 *
 * Supports all base params plus lesson-specific filters for KS4
 * options, unit filtering, and curriculum thread filtering.
 *
 * @example
 * ```typescript
 * sdk.retrieval.searchLessons({
 *   query: 'expanding brackets',
 *   subject: 'maths',
 *   keyStage: 'ks3',
 *   size: 10,
 * });
 * ```
 */
export interface SearchLessonsParams extends SearchParamsBase {
  /** Whether to include highlighted snippets in results. Defaults to `true`. */
  readonly highlight?: boolean;

  /** Filter lessons to a specific unit by unit slug. */
  readonly unitSlug?: string;

  /** Filter by tier (foundation/higher). */
  readonly tier?: string;

  /** Filter by exam board (aqa/edexcel/ocr/etc). */
  readonly examBoard?: string;

  /** Filter by exam subject (biology/chemistry/physics). */
  readonly examSubject?: string;

  /** Filter by KS4 option programme slug. */
  readonly ks4Option?: string;

  /** Filter by year group. */
  readonly year?: string;

  /** Filter by curriculum thread slug. */
  readonly threadSlug?: string;
}

/**
 * Parameters for searching units.
 *
 * @example
 * ```typescript
 * sdk.retrieval.searchUnits({
 *   query: 'fractions',
 *   subject: 'maths',
 *   keyStage: 'ks2',
 * });
 * ```
 */
export interface SearchUnitsParams extends SearchParamsBase {
  /** Whether to include highlighted snippets in results. Defaults to `true`. */
  readonly highlight?: boolean;

  /** Minimum number of lessons a unit must contain to be included. */
  readonly minLessons?: number;
}

/**
 * Parameters for searching sequences (API data structures for curriculum retrieval).
 *
 * Sequences are not the same as programmes (user-facing pathways).
 * One sequence can generate many programme views.
 *
 * @example
 * ```typescript
 * sdk.retrieval.searchSequences({
 *   query: 'secondary maths',
 *   phaseSlug: 'secondary',
 * });
 * ```
 */
export interface SearchSequencesParams extends SearchParamsBase {
  /** Filter by phase slug. */
  readonly phaseSlug?: string;

  /** Filter by category. */
  readonly category?: string;

  /** Whether to include facet data alongside results. */
  readonly includeFacets?: boolean;
}

/**
 * Parameters for type-ahead suggestion queries.
 */
export interface SuggestParams {
  /** The prefix text typed by the user. */
  readonly prefix: string;

  /** Which search scope to suggest within. */
  readonly scope: SearchScope;

  /** Filter suggestions by subject. */
  readonly subject?: SearchSubjectSlug;

  /** Filter suggestions by key stage. */
  readonly keyStage?: KeyStage;

  /** Filter suggestions by phase. */
  readonly phaseSlug?: string;

  /** Maximum number of suggestions to return. */
  readonly limit?: number;
}

/**
 * Parameters for fetching sequence facets.
 */
export interface FacetParams {
  /** Filter facets by subject. */
  readonly subject?: SearchSubjectSlug;

  /** Filter facets by key stage. */
  readonly keyStage?: KeyStage;
}
