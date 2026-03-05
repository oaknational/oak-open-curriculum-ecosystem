/**
 * Integration tests for response augmentation middleware.
 *
 * Tests middleware behaviour with mock Request/Response objects.
 * Verifies error containment and logger injection (DI).
 */
import { describe, it, expect } from 'vitest';
import type { Logger } from '@oaknational/logger';
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
): Promise<Response> {
  if (!middleware.onResponse) {
    throw new Error('Middleware missing onResponse handler');
  }
  const result = await middleware.onResponse({
    request,
    response,
    schemaPath: '/test',
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

describe('createResponseAugmentationMiddleware', () => {
  describe('logger injection', () => {
    it('accepts an injected logger', () => {
      const logger = createFakeLogger();
      const middleware = createResponseAugmentationMiddleware({ logger });
      expect(middleware).toBeDefined();
      expect(middleware.onResponse).toBeDefined();
    });

    it('uses injected logger for augmentation failures', async () => {
      const logger = createFakeLogger();
      const middleware = createResponseAugmentationMiddleware({ logger });

      const request = buildGetRequest('/subjects/maths');
      const body = { subjectSlug: 'maths', subjectTitle: 'Maths' };
      const response = buildJsonResponse(body);

      const result = await invokeOnResponse(middleware, request, response);

      expect(result.status).toBe(200);
      const warnCalls = logger.calls.filter((c) => c.startsWith('warn:'));
      expect(warnCalls.length).toBeGreaterThan(0);
    });
  });

  describe('error containment', () => {
    it('returns unaugmented response when augmentation throws', async () => {
      const logger = createFakeLogger();
      const middleware = createResponseAugmentationMiddleware({ logger });

      const body = { subjectSlug: 'maths', subjectTitle: 'Maths' };
      const request = buildGetRequest('/subjects/maths');
      const response = buildJsonResponse(body);

      const result = await invokeOnResponse(middleware, request, response);

      expect(result.status).toBe(200);
      const resultBody: unknown = await result.json();
      expect(resultBody).toHaveProperty('subjectSlug', 'maths');
    });
  });
});
