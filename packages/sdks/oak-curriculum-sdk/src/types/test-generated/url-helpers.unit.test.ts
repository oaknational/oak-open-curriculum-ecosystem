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
} from '../generated/api-schema/routing/url-helpers';

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
    expect(url).toBe('https://www.thenational.academy/teachers/programmes/maths-ks2/units');
  });

  it('should generate URL for unit with context', () => {
    const url = generateCanonicalUrl('unit', 'unit:fractions-1', {
      unit: { subjectSlug: 'maths', phaseSlug: 'primary' },
    });
    expect(url).toBe(
      'https://www.thenational.academy/teachers/programmes/maths-primary/units/fractions-1',
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
    expect(url).toBe('https://www.thenational.academy/teachers/programmes/maths-ks2/units');
  });

  it('should generate URL for unit with context', () => {
    const url = generateCanonicalUrlWithContext('unit', 'unit:fractions-1', {
      unit: { subjectSlug: 'maths', phaseSlug: 'primary' },
    });
    expect(url).toBe(
      'https://www.thenational.academy/teachers/programmes/maths-primary/units/fractions-1',
    );
  });

  it('should return undefined for unit without context', () => {
    const url = generateCanonicalUrlWithContext('unit', 'unit:fractions-1');
    expect(url).toBeUndefined();
  });

  it('should generate URL for subject with key stage', () => {
    const url = generateCanonicalUrlWithContext('subject', 'subject:maths', {
      subject: { keyStageSlugs: ['ks1', 'ks2'] },
    });
    expect(url).toBe(
      'https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes',
    );
  });

  it('should return undefined for subject without key stage', () => {
    const url = generateCanonicalUrlWithContext('subject', 'subject:maths');
    expect(url).toBeUndefined();
  });

  it('should return undefined for thread (threads are data concepts without canonical URLs)', () => {
    const url = generateCanonicalUrlWithContext('thread', 'thread:number-multiplication-division');
    expect(url).toBeUndefined();
  });
});

describe('Behavioral consistency between functions', () => {
  it('both functions should return undefined for threads (data concepts without URLs)', () => {
    const url1 = generateCanonicalUrl('thread', 'thread:algebra');
    const url2 = generateCanonicalUrlWithContext('thread', 'thread:algebra');

    expect(url1).toBeUndefined();
    expect(url2).toBeUndefined();
  });
});

describe('CONTENT_TYPE_PREFIXES coverage', () => {
  it('all content types return valid URL or undefined (no throws for known types)', () => {
    const allTypes: ContentType[] = ['lesson', 'sequence', 'unit', 'subject', 'thread'];

    // All known content types should not throw - they either return a URL or undefined
    allTypes.forEach((type) => {
      expect(() => {
        generateCanonicalUrl(type, `${type}:test-123`, {
          unit: { subjectSlug: 'maths', phaseSlug: 'primary' },
          subject: { keyStageSlugs: ['ks1'] },
        });
      }).not.toThrow();
    });
  });

  it('types with required context return undefined when context is missing', () => {
    // These types need context to generate a URL
    expect(generateCanonicalUrl('unit', 'unit:test-123')).toBeUndefined();
    expect(generateCanonicalUrl('subject', 'subject:test-123')).toBeUndefined();
    // Threads never have URLs regardless of context
    expect(generateCanonicalUrl('thread', 'thread:test-123')).toBeUndefined();
  });
});
