import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import { isLessonSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { extractSequenceIds } from './document-transforms';
import { expectUnitSummaryString, readUnitSummaryValue } from './document-transform-helpers';
import { getIngestionErrorCollector } from './ingestion-error-collector';
import { sandboxLogger } from '../logger';

export function extractUnitSequenceIds(summary: unknown): string[] | undefined {
  return extractSequenceIds(readUnitSummaryValue(summary, 'threads'));
}

/** Check if an error is a 500-series server error. */
function isServerError(error: Error): boolean {
  const msg = error.message;
  return msg.includes('500') || msg.includes('502') || msg.includes('503') || msg.includes('504');
}

/** Context for error tracking during lesson material fetch. */
export interface FetchContext {
  readonly keyStage?: KeyStage;
  readonly subject?: SearchSubjectSlug;
  readonly unitSlug?: string;
}

/**
 * Fetch lesson materials (transcript + summary) for indexing.
 * Returns null if lesson summary is unavailable (404) or on unrecoverable error.
 * Transcript is optional - returns empty string if lesson has no video/transcript or on 500 error.
 *
 * 500 errors are handled gracefully:
 * - Transcript 500: Returns empty transcript, logs warning, continues
 * - Summary 500: Returns null (skip lesson), logs warning, continues
 */
export async function fetchLessonMaterials(
  client: OakClient,
  lessonSlug: string,
  context?: FetchContext,
): Promise<{ transcript: string; summary: unknown } | null> {
  const errorCollector = getIngestionErrorCollector();
  const errorContext = {
    lessonSlug,
    keyStage: context?.keyStage,
    subject: context?.subject,
    unitSlug: context?.unitSlug,
  };

  // Fetch transcript with graceful 404/500 handling
  const transcriptResponsePromise = client.getLessonTranscript(lessonSlug).catch((error: Error) => {
    // 404: Many lessons don't have transcripts - this is expected
    if (error.message.includes('404')) {
      return { transcript: '', vtt: '' };
    }
    // 500: Upstream server error - log and return empty transcript
    if (isServerError(error)) {
      sandboxLogger.warn('Transcript fetch failed with 500, using empty transcript', {
        lessonSlug,
        unit: context?.unitSlug,
        keyStage: context?.keyStage,
        subject: context?.subject,
      });
      errorCollector.record500Error(errorContext, 'getLessonTranscript');
      return { transcript: '', vtt: '' };
    }
    throw error;
  });

  // Fetch summary with graceful 404/500 handling
  const summaryCandidatePromise = client.getLessonSummary(lessonSlug).catch((error: Error) => {
    // 500: Upstream server error - log and return null (skip lesson)
    if (error instanceof Error && isServerError(error)) {
      sandboxLogger.warn('Summary fetch failed with 500, skipping lesson', {
        lessonSlug,
        unit: context?.unitSlug,
        keyStage: context?.keyStage,
        subject: context?.subject,
      });
      errorCollector.record500Error(errorContext, 'getLessonSummary');
      return null;
    }
    throw error;
  });

  const [transcriptResponse, summaryCandidate] = await Promise.all([
    transcriptResponsePromise,
    summaryCandidatePromise,
  ]);

  // Handle 404 or 500 on summary - lesson exists in listing but no data available
  if (summaryCandidate === null) {
    return null;
  }

  if (!isLessonSummary(summaryCandidate)) {
    sandboxLogger.error('Unexpected lesson summary response shape', {
      lessonSlug,
      unit: context?.unitSlug,
    });
    errorCollector.recordError(
      `Unexpected lesson summary response for ${lessonSlug}`,
      errorContext,
    );
    return null; // Skip this lesson rather than crashing
  }

  const summary: unknown = summaryCandidate;
  return { transcript: transcriptResponse.transcript, summary };
}

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
