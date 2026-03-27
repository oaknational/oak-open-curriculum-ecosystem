/**
 * Unit Tests for Auth Error Response Builder
 *
 * Tests the pure function that creates MCP-compliant auth error responses
 * with `_meta["mcp/www_authenticate"]` to trigger MCP client OAuth re-authentication.
 */

import { describe, it, expect } from 'vitest';
import { createAuthErrorResponse } from './auth-error-response.js';

describe('createAuthErrorResponse', () => {
  describe('Error type mapping', () => {
    it('creates response for invalid_token error', () => {
      const response = createAuthErrorResponse(
        'invalid_token',
        'The provided token is invalid',
        'https://example.com/mcp',
      );

      expect(response.isError).toBe(true);
      expect(response._meta['mcp/www_authenticate'][0]).toContain('error="invalid_token"');
    });

    it('creates response for insufficient_scope error', () => {
      const response = createAuthErrorResponse(
        'insufficient_scope',
        'Required scopes: email',
        'https://example.com/mcp',
      );

      expect(response.isError).toBe(true);
      expect(response._meta['mcp/www_authenticate'][0]).toContain('error="insufficient_scope"');
    });

    it('creates response for token_expired error', () => {
      const response = createAuthErrorResponse(
        'token_expired',
        'The token has expired',
        'https://example.com/mcp',
      );

      expect(response.isError).toBe(true);
      expect(response._meta['mcp/www_authenticate'][0]).toContain('error="token_expired"');
    });

    it('creates response for missing_token error', () => {
      const response = createAuthErrorResponse(
        'missing_token',
        'No authorization token provided',
        'https://example.com/mcp',
      );

      expect(response.isError).toBe(true);
      expect(response._meta['mcp/www_authenticate'][0]).toContain('error="missing_token"');
    });
  });

  describe('WWW-Authenticate format (RFC 6750)', () => {
    it('includes resource_metadata URL in WWW-Authenticate header', () => {
      const resourceUrl = 'https://example.com/mcp';
      const response = createAuthErrorResponse('invalid_token', 'Test error', resourceUrl);

      const authHeader = response._meta['mcp/www_authenticate'][0];
      expect(authHeader).toContain(
        `resource_metadata="https://example.com/.well-known/oauth-protected-resource/mcp"`,
      );
    });

    it('includes error code in WWW-Authenticate header', () => {
      const response = createAuthErrorResponse(
        'token_expired',
        'Test error',
        'https://example.com/mcp',
      );

      const authHeader = response._meta['mcp/www_authenticate'][0];
      expect(authHeader).toContain('error="token_expired"');
    });

    it('includes error_description in WWW-Authenticate header', () => {
      const description = 'Custom error message';
      const response = createAuthErrorResponse(
        'invalid_token',
        description,
        'https://example.com/mcp',
      );

      const authHeader = response._meta['mcp/www_authenticate'][0];
      expect(authHeader).toContain(`error_description="${description}"`);
    });

    it('formats WWW-Authenticate per RFC 6750', () => {
      const response = createAuthErrorResponse(
        'invalid_token',
        'Test error',
        'https://example.com/mcp',
      );

      const authHeader = response._meta['mcp/www_authenticate'][0];
      // Should be: Bearer resource_metadata="...", error="...", error_description="..."
      expect(authHeader).toMatch(
        /^Bearer resource_metadata=".+", error=".+", error_description=".+"$/,
      );
    });
  });

  describe('MCP response structure', () => {
    it('includes content array with error message', () => {
      const description = 'Authentication failed';
      const response = createAuthErrorResponse(
        'invalid_token',
        description,
        'https://example.com/mcp',
      );

      expect(response.content).toBeInstanceOf(Array);
      expect(response.content.length).toBeGreaterThan(0);
      expect(response.content[0]).toHaveProperty('type', 'text');
      expect(response.content[0]).toHaveProperty('text');
    });

    it('sets isError to true', () => {
      const response = createAuthErrorResponse(
        'invalid_token',
        'Test error',
        'https://example.com/mcp',
      );

      expect(response.isError).toBe(true);
    });

    it('includes _meta with mcp/www_authenticate array', () => {
      const response = createAuthErrorResponse(
        'invalid_token',
        'Test error',
        'https://example.com/mcp',
      );

      expect(response._meta).toHaveProperty('mcp/www_authenticate');
      expect(Array.isArray(response._meta['mcp/www_authenticate'])).toBe(true);
      expect(response._meta['mcp/www_authenticate'].length).toBe(1);
    });

    it('_meta array contains single WWW-Authenticate string', () => {
      const response = createAuthErrorResponse(
        'invalid_token',
        'Test error',
        'https://example.com/mcp',
      );

      const authArray = response._meta['mcp/www_authenticate'];
      expect(typeof authArray[0]).toBe('string');
      expect(authArray[0]).toContain('Bearer');
    });
  });

  describe('Resource URL handling', () => {
    it('converts http resource URL to metadata URL', () => {
      const response = createAuthErrorResponse(
        'invalid_token',
        'Test error',
        'http://localhost:3000/mcp',
      );

      const authHeader = response._meta['mcp/www_authenticate'][0];
      expect(authHeader).toContain(
        'resource_metadata="http://localhost:3000/.well-known/oauth-protected-resource/mcp"',
      );
    });

    it('converts https resource URL to metadata URL', () => {
      const response = createAuthErrorResponse(
        'invalid_token',
        'Test error',
        'https://api.example.com/mcp',
      );

      const authHeader = response._meta['mcp/www_authenticate'][0];
      expect(authHeader).toContain(
        'resource_metadata="https://api.example.com/.well-known/oauth-protected-resource/mcp"',
      );
    });

    it('preserves protocol when generating metadata URL', () => {
      const httpResponse = createAuthErrorResponse('invalid_token', 'Test', 'http://localhost/mcp');
      const httpsResponse = createAuthErrorResponse(
        'invalid_token',
        'Test',
        'https://example.com/mcp',
      );

      expect(httpResponse._meta['mcp/www_authenticate'][0]).toContain(
        'http://localhost/.well-known/oauth-protected-resource/mcp',
      );
      expect(httpsResponse._meta['mcp/www_authenticate'][0]).toContain(
        'https://example.com/.well-known/oauth-protected-resource/mcp',
      );
    });
  });
});
