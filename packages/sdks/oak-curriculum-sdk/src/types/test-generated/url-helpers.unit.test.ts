/**
 * Unit tests for generated URL helpers
 *
 * These tests verify the behavior of Oak URL generation functions,
 * ensuring they handle all content types consistently and fail fast for
 * unsupported types.
 */

import { describe, it, expect } from 'vitest';
import {
  generateOakUrl,
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

describe('generateOakUrl', () => {
  it('should generate URL for lesson', () => {
    const url = generateOakUrl('lesson', 'lesson:addition-123');
    expect(url).toBe('https://www.thenational.academy/teachers/lessons/addition-123');
  });

  it('should generate URL for sequence', () => {
    const url = generateOakUrl('sequence', 'sequence:maths-ks2');
    expect(url).toBe('https://www.thenational.academy/teachers/curriculum/maths-ks2/units');
  });

  it('should generate URL for unit with context', () => {
    const url = generateOakUrl('unit', 'unit:fractions-1', {
      unit: { sequenceSlug: 'maths-primary' },
    });
    expect(url).toBe(
      'https://www.thenational.academy/teachers/curriculum/maths-primary/units/fractions-1',
    );
  });

  it('should return undefined for unit without context', () => {
    const url = generateOakUrl('unit', 'unit:fractions-1');
    expect(url).toBeUndefined();
  });

  it('should generate URL for subject with key stage', () => {
    const url = generateOakUrl('subject', 'subject:maths', {
      subject: { keyStageSlugs: ['ks1', 'ks2'] },
    });
    expect(url).toBe(
      'https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes',
    );
  });

  it('should return undefined for subject without key stage', () => {
    const url = generateOakUrl('subject', 'subject:maths');
    expect(url).toBeUndefined();
  });

  it('should return undefined for thread (threads are data concepts without Oak URLs)', () => {
    const url = generateOakUrl('thread', 'thread:number-multiplication-division');
    expect(url).toBeUndefined();
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

describe('Behavioral consistency between functions', () => {
  it('both functions indicate threads have no URLs (undefined vs null)', () => {
    // generateOakUrl returns undefined (can't generate = undefined)
    const url1 = generateOakUrl('thread', 'thread:algebra');
    // generateOakUrlWithContext returns null (explicitly no URL for this type)
    const url2 = generateOakUrlWithContext('thread', 'thread:algebra');

    expect(url1).toBeUndefined();
    expect(url2).toBeNull();
  });
});

describe('CONTENT_TYPE_PREFIXES coverage', () => {
  it('generateOakUrl: all content types return valid URL or undefined (no throws for known types)', () => {
    const allTypes: ContentType[] = ['lesson', 'sequence', 'unit', 'subject', 'thread'];

    // All known content types should not throw - they either return a URL or undefined
    allTypes.forEach((type) => {
      expect(() => {
        generateOakUrl(type, `${type}:test-123`, {
          unit: { sequenceSlug: 'maths-primary' },
          subject: { keyStageSlugs: ['ks1'] },
        });
      }).not.toThrow();
    });
  });

  it('generateOakUrl: types with required context return undefined when context is missing', () => {
    // These types need context to generate a URL
    expect(generateOakUrl('unit', 'unit:test-123')).toBeUndefined();
    expect(generateOakUrl('subject', 'subject:test-123')).toBeUndefined();
    // Threads never have URLs regardless of context
    expect(generateOakUrl('thread', 'thread:test-123')).toBeUndefined();
  });

  it('generateOakUrlWithContext: all content types work with valid context (or throw for missing)', () => {
    // With full context, all types work
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

    // Missing context throws for types that require it
    expect(() => {
      generateOakUrlWithContext('unit', 'unit:test-123');
    }).toThrow(TypeError);
    expect(() => {
      generateOakUrlWithContext('subject', 'subject:test-123');
    }).toThrow(TypeError);
  });
});
