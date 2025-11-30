/**
 * Fixture data for widget Playwright tests.
 *
 * These fixtures represent different tool output structures
 * that the widget must handle correctly. They match the shapes
 * expected by the widget's rendering logic in aggregated-tool-widget.ts.
 *
 * @see ../../src/aggregated-tool-widget.ts - Widget implementation
 */

/**
 * Help tool output fixture.
 *
 * Represents the structured response from get-help tool.
 * Triggers the widget's help content rendering mode.
 */
export const HELP_OUTPUT_FIXTURE = {
  serverOverview: {
    name: 'Oak Curriculum MCP',
    version: '1.0.0',
    description: 'Access Oak National Academy curriculum resources via MCP.',
    authentication: 'OAuth 2.1 with Clerk',
    documentation: 'https://open-api.thenational.academy/docs',
  },
  toolCategories: {
    discovery: {
      description: 'Tools for finding curriculum content by topic or keyword.',
      whenToUse: 'When you need to search for lessons, units, or questions.',
      tools: ['search', 'get-search-lessons', 'get-search-transcripts'],
    },
    browsing: {
      description: 'Tools for exploring curriculum structure systematically.',
      whenToUse: 'When navigating subjects, key stages, units, and programmes.',
      tools: ['get-subjects', 'get-key-stages', 'get-key-stages-subject-units'],
    },
    fetching: {
      description: 'Tools for retrieving specific content by ID.',
      whenToUse: 'When you have a lesson slug and need full details.',
      tools: ['fetch', 'get-lessons-summary', 'get-lessons-transcript'],
    },
  },
  workflows: {
    findLessons: {
      title: 'Find Lessons on a Topic',
      description: 'Search for lessons matching a topic across all subjects.',
      steps: [
        { step: 1, action: 'Use search tool with topic query', tool: 'search' },
        { step: 2, action: 'Review lesson results', tool: null },
        { step: 3, action: 'Fetch full details for selected lesson', tool: 'fetch' },
      ],
    },
    lessonPlanning: {
      title: 'Lesson Planning',
      description: 'Gather materials for planning a lesson.',
      steps: [
        { step: 1, action: 'Search for relevant lessons', tool: 'search' },
        { step: 2, action: 'Get lesson summary for objectives', tool: 'get-lessons-summary' },
        { step: 3, action: 'Get quiz questions for assessment', tool: 'get-lessons-quiz' },
      ],
    },
  },
  tips: [
    'Use the search tool for topic-based queries - it searches both lessons and transcripts.',
    'The fetch tool accepts any Oak URL and returns structured content.',
    'Key stages are: ks1, ks2, ks3, ks4 (lowercase).',
    'Lesson slugs look like: adding-fractions-with-the-same-denominator',
  ],
  idFormats: {
    description: 'ID format reference for the fetch tool.',
    formats: [
      { prefix: 'lesson:', example: 'lesson:adding-fractions', description: 'Lesson by slug' },
      { prefix: 'unit:', example: 'unit:fractions-y4', description: 'Unit by slug' },
    ],
  },
} as const;

/**
 * Search results fixture.
 *
 * Represents the response from search tool with lessons and transcripts.
 * Triggers the widget's search results rendering mode.
 */
export const SEARCH_OUTPUT_FIXTURE = {
  status: 200,
  data: {
    q: 'photosynthesis',
    lessonsTotal: 15,
    lessons: [
      {
        lessonTitle: 'Introduction to Photosynthesis',
        subjectTitle: 'Science',
        keyStage: 'KS3',
        slug: 'introduction-to-photosynthesis',
        canonicalUrl: 'https://teachers.thenational.academy/lessons/introduction-to-photosynthesis',
      },
      {
        lessonTitle: 'The Light-Dependent Reactions',
        subjectTitle: 'Biology',
        keyStage: 'KS4',
        slug: 'the-light-dependent-reactions',
        canonicalUrl: 'https://teachers.thenational.academy/lessons/the-light-dependent-reactions',
      },
      {
        lessonTitle: 'Factors Affecting Photosynthesis',
        subjectTitle: 'Science',
        keyStage: 'KS3',
        slug: 'factors-affecting-photosynthesis',
        canonicalUrl:
          'https://teachers.thenational.academy/lessons/factors-affecting-photosynthesis',
      },
    ],
    transcriptsTotal: 4,
    transcripts: [
      {
        lessonTitle: 'Photosynthesis Overview',
        highlightedContent:
          'Plants use sunlight to convert carbon dioxide and water into glucose and oxygen through a process called photosynthesis.',
      },
      {
        lessonTitle: 'Chloroplasts and Chlorophyll',
        highlightedContent:
          'The green pigment chlorophyll, found in chloroplasts, absorbs light energy for photosynthesis.',
      },
    ],
  },
} as const;

/**
 * Empty search results fixture.
 *
 * Represents a search that returned no results.
 * Triggers the "No results found" message in the widget.
 */
export const EMPTY_SEARCH_OUTPUT_FIXTURE = {
  status: 200,
  data: {
    q: 'xyznonexistent',
    lessonsTotal: 0,
    lessons: [],
    transcriptsTotal: 0,
    transcripts: [],
  },
} as const;

/**
 * Generic JSON output fixture.
 *
 * Represents an unknown structure that should render as JSON.
 * Triggers the widget's fallback pre-formatted JSON display.
 */
export const GENERIC_JSON_OUTPUT_FIXTURE = {
  customField: 'some value',
  nested: {
    data: 123,
    array: ['a', 'b', 'c'],
  },
  timestamp: '2025-11-30T12:00:00Z',
} as const;

/**
 * Empty output fixture.
 *
 * Represents the initial state before data arrives.
 * Triggers the "Loading..." message in the widget.
 */
export const EMPTY_OUTPUT_FIXTURE = {} as const;
