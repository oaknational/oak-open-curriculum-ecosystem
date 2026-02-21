import { describe, it, expect } from 'vitest';
import { testShouldSkipClerkMiddleware } from './conditional-clerk-middleware.js';

/**
 * Unit tests for conditional Clerk middleware pure functions.
 *
 * These tests verify the skip logic for public paths and resources.
 * Per MCP 2025-11-25: All MCP methods require auth including discovery.
 */
describe('shouldSkipClerkMiddleware', () => {
  describe('public paths', () => {
    it('returns true for OAuth protected resource metadata path', () => {
      const req = createMockRequest('/.well-known/oauth-protected-resource', undefined);
      expect(testShouldSkipClerkMiddleware(req)).toBe(true);
    });

    it('returns true for OIDC discovery path', () => {
      const req = createMockRequest('/.well-known/openid-configuration', undefined);
      expect(testShouldSkipClerkMiddleware(req)).toBe(true);
    });

    it('returns true for healthz check path', () => {
      const req = createMockRequest('/healthz', undefined);
      expect(testShouldSkipClerkMiddleware(req)).toBe(true);
    });

    it('returns true for OAuth proxy authorize path', () => {
      const req = createMockRequest('/oauth/authorize', undefined);
      expect(testShouldSkipClerkMiddleware(req)).toBe(true);
    });

    it('returns true for OAuth proxy token path', () => {
      const req = createMockRequest('/oauth/token', undefined);
      expect(testShouldSkipClerkMiddleware(req)).toBe(true);
    });

    it('returns true for OAuth proxy register path', () => {
      const req = createMockRequest('/oauth/register', undefined);
      expect(testShouldSkipClerkMiddleware(req)).toBe(true);
    });
  });

  describe('MCP discovery methods (auth required per MCP 2025-11-25)', () => {
    it('returns false for initialize method', () => {
      const req = createMockRequest('/mcp', { method: 'initialize' });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for tools/list method', () => {
      const req = createMockRequest('/mcp', { method: 'tools/list' });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for resources/list method', () => {
      const req = createMockRequest('/mcp', { method: 'resources/list' });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for prompts/list method', () => {
      const req = createMockRequest('/mcp', { method: 'prompts/list' });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for resources/templates/list method', () => {
      const req = createMockRequest('/mcp', { method: 'resources/templates/list' });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for notifications/initialized method', () => {
      const req = createMockRequest('/mcp', { method: 'notifications/initialized' });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });
  });

  describe('MCP execution methods (require auth)', () => {
    it('returns false for tools/call method', () => {
      const req = createMockRequest('/mcp', {
        method: 'tools/call',
        params: { name: 'get-key-stages' },
      });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for resources/read method', () => {
      const req = createMockRequest('/mcp', {
        method: 'resources/read',
        params: { uri: 'curriculum://ontology' },
      });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for prompts/get method', () => {
      const req = createMockRequest('/mcp', {
        method: 'prompts/get',
        params: { name: 'lesson-discovery' },
      });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('returns false for /mcp path with no body', () => {
      const req = createMockRequest('/mcp', undefined);
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for /mcp path with empty object body', () => {
      const req = createMockRequest('/mcp', {});
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for /mcp path with non-string method', () => {
      const req = createMockRequest('/mcp', { method: 123 });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for /mcp path with unknown method', () => {
      const req = createMockRequest('/mcp', { method: 'unknown/method' });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for non-MCP paths without discovery method', () => {
      const req = createMockRequest('/api/other', { method: 'tools/list' });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for root path', () => {
      const req = createMockRequest('/', undefined);
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });
  });

  describe('path variations', () => {
    it('returns false for /mcp subpaths with discovery method', () => {
      const req = createMockRequest('/mcp/v1', { method: 'tools/list' });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });

    it('returns false for paths that start with /mcp prefix but are different', () => {
      const req = createMockRequest('/mcpfake', { method: 'tools/list' });
      expect(testShouldSkipClerkMiddleware(req)).toBe(false);
    });
  });
});

/**
 * Creates a minimal mock request object for testing shouldSkipClerkMiddleware.
 *
 * @param path - The request path
 * @param body - The request body (JSON-RPC method)
 * @returns Mock request object with path and body
 */
function createMockRequest(path: string, body: unknown): { path: string; body: unknown } {
  return { path, body };
}
