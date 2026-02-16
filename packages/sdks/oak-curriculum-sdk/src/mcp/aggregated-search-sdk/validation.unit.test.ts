/**
 * Unit tests for SDK-backed search tool validation.
 *
 * Tests that validateSearchSdkArgs correctly validates and normalises
 * raw MCP input into strongly-typed SearchSdkArgs, testing all 5 scopes
 * and filter combinations.
 */

import { describe, it, expect } from 'vitest';
import { validateSearchSdkArgs } from './validation.js';

describe('validateSearchSdkArgs', () => {
  describe('valid inputs', () => {
    it('accepts minimal input with text and scope', () => {
      const result = validateSearchSdkArgs({ text: 'photosynthesis', scope: 'lessons' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.text).toBe('photosynthesis');
        expect(result.value.scope).toBe('lessons');
      }
    });

    it.each([['lessons'], ['units'], ['threads'], ['sequences'], ['suggest']] as const)(
      'accepts scope "%s"',
      (scope) => {
        const result = validateSearchSdkArgs({ text: 'test', scope });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.scope).toBe(scope);
        }
      },
    );

    it('accepts common filters (subject, keyStage, size, from)', () => {
      const result = validateSearchSdkArgs({
        text: 'fractions',
        scope: 'lessons',
        subject: 'maths',
        keyStage: 'ks2',
        size: 10,
        from: 5,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.subject).toBe('maths');
        expect(result.value.keyStage).toBe('ks2');
        expect(result.value.size).toBe(10);
        expect(result.value.from).toBe(5);
      }
    });

    it('accepts lesson-specific filters', () => {
      const result = validateSearchSdkArgs({
        text: 'trigonometry',
        scope: 'lessons',
        unitSlug: 'trigonometry-unit',
        tier: 'higher',
        examBoard: 'aqa',
        year: '10',
        threadSlug: 'maths-thread',
        highlight: true,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unitSlug).toBe('trigonometry-unit');
        expect(result.value.tier).toBe('higher');
        expect(result.value.examBoard).toBe('aqa');
        expect(result.value.year).toBe('10');
        expect(result.value.threadSlug).toBe('maths-thread');
        expect(result.value.highlight).toBe(true);
      }
    });

    it('accepts unit-specific filters', () => {
      const result = validateSearchSdkArgs({
        text: 'fractions',
        scope: 'units',
        minLessons: 5,
        highlight: true,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.minLessons).toBe(5);
        expect(result.value.highlight).toBe(true);
      }
    });

    it('accepts sequence-specific filters', () => {
      const result = validateSearchSdkArgs({
        text: 'science',
        scope: 'sequences',
        phaseSlug: 'secondary',
        category: 'science',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.phaseSlug).toBe('secondary');
        expect(result.value.category).toBe('science');
      }
    });

    it('accepts suggest-specific filters', () => {
      const result = validateSearchSdkArgs({
        text: 'photo',
        scope: 'suggest',
        limit: 10,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.limit).toBe(10);
      }
    });

    it('trims whitespace from text', () => {
      const result = validateSearchSdkArgs({ text: '  photosynthesis  ', scope: 'lessons' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.text).toBe('photosynthesis');
      }
    });
  });

  describe('invalid inputs', () => {
    it('rejects null input', () => {
      const result = validateSearchSdkArgs(null);
      expect(result.ok).toBe(false);
    });

    it('rejects string input', () => {
      const result = validateSearchSdkArgs('just a string');
      expect(result.ok).toBe(false);
    });

    it('rejects missing text', () => {
      const result = validateSearchSdkArgs({ scope: 'lessons' });
      expect(result.ok).toBe(false);
    });

    it('rejects empty text', () => {
      const result = validateSearchSdkArgs({ text: '', scope: 'lessons' });
      expect(result.ok).toBe(false);
    });

    it('rejects whitespace-only text', () => {
      const result = validateSearchSdkArgs({ text: '   ', scope: 'lessons' });
      expect(result.ok).toBe(false);
    });

    it('rejects missing scope', () => {
      const result = validateSearchSdkArgs({ text: 'test' });
      expect(result.ok).toBe(false);
    });

    it('rejects invalid scope', () => {
      const result = validateSearchSdkArgs({ text: 'test', scope: 'invalid' });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain('scope must be one of');
      }
    });

    it('rejects invalid keyStage', () => {
      const result = validateSearchSdkArgs({
        text: 'test',
        scope: 'lessons',
        keyStage: 'ks5',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain('keyStage');
      }
    });

    it('rejects invalid subject', () => {
      const result = validateSearchSdkArgs({
        text: 'test',
        scope: 'lessons',
        subject: 'not-a-subject',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain('subject');
      }
    });

    it('rejects size below minimum', () => {
      const result = validateSearchSdkArgs({ text: 'test', scope: 'lessons', size: 0 });
      expect(result.ok).toBe(false);
    });

    it('rejects size above maximum', () => {
      const result = validateSearchSdkArgs({ text: 'test', scope: 'lessons', size: 101 });
      expect(result.ok).toBe(false);
    });

    it('rejects negative from', () => {
      const result = validateSearchSdkArgs({ text: 'test', scope: 'lessons', from: -1 });
      expect(result.ok).toBe(false);
    });

    it('rejects unknown properties', () => {
      const result = validateSearchSdkArgs({
        text: 'test',
        scope: 'lessons',
        unknownProp: 'value',
      });
      expect(result.ok).toBe(false);
    });
  });

  describe('all key stages accepted', () => {
    it.each([['ks1'], ['ks2'], ['ks3'], ['ks4']] as const)('accepts keyStage "%s"', (keyStage) => {
      const result = validateSearchSdkArgs({ text: 'test', scope: 'lessons', keyStage });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.keyStage).toBe(keyStage);
      }
    });
  });

  describe('common subjects accepted', () => {
    it.each([['maths'], ['science'], ['english'], ['history'], ['geography']] as const)(
      'accepts subject "%s"',
      (subject) => {
        const result = validateSearchSdkArgs({ text: 'test', scope: 'lessons', subject });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.subject).toBe(subject);
        }
      },
    );
  });
});
