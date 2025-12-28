/**
 * Lesson material fetching for bulk indexing operations.
 *
 * Handles fetching lesson transcripts and summaries.
 * All SDK methods return Result<T, SdkFetchError> per ADR-088.
 *
 * @see ADR-088 Result Pattern for Explicit Error Handling
 */

import type { KeyStage, SearchLessonSummary, SearchSubjectSlug } from '../../types/oak';
import { isLessonSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import type { IngestionContext } from './ingestion-error-types';
import { formatSdkError, isRecoverableError } from '@oaknational/oak-curriculum-sdk';
import { getIngestionErrorCollector } from './ingestion-error-collector';
import { ingestLogger } from '../logger';

/** Context for error tracking during lesson material fetch. */
export interface FetchContext {
  readonly keyStage?: KeyStage;
  readonly subject?: SearchSubjectSlug;
  readonly unitSlug?: string;
}

/**
 * Fetch lesson materials (transcript + summary) for indexing.
 * Returns null if lesson summary is unavailable or on unrecoverable error.
 */
export async function fetchLessonMaterials(
  client: OakClient,
  lessonSlug: string,
  context?: FetchContext,
): Promise<{ transcript: string; summary: SearchLessonSummary } | null> {
  const errorContext = buildErrorContext(lessonSlug, context);

  // Fetch both in parallel
  const [transcriptResult, summaryResult] = await Promise.all([
    client.getLessonTranscript(lessonSlug),
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
  if (isRecoverableError(error)) {
    ingestLogger.debug(`Transcript unavailable for ${lessonSlug}`, {
      errorDetail: formatSdkError(error),
    });
    return '';
  }

  // Non-recoverable - propagate
  getIngestionErrorCollector().recordError(formatSdkError(error), errorContext);
  if (error.kind === 'network_error') {
    throw error.cause;
  }
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

    if (isRecoverableError(error)) {
      if (error.kind === 'not_found') {
        getIngestionErrorCollector().record404(errorContext, 'getLessonSummary');
      } else {
        getIngestionErrorCollector().record500Error(errorContext, 'getLessonSummary');
      }
      ingestLogger.warn(`Lesson summary unavailable - skipping ${lessonSlug}`, {
        errorDetail: formatSdkError(error),
      });
      return null;
    }

    getIngestionErrorCollector().recordError(formatSdkError(error), errorContext);
    if (error.kind === 'network_error') {
      throw error.cause;
    }
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
