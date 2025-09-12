/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Type definitions and guards for MCP tools
 */

/**
 * Operation ID to tool name mapping
 */
const operationIdToToolName = {
  'getSequences-getSequenceUnits': {
    toolName: 'get-sequences-units',
    operationIdKey: 'getSequences-getSequenceUnits',
  },
  'getLessonTranscript-getLessonTranscript': {
    toolName: 'get-lessons-transcript',
    operationIdKey: 'getLessonTranscript-getLessonTranscript',
  },
  'searchTranscripts-searchTranscripts': {
    toolName: 'get-search-transcripts',
    operationIdKey: 'searchTranscripts-searchTranscripts',
  },
  'getAssets-getSequenceAssets': {
    toolName: 'get-sequences-assets',
    operationIdKey: 'getAssets-getSequenceAssets',
  },
  'getAssets-getSubjectAssets': {
    toolName: 'get-key-stages-subject-assets',
    operationIdKey: 'getAssets-getSubjectAssets',
  },
  'getAssets-getLessonAssets': {
    toolName: 'get-lessons-assets',
    operationIdKey: 'getAssets-getLessonAssets',
  },
  'getAssets-getLessonAsset': {
    toolName: 'get-lessons-assets-by-type',
    operationIdKey: 'getAssets-getLessonAsset',
  },
  'getSubjects-getAllSubjects': {
    toolName: 'get-subjects',
    operationIdKey: 'getSubjects-getAllSubjects',
  },
  'getSubjects-getSubject': {
    toolName: 'get-subject-detail',
    operationIdKey: 'getSubjects-getSubject',
  },
  'getSubjects-getSubjectSequence': {
    toolName: 'get-subjects-sequences',
    operationIdKey: 'getSubjects-getSubjectSequence',
  },
  'getSubjects-getSubjectKeyStages': {
    toolName: 'get-subjects-key-stages',
    operationIdKey: 'getSubjects-getSubjectKeyStages',
  },
  'getSubjects-getSubjectYears': {
    toolName: 'get-subjects-years',
    operationIdKey: 'getSubjects-getSubjectYears',
  },
  'getKeyStages-getKeyStages': {
    toolName: 'get-key-stages',
    operationIdKey: 'getKeyStages-getKeyStages',
  },
  'getKeyStageSubjectLessons-getKeyStageSubjectLessons': {
    toolName: 'get-key-stages-subject-lessons',
    operationIdKey: 'getKeyStageSubjectLessons-getKeyStageSubjectLessons',
  },
  'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits': {
    toolName: 'get-key-stages-subject-units',
    operationIdKey: 'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits',
  },
  'getQuestions-getQuestionsForLessons': {
    toolName: 'get-lessons-quiz',
    operationIdKey: 'getQuestions-getQuestionsForLessons',
  },
  'getQuestions-getQuestionsForSequence': {
    toolName: 'get-sequences-questions',
    operationIdKey: 'getQuestions-getQuestionsForSequence',
  },
  'getQuestions-getQuestionsForKeyStageAndSubject': {
    toolName: 'get-key-stages-subject-questions',
    operationIdKey: 'getQuestions-getQuestionsForKeyStageAndSubject',
  },
  'getLessons-getLesson': {
    toolName: 'get-lessons-summary',
    operationIdKey: 'getLessons-getLesson',
  },
  'getLessons-searchByTextSimilarity': {
    toolName: 'get-search-lessons',
    operationIdKey: 'getLessons-searchByTextSimilarity',
  },
  'getUnits-getUnit': {
    toolName: 'get-units-summary',
    operationIdKey: 'getUnits-getUnit',
  },
  'getThreads-getAllThreads': {
    toolName: 'get-threads',
    operationIdKey: 'getThreads-getAllThreads',
  },
  'getThreads-getThreadUnits': {
    toolName: 'get-threads-units',
    operationIdKey: 'getThreads-getThreadUnits',
  },
  'changelog-changelog': {
    toolName: 'get-changelog',
    operationIdKey: 'changelog-changelog',
  },
  'changelog-latest': {
    toolName: 'get-changelog-latest',
    operationIdKey: 'changelog-latest',
  },
  'getRateLimit-getRateLimit': {
    toolName: 'get-rate-limit',
    operationIdKey: 'getRateLimit-getRateLimit',
  },
} as const;

const allToolNames = Object.values(operationIdToToolName).map(v => v.toolName);
export type AllOperationIds = keyof typeof operationIdToToolName;
export type AllToolNames = typeof allToolNames[number];

/**
* Type guard for tool names
*/
export function isToolName(value: unknown): value is AllToolNames {
  if (typeof value !== 'string') return false;
  const validToolNames: readonly string[] = allToolNames;
  return validToolNames.includes(value);
}

/**
* Type guard for operation IDs
*/
function isOperationId(operationId: string): operationId is AllOperationIds {
  return operationId in operationIdToToolName;
}

export function getToolNameFromOperationId(operationId: string): AllToolNames {
  if (!isOperationId(operationId)) {
    throw new TypeError(`Invalid operation ID: ${operationId}. Allowed values: ${Object.keys(operationIdToToolName).join(', ')}`);
  }
  return operationIdToToolName[operationId].toolName;
}