/**
 * @module index-bulk-support
 * @description Support functions for bulk indexing operations.
 * @see {@link ./fetch-error-handling.ts} for error handling helpers
 */

import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import { isLessonSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { extractSequenceIds } from './document-transforms';
import { expectUnitSummaryString, readUnitSummaryValue } from './document-transform-helpers';
import { getIngestionErrorCollector } from './ingestion-error-collector';
import type { IngestionContext } from './ingestion-error-types';
import { handleFetchError } from './fetch-error-handling';
import { sandboxLogger } from '../logger';

/** Extract sequence IDs from a unit summary. */
export function extractUnitSequenceIds(summary: unknown): string[] | undefined {
  return extractSequenceIds(readUnitSummaryValue(summary, 'threads'));
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

/** Validate summary candidate and log error if invalid. */
function validateSummary(
  summary: unknown,
  lessonSlug: string,
  errorContext: IngestionContext,
): boolean {
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
): Promise<{ transcript: string; summary: unknown } | null> {
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

  if (summaryCandidate === null || !validateSummary(summaryCandidate, lessonSlug, errorContext)) {
    return null;
  }

  return { transcript: transcriptResponse.transcript, summary: summaryCandidate };
}

/** Validate that a unit summary matches the expected subject and key stage. */
export function ensureUnitSummaryMatchesContext(
  summary: unknown,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
): void {
  const unitSlug = expectUnitSummaryString(summary, 'unitSlug', 'unit summary slug');
  const subjectSlug = expectUnitSummaryString(
    summary,
    'subjectSlug',
    `subject slug for unit ${unitSlug}`,
  );
  if (subjectSlug !== subject) {
    throw new Error(
      `Unit summary subject mismatch for ${unitSlug}: expected ${subject}, received ${subjectSlug}`,
    );
  }
  const keyStageSlug = expectUnitSummaryString(
    summary,
    'keyStageSlug',
    `key stage slug for unit ${unitSlug}`,
  );
  if (keyStageSlug !== keyStage) {
    throw new Error(
      `Unit summary key stage mismatch for ${unitSlug}: expected ${keyStage}, received ${keyStageSlug}`,
    );
  }
}
