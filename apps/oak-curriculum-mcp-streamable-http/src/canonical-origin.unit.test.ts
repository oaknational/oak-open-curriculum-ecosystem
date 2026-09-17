/**
 * Unit tests for canonical-origin resolution.
 *
 * Behind the Cloudflare edge the app receives its own Vercel hostname in the
 * Host header, so per-request derivation cannot name the canonical address.
 * `CANONICAL_HOST` supplies it statically; no request input participates.
 *
 * @see MCP-269 — the security review ruled per-request header trust
 * unenforceable (a direct-to-origin client sends the same Host the edge
 * sends), so the canonical origin is configuration, never a header.
 */

import { describe, it, expect } from 'vitest';
import { resolveCanonicalOrigin } from './canonical-origin.js';

describe('resolveCanonicalOrigin', () => {
  it('returns undefined when no canonical host is configured', () => {
    expect(resolveCanonicalOrigin(undefined)).toBeUndefined();
  });

  it('builds an https origin from the configured host', () => {
    expect(resolveCanonicalOrigin('mcp.thenational.academy')).toBe(
      'https://mcp.thenational.academy',
    );
  });

  it('lowercases the configured host so origins compare byte-identically', () => {
    expect(resolveCanonicalOrigin('MCP.ThenationaL.Academy')).toBe(
      'https://mcp.thenational.academy',
    );
  });
});
