/**
 * Eidola - Test Mocks Layer
 *
 * Provides test mocks and phantoms for the Oak Curriculum MCP server.
 * These are used in tests to simulate SDK responses and MCP protocol interactions.
 */

import type { components } from '@oaknational/oak-curriculum-sdk';

// Type aliases from generated SDK types for consistency
type KeyStage = components['schemas']['KeyStageResponseSchema'][number];
type Subject = components['schemas']['AllSubjectsResponseSchema'][number];
type LessonSummary = components['schemas']['LessonSummaryResponseSchema'];
type SearchResult = components['schemas']['LessonSearchResponseSchema'][number];

/**
 * Mock key stage data using actual API schema types
 */
export const mockKeyStages: KeyStage[] = [
  { slug: 'ks1', title: 'Key Stage 1' },
  { slug: 'ks2', title: 'Key Stage 2' },
  { slug: 'ks3', title: 'Key Stage 3' },
  { slug: 'ks4', title: 'Key Stage 4' },
];

/**
 * Mock subject data using actual API schema types
 */
export const mockSubjects: Subject[] = [
  { subjectSlug: 'english', subjectTitle: 'English' },
  { subjectSlug: 'maths', subjectTitle: 'Mathematics' },
  { subjectSlug: 'science', subjectTitle: 'Science' },
];

/**
 * Mock lesson summary using actual API schema types
 */
export const mockLessonSummary: LessonSummary = {
  lessonTitle: 'Introduction to Fractions',
  lessonSlug: 'introduction-to-fractions-2h6t8',
  subjectTitle: 'Mathematics',
  subjectSlug: 'maths',
  keyStageTitle: 'Key Stage 2',
  keyStageSlug: 'ks2',
  yearTitle: 'Year 4',
  programmeSlug: 'maths-primary-ks2',
  unitTitle: 'Fractions',
  unitSlug: 'fractions-y4',
  keyLearningPoints: [
    'Understanding what a fraction represents',
    'Identifying fractions of shapes',
    'Comparing simple fractions',
  ],
  pupilLessonOutcome: 'I can identify and compare simple fractions',
  lessonKeywords: ['fraction', 'numerator', 'denominator', 'whole', 'part'],
};

/**
 * Mock search results using actual API schema types
 */
export const mockSearchResults: SearchResult[] = [
  {
    lessonSlug: 'introduction-to-fractions-2h6t8',
    lessonTitle: 'Introduction to Fractions',
    subjectSlug: 'maths',
    subjectTitle: 'Mathematics',
    keyStageSlug: 'ks2',
    keyStageTitle: 'Key Stage 2',
    yearTitle: 'Year 4',
    unitSlug: 'fractions-y4',
    unitTitle: 'Fractions',
    programmeSlug: 'maths-primary-ks2',
    _id: 'lesson-1',
    _score: 0.95,
  },
  {
    lessonSlug: 'adding-fractions-3k9m2',
    lessonTitle: 'Adding Fractions',
    subjectSlug: 'maths',
    subjectTitle: 'Mathematics',
    keyStageSlug: 'ks2',
    keyStageTitle: 'Key Stage 2',
    yearTitle: 'Year 5',
    unitSlug: 'fractions-y5',
    unitTitle: 'Fractions',
    programmeSlug: 'maths-primary-ks2',
    _id: 'lesson-2',
    _score: 0.89,
  },
];

/**
 * Create a mock SDK client for testing
 * Uses the actual generated types from the SDK
 */
export function createMockSdkClient() {
  // Import vi from vitest when used in tests
  // This is a factory function that returns the mock structure
  return {
    GET: (path: string) => {
      switch (path) {
        case '/key-stages':
          return Promise.resolve({ data: mockKeyStages, error: undefined });
        case '/subjects':
          return Promise.resolve({ data: mockSubjects, error: undefined });
        case '/search/lessons':
          return Promise.resolve({ data: mockSearchResults, error: undefined });
        default:
          if (path.startsWith('/lessons/') && path.endsWith('/summary')) {
            return Promise.resolve({ data: mockLessonSummary, error: undefined });
          }
          return Promise.resolve({
            data: undefined,
            error: { status: 404, message: 'Not found' },
          });
      }
    },
  };
}
