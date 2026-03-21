/**
 * Unit tests for SDK API method factories.
 *
 * These tests verify that SDK API methods:
 * 1. Convert network exceptions to Result.Err(SdkNetworkError) per ADR-088
 * 2. Return Ok with validated data on successful responses
 *
 * NO network IO, simple mock client injected as argument.
 *
 * @see `../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md`
 */

import { describe, it, expect, vi } from 'vitest';
import type { OakApiClient } from '@oaknational/curriculum-sdk';
import type { SequenceUnitsResponse } from '../types/oak';
import {
  makeGetLessonTranscript,
  makeGetLessonSummary,
  makeGetUnitSummary,
  makeGetUnitsByKeyStageAndSubject,
  makeGetSubjectSequences,
  makeGetSequenceUnits,
  makeGetLessonsByKeyStageAndSubject,
  makeGetSubjectAssets,
} from './sdk-api-methods';

/** Minimal client type for tests; adapters accept `Pick\<OakApiClient, 'GET'\>`. */
type MinimalOakApiClient = Pick<OakApiClient, 'GET'>;

/**
 * Create a minimal Oak API client that throws a network error on GET.
 */
function createThrowingClient(error: Error): MinimalOakApiClient {
  return {
    GET: vi.fn().mockRejectedValue(error),
  };
}

/**
 * Create a minimal Oak API client that returns a successful response.
 */
function createSuccessClient(data: unknown): MinimalOakApiClient {
  return {
    GET: vi.fn().mockResolvedValue({
      response: { ok: true, status: 200, statusText: 'OK' },
      data,
    }),
  };
}

// ============================================================================
// Mock Data Factories
// ============================================================================

/**
 * Create minimal valid LessonSummary data matching LessonSummaryResponseSchema.
 * Schema uses .strict() so only required fields should be included.
 */
function createMockLessonSummary() {
  return {
    lessonTitle: 'Test Lesson',
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    subjectSlug: 'maths',
    subjectTitle: 'Maths',
    keyStageSlug: 'ks4',
    keyStageTitle: 'Key Stage 4',
    lessonKeywords: [{ keyword: 'algebra', description: 'Branch of maths' }],
    keyLearningPoints: [{ keyLearningPoint: 'Learn something' }],
    misconceptionsAndCommonMistakes: [{ misconception: 'Wrong idea', response: 'Correct idea' }],
    teacherTips: [{ teacherTip: 'Helpful tip' }],
    contentGuidance: [],
    supervisionLevel: null,
    downloadsAvailable: true,
  };
}

/**
 * Create minimal valid UnitSummary data matching UnitSummaryResponseSchema.
 * Requires unitLessons array with lessonSlug, lessonTitle, and state fields.
 */
function createMockUnitSummary() {
  return {
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    yearSlug: 'year-10',
    year: 10,
    phaseSlug: 'secondary',
    subjectSlug: 'maths',
    keyStageSlug: 'ks4',
    priorKnowledgeRequirements: ['Basic arithmetic'],
    nationalCurriculumContent: ['NC content'],
    unitLessons: [{ lessonSlug: 'lesson-1', lessonTitle: 'Lesson One', state: 'published' }],
  };
}

/**
 * Create minimal valid UnitsGrouped data matching AllKeyStageAndSubjectUnitsResponseSchema.
 */
function createMockUnitsGrouped() {
  return [
    {
      yearSlug: 'year-10',
      yearTitle: 'Year 10',
      units: [
        { unitSlug: 'unit-1', unitTitle: 'Unit One' },
        { unitSlug: 'unit-2', unitTitle: 'Unit Two' },
      ],
    },
  ];
}

/**
 * Create minimal valid SubjectSequences data matching SubjectSequenceResponseSchema.
 */
function createMockSubjectSequences() {
  return [
    {
      sequenceSlug: 'maths-primary',
      years: [1, 2, 3],
      keyStages: [
        { keyStageTitle: 'Key Stage 1', keyStageSlug: 'ks1' },
        { keyStageTitle: 'Key Stage 2', keyStageSlug: 'ks2' },
      ],
      phaseSlug: 'primary',
      phaseTitle: 'Primary',
      ks4Options: null,
    },
  ];
}

/**
 * Create minimal valid LessonGroups data matching KeyStageSubjectLessonsResponseSchema.
 */
function createMockLessonGroups() {
  return [
    {
      unitSlug: 'test-unit',
      unitTitle: 'Test Unit',
      lessons: [
        { lessonSlug: 'lesson-1', lessonTitle: 'Lesson One' },
        { lessonSlug: 'lesson-2', lessonTitle: 'Lesson Two' },
      ],
    },
  ];
}

/**
 * Create minimal valid SequenceUnits data matching SequenceUnitsResponseSchema.
 */
function createMockSequenceUnits(): SequenceUnitsResponse {
  return [
    {
      year: 5,
      units: [{ unitSlug: 'unit-1', unitTitle: 'Unit One', unitOrder: 1 }],
    },
  ];
}

/**
 * Create minimal valid SubjectAssets data matching SubjectAssetsResponseSchema.
 * Assets must have type (from enum), label, and url fields.
 */
function createMockSubjectAssets() {
  return [
    {
      lessonSlug: 'test-lesson',
      lessonTitle: 'Test Lesson',
      assets: [
        {
          type: 'video',
          label: 'Video',
          url: 'https://example.com/video.mp4',
        },
      ],
    },
  ];
}

describe('SDK API Methods - Network Exception Handling', () => {
  const networkError = new TypeError('fetch failed');

  describe('makeGetLessonTranscript', () => {
    it('should return Err(network_error) when fetch throws', async () => {
      const client = createThrowingClient(networkError);
      const getTranscript = makeGetLessonTranscript(client);

      const result = await getTranscript('test-lesson');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('network_error');
        expect(result.error.resource).toBe('test-lesson');
      }
    });

    it('should return Ok on successful response', async () => {
      const client = createSuccessClient({ transcript: 'Hello', vtt: '' });
      const getTranscript = makeGetLessonTranscript(client);

      const result = await getTranscript('test-lesson');

      expect(result.ok).toBe(true);
    });
  });

  describe('makeGetLessonSummary', () => {
    it('should return Err(network_error) when fetch throws', async () => {
      const client = createThrowingClient(networkError);
      const getSummary = makeGetLessonSummary(client);

      const result = await getSummary('test-lesson');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('network_error');
        expect(result.error.resource).toBe('test-lesson');
      }
    });

    it('should return Ok with lesson summary on successful response', async () => {
      const mockData = createMockLessonSummary();
      const client = createSuccessClient(mockData);
      const getSummary = makeGetLessonSummary(client);

      const result = await getSummary('test-lesson');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.lessonTitle).toBe('Test Lesson');
        expect(result.value.unitSlug).toBe('test-unit');
      }
    });
  });

  describe('makeGetUnitSummary', () => {
    it('should return Err(network_error) when fetch throws', async () => {
      const client = createThrowingClient(networkError);
      const getSummary = makeGetUnitSummary(client);

      const result = await getSummary('test-unit');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('network_error');
        expect(result.error.resource).toBe('test-unit');
      }
    });

    it('should return Ok with unit summary on successful response', async () => {
      const mockData = createMockUnitSummary();
      const client = createSuccessClient(mockData);
      const getSummary = makeGetUnitSummary(client);

      const result = await getSummary('test-unit');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unitSlug).toBe('test-unit');
        expect(result.value.unitTitle).toBe('Test Unit');
      }
    });
  });

  describe('makeGetUnitsByKeyStageAndSubject', () => {
    it('should return Err(network_error) when fetch throws', async () => {
      const client = createThrowingClient(networkError);
      const getUnits = makeGetUnitsByKeyStageAndSubject(client);

      const result = await getUnits('ks2', 'maths');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('network_error');
        expect(result.error.resource).toBe('ks2/maths');
      }
    });

    it('should return Ok with flattened units on successful response', async () => {
      const mockData = createMockUnitsGrouped();
      const client = createSuccessClient(mockData);
      const getUnits = makeGetUnitsByKeyStageAndSubject(client);

      const result = await getUnits('ks2', 'maths');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0].unitSlug).toBe('unit-1');
        expect(result.value[1].unitSlug).toBe('unit-2');
      }
    });
  });

  describe('makeGetSubjectSequences', () => {
    it('should return Err(network_error) when fetch throws', async () => {
      const client = createThrowingClient(networkError);
      const getSequences = makeGetSubjectSequences(client);

      const result = await getSequences('maths');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('network_error');
        expect(result.error.resource).toBe('maths');
      }
    });

    it('should return Ok with subject sequences on successful response', async () => {
      const mockData = createMockSubjectSequences();
      const client = createSuccessClient(mockData);
      const getSequences = makeGetSubjectSequences(client);

      const result = await getSequences('maths');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].sequenceSlug).toBe('maths-primary');
        expect(result.value[0].phaseSlug).toBe('primary');
      }
    });
  });

  describe('makeGetSequenceUnits', () => {
    it('should return Err(network_error) when fetch throws', async () => {
      const client = createThrowingClient(networkError);
      const getSequenceUnits = makeGetSequenceUnits(client);

      const result = await getSequenceUnits('maths-primary');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('network_error');
        expect(result.error.resource).toBe('maths-primary');
      }
    });

    it('should return Ok with sequence units on successful response', async () => {
      const mockData = createMockSequenceUnits();
      const client = createSuccessClient(mockData);
      const getSequenceUnits = makeGetSequenceUnits(client);

      const result = await getSequenceUnits('maths-primary');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0]).toHaveProperty('year', 5);
      }
    });
  });

  describe('makeGetLessonsByKeyStageAndSubject', () => {
    it('should return Err(network_error) when fetch throws', async () => {
      const client = createThrowingClient(networkError);
      const getLessons = makeGetLessonsByKeyStageAndSubject(client);

      const result = await getLessons('ks3', 'science');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('network_error');
        expect(result.error.resource).toBe('ks3/science');
      }
    });

    it('should return Ok with lesson groups on successful response', async () => {
      const mockData = createMockLessonGroups();
      const client = createSuccessClient(mockData);
      const getLessons = makeGetLessonsByKeyStageAndSubject(client);

      const result = await getLessons('ks3', 'science');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].unitSlug).toBe('test-unit');
        expect(result.value[0].lessons).toHaveLength(2);
      }
    });
  });

  describe('makeGetSubjectAssets', () => {
    it('should return Err(network_error) when fetch throws', async () => {
      const client = createThrowingClient(networkError);
      const getAssets = makeGetSubjectAssets(client);

      const result = await getAssets('ks1', 'english');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('network_error');
        expect(result.error.resource).toBe('ks1/english/assets');
      }
    });

    it('should return Ok with subject assets on successful response', async () => {
      const mockData = createMockSubjectAssets();
      const client = createSuccessClient(mockData);
      const getAssets = makeGetSubjectAssets(client);

      const result = await getAssets('ks1', 'english');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].lessonSlug).toBe('test-lesson');
        expect(result.value[0].assets).toHaveLength(1);
      }
    });
  });
});
