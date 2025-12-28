/** Oak SDK Adapter - All methods return Result<T, SdkFetchError> per ADR-088. */

import type { KeyStage, SearchSubjectSlug } from '../types/oak';
import { isLessonSummary, isUnitSummary, isSubjectSequences } from '../types/oak';
import { env } from '../lib/env';
import {
  createOakBaseClient,
  type OakApiClient,
  type OakClientConfig,
} from '@oaknational/oak-curriculum-sdk';
import { isUnitsGrouped, isTranscriptResponse, isLessonGroups } from './sdk-guards';
import { ok, err } from '@oaknational/result';
import { classifyHttpError, validationError } from '@oaknational/oak-curriculum-sdk';

import { makeGetAllThreads, makeGetThreadUnits } from './oak-adapter-sdk-threads';
import type {
  UnitListEntry,
  LessonGroupResponse,
  LessonsPaginationOptions,
  SubjectSequenceEntry,
  GetUnitsFn,
  GetTranscriptFn,
  GetLessonSummaryFn,
  GetUnitSummaryFn,
  GetSubjectSequencesFn,
  GetSequenceUnitsFn,
  GetLessonsByKeyStageAndSubjectFn,
  OakSdkClient,
} from './oak-adapter-sdk-types';

export type { UnitListEntry, LessonGroupResponse, LessonsPaginationOptions, SubjectSequenceEntry };
export type { GetUnitsFn, GetTranscriptFn, GetLessonSummaryFn, GetUnitSummaryFn };
export type {
  GetSubjectSequencesFn,
  GetSequenceUnitsFn,
  GetLessonsByKeyStageAndSubjectFn,
  OakSdkClient,
};
export type {
  ThreadEntry,
  ThreadUnitEntry,
  GetAllThreadsFn,
  GetThreadUnitsFn,
} from './oak-adapter-sdk-threads';

/** Creates a function to fetch units by key stage and subject. */
function makeGetUnitsByKeyStageAndSubject(client: OakApiClient): GetUnitsFn {
  return async (keyStage, subject) => {
    const res = await client.GET('/key-stages/{keyStage}/subject/{subject}/units', {
      params: { path: { keyStage, subject } },
    });
    if (!res.response.ok) {
      const resource = `${keyStage}/${subject}`;
      return err(
        classifyHttpError(res.response.status, resource, 'other', res.response.statusText),
      );
    }
    const data = res.data;
    if (!data) {
      return ok([]);
    }
    if (isUnitsGrouped(data)) {
      const flat: UnitListEntry[] = [];
      for (const group of data) {
        for (const u of group.units) {
          flat.push(u);
        }
      }
      return ok(flat);
    }
    return err(validationError(`${keyStage}/${subject}`, 'UnitsGrouped', data));
  };
}

/** Creates a function to fetch a lesson transcript. */
function makeGetLessonTranscript(client: OakApiClient): GetTranscriptFn {
  return async (lessonSlug) => {
    const res = await client.GET('/lessons/{lesson}/transcript', {
      params: { path: { lesson: lessonSlug } },
    });
    if (!res.response.ok) {
      return err(
        classifyHttpError(res.response.status, lessonSlug, 'transcript', res.response.statusText),
      );
    }
    const data = res.data;
    if (isTranscriptResponse(data)) {
      return ok(data);
    }
    return err(validationError(lessonSlug, 'TranscriptResponse', data));
  };
}

/** Creates a function to fetch a lesson summary. */
function makeGetLessonSummary(client: OakApiClient): GetLessonSummaryFn {
  return async (lessonSlug) => {
    const res = await client.GET('/lessons/{lesson}/summary', {
      params: { path: { lesson: lessonSlug } },
    });
    if (!res.response.ok) {
      return err(
        classifyHttpError(res.response.status, lessonSlug, 'lesson', res.response.statusText),
      );
    }
    const data = res.data;
    if (isLessonSummary(data)) {
      return ok(data);
    }
    return err(validationError(lessonSlug, 'LessonSummary', data));
  };
}

/** Creates a function to fetch a unit summary. */
function makeGetUnitSummary(client: OakApiClient): GetUnitSummaryFn {
  return async (unitSlug) => {
    const res = await client.GET('/units/{unit}/summary', {
      params: { path: { unit: unitSlug } },
    });
    if (!res.response.ok) {
      return err(classifyHttpError(res.response.status, unitSlug, 'unit', res.response.statusText));
    }
    const data = res.data;
    if (isUnitSummary(data)) {
      return ok(data);
    }
    return err(validationError(unitSlug, 'UnitSummary', data));
  };
}

/** Creates a function to fetch subject sequences. */
function makeGetSubjectSequences(client: OakApiClient): GetSubjectSequencesFn {
  return async (subject) => {
    const res = await client.GET('/subjects/{subject}/sequences', {
      params: { path: { subject } },
    });
    if (!res.response.ok) {
      return err(classifyHttpError(res.response.status, subject, 'other', res.response.statusText));
    }
    const data = res.data ?? [];
    if (isSubjectSequences(data)) {
      return ok(data);
    }
    return err(validationError(subject, 'SubjectSequences', data));
  };
}

/** Creates a function to fetch units in a sequence. */
function makeGetSequenceUnits(client: OakApiClient): GetSequenceUnitsFn {
  return async (sequenceSlug) => {
    const res = await client.GET('/sequences/{sequence}/units', {
      params: { path: { sequence: sequenceSlug } },
    });
    if (!res.response.ok) {
      return err(
        classifyHttpError(res.response.status, sequenceSlug, 'other', res.response.statusText),
      );
    }
    return ok(res.data ?? []);
  };
}

/** Creates a function to fetch lessons by key stage and subject. */
function makeGetLessonsByKeyStageAndSubject(
  client: OakApiClient,
): GetLessonsByKeyStageAndSubjectFn {
  return async (keyStage: KeyStage, subject: SearchSubjectSlug, options = {}) => {
    const { limit = 100, offset = 0, unit } = options;
    const res = await client.GET('/key-stages/{keyStage}/subject/{subject}/lessons', {
      params: {
        path: { keyStage, subject },
        query: { limit, offset, unit },
      },
    });
    if (!res.response.ok) {
      const resource = `${keyStage}/${subject}`;
      return err(
        classifyHttpError(res.response.status, resource, 'other', res.response.statusText),
      );
    }
    const data = res.data;
    if (!data) {
      return ok([]);
    }
    if (isLessonGroups(data)) {
      return ok(data);
    }
    return err(validationError(`${keyStage}/${subject}`, 'LessonGroups', data));
  };
}

// Client Factory

/** SDK client singleton with rate limiting and retry. */
let _singletonClient: OakSdkClient | null = null;

/**
 * Creates an Oak SDK client with rate limiting (5 req/sec) and retry (5 attempts, exp backoff).
 * All methods return `Result<T, SdkFetchError>` per ADR-088.
 */
export function createOakSdkClient(): OakSdkClient {
  if (_singletonClient) {
    return _singletonClient;
  }
  const { OAK_EFFECTIVE_KEY } = env();
  const config: OakClientConfig = {
    apiKey: OAK_EFFECTIVE_KEY,
    rateLimit: { enabled: true, minRequestInterval: 200 },
    retry: {
      enabled: true,
      maxRetries: 5,
      initialDelayMs: 1000,
      // Retry transient errors (429, 503) with 5 attempts, 404/500 with 2 attempts
      retryableStatusCodes: [429, 503, 404, 500],
      statusCodeMaxRetries: { 404: 2, 500: 2 },
    },
  };
  const baseClient = createOakBaseClient(config);
  const client = baseClient.client;

  _singletonClient = {
    getUnitsByKeyStageAndSubject: makeGetUnitsByKeyStageAndSubject(client),
    getLessonTranscript: makeGetLessonTranscript(client),
    getLessonSummary: makeGetLessonSummary(client),
    getUnitSummary: makeGetUnitSummary(client),
    getSubjectSequences: makeGetSubjectSequences(client),
    getSequenceUnits: makeGetSequenceUnits(client),
    getAllThreads: makeGetAllThreads(client),
    getThreadUnits: makeGetThreadUnits(client),
    getLessonsByKeyStageAndSubject: makeGetLessonsByKeyStageAndSubject(client),
    rateLimitTracker: baseClient.rateLimitTracker,
  };
  return _singletonClient;
}

/**
 * Type alias for the Oak SDK client.
 *
 * This is the same as {@link OakSdkClient} - it exists as a shorter alias for
 * convenience. Both types are equivalent and can be used interchangeably.
 *
 * The canonical interface definition with full documentation is in
 * `oak-adapter-sdk-types.ts` as {@link OakSdkClient}.
 */
export type OakClient = OakSdkClient;
