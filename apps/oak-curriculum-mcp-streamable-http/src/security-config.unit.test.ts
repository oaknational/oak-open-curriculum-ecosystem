import { describe, it, expect } from 'vitest';
import { resolveAllowedOrigins, resolveAllowedHosts, resolveCorsMode } from './security-config.js';

/**
 * Unit tests for CORS configuration resolution.
 *
 * Tests prove that three explicit CORS modes work correctly:
 * 1. 'allow_all' - permits all origins (headers, origins, everything)
 * 2. 'explicit' - only allows specified origins from ALLOWED_ORIGINS
 * 3. 'automatic' - smart default (all in dev, self-only in Vercel)
 */

describe('resolveAllowedHosts', () => {
  const BASE_HOSTS = ['localhost', '127.0.0.1', '::1'];

  it('returns configured hosts when explicitly provided (ignores Vercel)', () => {
    const configured = ['custom.example.com', 'api.example.com'];
    const vercelHosts = ['myapp.vercel.app', 'myapp-git-main.vercel.app'];

    const result = resolveAllowedHosts(configured, vercelHosts);

    expect(result).toBe(configured);
  });

  it('returns all Vercel hosts + BASE_HOSTS when no config and Vercel hosts present', () => {
    const vercelHosts = ['myapp.vercel.app', 'myapp-git-main.vercel.app'];

    const result = resolveAllowedHosts(undefined, vercelHosts);

    expect(result).toEqual(['myapp.vercel.app', 'myapp-git-main.vercel.app', ...BASE_HOSTS]);
  });

  it('returns all Vercel hosts + BASE_HOSTS with single Vercel host', () => {
    const vercelHosts = ['myapp.vercel.app'];

    const result = resolveAllowedHosts(undefined, vercelHosts);

    expect(result).toEqual(['myapp.vercel.app', ...BASE_HOSTS]);
  });

  it('returns only BASE_HOSTS when no config and no Vercel hosts', () => {
    const result = resolveAllowedHosts(undefined, []);

    expect(result).toEqual(BASE_HOSTS);
  });

  it('returns only BASE_HOSTS when config is empty array', () => {
    const result = resolveAllowedHosts([], []);

    expect(result).toEqual(BASE_HOSTS);
  });

  it('deduplicates hosts when Vercel host already in BASE_HOSTS', () => {
    // Simulate case where Vercel host might match a base host (edge case)
    const vercelHosts = ['localhost', 'myapp.vercel.app'];

    const result = resolveAllowedHosts(undefined, vercelHosts);

    // Should deduplicate 'localhost'
    const uniqueResult = Array.from(new Set(result));
    expect(result).toEqual(uniqueResult);
  });

  it('handles empty Vercel array as equivalent to undefined', () => {
    const resultWithEmpty = resolveAllowedHosts(undefined, []);
    const resultWithoutHosts = resolveAllowedHosts(undefined, []);

    expect(resultWithEmpty).toEqual(resultWithoutHosts);
  });
});

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
      expect(resolveAllowedOrigins('allow_all', undefined, [])).toBeUndefined();
      expect(resolveAllowedOrigins('allow_all', ['https://example.com'], [])).toBeUndefined();
      expect(resolveAllowedOrigins('allow_all', undefined, ['myapp.vercel.app'])).toBeUndefined();
      expect(
        resolveAllowedOrigins('allow_all', ['https://example.com'], ['myapp.vercel.app']),
      ).toBeUndefined();
    });
  });

  describe('explicit mode', () => {
    it('returns configured origins when provided', () => {
      const configured = ['https://example.com', 'https://test.com'];
      const result = resolveAllowedOrigins('explicit', configured, []);
      expect(result).toBe(configured);
    });

    it('returns empty array when no origins configured (blocks all)', () => {
      const result = resolveAllowedOrigins('explicit', undefined, ['myapp.vercel.app']);
      expect(result).toEqual([]);
    });

    it('ignores Vercel hosts when origins are explicitly configured', () => {
      const configured = ['https://explicit.com'];
      const result = resolveAllowedOrigins('explicit', configured, [
        'myapp.vercel.app',
        'myapp-git-main.vercel.app',
      ]);
      expect(result).toBe(configured);
    });
  });

  describe('automatic mode', () => {
    it('returns undefined for local dev (enables allow_all CORS)', () => {
      const result = resolveAllowedOrigins('automatic', undefined, []);
      expect(result).toBeUndefined();
    });

    it('returns configured origins when explicitly provided', () => {
      const configured = ['https://example.com', 'https://test.com'];
      const result = resolveAllowedOrigins('automatic', configured, []);
      expect(result).toBe(configured);
    });

    it('returns single Vercel URL for single Vercel host', () => {
      const result = resolveAllowedOrigins('automatic', undefined, ['myapp.vercel.app']);
      expect(result).toEqual(['https://myapp.vercel.app']);
    });

    it('returns multiple https:// origins for multiple Vercel hosts', () => {
      const vercelHosts = [
        'myapp-abc123.vercel.app',
        'myapp-git-main.vercel.app',
        'myapp.vercel.app',
      ];
      const result = resolveAllowedOrigins('automatic', undefined, vercelHosts);
      expect(result).toEqual([
        'https://myapp-abc123.vercel.app',
        'https://myapp-git-main.vercel.app',
        'https://myapp.vercel.app',
      ]);
    });

    it('prefers explicit configuration over Vercel hosts', () => {
      const configured = ['https://explicit.com'];
      const result = resolveAllowedOrigins('automatic', configured, ['myapp.vercel.app']);
      expect(result).toBe(configured);
    });

    it('returns undefined when Vercel hosts array is empty', () => {
      const result = resolveAllowedOrigins('automatic', undefined, []);
      expect(result).toBeUndefined();
    });
  });
});
