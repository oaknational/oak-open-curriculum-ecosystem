/**
 * Unit tests for TTL jitter function - cache stampede prevention.
 *
 * These tests verify the `calculateTtlWithJitter` function correctly applies
 * jitter to cache TTL values to prevent cache stampede.
 *
 * @see `./ttl-jitter.ts` for implementation
 * @see `../../../../../docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md` for ADR
 */

import { describe, it, expect } from 'vitest';
import { calculateTtlWithJitter } from './ttl-jitter';

describe('calculateTtlWithJitter', () => {
  /** Base TTL calculation with no jitter. */
  it('returns base TTL in seconds when jitter is zero', () => {
    const baseDays = 14;
    const jitterHours = 0;
    const deterministicRandom = () => 0.5;

    const result = calculateTtlWithJitter(baseDays, jitterHours, deterministicRandom);

    const expectedSeconds = baseDays * 24 * 60 * 60; // 1,209,600 seconds
    expect(result).toBe(expectedSeconds);
  });

  /** Maximum positive jitter when random = 1. */
  it('adds maximum positive jitter when random = 1', () => {
    const baseDays = 14;
    const jitterHours = 12;
    const maxRandom = () => 1;

    const result = calculateTtlWithJitter(baseDays, jitterHours, maxRandom);

    const baseSeconds = baseDays * 24 * 60 * 60;
    const jitterSeconds = jitterHours * 60 * 60;
    const expected = baseSeconds + jitterSeconds; // 14.5 days in seconds
    expect(result).toBe(expected);
  });

  /** Maximum negative jitter when random = 0. */
  it('applies maximum negative jitter when random = 0', () => {
    const baseDays = 14;
    const jitterHours = 12;
    const minRandom = () => 0;

    const result = calculateTtlWithJitter(baseDays, jitterHours, minRandom);

    const baseSeconds = baseDays * 24 * 60 * 60;
    const jitterSeconds = jitterHours * 60 * 60;
    const expected = baseSeconds - jitterSeconds; // 13.5 days in seconds
    expect(result).toBe(expected);
  });

  /** No jitter when random = 0.5 (midpoint). */
  it('returns base TTL with no jitter when random = 0.5', () => {
    const baseDays = 14;
    const jitterHours = 12;
    const midpointRandom = () => 0.5;

    const result = calculateTtlWithJitter(baseDays, jitterHours, midpointRandom);

    const baseSeconds = baseDays * 24 * 60 * 60;
    expect(result).toBe(baseSeconds);
  });

  /** Produces varied TTLs across multiple calls with varied random. */
  it('produces varied TTLs when random values differ', () => {
    const baseDays = 14;
    const jitterHours = 12;
    let callCount = 0;
    const randomValues = [0.2, 0.8, 0.5, 0.1, 0.9];
    const variedRandom = () => {
      const value = randomValues[callCount % randomValues.length];
      callCount++;
      return value ?? 0.5;
    };

    const results = Array.from({ length: 5 }, () =>
      calculateTtlWithJitter(baseDays, jitterHours, variedRandom),
    );

    const uniqueResults = new Set(results);
    expect(uniqueResults.size).toBeGreaterThan(1);
  });

  /** TTL range bounds with ±12 hour jitter on 14-day base. */
  it('respects bounds: 13.5 to 14.5 days with 12-hour jitter on 14-day base', () => {
    const baseDays = 14;
    const jitterHours = 12;

    const minTtl = calculateTtlWithJitter(baseDays, jitterHours, () => 0);
    const maxTtl = calculateTtlWithJitter(baseDays, jitterHours, () => 1);

    // 13.5 days in seconds
    const expectedMin = (14 - 0.5) * 24 * 60 * 60; // 1,166,400
    // 14.5 days in seconds
    const expectedMax = (14 + 0.5) * 24 * 60 * 60; // 1,252,800

    expect(minTtl).toBe(expectedMin);
    expect(maxTtl).toBe(expectedMax);
  });

  /** Defaults: uses Math.random when no randomFn provided. */
  it('uses Math.random by default and returns value in expected range', () => {
    const baseDays = 14;
    const jitterHours = 12;

    // Call multiple times to verify range
    const results = Array.from({ length: 100 }, () =>
      calculateTtlWithJitter(baseDays, jitterHours),
    );

    const baseSeconds = baseDays * 24 * 60 * 60;
    const jitterSeconds = jitterHours * 60 * 60;
    const minExpected = baseSeconds - jitterSeconds;
    const maxExpected = baseSeconds + jitterSeconds;

    // All results should be within bounds
    for (const result of results) {
      expect(result).toBeGreaterThanOrEqual(minExpected);
      expect(result).toBeLessThanOrEqual(maxExpected);
    }
  });

  /** Default jitter is 12 hours. */
  it('defaults to 12-hour jitter when not specified', () => {
    const baseDays = 14;
    // Using extreme random values to verify default jitter amount

    const minTtl = calculateTtlWithJitter(baseDays, undefined, () => 0);
    const maxTtl = calculateTtlWithJitter(baseDays, undefined, () => 1);

    const baseSeconds = baseDays * 24 * 60 * 60;
    const defaultJitterSeconds = 12 * 60 * 60;

    expect(minTtl).toBe(baseSeconds - defaultJitterSeconds);
    expect(maxTtl).toBe(baseSeconds + defaultJitterSeconds);
  });
});
