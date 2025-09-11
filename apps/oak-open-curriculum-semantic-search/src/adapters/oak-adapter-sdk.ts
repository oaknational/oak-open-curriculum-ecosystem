import type { KeyStage, SubjectSlug } from '../types/oak';
import { env } from '../lib/env';
import { createOakClient } from '@oaknational/oak-curriculum-sdk';
import { isUnitsGrouped, isLessonGroups, isTranscriptResponse } from './sdk-guards';

/** Adapter interface consumed by indexer. */
export interface OakClient {
  getUnitsByKeyStageAndSubject(
    keyStage: KeyStage,
    subject: SubjectSlug,
  ): Promise<readonly { unitSlug: string; unitTitle: string }[]>;

  getLessonsByKeyStageAndSubject(
    keyStage: KeyStage,
    subject: SubjectSlug,
  ): Promise<
    readonly {
      unitSlug: string;
      unitTitle: string;
      lessons: { lessonSlug: string; lessonTitle: string }[];
    }[]
  >;

  getLessonTranscript(lessonSlug: string): Promise<{ transcript: string; vtt: string }>;
}

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

function makeGetUnitsByKeyStageAndSubject(
  client: ReturnType<typeof createOakClient>,
): OakClient['getUnitsByKeyStageAndSubject'] {
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

function makeGetLessonsByKeyStageAndSubject(
  client: ReturnType<typeof createOakClient>,
): OakClient['getLessonsByKeyStageAndSubject'] {
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

function makeGetLessonTranscript(
  client: ReturnType<typeof createOakClient>,
): OakClient['getLessonTranscript'] {
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

/** SDK-backed client (preferred). */
export function createOakSdkClient(): OakClient {
  const { OAK_EFFECTIVE_KEY } = env();
  const client = createOakClient(OAK_EFFECTIVE_KEY);
  return {
    getUnitsByKeyStageAndSubject: makeGetUnitsByKeyStageAndSubject(client),
    getLessonsByKeyStageAndSubject: makeGetLessonsByKeyStageAndSubject(client),
    getLessonTranscript: makeGetLessonTranscript(client),
  };
}
