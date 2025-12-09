/**
 * Unit tests for per-index completion context definitions.
 *
 * These tests verify that completion contexts are defined as readonly tuples
 * for each search index, enabling compile-time enforcement of valid contexts.
 */
import { describe, expect, it } from 'vitest';

import {
  LESSONS_COMPLETION_CONTEXTS,
  UNITS_COMPLETION_CONTEXTS,
  UNIT_ROLLUP_COMPLETION_CONTEXTS,
  SEQUENCES_COMPLETION_CONTEXTS,
  THREADS_COMPLETION_CONTEXTS,
  type CompletionContextName,
  isValidCompletionContext,
} from './completion-contexts.js';

describe('Completion Context Definitions', () => {
  describe('LESSONS_COMPLETION_CONTEXTS', () => {
    it('includes subject and key_stage only', () => {
      expect(LESSONS_COMPLETION_CONTEXTS).toEqual(['subject', 'key_stage']);
    });

    it('does NOT include sequence (lessons use unit-level contexts)', () => {
      const contexts = LESSONS_COMPLETION_CONTEXTS as readonly string[];
      expect(contexts).not.toContain('sequence');
    });

    it('has exactly 2 contexts', () => {
      expect(LESSONS_COMPLETION_CONTEXTS).toHaveLength(2);
    });
  });

  describe('UNITS_COMPLETION_CONTEXTS', () => {
    it('includes subject, key_stage, and sequence', () => {
      expect(UNITS_COMPLETION_CONTEXTS).toEqual(['subject', 'key_stage', 'sequence']);
    });

    it('has exactly 3 contexts', () => {
      expect(UNITS_COMPLETION_CONTEXTS).toHaveLength(3);
    });
  });

  describe('UNIT_ROLLUP_COMPLETION_CONTEXTS', () => {
    it('matches UNITS_COMPLETION_CONTEXTS (same structure)', () => {
      expect(UNIT_ROLLUP_COMPLETION_CONTEXTS).toEqual(['subject', 'key_stage', 'sequence']);
    });

    it('has exactly 3 contexts', () => {
      expect(UNIT_ROLLUP_COMPLETION_CONTEXTS).toHaveLength(3);
    });
  });

  describe('SEQUENCES_COMPLETION_CONTEXTS', () => {
    it('includes subject and phase', () => {
      expect(SEQUENCES_COMPLETION_CONTEXTS).toEqual(['subject', 'phase']);
    });

    it('does NOT include key_stage (sequences use phase)', () => {
      const contexts = SEQUENCES_COMPLETION_CONTEXTS as readonly string[];
      expect(contexts).not.toContain('key_stage');
    });

    it('has exactly 2 contexts', () => {
      expect(SEQUENCES_COMPLETION_CONTEXTS).toHaveLength(2);
    });
  });

  describe('THREADS_COMPLETION_CONTEXTS', () => {
    it('includes subject only', () => {
      expect(THREADS_COMPLETION_CONTEXTS).toEqual(['subject']);
    });

    it('has exactly 1 context', () => {
      expect(THREADS_COMPLETION_CONTEXTS).toHaveLength(1);
    });
  });
});

describe('isValidCompletionContext', () => {
  it('returns true for valid context names', () => {
    expect(isValidCompletionContext('subject')).toBe(true);
    expect(isValidCompletionContext('key_stage')).toBe(true);
    expect(isValidCompletionContext('sequence')).toBe(true);
    expect(isValidCompletionContext('phase')).toBe(true);
  });

  it('returns false for invalid context names', () => {
    expect(isValidCompletionContext('invalid')).toBe(false);
    expect(isValidCompletionContext('')).toBe(false);
    expect(isValidCompletionContext('SUBJECT')).toBe(false);
  });
});

describe('CompletionContextName type', () => {
  it('can be used to type context arrays', () => {
    const contexts: CompletionContextName[] = ['subject', 'key_stage'];
    expect(contexts).toHaveLength(2);
  });
});

