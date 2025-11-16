import { describe, it, expect } from 'vitest';
import { resolveAllowedOrigins } from './security-config.js';

/**
 * Unit tests for resolveAllowedOrigins pure function.
 *
 * This function determines CORS origin allow-list based on:
 * 1. Explicit configuration (highest priority)
 * 2. Vercel deployment detection (production)
 * 3. Undefined (local dev - enables allow-all mode)
 */
describe('resolveAllowedOrigins', () => {
  it('returns undefined for local dev (enables allow-all CORS)', () => {
    const result = resolveAllowedOrigins(undefined, undefined);

    // Local dev should allow any origin for good DX
    expect(result).toBeUndefined();
  });

  it('returns configured origins when explicitly provided', () => {
    const configured = ['https://example.com', 'https://test.com'];
    const result = resolveAllowedOrigins(configured, undefined);

    // Explicit config always wins
    expect(result).toBe(configured);
  });

  it('returns Vercel URL for Vercel deployments', () => {
    const result = resolveAllowedOrigins(undefined, 'myapp.vercel.app');

    // Vercel deployments get tight security - only allow their own URL
    expect(result).toEqual(['https://myapp.vercel.app']);
  });

  it('prefers explicit configuration over Vercel host', () => {
    const configured = ['https://explicit.com'];
    const result = resolveAllowedOrigins(configured, 'myapp.vercel.app');

    // Explicit config has highest priority
    expect(result).toBe(configured);
  });

  it('returns undefined when Vercel host is empty string', () => {
    const result = resolveAllowedOrigins(undefined, '');

    // Empty Vercel host is effectively no Vercel host
    expect(result).toBeUndefined();
  });
});
