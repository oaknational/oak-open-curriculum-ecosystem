/**
 * Unit tests for getPRMUrl function.
 *
 * These tests verify that the OAuth Protected Resource Metadata URL is generated
 * correctly WITHOUT appending the request's originalUrl path.
 *
 * This is a fix for the bug in @clerk/mcp-tools where getPRMUrl incorrectly
 * appends req.originalUrl, resulting in broken URLs like:
 * /.well-known/oauth-protected-resource/mcp
 *
 * @module auth/mcp-auth/get-prm-url.unit.test
 */

import { describe, it, expect } from 'vitest';
import { getPRMUrl } from './get-prm-url.js';

describe('getPRMUrl', () => {
  it('should generate OAuth metadata URL without appending req.originalUrl', () => {
    // This test proves the bug fix: the original buggy implementation would
    // incorrectly append req.originalUrl (/mcp) to the metadata path
    const mockReq = {
      protocol: 'https',
      get: (header: string) => {
        if (header === 'host') {
          return 'example.com';
        }
        return undefined;
      },
      originalUrl: '/mcp', // This should NOT be appended to the metadata URL
    };

    const result = getPRMUrl(mockReq);

    // The correct URL should be the canonical OAuth metadata path
    expect(result).toBe('https://example.com/.well-known/oauth-protected-resource');

    // Verify it does NOT include the /mcp suffix (the bug)
    expect(result).not.toContain('/mcp');
  });

  it('should handle http protocol', () => {
    const mockReq = {
      protocol: 'http',
      get: (header: string) => {
        if (header === 'host') {
          return 'localhost:3000';
        }
        return undefined;
      },
      originalUrl: '/mcp',
    };

    const result = getPRMUrl(mockReq);

    expect(result).toBe('http://localhost:3000/.well-known/oauth-protected-resource');
  });

  it('should handle different hosts', () => {
    const mockReq = {
      protocol: 'https',
      get: (header: string) => {
        if (header === 'host') {
          return 'api.production.com:8080';
        }
        return undefined;
      },
      originalUrl: '/mcp',
    };

    const result = getPRMUrl(mockReq);

    expect(result).toBe('https://api.production.com:8080/.well-known/oauth-protected-resource');
  });

  it('should ignore different originalUrl values', () => {
    // Verify that no matter what originalUrl is, it's never appended
    const mockReq = {
      protocol: 'https',
      get: (header: string) => {
        if (header === 'host') {
          return 'example.com';
        }
        return undefined;
      },
      originalUrl: '/some/complex/path/with/multiple/segments',
    };

    const result = getPRMUrl(mockReq);

    // Should always be the canonical path, never including originalUrl
    expect(result).toBe('https://example.com/.well-known/oauth-protected-resource');
    expect(result).not.toContain('/some/complex/path');
  });

  it('should always return the canonical OAuth metadata path per RFC 9470', () => {
    // RFC 9470 specifies the canonical path is /.well-known/oauth-protected-resource
    // It should never vary based on the request path
    const mockReq = {
      protocol: 'https',
      get: (header: string) => {
        if (header === 'host') {
          return 'example.com';
        }
        return undefined;
      },
      originalUrl: '/api/v2/mcp/endpoint',
    };

    const result = getPRMUrl(mockReq);

    expect(result).toBe('https://example.com/.well-known/oauth-protected-resource');
    expect(result).not.toContain('api');
    expect(result).not.toContain('endpoint');
  });
});
