/**
 * Reviewed anchors for generated/API-derived items changed after the audit
 * baseline, plus the generator exclusion config relocated on latest main.
 */

const GENERATED_ROOT =
  'packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools';
const DEFINITIONS =
  'packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/definitions.ts';

/**
 * The regenerated MCP_TOOL_ENTRIES catalogue (27 tools) after the MCP-653
 * dead-changelog-tool disable; anchors C677 (tool-name catalogue) and C678
 * (per-tool operationIds), which share this block.
 */
const MCP_TOOL_ENTRIES_CURRENT_BLOCK = `export const MCP_TOOL_ENTRIES = [
  { name: 'get-key-stages', descriptor: getKeyStages, operationId: 'getKeyStages-getKeyStages' },
  { name: 'get-key-stages-subject-assets', descriptor: getKeyStagesSubjectAssets, operationId: 'getAssets-getSubjectAssets' },
  { name: 'get-key-stages-subject-lessons', descriptor: getKeyStagesSubjectLessons, operationId: 'getKeyStageSubjectLessons-getKeyStageSubjectLessons' },
  { name: 'get-key-stages-subject-questions', descriptor: getKeyStagesSubjectQuestions, operationId: 'getQuestions-getQuestionsForKeyStageAndSubject' },
  { name: 'get-key-stages-subject-units', descriptor: getKeyStagesSubjectUnits, operationId: 'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits' },
  { name: 'get-keywords', descriptor: getKeywords, operationId: 'getKeywords-getKeywords' },
  { name: 'get-lessons-assets', descriptor: getLessonsAssets, operationId: 'getAssets-getLessonAssets' },
  { name: 'get-lessons-quiz', descriptor: getLessonsQuiz, operationId: 'getQuestions-getQuestionsForLessons' },
  { name: 'get-lessons-summary', descriptor: getLessonsSummary, operationId: 'getLessons-getLesson' },
  { name: 'get-lessons-transcript', descriptor: getLessonsTranscript, operationId: 'getLessonTranscript-getLessonTranscript' },
  { name: 'get-programmes', descriptor: getProgrammes, operationId: 'getAllProgrammesForSubject-getProgramme' },
  { name: 'get-programmes-assets', descriptor: getProgrammesAssets, operationId: 'getAssets-getProgrammeAssets' },
  { name: 'get-programmes-questions', descriptor: getProgrammesQuestions, operationId: 'getQuestions-getQuestionsForProgramme' },
  { name: 'get-programmes-units', descriptor: getProgrammesUnits, operationId: 'getAllProgrammesForSubject-getProgrammeUnits' },
  { name: 'get-rate-limit', descriptor: getRateLimit, operationId: 'getRateLimit-getRateLimit' },
  { name: 'get-sequences', descriptor: getSequences, operationId: 'getSequences-getSubjectSequence' },
  { name: 'get-sequences-assets', descriptor: getSequencesAssets, operationId: 'getAssets-getSequenceAssets' },
  { name: 'get-sequences-questions', descriptor: getSequencesQuestions, operationId: 'getQuestions-getQuestionsForSequence' },
  { name: 'get-sequences-units', descriptor: getSequencesUnits, operationId: 'getSequences-getSequenceUnits' },
  { name: 'get-subject-detail', descriptor: getSubjectDetail, operationId: 'getSubjects-getSubject' },
  { name: 'get-subjects', descriptor: getSubjects, operationId: 'getSubjects-getAllSubjects' },
  { name: 'get-subjects-key-stages', descriptor: getSubjectsKeyStages, operationId: 'getSubjects-getSubjectKeyStages' },
  { name: 'get-subjects-programmes', descriptor: getSubjectsProgrammes, operationId: 'getAllProgrammesForSubject-getAllProgrammesForSubject' },
  { name: 'get-subjects-years', descriptor: getSubjectsYears, operationId: 'getSubjects-getSubjectYears' },
  { name: 'get-threads', descriptor: getThreads, operationId: 'getThreads-getAllThreads' },
  { name: 'get-threads-units', descriptor: getThreadsUnits, operationId: 'getThreads-getThreadUnits' },
  { name: 'get-units-summary', descriptor: getUnitsSummary, operationId: 'getUnits-getUnit' },
] as const;`;
const LESSONS = `${GENERATED_ROOT}/get-key-stages-subject-lessons.ts`;
const KEY_STAGE_QUESTIONS = `${GENERATED_ROOT}/get-key-stages-subject-questions.ts`;
const PROGRAMME_ASSETS = `${GENERATED_ROOT}/get-programmes-assets.ts`;
const PROGRAMME_QUESTIONS = `${GENERATED_ROOT}/get-programmes-questions.ts`;
const SEQUENCE_QUESTIONS = `${GENERATED_ROOT}/get-sequences-questions.ts`;

export const CURRENT_GENERATED_ITEM_ANCHOR_OVERRIDES = {
  C470: {
    'packages/sdks/oak-sdk-codegen/code-generation/excluded-paths.ts': [
      "export const SKIPPED_PATHS: ReadonlySet<string> = new Set([\n  '/search/lessons',\n  '/search/transcripts',\n  '/lessons/{lesson}/assets/{type}',\n]);",
    ],
  },
  C518: {
    [LESSONS]: [
      '  /** Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted. Default: 20 */',
    ],
  },
  // MCP-462: upstream's 2026-07 rework changed the limit example 20 → 10, and
  // the generator now carries upstream's `maximum` into the input schema.
  C519: {
    [LESSONS]: [
      String.raw`"default":20,"examples":[10],"maximum":300}},"additionalProperties":false,"required":["keyStage","subject"]}\nRequired: keyStage, subject`,
    ],
  },
  C527: {
    [KEY_STAGE_QUESTIONS]: [
      '  /** Limit the number of lessons, e.g. return a maximum of 300 lessons Default: 20 */',
    ],
  },
  // MCP-462: upstream's 2026-07 rework changed the limit example 20 → 10, and
  // the generator now carries upstream's `maximum` into the input schema.
  C529: {
    [KEY_STAGE_QUESTIONS]: [
      '"default":20,"examples":[10],"maximum":300},"filter":{"type":"string","description":"Optional filter for question results.',
      String.raw`\nRequired: keyStage, subject`,
    ],
  },
  C584: {
    [PROGRAMME_ASSETS]: [
      '  /** Limit the number of lessons, e.g. return a maximum of 300 lessons Default: 20 */',
    ],
  },
  // MCP-462: upstream's 2026-07 rework fixed the "Use the this type" typo, and
  // the generator now carries upstream's `maximum` into the input schema.
  C586: {
    [PROGRAMME_ASSETS]: [
      '"default":20,"examples":[20],"maximum":300},"type":{"type":"string","description":"Use this type',
      String.raw`\nRequired: programme`,
    ],
  },
  C593: {
    [PROGRAMME_QUESTIONS]: [
      '  /** Limit the number of lessons, e.g. return a maximum of 300 lessons Default: 20 */',
    ],
  },
  // MCP-462: the generator now carries upstream's `maximum` into the input schema.
  C595: {
    [PROGRAMME_QUESTIONS]: [
      '"default":20,"examples":[20],"maximum":300},"filter":{"type":"string","description":"Optional filter for question results.',
      String.raw`\nRequired: programme`,
    ],
  },
  C621: {
    [SEQUENCE_QUESTIONS]: [
      'The sequence slug identifier, including the key stage 4 option where relevant.',
      'The sequence slug identifier, including the key stage 4 option where relevant.',
    ],
  },
  C622: {
    [SEQUENCE_QUESTIONS]: [
      'The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.',
      'The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.',
    ],
  },
  C623: {
    [SEQUENCE_QUESTIONS]: [
      'If limiting results returned, this allows you to return the next set of results, starting at the given offset point',
      'If limiting results returned, this allows you to return the next set of results, starting at the given offset point',
    ],
  },
  C624: {
    [SEQUENCE_QUESTIONS]: [
      'Limit the number of lessons, e.g. return a maximum of 300 lessons Default: 20',
      'Limit the number of lessons, e.g. return a maximum of 300 lessons',
    ],
  },
  C625: {
    [SEQUENCE_QUESTIONS]: [
      'Optional filter for question results. Use `images` to return only questions with a question image or image answer.',
      'Optional filter for question results. Use `images` to return only questions with a question image or image answer.',
    ],
  },
  // MCP-462: upstream's 2026-07 rework changed the limit example 20 → 100, and
  // the generator now carries upstream's `maximum` into the input schema.
  C626: {
    [SEQUENCE_QUESTIONS]: [
      '"default":20,"examples":[100],"maximum":300},"filter":{"type":"string","description":"Optional filter for question results.',
      String.raw`\nRequired: sequence`,
    ],
  },
  // MCP-653/MCP-630: upstream removed /changelog and /changelog/latest, and
  // the two dead tools were disabled via DEFERRED_PATHS ahead of the
  // schema-cache refresh. The catalogue (C677) and per-tool operationIds
  // (C678) now carry 27 entries; the anchor below is the regenerated block.
  C677: {
    [DEFINITIONS]: [MCP_TOOL_ENTRIES_CURRENT_BLOCK],
  },
  C678: {
    [DEFINITIONS]: [MCP_TOOL_ENTRIES_CURRENT_BLOCK],
  },
} as const;

export const CURRENT_GENERATED_ITEM_REVISION_OVERRIDES = {
  C470: 'relocated',
  C518: 'modified',
  C519: 'modified',
  C527: 'modified',
  C529: 'modified',
  C584: 'modified',
  C586: 'modified',
  C593: 'modified',
  C595: 'modified',
  C621: 'unchanged',
  C622: 'unchanged',
  C623: 'unchanged',
  C624: 'modified',
  C625: 'unchanged',
  C626: 'modified',
  C677: 'modified',
  C678: 'modified',
} as const;
