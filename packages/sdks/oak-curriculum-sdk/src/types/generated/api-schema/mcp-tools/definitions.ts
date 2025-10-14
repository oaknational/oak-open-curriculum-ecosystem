/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-definitions-file.ts
 *
 * MCP Tools definitions
 * 
 * Canonical literal descriptors for every tool.
 * 
 * This is an internal file, all types and utilities are created in the types.js file
 */

import { type ToolDescriptor } from './types.js';

// Import all tool definitions

import { getChangelog } from './tools/get-changelog.js';
import { getChangelogLatest } from './tools/get-changelog-latest.js';
import { getKeyStages } from './tools/get-key-stages.js';
import { getKeyStagesSubjectAssets } from './tools/get-key-stages-subject-assets.js';
import { getKeyStagesSubjectLessons } from './tools/get-key-stages-subject-lessons.js';
import { getKeyStagesSubjectQuestions } from './tools/get-key-stages-subject-questions.js';
import { getKeyStagesSubjectUnits } from './tools/get-key-stages-subject-units.js';
import { getLessonsAssets } from './tools/get-lessons-assets.js';
import { getLessonsAssetsByType } from './tools/get-lessons-assets-by-type.js';
import { getLessonsQuiz } from './tools/get-lessons-quiz.js';
import { getLessonsSummary } from './tools/get-lessons-summary.js';
import { getLessonsTranscript } from './tools/get-lessons-transcript.js';
import { getRateLimit } from './tools/get-rate-limit.js';
import { getSearchLessons } from './tools/get-search-lessons.js';
import { getSearchTranscripts } from './tools/get-search-transcripts.js';
import { getSequencesAssets } from './tools/get-sequences-assets.js';
import { getSequencesQuestions } from './tools/get-sequences-questions.js';
import { getSequencesUnits } from './tools/get-sequences-units.js';
import { getSubjectDetail } from './tools/get-subject-detail.js';
import { getSubjects } from './tools/get-subjects.js';
import { getSubjectsKeyStages } from './tools/get-subjects-key-stages.js';
import { getSubjectsSequences } from './tools/get-subjects-sequences.js';
import { getSubjectsYears } from './tools/get-subjects-years.js';
import { getThreads } from './tools/get-threads.js';
import { getThreadsUnits } from './tools/get-threads-units.js';
import { getUnitsSummary } from './tools/get-units-summary.js';

export const MCP_TOOLS = {
  'get-changelog': getChangelog,
  'get-changelog-latest': getChangelogLatest,
  'get-key-stages': getKeyStages,
  'get-key-stages-subject-assets': getKeyStagesSubjectAssets,
  'get-key-stages-subject-lessons': getKeyStagesSubjectLessons,
  'get-key-stages-subject-questions': getKeyStagesSubjectQuestions,
  'get-key-stages-subject-units': getKeyStagesSubjectUnits,
  'get-lessons-assets': getLessonsAssets,
  'get-lessons-assets-by-type': getLessonsAssetsByType,
  'get-lessons-quiz': getLessonsQuiz,
  'get-lessons-summary': getLessonsSummary,
  'get-lessons-transcript': getLessonsTranscript,
  'get-rate-limit': getRateLimit,
  'get-search-lessons': getSearchLessons,
  'get-search-transcripts': getSearchTranscripts,
  'get-sequences-assets': getSequencesAssets,
  'get-sequences-questions': getSequencesQuestions,
  'get-sequences-units': getSequencesUnits,
  'get-subject-detail': getSubjectDetail,
  'get-subjects': getSubjects,
  'get-subjects-key-stages': getSubjectsKeyStages,
  'get-subjects-sequences': getSubjectsSequences,
  'get-subjects-years': getSubjectsYears,
  'get-threads': getThreads,
  'get-threads-units': getThreadsUnits,
  'get-units-summary': getUnitsSummary,
} as const;


type ToolNameToToolDescriptor = typeof MCP_TOOLS;
export type ToolName = keyof ToolNameToToolDescriptor;


export function isToolName(value: unknown): value is ToolName {
  if (typeof value !== 'string') {
    return false;
  }
  return value in MCP_TOOLS;
}

export function getToolFromToolName(toolName: ToolName): ToolDescriptor {
  return MCP_TOOLS[toolName];
}

const OPERATION_ID_TO_TOOL_NAME = {
  'getSequences-getSequenceUnits': 'get-sequences-units',
  'getLessonTranscript-getLessonTranscript': 'get-lessons-transcript',
  'searchTranscripts-searchTranscripts': 'get-search-transcripts',
  'getAssets-getSequenceAssets': 'get-sequences-assets',
  'getAssets-getSubjectAssets': 'get-key-stages-subject-assets',
  'getAssets-getLessonAssets': 'get-lessons-assets',
  'getAssets-getLessonAsset': 'get-lessons-assets-by-type',
  'getSubjects-getAllSubjects': 'get-subjects',
  'getSubjects-getSubject': 'get-subject-detail',
  'getSubjects-getSubjectSequence': 'get-subjects-sequences',
  'getSubjects-getSubjectKeyStages': 'get-subjects-key-stages',
  'getSubjects-getSubjectYears': 'get-subjects-years',
  'getKeyStages-getKeyStages': 'get-key-stages',
  'getKeyStageSubjectLessons-getKeyStageSubjectLessons': 'get-key-stages-subject-lessons',
  'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits': 'get-key-stages-subject-units',
  'getQuestions-getQuestionsForLessons': 'get-lessons-quiz',
  'getQuestions-getQuestionsForSequence': 'get-sequences-questions',
  'getQuestions-getQuestionsForKeyStageAndSubject': 'get-key-stages-subject-questions',
  'getLessons-getLesson': 'get-lessons-summary',
  'getLessons-searchByTextSimilarity': 'get-search-lessons',
  'getUnits-getUnit': 'get-units-summary',
  'getThreads-getAllThreads': 'get-threads',
  'getThreads-getThreadUnits': 'get-threads-units',
  'changelog-changelog': 'get-changelog',
  'changelog-latest': 'get-changelog-latest',
  'getRateLimit-getRateLimit': 'get-rate-limit',
} as const;

export type OperationId = keyof typeof OPERATION_ID_TO_TOOL_NAME;

export function isOperationId(value: unknown): value is OperationId {
  if (typeof value !== 'string') {
    return false;
  }
  return value in OPERATION_ID_TO_TOOL_NAME;
}

export function getToolNameFromOperationId(operationId: OperationId): ToolName {
  const toolName = OPERATION_ID_TO_TOOL_NAME[operationId];
  if (!toolName) {
    throw new TypeError('Unknown operation: ' + String(operationId));
  }
  return toolName;
}

export function getToolFromOperationId(operationId: OperationId): ToolDescriptor {
  const toolName = getToolNameFromOperationId(operationId);
  return MCP_TOOLS[toolName];
}