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
 */
export const LESSON_SUMMARY_OUTPUT_FIXTURE = {
  lessonTitle: "Joining using 'and'",
  unitTitle: 'Simple sentences',
  subjectTitle: 'English',
  keyStageTitle: 'Key Stage 1',
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
