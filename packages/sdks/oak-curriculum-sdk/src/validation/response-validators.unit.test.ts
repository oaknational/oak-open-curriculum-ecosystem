/**
 * Unit tests for response validation functions
 * Following TDD approach - tests written before implementation
 */

import { describe, it, expect } from 'vitest';
import { validateResponse } from './response-validators.js';
import type { ValidPath } from '../types/generated/api-schema/path-parameters.js';

describe('validateResponse', () => {
  describe('for GET /lessons/{lesson}/transcript response', () => {
    const path = '/lessons/{lesson}/transcript';
    const method = 'get';
    const statusCode = 200;

    it('should validate valid transcript response', () => {
      const response = {
        transcript: 'This is the lesson transcript text',
        vtt: 'WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nThis is the lesson transcript text',
      };

      const result = validateResponse(path, method, statusCode, response);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual({
          ...response,
          canonicalUrl: 'https://www.thenational.academy/teachers/lessons/transcript',
        });
      }
    });

    it('should reject response missing required fields', () => {
      const response = {
        transcript: 'Only transcript, no vtt',
      };

      const result = validateResponse(path, method, statusCode, response);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues).toHaveLength(1);
        expect(result.issues[0].path).toContain('vtt');
        expect(result.issues[0].message).toContain('Required');
      }
    });

    it('should reject response with wrong field types', () => {
      const response = {
        transcript: 123, // Should be string
        vtt: 'WEBVTT',
      };

      const result = validateResponse(path, method, statusCode, response);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.length).toBeGreaterThan(0);
        expect(result.issues[0].path).toContain('transcript');
        expect(result.issues[0].message).toContain('string');
      }
    });

    it('should allow additional fields with passthrough', () => {
      const response = {
        transcript: 'Transcript text',
        vtt: 'WEBVTT content',
        extraField: 'This is allowed',
      };

      const result = validateResponse(path, method, statusCode, response);

      expect(result.ok).toBe(true);
      if (result.ok) {
        const d = Object.getOwnPropertyDescriptor(result.value as object, 'extraField');
        expect(typeof d?.value === 'string').toBe(true);
        expect(d?.value).toBe('This is allowed');
      }
    });
  });

  describe('for GET /lessons/{lesson}/summary response', () => {
    const path = '/lessons/{lesson}/summary';
    const method = 'get';
    const statusCode = 200;

    it('should validate valid lesson summary response', () => {
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

      const result = validateResponse(path, method, statusCode, response);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual({
          ...response,
          canonicalUrl: 'https://www.thenational.academy/teachers/lessons/summary',
        });
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

      const result = validateResponse(path, method, statusCode, response);

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

      const result = validateResponse(path, method, statusCode, response);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.length).toBeGreaterThan(0);
        expect(result.issues[0].path).toContain('lessonKeywords');
      }
    });
  });

  describe('for unknown operations', () => {
    it('should throw for invalid path (fail-fast)', () => {
      expect(() => {
        // simulate pre-validation: product code would call isValidPath and throw earlier
        // we explicitly call the validator with an invalid path to assert fail-fast
        validateResponse('/unknown/path' as ValidPath, 'get' as never, 200, {});
      }).toThrow();
    });

    it('should throw for unsupported status code (fail-fast)', () => {
      expect(() => validateResponse('/lessons/{lesson}/transcript', 'get', 404, {})).toThrow();
    });
  });
});
