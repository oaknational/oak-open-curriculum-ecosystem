/**
 * Unit tests for benchmark status indicators.
 *
 * Tests the pure function that determines status (EXCELLENT/GOOD/ACCEPTABLE/BAD)
 * based on measured value vs reference thresholds.
 *
 * @packageDocumentation
 */

import { describe, it, expect } from 'vitest';
import { determineStatus, formatStatusSymbol, type MetricThresholds } from './benchmark-status.js';

describe('determineStatus', () => {
  describe('higher-is-better metrics (MRR, NDCG, etc.)', () => {
    const thresholds: MetricThresholds = {
      excellent: 0.9,
      good: 0.7,
      fair: 0.5,
    };

    it('returns EXCELLENT when value >= excellent threshold', () => {
      expect(determineStatus(0.95, thresholds, 'higher')).toBe('EXCELLENT');
      expect(determineStatus(0.9, thresholds, 'higher')).toBe('EXCELLENT');
    });

    it('returns GOOD when value >= good threshold but < excellent', () => {
      expect(determineStatus(0.89, thresholds, 'higher')).toBe('GOOD');
      expect(determineStatus(0.7, thresholds, 'higher')).toBe('GOOD');
    });

    it('returns ACCEPTABLE when value >= fair threshold but < good', () => {
      expect(determineStatus(0.69, thresholds, 'higher')).toBe('ACCEPTABLE');
      expect(determineStatus(0.5, thresholds, 'higher')).toBe('ACCEPTABLE');
    });

    it('returns BAD when value < fair threshold', () => {
      expect(determineStatus(0.49, thresholds, 'higher')).toBe('BAD');
      expect(determineStatus(0.1, thresholds, 'higher')).toBe('BAD');
    });
  });

  describe('lower-is-better metrics (zeroHitRate, latency)', () => {
    const zeroHitThresholds: MetricThresholds = {
      excellent: 0.05,
      good: 0.1,
      fair: 0.2,
    };

    it('returns EXCELLENT when value <= excellent threshold', () => {
      expect(determineStatus(0.03, zeroHitThresholds, 'lower')).toBe('EXCELLENT');
      expect(determineStatus(0.05, zeroHitThresholds, 'lower')).toBe('EXCELLENT');
    });

    it('returns GOOD when value <= good threshold but > excellent', () => {
      expect(determineStatus(0.06, zeroHitThresholds, 'lower')).toBe('GOOD');
      expect(determineStatus(0.1, zeroHitThresholds, 'lower')).toBe('GOOD');
    });

    it('returns ACCEPTABLE when value <= fair threshold but > good', () => {
      expect(determineStatus(0.15, zeroHitThresholds, 'lower')).toBe('ACCEPTABLE');
      expect(determineStatus(0.2, zeroHitThresholds, 'lower')).toBe('ACCEPTABLE');
    });

    it('returns BAD when value > fair threshold', () => {
      expect(determineStatus(0.25, zeroHitThresholds, 'lower')).toBe('BAD');
      expect(determineStatus(0.5, zeroHitThresholds, 'lower')).toBe('BAD');
    });

    const latencyThresholds: MetricThresholds = {
      excellent: 100,
      good: 300,
      fair: 500,
    };

    it('handles latency thresholds correctly', () => {
      expect(determineStatus(80, latencyThresholds, 'lower')).toBe('EXCELLENT');
      expect(determineStatus(200, latencyThresholds, 'lower')).toBe('GOOD');
      expect(determineStatus(400, latencyThresholds, 'lower')).toBe('ACCEPTABLE');
      expect(determineStatus(600, latencyThresholds, 'lower')).toBe('BAD');
    });
  });
});

describe('formatStatusSymbol', () => {
  it('returns ✓✓ for EXCELLENT', () => {
    expect(formatStatusSymbol('EXCELLENT')).toBe('✓✓');
  });

  it('returns ✓ for GOOD', () => {
    expect(formatStatusSymbol('GOOD')).toBe('✓');
  });

  it('returns ~ for ACCEPTABLE', () => {
    expect(formatStatusSymbol('ACCEPTABLE')).toBe('~');
  });

  it('returns ✗ for BAD', () => {
    expect(formatStatusSymbol('BAD')).toBe('✗');
  });
});
