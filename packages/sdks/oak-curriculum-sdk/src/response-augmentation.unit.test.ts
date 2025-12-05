/**
 * Unit tests for response augmentation behaviour
 *
 * These tests prove the correct behaviour of response augmentation,
 * focusing on what the function does, not how it does it.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  augmentResponseWithCanonicalUrl,
  augmentArrayResponseWithCanonicalUrl,
} from './response-augmentation.js';

describe('augmentResponseWithCanonicalUrl', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('lesson responses', () => {
    it('should add canonicalUrl field to lesson responses', () => {
      const response = { slug: 'add-two-numbers', title: 'Add Two Numbers' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/add-two-numbers', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/add-two-numbers',
      );
      expect(result).toHaveProperty('slug', 'add-two-numbers');
      expect(result).toHaveProperty('title', 'Add Two Numbers');
    });

    it('should handle lesson responses with id field', () => {
      const response = { id: 'lesson:add-two-numbers', title: 'Add Two Numbers' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/add-two-numbers', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/add-two-numbers',
      );
    });

    it('should extract ID from path when not in response', () => {
      const response = { title: 'Add Two Numbers' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/add-two-numbers', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/add-two-numbers',
      );
    });
  });

  describe('sequence responses', () => {
    it('should add canonicalUrl field to sequence responses', () => {
      const response = { slug: 'maths-ks1', title: 'Maths KS1' };
      const result = augmentResponseWithCanonicalUrl(response, '/sequences/maths-ks1', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/programmes/maths-ks1/units',
      );
    });
  });

  describe('unit responses with context', () => {
    it('should add canonicalUrl field to unit responses with context', () => {
      const response = {
        slug: 'place-value',
        title: 'Place Value',
        subjectSlug: 'maths',
        phaseSlug: 'ks1',
      };
      const result = augmentResponseWithCanonicalUrl(response, '/units/place-value', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/programmes/maths-ks1/units/place-value',
      );
    });

    it('should omit canonicalUrl when unit context is missing', () => {
      const response = { slug: 'place-value', title: 'Place Value' };
      const result = augmentResponseWithCanonicalUrl(response, '/units/place-value', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
    });

    it('should omit canonicalUrl when unit context is partial', () => {
      const response = {
        slug: 'place-value',
        title: 'Place Value',
        subjectSlug: 'maths',
        // missing phaseSlug
      };
      const result = augmentResponseWithCanonicalUrl(response, '/units/place-value', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
    });
  });

  describe('subject responses with context', () => {
    it('should add canonicalUrl field to subject responses with context', () => {
      const response = {
        slug: 'maths',
        title: 'Maths',
        keyStageSlugs: ['ks1', 'ks2'],
      };
      const result = augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes',
      );
    });

    it('should omit canonicalUrl when subject context is missing', () => {
      const response = { slug: 'maths', title: 'Maths' };
      const result = augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
    });

    it('should omit canonicalUrl when subject context is empty', () => {
      const response = {
        slug: 'maths',
        title: 'Maths',
        keyStageSlugs: [],
      };
      const result = augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
    });
  });

  describe('non-GET requests', () => {
    it('should not add canonicalUrl for POST requests', () => {
      const response = { slug: 'add-two-numbers', title: 'Add Two Numbers' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/add-two-numbers', 'post');

      expect(result).not.toHaveProperty('canonicalUrl');
    });

    it('should not add canonicalUrl for PUT requests', () => {
      const response = { slug: 'add-two-numbers', title: 'Add Two Numbers' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/add-two-numbers', 'put');

      expect(result).not.toHaveProperty('canonicalUrl');
    });
  });

  describe('unsupported content types', () => {
    it('should not add canonicalUrl for unsupported paths', () => {
      const response = { slug: 'some-content', title: 'Some Content' };
      const result = augmentResponseWithCanonicalUrl(response, '/unknown/some-content', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
    });
  });

  describe('error handling', () => {
    it('should warn when ID cannot be extracted', () => {
      const response = { title: 'Some Content' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
    });
  });

  describe('search path recognition', () => {
    it('should recognise /search/lessons as lesson content type', () => {
      const response = [{ lessonSlug: 'test-lesson', lessonTitle: 'Test Lesson' }];
      const result = augmentArrayResponseWithCanonicalUrl(response, '/search/lessons', 'get');

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('canonicalUrl');
      expect(result[0].canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/test-lesson',
      );
    });

    it('should recognise /search/transcripts as lesson content type', () => {
      const response = [{ lessonSlug: 'transcript-lesson', lessonTitle: 'Transcript Lesson' }];
      const result = augmentArrayResponseWithCanonicalUrl(response, '/search/transcripts', 'get');

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('canonicalUrl');
      expect(result[0].canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/transcript-lesson',
      );
    });

    it('should recognise /key-stages/{ks}/subjects/{subj}/lessons as lesson content type', () => {
      const response = [{ lessonSlug: 'ks-lesson', lessonTitle: 'KS Lesson' }];
      const result = augmentArrayResponseWithCanonicalUrl(
        response,
        '/key-stages/ks3/subjects/maths/lessons',
        'get',
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('canonicalUrl');
      expect(result[0].canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/ks-lesson',
      );
    });

    it('should recognise /key-stages/{ks}/subjects/{subj}/units as unit content type', () => {
      const response = [
        { unitSlug: 'ks-unit', unitTitle: 'KS Unit', subjectSlug: 'maths', phaseSlug: 'primary' },
      ];
      const result = augmentArrayResponseWithCanonicalUrl(
        response,
        '/key-stages/ks2/subjects/maths/units',
        'get',
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('canonicalUrl');
      expect(result[0].canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/programmes/maths-primary/units/ks-unit',
      );
    });
  });

  describe('array response augmentation', () => {
    it('should augment each item in an array response with canonicalUrl', () => {
      const response = [
        { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1' },
        { lessonSlug: 'lesson-2', lessonTitle: 'Lesson 2' },
        { lessonSlug: 'lesson-3', lessonTitle: 'Lesson 3' },
      ];
      const result = augmentArrayResponseWithCanonicalUrl(response, '/search/lessons', 'get');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty(
        'canonicalUrl',
        'https://www.thenational.academy/teachers/lessons/lesson-1',
      );
      expect(result[1]).toHaveProperty(
        'canonicalUrl',
        'https://www.thenational.academy/teachers/lessons/lesson-2',
      );
      expect(result[2]).toHaveProperty(
        'canonicalUrl',
        'https://www.thenational.academy/teachers/lessons/lesson-3',
      );
    });

    it('should preserve all original fields when augmenting array items', () => {
      const response = [
        {
          lessonSlug: 'test-lesson',
          lessonTitle: 'Test Lesson',
          similarity: 0.95,
          units: [{ unitSlug: 'unit-1', keyStageSlug: 'ks3' }],
        },
      ];
      const result = augmentArrayResponseWithCanonicalUrl(response, '/search/lessons', 'get');

      expect(result[0]).toHaveProperty('lessonSlug', 'test-lesson');
      expect(result[0]).toHaveProperty('lessonTitle', 'Test Lesson');
      expect(result[0]).toHaveProperty('similarity', 0.95);
      expect(result[0]).toHaveProperty('units');
      expect(result[0]).toHaveProperty('canonicalUrl');
    });

    it('should handle empty array responses', () => {
      const response: object[] = [];
      const result = augmentArrayResponseWithCanonicalUrl(response, '/search/lessons', 'get');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should skip items without extractable slug in arrays', () => {
      const response = [
        { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1' },
        { lessonTitle: 'No Slug Lesson' }, // Missing lessonSlug
        { lessonSlug: 'lesson-3', lessonTitle: 'Lesson 3' },
      ];
      const result = augmentArrayResponseWithCanonicalUrl(response, '/search/lessons', 'get');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('canonicalUrl');
      expect(result[1]).not.toHaveProperty('canonicalUrl');
      expect(result[2]).toHaveProperty('canonicalUrl');
    });
  });

  describe('entity-specific slug extraction', () => {
    it('should extract lessonSlug from lesson responses', () => {
      const response = { lessonSlug: 'my-lesson', lessonTitle: 'My Lesson' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/my-lesson/summary', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/my-lesson',
      );
    });

    it('should extract unitSlug from unit responses', () => {
      const response = {
        unitSlug: 'my-unit',
        unitTitle: 'My Unit',
        subjectSlug: 'english',
        phaseSlug: 'secondary',
      };
      const result = augmentResponseWithCanonicalUrl(response, '/units/my-unit/summary', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/programmes/english-secondary/units/my-unit',
      );
    });

    it('should extract subjectSlug from subject responses', () => {
      const response = {
        subjectSlug: 'science',
        subjectTitle: 'Science',
        keyStageSlugs: ['ks3', 'ks4'],
      };
      const result = augmentResponseWithCanonicalUrl(response, '/subjects/science', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/key-stages/ks3/subjects/science/programmes',
      );
    });

    it('should extract sequenceSlug from sequence responses', () => {
      const response = { sequenceSlug: 'maths-primary', title: 'Maths Primary' };
      const result = augmentResponseWithCanonicalUrl(
        response,
        '/sequences/maths-primary/units',
        'get',
      );

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/programmes/maths-primary/units',
      );
    });

    it('should prefer slug over entity-specific slug when both present', () => {
      const response = { slug: 'generic-slug', lessonSlug: 'lesson-slug', lessonTitle: 'Lesson' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/generic-slug', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/generic-slug',
      );
    });
  });

  describe('idempotency', () => {
    it('should preserve existing canonicalUrl on single object', () => {
      const existingUrl = 'https://custom.example.com/preserved-url';
      const response = { slug: 'test-lesson', title: 'Test', canonicalUrl: existingUrl };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/test-lesson', 'get');

      expect(result.canonicalUrl).toBe(existingUrl);
    });

    it('should preserve existing canonicalUrl on array items', () => {
      const existingUrl = 'https://custom.example.com/preserved-url';
      const response = [
        { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1' },
        { lessonSlug: 'lesson-2', lessonTitle: 'Lesson 2', canonicalUrl: existingUrl },
        { lessonSlug: 'lesson-3', lessonTitle: 'Lesson 3' },
      ];
      const result = augmentArrayResponseWithCanonicalUrl(response, '/search/lessons', 'get');

      expect(result[0]?.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/lesson-1',
      );
      expect(result[1]?.canonicalUrl).toBe(existingUrl);
      expect(result[2]?.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/lesson-3',
      );
    });
  });
});
