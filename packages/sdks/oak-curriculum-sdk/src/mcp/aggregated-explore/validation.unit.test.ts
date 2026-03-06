/**
 * Unit tests for explore-topic tool validation.
 *
 * Tests that validateExploreArgs correctly validates required query
 * and optional subject/keyStage filters.
 */

import { describe, it, expect } from 'vitest';
import { validateExploreArgs } from './validation.js';

describe('validateExploreArgs', () => {
  describe('valid inputs', () => {
    it('accepts minimal input with query only', () => {
      const result = validateExploreArgs({ query: 'volcanos' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.query).toBe('volcanos');
        expect(result.value.subject).toBeUndefined();
        expect(result.value.keyStage).toBeUndefined();
      }
    });

    it('accepts query with subject filter', () => {
      const result = validateExploreArgs({ query: 'fractions', subject: 'maths' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.query).toBe('fractions');
        expect(result.value.subject).toBe('maths');
      }
    });

    it('accepts query with keyStage filter', () => {
      const result = validateExploreArgs({ query: 'electricity', keyStage: 'ks3' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.keyStage).toBe('ks3');
      }
    });

    it('accepts query with both subject and keyStage', () => {
      const result = validateExploreArgs({
        query: 'photosynthesis',
        subject: 'science',
        keyStage: 'ks3',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.query).toBe('photosynthesis');
        expect(result.value.subject).toBe('science');
        expect(result.value.keyStage).toBe('ks3');
      }
    });

    it('trims whitespace from query', () => {
      const result = validateExploreArgs({ query: '  volcanos  ' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.query).toBe('volcanos');
      }
    });
  });

  describe('invalid inputs', () => {
    it('rejects null input', () => {
      const result = validateExploreArgs(null);
      expect(result.ok).toBe(false);
    });

    it('rejects string input', () => {
      const result = validateExploreArgs('volcanos');
      expect(result.ok).toBe(false);
    });

    it('rejects missing query', () => {
      const result = validateExploreArgs({});
      expect(result.ok).toBe(false);
    });

    it('rejects empty query', () => {
      const result = validateExploreArgs({ query: '' });
      expect(result.ok).toBe(false);
    });

    it('rejects whitespace-only query', () => {
      const result = validateExploreArgs({ query: '   ' });
      expect(result.ok).toBe(false);
    });

    it('rejects invalid keyStage', () => {
      const result = validateExploreArgs({ query: 'test', keyStage: 'ks5' });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain('keyStage');
      }
    });

    it('rejects invalid subject', () => {
      const result = validateExploreArgs({ query: 'test', subject: 'not-a-subject' });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain('subject');
      }
    });

    it('rejects unknown properties', () => {
      const result = validateExploreArgs({ query: 'test', extra: 'value' });
      expect(result.ok).toBe(false);
    });
  });
});
