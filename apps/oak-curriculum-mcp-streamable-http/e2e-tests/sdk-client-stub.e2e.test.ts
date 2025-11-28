import request from 'supertest';
import { describe, it, expect } from 'vitest';

import {
  createStubbedHttpApp,
  STUB_ACCEPT_HEADER,
  STUB_DEV_BEARER_TOKEN,
} from './helpers/create-stubbed-http-app.js';
import {
  parseSseEnvelope,
  parseJsonRpcResult,
  readFirstTextContent,
  parseToolSuccessPayload,
} from './helpers/sse.js';
import type { JsonRpcEnvelope, JsonRpcResult } from './helpers/sse.js';
import type { Express } from 'express';
import {
  createStubToolExecutionAdapter,
  type ToolName,
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

const JSON_RPC_VERSION = '2.0';
const TOOL_CALL_METHOD = 'tools/call';

type ToolArguments = Record<string, unknown>;

type KeyStagesResponse = readonly {
  readonly slug: string;
  readonly title: string;
  readonly canonicalUrl?: string;
}[];

interface SubjectSummary {
  readonly subjectSlug: string;
  readonly subjectTitle: string;
  readonly canonicalUrl?: string;
  readonly keyStages?: readonly { readonly keyStageSlug: string }[];
  readonly sequenceSlugs?: readonly Record<string, unknown>[];
}

interface LessonSummaryResponse {
  readonly lessonTitle: string;
  readonly canonicalUrl?: string;
  readonly [key: string]: unknown;
}

type SearchResult = readonly {
  readonly lessonSlug: string;
  readonly lessonTitle: string;
  readonly canonicalUrl?: string;
  readonly [key: string]: unknown;
}[];

interface RateLimitResponse {
  readonly limit: number;
  readonly remaining: number;
  readonly reset: number;
  readonly canonicalUrl?: string;
}

const stubExecutor = createStubToolExecutionAdapter();

async function executeStubTool(name: ToolName, args: ToolArguments): Promise<unknown> {
  const result = await stubExecutor(name, args);
  if (!('data' in result)) {
    throw new Error(`Stub executor returned error for ${name}`);
  }
  return result.data;
}

async function callTool(
  app: Express,
  name: string,
  args: ToolArguments,
): Promise<{ result?: JsonRpcResult; envelope: JsonRpcEnvelope; text: string }> {
  const response = await request(app)
    .post('/mcp')
    .set('Authorization', `Bearer ${STUB_DEV_BEARER_TOKEN}`)
    .set('Accept', STUB_ACCEPT_HEADER)
    .send({
      jsonrpc: JSON_RPC_VERSION,
      id: `test-${name}`,
      method: TOOL_CALL_METHOD,
      params: {
        name,
        arguments: args,
      },
    });

  expect(response.status).toBe(200);
  const envelope = parseSseEnvelope(response.text);
  let result: JsonRpcResult | undefined;
  try {
    result = parseJsonRpcResult(envelope);
  } catch {
    result = undefined;
  }
  return { result, envelope, text: response.text };
}

function readSuccessfulPayload(result: JsonRpcResult): unknown {
  expect(result.isError).not.toBe(true);
  const payload = parseToolSuccessPayload(result);
  return payload.data;
}

function expectSuccessfulPayload(result: JsonRpcResult | undefined): unknown {
  expect(result).toBeDefined();
  if (!result) {
    throw new Error('Expected tool call to return a result payload');
  }
  return readSuccessfulPayload(result);
}

function ensureArray(value: unknown, description: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${description} must be an array`);
  }
  return value;
}

function ensureRecord(value: unknown, description: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${description} must be an object`);
  }
  return value as Record<string, unknown>;
}

function ensureString(value: unknown, description: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${description} must be a string`);
  }
  return value;
}

function ensureOptionalString(value: unknown, description: string): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new Error(`${description} must be a string when defined`);
  }
  return value;
}

function asOptionalRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

async function withStubbedHttpApp<T>(callback: (app: Express) => Promise<T>): Promise<T> {
  const { app } = createStubbedHttpApp();
  return await callback(app);
}

interface NormalisedJsonRpcError {
  readonly content: readonly unknown[];
  readonly message?: string;
}

function expectJsonRpcError(envelope: JsonRpcEnvelope): NormalisedJsonRpcError {
  const error = envelope.error;
  expect(error).toBeDefined();
  if (error === undefined) {
    throw new Error('Expected JSON-RPC error payload');
  }
  const errorRecord = ensureRecord(error, 'JSON-RPC error');
  const message = ensureOptionalString(errorRecord.message, 'JSON-RPC error message');
  const dataRecord = asOptionalRecord(errorRecord.data);
  const contentCandidate = dataRecord?.content;
  const content = Array.isArray(contentCandidate) ? contentCandidate : [];
  return { content, message };
}

async function getSampleSubject(): Promise<{ subjectSlug: string; keyStageSlug: string }> {
  const subjectsRaw = await executeStubTool('get-subjects', { params: {} });
  const subjects = ensureArray(subjectsRaw, 'stub subjects');
  const subject = ensureRecord(subjects[0], 'first subject');
  const subjectSlug = ensureString(subject.subjectSlug, 'subjectSlug');
  const keyStagesRaw = subject.keyStages ?? [];
  const keyStages = ensureArray(keyStagesRaw, 'subject keyStages');
  const firstKeyStageRecord = keyStages[0]
    ? ensureRecord(keyStages[0], 'first key stage')
    : undefined;
  const keyStageSlug =
    ensureOptionalString(firstKeyStageRecord?.keyStageSlug, 'key stage slug') ?? 'ks1';
  return { subjectSlug, keyStageSlug };
}

async function getSampleLessonReference(): Promise<{
  subjectSlug: string;
  keyStageSlug: string;
  lessonSlug: string;
}> {
  const { subjectSlug, keyStageSlug } = await getSampleSubject();
  const lessonsRaw = await executeStubTool('get-key-stages-subject-lessons', {
    keyStage: keyStageSlug,
    subject: subjectSlug,
  });
  const lessons = ensureArray(lessonsRaw, 'subject lessons');
  const firstGroup = ensureRecord(lessons[0], 'first lesson group');
  const lessonsCollection = ensureArray(firstGroup.lessons ?? [], 'lesson collection');
  const firstLesson = ensureRecord(lessonsCollection[0], 'first lesson');
  const lessonSlug = ensureString(firstLesson.lessonSlug, 'lesson slug');
  return { subjectSlug, keyStageSlug, lessonSlug };
}

describe('Streamable HTTP stubbed SDK behaviours', () => {
  it('returns key stages via get-key-stages', async () => {
    await withStubbedHttpApp(async (app) => {
      const expected = (await executeStubTool('get-key-stages', {})) as KeyStagesResponse;
      const { result } = await callTool(app, 'get-key-stages', {});
      const payload = expectSuccessfulPayload(result) as KeyStagesResponse;
      expect(payload).toEqual(expected);
    });
  });

  it('returns subject detail for a known slug', async () => {
    await withStubbedHttpApp(async (app) => {
      const { subjectSlug } = await getSampleSubject();

      const expected = (await executeStubTool('get-subject-detail', {
        subject: subjectSlug,
      })) as SubjectSummary;

      const { result } = await callTool(app, 'get-subject-detail', {
        subject: subjectSlug,
      });

      const payload = expectSuccessfulPayload(result) as SubjectSummary;
      expect(payload).toEqual(expected);
      const sequenceSlugs = payload.sequenceSlugs ?? [];
      if (sequenceSlugs.length > 0) {
        const firstSequence = ensureRecord(sequenceSlugs[0], 'first sequence slug');
        const firstSequenceSlug = ensureOptionalString(firstSequence.sequenceSlug, 'sequence slug');
        expect(firstSequenceSlug).toBeDefined();
      }
      const canonicalUrl = ensureOptionalString(payload.canonicalUrl, 'subject canonicalUrl');
      if (canonicalUrl) {
        expect(canonicalUrl).toContain(subjectSlug);
      }
    });
  });

  it('returns lesson summary payload', async () => {
    await withStubbedHttpApp(async (app) => {
      const { lessonSlug } = await getSampleLessonReference();

      const expected = (await executeStubTool('get-lessons-summary', {
        lesson: lessonSlug,
      })) as LessonSummaryResponse;

      const { result } = await callTool(app, 'get-lessons-summary', {
        lesson: lessonSlug,
      });

      const payload = expectSuccessfulPayload(result) as LessonSummaryResponse;
      expect(payload.lessonTitle).toEqual(expected.lessonTitle);
      const canonicalUrl = ensureOptionalString(payload.canonicalUrl, 'lesson canonicalUrl');
      if (canonicalUrl) {
        expect(canonicalUrl).toContain(lessonSlug);
      }
      expect(payload).toEqual(expected);
    });
  });

  it('returns search results for lessons', async () => {
    await withStubbedHttpApp(async (app) => {
      const expectedLessons = (await executeStubTool('get-search-lessons', {
        q: 'algebra',
      })) as SearchResult;

      const { result } = await callTool(app, 'get-search-lessons', {
        q: 'algebra',
      });
      const lessonPayload = expectSuccessfulPayload(result) as SearchResult;
      expect(lessonPayload).toEqual(expectedLessons);
    });
  });

  it('returns search transcript results', async () => {
    await withStubbedHttpApp(async (app) => {
      const expectedTranscripts = (await executeStubTool('get-search-transcripts', {
        q: 'algebra',
      })) as SearchResult;

      const { result } = await callTool(app, 'get-search-transcripts', {
        q: 'algebra',
      });
      const transcriptPayload = expectSuccessfulPayload(result) as SearchResult;
      expect(transcriptPayload).toEqual(expectedTranscripts);
      const firstTranscript = transcriptPayload.at(0);
      if (!firstTranscript) {
        return;
      }
      const canonicalUrl = ensureOptionalString(
        firstTranscript.canonicalUrl,
        'transcript canonicalUrl',
      );
      if (!canonicalUrl) {
        return;
      }
      const lessonSlug = ensureString(firstTranscript.lessonSlug, 'transcript lesson slug');
      expect(canonicalUrl).toContain(lessonSlug);
    });
  });

  it('returns rate limit status from stub tool', async () => {
    await withStubbedHttpApp(async (app) => {
      const expected = (await executeStubTool('get-rate-limit', {})) as RateLimitResponse;
      const { result } = await callTool(app, 'get-rate-limit', {});
      const payload = expectSuccessfulPayload(result) as RateLimitResponse;
      expect(payload.limit).toBeDefined();
      expect(payload.remaining).toBeDefined();
      expect(payload).toEqual(expected);
    });
  });

  it('reports parameter validation errors for missing arguments', async () => {
    await withStubbedHttpApp(async (app) => {
      const { result, envelope, text } = await callTool(app, 'get-subject-detail', {});
      expect(result).toBeUndefined();
      const error = expectJsonRpcError(envelope);
      const message =
        error.content.length > 0 ? readFirstTextContent(error.content) : (error.message ?? '');
      expect(message).toContain('Invalid arguments');
      expect(text).toContain('"error"');
    });
  });
});
