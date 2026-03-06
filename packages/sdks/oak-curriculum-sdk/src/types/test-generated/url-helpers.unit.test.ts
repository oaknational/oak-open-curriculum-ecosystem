/**
 * Unit tests for generated URL helpers
 *
 * These tests verify the behavior of canonical URL generation functions,
 * ensuring they handle all content types consistently and fail fast for
 * unsupported types.
 */

import { describe, it, expect } from 'vitest';
import {
  generateCanonicalUrl,
  generateCanonicalUrlWithContext,
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

describe('generateCanonicalUrl', () => {
  it('should generate URL for lesson', () => {
    const url = generateCanonicalUrl('lesson', 'lesson:addition-123');
    expect(url).toBe('https://www.thenational.academy/teachers/lessons/addition-123');
  });

  it('should generate URL for sequence', () => {
    const url = generateCanonicalUrl('sequence', 'sequence:maths-ks2');
    expect(url).toBe('https://www.thenational.academy/teachers/curriculum/maths-ks2/units');
  });

  it('should generate URL for unit with context', () => {
    const url = generateCanonicalUrl('unit', 'unit:fractions-1', {
      unit: { sequenceSlug: 'maths-primary' },
    });
    expect(url).toBe(
      'https://www.thenational.academy/teachers/curriculum/maths-primary/units/fractions-1',
    );
  });

  it('should return undefined for unit without context', () => {
    const url = generateCanonicalUrl('unit', 'unit:fractions-1');
    expect(url).toBeUndefined();
  });

  it('should generate URL for subject with key stage', () => {
    const url = generateCanonicalUrl('subject', 'subject:maths', {
      subject: { keyStageSlugs: ['ks1', 'ks2'] },
    });
    expect(url).toBe(
      'https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes',
    );
  });

  it('should return undefined for subject without key stage', () => {
    const url = generateCanonicalUrl('subject', 'subject:maths');
    expect(url).toBeUndefined();
  });

  it('should return undefined for thread (threads are data concepts without canonical URLs)', () => {
    const url = generateCanonicalUrl('thread', 'thread:number-multiplication-division');
    expect(url).toBeUndefined();
  });
});

describe('generateCanonicalUrlWithContext', () => {
  it('should generate URL for lesson', () => {
    const url = generateCanonicalUrlWithContext('lesson', 'lesson:addition-123');
    expect(url).toBe('https://www.thenational.academy/teachers/lessons/addition-123');
  });

  it('should generate URL for sequence', () => {
    const url = generateCanonicalUrlWithContext('sequence', 'sequence:maths-ks2');
    expect(url).toBe('https://www.thenational.academy/teachers/curriculum/maths-ks2/units');
  });

  it('should generate URL for unit with context', () => {
    const url = generateCanonicalUrlWithContext('unit', 'unit:fractions-1', {
      unit: { sequenceSlug: 'maths-primary' },
    });
    expect(url).toBe(
      'https://www.thenational.academy/teachers/curriculum/maths-primary/units/fractions-1',
    );
  });

  it('should throw for unit without context (fail fast)', () => {
    expect(() => generateCanonicalUrlWithContext('unit', 'unit:fractions-1')).toThrow(TypeError);
    expect(() => generateCanonicalUrlWithContext('unit', 'unit:fractions-1')).toThrow(
      /Missing required context for unit/,
    );
  });

  it('should generate URL for subject with key stage', () => {
    const url = generateCanonicalUrlWithContext('subject', 'subject:maths', {
      subject: { keyStageSlugs: ['ks1', 'ks2'] },
    });
    expect(url).toBe(
      'https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes',
    );
  });

  it('should throw for subject without key stage (fail fast)', () => {
    expect(() => generateCanonicalUrlWithContext('subject', 'subject:maths')).toThrow(TypeError);
    expect(() => generateCanonicalUrlWithContext('subject', 'subject:maths')).toThrow(
      /Missing required context for subject/,
    );
  });

  it('should return null for thread (threads are data concepts without canonical URLs)', () => {
    const url = generateCanonicalUrlWithContext('thread', 'thread:number-multiplication-division');
    expect(url).toBeNull();
  });
});

describe('Behavioral consistency between functions', () => {
  it('both functions indicate threads have no URLs (undefined vs null)', () => {
    // generateCanonicalUrl returns undefined (can't generate = undefined)
    const url1 = generateCanonicalUrl('thread', 'thread:algebra');
    // generateCanonicalUrlWithContext returns null (explicitly no URL for this type)
    const url2 = generateCanonicalUrlWithContext('thread', 'thread:algebra');

    expect(url1).toBeUndefined();
    expect(url2).toBeNull();
  });
});

describe('CONTENT_TYPE_PREFIXES coverage', () => {
  it('generateCanonicalUrl: all content types return valid URL or undefined (no throws for known types)', () => {
    const allTypes: ContentType[] = ['lesson', 'sequence', 'unit', 'subject', 'thread'];

    // All known content types should not throw - they either return a URL or undefined
    allTypes.forEach((type) => {
      expect(() => {
        generateCanonicalUrl(type, `${type}:test-123`, {
          unit: { sequenceSlug: 'maths-primary' },
          subject: { keyStageSlugs: ['ks1'] },
        });
      }).not.toThrow();
    });
  });

  it('generateCanonicalUrl: types with required context return undefined when context is missing', () => {
    // These types need context to generate a URL
    expect(generateCanonicalUrl('unit', 'unit:test-123')).toBeUndefined();
    expect(generateCanonicalUrl('subject', 'subject:test-123')).toBeUndefined();
    // Threads never have URLs regardless of context
    expect(generateCanonicalUrl('thread', 'thread:test-123')).toBeUndefined();
  });

  it('generateCanonicalUrlWithContext: all content types work with valid context (or throw for missing)', () => {
    // With full context, all types work
    expect(() => {
      generateCanonicalUrlWithContext('lesson', 'lesson:test-123');
    }).not.toThrow();
    expect(() => {
      generateCanonicalUrlWithContext('sequence', 'sequence:test-123');
    }).not.toThrow();
    expect(() => {
      generateCanonicalUrlWithContext('unit', 'unit:test-123', {
        unit: { sequenceSlug: 'maths-primary' },
      });
    }).not.toThrow();
    expect(() => {
      generateCanonicalUrlWithContext('subject', 'subject:test-123', {
        subject: { keyStageSlugs: ['ks1'] },
      });
    }).not.toThrow();
    expect(() => {
      generateCanonicalUrlWithContext('thread', 'thread:test-123');
    }).not.toThrow();

    // Missing context throws for types that require it
    expect(() => {
      generateCanonicalUrlWithContext('unit', 'unit:test-123');
    }).toThrow(TypeError);
    expect(() => {
      generateCanonicalUrlWithContext('subject', 'subject:test-123');
    }).toThrow(TypeError);
  });
});
