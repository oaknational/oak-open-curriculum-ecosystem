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
  it('throws when host header is missing', () => {
    const req = createRequestWithHost(undefined);

    expect(() => deriveSelfOrigin(req, ['localhost'])).toThrow(
      'Cannot generate OAuth metadata: missing host header',
    );
  });

  it('throws when host is not allow-listed', () => {
    const req = createRequestWithHost('evil.com');

    expect(() => deriveSelfOrigin(req, ['localhost', 'example.com'])).toThrow(
      "Rejected Host header 'evil.com': not in allowed hosts list",
    );
  });

  it('matches allowed hosts case-insensitively', () => {
    const req = createRequestWithHost('EXAMPLE.COM');

    expect(deriveSelfOrigin(req, ['example.com'])).toBe('https://EXAMPLE.COM');
  });

  it('uses http for localhost and preserves port', () => {
    const req = createRequestWithHost('localhost:3333');

    expect(deriveSelfOrigin(req, ['localhost'])).toBe('http://localhost:3333');
  });

  it('uses http for uppercase localhost host header', () => {
    const req = createRequestWithHost('LOCALHOST:3333');

    expect(deriveSelfOrigin(req, ['localhost'])).toBe('http://LOCALHOST:3333');
  });

  it('uses http for ipv4 loopback and preserves port', () => {
    const req = createRequestWithHost('127.0.0.1:3333');

    expect(deriveSelfOrigin(req, ['127.0.0.1'])).toBe('http://127.0.0.1:3333');
  });

  it('uses http for ipv6 loopback with brackets', () => {
    const req = createRequestWithHost('[::1]:3333');

    expect(deriveSelfOrigin(req, ['::1'])).toBe('http://[::1]:3333');
  });

  it('uses https for non-loopback hosts', () => {
    const req = createRequestWithHost('api.example.com:8443');

    expect(deriveSelfOrigin(req, ['api.example.com'])).toBe('https://api.example.com:8443');
  });

  it('allows wildcard hosts for subdomains', () => {
    const req = createRequestWithHost('api.example.com');

    expect(deriveSelfOrigin(req, ['*.example.com'])).toBe('https://api.example.com');
  });

  it('rejects malformed hosts with userinfo-like syntax', () => {
    const req = createRequestWithHost('example.com:443@evil.com');

    expect(() => deriveSelfOrigin(req, ['example.com', '*.example.com'])).toThrow(
      "Rejected Host header 'example.com:443@evil.com': invalid host header format",
    );
  });

  it('rejects malformed bracketed hosts', () => {
    const req = createRequestWithHost('[::1]evil');

    expect(() => deriveSelfOrigin(req, ['::1'])).toThrow(
      "Rejected Host header '[::1]evil': invalid host header format",
    );
  });
});
