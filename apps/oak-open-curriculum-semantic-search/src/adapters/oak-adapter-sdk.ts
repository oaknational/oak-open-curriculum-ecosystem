import type { KeyStage, SubjectSlug } from '../types/oak';
import { env } from '../lib/env';
import { createOakClient, type OakApiClient } from '@oaknational/oak-curriculum-sdk';
import { isUnitsGrouped, isLessonGroups, isTranscriptResponse } from './sdk-guards';

/**
 * Public shape for listing units by key stage and subject.
 * Linked plan: `.agent/plans/generated-document-enhancements-plan.md` (docs API curation)
 */
export type GetUnitsFn = (
  keyStage: KeyStage,
  subject: SubjectSlug,
) => Promise<readonly { unitSlug: string; unitTitle: string }[]>;

/**
 * Public shape for listing grouped lessons by key stage and subject.
 * Linked plan: `.agent/plans/generated-document-enhancements-plan.md`
 */
export type GetLessonsFn = (
  keyStage: KeyStage,
  subject: SubjectSlug,
) => Promise<
  readonly {
    unitSlug: string;
    unitTitle: string;
    lessons: { lessonSlug: string; lessonTitle: string }[];
  }[]
>;

/**
 * Public shape for fetching a lesson transcript.
 * Linked plan: `.agent/plans/generated-document-enhancements-plan.md`
 */
export type GetTranscriptFn = (lessonSlug: string) => Promise<{ transcript: string; vtt: string }>;

function assertSdkOk(res: { response: Response }): void {
  if (!res.response.ok) {
    const status = String(res.response.status);
    const statusText = res.response.statusText;
    const message = statusText
      ? `SDK request failed: ${status} ${statusText}`
      : `SDK request failed: ${status}`;
    throw new Error(message);
  }
}

function makeGetUnitsByKeyStageAndSubject(client: OakApiClient): GetUnitsFn {
  return async (keyStage, subject) => {
    const res = await client.GET('/key-stages/{keyStage}/subject/{subject}/units', {
      params: { path: { keyStage, subject } },
    });
    assertSdkOk(res);
    const data = res.data;
    if (!data) return [];
    if (isUnitsGrouped(data)) {
      const flat: { unitSlug: string; unitTitle: string }[] = [];
      for (const group of data) for (const u of group.units) flat.push(u);
      return flat;
    }
    throw new Error('Unexpected units response shape');
  };
}

function makeGetLessonsByKeyStageAndSubject(client: OakApiClient): GetLessonsFn {
  return async (keyStage, subject) => {
    const res = await client.GET('/key-stages/{keyStage}/subject/{subject}/lessons', {
      params: { path: { keyStage, subject }, query: { limit: 100 } },
    });
    assertSdkOk(res);
    const data = res.data;
    if (!data) return [];
    if (isLessonGroups(data)) return data;
    throw new Error('Unexpected lessons response shape');
  };
}

function makeGetLessonTranscript(client: OakApiClient): GetTranscriptFn {
  return async (lessonSlug) => {
    const res = await client.GET('/lessons/{lesson}/transcript', {
      params: { path: { lesson: lessonSlug } },
    });
    assertSdkOk(res);
    const data = res.data;
    if (isTranscriptResponse(data)) return data;
    throw new Error('Unexpected transcript response shape');
  };
}

/** Documented SDK-backed client interface (narrow, curated). */
export interface OakSdkClient {
  /** List units for a key stage and subject. */
  getUnitsByKeyStageAndSubject: GetUnitsFn;
  /** List grouped lessons for a key stage and subject. */
  getLessonsByKeyStageAndSubject: GetLessonsFn;
  /** Get a lesson transcript and VTT. */
  getLessonTranscript: GetTranscriptFn;
}

/** SDK-backed client (preferred). */
export function createOakSdkClient(): OakSdkClient {
  const { OAK_EFFECTIVE_KEY } = env();
  const client = createOakClient(OAK_EFFECTIVE_KEY);
  return {
    getUnitsByKeyStageAndSubject: makeGetUnitsByKeyStageAndSubject(client),
    getLessonsByKeyStageAndSubject: makeGetLessonsByKeyStageAndSubject(client),
    getLessonTranscript: makeGetLessonTranscript(client),
  };
}

export type OakClient = ReturnType<typeof createOakSdkClient>;
