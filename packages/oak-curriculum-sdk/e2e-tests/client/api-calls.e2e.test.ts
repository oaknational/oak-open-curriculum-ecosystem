/**
 * E2E Tests for Oak Curriculum SDK API Calls
 *
 * These tests verify that the SDK can successfully make real API calls
 * to the Oak Curriculum API and handle responses correctly.
 *
 * Tests are conditionally run when:
 * - RUN_E2E=true environment variable is set
 * - OAK_API_KEY is available
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { config } from 'dotenv';
import { createOakClient } from '../../src/client/index';
import type { OakApiClient } from '../../src/client/index';
import type { components } from '../../src/types/generated/api-schema/api-paths-types';

// Type aliases for better readability and compile-time checking
type KeyStage = components['schemas']['KeyStageResponseSchema'][number];
type Subject = components['schemas']['AllSubjectsResponseSchema'][number];
type LessonSummary = components['schemas']['LessonSummaryResponseSchema'];
type SearchResult = components['schemas']['LessonSearchResponseSchema'][number];
type TranscriptSearchResult = components['schemas']['SearchTranscriptResponseSchema'][number];

// Load environment variables from .env file
config({ path: '../../.env' });

const shouldRunE2E = process.env.RUN_E2E === 'true';
const apiKey = process.env.OAK_API_KEY ?? '';

describe.skipIf(!shouldRunE2E || !apiKey)('Oak Curriculum SDK E2E Tests', () => {
  let client: OakApiClient;

  beforeAll(() => {
    client = createOakClient(apiKey);
  });

  describe('Key Stage Operations', () => {
    it('should list all key stages', async () => {
      const result = await client.GET('/key-stages');

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();

      if (result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        if (result.data.length > 0) {
          const keyStage: KeyStage = result.data[0];
          // TypeScript ensures these properties exist at compile time
          expect(keyStage.slug).toBeDefined();
          expect(keyStage.title).toBeDefined();
          // The following would cause a TypeScript error at compile time:
          // expect(keyStage.shortCode).toBeDefined(); // TS2339: Property 'shortCode' does not exist
        }
      }
    }, 10000);
  });

  describe('Subject Operations', () => {
    it('should list all subjects', async () => {
      const result = await client.GET('/subjects');

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();

      if (result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        if (result.data.length > 0) {
          const subject: Subject = result.data[0];
          // TypeScript ensures these properties exist at compile time
          expect(subject.subjectSlug).toBeDefined();
          expect(subject.subjectTitle).toBeDefined();
        }
      }
    }, 10000);

    it('should get a specific subject', async () => {
      // First get subjects to find a valid slug
      const subjectsResult = await client.GET('/subjects');

      if (subjectsResult.data && subjectsResult.data.length > 0) {
        const subjectSlug = subjectsResult.data[0].subjectSlug;

        const result = await client.GET('/subjects/{subject}', {
          params: {
            path: {
              subject: subjectSlug,
            },
          },
        });

        expect(result.error).toBeUndefined();
        expect(result.data).toBeDefined();

        if (result.data) {
          expect(result.data).toHaveProperty('subjectSlug');
          expect(result.data.subjectSlug).toBe(subjectSlug);
          expect(result.data).toHaveProperty('subjectTitle');
        }
      }
    }, 10000);
  });

  describe('Lesson Operations', () => {
    it('should list lessons for a key stage and subject', async () => {
      // Use hardcoded values that are known to exist
      const result = await client.GET('/key-stages/{keyStage}/subject/{subject}/lessons', {
        params: {
          path: {
            keyStage: 'ks2' as const, // Type-safe constant
            subject: 'maths' as const, // Type-safe constant
          },
        },
      });

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();

      if (result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        if (result.data.length > 0) {
          const lesson = result.data[0];
          expect(lesson).toHaveProperty('unitSlug');
          expect(lesson).toHaveProperty('unitTitle');
          expect(lesson).toHaveProperty('lessons');
        }
      }
    }, 10000);

    it('should get lesson summary', async () => {
      // First get a lesson to test with
      const lessonsResult = await client.GET('/key-stages/{keyStage}/subject/{subject}/lessons', {
        params: {
          path: {
            keyStage: 'ks2' as const,
            subject: 'maths' as const,
          },
        },
      });

      if (
        lessonsResult.data &&
        lessonsResult.data.length > 0 &&
        lessonsResult.data[0].lessons.length > 0
      ) {
        const lessonSlug = lessonsResult.data[0].lessons[0].lessonSlug;

        const result = await client.GET('/lessons/{lesson}/summary', {
          params: {
            path: {
              lesson: lessonSlug,
            },
          },
        });

        expect(result.error).toBeUndefined();
        expect(result.data).toBeDefined();

        if (result.data) {
          const lessonSummary: LessonSummary = result.data;
          // TypeScript ensures these properties exist at compile time
          expect(lessonSummary.lessonTitle).toBeDefined();
          expect(lessonSummary.unitSlug).toBeDefined();
          expect(lessonSummary.unitTitle).toBeDefined();
          expect(lessonSummary.subjectSlug).toBeDefined();
          expect(lessonSummary.subjectTitle).toBeDefined();
          // If we tried to access lessonSummary.slug here, TypeScript would error
        }
      }
    }, 10000);
  });

  describe('Search Operations', () => {
    it('should search for lessons', async () => {
      const result = await client.GET('/search/lessons', {
        params: {
          query: {
            q: 'mathematics', // Use 'q' instead of 'query'
          },
        },
      });

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();

      if (result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        if (result.data.length > 0) {
          const searchResult: SearchResult = result.data[0];
          // TypeScript ensures these properties exist at compile time
          expect(searchResult.lessonSlug).toBeDefined();
          expect(searchResult.lessonTitle).toBeDefined();
        }
      }
    }, 10000);

    it('should search transcripts', async () => {
      const result = await client.GET('/search/transcripts', {
        params: {
          query: {
            q: 'algebra', // Use 'q' instead of 'query'
          },
        },
      });

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();

      if (result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        if (result.data.length > 0) {
          const transcript: TranscriptSearchResult = result.data[0];
          // TypeScript ensures these properties exist at compile time
          expect(transcript.lessonTitle).toBeDefined();
          expect(transcript.lessonSlug).toBeDefined();
        }
      }
    }, 10000);
  });

  describe('Error Handling', () => {
    it('should handle 404 errors gracefully', async () => {
      const result = await client.GET('/lessons/{lesson}/summary', {
        params: {
          path: {
            lesson: 'non-existent-lesson-12345',
          },
        },
      });

      // Check for error OR empty data (API might return 200 with null data)
      expect(Boolean(result.error) || !result.data).toBeTruthy();
    }, 10000);

    it('should handle invalid subject slug', async () => {
      const result = await client.GET('/subjects/{subject}', {
        params: {
          path: {
            subject: 'invalid-subject-99999',
          },
        },
      });

      // Check for error OR empty data
      expect(Boolean(result.error) || !result.data).toBeTruthy();
    }, 10000);
  });

  describe('Rate Limiting', () => {
    it('should check rate limit status', async () => {
      const result = await client.GET('/rate-limit');

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();

      if (result.data) {
        expect(result.data).toHaveProperty('remaining');
        expect(result.data).toHaveProperty('limit');
        expect(typeof result.data.remaining).toBe('number');
        expect(typeof result.data.limit).toBe('number');
      }
    }, 10000);
  });

  describe('Type Safety', () => {
    it('should maintain type safety throughout operations', async () => {
      const result = await client.GET('/subjects');

      if (result.data) {
        // TypeScript should enforce these types at compile time
        result.data.forEach((subject) => {
          const slug: string = subject.subjectSlug;
          const title: string = subject.subjectTitle;

          // These should be type-safe operations
          expect(typeof slug).toBe('string');
          expect(typeof title).toBe('string');
        });
      }
    }, 10000);
  });
});

// Helper test to verify environment setup
describe('E2E Test Environment', () => {
  it('should report E2E test status', () => {
    if (!shouldRunE2E) {
      console.log('E2E tests skipped. Set RUN_E2E=true to run them.');
    } else if (!apiKey) {
      console.log('E2E tests skipped. OAK_API_KEY not configured.');
    } else {
      console.log('E2E tests enabled and configured.');
    }
    expect(true).toBe(true);
  });
});
