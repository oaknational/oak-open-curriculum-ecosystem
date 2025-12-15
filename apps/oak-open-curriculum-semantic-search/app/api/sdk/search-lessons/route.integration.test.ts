/**
 * @fileoverview Integration tests for POST /api/sdk/search-lessons.
 *
 * Tests use dependency injection per ADR-078:
 * - Product code accepts dependencies as parameters
 * - Tests pass simple fakes, no vi.mock or dynamic imports
 * - No module cache manipulation, no race conditions
 *
 * @see `.agent/directives-and-memory/testing-strategy.md`
 * @see `docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md`
 */
import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

import { handleSearchLessons, type SearchLessonsDependencies } from './route';

/**
 * Creates a simple fake SDK client for testing.
 * No vi.mock, no complex mocking infrastructure - just a plain object.
 */
function createFakeClient(mockGet: ReturnType<typeof vi.fn>) {
  return {
    '/search/lessons': {
      GET: mockGet,
    },
  };
}

/**
 * Creates test dependencies with a fake client.
 */
function createTestDeps(mockGet: ReturnType<typeof vi.fn>): SearchLessonsDependencies {
  return {
    createClient: () => createFakeClient(mockGet) as never,
    apiKey: 'test-api-key',
  };
}

describe('POST /api/sdk/search-lessons', () => {
  it('returns 400 with validation issues when request parsing fails', async () => {
    const mockGet = vi.fn();
    const deps = createTestDeps(mockGet);

    const request = new NextRequest('http://localhost/api/sdk/search-lessons', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await handleSearchLessons(request, deps);
    const payload: unknown = await response.json();

    expect(response.status).toBe(400);
    expect(readErrorArray(payload)).not.toBeUndefined();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('forwards validated queries to the SDK client and returns its data', async () => {
    const mockGet = vi.fn().mockResolvedValue({
      response: { ok: true, status: 200, statusText: 'OK' },
      data: [{ id: 'abc' }],
    });
    const deps = createTestDeps(mockGet);

    const request = new NextRequest('http://localhost/api/sdk/search-lessons', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        q: '  fractions ',
        keyStage: 'ks2',
        subject: 'maths',
        unit: 'unit-1',
        limit: 25,
        offset: 10,
      }),
    });

    const response = await handleSearchLessons(request, deps);
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([{ id: 'abc' }]);
    expect(mockGet).toHaveBeenCalledWith({
      params: {
        query: {
          q: '  fractions ',
          keyStage: 'ks2',
          subject: 'maths',
          unit: 'unit-1',
          limit: 20,
          offset: 0,
        },
      },
    });
  });

  it('normalises optional parameters and propagates upstream errors', async () => {
    const mockGet = vi.fn().mockResolvedValue({
      response: { ok: false, status: 503, statusText: 'Service Unavailable' },
      data: null,
    });
    const deps = createTestDeps(mockGet);

    const request = new NextRequest('http://localhost/api/sdk/search-lessons', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        q: 'fractions',
        keyStage: 'ks2',
        subject: 'maths',
      }),
    });

    const response = await handleSearchLessons(request, deps);
    const body: unknown = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({ error: 'Service Unavailable' });
    expect(mockGet).toHaveBeenCalledWith({
      params: {
        query: {
          q: 'fractions',
          keyStage: 'ks2',
          subject: 'maths',
          unit: undefined,
          limit: 20,
          offset: 0,
        },
      },
    });
  });
});

function readErrorArray(value: unknown): unknown[] | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }
  const descriptor = Object.getOwnPropertyDescriptor(value, 'error');
  const property: unknown = descriptor?.value;
  return Array.isArray(property) ? property : undefined;
}
