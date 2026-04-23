/**
 * Sandbox fixture client for testing without live API.
 *
 * All methods return `Result<T, SdkFetchError>` per ADR-088.
 *
 * @see ADR-088 Result Pattern for Explicit Error Handling
 */

import type { OakClient } from '../../adapters/oak-adapter';
import { isLessonSummary, isUnitSummary } from '../../types/oak';
import { loadSandboxFixtureData, type FixtureData } from './sandbox-fixture-data';
import { ok, err } from '@oaknational/result';
import type { SdkNotFoundError } from '@oaknational/curriculum-sdk';
import { ingestLogger } from '../logger';

/**
 * Package of a parsed fixture dataset together with an Oak-compatible client.
 */
interface FixtureOakClient {
  readonly client: OakClient;
  readonly data: FixtureData;
}

/**
 * Loads the sandbox fixture dataset from disk and returns a client wired to the parsed data.
 */
export async function createFixtureOakClient(fixtureRoot: string): Promise<FixtureOakClient> {
  ingestLogger.debug('Creating fixture-backed Oak client', { fixtureRoot });
  const data = await loadSandboxFixtureData(fixtureRoot);
  const client = createFixtureClient(data);
  return { client, data };
}

function createFixtureClient(data: FixtureData): OakClient {
  return {
    getUnitsByKeyStageAndSubject: makeFixtureUnitsFn(data),
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
    // Thread fixtures not implemented yet - return empty for now
    getAllThreads: async () => ok([]),
    getThreadUnits: async () => ok([]),
    // Lessons by key stage/subject - use fixture data
    getLessonsByKeyStageAndSubject: makeFixtureLessonsByKeyStageAndSubjectFn(data),
    // Subject assets - return lessons with mock video assets
    getSubjectAssets: makeFixtureSubjectAssetsFn(data),
    // Cache methods (no-op for fixture client)
    getCacheStats: () => ({ hits: 0, misses: 0, connected: false }),
    disconnect: async () => Promise.resolve(),
  };
}

function makeFixtureUnitsFn(data: FixtureData): OakClient['getUnitsByKeyStageAndSubject'] {
  return async (keyStage, subject) =>
    ok(
      data.units
        .filter((unit) => unit.keyStage === keyStage && unit.subject === subject)
        .map((unit) => ({ unitSlug: unit.unitSlug, unitTitle: unit.unitTitle })),
    );
}

function makeFixtureTranscriptFn(data: FixtureData): OakClient['getLessonTranscript'] {
  return async (lessonSlug) => {
    const entry = data.lessonTranscripts.get(lessonSlug);
    if (!entry) {
      const error: SdkNotFoundError = {
        kind: 'not_found',
        resource: lessonSlug,
        resourceType: 'transcript',
      };
      return err(error);
    }
    return ok({ transcript: entry.transcript, vtt: entry.vtt });
  };
}

function makeFixtureLessonSummaryFn(data: FixtureData): OakClient['getLessonSummary'] {
  return async (lessonSlug) => {
    const summary = data.lessonSummaries.get(lessonSlug);
    if (!summary) {
      const error: SdkNotFoundError = {
        kind: 'not_found',
        resource: lessonSlug,
        resourceType: 'lesson',
      };
      return err(error);
    }
    if (!isLessonSummary(summary)) {
      return err({
        kind: 'validation_error',
        resource: lessonSlug,
        expected: 'LessonSummary',
        received: 'invalid',
      });
    }
    return ok(summary);
  };
}

function makeFixtureUnitSummaryFn(data: FixtureData): OakClient['getUnitSummary'] {
  return async (unitSlug) => {
    const summary = data.unitSummaries.get(unitSlug);
    if (!summary) {
      const error: SdkNotFoundError = {
        kind: 'not_found',
        resource: unitSlug,
        resourceType: 'unit',
      };
      return err(error);
    }
    if (!isUnitSummary(summary)) {
      return err({
        kind: 'validation_error',
        resource: unitSlug,
        expected: 'UnitSummary',
        received: 'invalid',
      });
    }
    return ok(summary);
  };
}

function makeFixtureSubjectSequencesFn(data: FixtureData): OakClient['getSubjectSequences'] {
  return async (subject) => {
    const sequences = data.subjectSequences.get(subject);
    if (!sequences) {
      return ok([]);
    }
    return ok(sequences);
  };
}

function makeFixtureSequenceUnitsFn(data: FixtureData): OakClient['getSequenceUnits'] {
  return async (sequenceSlug) => {
    const units = data.sequenceUnits.get(sequenceSlug);
    if (!units) {
      return ok([]);
    }
    return ok(units);
  };
}

function makeFixtureLessonsByKeyStageAndSubjectFn(
  data: FixtureData,
): OakClient['getLessonsByKeyStageAndSubject'] {
  return async (keyStage, subject) => {
    // Group lessons by unit for the given key stage and subject
    const relevantUnits = data.units.filter(
      (unit) => unit.keyStage === keyStage && unit.subject === subject,
    );
    return ok(
      relevantUnits.map((unit) => ({
        unitSlug: unit.unitSlug,
        unitTitle: unit.unitTitle,
        lessons: data.lessons
          .filter((lg) => lg.unitSlug === unit.unitSlug)
          .flatMap((lg) => lg.lessons),
      })),
    );
  };
}

/**
 * Create fixture function for getSubjectAssets.
 * Returns all lessons with video assets if they have transcripts in fixture data.
 */
function makeFixtureSubjectAssetsFn(data: FixtureData): OakClient['getSubjectAssets'] {
  return async (keyStage, subject) => {
    // Get all lessons for this key stage and subject
    const relevantUnits = data.units.filter(
      (unit) => unit.keyStage === keyStage && unit.subject === subject,
    );
    const lessonEntries = relevantUnits.flatMap((unit) =>
      data.lessons
        .filter((lg) => lg.unitSlug === unit.unitSlug)
        .flatMap((lg) =>
          lg.lessons.map((lesson) => {
            // Check if this lesson has a transcript (means it has a video)
            const hasTranscript = data.lessonTranscripts.has(lesson.lessonSlug);
            return {
              lessonSlug: lesson.lessonSlug,
              lessonTitle: lesson.lessonTitle,
              assets: hasTranscript
                ? [
                    {
                      type: 'video',
                      label: 'Video',
                      url: `/api/lessons/${lesson.lessonSlug}/video`,
                    },
                  ]
                : [],
            };
          }),
        ),
    );
    return ok(lessonEntries);
  };
}
