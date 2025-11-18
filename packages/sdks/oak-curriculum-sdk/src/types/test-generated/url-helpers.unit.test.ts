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

  it('should throw TypeError for unsupported content type (thread)', () => {
    expect(() => {
      generateCanonicalUrl('thread' as ContentType, 'thread:123');
    }).toThrow(TypeError);
    expect(() => {
      generateCanonicalUrl('thread' as ContentType, 'thread:123');
    }).toThrow('Unsupported content type: thread');
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

  it('should throw TypeError for unsupported content type (thread)', () => {
    expect(() => {
      generateCanonicalUrlWithContext('thread' as ContentType, 'thread:123');
    }).toThrow(TypeError);
    expect(() => {
      generateCanonicalUrlWithContext('thread' as ContentType, 'thread:123');
    }).toThrow('Unsupported content type: thread');
  });
});

describe('Behavioral consistency between functions', () => {
  const unsupportedTypes: ContentType[] = ['thread'];

  unsupportedTypes.forEach((type) => {
    it(`both functions should throw TypeError for unsupported type: ${type}`, () => {
      // generateCanonicalUrl should throw
      expect(() => {
        generateCanonicalUrl(type, `${type}:123`);
      }).toThrow(TypeError);

      // generateCanonicalUrlWithContext should throw (SAME BEHAVIOR)
      expect(() => {
        generateCanonicalUrlWithContext(type, `${type}:123`);
      }).toThrow(TypeError);
    });
  });

  it('both functions should have identical error messages for unsupported types', () => {
    let error1: Error | undefined;
    let error2: Error | undefined;

    try {
      generateCanonicalUrl('thread' as ContentType, 'thread:123');
    } catch (e) {
      error1 = e as Error;
    }

    try {
      generateCanonicalUrlWithContext('thread' as ContentType, 'thread:123');
    } catch (e) {
      error2 = e as Error;
    }

    expect(error1).toBeDefined();
    expect(error2).toBeDefined();
    expect(error1?.message).toBe(error2?.message);
    expect(error1?.constructor).toBe(TypeError);
    expect(error2?.constructor).toBe(TypeError);
  });
});

describe('CONTENT_TYPE_PREFIXES coverage', () => {
  it('should document which content types are supported vs unsupported', () => {
    const allTypes: ContentType[] = ['lesson', 'sequence', 'unit', 'subject', 'thread'];
    const supportedTypes: ContentType[] = ['lesson', 'sequence', 'unit', 'subject'];
    const unsupportedTypes: ContentType[] = ['thread'];

    // Verify our lists cover all types
    expect([...supportedTypes, ...unsupportedTypes].sort()).toEqual(allTypes.sort());

    // Verify supported types work - they don't throw
    supportedTypes.forEach((type) => {
      expect(() => {
        generateCanonicalUrl(type, `${type}:test-123`, {
          unit: { subjectSlug: 'maths', phaseSlug: 'primary' },
          subject: { keyStageSlugs: ['ks1'] },
        });
      }).not.toThrow();
    });

    // Verify unsupported types throw
    unsupportedTypes.forEach((type) => {
      expect(() => {
        generateCanonicalUrl(type, `${type}:test-123`);
      }).toThrow(TypeError);
    });
  });
});
