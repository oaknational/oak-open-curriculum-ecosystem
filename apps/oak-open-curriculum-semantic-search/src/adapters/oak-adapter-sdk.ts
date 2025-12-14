import type {
  KeyStage,
  SearchLessonSummary,
  SearchSubjectSlug,
  SearchSubjectSequences,
  SearchUnitSummary,
} from '../types/oak';
import { isLessonSummary, isUnitSummary, isSubjectSequences } from '../types/oak';
import { env } from '../lib/env';
import {
  createOakBaseClient,
  type OakApiClient,
  type OakClientConfig,
  type RateLimitTracker,
} from '@oaknational/oak-curriculum-sdk';
import { isUnitsGrouped, isTranscriptResponse } from './sdk-guards';

/**
 * Public shape for listing units by key stage and subject.
 * Linked plan: `.agent/plans/generated-document-enhancements-plan.md` (docs API curation)
 */
export type GetUnitsFn = (
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
) => Promise<readonly { unitSlug: string; unitTitle: string }[]>;

/**
 * Public shape for fetching a lesson transcript.
 * Linked plan: `.agent/plans/generated-document-enhancements-plan.md`
 */
export type GetTranscriptFn = (lessonSlug: string) => Promise<{ transcript: string; vtt: string }>;

export type GetLessonSummaryFn = (lessonSlug: string) => Promise<SearchLessonSummary>;

export type GetUnitSummaryFn = (unitSlug: string) => Promise<SearchUnitSummary>;

export type SubjectSequenceEntry = SearchSubjectSequences[number];

export type GetSubjectSequencesFn = (subject: SearchSubjectSlug) => Promise<SearchSubjectSequences>;

export type GetSequenceUnitsFn = (sequenceSlug: string) => Promise<unknown>;

// Import thread types and factory functions from separate module
import {
  makeGetAllThreads,
  makeGetThreadUnits,
  type ThreadEntry,
  type ThreadUnitEntry,
  type GetAllThreadsFn,
  type GetThreadUnitsFn,
} from './oak-adapter-sdk-threads';

// Re-export thread types for external consumers
export type { ThreadEntry, ThreadUnitEntry, GetAllThreadsFn, GetThreadUnitsFn };

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
    if (!data) {
      return [];
    }
    if (isUnitsGrouped(data)) {
      const flat: { unitSlug: string; unitTitle: string }[] = [];
      for (const group of data) {
        for (const u of group.units) {
          flat.push(u);
        }
      }
      return flat;
    }
    throw new Error('Unexpected units response shape');
  };
}

function makeGetLessonTranscript(client: OakApiClient): GetTranscriptFn {
  return async (lessonSlug) => {
    const res = await client.GET('/lessons/{lesson}/transcript', {
      params: { path: { lesson: lessonSlug } },
    });
    assertSdkOk(res);
    const data = res.data;
    if (isTranscriptResponse(data)) {
      return data;
    }
    throw new Error('Unexpected transcript response shape');
  };
}

function makeGetLessonSummary(client: OakApiClient): GetLessonSummaryFn {
  return async (lessonSlug) => {
    const res = await client.GET('/lessons/{lesson}/summary', {
      params: { path: { lesson: lessonSlug } },
    });
    assertSdkOk(res);
    const data = res.data;
    if (isLessonSummary(data)) {
      return data;
    }
    throw new Error('Unexpected lesson summary response shape');
  };
}

function makeGetUnitSummary(client: OakApiClient): GetUnitSummaryFn {
  return async (unitSlug) => {
    const res = await client.GET('/units/{unit}/summary', {
      params: { path: { unit: unitSlug } },
    });
    assertSdkOk(res);
    const data = res.data;
    if (isUnitSummary(data)) {
      return data;
    }
    throw new Error('Unexpected unit summary response shape');
  };
}

function makeGetSubjectSequences(client: OakApiClient): GetSubjectSequencesFn {
  return async (subject) => {
    const res = await client.GET('/subjects/{subject}/sequences', {
      params: { path: { subject } },
    });
    assertSdkOk(res);
    const data = res.data ?? [];
    if (isSubjectSequences(data)) {
      return data;
    }
    throw new Error('Unexpected subject sequences response shape');
  };
}

function makeGetSequenceUnits(client: OakApiClient): GetSequenceUnitsFn {
  return async (sequenceSlug) => {
    const res = await client.GET('/sequences/{sequence}/units', {
      params: { path: { sequence: sequenceSlug } },
    });
    assertSdkOk(res);
    return res.data ?? [];
  };
}

/** Documented SDK-backed client interface (narrow, curated). */
export interface OakSdkClient {
  /** List units for a key stage and subject. */
  getUnitsByKeyStageAndSubject: GetUnitsFn;
  /** Get a lesson transcript and VTT. */
  getLessonTranscript: GetTranscriptFn;
  /** Get lesson summary metadata. */
  getLessonSummary: GetLessonSummaryFn;
  /** Get unit summary metadata. */
  getUnitSummary: GetUnitSummaryFn;
  /** Get sequence metadata for a subject. */
  getSubjectSequences: GetSubjectSequencesFn;
  /** Get units associated with a sequence. */
  getSequenceUnits: GetSequenceUnitsFn;
  /** Get all curriculum threads. */
  getAllThreads: GetAllThreadsFn;
  /** Get units belonging to a thread. */
  getThreadUnits: GetThreadUnitsFn;
  /** Rate limit tracker for monitoring API usage. */
  rateLimitTracker: RateLimitTracker;
}

/** SDK client singleton with rate limiting and retry. */
let _singletonClient: OakSdkClient | null = null;

/** Creates SDK client with rate limiting (5 req/sec) and retry (5 attempts, exp backoff). */
export function createOakSdkClient(): OakSdkClient {
  if (_singletonClient) {
    return _singletonClient;
  }
  const { OAK_EFFECTIVE_KEY } = env();
  const config: OakClientConfig = {
    apiKey: OAK_EFFECTIVE_KEY,
    rateLimit: { enabled: true, minRequestInterval: 200 },
    retry: { enabled: true, maxRetries: 5, initialDelayMs: 1000 },
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
    rateLimitTracker: baseClient.rateLimitTracker,
  };

  return _singletonClient;
}

export type OakClient = ReturnType<typeof createOakSdkClient>;
