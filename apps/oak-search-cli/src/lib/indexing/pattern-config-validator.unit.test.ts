import { describe, it, expect } from 'vitest';
import { typeSafeEntries } from '@oaknational/curriculum-sdk';
import {
  validatePatternConfig,
  assertPatternConfigValid,
  getConfiguredPatternCount,
} from './pattern-config-validator';
import { CURRICULUM_PATTERN_CONFIG } from './curriculum-pattern-config';

describe('pattern-config-validator', () => {
  describe('validatePatternConfig', () => {
    it('should validate all 68 subject × keystage combinations are configured', () => {
      const result = validatePatternConfig();

      expect(result.total).toBe(68); // 17 subjects × 4 key stages
      expect(result.configured).toBe(68);
      expect(result.missing).toEqual([]);
    });

    it('should detect no validation errors in the current config', () => {
      const result = validatePatternConfig();

      expect(result.errors).toEqual([]);
      expect(result.valid).toBe(true);
    });

    it('should have correct number of entries in CURRICULUM_PATTERN_CONFIG', () => {
      const entryCount = getConfiguredPatternCount();

      expect(entryCount).toBe(68);
    });
  });

  describe('assertPatternConfigValid', () => {
    it('should not throw for the current valid config', () => {
      expect(() => assertPatternConfigValid()).not.toThrow();
    });
  });

  describe('pattern config structure', () => {
    it('should have sequence-units configs with sequences defined', () => {
      const sequenceUnitConfigs = typeSafeEntries(CURRICULUM_PATTERN_CONFIG).filter(
        ([, config]) => config.traversal === 'sequence-units',
      );

      for (const [key, config] of sequenceUnitConfigs) {
        expect(config.sequences, `${key} should have sequences defined`).toBeDefined();
        expect(
          config.sequences?.length,
          `${key} should have at least one sequence`,
        ).toBeGreaterThan(0);
      }
    });

    it('should have skip traversal for empty and no-ks4 patterns', () => {
      const skipPatterns = typeSafeEntries(CURRICULUM_PATTERN_CONFIG).filter(
        ([, config]) => config.pattern === 'empty' || config.pattern === 'no-ks4',
      );

      for (const [key, config] of skipPatterns) {
        expect(config.traversal, `${key} should have traversal='skip'`).toBe('skip');
      }
    });

    it('should have correct patterns for known edge cases', () => {
      // Science KS4: exam-subject-split (most complex)
      expect(CURRICULUM_PATTERN_CONFIG['science:ks4'].pattern).toBe('exam-subject-split');
      expect(CURRICULUM_PATTERN_CONFIG['science:ks4'].traversal).toBe('sequence-units');

      // Maths KS4: tier-variants
      expect(CURRICULUM_PATTERN_CONFIG['maths:ks4'].pattern).toBe('tier-variants');
      expect(CURRICULUM_PATTERN_CONFIG['maths:ks4'].traversal).toBe('sequence-units');

      // French KS1: empty (French starts at KS2)
      expect(CURRICULUM_PATTERN_CONFIG['french:ks1'].pattern).toBe('empty');
      expect(CURRICULUM_PATTERN_CONFIG['french:ks1'].traversal).toBe('skip');

      // Cooking-nutrition KS4: no-ks4
      expect(CURRICULUM_PATTERN_CONFIG['cooking-nutrition:ks4'].pattern).toBe('no-ks4');
      expect(CURRICULUM_PATTERN_CONFIG['cooking-nutrition:ks4'].traversal).toBe('skip');

      // Maths KS2: simple-flat (standard)
      expect(CURRICULUM_PATTERN_CONFIG['maths:ks2'].pattern).toBe('simple-flat');
      expect(CURRICULUM_PATTERN_CONFIG['maths:ks2'].traversal).toBe('key-stage-lessons');
    });
  });
});
