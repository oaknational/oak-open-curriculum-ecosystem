/**
 * Unit tests for benchmark request building logic.
 *
 * Tests the pure function that determines how to construct ES search requests
 * based on phase and optional keyStage parameters.
 *
 * @see benchmark.ts
 */

import { describe, it, expect } from 'vitest';
import { buildBenchmarkRequestParams } from './benchmark-request-builder';

describe('buildBenchmarkRequestParams', () => {
  describe('when no queryKeyStage is provided', () => {
    it('uses phase filter for primary phase', () => {
      const result = buildBenchmarkRequestParams({
        query: 'fractions',
        subject: 'maths',
        phase: 'primary',
      });

      expect(result).toEqual({
        query: 'fractions',
        size: 10,
        subject: 'maths',
        phase: 'primary',
      });
      expect(result).not.toHaveProperty('keyStage');
    });

    it('uses phase filter for secondary phase', () => {
      const result = buildBenchmarkRequestParams({
        query: 'quadratic equations',
        subject: 'maths',
        phase: 'secondary',
      });

      expect(result).toEqual({
        query: 'quadratic equations',
        size: 10,
        subject: 'maths',
        phase: 'secondary',
      });
      expect(result).not.toHaveProperty('keyStage');
    });
  });

  describe('when queryKeyStage is provided', () => {
    it('uses keyStage filter instead of phase for ks4', () => {
      const result = buildBenchmarkRequestParams({
        query: 'completing the square higher',
        subject: 'maths',
        phase: 'secondary',
        queryKeyStage: 'ks4',
      });

      expect(result).toEqual({
        query: 'completing the square higher',
        size: 10,
        subject: 'maths',
        keyStage: 'ks4',
      });
      expect(result).not.toHaveProperty('phase');
    });

    it('uses keyStage filter instead of phase for ks1', () => {
      const result = buildBenchmarkRequestParams({
        query: 'counting to 10',
        subject: 'maths',
        phase: 'primary',
        queryKeyStage: 'ks1',
      });

      expect(result).toEqual({
        query: 'counting to 10',
        size: 10,
        subject: 'maths',
        keyStage: 'ks1',
      });
      expect(result).not.toHaveProperty('phase');
    });
  });

  describe('edge cases', () => {
    it('handles empty query', () => {
      const result = buildBenchmarkRequestParams({
        query: '',
        subject: 'science',
        phase: 'primary',
      });

      expect(result.query).toBe('');
      // Type guard to verify phase-based result
      expect('phase' in result).toBe(true);
      if ('phase' in result) {
        expect(result.phase).toBe('primary');
      }
    });

    it('preserves subject exactly as provided', () => {
      const result = buildBenchmarkRequestParams({
        query: 'test',
        subject: 'religious-education',
        phase: 'secondary',
      });

      expect(result.subject).toBe('religious-education');
    });
  });
});
