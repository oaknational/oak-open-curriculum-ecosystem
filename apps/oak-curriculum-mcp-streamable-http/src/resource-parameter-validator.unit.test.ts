/**
 * Unit tests for RFC 8707 resource parameter validation.
 *
 * These tests verify that JWT audience claims are correctly validated
 * against the expected resource URL to prevent token misuse.
 *
 * Part of Phase 2, Sub-Phase 2.4
 */

import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import type { Logger } from '@oaknational/logger';
import { validateResourceParameter } from './resource-parameter-validator.js';

/**
 * Create a test logger that captures logs for verification.
 */
function createTestLogger(): Logger {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    isLevelEnabled: () => true,
    child: () => createTestLogger(),
  };
}

describe('validateResourceParameter', () => {
  const SECRET = 'test-secret';
  const EXPECTED_RESOURCE = 'https://mcp.example.com/mcp';

  /**
   * Helper to create a JWT token with specified claims
   */
  function createToken(claims: { aud?: string | string[]; [key: string]: unknown }) {
    return jwt.sign(claims, SECRET);
  }

  describe('Valid tokens', () => {
    it('returns valid:true for token with matching aud (string)', () => {
      const token = createToken({ aud: EXPECTED_RESOURCE });
      const logger = createTestLogger();

      const result = validateResourceParameter(token, EXPECTED_RESOURCE, logger);

      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('returns valid:true for token with multiple aud values, one matches', () => {
      const token = createToken({
        aud: ['https://other.example.com', EXPECTED_RESOURCE, 'https://another.example.com'],
      });
      const logger = createTestLogger();

      const result = validateResourceParameter(token, EXPECTED_RESOURCE, logger);

      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });
  });

  describe('Invalid JWT tokens', () => {
    it('returns valid:false for JWT token with wrong aud', () => {
      const token = createToken({ aud: 'https://wrong.example.com' });
      const logger = createTestLogger();

      const result = validateResourceParameter(token, EXPECTED_RESOURCE, logger);

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Token audience mismatch');
      expect(result.reason).toContain(EXPECTED_RESOURCE);
      expect(result.reason).toContain('https://wrong.example.com');
    });

    it('returns valid:false for JWT token with missing aud', () => {
      const token = createToken({ sub: 'user123' }); // No aud claim
      const logger = createTestLogger();

      const result = validateResourceParameter(token, EXPECTED_RESOURCE, logger);

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Token audience mismatch');
      expect(result.reason).toContain('(none)');
    });
  });

  describe('Opaque tokens (non-JWT)', () => {
    it('returns valid:true for Clerk OAuth token (oat_...)', () => {
      // Clerk OAuth tokens are opaque - they cannot be JWT-decoded locally.
      // These tokens have already been verified by Clerk's API.
      const logger = createTestLogger();

      const result = validateResourceParameter(
        'oat_OSBQVE2W1X5PT32T8ACXT',
        EXPECTED_RESOURCE,
        logger,
      );

      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('returns valid:true for non-JWT format strings', () => {
      // Any string without JWT structure (3 base64url parts) is treated as opaque.
      // Clerk would have verified the token before this function is called.
      const logger = createTestLogger();

      const result = validateResourceParameter('not-a-jwt', EXPECTED_RESOURCE, logger);

      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('returns valid:true for empty string (opaque token edge case)', () => {
      // Empty strings are treated as opaque tokens.
      // In practice, Clerk would reject empty tokens before this function is called.
      const logger = createTestLogger();

      const result = validateResourceParameter('', EXPECTED_RESOURCE, logger);

      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });
  });
});
