import { describe, it, expect } from 'vitest';
import { deriveSelfOrigin } from './auth-routes.js';

function createRequestWithHost(host: string | undefined): {
  get(name: string): string | undefined;
} {
  return {
    get(name: string): string | undefined {
      if (name.toLowerCase() === 'host') {
        return host;
      }
      return undefined;
    },
  };
}

describe('deriveSelfOrigin', () => {
  it('returns err with missing_host when host header is missing', () => {
    const req = createRequestWithHost(undefined);
    const result = deriveSelfOrigin(req, ['localhost']);

    expect(result).toStrictEqual({
      ok: false,
      error: { type: 'missing_host' },
    });
  });

  it('returns err with not_allowed when host is not allow-listed', () => {
    const req = createRequestWithHost('evil.com');
    const result = deriveSelfOrigin(req, ['localhost', 'example.com']);

    expect(result).toStrictEqual({
      ok: false,
      error: { type: 'not_allowed', hostname: 'evil.com' },
    });
  });

  it('returns ok origin matching allowed hosts case-insensitively', () => {
    const req = createRequestWithHost('EXAMPLE.COM');
    const result = deriveSelfOrigin(req, ['example.com']);

    expect(result).toStrictEqual({ ok: true, value: 'https://EXAMPLE.COM' });
  });

  it('uses http for localhost and preserves port', () => {
    const req = createRequestWithHost('localhost:3333');
    const result = deriveSelfOrigin(req, ['localhost']);

    expect(result).toStrictEqual({ ok: true, value: 'http://localhost:3333' });
  });

  it('uses http for uppercase localhost host header', () => {
    const req = createRequestWithHost('LOCALHOST:3333');
    const result = deriveSelfOrigin(req, ['localhost']);

    expect(result).toStrictEqual({ ok: true, value: 'http://LOCALHOST:3333' });
  });

  it('uses http for ipv4 loopback and preserves port', () => {
    const req = createRequestWithHost('127.0.0.1:3333');
    const result = deriveSelfOrigin(req, ['127.0.0.1']);

    expect(result).toStrictEqual({ ok: true, value: 'http://127.0.0.1:3333' });
  });

  it('uses http for ipv6 loopback with brackets', () => {
    const req = createRequestWithHost('[::1]:3333');
    const result = deriveSelfOrigin(req, ['::1']);

    expect(result).toStrictEqual({ ok: true, value: 'http://[::1]:3333' });
  });

  it('uses https for non-loopback hosts', () => {
    const req = createRequestWithHost('api.example.com:8443');
    const result = deriveSelfOrigin(req, ['api.example.com']);

    expect(result).toStrictEqual({ ok: true, value: 'https://api.example.com:8443' });
  });

  it('allows wildcard hosts for subdomains', () => {
    const req = createRequestWithHost('api.example.com');
    const result = deriveSelfOrigin(req, ['*.example.com']);

    expect(result).toStrictEqual({ ok: true, value: 'https://api.example.com' });
  });

  it('returns err with invalid_format for malformed hosts with userinfo-like syntax', () => {
    const req = createRequestWithHost('example.com:443@evil.com');
    const result = deriveSelfOrigin(req, ['example.com', '*.example.com']);

    expect(result).toStrictEqual({
      ok: false,
      error: { type: 'invalid_format', host: 'example.com:443@evil.com' },
    });
  });

  it('returns err with invalid_format for malformed bracketed hosts', () => {
    const req = createRequestWithHost('[::1]evil');
    const result = deriveSelfOrigin(req, ['::1']);

    expect(result).toStrictEqual({
      ok: false,
      error: { type: 'invalid_format', host: '[::1]evil' },
    });
  });
});
