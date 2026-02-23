/**
 * Unit tests for response augmentation helper functions.
 *
 * These are pure functions with no IO — direct unit tests.
 */

import { describe, it, expect } from 'vitest';
import {
  isSingleEntityEndpoint,
  isSearchEndpoint,
  isKeyStageScopedEndpoint,
  getContentTypeFromPath,
  extractGenericId,
  extractSubjectSlug,
  extractLessonSlug,
  extractUnitSlug,
  extractSequenceSlug,
  extractThreadSlug,
  extractContentTypeSpecificId,
} from './response-augmentation-helpers.js';

describe('isSingleEntityEndpoint', () => {
  describe('subject paths', () => {
    it('returns subject for /subjects/{s}', () => {
      expect(isSingleEntityEndpoint('/subjects/maths')).toBe('subject');
    });

    it('returns undefined for /subjects/{s}/key-stages (Snag 3)', () => {
      expect(isSingleEntityEndpoint('/subjects/maths/key-stages')).toBeUndefined();
    });

    it('returns undefined for /subjects/{s}/years (Snag 4)', () => {
      expect(isSingleEntityEndpoint('/subjects/maths/years')).toBeUndefined();
    });
  });

  describe('sequence paths', () => {
    it('returns sequence for /sequences/{s}', () => {
      expect(isSingleEntityEndpoint('/sequences/maths-ks1')).toBe('sequence');
    });

    it('returns sequence for /subjects/{s}/sequences', () => {
      expect(isSingleEntityEndpoint('/subjects/maths/sequences')).toBe('sequence');
    });
  });

  describe('lesson paths', () => {
    it('returns lesson for /lessons/{l}', () => {
      expect(isSingleEntityEndpoint('/lessons/add-fractions')).toBe('lesson');
    });

    it('returns lesson for /lessons/{l}/summary', () => {
      expect(isSingleEntityEndpoint('/lessons/add-fractions/summary')).toBe('lesson');
    });

    it('returns lesson for /lessons/{l}/transcript', () => {
      expect(isSingleEntityEndpoint('/lessons/add-fractions/transcript')).toBe('lesson');
    });
  });

  describe('unit paths', () => {
    it('returns unit for /units/{u}', () => {
      expect(isSingleEntityEndpoint('/units/fractions')).toBe('unit');
    });

    it('returns unit for /units/{u}/summary', () => {
      expect(isSingleEntityEndpoint('/units/fractions/summary')).toBe('unit');
    });
  });

  describe('thread paths', () => {
    it('returns thread for /threads/{t}', () => {
      expect(isSingleEntityEndpoint('/threads/algebra')).toBe('thread');
    });
  });

  describe('unrecognised paths', () => {
    it('returns undefined for /unknown/path', () => {
      expect(isSingleEntityEndpoint('/unknown/path')).toBeUndefined();
    });
  });
});

describe('isSearchEndpoint', () => {
  it('returns lesson for /search/lessons', () => {
    expect(isSearchEndpoint('/search/lessons')).toBe('lesson');
  });

  it('returns lesson for /search/transcripts', () => {
    expect(isSearchEndpoint('/search/transcripts')).toBe('lesson');
  });

  it('returns undefined for /search/units', () => {
    expect(isSearchEndpoint('/search/units')).toBeUndefined();
  });

  it('returns undefined for non-search paths', () => {
    expect(isSearchEndpoint('/lessons/test')).toBeUndefined();
  });
});

describe('isKeyStageScopedEndpoint', () => {
  it('returns lesson for /key-stages/{ks}/subjects/{s}/lessons', () => {
    expect(isKeyStageScopedEndpoint('/key-stages/ks3/subjects/science/lessons')).toBe('lesson');
  });

  it('returns unit for /key-stages/{ks}/subjects/{s}/units', () => {
    expect(isKeyStageScopedEndpoint('/key-stages/ks2/subjects/maths/units')).toBe('unit');
  });

  it('returns undefined for paths without key-stages', () => {
    expect(isKeyStageScopedEndpoint('/subjects/maths/lessons')).toBeUndefined();
  });

  it('returns undefined for paths without subjects', () => {
    expect(isKeyStageScopedEndpoint('/key-stages/ks3/lessons')).toBeUndefined();
  });
});

describe('getContentTypeFromPath', () => {
  it('returns subject for /subjects/{s}', () => {
    expect(getContentTypeFromPath('/subjects/maths')).toBe('subject');
  });

  it('returns undefined for /subjects/{s}/key-stages (Snag 3)', () => {
    expect(getContentTypeFromPath('/subjects/maths/key-stages')).toBeUndefined();
  });

  it('returns undefined for /subjects/{s}/years (Snag 4)', () => {
    expect(getContentTypeFromPath('/subjects/maths/years')).toBeUndefined();
  });

  it('returns lesson for /search/lessons', () => {
    expect(getContentTypeFromPath('/search/lessons')).toBe('lesson');
  });

  it('returns lesson for key-stage scoped lessons', () => {
    expect(getContentTypeFromPath('/key-stages/ks3/subjects/science/lessons')).toBe('lesson');
  });

  it('returns unit for key-stage scoped units', () => {
    expect(getContentTypeFromPath('/key-stages/ks2/subjects/maths/units')).toBe('unit');
  });

  it('returns sequence for /subjects/{s}/sequences', () => {
    expect(getContentTypeFromPath('/subjects/maths/sequences')).toBe('sequence');
  });
});

describe('extractGenericId', () => {
  it('extracts slug from object', () => {
    expect(extractGenericId({ slug: 'test' })).toBe('test');
  });

  it('extracts id from object', () => {
    expect(extractGenericId({ id: 'test-id' })).toBe('test-id');
  });

  it('prefers slug over id', () => {
    expect(extractGenericId({ slug: 'slug-val', id: 'id-val' })).toBe('slug-val');
  });

  it('returns undefined for non-object', () => {
    expect(extractGenericId(42)).toBeUndefined();
  });

  it('returns undefined for null', () => {
    expect(extractGenericId(null)).toBeUndefined();
  });
});

describe('extractSubjectSlug', () => {
  it('extracts subjectSlug from object', () => {
    expect(extractSubjectSlug({ subjectSlug: 'maths' })).toBe('maths');
  });

  it('returns undefined for non-object', () => {
    expect(extractSubjectSlug(42)).toBeUndefined();
  });

  it('returns undefined for null', () => {
    expect(extractSubjectSlug(null)).toBeUndefined();
  });
});

describe('extractLessonSlug', () => {
  it('extracts lessonSlug from object', () => {
    expect(extractLessonSlug({ lessonSlug: 'add-fractions' })).toBe('add-fractions');
  });

  it('returns undefined for non-object', () => {
    expect(extractLessonSlug(42)).toBeUndefined();
  });
});

describe('extractUnitSlug', () => {
  it('extracts unitSlug from object', () => {
    expect(extractUnitSlug({ unitSlug: 'fractions' })).toBe('fractions');
  });

  it('returns undefined for non-object', () => {
    expect(extractUnitSlug(42)).toBeUndefined();
  });
});

describe('extractSequenceSlug', () => {
  it('extracts sequenceSlug from object', () => {
    expect(extractSequenceSlug({ sequenceSlug: 'maths-ks1' })).toBe('maths-ks1');
  });

  it('returns undefined for non-object', () => {
    expect(extractSequenceSlug(42)).toBeUndefined();
  });
});

describe('extractThreadSlug', () => {
  it('extracts threadSlug from object', () => {
    expect(extractThreadSlug({ threadSlug: 'algebra' })).toBe('algebra');
  });

  it('returns undefined for non-object', () => {
    expect(extractThreadSlug(42)).toBeUndefined();
  });
});

describe('extractContentTypeSpecificId', () => {
  it('extracts lessonSlug for lesson type', () => {
    expect(extractContentTypeSpecificId({ lessonSlug: 'test' }, 'lesson')).toBe('test');
  });

  it('extracts unitSlug for unit type', () => {
    expect(extractContentTypeSpecificId({ unitSlug: 'test' }, 'unit')).toBe('test');
  });

  it('extracts subjectSlug for subject type', () => {
    expect(extractContentTypeSpecificId({ subjectSlug: 'test' }, 'subject')).toBe('test');
  });

  it('extracts sequenceSlug for sequence type', () => {
    expect(extractContentTypeSpecificId({ sequenceSlug: 'test' }, 'sequence')).toBe('test');
  });

  it('extracts threadSlug for thread type', () => {
    expect(extractContentTypeSpecificId({ threadSlug: 'test' }, 'thread')).toBe('test');
  });

  it('returns undefined for undefined content type', () => {
    expect(extractContentTypeSpecificId({ slug: 'test' }, undefined)).toBeUndefined();
  });
});
