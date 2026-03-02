import { describe, it, expect } from 'vitest';
import {
  makeSubjectKeyStageKey,
  isSubjectKeyStageKey,
  getPatternConfig,
  PATTERN_SUBJECTS,
  PATTERN_KEY_STAGES,
} from './curriculum-pattern-config';

describe('curriculum-pattern-config', () => {
  describe('makeSubjectKeyStageKey', () => {
    it('produces a colon-separated key from subject and key stage', () => {
      const key = makeSubjectKeyStageKey('art', 'ks1');

      expect(key).toBe('art:ks1');
    });

    it('produces correct keys for all constituent types', () => {
      const key = makeSubjectKeyStageKey('cooking-nutrition', 'ks4');

      expect(key).toBe('cooking-nutrition:ks4');
    });
  });

  describe('isSubjectKeyStageKey', () => {
    it('returns true for a valid key', () => {
      expect(isSubjectKeyStageKey('maths:ks2')).toBe(true);
    });

    it('returns true for every subject × key stage combination', () => {
      for (const subject of PATTERN_SUBJECTS) {
        for (const keyStage of PATTERN_KEY_STAGES) {
          expect(
            isSubjectKeyStageKey(`${subject}:${keyStage}`),
            `${subject}:${keyStage} should be valid`,
          ).toBe(true);
        }
      }
    });

    it('returns false for an unknown subject', () => {
      expect(isSubjectKeyStageKey('alchemy:ks1')).toBe(false);
    });

    it('returns false for an unknown key stage', () => {
      expect(isSubjectKeyStageKey('maths:ks99')).toBe(false);
    });

    it('returns false for an empty string', () => {
      expect(isSubjectKeyStageKey('')).toBe(false);
    });

    it('returns false for a key missing the separator', () => {
      expect(isSubjectKeyStageKey('mathsks2')).toBe(false);
    });
  });

  describe('getPatternConfig', () => {
    it('returns a PatternConfig for a valid subject and key stage', () => {
      const config = getPatternConfig('maths', 'ks2');

      expect(config).toBeDefined();
      expect(config?.pattern).toBe('simple-flat');
      expect(config?.traversal).toBe('key-stage-lessons');
    });

    it('returns undefined for an unknown subject', () => {
      expect(getPatternConfig('alchemy', 'ks1')).toBeUndefined();
    });

    it('returns undefined for an unknown key stage', () => {
      expect(getPatternConfig('maths', 'ks99')).toBeUndefined();
    });

    it('returns undefined for both unknown', () => {
      expect(getPatternConfig('alchemy', 'ks99')).toBeUndefined();
    });
  });
});
