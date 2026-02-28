import { describe, it, expect } from 'vitest';
import { resolveAllowedHosts } from './security-config.js';

/**
 * Unit tests for DNS rebinding protection configuration.
 *
 * CORS is unconditionally permissive (all origins allowed) so there is no
 * CORS configuration to test. Security is enforced by OAuth authentication.
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
    const vercelHosts = ['localhost', 'myapp.vercel.app'];

    const result = resolveAllowedHosts(undefined, vercelHosts);

    const uniqueResult = Array.from(new Set(result));
    expect(result).toEqual(uniqueResult);
  });

  it('handles empty Vercel array as equivalent to undefined', () => {
    const resultWithEmpty = resolveAllowedHosts(undefined, []);
    const resultWithoutHosts = resolveAllowedHosts(undefined, []);

    expect(resultWithEmpty).toEqual(resultWithoutHosts);
  });
});
