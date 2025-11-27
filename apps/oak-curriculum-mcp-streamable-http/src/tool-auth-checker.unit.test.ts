import { describe, it, expect } from 'vitest';
import { toolRequiresAuth } from './tool-auth-checker.js';

/**
 * Unit tests for tool authentication checker.
 *
 * Tests prove that the function correctly reads security metadata from
 * both generated tool descriptors and aggregated tool definitions.
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

  describe('edge cases', () => {
    it('handles tool name type safety with UniversalToolName', () => {
      // This test verifies type safety at compile time
      // If this compiles, the function signature is correct
      const toolName = 'get-changelog' as const;
      const result = toolRequiresAuth(toolName);
      expect(typeof result).toBe('boolean');
    });
  });
});
