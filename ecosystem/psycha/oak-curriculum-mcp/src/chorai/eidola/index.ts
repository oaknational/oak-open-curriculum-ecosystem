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
  {
    subjectSlug: 'english',
    subjectTitle: 'English',
    sequenceSlugs: [
      {
        sequenceSlug: 'english-primary',
        years: [1, 2, 3, 4, 5, 6],
        keyStages: [
          { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
          { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
        ],
        phaseSlug: 'primary',
        phaseTitle: 'Primary',
        ks4Options: null,
      },
    ],
    years: [1, 2, 3, 4, 5, 6],
    keyStages: [
      { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
      { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
    ],
  },
  {
    subjectSlug: 'maths',
    subjectTitle: 'Mathematics',
    sequenceSlugs: [
      {
        sequenceSlug: 'maths-primary',
        years: [1, 2, 3, 4, 5, 6],
        keyStages: [
          { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
          { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
        ],
        phaseSlug: 'primary',
        phaseTitle: 'Primary',
        ks4Options: null,
      },
    ],
    years: [1, 2, 3, 4, 5, 6],
    keyStages: [
      { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
      { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
    ],
  },
  {
    subjectSlug: 'science',
    subjectTitle: 'Science',
    sequenceSlugs: [
      {
        sequenceSlug: 'science-primary',
        years: [1, 2, 3, 4, 5, 6],
        keyStages: [
          { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
          { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
        ],
        phaseSlug: 'primary',
        phaseTitle: 'Primary',
        ks4Options: null,
      },
    ],
    years: [1, 2, 3, 4, 5, 6],
    keyStages: [
      { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
      { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
    ],
  },
];

/**
 * Mock lesson summary using actual API schema types
 */
export const mockLessonSummary: LessonSummary = {
  lessonTitle: 'Introduction to Fractions',
  unitSlug: 'fractions-y4',
  unitTitle: 'Fractions',
  subjectSlug: 'maths',
  subjectTitle: 'Mathematics',
  keyStageSlug: 'ks2',
  keyStageTitle: 'Key Stage 2',
  lessonKeywords: [
    { keyword: 'fraction', description: 'A part of a whole number' },
    { keyword: 'numerator', description: 'The top number in a fraction' },
    { keyword: 'denominator', description: 'The bottom number in a fraction' },
  ],
  keyLearningPoints: [
    { keyLearningPoint: 'Understanding what a fraction represents' },
    { keyLearningPoint: 'Identifying fractions of shapes' },
    { keyLearningPoint: 'Comparing simple fractions' },
  ],
  misconceptionsAndCommonMistakes: [],
  pupilLessonOutcome: 'I can identify and compare simple fractions',
  teacherTips: [{ teacherTip: 'Use visual aids to help students understand fractions' }],
  contentGuidance: null,
  supervisionLevel: null,
  downloadsAvailable: true,
};

/**
 * Mock search results using actual API schema types
 */
export const mockSearchResults: SearchResult[] = [
  {
    lessonSlug: 'introduction-to-fractions-2h6t8',
    lessonTitle: 'Introduction to Fractions',
    similarity: 0.95,
    units: [
      {
        unitSlug: 'fractions-y4',
        unitTitle: 'Fractions',
        examBoardTitle: null,
        keyStageSlug: 'ks2',
        subjectSlug: 'maths',
      },
    ],
  },
  {
    lessonSlug: 'adding-fractions-3k9m2',
    lessonTitle: 'Adding Fractions',
    similarity: 0.89,
    units: [
      {
        unitSlug: 'fractions-y5',
        unitTitle: 'Fractions Advanced',
        examBoardTitle: null,
        keyStageSlug: 'ks2',
        subjectSlug: 'maths',
      },
    ],
  },
];

/**
 * Create a mock SDK client for testing
 * Uses the actual generated types from the SDK
 */
export function createMockSdkClient(): unknown {
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
