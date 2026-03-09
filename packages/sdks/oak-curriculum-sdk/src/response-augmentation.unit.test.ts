/**
 * Unit tests for response augmentation behaviour
 *
 * These tests prove the correct behaviour of response augmentation,
 * focusing on what the function does, not how it does it.
 */

import { describe, it, expect } from 'vitest';
import {
  augmentResponseWithCanonicalUrl,
  augmentArrayResponseWithCanonicalUrl,
} from './response-augmentation.js';

describe('augmentResponseWithCanonicalUrl', () => {
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

    it('should use the lesson segment for lesson sub-resource paths', () => {
      const response = { lessonTitle: 'Add Two Numbers' };
      const result = augmentResponseWithCanonicalUrl(
        response,
        '/lessons/add-two-numbers/summary',
        'get',
      );

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/add-two-numbers',
      );
    });

    it('should use the lesson segment for lesson transcript paths', () => {
      const response = {
        transcript: 'This is the lesson transcript text',
        vtt: 'WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nThis is the lesson transcript text',
      };
      const result = augmentResponseWithCanonicalUrl(
        response,
        '/lessons/add-two-numbers/transcript',
        'get',
      );

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/add-two-numbers',
      );
    });

    it('should use the lesson segment for lesson quiz paths', () => {
      const response = { starterQuiz: [], exitQuiz: [] };
      const result = augmentResponseWithCanonicalUrl(
        response,
        '/lessons/add-two-numbers/quiz',
        'get',
      );

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/add-two-numbers',
      );
    });

    it('should use the lesson segment for lesson asset paths', () => {
      const response = { assets: [] };
      const result = augmentResponseWithCanonicalUrl(
        response,
        '/lessons/add-two-numbers/assets',
        'get',
      );

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/add-two-numbers',
      );
    });

    it('should throw for OpenAPI template lesson sub-resource paths', () => {
      const response = { lessonTitle: 'Add Two Numbers' };

      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/lessons/{lesson}/summary', 'get');
      }).toThrow(TypeError);
      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/lessons/{lesson}/summary', 'get');
      }).toThrow(/Could not extract ID/);
    });

    it('should ignore invalid unit context fields when augmenting lessons', () => {
      const response = {
        lessonSlug: 'add-two-numbers',
        lessonTitle: 'Add Two Numbers',
        subjectSlug: 'maths',
        phaseSlug: 'upper-primary',
      };

      const result = augmentResponseWithCanonicalUrl(response, '/lessons/add-two-numbers', 'get');

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
        'https://www.thenational.academy/teachers/curriculum/maths-ks1/units',
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
        'https://www.thenational.academy/teachers/curriculum/maths-primary/units/place-value',
      );
    });

    it('should throw when unit context is missing (fail fast)', () => {
      const response = { slug: 'place-value', title: 'Place Value' };

      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/units/place-value', 'get');
      }).toThrow(TypeError);
      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/units/place-value', 'get');
      }).toThrow(/Missing required context for unit/);
    });

    it('should throw when unit context is partial (fail fast)', () => {
      const response = {
        slug: 'place-value',
        title: 'Place Value',
        subjectSlug: 'maths',
        // missing phaseSlug
      };

      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/units/place-value', 'get');
      }).toThrow(TypeError);
      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/units/place-value', 'get');
      }).toThrow(/Missing required context for unit/);
    });

    it('should throw when unit phaseSlug is unsupported', () => {
      const response = {
        slug: 'place-value',
        title: 'Place Value',
        subjectSlug: 'maths',
        phaseSlug: 'upper-primary',
      };

      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/units/place-value', 'get');
      }).toThrow(/Unsupported phase slug/);
    });
  });

  describe('subject responses with context', () => {
    it('should add canonicalUrl field to subject responses with context', () => {
      const response = {
        slug: 'maths',
        title: 'Maths',
        keyStages: [
          { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
          { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
        ],
      };
      const result = augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes',
      );
    });

    it('should throw when subject context is missing (fail fast)', () => {
      const response = { slug: 'maths', title: 'Maths' };

      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');
      }).toThrow(TypeError);
      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');
      }).toThrow(/Missing required context for subject/);
    });

    it('should throw when subject context is empty (fail fast)', () => {
      const response = {
        slug: 'maths',
        title: 'Maths',
        keyStages: [],
      };

      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');
      }).toThrow(TypeError);
      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');
      }).toThrow(/Missing required context for subject/);
    });
  });

  describe('subject responses with keyStages objects (actual API shape)', () => {
    it('extracts canonicalUrl from real API response shape', () => {
      const response = {
        subjectSlug: 'maths',
        subjectTitle: 'Maths',
        keyStages: [
          { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
          { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
        ],
        sequenceSlugs: [],
        years: [1, 2, 3, 4, 5, 6],
      };
      const result = augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');

      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes',
      );
    });

    it('handles keyStages with non-string slugs gracefully', () => {
      const response = {
        subjectSlug: 'maths',
        subjectTitle: 'Maths',
        keyStages: [{ keyStageSlug: 123 }],
        sequenceSlugs: [],
        years: [],
      };

      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');
      }).toThrow(/Missing required context for subject/);
    });

    it('handles empty keyStages array', () => {
      const response = {
        subjectSlug: 'maths',
        subjectTitle: 'Maths',
        keyStages: [],
        sequenceSlugs: [],
        years: [],
      };

      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');
      }).toThrow(/Missing required context for subject/);
    });
  });

  describe('sub-resource paths under /subjects/ (Snags 3/4)', () => {
    it('does not augment /subjects/{s}/key-stages response', () => {
      const response = { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' };
      const result = augmentResponseWithCanonicalUrl(response, '/subjects/maths/key-stages', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
    });

    it('does not augment /subjects/{s}/years response', () => {
      const response = { years: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] };
      const result = augmentResponseWithCanonicalUrl(response, '/subjects/maths/years', 'get');

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
    it('should throw when ID cannot be extracted (fail fast)', () => {
      const response = { title: 'Some Content' };

      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/lessons/', 'get');
      }).toThrow(TypeError);
      expect(() => {
        augmentResponseWithCanonicalUrl(response, '/lessons/', 'get');
      }).toThrow(/Could not extract ID/);
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
        'https://www.thenational.academy/teachers/curriculum/maths-primary/units/ks-unit',
      );
    });

    it('should recognise /subjects/{subject}/sequences as sequence content type', () => {
      const response = [{ slug: 'maths-ks4', title: 'Maths KS4 Programme' }];
      const result = augmentArrayResponseWithCanonicalUrl(
        response,
        '/subjects/maths/sequences',
        'get',
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('canonicalUrl');
      expect(result[0].canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/curriculum/maths-ks4/units',
      );
    });

    it('should throw for /subjects/{subject}/sequences items without sequence slug', () => {
      const response = [{ title: 'Sequence without slug' }];

      expect(() => {
        augmentArrayResponseWithCanonicalUrl(response, '/subjects/maths/sequences', 'get');
      }).toThrow(/Could not extract ID/);
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

    it('should throw when array item lacks extractable slug (fail fast)', () => {
      const response = [
        { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1' },
        { lessonTitle: 'No Slug Lesson' }, // Missing lessonSlug - invalid data
        { lessonSlug: 'lesson-3', lessonTitle: 'Lesson 3' },
      ];

      expect(() => {
        augmentArrayResponseWithCanonicalUrl(response, '/search/lessons', 'get');
      }).toThrow(TypeError);
      expect(() => {
        augmentArrayResponseWithCanonicalUrl(response, '/search/lessons', 'get');
      }).toThrow(/Could not extract ID/);
    });

    it('should augment all items when all have valid slugs', () => {
      const response = [
        { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1' },
        { lessonSlug: 'lesson-2', lessonTitle: 'Lesson 2' },
        { lessonSlug: 'lesson-3', lessonTitle: 'Lesson 3' },
      ];
      const result = augmentArrayResponseWithCanonicalUrl(response, '/search/lessons', 'get');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('canonicalUrl');
      expect(result[1]).toHaveProperty('canonicalUrl');
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
        'https://www.thenational.academy/teachers/curriculum/english-secondary/units/my-unit',
      );
    });

    it('should extract subjectSlug from subject responses', () => {
      const response = {
        subjectSlug: 'science',
        subjectTitle: 'Science',
        keyStages: [
          { keyStageSlug: 'ks3', keyStageTitle: 'Key Stage 3' },
          { keyStageSlug: 'ks4', keyStageTitle: 'Key Stage 4' },
        ],
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
        'https://www.thenational.academy/teachers/curriculum/maths-primary/units',
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
