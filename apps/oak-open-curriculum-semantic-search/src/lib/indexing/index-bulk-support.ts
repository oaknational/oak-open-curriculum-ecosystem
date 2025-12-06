import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import { isLessonSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { extractSequenceIds } from './document-transforms';
import { expectUnitSummaryString, readUnitSummaryValue } from './document-transform-helpers';

export function extractUnitSequenceIds(summary: unknown): string[] | undefined {
  return extractSequenceIds(readUnitSummaryValue(summary, 'threads'));
}

/**
 * Fetch lesson materials (transcript + summary) for indexing.
 * Returns null if lesson summary is unavailable (404).
 * Transcript is optional - returns empty string if lesson has no video/transcript.
 */
export async function fetchLessonMaterials(
  client: OakClient,
  lessonSlug: string,
): Promise<{ transcript: string; summary: unknown } | null> {
  // Fetch both in parallel but handle transcript 404 gracefully
  const transcriptResponsePromise = client.getLessonTranscript(lessonSlug).catch((error: Error) => {
    // Many lessons don't have transcripts - this is expected
    if (error.message.includes('404')) {
      return { transcript: '', vtt: '' };
    }
    throw error;
  });
  const summaryCandidatePromise = client.getLessonSummary(lessonSlug);

  const [transcriptResponse, summaryCandidate] = await Promise.all([
    transcriptResponsePromise,
    summaryCandidatePromise,
  ]);

  // Handle 404 - lesson exists in listing but has no summary data
  if (summaryCandidate === null) {
    return null;
  }

  if (!isLessonSummary(summaryCandidate)) {
    throw new Error(`Unexpected lesson summary response for ${lessonSlug}`);
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
