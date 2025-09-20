/**
 * Unit tests for request validation functions
 * Following TDD approach - tests written before implementation
 */

import { describe, it, expect } from 'vitest';
import { validateRequest } from './request-validators.js';
import type { HttpMethod } from './types.js';
import type { ValidPath } from 'src/types/generated/api-schema/path-parameters.js';

function hasOwnString(o: unknown, key: string, expected: string): boolean {
  if (typeof o !== 'object' || o === null) {
    return false;
  }
  const d = Object.getOwnPropertyDescriptor(o, key);
  return d?.value === expected;
}

describe('validateRequest', () => {
  describe('for GET /lessons/{lesson}/transcript', () => {
    const path = '/lessons/{lesson}/transcript';
    const method = 'get';

    it('should validate valid path parameters', () => {
      const args = {
        lesson: 'valid-lesson-slug',
      };

      const result = validateRequest(path, method, args);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual({
          lesson: 'valid-lesson-slug',
        });
      }
    });

    it('should reject invalid path parameters', () => {
      const args = {
        lesson: 123, // Should be string
      };

      const result = validateRequest(path, method, args);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues).toHaveLength(1);
        expect(result.issues[0].path).toContain('lesson');
        expect(result.issues[0].message).toContain('string');
      }
    });

    it('should reject missing required parameters', () => {
      const args = {};

      const result = validateRequest(path, method, args);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues).toHaveLength(1);
        expect(result.issues[0].message).toContain('Required');
      }
    });
  });

  describe('for GET /search/lessons with query parameters', () => {
    const path = '/search/lessons';
    const method = 'get';

    it('should validate valid query parameters', () => {
      const args = {
        q: 'mathematics',
        keyStage: 'ks3',
        subject: 'maths',
      };

      const result = validateRequest(path, method, args);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(hasOwnString(result.value, 'q', 'mathematics')).toBe(true);
        expect(hasOwnString(result.value, 'keyStage', 'ks3')).toBe(true);
        expect(hasOwnString(result.value, 'subject', 'maths')).toBe(true);
      }
    });

    it('should reject invalid enum values', () => {
      const args = {
        q: 'search term',
        keyStage: 'invalid-stage', // Not in enum
      };

      const result = validateRequest(path, method, args);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues).toHaveLength(1);
        expect(result.issues[0].path).toContain('keyStage');
        expect(result.issues[0].message).toContain('Invalid');
      }
    });

    it('should allow optional parameters to be omitted', () => {
      const args = {
        q: 'search term', // Only required param
      };

      const result = validateRequest(path, method, args);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(hasOwnString(result.value, 'q', 'search term')).toBe(true);
      }
    });
  });

  describe('for unknown operations', () => {
    it('should return error for unknown path', () => {
      const result = validateRequest('/unknown/path' as ValidPath, 'get', {});

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues[0].message).toContain('Unknown operation');
      }
    });

    it('should return error for unsupported method', () => {
      const result = validateRequest('/lessons/{lesson}/transcript', 'post' as HttpMethod, {});

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues[0].message).toContain('Unsupported method');
      }
    });
  });
});
