/**
 * Support functions for bulk indexing operations.
 * @see {@link ./fetch-error-handling.ts} for error handling helpers
 */

import type {
  KeyStage,
  SearchLessonSummary,
  SearchSubjectSlug,
  SearchUnitSummary,
} from '../../types/oak';
import { isLessonSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
// extractSequenceIds no longer needed - using direct property access
import { getIngestionErrorCollector } from './ingestion-error-collector';
import type { IngestionContext } from './ingestion-error-types';
import { handleFetchError } from './fetch-error-handling';
import { sandboxLogger } from '../logger';

/** Extract sequence IDs from a unit summary. */
export function extractUnitSequenceIds(summary: SearchUnitSummary): string[] | undefined {
  if (!summary.threads) {
    return undefined;
  }
  return summary.threads.map((thread) => thread.slug);
}

/** Context for error tracking during lesson material fetch. */
export interface FetchContext {
  readonly keyStage?: KeyStage;
  readonly subject?: SearchSubjectSlug;
  readonly unitSlug?: string;
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

/** Validate summary candidate and log error if invalid. Type guard version. */
function validateSummary(
  summary: unknown,
  lessonSlug: string,
  errorContext: IngestionContext,
): summary is SearchLessonSummary {
  if (isLessonSummary(summary)) {
    return true;
  }
  sandboxLogger.error('Unexpected lesson summary response shape', {
    lessonSlug,
    unit: errorContext.unitSlug,
  });
  getIngestionErrorCollector().recordError(
    `Unexpected lesson summary response for ${lessonSlug}`,
    errorContext,
  );
  return false;
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
  const errorConfig = {
    errorCollector: getIngestionErrorCollector(),
    logger: sandboxLogger,
    context: errorContext,
  };

  const transcriptPromise = client.getLessonTranscript(lessonSlug).catch((e: Error) =>
    handleFetchError(e, {
      ...errorConfig,
      fallback: { transcript: '', vtt: '' },
      operation: 'getLessonTranscript',
      handle404: true,
    }),
  );

  const summaryPromise = client.getLessonSummary(lessonSlug).catch((e: Error) =>
    handleFetchError(e, {
      ...errorConfig,
      fallback: null,
      operation: 'getLessonSummary',
      handle404: false,
    }),
  );

  const [transcriptResponse, summaryCandidate] = await Promise.all([
    transcriptPromise,
    summaryPromise,
  ]);

  // validateSummary is a type guard - after this check, summaryCandidate is SearchLessonSummary
  if (summaryCandidate === null || !validateSummary(summaryCandidate, lessonSlug, errorContext)) {
    return null;
  }

  return { transcript: transcriptResponse.transcript, summary: summaryCandidate };
}

/** Validate that a unit summary matches the expected subject and key stage. */
export function ensureUnitSummaryMatchesContext(
  summary: SearchUnitSummary,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
): void {
  const { unitSlug, subjectSlug, keyStageSlug } = summary;
  if (subjectSlug !== subject) {
    throw new Error(
      `Unit summary subject mismatch for ${unitSlug}: expected ${subject}, received ${subjectSlug}`,
    );
  }
  if (keyStageSlug !== keyStage) {
    throw new Error(
      `Unit summary key stage mismatch for ${unitSlug}: expected ${keyStage}, received ${keyStageSlug}`,
    );
  }
}
