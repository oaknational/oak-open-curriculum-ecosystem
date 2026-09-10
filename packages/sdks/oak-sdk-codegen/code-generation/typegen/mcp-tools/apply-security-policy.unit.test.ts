/**
 * Unit tests for apply-security-policy
 * Following TDD approach - tests written FIRST before implementation
 */

import { describe, it, expect } from 'vitest';
import { getSecuritySchemeForTool } from './apply-security-policy.js';
import { PUBLIC_TOOLS, DEFAULT_AUTH_SCHEME } from '../../mcp-security-policy.js';

describe('getSecuritySchemeForTool', () => {
  describe('tools in PUBLIC_TOOLS', () => {
    it('returns noauth scheme for public tools', () => {
      // The known public tool, named directly: if the policy ever drops
      // get-rate-limit this proof fails loud instead of silently skipping.
      const result = getSecuritySchemeForTool('get-rate-limit');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ type: 'noauth' });
    });

    it('returns noauth scheme for all tools in PUBLIC_TOOLS', () => {
      // Verify all public tools get noauth scheme
      for (const toolName of PUBLIC_TOOLS) {
        const result = getSecuritySchemeForTool(toolName);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({ type: 'noauth' });
      }
    });
  });

  describe('tools NOT in PUBLIC_TOOLS', () => {
    it('returns oauth2 scheme with default scopes for protected tools', () => {
      const protectedToolName = 'get-lessons';
      const result = getSecuritySchemeForTool(protectedToolName);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(DEFAULT_AUTH_SCHEME);
    });

    it('returns oauth2 scheme for another protected tool', () => {
      const protectedToolName = 'get-units';
      const result = getSecuritySchemeForTool(protectedToolName);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('oauth2');
      expect(result[0]).toHaveProperty('scopes');
    });

    it('returns exact DEFAULT_AUTH_SCHEME object for protected tools', () => {
      const protectedToolName = 'any-protected-tool';
      const result = getSecuritySchemeForTool(protectedToolName);

      // Should be the exact same object reference
      expect(result[0]).toBe(DEFAULT_AUTH_SCHEME);
    });
  });

  describe('purity', () => {
    it('returns same result for same input (public tool)', () => {
      const result1 = getSecuritySchemeForTool('get-rate-limit');
      const result2 = getSecuritySchemeForTool('get-rate-limit');

      expect(result1).toEqual(result2);
    });

    it('returns same result for same input (protected tool)', () => {
      const toolName = 'protected-test-tool';
      const result1 = getSecuritySchemeForTool(toolName);
      const result2 = getSecuritySchemeForTool(toolName);

      expect(result1).toEqual(result2);
    });

    it('maintains consistency across multiple calls with different inputs', () => {
      const publicTool = 'get-rate-limit';
      const protectedTool = 'get-lessons';

      const publicResult1 = getSecuritySchemeForTool(publicTool);
      const protectedResult1 = getSecuritySchemeForTool(protectedTool);
      const publicResult2 = getSecuritySchemeForTool(publicTool);
      const protectedResult2 = getSecuritySchemeForTool(protectedTool);

      expect(publicResult1).toEqual(publicResult2);
      expect(protectedResult1).toEqual(protectedResult2);
    });
  });

  describe('return type', () => {
    it('always returns array for public tools', () => {
      const result = getSecuritySchemeForTool('get-rate-limit');

      expect(Array.isArray(result)).toBe(true);
    });

    it('always returns array for protected tools', () => {
      const toolName = 'protected-tool';
      const result = getSecuritySchemeForTool(toolName);

      expect(Array.isArray(result)).toBe(true);
    });

    it('returns array with exactly one element', () => {
      const publicToolResult = getSecuritySchemeForTool('get-rate-limit');
      const protectedToolResult = getSecuritySchemeForTool('get-lessons');

      expect(publicToolResult).toHaveLength(1);
      expect(protectedToolResult).toHaveLength(1);
    });
  });

  describe('handles empty PUBLIC_TOOLS scenario', () => {
    it('returns oauth2 for tools when PUBLIC_TOOLS is conceptually empty', () => {
      // Even if PUBLIC_TOOLS has entries, a tool not in the list should get oauth2
      const toolNotInList = 'definitely-not-in-public-tools-xyz-123';
      const result = getSecuritySchemeForTool(toolNotInList);

      expect(result[0].type).toBe('oauth2');
    });
  });
});
