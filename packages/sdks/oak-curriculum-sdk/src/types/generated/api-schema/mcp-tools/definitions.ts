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


  // DO NOT EXPORT
  const MCP_TOOLS = {
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
  


export type ToolMap = typeof MCP_TOOLS;
export type ToolName = keyof ToolMap;
export type ToolDescriptorForName<TName extends ToolName> = ToolMap[TName];


export function isToolName(value: unknown): value is ToolName {
  if (typeof value !== 'string') {
    return false;
  }
  return value in MCP_TOOLS;
}


  // THIS IS GENERATED FROM THE SAME DATA AS MCP_TOOLS, THEY ARE ALWAYS IN SYNC
  export const toolNames = ['get-changelog', 'get-changelog-latest', 'get-key-stages', 'get-key-stages-subject-assets', 'get-key-stages-subject-lessons', 'get-key-stages-subject-questions', 'get-key-stages-subject-units', 'get-lessons-assets', 'get-lessons-assets-by-type', 'get-lessons-quiz', 'get-lessons-summary', 'get-lessons-transcript', 'get-rate-limit', 'get-search-lessons', 'get-search-transcripts', 'get-sequences-assets', 'get-sequences-questions', 'get-sequences-units', 'get-subject-detail', 'get-subjects', 'get-subjects-key-stages', 'get-subjects-sequences', 'get-subjects-years', 'get-threads', 'get-threads-units', 'get-units-summary'] as const;
  

export function getToolFromToolName<TName extends ToolName>(toolName: TName): ToolDescriptorForName<TName> {
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

type OperationIdToToolName = typeof OPERATION_ID_TO_TOOL_NAME;
export type OperationId = keyof OperationIdToToolName;
export type ToolNameForOperationId<TId extends OperationId> = OperationIdToToolName[TId];
export type ToolDescriptorForOperationId<TId extends OperationId> = ToolDescriptorForName<ToolNameForOperationId<TId>>;


export function isOperationId(value: unknown): value is OperationId {
  if (typeof value !== 'string') {
    return false;
  }
  return value in OPERATION_ID_TO_TOOL_NAME;
}

export function getToolNameFromOperationId<TId extends OperationId>(operationId: TId): ToolNameForOperationId<TId> {
  const toolName = OPERATION_ID_TO_TOOL_NAME[operationId];
  if (!toolName) {
    throw new TypeError('Unknown operation: ' + String(operationId));
  }
  return toolName;
}


export function getToolFromOperationId<TId extends OperationId>(operationId: TId): ToolDescriptorForOperationId<TId> {
  const toolName = getToolNameFromOperationId(operationId);
  return MCP_TOOLS[toolName];
}


const TOOL_NAME_TO_OPERATION_ID = {
  'get-sequences-units': 'getSequences-getSequenceUnits',
  'get-lessons-transcript': 'getLessonTranscript-getLessonTranscript',
  'get-search-transcripts': 'searchTranscripts-searchTranscripts',
  'get-sequences-assets': 'getAssets-getSequenceAssets',
  'get-key-stages-subject-assets': 'getAssets-getSubjectAssets',
  'get-lessons-assets': 'getAssets-getLessonAssets',
  'get-lessons-assets-by-type': 'getAssets-getLessonAsset',
  'get-subjects': 'getSubjects-getAllSubjects',
  'get-subject-detail': 'getSubjects-getSubject',
  'get-subjects-sequences': 'getSubjects-getSubjectSequence',
  'get-subjects-key-stages': 'getSubjects-getSubjectKeyStages',
  'get-subjects-years': 'getSubjects-getSubjectYears',
  'get-key-stages': 'getKeyStages-getKeyStages',
  'get-key-stages-subject-lessons': 'getKeyStageSubjectLessons-getKeyStageSubjectLessons',
  'get-key-stages-subject-units': 'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits',
  'get-lessons-quiz': 'getQuestions-getQuestionsForLessons',
  'get-sequences-questions': 'getQuestions-getQuestionsForSequence',
  'get-key-stages-subject-questions': 'getQuestions-getQuestionsForKeyStageAndSubject',
  'get-lessons-summary': 'getLessons-getLesson',
  'get-search-lessons': 'getLessons-searchByTextSimilarity',
  'get-units-summary': 'getUnits-getUnit',
  'get-threads': 'getThreads-getAllThreads',
  'get-threads-units': 'getThreads-getThreadUnits',
  'get-changelog': 'changelog-changelog',
  'get-changelog-latest': 'changelog-latest',
  'get-rate-limit': 'getRateLimit-getRateLimit',
} as const;

type ToolNameToOperationId = typeof TOOL_NAME_TO_OPERATION_ID;
export type OperationIdForToolName<TName extends ToolName> = ToolNameToOperationId[TName];


export function getOperationIdFromToolName<TName extends ToolName>(toolName: TName): OperationIdForToolName<TName> {
  const operationId = TOOL_NAME_TO_OPERATION_ID[toolName];
  if (!operationId) {
    throw new TypeError('Unknown tool: ' + String(toolName));
  }
  return operationId;
}