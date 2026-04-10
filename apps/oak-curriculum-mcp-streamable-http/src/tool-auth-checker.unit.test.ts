import { describe, it, expect } from 'vitest';
import { resolveAuthRequired, toolRequiresAuth } from './tool-auth-checker.js';

/**
 * Unit tests for tool authentication checker.
 *
 * Tests prove that the function correctly reads security metadata from
 * both generated tool descriptors and aggregated tool definitions, and
 * that the deny-by-default decision logic is correct.
 *
 * Per OAuth 2.1 security implementation, tools with oauth2 schemes require
 * authentication, tools with noauth schemes do not.
 *
 * @see Sub-Phase 2.3 of schema-first-security-implementation.md
 */

describe('toolRequiresAuth', () => {
  describe('generated tools with OAuth protection', () => {
    it('returns true for get-lessons-summary (requires oauth2)', () => {
      expect(toolRequiresAuth('get-lessons-summary')).toBe(true);
    });

    it('returns true for get-units-summary (requires oauth2)', () => {
      expect(toolRequiresAuth('get-units-summary')).toBe(true);
    });

    it('returns true for get-key-stages (requires oauth2)', () => {
      expect(toolRequiresAuth('get-key-stages')).toBe(true);
    });
  });

  describe('generated tools with public access', () => {
    it('returns false for get-changelog (public, noauth)', () => {
      expect(toolRequiresAuth('get-changelog')).toBe(false);
    });

    it('returns false for get-changelog-latest (public, noauth)', () => {
      expect(toolRequiresAuth('get-changelog-latest')).toBe(false);
    });

    it('returns false for get-rate-limit (public, noauth)', () => {
      expect(toolRequiresAuth('get-rate-limit')).toBe(false);
    });
  });

  describe('aggregated tools', () => {
    it('returns true for search (requires oauth2)', () => {
      expect(toolRequiresAuth('search')).toBe(true);
    });

    it('returns true for fetch (requires oauth2)', () => {
      expect(toolRequiresAuth('fetch')).toBe(true);
    });
  });
});

describe('resolveAuthRequired', () => {
  describe('deny-by-default cases', () => {
    it('requires auth when securitySchemes is undefined', () => {
      expect(resolveAuthRequired(undefined)).toBe(true);
    });

    it('requires auth when securitySchemes is an empty array', () => {
      expect(resolveAuthRequired([])).toBe(true);
    });
  });

  describe('explicit scheme resolution', () => {
    it('requires auth when securitySchemes contains oauth2', () => {
      expect(resolveAuthRequired([{ type: 'oauth2', scopes: ['openid'] }])).toBe(true);
    });

    it('permits public access when all securitySchemes are noauth', () => {
      expect(resolveAuthRequired([{ type: 'noauth' }])).toBe(false);
    });

    it('requires auth for mixed schemes containing both noauth and oauth2', () => {
      expect(
        resolveAuthRequired([{ type: 'noauth' }, { type: 'oauth2', scopes: ['openid'] }]),
      ).toBe(true);
    });
  });
});
