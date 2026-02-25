/**
 * Type definitions for the SDK-backed search tool.
 *
 * Defines the search scopes (all four ES indexes plus suggest) and the
 * validated argument types. Types for subject and key stage flow from
 * the generated path-parameters to preserve schema-first discipline.
 */

import type { KeyStage, Subject } from '@oaknational/sdk-codegen/api-schema';
import type {
  LessonsSearchResult,
  UnitsSearchResult,
  ThreadsSearchResult,
  SequencesSearchResult,
  SuggestionResponse,
} from '../search-retrieval-types.js';

/**
 * All search scopes exposed through the SDK-backed search tool.
 *
 * Each scope maps to a Search SDK retrieval method:
 * - `lessons`   maps to `searchLessons`   (4-way RRF on oak_lessons)
 * - `units`     maps to `searchUnits`     (4-way RRF on oak_unit_rollup)
 * - `threads`   maps to `searchThreads`   (2-way RRF on oak_threads)
 * - `sequences` maps to `searchSequences` (2-way RRF on oak_sequences)
 * - `suggest`   maps to `suggest`         (completion suggester)
 */
export const SEARCH_SCOPES = ['lessons', 'units', 'threads', 'sequences', 'suggest'] as const;

/** Union of all supported search scopes. */
export type SearchSdkScope = (typeof SEARCH_SCOPES)[number];

/**
 * Type guard for SearchSdkScope.
 *
 * @param value - String to check
 * @returns True if the value is a valid search scope
 */
export function isSearchSdkScope(value: string): value is SearchSdkScope {
  const scopes: readonly string[] = SEARCH_SCOPES;
  return scopes.includes(value);
}

/**
 * Validated arguments for the SDK-backed search tool.
 *
 * Flat object with scope discriminator plus optional filters. Scope-specific
 * filters (e.g. `unitSlug` for lessons, `phaseSlug` for sequences) are
 * validated in the handler, not at the Zod level, keeping the schema simple
 * for agents.
 *
 * @remarks
 * KeyStage and Subject are narrowed from string by the validation step.
 * Raw input arrives as strings and is normalised via type guards.
 */
export interface SearchSdkArgs {
  /** The search query text (required, non-empty). */
  readonly text: string;

  /** Which search scope to query (required). */
  readonly scope: SearchSdkScope;

  /** Filter by subject slug. */
  readonly subject?: Subject;

  /** Filter by key stage. */
  readonly keyStage?: KeyStage;

  /** Maximum number of results (1-100, default 25). */
  readonly size?: number;

  /** Pagination offset (default 0). */
  readonly from?: number;

  // -- Lesson-specific filters --

  /** Filter lessons to a specific unit by unit slug. */
  readonly unitSlug?: string;

  /** Filter by tier (foundation/higher). Lessons only. */
  readonly tier?: string;

  /** Filter by exam board. Lessons only. */
  readonly examBoard?: string;

  /** Filter by year group (e.g. '3', '7'). Lessons only. */
  readonly year?: string;

  /** Filter by curriculum thread slug. Lessons only. */
  readonly threadSlug?: string;

  /** Include highlighted text snippets. Lessons and units. */
  readonly highlight?: boolean;

  // -- Unit-specific filters --

  /** Minimum lesson count a unit must have. Units only. */
  readonly minLessons?: number;

  // -- Sequence-specific filters --

  /** Filter sequences by phase slug. Sequences only. */
  readonly phaseSlug?: string;

  /** Filter sequences by category. Sequences only. */
  readonly category?: string;

  // -- Suggest-specific filters --

  /** Maximum number of suggestions (suggest only). */
  readonly limit?: number;
}

// ---------------------------------------------------------------------------
// Dispatch result union — preserves per-scope result types through dispatch
// ---------------------------------------------------------------------------

/**
 * Union of the four scoped search result types.
 *
 * Each member has a literal `scope` field (`'lessons'`, `'units'`,
 * `'threads'`, `'sequences'`) that serves as the discriminant.
 */
export type ScopedSearchResult =
  | LessonsSearchResult
  | UnitsSearchResult
  | ThreadsSearchResult
  | SequencesSearchResult;

/**
 * Compile-time assertion: no member of `ScopedSearchResult` may have a
 * `suggestions` property. The `'suggestions' in result` check in
 * `formatting.ts` relies on this structural invariant to discriminate
 * `SuggestionResponse` from `ScopedSearchResult`.
 *
 * Distributes over the union — checks each member individually.
 * If any member gains `suggestions`, that member becomes `never`,
 * causing compile errors at every site that uses `SearchDispatchResult`.
 */
type AssertNoSuggestions<T> = T extends { suggestions: unknown } ? never : T;
type VerifiedScopedSearchResult = AssertNoSuggestions<ScopedSearchResult>;

/**
 * Union of all possible search dispatch results.
 *
 * Returned by `dispatchByScope` and consumed by `formatSearchResults`.
 * Uses `VerifiedScopedSearchResult` to enforce the discrimination invariant:
 * if any scoped result type gained a `suggestions` property, that member
 * would resolve to `never`, causing compile errors at dispatch sites.
 *
 * Discriminate using `'suggestions' in result`:
 * - `true`  narrows to `SuggestionResponse`
 * - `false` narrows to `VerifiedScopedSearchResult` (further narrowable via `scope`)
 */
export type SearchDispatchResult = VerifiedScopedSearchResult | SuggestionResponse;
