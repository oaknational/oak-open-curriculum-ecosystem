/**
 * Fixture data for new widget renderer Playwright tests.
 *
 * These fixtures represent tool outputs for the new renderers.
 *
 * @see ./fixtures.ts - Core fixtures
 * @see ../../src/widget-renderers/ - Renderer implementations
 */

/**
 * Quiz output fixture - get-lessons-quiz tool.
 */
export const QUIZ_OUTPUT_FIXTURE = {
  starterQuiz: [
    {
      question: 'Tick the sentence with the correct punctuation.',
      questionType: 'multiple-choice',
      answers: [
        { distractor: true, type: 'text', content: 'the baby cried' },
        { distractor: true, type: 'text', content: 'The baby cried' },
        { distractor: false, type: 'text', content: 'The baby cried.' },
        { distractor: true, type: 'text', content: 'the baby cried.' },
      ],
    },
  ],
  exitQuiz: [
    {
      question: 'Which word is a verb?',
      questionType: 'multiple-choice',
      answers: [
        { distractor: true, type: 'text', content: 'shops' },
        { distractor: true, type: 'text', content: 'Alex' },
        { distractor: true, type: 'text', content: 'I' },
        { distractor: false, type: 'text', content: 'shout' },
      ],
    },
  ],
} as const;

/**
 * Lesson summary output fixture - get-lessons-summary tool.
 * Includes canonicalUrl for testing canonical link rendering.
 */
export const LESSON_SUMMARY_OUTPUT_FIXTURE = {
  lessonTitle: "Joining using 'and'",
  unitTitle: 'Simple sentences',
  subjectTitle: 'English',
  keyStageTitle: 'Key Stage 1',
  canonicalUrl: 'https://www.thenational.academy/teachers/lessons/joining-using-and',
  lessonKeywords: [
    { keyword: 'joining word', description: 'a word that joins words or ideas' },
    { keyword: 'build on', description: 'add to' },
    { keyword: 'related', description: 'linked to' },
  ],
  keyLearningPoints: [
    { keyLearningPoint: 'And is a type of joining word.' },
    { keyLearningPoint: 'A joining word can join two simple sentences.' },
    { keyLearningPoint: 'Each simple sentence is about one idea.' },
  ],
  misconceptionsAndCommonMistakes: [
    {
      misconception: 'Pupils may struggle to link related ideas together.',
      response: 'Give non-examples.',
    },
  ],
  pupilLessonOutcome: "I can join two simple sentences with 'and'.",
  teacherTips: [{ teacherTip: 'Give pupils opportunities to say sentences orally.' }],
} as const;

/**
 * Key stages list output fixture - get-key-stages tool.
 */
export const KEY_STAGES_OUTPUT_FIXTURE = [
  { slug: 'ks1', title: 'Key Stage 1' },
  { slug: 'ks2', title: 'Key Stage 2' },
  { slug: 'ks3', title: 'Key Stage 3' },
  { slug: 'ks4', title: 'Key Stage 4' },
] as const;

/**
 * Transcript output fixture - get-lessons-transcript tool.
 * Uses fictional teacher name for test data.
 */
export const TRANSCRIPT_OUTPUT_FIXTURE = {
  transcript:
    "Hello, I'm Ms. Example-Teacher. I'm looking forward to guiding you through your learning today.",
  vtt: "WEBVTT\n\n1\n00:00:06.300 --> 00:00:08.070\n<v ->Hello, I'm Ms. Example-Teacher.</v>",
} as const;

/**
 * Changelog output fixture - get-changelog tool.
 */
export const CHANGELOG_OUTPUT_FIXTURE = [
  {
    version: '0.5.0',
    date: '2025-03-06',
    changes: ['PPTX used for slideDeck assets', 'New endpoints'],
  },
  { version: '0.4.0', date: '2025-02-07', changes: ['Added /sequences/* endpoints'] },
] as const;

/**
 * Rate limit output fixture - get-rate-limit tool.
 */
export const RATE_LIMIT_OUTPUT_FIXTURE = {
  remaining: 85,
  limit: 100,
  reset: 1735689600,
} as const;

/**
 * Search lessons output fixture - get-search-lessons tool.
 * Note: This tool returns a flat ARRAY, not { lessons: [...] }.
 * This is the real API response structure that the widget must handle.
 */
export const SEARCH_LESSONS_ARRAY_FIXTURE = [
  {
    lessonSlug: 'photosynthesis-intro',
    lessonTitle: 'Introduction to Photosynthesis',
    similarity: 0.92,
    units: [{ unitSlug: 'plants', unitTitle: 'Plants and Growth' }],
    canonicalUrl: 'https://www.thenational.academy/teachers/lessons/photosynthesis-intro',
  },
  {
    lessonSlug: 'plant-cells',
    lessonTitle: 'Plant Cell Structure',
    similarity: 0.85,
    units: [{ unitSlug: 'cells', unitTitle: 'Cells and Life' }],
  },
] as const;

/**
 * Ontology output fixture - get-ontology tool.
 * Contains curated curriculum structure for widget rendering.
 */
export const ONTOLOGY_OUTPUT_FIXTURE = {
  version: '0.1.0-poc',
  curriculumStructure: {
    keyStages: [
      { slug: 'ks1', name: 'Key Stage 1', ageRange: '5-7', years: [1, 2], phase: 'primary' },
      { slug: 'ks2', name: 'Key Stage 2', ageRange: '7-11', years: [3, 4, 5, 6], phase: 'primary' },
      { slug: 'ks3', name: 'Key Stage 3', ageRange: '11-14', years: [7, 8, 9], phase: 'secondary' },
      { slug: 'ks4', name: 'Key Stage 4', ageRange: '14-16', years: [10, 11], phase: 'secondary' },
    ],
  },
  entityHierarchy: {
    description: 'Curriculum content is organised in a hierarchy',
    levels: [
      { entity: 'Subject', example: 'maths', contains: 'Sequences / Programmes' },
      { entity: 'Unit', example: 'fractions-year-4', contains: 'Lessons (typically 4-8 per unit)' },
      {
        entity: 'Lesson',
        example: 'adding-fractions',
        contains: 'Slides, video, transcript, quizzes',
      },
    ],
  },
  threads: {
    definition: 'Conceptual progression strands that connect units across years.',
    importance:
      "Threads show how ideas BUILD over time - they are the pedagogical backbone of Oak's curriculum",
    examples: [
      {
        slug: 'number',
        subject: 'maths',
        spans: 'Reception → Year 11',
        progression: 'Counting → Algebra → Surds',
      },
    ],
  },
  workflows: {
    findLessons: {
      title: 'Find lessons on a topic',
      description: 'When a user wants to find curriculum content',
      steps: [
        { step: 1, action: 'Use search tool' },
        { step: 2, action: 'Use fetch tool' },
      ],
    },
  },
} as const;
