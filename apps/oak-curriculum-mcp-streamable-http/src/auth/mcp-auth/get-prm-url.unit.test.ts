/**
 * Unit tests for getPRMUrl function.
 *
 * These tests verify that the OAuth Protected Resource Metadata URL is
 * generated with the path-qualified suffix per RFC 9728 Section 3.1.
 *
 * For resource `http://host/mcp`, the PRM URL is
 * `http://host/.well-known/oauth-protected-resource/mcp`.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc9728#section-3.1 | RFC 9728 Section 3.1}
 */

import { describe, it, expect } from 'vitest';
import { getPRMUrl } from './get-prm-url.js';

describe('getPRMUrl', () => {
  it('generates path-qualified PRM URL per RFC 9728 Section 3.1', () => {
    const mockReq = {
      protocol: 'https',
      get: (header: string) => {
        if (header === 'host') {
          return 'example.com';
        }
        return undefined;
      },
    };

    const result = getPRMUrl(mockReq, ['example.com']);

    expect(result).toBe('https://example.com/.well-known/oauth-protected-resource/mcp');
  });

  it('handles http protocol', () => {
    const mockReq = {
      protocol: 'http',
      get: (header: string) => {
        if (header === 'host') {
          return 'localhost:3000';
        }
        return undefined;
      },
    };

    const result = getPRMUrl(mockReq, ['localhost']);

    expect(result).toBe('http://localhost:3000/.well-known/oauth-protected-resource/mcp');
  });

  it('handles different hosts with ports', () => {
    const mockReq = {
      protocol: 'https',
      get: (header: string) => {
        if (header === 'host') {
          return 'api.production.com:8080';
        }
        return undefined;
      },
    };

    const result = getPRMUrl(mockReq, ['api.production.com']);

    expect(result).toBe('https://api.production.com:8080/.well-known/oauth-protected-resource/mcp');
  });

  it('throws when host header is missing', () => {
    const mockReq = {
      protocol: 'https',
      get: () => undefined,
    };

    expect(() => getPRMUrl(mockReq, ['example.com'])).toThrow(
      'Cannot generate OAuth metadata URL: missing host header',
    );
  });

  it('throws when host header is malformed', () => {
    const mockReq = {
      protocol: 'https',
      get: () => 'example.com:443@evil.com',
    };

    expect(() => getPRMUrl(mockReq, ['example.com'])).toThrow(
      'Cannot generate OAuth metadata URL: invalid host header format: example.com:443@evil.com',
    );
  });

  it('throws when host is not allow-listed', () => {
    const mockReq = {
      protocol: 'https',
      get: () => 'evil.com',
    };

    expect(() => getPRMUrl(mockReq, ['example.com'])).toThrow(
      'Cannot generate OAuth metadata URL: host not allowed: evil.com',
    );
  });
});
