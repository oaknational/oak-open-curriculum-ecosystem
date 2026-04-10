/**
 * Integration tests for response augmentation middleware.
 *
 * Tests middleware behaviour with mock Request/Response objects.
 * Verifies error containment and logger injection (DI).
 */
import { describe, it, expect } from 'vitest';
import type { Logger } from '@oaknational/logger';
import type { JsonBody200 } from '@oaknational/sdk-codegen/api-schema';
import { createQuerySerializer, defaultBodySerializer, defaultPathSerializer } from 'openapi-fetch';
import { createResponseAugmentationMiddleware } from './response-augmentation.js';

function createFakeLogger(): Logger & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    trace(msg: string): void {
      calls.push(`trace: ${msg}`);
    },
    debug(msg: string): void {
      calls.push(`debug: ${msg}`);
    },
    info(msg: string): void {
      calls.push(`info: ${msg}`);
    },
    warn(msg: string): void {
      calls.push(`warn: ${msg}`);
    },
    error(msg: string): void {
      calls.push(`error: ${msg}`);
    },
    fatal(msg: string): void {
      calls.push(`fatal: ${msg}`);
    },
  };
}

function buildGetRequest(path: string): Request {
  return new Request(`https://api.example.com/api/v0${path}`, {
    method: 'GET',
  });
}

function buildJsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

async function invokeOnResponse(
  middleware: ReturnType<typeof createResponseAugmentationMiddleware>,
  request: Request,
  response: Response,
  schemaPath: string,
): Promise<Response> {
  if (!middleware.onResponse) {
    throw new Error('Middleware missing onResponse handler');
  }
  const result = await middleware.onResponse({
    request,
    response,
    schemaPath,
    params: {},
    id: 'test-invocation',
    options: {
      baseUrl: 'https://api.example.com',
      parseAs: 'json',
      querySerializer: createQuerySerializer(),
      bodySerializer: defaultBodySerializer,
      pathSerializer: defaultPathSerializer,
      fetch: globalThis.fetch,
    },
  });
  if (!(result instanceof Response)) {
    throw new Error('Expected onResponse to return a Response');
  }
  return result;
}

async function expectLessonOakUrl(
  concretePath: string,
  schemaPath: string,
  body: unknown,
): Promise<void> {
  const logger = createFakeLogger();
  const middleware = createResponseAugmentationMiddleware({ logger });
  const request = buildGetRequest(concretePath);
  const response = buildJsonResponse(body);

  const result = await invokeOnResponse(middleware, request, response, schemaPath);
  const resultBody: unknown = await result.json();

  expect(resultBody).toHaveProperty(
    'oakUrl',
    'https://www.thenational.academy/teachers/lessons/add-two-numbers',
  );
}

describe('createResponseAugmentationMiddleware', () => {
  describe('schema validation', () => {
    it('returns unaugmented response when body fails schema validation', async () => {
      const logger = createFakeLogger();
      const middleware = createResponseAugmentationMiddleware({ logger });

      const request = buildGetRequest('/subjects/maths');
      const body = { subjectSlug: 'maths', subjectTitle: 'Maths' };
      const response = buildJsonResponse(body);

      const result = await invokeOnResponse(middleware, request, response, '/subjects/{subject}');

      expect(result.status).toBe(200);
      const resultBody: unknown = await result.json();
      expect(resultBody).toEqual(body);
      expect(resultBody).not.toHaveProperty('oakUrl');
    });
  });

  describe('error containment', () => {
    it('returns unaugmented response and logs warning when augmentation throws', async () => {
      const logger = createFakeLogger();
      const middleware = createResponseAugmentationMiddleware({ logger });

      const body = {
        subjectTitle: 'Maths',
        subjectSlug: 'maths',
        sequenceSlugs: [],
        years: [],
        keyStages: [],
      };
      const request = buildGetRequest('/subjects/maths');
      const response = buildJsonResponse(body);

      const result = await invokeOnResponse(middleware, request, response, '/subjects/{subject}');

      expect(result.status).toBe(200);
      const resultBody: unknown = await result.json();
      expect(resultBody).toHaveProperty('subjectSlug', 'maths');
      expect(resultBody).not.toHaveProperty('oakUrl');
      const warnCalls = logger.calls.filter((c) => c.startsWith('warn:'));
      expect(warnCalls.length).toBeGreaterThan(0);
    });
  });

  describe('lesson sub-resource paths', () => {
    it('uses the lesson path segment for lesson summary responses', async () => {
      const body = {
        lessonTitle: 'Add Two Numbers',
        canonicalUrl:
          'https://www.thenational.academy/teachers/programmes/maths/units/place-value/lessons/add-two-numbers',
        oakUrl: 'https://www.thenational.academy/teachers/lessons/add-two-numbers',
        unitSlug: 'place-value',
        unitTitle: 'Place Value',
        subjectSlug: 'maths',
        subjectTitle: 'Maths',
        keyStageSlug: 'ks1',
        keyStageTitle: 'Key Stage 1',
        lessonKeywords: [],
        keyLearningPoints: [],
        misconceptionsAndCommonMistakes: [],
        teacherTips: [],
        contentGuidance: null,
        supervisionLevel: null,
        downloadsAvailable: true,
      } as const satisfies JsonBody200<'/lessons/{lesson}/summary', 'get'>;
      await expectLessonOakUrl(
        '/lessons/add-two-numbers/summary',
        '/lessons/{lesson}/summary',
        body,
      );
    });

    it('uses the lesson path segment for lesson transcript responses', async () => {
      const body = {
        transcript: 'This is the lesson transcript text',
        vtt: 'WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nThis is the lesson transcript text',
      } as const satisfies JsonBody200<'/lessons/{lesson}/transcript', 'get'>;
      await expectLessonOakUrl(
        '/lessons/add-two-numbers/transcript',
        '/lessons/{lesson}/transcript',
        body,
      );
    });

    it('uses the lesson path segment for lesson quiz responses', async () => {
      const body = {
        starterQuiz: [],
        exitQuiz: [],
      } as const satisfies JsonBody200<'/lessons/{lesson}/quiz', 'get'>;
      await expectLessonOakUrl('/lessons/add-two-numbers/quiz', '/lessons/{lesson}/quiz', body);
    });

    it('uses the lesson path segment for lesson asset responses', async () => {
      const body = {
        oakUrl: 'https://www.thenational.academy/teachers/lessons/add-two-numbers',
        assets: [],
      } as const satisfies JsonBody200<'/lessons/{lesson}/assets', 'get'>;
      await expectLessonOakUrl('/lessons/add-two-numbers/assets', '/lessons/{lesson}/assets', body);
    });
  });
});
