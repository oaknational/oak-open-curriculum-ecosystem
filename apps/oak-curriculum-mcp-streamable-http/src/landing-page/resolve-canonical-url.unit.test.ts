/**
 * Unit tests for canonical URL resolution.
 *
 * Tests verify that the MCP endpoint URL is correctly resolved
 * based on the Vercel host header.
 */

import { describe, expect, it } from 'vitest';

import { resolveCanonicalUrl } from './resolve-canonical-url.js';

describe('resolveCanonicalUrl', () => {
  it('returns https URL with Vercel host when provided', () => {
    expect(resolveCanonicalUrl('my-app.vercel.app')).toBe('https://my-app.vercel.app/mcp');
  });

  it('returns localhost URL when no host provided', () => {
    expect(resolveCanonicalUrl()).toBe('http://localhost:3333/mcp');
  });

  it('returns localhost URL when host is undefined', () => {
    expect(resolveCanonicalUrl(undefined)).toBe('http://localhost:3333/mcp');
  });

  it('returns localhost URL when host is empty string', () => {
    expect(resolveCanonicalUrl('')).toBe('http://localhost:3333/mcp');
  });

  it('handles custom domain hosts', () => {
    expect(resolveCanonicalUrl('curriculum.oak.org.uk')).toBe('https://curriculum.oak.org.uk/mcp');
  });
});
