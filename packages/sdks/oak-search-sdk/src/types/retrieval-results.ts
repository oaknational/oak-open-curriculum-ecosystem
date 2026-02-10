/**
 * Retrieval service result types — search results, suggestions, and metadata.
 *
 * Index document types (`SearchLessonsIndexDoc`, etc.) flow from the
 * Curriculum SDK and are imported, not redefined.
 *
 * @packageDocumentation
 */

import type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchSequenceIndexDoc,
  SearchFacets,
  SearchSuggestionItem,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

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

/** A single sequence result from a search query. */
export interface SequenceResult {
  /** Elasticsearch document ID. */
  readonly id: string;

  /** RRF rank score from Elasticsearch. */
  readonly rankScore: number;

  /** The sequence index document. */
  readonly sequence: SearchSequenceIndexDoc;
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

/** Result of a sequences search. */
export interface SequencesSearchResult extends SearchResultMeta {
  readonly scope: 'sequences';
  readonly results: readonly SequenceResult[];
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
