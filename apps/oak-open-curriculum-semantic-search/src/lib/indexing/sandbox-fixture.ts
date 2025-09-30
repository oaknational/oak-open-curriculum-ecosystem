import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { loadSandboxFixtureData, type FixtureData } from './sandbox-fixture-data';

/**
 * Package of a parsed fixture dataset together with an Oak-compatible client.
 */
export interface FixtureOakClient {
  readonly client: OakClient;
  readonly data: FixtureData;
}

/**
 * Loads the sandbox fixture dataset from disk and returns a client wired to the parsed data.
 */
export async function createFixtureOakClient(fixtureRoot: string): Promise<FixtureOakClient> {
  const data = await loadSandboxFixtureData(fixtureRoot);
  const client = createFixtureClient(data);
  return { client, data };
}

function createFixtureClient(data: FixtureData): OakClient {
  return {
    async getUnitsByKeyStageAndSubject(keyStage, subject) {
      return data.units
        .filter((unit) => unit.keyStage === keyStage && unit.subject === subject)
        .map((unit) => ({ unitSlug: unit.unitSlug, unitTitle: unit.unitTitle }));
    },
    async getLessonsByKeyStageAndSubject(keyStage, subject) {
      return data.lessons
        .filter((group) => group.keyStage === keyStage && group.subject === subject)
        .map(({ unitSlug, unitTitle, lessons }) => ({
          unitSlug,
          unitTitle,
          lessons: lessons.map((lesson) => ({ ...lesson })),
        }));
    },
    async getLessonTranscript(lessonSlug) {
      const entry = data.lessonTranscripts.get(lessonSlug);
      if (!entry) {
        throw new Error(`Missing transcript for ${lessonSlug}`);
      }
      return { transcript: entry.transcript, vtt: entry.vtt };
    },
    async getLessonSummary(lessonSlug) {
      const summary = data.lessonSummaries.get(lessonSlug);
      if (!summary) {
        throw new Error(`Missing lesson summary for ${lessonSlug}`);
      }
      return structuredClone(summary);
    },
    async getUnitSummary(unitSlug) {
      const summary = data.unitSummaries.get(unitSlug);
      if (!summary) {
        throw new Error(`Missing unit summary for ${unitSlug}`);
      }
      return structuredClone(summary);
    },
    async getSubjectSequences(subject) {
      const sequences = data.subjectSequences.get(subject) ?? [];
      return structuredClone(sequences);
    },
    async getSequenceUnits(sequenceSlug) {
      return structuredClone(data.sequenceUnits.get(sequenceSlug) ?? []);
    },
  };
}
