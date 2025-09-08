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
    toolName: 'oak-get-sequences-units',
    operationIdKey: 'getSequences-getSequenceUnits',
  },
  'getLessonTranscript-getLessonTranscript': {
    toolName: 'oak-get-lessons-transcript',
    operationIdKey: 'getLessonTranscript-getLessonTranscript',
  },
  'searchTranscripts-searchTranscripts': {
    toolName: 'oak-get-search-transcripts',
    operationIdKey: 'searchTranscripts-searchTranscripts',
  },
  'getAssets-getSequenceAssets': {
    toolName: 'oak-get-sequences-assets',
    operationIdKey: 'getAssets-getSequenceAssets',
  },
  'getAssets-getSubjectAssets': {
    toolName: 'oak-get-key-stages-subject-assets',
    operationIdKey: 'getAssets-getSubjectAssets',
  },
  'getAssets-getLessonAssets': {
    toolName: 'oak-get-lessons-assets',
    operationIdKey: 'getAssets-getLessonAssets',
  },
  'getAssets-getLessonAsset': {
    toolName: 'oak-get-lessons-assets-by-type',
    operationIdKey: 'getAssets-getLessonAsset',
  },
  'getSubjects-getAllSubjects': {
    toolName: 'oak-get-subjects',
    operationIdKey: 'getSubjects-getAllSubjects',
  },
  'getSubjects-getSubject': {
    toolName: 'oak-get-subject-detail',
    operationIdKey: 'getSubjects-getSubject',
  },
  'getSubjects-getSubjectSequence': {
    toolName: 'oak-get-subjects-sequences',
    operationIdKey: 'getSubjects-getSubjectSequence',
  },
  'getSubjects-getSubjectKeyStages': {
    toolName: 'oak-get-subjects-key-stages',
    operationIdKey: 'getSubjects-getSubjectKeyStages',
  },
  'getSubjects-getSubjectYears': {
    toolName: 'oak-get-subjects-years',
    operationIdKey: 'getSubjects-getSubjectYears',
  },
  'getKeyStages-getKeyStages': {
    toolName: 'oak-get-key-stages',
    operationIdKey: 'getKeyStages-getKeyStages',
  },
  'getKeyStageSubjectLessons-getKeyStageSubjectLessons': {
    toolName: 'oak-get-key-stages-subject-lessons',
    operationIdKey: 'getKeyStageSubjectLessons-getKeyStageSubjectLessons',
  },
  'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits': {
    toolName: 'oak-get-key-stages-subject-units',
    operationIdKey: 'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits',
  },
  'getQuestions-getQuestionsForLessons': {
    toolName: 'oak-get-lessons-quiz',
    operationIdKey: 'getQuestions-getQuestionsForLessons',
  },
  'getQuestions-getQuestionsForSequence': {
    toolName: 'oak-get-sequences-questions',
    operationIdKey: 'getQuestions-getQuestionsForSequence',
  },
  'getQuestions-getQuestionsForKeyStageAndSubject': {
    toolName: 'oak-get-key-stages-subject-questions',
    operationIdKey: 'getQuestions-getQuestionsForKeyStageAndSubject',
  },
  'getLessons-getLesson': {
    toolName: 'oak-get-lessons-summary',
    operationIdKey: 'getLessons-getLesson',
  },
  'getLessons-searchByTextSimilarity': {
    toolName: 'oak-get-search-lessons',
    operationIdKey: 'getLessons-searchByTextSimilarity',
  },
  'getUnits-getUnit': {
    toolName: 'oak-get-units-summary',
    operationIdKey: 'getUnits-getUnit',
  },
  'getThreads-getAllThreads': {
    toolName: 'oak-get-threads',
    operationIdKey: 'getThreads-getAllThreads',
  },
  'getThreads-getThreadUnits': {
    toolName: 'oak-get-threads-units',
    operationIdKey: 'getThreads-getThreadUnits',
  },
  'changelog-changelog': {
    toolName: 'oak-get-changelog',
    operationIdKey: 'changelog-changelog',
  },
  'changelog-latest': {
    toolName: 'oak-get-changelog-latest',
    operationIdKey: 'changelog-latest',
  },
  'getRateLimit-getRateLimit': {
    toolName: 'oak-get-rate-limit',
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