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
} from '../types/oak';
import type { Result } from '@oaknational/result';
import type { SdkFetchError } from '@oaknational/oak-curriculum-sdk';

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
export type GetSequenceUnitsFn = (sequenceSlug: string) => Promise<Result<unknown, SdkFetchError>>;

/** Fetches lessons by key stage and subject with pagination. Returns Result per ADR-088. */
export type GetLessonsByKeyStageAndSubjectFn = (
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
  options?: LessonsPaginationOptions,
) => Promise<Result<readonly LessonGroupResponse[], SdkFetchError>>;

// NOTE: OakClient interface is defined in oak-adapter.ts
// It includes all the above function types plus cache management methods.
