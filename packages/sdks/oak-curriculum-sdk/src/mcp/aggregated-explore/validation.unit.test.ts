/**
 * Unit tests for explore-topic tool validation.
 *
 * Tests that validateExploreArgs correctly validates required text
 * and optional subject/keyStage filters.
 */

import { describe, it, expect } from 'vitest';
import { validateExploreArgs } from './validation.js';

describe('validateExploreArgs', () => {
  describe('valid inputs', () => {
    it('accepts minimal input with text only', () => {
      const result = validateExploreArgs({ text: 'volcanos' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.text).toBe('volcanos');
        expect(result.value.subject).toBeUndefined();
        expect(result.value.keyStage).toBeUndefined();
      }
    });

    it('accepts text with subject filter', () => {
      const result = validateExploreArgs({ text: 'fractions', subject: 'maths' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.text).toBe('fractions');
        expect(result.value.subject).toBe('maths');
      }
    });

    it('accepts text with keyStage filter', () => {
      const result = validateExploreArgs({ text: 'electricity', keyStage: 'ks3' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.keyStage).toBe('ks3');
      }
    });

    it('accepts text with both subject and keyStage', () => {
      const result = validateExploreArgs({
        text: 'photosynthesis',
        subject: 'science',
        keyStage: 'ks3',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.text).toBe('photosynthesis');
        expect(result.value.subject).toBe('science');
        expect(result.value.keyStage).toBe('ks3');
      }
    });

    it('trims whitespace from text', () => {
      const result = validateExploreArgs({ text: '  volcanos  ' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.text).toBe('volcanos');
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

    it('rejects missing text', () => {
      const result = validateExploreArgs({});
      expect(result.ok).toBe(false);
    });

    it('rejects empty text', () => {
      const result = validateExploreArgs({ text: '' });
      expect(result.ok).toBe(false);
    });

    it('rejects whitespace-only text', () => {
      const result = validateExploreArgs({ text: '   ' });
      expect(result.ok).toBe(false);
    });

    it('rejects invalid keyStage', () => {
      const result = validateExploreArgs({ text: 'test', keyStage: 'ks5' });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain('keyStage');
      }
    });

    it('rejects invalid subject', () => {
      const result = validateExploreArgs({ text: 'test', subject: 'not-a-subject' });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain('subject');
      }
    });

    it('rejects unknown properties', () => {
      const result = validateExploreArgs({ text: 'test', extra: 'value' });
      expect(result.ok).toBe(false);
    });
  });
});
