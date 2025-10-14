import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  resetOakCurriculumSdkMock,
  setOakCurriculumSdkMock,
  type OakSdkModule,
} from '../../../../tests/mocks/oak-curriculum-sdk';

vi.mock('../../../../src/lib/env', () => ({
  env: () => ({ OAK_EFFECTIVE_KEY: 'test-key' }),
}));

describe('POST /api/sdk/search-lessons', () => {
  beforeEach(() => {
    resetOakCurriculumSdkMock();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 with validation issues when request parsing fails', async () => {
    const { POST } = await import('./route');

    const request = new NextRequest('http://localhost/api/sdk/search-lessons', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const payload: unknown = await response.json();
    expect(response.status).toBe(400);
    expect(readErrorArray(payload)).not.toBeUndefined();
  });

  it('forwards validated queries to the SDK client and returns its data', async () => {
    const clientGet = vi.fn().mockResolvedValue({
      response: { ok: true, status: 200, statusText: 'OK' },
      data: [{ id: 'abc' }],
    });

    setOakCurriculumSdkMock(
      () =>
        ({
          createOakPathBasedClient: vi.fn().mockReturnValue({
            '/search/lessons': {
              GET: clientGet,
            },
          }),
        }) satisfies Partial<OakSdkModule>,
    );

    const { POST } = await import('./route');

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

    const response = await POST(request);
    const body: unknown = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual([{ id: 'abc' }]);
    expect(clientGet).toHaveBeenCalledWith({
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
    const clientGet = vi.fn().mockResolvedValue({
      response: { ok: false, status: 503, statusText: 'Service Unavailable' },
      data: null,
    });

    setOakCurriculumSdkMock(
      () =>
        ({
          createOakPathBasedClient: vi.fn().mockReturnValue({
            '/search/lessons': {
              GET: clientGet,
            },
          }),
        }) satisfies Partial<OakSdkModule>,
    );

    const { POST } = await import('./route');

    const request = new NextRequest('http://localhost/api/sdk/search-lessons', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        q: 'fractions',
        keyStage: 'ks2',
        subject: 'maths',
      }),
    });

    const response = await POST(request);
    const body: unknown = await response.json();
    expect(response.status).toBe(503);
    expect(body).toEqual({ error: 'Service Unavailable' });
    expect(clientGet).toHaveBeenCalledWith({
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
