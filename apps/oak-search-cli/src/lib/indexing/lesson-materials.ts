/**
 * Lesson material fetching for bulk indexing operations.
 *
 * Handles fetching lesson transcripts and summaries. Uses video availability
 * information to skip unnecessary transcript fetches when lessons are known
 * to have no video content.
 *
 * ## Transcript Fetch Optimization
 *
 * When `FetchContext.hasVideo` is explicitly `false` (from bulk assets check),
 * transcript fetch is skipped entirely, avoiding 404 errors for lessons
 * known to lack video content.
 *
 * | hasVideo Value | Behavior |
 * |----------------|----------|
 * | `true` | Fetch transcript from API |
 * | `undefined` | Fetch transcript (backwards compatible) |
 * | `false` | Skip transcript fetch, return empty string |
 *
 * All SDK methods return Result<T, SdkFetchError> per ADR-088.
 *
 * @see ADR-088 Result Pattern for Explicit Error Handling
 * @see ADR-091 Video Availability Detection Strategy
 * @see ADR-092 Transcript Cache Categorization Strategy
 */

import type { KeyStage, SearchLessonSummary, SearchSubjectSlug } from '../../types/oak';
import { isLessonSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter';
import type { IngestionContext } from './ingestion-error-types';
import { formatSdkError, isRecoverableError } from '@oaknational/curriculum-sdk';
import { getIngestionErrorCollector } from './ingestion-error-collector';
import { ingestLogger } from '../logger';

/**
 * Context for error tracking and optimization during lesson material fetch.
 *
 * Provides curriculum context for error logging and controls transcript
 * fetch behavior based on video availability information.
 *
 * @see ADR-091 Video Availability Detection Strategy
 */
export interface FetchContext {
  /** Key stage for error context (e.g., 'ks2', 'ks3'). */
  readonly keyStage?: KeyStage;
  /** Subject slug for error context (e.g., 'maths', 'science'). */
  readonly subject?: SearchSubjectSlug;
  /** Unit slug for error context. */
  readonly unitSlug?: string;
  /**
   * Whether this lesson has a video (from bulk assets endpoint).
   *
   * This is a tri-state value from the video availability check:
   * - `true`: Lesson has video, fetch transcript
   * - `false`: Lesson has no video, skip transcript fetch
   * - `undefined`: Unknown (not in assets response), fetch transcript
   *
   * When `false`, transcript fetch is skipped entirely to avoid 404 errors.
   * The cache will record this as `{ status: 'no_video' }`.
   *
   * @see ADR-091 Video Availability Detection Strategy
   * @see ADR-092 Transcript Cache Categorization Strategy
   */
  readonly hasVideo?: boolean;
}

/**
 * Fetch lesson materials (transcript + summary) for indexing.
 *
 * Returns null if lesson summary is unavailable or on unrecoverable error.
 * This allows the ingestion pipeline to skip problematic lessons gracefully.
 *
 * ## Video Availability Optimization
 *
 * If `context.hasVideo` is explicitly `false`, transcript fetch is skipped
 * entirely and an empty string is returned. This prevents 404 errors for
 * lessons known to lack video content (determined from bulk assets check).
 *
 * ## Error Handling
 *
 * | Error Type | Transcript | Summary |
 * |------------|------------|---------|
 * | 404 Not Found | Empty string | Return null (skip) |
 * | Network Error | Empty string | Return null (skip) |
 * | Server Error | Empty string | Return null (skip) |
 * | Validation Error | Throw | Throw |
 *
 * @param client - Oak API client
 * @param lessonSlug - Lesson identifier
 * @param context - Optional fetch context with video availability info
 * @returns Transcript and summary, or null if summary unavailable
 *
 * @see ADR-091 Video Availability Detection Strategy
 * @see ADR-092 Transcript Cache Categorization Strategy
 */
export async function fetchLessonMaterials(
  client: OakClient,
  lessonSlug: string,
  context?: FetchContext,
): Promise<{ transcript: string; summary: SearchLessonSummary } | null> {
  const errorContext = buildErrorContext(lessonSlug, context);

  // If we know the lesson has no video, skip transcript fetch entirely
  const shouldFetchTranscript = context?.hasVideo !== false;

  if (!shouldFetchTranscript) {
    ingestLogger.debug(`Skipping transcript fetch for ${lessonSlug} (no video)`, {
      keyStage: context?.keyStage,
      subject: context?.subject,
    });
  }

  // Fetch transcript conditionally, summary always
  const [transcriptResult, summaryResult] = await Promise.all([
    shouldFetchTranscript
      ? client.getLessonTranscript(lessonSlug)
      : Promise.resolve({ ok: true, value: { transcript: '', vtt: '' } } as const),
    client.getLessonSummary(lessonSlug),
  ]);

  // Handle transcript - default to empty on recoverable errors
  const transcript = handleTranscriptResult(transcriptResult, lessonSlug, errorContext);
  if (transcript === null) {
    return null; // Non-recoverable error
  }

  // Handle summary - required
  const summary = handleSummaryResult(summaryResult, lessonSlug, errorContext);
  if (summary === null) {
    return null;
  }

  return { transcript, summary };
}

/** Build error context from fetch context and lesson slug. */
function buildErrorContext(lessonSlug: string, context?: FetchContext): IngestionContext {
  return {
    lessonSlug,
    keyStage: context?.keyStage,
    subject: context?.subject,
    unitSlug: context?.unitSlug,
  };
}

/**
 * Check if an error should be treated as recoverable during ingestion.
 * This is broader than SDK's isRecoverableError - we also treat network errors
 * as recoverable since they are transient and shouldn't crash the entire ingestion.
 */
function isIngestionRecoverableError(error: Parameters<typeof isRecoverableError>[0]): boolean {
  return isRecoverableError(error) || error.kind === 'network_error';
}

/** Handles transcript fetch result. Returns empty string on recoverable error, null on throw. */
function handleTranscriptResult(
  result:
    | { ok: true; value: { transcript: string } }
    | { ok: false; error: Parameters<typeof isRecoverableError>[0] },
  lessonSlug: string,
  errorContext: IngestionContext,
): string | null {
  if (result.ok) {
    return result.value.transcript;
  }

  const error = result.error;

  // Treat transcripts as optional - network errors and other recoverable errors
  // should not crash the ingestion, just skip the transcript
  if (isIngestionRecoverableError(error)) {
    ingestLogger.debug(`Transcript unavailable for ${lessonSlug}`, {
      errorDetail: formatSdkError(error),
    });
    if (error.kind === 'network_error') {
      getIngestionErrorCollector().recordError(
        `Network error fetching transcript: ${lessonSlug}`,
        errorContext,
      );
    }
    return '';
  }

  // Non-recoverable (e.g., validation errors) - propagate
  getIngestionErrorCollector().recordError(formatSdkError(error), errorContext);
  throw new Error(formatSdkError(error));
}

/** Handles summary fetch result. Returns null on recoverable skip, throws on non-recoverable. */
function handleSummaryResult(
  result:
    | { ok: true; value: unknown }
    | { ok: false; error: Parameters<typeof isRecoverableError>[0] },
  lessonSlug: string,
  errorContext: IngestionContext,
): SearchLessonSummary | null {
  if (!result.ok) {
    const error = result.error;

    // Treat all ingestion-recoverable errors the same - skip this lesson
    if (isIngestionRecoverableError(error)) {
      if (error.kind === 'not_found' || error.kind === 'legally_restricted') {
        getIngestionErrorCollector().record404(errorContext, 'getLessonSummary');
      } else if (error.kind === 'network_error') {
        getIngestionErrorCollector().recordError(
          `Network error fetching summary: ${lessonSlug}`,
          errorContext,
        );
      } else {
        getIngestionErrorCollector().record500Error(errorContext, 'getLessonSummary');
      }
      ingestLogger.warn(`Lesson summary unavailable - skipping ${lessonSlug}`, {
        errorDetail: formatSdkError(error),
      });
      return null;
    }

    // Non-recoverable (e.g., validation errors) - propagate
    getIngestionErrorCollector().recordError(formatSdkError(error), errorContext);
    throw new Error(formatSdkError(error));
  }

  // Validate shape
  if (!isLessonSummary(result.value)) {
    ingestLogger.error('Unexpected lesson summary response shape', {
      lessonSlug,
      unit: errorContext.unitSlug,
    });
    getIngestionErrorCollector().recordError(
      `Unexpected lesson summary response for ${lessonSlug}`,
      errorContext,
    );
    return null;
  }

  return result.value;
}
