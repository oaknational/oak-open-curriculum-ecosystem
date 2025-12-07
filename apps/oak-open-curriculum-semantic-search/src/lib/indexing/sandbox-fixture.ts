import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { isLessonSummary, isUnitSummary } from '../../types/oak';
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
    getUnitsByKeyStageAndSubject: makeFixtureUnitsFn(data),
    getLessonsByKeyStageAndSubject: makeFixtureLessonsFn(data),
    getLessonTranscript: makeFixtureTranscriptFn(data),
    getLessonSummary: makeFixtureLessonSummaryFn(data),
    getUnitSummary: makeFixtureUnitSummaryFn(data),
    getSubjectSequences: makeFixtureSubjectSequencesFn(data),
    rateLimitTracker: {
      getStatus: () => ({
        limit: null,
        remaining: null,
        reset: null,
        resetDate: null,
        lastChecked: new Date(),
      }),
      getRequestCount: () => 0,
      getRequestRate: () => 0,
      reset: () => {
        // No-op for fixture client - no state to reset
        return;
      },
    },
    getSequenceUnits: makeFixtureSequenceUnitsFn(data),
  };
}

function makeFixtureUnitsFn(data: FixtureData): OakClient['getUnitsByKeyStageAndSubject'] {
  return async (keyStage, subject) =>
    data.units
      .filter((unit) => unit.keyStage === keyStage && unit.subject === subject)
      .map((unit) => ({ unitSlug: unit.unitSlug, unitTitle: unit.unitTitle }));
}

function makeFixtureLessonsFn(data: FixtureData): OakClient['getLessonsByKeyStageAndSubject'] {
  return async (keyStage, subject) =>
    data.lessons
      .filter((group) => group.keyStage === keyStage && group.subject === subject)
      .map(({ unitSlug, unitTitle, lessons }) => ({
        unitSlug,
        unitTitle,
        lessons: lessons.map((lesson) => ({ ...lesson })),
      }));
}

function makeFixtureTranscriptFn(data: FixtureData): OakClient['getLessonTranscript'] {
  return async (lessonSlug) => {
    const entry = data.lessonTranscripts.get(lessonSlug);
    if (!entry) {
      throw new Error(`Missing transcript for ${lessonSlug}`);
    }
    return { transcript: entry.transcript, vtt: entry.vtt };
  };
}

function makeFixtureLessonSummaryFn(data: FixtureData): OakClient['getLessonSummary'] {
  return async (lessonSlug) => {
    const summary = data.lessonSummaries.get(lessonSlug);
    if (!summary) {
      throw new Error(`Missing lesson summary for ${lessonSlug}`);
    }
    if (!isLessonSummary(summary)) {
      throw new Error(`Invalid lesson summary in sandbox fixture for ${lessonSlug}`);
    }
    return summary;
  };
}

function makeFixtureUnitSummaryFn(data: FixtureData): OakClient['getUnitSummary'] {
  return async (unitSlug) => {
    const summary = data.unitSummaries.get(unitSlug);
    if (!summary) {
      throw new Error(`Missing unit summary for ${unitSlug}`);
    }
    if (!isUnitSummary(summary)) {
      throw new Error(`Invalid unit summary in sandbox fixture for ${unitSlug}`);
    }
    return summary;
  };
}

function makeFixtureSubjectSequencesFn(data: FixtureData): OakClient['getSubjectSequences'] {
  return async (subject) => {
    const sequences = data.subjectSequences.get(subject);
    if (!sequences) {
      return [];
    }
    return sequences;
  };
}

function makeFixtureSequenceUnitsFn(data: FixtureData): OakClient['getSequenceUnits'] {
  return async (sequenceSlug) => {
    const units = data.sequenceUnits.get(sequenceSlug);
    if (!Array.isArray(units)) {
      return [];
    }
    return units.map((entry): unknown => entry);
  };
}
