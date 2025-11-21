import { describe, it, expect } from 'vitest';
import { isDiscoveryMethod } from './mcp-method-classifier.js';

/**
 * Unit tests for MCP method classification.
 *
 * Tests prove that discovery methods (initialize, tools/list) are correctly
 * identified and that all other methods default to requiring authentication.
 *
 * Per OpenAI ChatGPT requirements, discovery methods must work without
 * authentication to allow tool discovery before OAuth flow.
 */

describe('isDiscoveryMethod', () => {
  describe('discovery methods (no auth required)', () => {
    it('returns true for initialize method', () => {
      expect(isDiscoveryMethod('initialize')).toBe(true);
    });

    it('returns true for tools/list method', () => {
      expect(isDiscoveryMethod('tools/list')).toBe(true);
    });
  });

  describe('execution methods (auth required)', () => {
    it('returns false for tools/call method', () => {
      expect(isDiscoveryMethod('tools/call')).toBe(false);
    });

    it('returns false for unknown methods (safe default)', () => {
      expect(isDiscoveryMethod('unknown/method')).toBe(false);
    });

    it('returns false for resources/list (if added in future)', () => {
      expect(isDiscoveryMethod('resources/list')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isDiscoveryMethod('')).toBe(false);
    });
  });
});
