import type { KeyStage, SubjectSlug } from '@types/oak';
import { env } from '@lib/env';
import { createOakClient } from '@oaknational/oak-curriculum-sdk';
import { isUnitsFlat, isUnitsGrouped, isLessonGroups, isTranscriptResponse } from './sdk-guards';

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
      lessons: Array<{ lessonSlug: string; lessonTitle: string }>;
    }[]
  >;

  getLessonTranscript(lessonSlug: string): Promise<{ transcript: string; vtt: string }>;
}

/** SDK-backed client (preferred). */
export function createOakSdkClient(): OakClient {
  const apiKey = env().OAK_EFFECTIVE_KEY;
  const client = createOakClient(apiKey);

  return {
    async getUnitsByKeyStageAndSubject(keyStage, subject) {
      const res = await client.GET('/key-stages/{keyStage}/subject/{subject}/units', {
        params: { path: { keyStage, subject } },
      });
      if (res.error) throw new Error(`units ${keyStage}/${subject}: ${JSON.stringify(res.error)}`);
      const data = res.data;
      if (!data) return [];

      if (isUnitsGrouped(data)) {
        const flat: { unitSlug: string; unitTitle: string }[] = [];
        for (const group of data) for (const u of group.units) flat.push(u);
        return flat;
      }
      if (isUnitsFlat(data)) return data;

      throw new Error('Unexpected units response shape');
    },

    async getLessonsByKeyStageAndSubject(keyStage, subject) {
      const res = await client.GET('/key-stages/{keyStage}/subject/{subject}/lessons', {
        params: { path: { keyStage, subject }, query: { limit: 100 } },
      });
      if (res.error)
        throw new Error(`lessons ${keyStage}/${subject}: ${JSON.stringify(res.error)}`);
      const data = res.data;
      if (!data) return [];

      if (isLessonGroups(data)) return data;
      throw new Error('Unexpected lessons response shape');
    },

    async getLessonTranscript(lessonSlug) {
      const res = await client.GET('/lessons/{lesson}/transcript', {
        params: { path: { lesson: lessonSlug } },
      });
      if (res.error) throw new Error(`transcript ${lessonSlug}: ${JSON.stringify(res.error)}`);
      const data = res.data;
      if (isTranscriptResponse(data)) return data;
      throw new Error('Unexpected transcript response shape');
    },
  };
}
