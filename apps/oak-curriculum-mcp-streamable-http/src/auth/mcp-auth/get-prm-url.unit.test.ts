/**
 * Unit tests for getPRMUrl.
 *
 * The builder delegates origin derivation to `deriveSelfOrigin` — whose
 * scheme and allowlist states are proven in
 * `host-validation-error.unit.test.ts`, and whose canonical-origin
 * supersession is proven end-to-end in
 * `canonical-origin.integration.test.ts` — and appends the RFC 9728
 * path-qualified well-known suffix. These states prove only what this
 * function adds: the appended path on success, that the canonical origin
 * is forwarded, and validation failures surfacing as `Err` for the
 * caller's 403 mapping.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc9728#section-3.1 | RFC 9728 Section 3.1}
 */

import { describe, it, expect } from 'vitest';
import { getPRMUrl } from './get-prm-url.js';

describe('getPRMUrl', () => {
  it('appends the path-qualified well-known suffix to the derived origin', () => {
    const req = { get: (header: string) => (header === 'host' ? 'example.com' : undefined) };

    const result = getPRMUrl(req, ['example.com']);

    expect(result).toStrictEqual({
      ok: true,
      value: 'https://example.com/.well-known/oauth-protected-resource/mcp',
    });
  });

  it('appends the same suffix to a configured canonical origin', () => {
    const req = { get: () => 'example-project.vercel.example' };

    const result = getPRMUrl(req, [], 'https://mcp.thenational.academy');

    expect(result).toStrictEqual({
      ok: true,
      value: 'https://mcp.thenational.academy/.well-known/oauth-protected-resource/mcp',
    });
  });

  it('surfaces a host-validation failure as Err for the caller to map to 403', () => {
    const req = { get: () => 'evil.com' };

    const result = getPRMUrl(req, ['example.com']);

    expect(result).toStrictEqual({
      ok: false,
      error: { type: 'not_allowed', hostname: 'evil.com' },
    });
  });
});
