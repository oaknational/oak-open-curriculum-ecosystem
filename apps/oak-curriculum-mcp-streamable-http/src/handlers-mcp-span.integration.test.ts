/**
 * Characterisation Test: MCP handler span creation
 *
 * Verifies that `createMcpHandler` wraps the request in an
 * `oak.http.request.mcp` span via `observability.withSpan`.
 *
 * Safety net for merge — the `createMcpHandler` function must survive the
 * semantic merge with main's changes to handler lifecycle and auth patterns.
 *
 * Uses DI and simple fakes — no `vi.mock`, no global state.
 */

import { describe, it, expect, vi } from 'vitest';
import { createMcpHandler } from './handlers.js';
import {
  createFakeHttpObservability,
  createFakeResponse,
  createFakeExpressRequest,
  createFakeMcpServerFactory,
} from './test-helpers/fakes.js';
import type { HttpObservability, HttpSpanOptions } from './observability/http-observability.js';

describe('createMcpHandler — span characterisation', () => {
  it('wraps the request in an oak.http.request.mcp span', async () => {
    const baseObservability = createFakeHttpObservability();
    const spanCalls: { readonly name: string }[] = [];

    const withSpan: HttpObservability['withSpan'] = async <T>(
      options: HttpSpanOptions<T>,
    ): Promise<T> => {
      spanCalls.push({ name: options.name });
      return await baseObservability.withSpan(options);
    };

    const scopedObservability: HttpObservability = { ...baseObservability, withSpan };

    const { factory } = createFakeMcpServerFactory(vi.fn(async () => undefined));
    const handler = createMcpHandler(factory, scopedObservability);

    const req = createFakeExpressRequest({ body: { method: 'tools/list' } });
    const res = createFakeResponse();
    await handler(req, res);

    expect(spanCalls).toEqual([expect.objectContaining({ name: 'oak.http.request.mcp' })]);
  });
});
