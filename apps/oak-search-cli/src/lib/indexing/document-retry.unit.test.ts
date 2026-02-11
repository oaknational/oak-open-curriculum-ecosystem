/**
 * Unit tests for document-level retry utilities.
 *
 * @remarks
 * These tests verify BEHAVIOUR, not specific numeric outputs.
 * By importing the multiplier constant, tests remain valid even if
 * the multiplier value is changed.
 *
 * @see testing-strategy.md - "Test real behaviour, not implementation details"
 */
import { describe, it, expect } from 'vitest';
import {
  calculateProgressiveChunkDelay,
  DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER,
} from './bulk-chunk-utils';

describe('calculateProgressiveChunkDelay', () => {
  /**
   * Test: Attempt 0 should return the base delay unchanged.
   * This is the starting point - no multiplier applied yet.
   */
  it('returns base delay unchanged for attempt 0', () => {
    expect(calculateProgressiveChunkDelay(0, 2000)).toBe(2000);
    expect(calculateProgressiveChunkDelay(0, 500)).toBe(500);
    expect(calculateProgressiveChunkDelay(0, 10000)).toBe(10000);
  });

  /**
   * Test: Each subsequent attempt multiplies by DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER.
   * We test the RELATIONSHIP using the actual constant, not hardcoded values.
   */
  it('multiplies delay by DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER for each attempt', () => {
    const base = 1000;

    // Verify the mathematical relationship holds
    const delay0 = calculateProgressiveChunkDelay(0, base);
    const delay1 = calculateProgressiveChunkDelay(1, base);
    const delay2 = calculateProgressiveChunkDelay(2, base);

    expect(delay1).toBe(Math.floor(base * DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER));
    expect(delay2).toBe(Math.floor(base * Math.pow(DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER, 2)));

    // Also verify the general formula
    expect(delay0).toBe(Math.floor(base * Math.pow(DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER, 0)));
  });

  /**
   * Test: Delay increases monotonically with each attempt.
   * This is the key BEHAVIOUR - later attempts have longer delays.
   */
  it('increases delay with each subsequent attempt', () => {
    const base = 1000;

    const delay0 = calculateProgressiveChunkDelay(0, base);
    const delay1 = calculateProgressiveChunkDelay(1, base);
    const delay2 = calculateProgressiveChunkDelay(2, base);
    const delay3 = calculateProgressiveChunkDelay(3, base);

    expect(delay1).toBeGreaterThan(delay0);
    expect(delay2).toBeGreaterThan(delay1);
    expect(delay3).toBeGreaterThan(delay2);
  });

  /**
   * Test: Zero base delay always returns zero.
   * Edge case - multiplying zero by anything is still zero.
   */
  it('returns zero when base delay is zero', () => {
    expect(calculateProgressiveChunkDelay(0, 0)).toBe(0);
    expect(calculateProgressiveChunkDelay(1, 0)).toBe(0);
    expect(calculateProgressiveChunkDelay(5, 0)).toBe(0);
  });

  /**
   * Test: Result is always a whole number (floored).
   * We don't want fractional milliseconds in delays.
   */
  it('floors the result to avoid fractional milliseconds', () => {
    // Use a base that will produce fractional results with the multiplier
    const base = 100;

    for (let attempt = 0; attempt < 5; attempt++) {
      const result = calculateProgressiveChunkDelay(attempt, base);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBe(
        Math.floor(base * Math.pow(DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER, attempt)),
      );
    }
  });

  /**
   * Test: Function is pure (deterministic).
   * Same inputs always produce same outputs.
   */
  it('is deterministic - same inputs produce same outputs', () => {
    const base = 2000;

    for (let attempt = 0; attempt < 4; attempt++) {
      const result1 = calculateProgressiveChunkDelay(attempt, base);
      const result2 = calculateProgressiveChunkDelay(attempt, base);
      expect(result1).toBe(result2);
    }
  });
});
