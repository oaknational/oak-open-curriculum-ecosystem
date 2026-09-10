/**
 * Exercises the generated pagination seam end to end: a real openapi-fetch
 * path-based client over a fake `fetch`, through the generated descriptor's
 * `invoke` (which reads the upstream `Link` header) and the generated
 * executor's handoff into the tool result.
 *
 * The helper tests stop before this seam and the universal-executor tests
 * inject a result after it; this suite is the one that would fail if the
 * generated header lookup or the descriptor-to-executor passthrough broke.
 */

import { describe, it, expect } from 'vitest';
import { createPathBasedClient } from 'openapi-fetch';
import type { paths } from './types/generated/api-schema/api-paths-types.js';
import { callTool } from './mcp-tools.js';

const UPSTREAM = 'https://upstream.test';

const KEYWORDS_PAGE = [
  {
    keyword: 'Arc',
    description: 'An arc is part of any curve.',
    keyStageSlug: 'ks2',
    subjectSlug: 'maths',
    lessonSlugs: ['use-the-unit-of-degrees-as-a-standard-unit-to-measure-angles'],
  },
];

/** A client whose upstream answers every request with the given headers and body. */
function clientAnswering(headers: Record<string, string>, requests: string[]) {
  return createPathBasedClient<paths>({
    baseUrl: UPSTREAM,
    fetch: async (request: Request) => {
      requests.push(request.url);
      return new Response(JSON.stringify(KEYWORDS_PAGE), {
        status: 200,
        headers: { 'content-type': 'application/json', ...headers },
      });
    },
  });
}

describe('generated pagination seam (descriptor invoke -> executor result)', () => {
  it('carries the next page from the upstream Link header into the tool result', async () => {
    const requests: string[] = [];
    const client = clientAnswering(
      { link: `<${UPSTREAM}/keywords?offset=20&limit=20>; rel="next"` },
      requests,
    );

    const result = await callTool('get-keywords', client, { subject: 'maths' });

    expect(requests).toHaveLength(1);
    expect(requests[0]).toContain('/keywords?');
    expect(requests[0]).toContain('subject=maths');
    expect(result).toEqual({
      status: 200,
      data: KEYWORDS_PAGE,
      pagination: { hasMore: true, nextOffset: 20, nextLimit: 20 },
    });
  });

  it('reports the terminal page when upstream sends no Link header', async () => {
    const client = clientAnswering({}, []);

    const result = await callTool('get-keywords', client, { subject: 'maths' });

    expect(result).toEqual({ status: 200, data: KEYWORDS_PAGE, pagination: { hasMore: false } });
  });
});
