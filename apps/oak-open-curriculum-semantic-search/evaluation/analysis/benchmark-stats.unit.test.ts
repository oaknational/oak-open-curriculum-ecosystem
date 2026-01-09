/**
 * Unit tests for benchmark statistics functions.
 *
 * @packageDocumentation
 */

import { describe, it, expect } from 'vitest';
import { calculateP95 } from './benchmark-stats';

describe('calculateP95', () => {
  it('returns 0 for empty array', () => {
    const result = calculateP95([]);
    expect(result).toBe(0);
  });

  it('returns the single value for array of one', () => {
    const result = calculateP95([100]);
    expect(result).toBe(100);
  });

  it('returns the maximum for array of two values', () => {
    // 95th percentile of 2 values is effectively the max
    const result = calculateP95([100, 200]);
    expect(result).toBe(200);
  });

  it('returns approximately 95th percentile for larger array', () => {
    // 20 values: 1-20. 95th percentile index = floor(20 * 0.95) = 19
    const latencies = Array.from({ length: 20 }, (_, i) => i + 1);
    const result = calculateP95(latencies);
    expect(result).toBe(20); // Index 19 (0-based) = value 20
  });

  it('handles unsorted input correctly', () => {
    // Should sort internally
    const latencies = [300, 100, 200, 400, 500];
    const result = calculateP95(latencies);
    // Sorted: [100, 200, 300, 400, 500]
    // 95th percentile index = floor(5 * 0.95) = 4
    expect(result).toBe(500);
  });

  it('returns correct p95 for 100 values', () => {
    // 100 values: 1-100. 95th percentile index = floor(100 * 0.95) = 95
    const latencies = Array.from({ length: 100 }, (_, i) => i + 1);
    const result = calculateP95(latencies);
    expect(result).toBe(96); // Index 95 (0-based) = value 96
  });

  it('handles all same values', () => {
    const latencies = [50, 50, 50, 50, 50];
    const result = calculateP95(latencies);
    expect(result).toBe(50);
  });

  it('handles realistic latency distribution', () => {
    // Simulate realistic latencies: mostly fast, some slow outliers
    const latencies = [
      ...Array.from({ length: 90 }, () => 100), // 90 fast queries at 100ms
      ...Array.from({ length: 5 }, () => 200), // 5 medium queries at 200ms
      ...Array.from({ length: 5 }, () => 500), // 5 slow queries at 500ms
    ];
    const result = calculateP95(latencies);
    // Index = floor(100 * 0.95) = 95
    // Sorted: [100 (indices 0-89), 200 (indices 90-94), 500 (indices 95-99)]
    // Index 95 is in the 500ms range
    expect(result).toBe(500);
  });
});
