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

describe('POST /api/sdk/search-transcripts', () => {
  beforeEach(() => {
    resetOakCurriculumSdkMock();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('reports validation failures with a 400 response', async () => {
    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost/api/sdk/search-transcripts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const payload: unknown = await response.json();
    expect(response.status).toBe(400);
    expect(readErrorArray(payload)).not.toBeUndefined();
  });

  it('invokes the SDK client and forwards its data', async () => {
    const clientGet = vi.fn().mockResolvedValue({
      response: { ok: true, status: 200, statusText: 'OK' },
      data: [{ id: 'item-1' }],
    });

    setOakCurriculumSdkMock(
      () =>
        ({
          createOakPathBasedClient: vi.fn().mockReturnValue({
            '/search/transcripts': {
              GET: clientGet,
            },
          }),
        }) satisfies Partial<OakSdkModule>,
    );

    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost/api/sdk/search-transcripts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions', keyStage: 'ks3', subject: 'maths' }),
    });

    const response = await POST(request);
    const body: unknown = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual([{ id: 'item-1' }]);
    expect(clientGet).toHaveBeenCalledWith({
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
    const clientGet = vi.fn().mockResolvedValue({
      response: { ok: false, status: 502, statusText: 'Bad Gateway' },
      data: null,
    });

    setOakCurriculumSdkMock(
      () =>
        ({
          createOakPathBasedClient: vi.fn().mockReturnValue({
            '/search/transcripts': {
              GET: clientGet,
            },
          }),
        }) satisfies Partial<OakSdkModule>,
    );

    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost/api/sdk/search-transcripts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions', keyStage: 'invalid', subject: 'invalid' }),
    });

    const response = await POST(request);
    const body: unknown = await response.json();
    expect(response.status).toBe(502);
    expect(body).toEqual({ error: 'Bad Gateway' });
    expect(clientGet).toHaveBeenCalledWith({
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
