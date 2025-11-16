import { describe, it, expect } from 'vitest';
import { resolveAllowedOrigins, resolveCorsMode } from './security-config.js';

/**
 * Unit tests for CORS configuration resolution.
 *
 * Tests prove that three explicit CORS modes work correctly:
 * 1. 'allow_all' - permits all origins (headers, origins, everything)
 * 2. 'explicit' - only allows specified origins from ALLOWED_ORIGINS
 * 3. 'automatic' - smart default (all in dev, self-only in Vercel)
 */

describe('resolveCorsMode', () => {
  it('returns "allow_all" when CORS_MODE is "allow_all"', () => {
    const result = resolveCorsMode('allow_all');
    expect(result).toBe('allow_all');
  });

  it('returns "explicit" when CORS_MODE is "explicit"', () => {
    const result = resolveCorsMode('explicit');
    expect(result).toBe('explicit');
  });

  it('returns "automatic" when CORS_MODE is "automatic"', () => {
    const result = resolveCorsMode('automatic');
    expect(result).toBe('automatic');
  });

  it('returns "automatic" when CORS_MODE is undefined (default)', () => {
    const result = resolveCorsMode(undefined);
    expect(result).toBe('automatic');
  });

  it('returns "automatic" when CORS_MODE is empty string', () => {
    const result = resolveCorsMode('');
    expect(result).toBe('automatic');
  });
});

describe('resolveAllowedOrigins', () => {
  describe('allow_all mode', () => {
    it('returns undefined (allow_all) in all scenarios', () => {
      expect(resolveAllowedOrigins('allow_all', undefined, undefined)).toBeUndefined();
      expect(
        resolveAllowedOrigins('allow_all', ['https://example.com'], undefined),
      ).toBeUndefined();
      expect(resolveAllowedOrigins('allow_all', undefined, 'myapp.vercel.app')).toBeUndefined();
      expect(
        resolveAllowedOrigins('allow_all', ['https://example.com'], 'myapp.vercel.app'),
      ).toBeUndefined();
    });
  });

  describe('explicit mode', () => {
    it('returns configured origins when provided', () => {
      const configured = ['https://example.com', 'https://test.com'];
      const result = resolveAllowedOrigins('explicit', configured, undefined);
      expect(result).toBe(configured);
    });

    it('returns empty array when no origins configured (blocks all)', () => {
      const result = resolveAllowedOrigins('explicit', undefined, 'myapp.vercel.app');
      expect(result).toEqual([]);
    });

    it('ignores Vercel host when origins are explicitly configured', () => {
      const configured = ['https://explicit.com'];
      const result = resolveAllowedOrigins('explicit', configured, 'myapp.vercel.app');
      expect(result).toBe(configured);
    });
  });

  describe('automatic mode', () => {
    it('returns undefined for local dev (enables allow_all CORS)', () => {
      const result = resolveAllowedOrigins('automatic', undefined, undefined);
      expect(result).toBeUndefined();
    });

    it('returns configured origins when explicitly provided', () => {
      const configured = ['https://example.com', 'https://test.com'];
      const result = resolveAllowedOrigins('automatic', configured, undefined);
      expect(result).toBe(configured);
    });

    it('returns Vercel URL for Vercel deployments', () => {
      const result = resolveAllowedOrigins('automatic', undefined, 'myapp.vercel.app');
      expect(result).toEqual(['https://myapp.vercel.app']);
    });

    it('prefers explicit configuration over Vercel host', () => {
      const configured = ['https://explicit.com'];
      const result = resolveAllowedOrigins('automatic', configured, 'myapp.vercel.app');
      expect(result).toBe(configured);
    });

    it('returns undefined when Vercel host is empty string', () => {
      const result = resolveAllowedOrigins('automatic', undefined, '');
      expect(result).toBeUndefined();
    });
  });
});
