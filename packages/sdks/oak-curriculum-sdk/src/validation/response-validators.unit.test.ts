/**
 * Unit tests for response validation functions
 * Following TDD approach - tests written before implementation
 */

import { describe, it, expect } from 'vitest';
import { validateCurriculumResponse } from './curriculum-response-validators.js';

describe('validateCurriculumResponse', () => {
  describe('for GET /lessons/{lesson}/transcript response', () => {
    const path = '/lessons/{lesson}/transcript';
    const method = 'get';
    const statusCode = 200;

    it('should validate valid transcript response without augmenting it', () => {
      const response = {
        transcript: 'This is the lesson transcript text',
        vtt: 'WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nThis is the lesson transcript text',
      };

      const result = validateCurriculumResponse(path, method, statusCode, response);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(response);
        expect(result.value).not.toHaveProperty('canonicalUrl');
      }
    });

    it('should reject response missing required fields', () => {
      const response = {
        transcript: 'Only transcript, no vtt',
      };

      const result = validateCurriculumResponse(path, method, statusCode, response);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues).toHaveLength(1);
        expect(result.issues[0].path).toContain('vtt');
        // Zod v4 reports missing required fields as "expected string, received undefined"
        expect(result.issues[0].message).toMatch(/string|undefined/);
      }
    });

    it('should reject response with wrong field types', () => {
      const response = {
        transcript: 123, // Should be string
        vtt: 'WEBVTT',
      };

      const result = validateCurriculumResponse(path, method, statusCode, response);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.length).toBeGreaterThan(0);
        expect(result.issues[0].path).toContain('transcript');
        expect(result.issues[0].message).toContain('string');
      }
    });

    it('should reject additional fields with strict validation (fail fast)', () => {
      const response = {
        transcript: 'Transcript text',
        vtt: 'WEBVTT content',
        extraField: 'This should be rejected',
      };

      const result = validateCurriculumResponse(path, method, statusCode, response);

      // Strict validation rejects unknown keys - fail fast, never silently ignore
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.length).toBeGreaterThan(0);
        // Zod v4 reports unrecognized_keys error
        expect(result.issues[0].message).toContain('extraField');
      }
    });

    it('should preserve canonicalUrl when it is already present in transcript payloads', () => {
      const response = {
        transcript: 'Transcript text',
        vtt: 'WEBVTT content',
        canonicalUrl: 'https://www.thenational.academy/teachers/lessons/add-two-numbers',
      };

      const result = validateCurriculumResponse(path, method, statusCode, response);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(response);
      }
    });
  });

  describe('for GET /lessons/{lesson}/summary response', () => {
    const path = '/lessons/{lesson}/summary';
    const method = 'get';
    const statusCode = 200;

    it('should validate valid lesson summary response without augmenting it', () => {
      const response = {
        lessonTitle: 'Introduction to Algebra',
        unitSlug: 'algebra-basics',
        unitTitle: 'Algebra Basics',
        subjectSlug: 'maths',
        subjectTitle: 'Mathematics',
        keyStageSlug: 'ks3',
        keyStageTitle: 'Key Stage 3',
        lessonKeywords: [{ keyword: 'algebra', description: 'Branch of mathematics' }],
        keyLearningPoints: [{ keyLearningPoint: 'Understanding variables' }],
        misconceptionsAndCommonMistakes: [
          { misconception: 'Variables are always x', response: 'Variables can be any letter' },
        ],
        teacherTips: [{ teacherTip: 'Use visual aids' }],
        contentGuidance: null,
        supervisionLevel: null,
        downloadsAvailable: true,
      };

      const result = validateCurriculumResponse(path, method, statusCode, response);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(response);
        expect(result.value).not.toHaveProperty('canonicalUrl');
      }
    });

    it('should validate response with optional fields omitted', () => {
      const response = {
        lessonTitle: 'Introduction to Algebra',
        unitSlug: 'algebra-basics',
        unitTitle: 'Algebra Basics',
        subjectSlug: 'maths',
        subjectTitle: 'Mathematics',
        keyStageSlug: 'ks3',
        keyStageTitle: 'Key Stage 3',
        lessonKeywords: [],
        keyLearningPoints: [],
        misconceptionsAndCommonMistakes: [],
        teacherTips: [],
        contentGuidance: null,
        supervisionLevel: null,
        downloadsAvailable: false,
        // pupilLessonOutcome is optional
      };

      const result = validateCurriculumResponse(path, method, statusCode, response);

      expect(result.ok).toBe(true);
    });

    it('should reject response with invalid array types', () => {
      const response = {
        lessonTitle: 'Introduction to Algebra',
        unitSlug: 'algebra-basics',
        unitTitle: 'Algebra Basics',
        subjectSlug: 'maths',
        subjectTitle: 'Mathematics',
        keyStageSlug: 'ks3',
        keyStageTitle: 'Key Stage 3',
        lessonKeywords: 'not an array', // Should be array
        keyLearningPoints: [],
        misconceptionsAndCommonMistakes: [],
        teacherTips: [],
        contentGuidance: null,
        supervisionLevel: null,
        downloadsAvailable: true,
      };

      const result = validateCurriculumResponse(path, method, statusCode, response);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.length).toBeGreaterThan(0);
        expect(result.issues[0].path).toContain('lessonKeywords');
      }
    });

    it('should preserve canonicalUrl when it is already present in summary payloads', () => {
      const response = {
        lessonTitle: 'Introduction to Algebra',
        unitSlug: 'algebra-basics',
        unitTitle: 'Algebra Basics',
        subjectSlug: 'maths',
        subjectTitle: 'Mathematics',
        keyStageSlug: 'ks3',
        keyStageTitle: 'Key Stage 3',
        lessonKeywords: [],
        keyLearningPoints: [],
        misconceptionsAndCommonMistakes: [],
        teacherTips: [],
        contentGuidance: null,
        supervisionLevel: null,
        downloadsAvailable: true,
        canonicalUrl: 'https://www.thenational.academy/teachers/lessons/introduction-to-algebra',
      };

      const result = validateCurriculumResponse(path, method, statusCode, response);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(response);
      }
    });
  });

  describe('for unknown operations', () => {
    it('should throw for invalid path (fail-fast)', () => {
      // Use string overload to test runtime fail-fast when path is invalid
      const invalidPath = '/unknown/path';
      const method = 'get';
      expect(() => {
        validateCurriculumResponse(invalidPath, method, 200, {});
      }).toThrow();
    });

    it('should surface validation errors for documented non-200 statuses', () => {
      const result = validateCurriculumResponse('/lessons/{lesson}/transcript', 'get', 404, {});

      expect(result.ok).toBe(false);
      if (!result.ok) {
        const issuePaths = result.issues.map((issue) => issue.path.join('.'));
        expect(issuePaths).toContain('message');
        expect(issuePaths).toContain('code');
      } else {
        throw new Error('Expected validation to fail for incomplete 404 payload');
      }
    });
  });
});
