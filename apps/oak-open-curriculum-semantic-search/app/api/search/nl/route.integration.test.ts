import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { LESSONS_SCOPE } from '../../../../src/lib/search-scopes';
import type { SearchScopeWithAll, SearchScope } from '../../../../src/types/oak';

type ParsedIntent = Extract<SearchScopeWithAll, SearchScope>;

type ParsedQuery = {
  intent: ParsedIntent;
  text: string;
  subject?: string;
  keyStage?: string;
  minLessons?: number;
};

const parseQuery = vi.hoisted(() => vi.fn<(input: string) => Promise<ParsedQuery>>());

vi.mock('../../../../src/lib/query-parser', () => ({
  parseQuery,
}));

vi.mock('../../../../src/lib/env', () => ({
  llmEnabled: () => true,
}));

import { POST } from './route';

describe('POST /api/search/nl', () => {
  beforeEach(() => {
    parseQuery.mockResolvedValue({ intent: LESSONS_SCOPE, text: 'fractions' });
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns fixture results when fixtures query parameter is provided', async () => {
    const request = new NextRequest('http://localhost/api/search/nl?fixtures=on', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions', scope: LESSONS_SCOPE }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payloadJson: unknown = await response.json();
    const payload = z.object({ results: z.array(z.unknown()).optional() }).parse(payloadJson);
    expect(payload.results?.length).toBeGreaterThan(0);
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=on');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns an empty fixture when fixtures query parameter requests empty mode', async () => {
    const request = new NextRequest('http://localhost/api/search/nl?fixtures=empty', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions', scope: LESSONS_SCOPE }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payloadJson: unknown = await response.json();
    const payload = z
      .object({
        results: z.array(z.unknown()).optional(),
        total: z.number().optional(),
      })
      .parse(payloadJson);
    expect(payload.total).toBe(0);
    expect(payload.results).toHaveLength(0);
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=empty');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns an error fixture when fixtures query parameter requests error mode', async () => {
    const request = new NextRequest('http://localhost/api/search/nl?fixtures=error', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions', scope: LESSONS_SCOPE }),
    });

    const response = await POST(request);
    expect(response.status).toBe(503);
    const payload = z.object({ error: z.string() }).parse(await response.json());
    expect(payload.error).toBe('FIXTURE_ERROR');
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=error');
    expect(fetch).not.toHaveBeenCalled();
  });
});
