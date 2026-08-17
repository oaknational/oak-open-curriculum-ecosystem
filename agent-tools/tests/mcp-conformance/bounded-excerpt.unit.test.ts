import { describe, expect, it } from 'vitest';

import { boundedExcerpt } from '../../src/mcp-conformance/bounded-excerpt.js';

/**
 * The credential-redaction seam. Excerpts ride failure reasons onto STDOUT
 * and into CI job logs — outside the retention layer's 0600 discipline — so
 * any credential shape in a child stream must be gone BEFORE the excerpt is
 * composed. These tests pin that choke point (security review, 2026-08-15).
 */
describe('boundedExcerpt — credential shapes never reach a composed excerpt', () => {
  it('redacts an authorization header value from a stream excerpt', () => {
    const excerpt = boundedExcerpt(
      'stderr',
      'request failed\nAuthorization: Bearer sk-live-abc123.def\nretrying',
    );

    expect(excerpt).not.toContain('sk-live-abc123.def');
    expect(excerpt).toContain('[redacted]');
    // The surrounding diagnostics survive — redaction is surgical, not a
    // whole-line drop, so the failure stays explainable.
    expect(excerpt).toContain('request failed');
    expect(excerpt).toContain('retrying');
  });

  it('redacts a bare bearer token outside any header line', () => {
    const excerpt = boundedExcerpt('stderr', 'sent Bearer eyJhbGciOiJIUzI1NiJ9.payload.sig ok');

    expect(excerpt).not.toContain('eyJhbGciOiJIUzI1NiJ9');
    expect(excerpt).toContain('Bearer [redacted]');
  });

  it('redacts cookie headers, whose values are session credentials', () => {
    const excerpt = boundedExcerpt('stderr', 'Set-Cookie: session=deadbeef; HttpOnly');

    expect(excerpt).not.toContain('deadbeef');
  });

  it('leaves credential-free diagnostics untouched', () => {
    const excerpt = boundedExcerpt('stderr', 'ECONNREFUSED 127.0.0.1:3333');

    expect(excerpt).toBe(' — stderr: ECONNREFUSED 127.0.0.1:3333');
  });
});
