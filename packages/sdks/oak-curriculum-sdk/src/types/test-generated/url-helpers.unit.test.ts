/**
 * Unit tests for generated URL helpers
 *
 * These tests verify the behavior of Oak URL generation functions,
 * ensuring they handle all content types consistently and fail fast for
 * unsupported types.
 */

import { describe, it, expect } from 'vitest';
import {
  generateOakUrlWithContext,
  type ContentType,
  extractSlug,
} from '@oaknational/sdk-codegen/api-schema';

describe('extractSlug', () => {
  it('should extract slug from prefixed ID', () => {
    expect(extractSlug('lesson:addition-123')).toBe('addition-123');
  });

  it('should return ID as-is when no prefix exists', () => {
    expect(extractSlug('addition-123')).toBe('addition-123');
  });
});

describe('generateOakUrlWithContext', () => {
  it('should generate URL for lesson', () => {
    const url = generateOakUrlWithContext('lesson', 'lesson:addition-123');
    expect(url).toBe('https://www.thenational.academy/teachers/lessons/addition-123');
  });

  it('should generate URL for sequence', () => {
    const url = generateOakUrlWithContext('sequence', 'sequence:maths-ks2');
    expect(url).toBe('https://www.thenational.academy/teachers/curriculum/maths-ks2/units');
  });

  it('should generate URL for unit with context', () => {
    const url = generateOakUrlWithContext('unit', 'unit:fractions-1', {
      unit: { sequenceSlug: 'maths-primary' },
    });
    expect(url).toBe(
      'https://www.thenational.academy/teachers/curriculum/maths-primary/units/fractions-1',
    );
  });

  it('should throw for unit without context (fail fast)', () => {
    expect(() => generateOakUrlWithContext('unit', 'unit:fractions-1')).toThrow(TypeError);
    expect(() => generateOakUrlWithContext('unit', 'unit:fractions-1')).toThrow(
      /Missing required context for unit/,
    );
  });

  it('should generate URL for subject with key stage', () => {
    const url = generateOakUrlWithContext('subject', 'subject:maths', {
      subject: { keyStageSlugs: ['ks1', 'ks2'] },
    });
    expect(url).toBe(
      'https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes',
    );
  });

  it('should throw for subject without key stage (fail fast)', () => {
    expect(() => generateOakUrlWithContext('subject', 'subject:maths')).toThrow(TypeError);
    expect(() => generateOakUrlWithContext('subject', 'subject:maths')).toThrow(
      /Missing required context for subject/,
    );
  });

  it('should return null for thread (threads are data concepts without Oak URLs)', () => {
    const url = generateOakUrlWithContext('thread', 'thread:number-multiplication-division');
    expect(url).toBeNull();
  });
});

describe('CONTENT_TYPE_PREFIXES coverage', () => {
  it('generateOakUrlWithContext: all content types work with valid context (or throw for missing)', () => {
    expect(() => {
      generateOakUrlWithContext('lesson', 'lesson:test-123');
    }).not.toThrow();
    expect(() => {
      generateOakUrlWithContext('sequence', 'sequence:test-123');
    }).not.toThrow();
    expect(() => {
      generateOakUrlWithContext('unit', 'unit:test-123', {
        unit: { sequenceSlug: 'maths-primary' },
      });
    }).not.toThrow();
    expect(() => {
      generateOakUrlWithContext('subject', 'subject:test-123', {
        subject: { keyStageSlugs: ['ks1'] },
      });
    }).not.toThrow();
    expect(() => {
      generateOakUrlWithContext('thread', 'thread:test-123');
    }).not.toThrow();

    const allTypes: ContentType[] = ['lesson', 'sequence', 'unit', 'subject', 'thread'];
    allTypes.forEach((type) => {
      expect(() => {
        generateOakUrlWithContext(type, `${type}:test-123`, {
          unit: { sequenceSlug: 'maths-primary' },
          subject: { keyStageSlugs: ['ks1'] },
        });
      }).not.toThrow();
    });
  });

  it('generateOakUrlWithContext: missing context throws for types that require it', () => {
    expect(() => {
      generateOakUrlWithContext('unit', 'unit:test-123');
    }).toThrow(TypeError);
    expect(() => {
      generateOakUrlWithContext('subject', 'subject:test-123');
    }).toThrow(TypeError);
  });
});
