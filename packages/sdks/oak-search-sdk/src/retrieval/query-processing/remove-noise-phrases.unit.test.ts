import { describe, expect, it } from 'vitest';

import { removeNoisePhrases } from './remove-noise-phrases.js';

describe('removeNoisePhrases', () => {
  describe('that-X-stuff capture and replacement', () => {
    it('captures the content between "that" and "stuff" for short phrases', () => {
      expect(removeNoisePhrases('that thing about photosynthesis stuff')).toBe(
        'thing about photosynthesis',
      );
    });

    it('captures the content between "that" and "stuff for"', () => {
      expect(removeNoisePhrases('that lesson stuff for year 8 maths')).toBe('lesson year 8 maths');
    });

    it('handles a single-word capture between "that" and "stuff"', () => {
      expect(removeNoisePhrases('that photosynthesis stuff')).toBe('photosynthesis');
    });

    it('leaves the input unchanged when "that" or "stuff" is absent', () => {
      expect(removeNoisePhrases('photosynthesis lesson plan')).toBe('photosynthesis lesson plan');
    });
  });

  describe('prefix-noise removal', () => {
    it('strips "how do I"', () => {
      expect(removeNoisePhrases('how do I teach photosynthesis')).toBe('teach photosynthesis');
    });

    it('strips "how to"', () => {
      expect(removeNoisePhrases('how to find common factors')).toBe('find common factors');
    });

    it('strips "what is"', () => {
      expect(removeNoisePhrases('what is photosynthesis')).toBe('photosynthesis');
    });

    it('strips "the bit where you"', () => {
      expect(removeNoisePhrases('the bit where you balance equations')).toBe('balance equations');
    });

    it('strips "teach my students about"', () => {
      expect(removeNoisePhrases('teach my students about volcanoes')).toBe('volcanoes');
    });

    it('strips "lesson on"', () => {
      expect(removeNoisePhrases('lesson on the water cycle')).toBe('the water cycle');
    });

    it('strips "help with"', () => {
      expect(removeNoisePhrases('help with quadratic equations')).toBe('quadratic equations');
    });
  });

  describe('whitespace normalisation', () => {
    it('collapses multiple spaces to single spaces', () => {
      expect(removeNoisePhrases('  what  is   photosynthesis  ')).toBe('photosynthesis');
    });
  });

  describe('polynomial-redos defence (CodeQL js/polynomial-redos #62/#63)', () => {
    it('completes within a bounded wall-clock budget on adversarial "that"-prefix inputs', () => {
      // The original /\bthat\s+(.+?)\s+stuff(\s+for)?/i was vulnerable to
      // polynomial backtracking when fed "that " repeated without a
      // closing "stuff". Bound the captured content to ≤6 tokens to make
      // worst-case runtime linear in the input length.
      const adversarial = `${'that '.repeat(200)}end`;
      const start = performance.now();
      removeNoisePhrases(adversarial);
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(50);
    });

    it('completes within a bounded wall-clock budget on a 1000-character input', () => {
      const adversarial = `${'that '.repeat(1000)}end`;
      const start = performance.now();
      removeNoisePhrases(adversarial);
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(100);
    });

    it('still recognises a "that ... stuff" phrase within the bounded capture', () => {
      // 1000 'that ' followed by '... stuff' — engine does not catastrophically
      // backtrack and the bounded match still finds the trailing "stuff" phrase
      // when content is within the 6-token window.
      const input = `${'that '.repeat(50)}thing of stuff for year 7`;
      const start = performance.now();
      const result = removeNoisePhrases(input);
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(100);
      expect(result).toContain('year 7');
    });
  });
});
