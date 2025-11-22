/**
 * Unit tests for RFC 8707 resource parameter validation.
 *
 * These tests verify that JWT audience claims are correctly validated
 * against the expected resource URL to prevent token misuse.
 *
 * Part of Phase 2, Sub-Phase 2.4
 */

import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import { validateResourceParameter } from './resource-parameter-validator.js';

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

      const result = validateResourceParameter(token, EXPECTED_RESOURCE);

      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('returns valid:true for token with multiple aud values, one matches', () => {
      const token = createToken({
        aud: ['https://other.example.com', EXPECTED_RESOURCE, 'https://another.example.com'],
      });

      const result = validateResourceParameter(token, EXPECTED_RESOURCE);

      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });
  });

  describe('Invalid tokens', () => {
    it('returns valid:false for token with wrong aud', () => {
      const token = createToken({ aud: 'https://wrong.example.com' });

      const result = validateResourceParameter(token, EXPECTED_RESOURCE);

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Token audience mismatch');
      expect(result.reason).toContain(EXPECTED_RESOURCE);
      expect(result.reason).toContain('https://wrong.example.com');
    });

    it('returns valid:false for token with missing aud', () => {
      const token = createToken({ sub: 'user123' }); // No aud claim

      const result = validateResourceParameter(token, EXPECTED_RESOURCE);

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Token audience mismatch');
      expect(result.reason).toContain('(none)');
    });

    it('returns valid:false for invalid JWT format', () => {
      const result = validateResourceParameter('not-a-jwt', EXPECTED_RESOURCE);

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Invalid JWT format');
    });

    it('returns valid:false for token decode error', () => {
      const result = validateResourceParameter('', EXPECTED_RESOURCE);

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Invalid JWT format');
    });
  });
});
