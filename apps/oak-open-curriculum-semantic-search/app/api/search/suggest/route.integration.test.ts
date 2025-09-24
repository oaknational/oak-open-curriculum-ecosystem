import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SuggestQuery, SuggestionResponse } from '../../../../src/lib/suggestions/types';

const runSuggestions = vi.hoisted(() =>
  vi.fn<(query: SuggestQuery) => Promise<SuggestionResponse>>(),
);

vi.mock('next/cache', () => ({
  unstable_cache: <TFn extends (...args: unknown[]) => Promise<unknown>>(fn: TFn) => fn,
}));

vi.mock('../../../../src/lib/suggestions', () => ({
  runSuggestions,
}));

import { POST } from './route';

describe('POST /api/search/suggest', () => {
  beforeEach(() => {
    runSuggestions.mockReset();
    process.env.SEARCH_INDEX_VERSION = 'v-test-index';
  });

  it('returns suggestions for valid payloads and normalises filters', async () => {
    runSuggestions.mockResolvedValueOnce({
      suggestions: [
        {
          label: 'Mountains and glaciation',
          scope: 'lessons',
          subject: 'geography',
          keyStage: 'ks4',
          url: 'https://example.com/mount',
          contexts: {},
        },
      ],
      cache: { version: 'v-test-index', ttlSeconds: 60 },
    });

    const request = new NextRequest('http://localhost/api/search/suggest', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        prefix: 'mount',
        scope: 'lessons',
        subject: 'geography',
        keyStage: 'ks4',
        limit: 8,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = (await response.json()) as SuggestionResponse;
    expect(payload.suggestions).toHaveLength(1);
    expect(runSuggestions).toHaveBeenCalledWith({
      prefix: 'mount',
      scope: 'lessons',
      subject: 'geography',
      keyStage: 'ks4',
      limit: 8,
    });
  });

  it('rejects invalid payloads with 400', async () => {
    const request = new NextRequest('http://localhost/api/search/suggest', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prefix: '', scope: 'unknown' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(runSuggestions).not.toHaveBeenCalled();
  });
});
