import { describe, expect, it } from 'vitest';

import { boundedExcerpt, redactCredentials } from '../../src/mcp-conformance/bounded-excerpt.js';

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

/**
 * The redactor's own coverage, beyond the two header/Bearer shapes. A vendor
 * error message or a reflected request realistically carries a token in a URL
 * query param or a JSON field, and those are the paths a security review found
 * uncovered (2026-08-19). The last case is the load-bearing one: the vendor's
 * own set redacts a bare `code` key, which would mask the error/status codes
 * this wrapper exists to display — so `code` is deliberately omitted, and this
 * test fails the moment someone "completes" the set by adding it back.
 */
describe('redactCredentials — query-param and JSON token shapes', () => {
  it('redacts an OAuth token in a URL query parameter', () => {
    const out = redactCredentials('reflected https://h/mcp?access_token=ya29.SECRET&page=2');

    expect(out).not.toContain('ya29.SECRET');
    expect(out).toContain('access_token=[redacted]');
    // The non-secret neighbour survives — redaction is per-parameter.
    expect(out).toContain('page=2');
  });

  it('redacts an api_key query parameter', () => {
    const out = redactCredentials('GET /x?api_key=AK-SECRET');

    expect(out).not.toContain('AK-SECRET');
    expect(out).toContain('api_key=[redacted]');
  });

  it('redacts a token carried as a JSON string field', () => {
    const out = redactCredentials('{"refresh_token":"rt-SECRET","note":"kept"}');

    expect(out).not.toContain('rt-SECRET');
    expect(out).toContain('[redacted]');
    expect(out).toContain('"note":"kept"');
  });

  it('leaves a `code` field and a `code=` diagnostic intact — the display path', () => {
    // `code` is intentionally absent from the redactor: masking it would hide
    // the vendor error codes and exit/status codes the wrapper reports.
    expect(redactCredentials('{"code":"INTERNAL_ERROR"}')).toBe('{"code":"INTERNAL_ERROR"}');
    expect(redactCredentials('exit code=1 status code=500')).toBe('exit code=1 status code=500');
  });

  it('a Bearer prefix does not swallow a following key=value token (the value must still mask)', () => {
    // The key=value rule runs BEFORE the scheme rule, so the value is already
    // masked when the scheme rule's token class (which admits `_`) reaches
    // it. The vendor guards this with a negative lookahead instead — which
    // wrongly exempts padded base64 (the next test). Found by review,
    // 2026-08-19 and 2026-08-21.
    const out = redactCredentials('Bearer access_token=SECRET-A');

    expect(out).not.toContain('SECRET-A');
    expect(out).toContain('Bearer [redacted]');
  });

  it('redacts a padded base64 bearer token — letters-then-`=` is the common opaque-token shape', () => {
    // The vendor's lookahead reads `c3VwZXJzZWNyZXQ=` as a key= prefix and
    // exempts it; rule ordering has no such hole. A regression here means the
    // lookahead came back.
    const out = redactCredentials('retrying with Bearer c3VwZXJzZWNyZXQ= now');

    expect(out).not.toContain('c3VwZXJzZWNyZXQ');
    expect(out).toBe('retrying with Bearer [redacted] now');
  });

  it('redacts mixed-case scheme spellings, preserving the original spelling', () => {
    expect(redactCredentials('sent BEARER abc.def ok')).toBe('sent BEARER [redacted] ok');
    expect(redactCredentials('sent BeArEr abc.def ok')).toBe('sent BeArEr [redacted] ok');
  });

  it('redacts bare Basic and DPoP scheme tokens, not only Bearer', () => {
    const out = redactCredentials('tried Basic dXNlcjpzM2NyZXQ= then DPoP eyJhbGc.SEC.sig');

    expect(out).not.toContain('dXNlcjpzM2NyZXQ');
    expect(out).not.toContain('eyJhbGc.SEC.sig');
    expect(out).toContain('Basic [redacted]');
    expect(out).toContain('DPoP [redacted]');
  });

  it('redacts api-key-family header lines, whose values follow a colon, not an equals', () => {
    const out = redactCredentials('x-api-key: AK-SECRET-123\napi-key: AK2\nx-auth-token: T3');

    expect(out).not.toContain('AK-SECRET-123');
    expect(out).not.toContain('AK2');
    expect(out).not.toContain('T3');
  });

  it('redacts header-named credentials appearing as JSON fields', () => {
    const out = redactCredentials('{"cookie":"sid=C-SECRET","authorization":"Bearer B-SECRET"}');

    expect(out).not.toContain('C-SECRET');
    expect(out).not.toContain('B-SECRET');
  });

  it('an unbalanced JSON quote masks the fragment but does not swallow the following lines', () => {
    // A truncated or crashed stream is exactly where these excerpts matter;
    // a value class spanning newlines would eat the next diagnostic line with
    // no marker. The fragment is still masked up to the line end.
    const out = redactCredentials('{"api_key":"AK-FRAG\nline2: refused "http://h:3333"\nline3: ok');

    expect(out).not.toContain('AK-FRAG');
    expect(out).toContain('line2: refused "http://h:3333"');
    expect(out).toContain('line3: ok');
  });

  it('redacts URL userinfo in vendor-echoed text, which never passed the target validator', () => {
    const out = redactCredentials('requested ht!tp://user:s3cret@h/mcp and https://u@h2/x');

    expect(out).not.toContain('s3cret');
    expect(out).not.toContain('u@h2');
    expect(out).toContain('//[redacted]@h/mcp');
    expect(out).toContain('//[redacted]@h2/x');
  });
});
