/**
 * Unit tests for safeGet helper function.
 *
 * Tests verify that safeGet correctly wraps async operations and converts
 * exceptions to Result.Err per ADR-088.
 *
 * NO network IO, pure function tests with simple fakes.
 *
 * @see {@link ./sdk-safe-get.ts}
 * @see {@link ../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md}
 */

import { describe, it, expect } from 'vitest';
import { safeGet } from './sdk-safe-get';

describe('safeGet', () => {
  describe('success case', () => {
    it('should return Ok with value when operation resolves', async () => {
      const expectedValue = { data: 'test-response', status: 200 };

      const result = await safeGet(() => Promise.resolve(expectedValue), 'test-resource', 'lesson');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(expectedValue);
      }
    });
  });

  describe('error handling', () => {
    it('should return Err(network_error) when operation rejects with Error', async () => {
      const networkError = new TypeError('fetch failed');

      const result = await safeGet(
        () => Promise.reject(networkError),
        'test-lesson-slug',
        'transcript',
      );

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('network_error');
        expect(result.error.resource).toBe('test-lesson-slug');
        if (result.error.kind === 'network_error') {
          expect(result.error.cause).toBe(networkError);
        }
      }
    });

    it('should return Err(network_error) when operation rejects with non-Error', async () => {
      const nonErrorValue = 'string error message';

      const result = await safeGet(() => Promise.reject(nonErrorValue), 'unit-slug', 'unit');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('network_error');
        expect(result.error.resource).toBe('unit-slug');
        if (result.error.kind === 'network_error') {
          expect(result.error.cause).toBeInstanceOf(Error);
          expect(result.error.cause.message).toBe('string error message');
        }
      }
    });
  });
});
