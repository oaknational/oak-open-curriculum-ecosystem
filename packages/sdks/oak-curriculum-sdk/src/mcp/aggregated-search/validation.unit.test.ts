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
    it('accepts minimal input with query and scope', () => {
      const result = validateSearchSdkArgs({ query: 'photosynthesis', scope: 'lessons' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.query).toBe('photosynthesis');
        expect(result.value.scope).toBe('lessons');
      }
    });

    it.each([['lessons'], ['units'], ['threads'], ['sequences'], ['suggest']] as const)(
      'accepts scope "%s"',
      (scope) => {
        const result = validateSearchSdkArgs({ query: 'test', scope });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.scope).toBe(scope);
        }
      },
    );

    it('accepts common filters (subject, keyStage, size, from)', () => {
      const result = validateSearchSdkArgs({
        query: 'fractions',
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
        query: 'trigonometry',
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

    it('normalises numeric year to string', () => {
      const result = validateSearchSdkArgs({
        query: 'algebra',
        scope: 'lessons',
        year: 7,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.year).toBe('7');
      }
    });

    it('normalises year boundary values (1 and 11)', () => {
      const low = validateSearchSdkArgs({ query: 'test', scope: 'lessons', year: 1 });
      const high = validateSearchSdkArgs({ query: 'test', scope: 'lessons', year: 11 });

      expect(low.ok).toBe(true);
      if (low.ok) {
        expect(low.value.year).toBe('1');
      }
      expect(high.ok).toBe(true);
      if (high.ok) {
        expect(high.value.year).toBe('11');
      }
    });

    it('accepts unit-specific filters', () => {
      const result = validateSearchSdkArgs({
        query: 'fractions',
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
        query: 'science',
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
        query: 'photo',
        scope: 'suggest',
        limit: 10,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.limit).toBe(10);
      }
    });

    it('trims whitespace from query', () => {
      const result = validateSearchSdkArgs({ query: '  photosynthesis  ', scope: 'lessons' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.query).toBe('photosynthesis');
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

    it('rejects missing query', () => {
      const result = validateSearchSdkArgs({ scope: 'lessons' });
      expect(result.ok).toBe(false);
    });

    it('rejects empty query', () => {
      const result = validateSearchSdkArgs({ query: '', scope: 'lessons' });
      expect(result.ok).toBe(false);
    });

    it('rejects whitespace-only query', () => {
      const result = validateSearchSdkArgs({ query: '   ', scope: 'lessons' });
      expect(result.ok).toBe(false);
    });

    it('rejects missing scope', () => {
      const result = validateSearchSdkArgs({ query: 'test' });
      expect(result.ok).toBe(false);
    });

    it('rejects invalid scope', () => {
      const result = validateSearchSdkArgs({ query: 'test', scope: 'invalid' });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain('scope must be one of');
      }
    });

    it('rejects invalid keyStage', () => {
      const result = validateSearchSdkArgs({
        query: 'test',
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
        query: 'test',
        scope: 'lessons',
        subject: 'not-a-subject',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain('subject');
      }
    });

    it('rejects size below minimum', () => {
      const result = validateSearchSdkArgs({ query: 'test', scope: 'lessons', size: 0 });
      expect(result.ok).toBe(false);
    });

    it('rejects size above maximum', () => {
      const result = validateSearchSdkArgs({ query: 'test', scope: 'lessons', size: 101 });
      expect(result.ok).toBe(false);
    });

    it('rejects negative from', () => {
      const result = validateSearchSdkArgs({ query: 'test', scope: 'lessons', from: -1 });
      expect(result.ok).toBe(false);
    });

    it('rejects year number below minimum (0)', () => {
      const result = validateSearchSdkArgs({ query: 'test', scope: 'lessons', year: 0 });
      expect(result.ok).toBe(false);
    });

    it('rejects year number above maximum (12)', () => {
      const result = validateSearchSdkArgs({ query: 'test', scope: 'lessons', year: 12 });
      expect(result.ok).toBe(false);
    });

    it('rejects non-integer year number', () => {
      const result = validateSearchSdkArgs({ query: 'test', scope: 'lessons', year: 3.5 });
      expect(result.ok).toBe(false);
    });

    it('rejects unknown properties', () => {
      const result = validateSearchSdkArgs({
        query: 'test',
        scope: 'lessons',
        unknownProp: 'value',
      });
      expect(result.ok).toBe(false);
    });
  });

  describe('query-less thread search', () => {
    it('accepts empty query for threads scope with subject filter', () => {
      const result = validateSearchSdkArgs({
        query: '',
        scope: 'threads',
        subject: 'maths',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.query).toBe('');
        expect(result.value.scope).toBe('threads');
        expect(result.value.subject).toBe('maths');
      }
    });

    it('accepts missing query for threads scope with keyStage filter', () => {
      const result = validateSearchSdkArgs({
        scope: 'threads',
        keyStage: 'ks3',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.query).toBe('');
        expect(result.value.scope).toBe('threads');
        expect(result.value.keyStage).toBe('ks3');
      }
    });

    it('accepts empty query for threads scope with both subject and keyStage', () => {
      const result = validateSearchSdkArgs({
        query: '',
        scope: 'threads',
        subject: 'maths',
        keyStage: 'ks3',
      });

      expect(result.ok).toBe(true);
    });

    it('rejects empty query for threads scope with no filter', () => {
      const result = validateSearchSdkArgs({
        query: '',
        scope: 'threads',
      });

      expect(result.ok).toBe(false);
    });

    it('still rejects empty query for non-thread scopes', () => {
      for (const scope of ['lessons', 'units', 'sequences', 'suggest']) {
        const result = validateSearchSdkArgs({
          query: '',
          scope,
          subject: 'maths',
        });

        expect(result.ok).toBe(false);
      }
    });
  });

  describe('all key stages accepted', () => {
    it.each([['ks1'], ['ks2'], ['ks3'], ['ks4']] as const)('accepts keyStage "%s"', (keyStage) => {
      const result = validateSearchSdkArgs({ query: 'test', scope: 'lessons', keyStage });

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
        const result = validateSearchSdkArgs({ query: 'test', scope: 'lessons', subject });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.subject).toBe(subject);
        }
      },
    );
  });
});
