/**
 * @fileoverview Integration tests for POST /api/sdk/search-transcripts.
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

import { handleSearchTranscripts, type SearchTranscriptsDependencies } from './route';

/**
 * Creates a simple fake SDK client for testing.
 * No vi.mock, no complex mocking infrastructure - just a plain object.
 */
function createFakeClient(mockGet: ReturnType<typeof vi.fn>) {
  return {
    '/search/transcripts': {
      GET: mockGet,
    },
  };
}

/**
 * Creates test dependencies with a fake client.
 */
function createTestDeps(mockGet: ReturnType<typeof vi.fn>): SearchTranscriptsDependencies {
  return {
    createClient: () => createFakeClient(mockGet) as never,
    apiKey: 'test-api-key',
  };
}

describe('POST /api/sdk/search-transcripts', () => {
  it('reports validation failures with a 400 response', async () => {
    const mockGet = vi.fn();
    const deps = createTestDeps(mockGet);

    const request = new NextRequest('http://localhost/api/sdk/search-transcripts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await handleSearchTranscripts(request, deps);
    const payload: unknown = await response.json();

    expect(response.status).toBe(400);
    expect(readErrorArray(payload)).not.toBeUndefined();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('invokes the SDK client and forwards its data', async () => {
    const mockGet = vi.fn().mockResolvedValue({
      response: { ok: true, status: 200, statusText: 'OK' },
      data: [{ id: 'item-1' }],
    });
    const deps = createTestDeps(mockGet);

    const request = new NextRequest('http://localhost/api/sdk/search-transcripts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions', keyStage: 'ks3', subject: 'maths' }),
    });

    const response = await handleSearchTranscripts(request, deps);
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([{ id: 'item-1' }]);
    expect(mockGet).toHaveBeenCalledWith({
      params: {
        query: {
          q: 'fractions',
          keyStage: undefined,
          subject: undefined,
        },
      },
    });
  });

  it('drops invalid optional filters and propagates upstream failures', async () => {
    const mockGet = vi.fn().mockResolvedValue({
      response: { ok: false, status: 502, statusText: 'Bad Gateway' },
      data: null,
    });
    const deps = createTestDeps(mockGet);

    const request = new NextRequest('http://localhost/api/sdk/search-transcripts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions', keyStage: 'invalid', subject: 'invalid' }),
    });

    const response = await handleSearchTranscripts(request, deps);
    const body: unknown = await response.json();

    expect(response.status).toBe(502);
    expect(body).toEqual({ error: 'Bad Gateway' });
    expect(mockGet).toHaveBeenCalledWith({
      params: {
        query: {
          q: 'fractions',
          keyStage: undefined,
          subject: undefined,
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
