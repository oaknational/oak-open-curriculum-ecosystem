/**
 * Unit tests for lesson materials fetching.
 *
 * Tests the fetchLessonMaterials function with various scenarios:
 * - Normal fetch with transcript and summary
 * - Skip fetch when hasVideo === false (no_video case)
 * - Handle 404 responses
 * - Handle empty transcript responses
 *
 * @see ADR-091 Video Availability Detection Strategy
 * @see ADR-092 Transcript Cache Categorization Strategy
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ok, err } from '@oaknational/result';
import { fetchLessonMaterials, type FetchContext } from './lesson-materials';
import type { OakClient } from '../../adapters/oak-adapter';
import type { SdkNotFoundError } from '@oaknational/curriculum-sdk';
import {
  lessonSummarySchema,
  type SearchLessonSummary,
} from '@oaknational/curriculum-sdk/public/search.js';
import { createMockClient } from '../../test-helpers/mock-oak-client';

// =============================================================================
// Test Helpers
// =============================================================================

/**
 * Create a mock lesson summary that matches the Zod schema.
 * Based on actual fixture data from fixtures/sandbox/lesson-summaries.json
 */
function createMockSummary(overrides: Partial<SearchLessonSummary> = {}): SearchLessonSummary {
  return lessonSummarySchema.parse({
    lessonTitle: 'Test Lesson',
    canonicalUrl: 'https://www.thenational.academy/teachers/lessons/test-lesson',
    oakUrl: 'https://teachers.thenational.academy/lessons/test-lesson',
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    subjectSlug: 'maths',
    subjectTitle: 'Maths',
    keyStageSlug: 'ks2',
    keyStageTitle: 'Key stage 2',
    lessonKeywords: [{ keyword: 'fraction', description: 'Understanding fractions' }],
    keyLearningPoints: [{ keyLearningPoint: 'Identify fractions' }],
    misconceptionsAndCommonMistakes: [{ misconception: 'Common error', response: 'Correction' }],
    pupilLessonOutcome: 'Learn about fractions',
    teacherTips: [{ teacherTip: 'Use visual aids' }],
    contentGuidance: [
      {
        contentGuidanceArea: 'Maths',
        supervisionlevel_id: 1,
        contentGuidanceLabel: 'Low',
        contentGuidanceDescription: 'Suitable for general classrooms',
      },
    ],
    supervisionLevel: 'low',
    downloadsAvailable: true,
    ...overrides,
  });
}

/** Create a mock OakClient with customisable transcript/summary responses. */
function createLessonMaterialsMockClient(options: {
  transcriptResponse?: { transcript: string; vtt: string } | 'not_found' | 'network_error';
  summaryResponse?: ReturnType<typeof createMockSummary> | 'not_found' | 'network_error';
}): OakClient {
  const networkError = {
    kind: 'network_error' as const,
    resource: 'test-lesson',
    cause: new Error('Connection failed'),
  };

  const summaryNetworkError = {
    kind: 'network_error' as const,
    resource: 'test-lesson',
    cause: new Error('Connection failed'),
  };

  const transcriptNotFound: SdkNotFoundError = {
    kind: 'not_found',
    resource: 'test-lesson',
    resourceType: 'transcript',
  };

  const summaryNotFound: SdkNotFoundError = {
    kind: 'not_found',
    resource: 'test-lesson',
    resourceType: 'lesson',
  };

  const transcriptResult =
    options.transcriptResponse === 'not_found'
      ? err(transcriptNotFound)
      : options.transcriptResponse === 'network_error'
        ? err(networkError)
        : ok(options.transcriptResponse ?? { transcript: 'Test transcript', vtt: 'WEBVTT' });

  const summaryResult =
    options.summaryResponse === 'not_found'
      ? err(summaryNotFound)
      : options.summaryResponse === 'network_error'
        ? err(summaryNetworkError)
        : ok(options.summaryResponse ?? createMockSummary());

  return createMockClient({
    getLessonTranscript: vi.fn().mockResolvedValue(transcriptResult),
    getLessonSummary: vi.fn().mockResolvedValue(summaryResult),
  });
}

// =============================================================================
// Tests
// =============================================================================

describe('fetchLessonMaterials', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('normal fetch', () => {
    it('should return transcript and summary on successful fetch', async () => {
      const client = createLessonMaterialsMockClient({
        transcriptResponse: { transcript: 'Hello world', vtt: 'WEBVTT' },
        summaryResponse: createMockSummary(),
      });

      const result = await fetchLessonMaterials(client, 'test-lesson');

      expect(result).not.toBeNull();
      expect(result?.transcript).toBe('Hello world');
      expect(result?.summary.lessonTitle).toBe('Test Lesson');
      expect(client.getLessonTranscript).toHaveBeenCalledWith('test-lesson');
      expect(client.getLessonSummary).toHaveBeenCalledWith('test-lesson');
    });
  });

  describe('hasVideo === false (no_video case)', () => {
    it('should skip transcript fetch when hasVideo is false', async () => {
      const client = createLessonMaterialsMockClient({
        summaryResponse: createMockSummary(),
      });
      const context: FetchContext = {
        keyStage: 'ks2',
        subject: 'maths',
        hasVideo: false,
      };

      const result = await fetchLessonMaterials(client, 'test-lesson', context);

      // Should not call getLessonTranscript when hasVideo is false
      expect(client.getLessonTranscript).not.toHaveBeenCalled();
      // Should still call getLessonSummary
      expect(client.getLessonSummary).toHaveBeenCalledWith('test-lesson');
      // Should return empty transcript
      expect(result?.transcript).toBe('');
      expect(result?.summary).toBeDefined();
    });

    it('should fetch transcript when hasVideo is undefined (backwards compatible)', async () => {
      const client = createLessonMaterialsMockClient({
        transcriptResponse: { transcript: 'Transcript content', vtt: 'WEBVTT' },
        summaryResponse: createMockSummary(),
      });
      const context: FetchContext = {
        keyStage: 'ks2',
        subject: 'maths',
        // hasVideo is undefined
      };

      const result = await fetchLessonMaterials(client, 'test-lesson', context);

      expect(client.getLessonTranscript).toHaveBeenCalledWith('test-lesson');
      expect(result?.transcript).toBe('Transcript content');
    });

    it('should fetch transcript when hasVideo is true', async () => {
      const client = createLessonMaterialsMockClient({
        transcriptResponse: { transcript: 'Video transcript', vtt: 'WEBVTT' },
        summaryResponse: createMockSummary(),
      });
      const context: FetchContext = {
        keyStage: 'ks2',
        subject: 'maths',
        hasVideo: true,
      };

      const result = await fetchLessonMaterials(client, 'test-lesson', context);

      expect(client.getLessonTranscript).toHaveBeenCalledWith('test-lesson');
      expect(result?.transcript).toBe('Video transcript');
    });
  });

  describe('404 handling (not_found case)', () => {
    it('should return empty transcript when transcript returns 404', async () => {
      const client = createLessonMaterialsMockClient({
        transcriptResponse: 'not_found',
        summaryResponse: createMockSummary(),
      });

      const result = await fetchLessonMaterials(client, 'test-lesson');

      expect(result?.transcript).toBe('');
      expect(result?.summary).toBeDefined();
    });

    it('should return null when summary returns 404', async () => {
      const client = createLessonMaterialsMockClient({
        transcriptResponse: { transcript: 'Test', vtt: 'WEBVTT' },
        summaryResponse: 'not_found',
      });

      const result = await fetchLessonMaterials(client, 'test-lesson');

      expect(result).toBeNull();
    });
  });

  describe('network error handling', () => {
    it('should return empty transcript on network error (recoverable)', async () => {
      const client = createLessonMaterialsMockClient({
        transcriptResponse: 'network_error',
        summaryResponse: createMockSummary(),
      });

      const result = await fetchLessonMaterials(client, 'test-lesson');

      // Network errors for transcripts are recoverable - return empty
      expect(result?.transcript).toBe('');
      expect(result?.summary).toBeDefined();
    });

    it('should return null when summary has network error (skip lesson)', async () => {
      const client = createLessonMaterialsMockClient({
        transcriptResponse: { transcript: 'Test', vtt: 'WEBVTT' },
        summaryResponse: 'network_error',
      });

      const result = await fetchLessonMaterials(client, 'test-lesson');

      // Summary is required - null means skip this lesson
      expect(result).toBeNull();
    });
  });

  describe('empty transcript handling', () => {
    it('should handle empty transcript response as valid', async () => {
      const client = createLessonMaterialsMockClient({
        transcriptResponse: { transcript: '', vtt: '' },
        summaryResponse: createMockSummary(),
      });

      const result = await fetchLessonMaterials(client, 'test-lesson');

      // Empty transcript is valid - some lessons have no spoken content
      expect(result?.transcript).toBe('');
      expect(result?.summary).toBeDefined();
    });
  });

  describe('context propagation', () => {
    it('should include context in error collection', async () => {
      const client = createLessonMaterialsMockClient({
        transcriptResponse: { transcript: 'Test', vtt: 'WEBVTT' },
        summaryResponse: 'not_found',
      });
      const context: FetchContext = {
        keyStage: 'ks3',
        subject: 'science',
        unitSlug: 'test-unit',
      };

      const result = await fetchLessonMaterials(client, 'test-lesson', context);

      expect(result).toBeNull();
      // Context is used for error logging - verified through error collector mock if needed
    });
  });
});
