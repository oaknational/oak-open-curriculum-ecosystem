import { describe, it, expect } from 'vitest';
import { isDiscoveryMethod } from './mcp-method-classifier.js';

/**
 * Unit tests for MCP method classification.
 *
 * Tests prove that discovery methods are correctly identified and that
 * all other methods default to requiring authentication.
 *
 * Per OpenAI ChatGPT requirements, discovery methods must work without
 * authentication to allow tool discovery before OAuth flow.
 *
 * **IMPORTANT**: These tests must stay synchronized with CLERK_SKIP_METHODS
 * in conditional-clerk-middleware.ts. If a method is skipped by Clerk but
 * not recognized as discovery, getAuth() will throw.
 */

describe('isDiscoveryMethod', () => {
  describe('discovery methods (no auth required)', () => {
    it('returns true for initialize method', () => {
      expect(isDiscoveryMethod('initialize')).toBe(true);
    });

    it('returns true for tools/list method', () => {
      expect(isDiscoveryMethod('tools/list')).toBe(true);
    });

    it('returns true for resources/list method', () => {
      expect(isDiscoveryMethod('resources/list')).toBe(true);
    });

    it('returns true for prompts/list method', () => {
      expect(isDiscoveryMethod('prompts/list')).toBe(true);
    });

    it('returns true for resources/templates/list method', () => {
      expect(isDiscoveryMethod('resources/templates/list')).toBe(true);
    });

    it('returns true for notifications/initialized method', () => {
      expect(isDiscoveryMethod('notifications/initialized')).toBe(true);
    });
  });

  describe('execution methods (auth required)', () => {
    it('returns false for tools/call method', () => {
      expect(isDiscoveryMethod('tools/call')).toBe(false);
    });

    it('returns false for resources/read method', () => {
      expect(isDiscoveryMethod('resources/read')).toBe(false);
    });

    it('returns false for prompts/get method', () => {
      expect(isDiscoveryMethod('prompts/get')).toBe(false);
    });

    it('returns false for unknown methods (safe default)', () => {
      expect(isDiscoveryMethod('unknown/method')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isDiscoveryMethod('')).toBe(false);
    });
  });
});
