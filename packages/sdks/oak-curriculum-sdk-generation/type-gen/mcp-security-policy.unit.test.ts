/**
 * Unit tests for MCP Security Policy Configuration
 * Following TDD approach - tests written FIRST before implementation
 */

import { describe, it, expect } from 'vitest';
import {
  PUBLIC_TOOLS,
  DEFAULT_AUTH_SCHEME,
  toolRequiresAuth,
  getScopesSupported,
} from './mcp-security-policy.js';
import { SCOPES_SUPPORTED } from '../src/types/generated/api-schema/mcp-tools/scopes-supported.js';

describe('MCP Security Policy Configuration', () => {
  describe('PUBLIC_TOOLS', () => {
    it('is a readonly array', () => {
      // TypeScript will enforce readonly at compile time
      // At runtime, prove it's an array
      expect(Array.isArray(PUBLIC_TOOLS)).toBe(true);
    });

    it('has no duplicate entries', () => {
      const uniqueTools = new Set(PUBLIC_TOOLS);
      expect(uniqueTools.size).toBe(PUBLIC_TOOLS.length);
    });
  });

  describe('DEFAULT_AUTH_SCHEME', () => {
    it('has oauth2 type', () => {
      expect(DEFAULT_AUTH_SCHEME.type).toBe('oauth2');
    });

    it('has scopes array', () => {
      expect(Array.isArray(DEFAULT_AUTH_SCHEME.scopes)).toBe(true);
    });

    it('includes required email scope', () => {
      expect(DEFAULT_AUTH_SCHEME.scopes).toContain('email');
    });

    it('does not include openid scope (Clerk rejects it for DCR clients)', () => {
      expect(DEFAULT_AUTH_SCHEME.scopes).not.toContain('openid');
    });
  });

  describe('toolRequiresAuth', () => {
    it('returns true for tools NOT in PUBLIC_TOOLS', () => {
      const result = toolRequiresAuth('any-protected-tool');
      expect(result).toBe(true);
    });

    it('returns true for another tool NOT in PUBLIC_TOOLS', () => {
      const result = toolRequiresAuth('get-lessons');
      expect(result).toBe(true);
    });

    it('is pure - returns same result for same input', () => {
      const toolName = 'test-tool';
      const result1 = toolRequiresAuth(toolName);
      const result2 = toolRequiresAuth(toolName);
      expect(result1).toBe(result2);
    });

    it('is pure - multiple calls with different inputs maintain consistency', () => {
      const tool1 = 'protected-tool-1';
      const tool2 = 'protected-tool-2';

      const result1a = toolRequiresAuth(tool1);
      const result2a = toolRequiresAuth(tool2);
      const result1b = toolRequiresAuth(tool1);
      const result2b = toolRequiresAuth(tool2);

      expect(result1a).toBe(result1b);
      expect(result2a).toBe(result2b);
    });

    it('returns false if tool is in PUBLIC_TOOLS (when PUBLIC_TOOLS is not empty)', () => {
      // This test will pass when PUBLIC_TOOLS is empty (vacuously true)
      // If PUBLIC_TOOLS has entries, they should return false
      for (const toolName of PUBLIC_TOOLS) {
        const result = toolRequiresAuth(toolName);
        expect(result).toBe(false);
      }
    });
  });

  describe('getScopesSupported', () => {
    it('returns scopes from DEFAULT_AUTH_SCHEME', () => {
      const scopes = getScopesSupported();
      expect(scopes).toEqual(['email']);
    });

    it('returns sorted array', () => {
      const scopes = getScopesSupported();
      const sorted = [...scopes].sort();
      expect(scopes).toEqual(sorted);
    });

    it('is pure - returns same result on multiple calls', () => {
      const result1 = getScopesSupported();
      const result2 = getScopesSupported();
      expect(result1).toEqual(result2);
    });

    it('returns array with no duplicates', () => {
      const scopes = getScopesSupported();
      const uniqueScopes = Array.from(new Set(scopes));
      expect(scopes).toEqual(uniqueScopes);
    });

    it('all returned scopes are non-empty strings', () => {
      const scopes = getScopesSupported();
      for (const scope of scopes) {
        expect(typeof scope).toBe('string');
        expect(scope.length).toBeGreaterThan(0);
      }
    });
  });

  describe('generated SCOPES_SUPPORTED sync check', () => {
    it('matches getScopesSupported() — run pnpm type-gen if this fails', () => {
      expect([...SCOPES_SUPPORTED]).toStrictEqual([...getScopesSupported()]);
    });
  });
});
