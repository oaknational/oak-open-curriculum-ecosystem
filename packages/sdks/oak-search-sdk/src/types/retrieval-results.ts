/**
 * Retrieval service result types — search results, suggestions, errors, and metadata.
 *
 * Index document types (`SearchLessonsIndexDoc`, etc.) flow from the
 * Curriculum SDK and are imported, not redefined.
 */

import type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchSequenceIndexDoc,
  SearchThreadIndexDoc,
  SearchFacets,
  SearchSuggestionItem,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

// ---------------------------------------------------------------------------
// Retrieval error type
// ---------------------------------------------------------------------------

/**
 * Error type for retrieval service operations.
 *
 * Uses a discriminated union on the `type` field for exhaustive matching.
 * Consumers inspect `result.ok` and then narrow via `error.type`.
 *
 * @example
 * ```typescript
 * const result = await sdk.retrieval.searchLessons({ text: 'fractions' });
 * if (!result.ok) {
 *   switch (result.error.type) {
 *     case 'es_error':
 *       console.error(`ES error (${result.error.statusCode}): ${result.error.message}`);
 *       break;
 *     case 'timeout':
 *       console.error('Query timed out');
 *       break;
 *     case 'validation_error':
 *       console.error(`Invalid input: ${result.error.message}`);
 *       break;
 *     case 'unknown':
 *       console.error(`Unexpected: ${result.error.message}`);
 *       break;
 *   }
 * }
 * ```
 */
export type RetrievalError =
  | {
      /** An Elasticsearch communication or transport error. */
      readonly type: 'es_error';
      /** Human-readable description of the ES error. */
      readonly message: string;
      /** HTTP status code from Elasticsearch, when available. */
      readonly statusCode?: number;
    }
  | {
      /** The Elasticsearch query exceeded the timeout threshold. */
      readonly type: 'timeout';
      /** Human-readable description of the timeout. */
      readonly message: string;
    }
  | {
      /** The input parameters failed validation before reaching Elasticsearch. */
      readonly type: 'validation_error';
      /** Human-readable description of what was invalid. */
      readonly message: string;
    }
  | {
      /** An error that does not fit the other categories. */
      readonly type: 'unknown';
      /** Human-readable description of the unexpected error. */
      readonly message: string;
    };

/** A single lesson result from a search query. */
export interface LessonResult {
  /** Elasticsearch document ID. */
  readonly id: string;

  /** RRF rank score from Elasticsearch. */
  readonly rankScore: number;

  /** The lesson index document. */
  readonly lesson: SearchLessonsIndexDoc;

  /** Highlighted text snippets from matching fields. */
  readonly highlights: readonly string[];
}

/** A single unit result from a search query. */
export interface UnitResult {
  /** Elasticsearch document ID. */
  readonly id: string;

  /** RRF rank score from Elasticsearch. */
  readonly rankScore: number;

  /** The unit index document, or null if the source was unavailable. */
  readonly unit: SearchUnitsIndexDoc | null;

  /** Highlighted text snippets from matching fields. */
  readonly highlights: readonly string[];
}

/** A single sequence result from a search query. Sequences are API data structures for curriculum retrieval. */
export interface SequenceResult {
  /** Elasticsearch document ID. */
  readonly id: string;

  /** RRF rank score from Elasticsearch. */
  readonly rankScore: number;

  /** The sequence index document. */
  readonly sequence: SearchSequenceIndexDoc;
}

/**
 * A single thread result from a search query.
 *
 * Threads are conceptual progression strands that connect units across
 * years, showing how ideas build over time. They are programme-agnostic.
 */
export interface ThreadResult {
  /** Elasticsearch document ID. */
  readonly id: string;

  /** RRF rank score from Elasticsearch. */
  readonly rankScore: number;

  /** The thread index document. */
  readonly thread: SearchThreadIndexDoc;
}

/** Metadata common to all search results. */
export interface SearchResultMeta {
  /** Total number of matching documents. */
  readonly total: number;

  /** Time taken by Elasticsearch (milliseconds). */
  readonly took: number;

  /** Whether the query timed out. */
  readonly timedOut: boolean;

  /** Facet data, when requested. */
  readonly facets?: SearchFacets;
}

/** Result of a lessons search. */
export interface LessonsSearchResult extends SearchResultMeta {
  readonly scope: 'lessons';
  readonly results: readonly LessonResult[];
}

/** Result of a units search. */
export interface UnitsSearchResult extends SearchResultMeta {
  readonly scope: 'units';
  readonly results: readonly UnitResult[];
}

/** Result of a sequences search. Sequences are API data structures, not user-facing programmes. */
export interface SequencesSearchResult extends SearchResultMeta {
  readonly scope: 'sequences';
  readonly results: readonly SequenceResult[];
}

/**
 * Result of a threads search.
 *
 * Threads are conceptual progression strands, not sequences or programmes.
 */
export interface ThreadsSearchResult extends SearchResultMeta {
  readonly scope: 'threads';
  readonly results: readonly ThreadResult[];
}

/** Suggestion response with cache metadata. */
export interface SuggestionResponse {
  /** The suggestion items. */
  readonly suggestions: readonly SearchSuggestionItem[];

  /** Cache metadata for the client. */
  readonly cache: {
    readonly version: string;
    readonly ttlSeconds: number;
  };
}
