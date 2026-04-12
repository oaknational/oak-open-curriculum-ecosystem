/**
 * Oak SDK Adapter Type Definitions
 *
 * All SDK methods return `Result<T, SdkFetchError>` per ADR-088.
 *
 * @remarks
 * See `docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md`
 * for the full architectural decision record.
 */

import type {
  KeyStage,
  SearchLessonSummary,
  SearchSubjectSlug,
  SearchSubjectSequences,
  SearchUnitSummary,
  SequenceUnitsResponse,
} from '../types/oak';
import type { Result } from '@oaknational/result';
import type { SdkFetchError, createOakBaseClient } from '@oaknational/curriculum-sdk';

// ============================================================================
// Data Types
// ============================================================================

/** Unit listing entry. */
export interface UnitListEntry {
  readonly unitSlug: string;
  readonly unitTitle: string;
}

/** Transcript response shape. */
export interface TranscriptResponse {
  readonly transcript: string;
  readonly vtt: string;
}

/** Lesson group as returned by the lessons endpoint. */
export interface LessonGroupResponse {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly lessons: readonly { lessonSlug: string; lessonTitle: string }[];
}

/** Pagination options for the lessons endpoint. */
export interface LessonsPaginationOptions {
  readonly limit?: number;
  readonly offset?: number;
  readonly unit?: string;
}

/** Subject sequence entry type. */
export type SubjectSequenceEntry = SearchSubjectSequences[number];

/**
 * Asset entry from subject assets endpoint.
 * Used to determine video availability for lessons.
 */
export interface SubjectAssetEntry {
  readonly lessonSlug: string;
  readonly lessonTitle: string;
  readonly assets: readonly {
    readonly type: string;
    readonly label: string;
    readonly url: string;
  }[];
}

// ============================================================================
// Function Types - All return Result<T, SdkFetchError> per ADR-088
// ============================================================================

/** Fetches units by key stage and subject. Returns Result per ADR-088. */
export type GetUnitsFn = (
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
) => Promise<Result<readonly UnitListEntry[], SdkFetchError>>;

/** Fetches a lesson transcript. Returns Result per ADR-088. */
export type GetTranscriptFn = (
  lessonSlug: string,
) => Promise<Result<TranscriptResponse, SdkFetchError>>;

/** Fetches a lesson summary. Returns Result per ADR-088. */
export type GetLessonSummaryFn = (
  lessonSlug: string,
) => Promise<Result<SearchLessonSummary, SdkFetchError>>;

/** Fetches a unit summary. Returns Result per ADR-088. */
export type GetUnitSummaryFn = (
  unitSlug: string,
) => Promise<Result<SearchUnitSummary, SdkFetchError>>;

/** Fetches subject sequences. Returns Result per ADR-088. */
export type GetSubjectSequencesFn = (
  subject: SearchSubjectSlug,
) => Promise<Result<SearchSubjectSequences, SdkFetchError>>;

/** Fetches units in a sequence. Returns Result per ADR-088. */
export type GetSequenceUnitsFn = (
  sequenceSlug: string,
) => Promise<Result<SequenceUnitsResponse, SdkFetchError>>;

/** Fetches lessons by key stage and subject with pagination. Returns Result per ADR-088. */
export type GetLessonsByKeyStageAndSubjectFn = (
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
  options?: LessonsPaginationOptions,
) => Promise<Result<readonly LessonGroupResponse[], SdkFetchError>>;

/**
 * Fetches all assets for a subject/keystage.
 * Used to determine video availability before fetching transcripts.
 * Returns Result per ADR-088.
 */
export type GetSubjectAssetsFn = (
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
) => Promise<Result<readonly SubjectAssetEntry[], SdkFetchError>>;

// ---------------------------------------------------------------------------
// OakClient and CacheStats — moved here to break the circular dependency
// between oak-adapter.ts and sdk-client-factory.ts.
// ---------------------------------------------------------------------------

import type { makeGetAllThreads, makeGetThreadUnits } from './oak-adapter-threads';

/** Statistics about cache usage during the current session. */
export interface CacheStats {
  readonly hits: number;
  readonly misses: number;
  readonly connected: boolean;
}

/**
 * Oak client interface - unified API for curriculum data access.
 *
 * All methods return `Result<T, SdkFetchError>` per ADR-088.
 * Cache management methods are always present (no-op when caching disabled).
 */
export interface OakClient {
  getUnitsByKeyStageAndSubject: GetUnitsFn;
  getLessonTranscript: GetTranscriptFn;
  getLessonSummary: GetLessonSummaryFn;
  getUnitSummary: GetUnitSummaryFn;
  getSubjectSequences: GetSubjectSequencesFn;
  getSequenceUnits: GetSequenceUnitsFn;
  getAllThreads: ReturnType<typeof makeGetAllThreads>;
  getThreadUnits: ReturnType<typeof makeGetThreadUnits>;
  getLessonsByKeyStageAndSubject: GetLessonsByKeyStageAndSubjectFn;
  /** Fetches all assets for a subject/keystage. Used for video availability check. */
  getSubjectAssets: GetSubjectAssetsFn;
  rateLimitTracker: ReturnType<typeof createOakBaseClient>['rateLimitTracker'];
  getCacheStats: () => CacheStats;
  disconnect: () => Promise<void>;
}
