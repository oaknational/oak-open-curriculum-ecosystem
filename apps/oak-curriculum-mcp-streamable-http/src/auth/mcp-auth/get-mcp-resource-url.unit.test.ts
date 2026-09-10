/**
 * Unit tests for getMcpResourceUrl.
 *
 * The builder delegates origin derivation to `deriveSelfOrigin` — scheme
 * and allowlist states proven in `host-validation-error.unit.test.ts`,
 * canonical-origin supersession proven end-to-end in
 * `canonical-origin.integration.test.ts` — and appends the fixed MCP
 * resource path. These states prove only what this function adds: the expected
 * RFC 8707 audience is exactly the resource the PRM document advertises —
 * origin plus `/mcp`, nothing from the request URL — and validation
 * failures surface as `Err` for the caller's 403 mapping.
 */

import { describe, it, expect } from 'vitest';
import { getMcpResourceUrl } from './get-mcp-resource-url.js';

describe('getMcpResourceUrl', () => {
  it('the expected audience is the fixed /mcp resource on the derived origin', () => {
    const req = { get: (header: string) => (header === 'host' ? 'example.com' : undefined) };

    const result = getMcpResourceUrl(req, ['example.com']);

    expect(result).toStrictEqual({ ok: true, value: 'https://example.com/mcp' });
  });

  it('a configured canonical origin yields the canonical resource', () => {
    const req = { get: () => 'example-project.vercel.example' };

    const result = getMcpResourceUrl(req, [], 'https://mcp.thenational.academy');

    expect(result).toStrictEqual({ ok: true, value: 'https://mcp.thenational.academy/mcp' });
  });

  it('surfaces a host-validation failure as Err for the caller to map to 403', () => {
    const req = { get: () => undefined };

    const result = getMcpResourceUrl(req, ['example.com']);

    expect(result).toStrictEqual({ ok: false, error: { type: 'missing_host' } });
  });
});
