/**
 * MCP Tools Module
 * Generated from OpenAPI schema - DO NOT EDIT MANUALLY
 * 
 * Central Contract: Everything flows from the OpenAPI schema.
 * When the API changes, re-run type-gen. That's it.
 */

/**
 * MCP Tools Data Structure
 * Generated from OpenAPI schema - DO NOT EDIT MANUALLY
 * 
 * This is the single source of truth for all MCP tools.
 * Everything flows from this: types, type guards, validators.
 */
export const MCP_TOOLS_DATA = {
  'oak-get-sequences-units': {
    path: '/sequences/{sequence}/units',
    method: 'get' as const,
    operationId: 'getSequences-getSequenceUnits',
    pathParams: ['sequence'] as const,
    queryParams: ['year'] as const,
  },
  'oak-get-lessons-transcript': {
    path: '/lessons/{lesson}/transcript',
    method: 'get' as const,
    operationId: 'getLessonTranscript-getLessonTranscript',
    description: "This endpoint returns the transcript from the video from a lesson",
    pathParams: ['lesson'] as const,
    queryParams: [] as const,
  },
  'oak-get-search-transcripts': {
    path: '/search/transcripts',
    method: 'get' as const,
    operationId: 'searchTranscripts-searchTranscripts',
    description: "Search for a term and find lessons that contain similar text in their video transcripts",
    pathParams: [] as const,
    queryParams: ['q'] as const,
  },
  'oak-get-sequences-assets': {
    path: '/sequences/{sequence}/assets',
    method: 'get' as const,
    operationId: 'getAssets-getSequenceAssets',
    description: "This endpoint returns signed download URLs and types for the assets currently available on Oak for a given sequence",
    pathParams: ['sequence'] as const,
    queryParams: ['year', 'assetType'] as const,
  },
  'oak-get-key-stages-subject-assets': {
    path: '/key-stages/{keyStage}/subject/{subject}/assets',
    method: 'get' as const,
    operationId: 'getAssets-getSubjectAssets',
    description: "This endpoint returns signed download URLs and types for the assets currently available on Oak for a given key stage and subject, optionally filtered by type and unit, grouped by lesson",
    pathParams: ['keyStage', 'subject'] as const,
    queryParams: ['assetType', 'unit'] as const,
  },
  'oak-get-lessons-assets': {
    path: '/lessons/{lesson}/assets',
    method: 'get' as const,
    operationId: 'getAssets-getLessonAssets',
    description: "This endpoint returns signed download URLS and types for the assets currently available on Oak for a given lesson",
    pathParams: ['lesson'] as const,
    queryParams: ['assetType'] as const,
  },
  'oak-get-lessons-assets-by-type': {
    path: '/lessons/{lesson}/assets/{type}',
    method: 'get' as const,
    operationId: 'getAssets-getLessonAsset',
    description: "This endpoint will stream the downloadable asset for the given lesson and type",
    pathParams: ['lesson', 'assetType'] as const,
    queryParams: [] as const,
  },
  'oak-get-subjects': {
    path: '/subjects',
    method: 'get' as const,
    operationId: 'getSubjects-getAllSubjects',
    description: "This endpoint returns an array of all subjects and associated sequences, key stages and years that are currently available on Oak",
    pathParams: [] as const,
    queryParams: [] as const,
  },
  'oak-get-subject-detail': {
    path: '/subjects/{subject}',
    method: 'get' as const,
    operationId: 'getSubjects-getSubject',
    description: "This endpoint returns a single subject and associated sequences, key stages and years.",
    pathParams: ['subject'] as const,
    queryParams: [] as const,
  },
  'oak-get-subjects-sequences': {
    path: '/subjects/{subject}/sequences',
    method: 'get' as const,
    operationId: 'getSubjects-getSubjectSequence',
    description: "List of the sequences, including phase, key stage 4 options, years and key stages the sequence applies to for a subject.",
    pathParams: ['subject'] as const,
    queryParams: [] as const,
  },
  'oak-get-subjects-key-stages': {
    path: '/subjects/{subject}/key-stages',
    method: 'get' as const,
    operationId: 'getSubjects-getSubjectKeyStages',
    description: "List of the key stages a subject is taught in.",
    pathParams: ['subject'] as const,
    queryParams: [] as const,
  },
  'oak-get-subjects-years': {
    path: '/subjects/{subject}/years',
    method: 'get' as const,
    operationId: 'getSubjects-getSubjectYears',
    description: "List of the years a subject is taught in.",
    pathParams: ['subject'] as const,
    queryParams: [] as const,
  },
  'oak-get-key-stages': {
    path: '/key-stages',
    method: 'get' as const,
    operationId: 'getKeyStages-getKeyStages',
    description: "This endpoint returns all the key stages (titles and slugs) that are currently available on Oak",
    pathParams: [] as const,
    queryParams: [] as const,
  },
  'oak-get-key-stages-subject-lessons': {
    path: '/key-stages/{keyStage}/subject/{subject}/lessons',
    method: 'get' as const,
    operationId: 'getKeyStageSubjectLessons-getKeyStageSubjectLessons',
    description: "This endpoint returns all the lessons (titles and slugs) that are currently available on Oak for a given subject and key stage, grouped by unit",
    pathParams: ['keyStage', 'subject'] as const,
    queryParams: ['unit', 'offset', 'limit'] as const,
  },
  'oak-get-key-stages-subject-units': {
    path: '/key-stages/{keyStage}/subject/{subject}/units',
    method: 'get' as const,
    operationId: 'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits',
    description: "This endpoint returns all the units (titles and slugs) that are currently available on Oak for a given subject and key stage",
    pathParams: ['keyStage', 'subject'] as const,
    queryParams: [] as const,
  },
  'oak-get-lessons-quiz': {
    path: '/lessons/{lesson}/quiz',
    method: 'get' as const,
    operationId: 'getQuestions-getQuestionsForLessons',
    description: "The endpoint returns the quiz questions and answers for a given lesson. The answers data indicates which answers are correct, and which are distractors.",
    pathParams: ['lesson'] as const,
    queryParams: [] as const,
  },
  'oak-get-sequences-questions': {
    path: '/sequences/{sequence}/questions',
    method: 'get' as const,
    operationId: 'getQuestions-getQuestionsForSequence',
    description: "This endpoint returns the quiz questions and answers (and indicates which answers are correct and which are distractors) for a given sequence",
    pathParams: ['sequence'] as const,
    queryParams: ['year', 'offset', 'limit'] as const,
  },
  'oak-get-key-stages-subject-questions': {
    path: '/key-stages/{keyStage}/subject/{subject}/questions',
    method: 'get' as const,
    operationId: 'getQuestions-getQuestionsForKeyStageAndSubject',
    description: "This endpoint returns all the quiz questions and answers (and indicates which answers are correct and which are distractors), grouped by lesson, for a given key stage and subject",
    pathParams: ['keyStage', 'subject'] as const,
    queryParams: ['offset', 'limit'] as const,
  },
  'oak-get-lessons-summary': {
    path: '/lessons/{lesson}/summary',
    method: 'get' as const,
    operationId: 'getLessons-getLesson',
    description: "This endpoint returns a summary for a given lesson",
    pathParams: ['lesson'] as const,
    queryParams: [] as const,
  },
  'oak-get-search-lessons': {
    path: '/search/lessons',
    method: 'get' as const,
    operationId: 'getLessons-searchByTextSimilarity',
    description: "This endpoint returns lessons that are similar to the search criteria, including a similarity score, and details of the unit that it is in",
    pathParams: [] as const,
    queryParams: ['q', 'keyStage', 'subject', 'unit'] as const,
  },
  'oak-get-units-summary': {
    path: '/units/{unit}/summary',
    method: 'get' as const,
    operationId: 'getUnits-getUnit',
    description: "This endpoint returns unit information for a given unit, including slug, title, number of lessons, prior knowledge requirements, national curriculum statements, prior unit details, future unit descriptions, and lesson titles that form the unit",
    pathParams: ['unit'] as const,
    queryParams: [] as const,
  },
  'oak-get-threads': {
    path: '/threads',
    method: 'get' as const,
    operationId: 'getThreads-getAllThreads',
    description: "Get all threads that can be used as sequence filters.",
    pathParams: [] as const,
    queryParams: [] as const,
  },
  'oak-get-threads-units': {
    path: '/threads/{threadSlug}/units',
    method: 'get' as const,
    operationId: 'getThreads-getThreadUnits',
    description: "Get all units for a specific thread filter.",
    pathParams: ['threadSlug'] as const,
    queryParams: [] as const,
  },
  'oak-get-changelog': {
    path: '/changelog',
    method: 'get' as const,
    operationId: 'changelog-changelog',
    description: "History of significant changes to the API with associated dates and versions",
    pathParams: [] as const,
    queryParams: [] as const,
  },
  'oak-get-changelog-latest': {
    path: '/changelog/latest',
    method: 'get' as const,
    operationId: 'changelog-latest',
    description: "Get the latest version and latest change note for the API",
    pathParams: [] as const,
    queryParams: [] as const,
  },
  'oak-get-rate-limit': {
    path: '/rate-limit',
    method: 'get' as const,
    operationId: 'getRateLimit-getRateLimit',
    description: "Check your current rate limit status (note that your rate limit is also included in the headers of every response).\n\nThis specific endpoint does not cost any requests.",
    pathParams: [] as const,
    queryParams: [] as const,
  },
} as const;

/**
 * Literal union of all MCP tool names
 * This enables compile-time type safety for tool names
 */
export type McpToolName = keyof typeof MCP_TOOLS_DATA;
// 'oak-get-sequences-units' | 'oak-get-lessons-transcript' | 'oak-get-search-transcripts' | 'oak-get-sequences-assets' | 'oak-get-key-stages-subject-assets' | 'oak-get-lessons-assets' | 'oak-get-lessons-assets-by-type' | 'oak-get-subjects' | 'oak-get-subject-detail' | 'oak-get-subjects-sequences' | 'oak-get-subjects-key-stages' | 'oak-get-subjects-years' | 'oak-get-key-stages' | 'oak-get-key-stages-subject-lessons' | 'oak-get-key-stages-subject-units' | 'oak-get-lessons-quiz' | 'oak-get-sequences-questions' | 'oak-get-key-stages-subject-questions' | 'oak-get-lessons-summary' | 'oak-get-search-lessons' | 'oak-get-units-summary' | 'oak-get-threads' | 'oak-get-threads-units' | 'oak-get-changelog' | 'oak-get-changelog-latest' | 'oak-get-rate-limit'

/**
 * Type guard to check if a value is a valid MCP tool name
 * @param value - Unknown value to check
 * @returns True if value is a valid McpToolName
 */
export function isMcpToolName(value: unknown): value is McpToolName {
  return typeof value === 'string' && value in MCP_TOOLS_DATA;
}


/**
 * Get tool information by name
 * @param name - MCP tool name
 * @returns Tool information or undefined
 */
export function getMcpTool<T extends McpToolName>(name: T): typeof MCP_TOOLS_DATA[T] {
  return MCP_TOOLS_DATA[name];
}
