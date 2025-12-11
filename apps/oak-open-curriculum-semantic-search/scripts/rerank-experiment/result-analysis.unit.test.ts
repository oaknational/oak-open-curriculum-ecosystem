/**
 * @module rerank-experiment/result-analysis.unit.test
 * @description Unit tests for experiment result analysis.
 */

import { describe, it, expect } from 'vitest';
import { calculateAverages, formatResultRow, compareResults } from './result-analysis';
import type { AccumulatedMetrics, ExperimentResult } from './types';

describe('calculateAverages', () => {
  it('calculates averages from accumulated metrics', () => {
    const metrics: AccumulatedMetrics = {
      mrrs: [1.0, 0.5, 0.333],
      ndcgs: [0.9, 0.8, 0.7],
      latencies: [100, 200, 300],
      errors: 2,
    };

    const result = calculateAverages('Test Experiment', metrics);

    expect(result.name).toBe('Test Experiment');
    expect(result.avgMRR).toBeCloseTo(0.611, 2);
    expect(result.avgNDCG).toBeCloseTo(0.8, 2);
    expect(result.avgLatency).toBeCloseTo(200, 0);
    expect(result.errors).toBe(2);
  });

  it('handles empty latencies array', () => {
    const metrics: AccumulatedMetrics = {
      mrrs: [1.0, 0.5],
      ndcgs: [0.9, 0.8],
      latencies: [],
      errors: 0,
    };

    const result = calculateAverages('Test', metrics);

    expect(result.avgLatency).toBe(0);
  });

  it('handles single value arrays', () => {
    const metrics: AccumulatedMetrics = {
      mrrs: [0.75],
      ndcgs: [0.85],
      latencies: [150],
      errors: 1,
    };

    const result = calculateAverages('Single', metrics);

    expect(result.avgMRR).toBe(0.75);
    expect(result.avgNDCG).toBe(0.85);
    expect(result.avgLatency).toBe(150);
  });
});

describe('formatResultRow', () => {
  it('formats result for table display', () => {
    const result: ExperimentResult = {
      name: '2-way (no rerank)',
      avgMRR: 0.567,
      avgNDCG: 0.789,
      avgLatency: 123,
      errors: 2,
    };

    const row = formatResultRow(result);

    expect(row).toContain('2-way (no rerank)');
    expect(row).toContain('0.567');
    expect(row).toContain('0.789');
    expect(row).toContain('123ms');
    expect(row).toContain('2');
  });

  it('pads name to 22 characters', () => {
    const result: ExperimentResult = {
      name: 'Short',
      avgMRR: 0.5,
      avgNDCG: 0.5,
      avgLatency: 100,
      errors: 0,
    };

    const row = formatResultRow(result);

    // Name should be padded
    expect(row.startsWith('Short')).toBe(true);
    expect(row.indexOf('|')).toBe(22);
  });
});

describe('compareResults', () => {
  it('calculates difference between two results', () => {
    const baseline: ExperimentResult = {
      name: 'Baseline',
      avgMRR: 0.5,
      avgNDCG: 0.6,
      avgLatency: 100,
      errors: 0,
    };

    const variant: ExperimentResult = {
      name: 'Variant',
      avgMRR: 0.7,
      avgNDCG: 0.8,
      avgLatency: 150,
      errors: 1,
    };

    const comparison = compareResults(baseline, variant);

    expect(comparison.mrrDiff).toBeCloseTo(0.2, 3);
    expect(comparison.ndcgDiff).toBeCloseTo(0.2, 3);
  });

  it('returns negative diff when variant is worse', () => {
    const baseline: ExperimentResult = {
      name: 'Baseline',
      avgMRR: 0.8,
      avgNDCG: 0.9,
      avgLatency: 100,
      errors: 0,
    };

    const variant: ExperimentResult = {
      name: 'Variant',
      avgMRR: 0.6,
      avgNDCG: 0.7,
      avgLatency: 150,
      errors: 1,
    };

    const comparison = compareResults(baseline, variant);

    expect(comparison.mrrDiff).toBeCloseTo(-0.2, 3);
    expect(comparison.ndcgDiff).toBeCloseTo(-0.2, 3);
  });
});
