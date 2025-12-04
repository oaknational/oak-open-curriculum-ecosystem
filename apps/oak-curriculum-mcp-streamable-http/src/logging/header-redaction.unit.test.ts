import { describe, it, expect } from 'vitest';
import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'node:http';

import { redactHeaders, redactHeadersSummary } from './header-redaction.js';

describe('redactHeaders - full redaction', () => {
  it('should fully redact Authorization header', () => {
    const headers: IncomingHttpHeaders = {
      authorization: 'Bearer secret-token-12345',
    };
    const redacted = redactHeaders(headers);
    expect(redacted.authorization).toBe('[REDACTED]');
  });

  it('should fully redact Cookie header', () => {
    const headers: IncomingHttpHeaders = {
      cookie: 'session=abc123; user=john',
    };
    const redacted = redactHeaders(headers);
    expect(redacted.cookie).toBe('[REDACTED]');
  });

  it('should fully redact Set-Cookie header', () => {
    const headers: OutgoingHttpHeaders = {
      'set-cookie': 'session=abc123; HttpOnly; Secure',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['set-cookie']).toBe('[REDACTED]');
  });

  it('should fully redact X-API-Key header', () => {
    const headers: IncomingHttpHeaders = {
      'x-api-key': 'api-key-secret-value',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['x-api-key']).toBe('[REDACTED]');
  });

  it('should fully redact X-Auth-Token header', () => {
    const headers: IncomingHttpHeaders = {
      'x-auth-token': 'auth-token-secret-value',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['x-auth-token']).toBe('[REDACTED]');
  });

  it('should fully redact X-Vercel-OIDC-Token header', () => {
    const headers: IncomingHttpHeaders = {
      'x-vercel-oidc-token': 'oidc-token-secret-value',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['x-vercel-oidc-token']).toBe('[REDACTED]');
  });

  it('should fully redact X-Vercel-Proxy-Signature header', () => {
    const headers: IncomingHttpHeaders = {
      'x-vercel-proxy-signature': 'proxy-signature-secret-value',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['x-vercel-proxy-signature']).toBe('[REDACTED]');
  });

  it('should fully redact Authorization header regardless of case', () => {
    const headersLower: IncomingHttpHeaders = {
      authorization: 'Bearer token1',
    };
    const headersUpper: IncomingHttpHeaders = {
      AUTHORIZATION: 'Bearer token2',
    };
    const headersMixed: IncomingHttpHeaders = {
      Authorization: 'Bearer token3',
    };

    expect(redactHeaders(headersLower).authorization).toBe('[REDACTED]');
    expect(redactHeaders(headersUpper).AUTHORIZATION).toBe('[REDACTED]');
    expect(redactHeaders(headersMixed).Authorization).toBe('[REDACTED]');
  });

  it('should fully redact Cookie header regardless of case', () => {
    const headersLower: IncomingHttpHeaders = {
      cookie: 'session=abc',
    };
    const headersUpper: IncomingHttpHeaders = {
      COOKIE: 'session=def',
    };

    expect(redactHeaders(headersLower).cookie).toBe('[REDACTED]');
    expect(redactHeaders(headersUpper).COOKIE).toBe('[REDACTED]');
  });
});

describe('redactHeaders - partial redaction', () => {
  it('should partially redact CF-Connecting-IP with long IP address', () => {
    const headers: IncomingHttpHeaders = {
      'cf-connecting-ip': '192.168.1.100',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['cf-connecting-ip']).toBe('192.....100');
  });

  it('should partially redact X-Forwarded-For with long IP address', () => {
    const headers: IncomingHttpHeaders = {
      'x-forwarded-for': '203.0.113.195',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['x-forwarded-for']).toBe('203.....195');
  });

  it('should partially redact X-Real-IP with long IP address', () => {
    const headers: IncomingHttpHeaders = {
      'x-real-ip': '198.51.100.42',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['x-real-ip']).toBe('198....0.42');
  });

  it('should partially redact X-Vercel-Forwarded-For with long IP', () => {
    const headers: IncomingHttpHeaders = {
      'x-vercel-forwarded-for': '172.16.254.1',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['x-vercel-forwarded-for']).toBe('172....54.1');
  });

  it('should partially redact X-Vercel-Proxied-For with long IP', () => {
    const headers: IncomingHttpHeaders = {
      'x-vercel-proxied-for': '10.0.0.255',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['x-vercel-proxied-for']).toBe('10.0....255');
  });

  it('should fully redact short IP address (8 chars or less)', () => {
    const headers: IncomingHttpHeaders = {
      'cf-connecting-ip': '1.2.3.4',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['cf-connecting-ip']).toBe('[REDACTED]');
  });

  it('should fully redact very short value (8 chars or less)', () => {
    const headers: IncomingHttpHeaders = {
      'x-forwarded-for': 'short',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['x-forwarded-for']).toBe('[REDACTED]');
  });

  it('should handle array of IPs with partial redaction', () => {
    const headers: IncomingHttpHeaders = {
      'x-forwarded-for': ['192.168.1.100', '203.0.113.195'],
    };
    const redacted = redactHeaders(headers);
    // Arrays are joined with ', ': '192.168.1.100, 203.0.113.195' (30 chars)
    // First 4: '192.' Last 4: '.195'
    expect(redacted['x-forwarded-for']).toBe('192.....195');
  });

  it('should fully redact array with short values', () => {
    const headers: IncomingHttpHeaders = {
      'x-real-ip': ['1.2.3.4'],
    };
    const redacted = redactHeaders(headers);
    // Array joined is short (7 chars)
    expect(redacted['x-real-ip']).toBe('[REDACTED]');
  });

  it('should handle IPv6 addresses with partial redaction', () => {
    const headers: IncomingHttpHeaders = {
      'cf-connecting-ip': '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['cf-connecting-ip']).toBe('2001...7334');
  });
});

describe('redactHeaders - preservation', () => {
  it('should preserve Accept header unchanged', () => {
    const headers: IncomingHttpHeaders = {
      accept: 'application/json',
    };
    const redacted = redactHeaders(headers);
    expect(redacted.accept).toBe('application/json');
  });

  it('should preserve Content-Type header unchanged', () => {
    const headers: IncomingHttpHeaders = {
      'content-type': 'application/json; charset=utf-8',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['content-type']).toBe('application/json; charset=utf-8');
  });

  it('should preserve User-Agent header unchanged', () => {
    const headers: IncomingHttpHeaders = {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['user-agent']).toBe('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  });

  it('should preserve custom headers unchanged', () => {
    const headers: IncomingHttpHeaders = {
      'x-custom-header': 'custom-value',
      'x-request-id': 'req-12345',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['x-custom-header']).toBe('custom-value');
    expect(redacted['x-request-id']).toBe('req-12345');
  });

  it('should return empty object for empty headers', () => {
    const headers: IncomingHttpHeaders = {};
    const redacted = redactHeaders(headers);
    expect(redacted).toEqual({});
  });

  it('should preserve Host header unchanged', () => {
    const headers: IncomingHttpHeaders = {
      host: 'localhost:3000',
    };
    const redacted = redactHeaders(headers);
    expect(redacted.host).toBe('localhost:3000');
  });
});

describe('redactHeaders - edge cases', () => {
  it('should handle undefined header value', () => {
    const headers: IncomingHttpHeaders = {
      'x-custom': undefined,
    };
    const redacted = redactHeaders(headers);
    expect(redacted['x-custom']).toBe('[undefined]');
  });

  it('should handle empty string value for sensitive header', () => {
    const headers: IncomingHttpHeaders = {
      authorization: '',
    };
    const redacted = redactHeaders(headers);
    expect(redacted.authorization).toBe('[REDACTED]');
  });

  it('should handle empty string value for non-sensitive header', () => {
    const headers: IncomingHttpHeaders = {
      accept: '',
    };
    const redacted = redactHeaders(headers);
    expect(redacted.accept).toBe('');
  });

  it('should handle very long header value with full redaction', () => {
    const longValue = 'Bearer ' + 'a'.repeat(1000);
    const headers: IncomingHttpHeaders = {
      authorization: longValue,
    };
    const redacted = redactHeaders(headers);
    expect(redacted.authorization).toBe('[REDACTED]');
  });

  it('should handle very long header value with partial redaction', () => {
    const longValue = '192.168.1.100' + ':' + '0'.repeat(100);
    const headers: IncomingHttpHeaders = {
      'cf-connecting-ip': longValue,
    };
    const redacted = redactHeaders(headers);
    // First 4 chars + '...' + last 4 chars
    expect(redacted['cf-connecting-ip']).toBe('192....0000');
  });

  it('should handle multiple sensitive headers in same object', () => {
    const headers: IncomingHttpHeaders = {
      authorization: 'Bearer token',
      cookie: 'session=abc',
      'x-api-key': 'key123',
    };
    const redacted = redactHeaders(headers);
    expect(redacted.authorization).toBe('[REDACTED]');
    expect(redacted.cookie).toBe('[REDACTED]');
    expect(redacted['x-api-key']).toBe('[REDACTED]');
  });

  it('should handle mixed sensitive and non-sensitive headers', () => {
    const headers: IncomingHttpHeaders = {
      authorization: 'Bearer token',
      accept: 'application/json',
      cookie: 'session=abc',
      'content-type': 'text/html',
    };
    const redacted = redactHeaders(headers);
    expect(redacted.authorization).toBe('[REDACTED]');
    expect(redacted.accept).toBe('application/json');
    expect(redacted.cookie).toBe('[REDACTED]');
    expect(redacted['content-type']).toBe('text/html');
  });

  it('should handle number values by converting to string', () => {
    const headers: Record<string, string | number | undefined> = {
      'content-length': 1234,
      'x-custom-number': 5678,
    };
    const redacted = redactHeaders(headers);
    expect(redacted['content-length']).toBe('1234');
    expect(redacted['x-custom-number']).toBe('5678');
  });

  it('should handle array with mixed short and long values for partial redaction', () => {
    const headers: IncomingHttpHeaders = {
      'x-forwarded-for': ['192.168.1.100', '1.2.3.4'],
    };
    const redacted = redactHeaders(headers);
    // Joined: '192.168.1.100, 1.2.3.4' (24 chars)
    // First 4: '192.' Last 4: '3.4'
    expect(redacted['x-forwarded-for']).toBe('192.....3.4');
  });

  it('should handle case-insensitive matching for partial redaction', () => {
    const headers: IncomingHttpHeaders = {
      'CF-CONNECTING-IP': '192.168.1.100',
    };
    const redacted = redactHeaders(headers);
    expect(redacted['CF-CONNECTING-IP']).toBe('192.....100');
  });
});

describe('redactHeadersSummary - full redaction', () => {
  it('should redact Authorization in summary', () => {
    const headers: IncomingHttpHeaders = {
      authorization: 'Bearer secret',
    };
    const redacted = redactHeadersSummary(headers);
    expect(redacted.authorization).toBe('[REDACTED]');
  });

  it('should redact Cookie in summary', () => {
    const headers: IncomingHttpHeaders = {
      cookie: 'session=abc',
    };
    const redacted = redactHeadersSummary(headers);
    expect(redacted.cookie).toBe('[REDACTED]');
  });

  it('should omit non-interesting headers from summary', () => {
    const headers: IncomingHttpHeaders = {
      'x-custom-header': 'custom-value',
      'x-non-interesting': 'value',
    };
    const redacted = redactHeadersSummary(headers);
    expect(redacted['x-custom-header']).toBeUndefined();
    expect(redacted['x-non-interesting']).toBeUndefined();
  });
});

describe('redactHeadersSummary - partial redaction', () => {
  it('should partially redact X-Forwarded-For in summary', () => {
    const headers: IncomingHttpHeaders = {
      'x-forwarded-for': '192.168.1.100',
    };
    const redacted = redactHeadersSummary(headers);
    expect(redacted['x-forwarded-for']).toBe('192.....100');
  });

  it('should partially redact X-Real-IP in summary', () => {
    const headers: IncomingHttpHeaders = {
      'x-real-ip': '203.0.113.195',
    };
    const redacted = redactHeadersSummary(headers);
    expect(redacted['x-real-ip']).toBe('203.....195');
  });
});

describe('redactHeadersSummary - preservation', () => {
  it('should preserve Accept in summary', () => {
    const headers: IncomingHttpHeaders = {
      accept: 'application/json',
    };
    const redacted = redactHeadersSummary(headers);
    expect(redacted.accept).toBe('application/json');
  });

  it('should preserve Content-Type in summary', () => {
    const headers: IncomingHttpHeaders = {
      'content-type': 'text/html',
    };
    const redacted = redactHeadersSummary(headers);
    expect(redacted['content-type']).toBe('text/html');
  });

  it('should preserve Host in summary', () => {
    const headers: IncomingHttpHeaders = {
      host: 'example.com',
    };
    const redacted = redactHeadersSummary(headers);
    expect(redacted.host).toBe('example.com');
  });

  it('should preserve User-Agent in summary', () => {
    const headers: IncomingHttpHeaders = {
      'user-agent': 'Mozilla/5.0',
    };
    const redacted = redactHeadersSummary(headers);
    expect(redacted['user-agent']).toBe('Mozilla/5.0');
  });

  it('should preserve X-Correlation-ID in summary', () => {
    const headers: IncomingHttpHeaders = {
      'x-correlation-id': 'req_123456789_abc123',
    };
    const redacted = redactHeadersSummary(headers);
    expect(redacted['x-correlation-id']).toBe('req_123456789_abc123');
  });
});

describe('redactHeadersSummary - behavior differences', () => {
  it('should only include interesting headers in summary', () => {
    const headers: IncomingHttpHeaders = {
      accept: 'application/json',
      authorization: 'Bearer token',
      'x-custom': 'value',
      'x-not-interesting': 'value2',
    };
    const redacted = redactHeadersSummary(headers);

    // Should include interesting headers
    expect(redacted.accept).toBe('application/json');
    expect(redacted.authorization).toBe('[REDACTED]');

    // Should NOT include non-interesting headers
    expect(redacted['x-custom']).toBeUndefined();
    expect(redacted['x-not-interesting']).toBeUndefined();
  });

  it('should return empty object when no interesting headers present', () => {
    const headers: IncomingHttpHeaders = {
      'x-custom': 'value',
      'x-another': 'value2',
    };
    const redacted = redactHeadersSummary(headers);
    // eslint-disable-next-line no-restricted-properties -- REFACTOR
    expect(Object.keys(redacted).length).toBe(0);
  });

  it('should handle undefined interesting headers gracefully', () => {
    const headers: IncomingHttpHeaders = {
      authorization: undefined,
    };
    const redacted = redactHeadersSummary(headers);
    // Undefined interesting headers should not appear in summary
    expect(redacted.authorization).toBeUndefined();
  });

  it('should include Clerk-specific headers in summary', () => {
    const headers: IncomingHttpHeaders = {
      'x-clerk-auth-status': 'signed_in',
      'x-clerk-auth-reason': 'session_valid',
    };
    const redacted = redactHeadersSummary(headers);
    expect(redacted['x-clerk-auth-status']).toBe('signed_in');
    expect(redacted['x-clerk-auth-reason']).toBe('session_valid');
  });

  it('should include WWW-Authenticate in summary', () => {
    const headers: OutgoingHttpHeaders = {
      'www-authenticate': 'Bearer realm="api"',
    };
    const redacted = redactHeadersSummary(headers);
    expect(redacted['www-authenticate']).toBe('Bearer realm="api"');
  });
});

describe('redactHeaders vs redactHeadersSummary - consistency', () => {
  it('should apply same redaction rules to Authorization', () => {
    const headers: IncomingHttpHeaders = {
      authorization: 'Bearer token',
    };
    const fullRedacted = redactHeaders(headers);
    const summaryRedacted = redactHeadersSummary(headers);

    expect(fullRedacted.authorization).toBe('[REDACTED]');
    expect(summaryRedacted.authorization).toBe('[REDACTED]');
  });

  it('should apply same redaction rules to X-Forwarded-For', () => {
    const headers: IncomingHttpHeaders = {
      'x-forwarded-for': '192.168.1.100',
    };
    const fullRedacted = redactHeaders(headers);
    const summaryRedacted = redactHeadersSummary(headers);

    expect(fullRedacted['x-forwarded-for']).toBe('192.....100');
    expect(summaryRedacted['x-forwarded-for']).toBe('192.....100');
  });

  it('should apply same preservation rules to Accept', () => {
    const headers: IncomingHttpHeaders = {
      accept: 'application/json',
    };
    const fullRedacted = redactHeaders(headers);
    const summaryRedacted = redactHeadersSummary(headers);

    expect(fullRedacted.accept).toBe('application/json');
    expect(summaryRedacted.accept).toBe('application/json');
  });
});
