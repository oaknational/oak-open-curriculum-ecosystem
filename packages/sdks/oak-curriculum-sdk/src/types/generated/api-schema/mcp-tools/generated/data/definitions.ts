/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-definitions-file.ts
 *
 * MCP Tools definitions
 *
 * Canonical literal descriptors for every tool.
 *
 * This file participates in the schema-first execution DAG. See
 * .agent/directives-and-memory/schema-first-execution.md for details.
 */

import type { ToolDescriptor } from '../../contract/tool-descriptor.contract.js';

// Import canonical tool descriptors

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

type ToolDescriptorEntries = {
  readonly 'get-changelog': ToolDescriptor<
    typeof getChangelog['name'],
    Parameters<typeof getChangelog['invoke']>[0],
    Parameters<typeof getChangelog['invoke']>[1],
    Awaited<ReturnType<typeof getChangelog['invoke']>>
  >;
  readonly 'get-changelog-latest': ToolDescriptor<
    typeof getChangelogLatest['name'],
    Parameters<typeof getChangelogLatest['invoke']>[0],
    Parameters<typeof getChangelogLatest['invoke']>[1],
    Awaited<ReturnType<typeof getChangelogLatest['invoke']>>
  >;
  readonly 'get-key-stages': ToolDescriptor<
    typeof getKeyStages['name'],
    Parameters<typeof getKeyStages['invoke']>[0],
    Parameters<typeof getKeyStages['invoke']>[1],
    Awaited<ReturnType<typeof getKeyStages['invoke']>>
  >;
  readonly 'get-key-stages-subject-assets': ToolDescriptor<
    typeof getKeyStagesSubjectAssets['name'],
    Parameters<typeof getKeyStagesSubjectAssets['invoke']>[0],
    Parameters<typeof getKeyStagesSubjectAssets['invoke']>[1],
    Awaited<ReturnType<typeof getKeyStagesSubjectAssets['invoke']>>
  >;
  readonly 'get-key-stages-subject-lessons': ToolDescriptor<
    typeof getKeyStagesSubjectLessons['name'],
    Parameters<typeof getKeyStagesSubjectLessons['invoke']>[0],
    Parameters<typeof getKeyStagesSubjectLessons['invoke']>[1],
    Awaited<ReturnType<typeof getKeyStagesSubjectLessons['invoke']>>
  >;
  readonly 'get-key-stages-subject-questions': ToolDescriptor<
    typeof getKeyStagesSubjectQuestions['name'],
    Parameters<typeof getKeyStagesSubjectQuestions['invoke']>[0],
    Parameters<typeof getKeyStagesSubjectQuestions['invoke']>[1],
    Awaited<ReturnType<typeof getKeyStagesSubjectQuestions['invoke']>>
  >;
  readonly 'get-key-stages-subject-units': ToolDescriptor<
    typeof getKeyStagesSubjectUnits['name'],
    Parameters<typeof getKeyStagesSubjectUnits['invoke']>[0],
    Parameters<typeof getKeyStagesSubjectUnits['invoke']>[1],
    Awaited<ReturnType<typeof getKeyStagesSubjectUnits['invoke']>>
  >;
  readonly 'get-lessons-assets': ToolDescriptor<
    typeof getLessonsAssets['name'],
    Parameters<typeof getLessonsAssets['invoke']>[0],
    Parameters<typeof getLessonsAssets['invoke']>[1],
    Awaited<ReturnType<typeof getLessonsAssets['invoke']>>
  >;
  readonly 'get-lessons-assets-by-type': ToolDescriptor<
    typeof getLessonsAssetsByType['name'],
    Parameters<typeof getLessonsAssetsByType['invoke']>[0],
    Parameters<typeof getLessonsAssetsByType['invoke']>[1],
    Awaited<ReturnType<typeof getLessonsAssetsByType['invoke']>>
  >;
  readonly 'get-lessons-quiz': ToolDescriptor<
    typeof getLessonsQuiz['name'],
    Parameters<typeof getLessonsQuiz['invoke']>[0],
    Parameters<typeof getLessonsQuiz['invoke']>[1],
    Awaited<ReturnType<typeof getLessonsQuiz['invoke']>>
  >;
  readonly 'get-lessons-summary': ToolDescriptor<
    typeof getLessonsSummary['name'],
    Parameters<typeof getLessonsSummary['invoke']>[0],
    Parameters<typeof getLessonsSummary['invoke']>[1],
    Awaited<ReturnType<typeof getLessonsSummary['invoke']>>
  >;
  readonly 'get-lessons-transcript': ToolDescriptor<
    typeof getLessonsTranscript['name'],
    Parameters<typeof getLessonsTranscript['invoke']>[0],
    Parameters<typeof getLessonsTranscript['invoke']>[1],
    Awaited<ReturnType<typeof getLessonsTranscript['invoke']>>
  >;
  readonly 'get-rate-limit': ToolDescriptor<
    typeof getRateLimit['name'],
    Parameters<typeof getRateLimit['invoke']>[0],
    Parameters<typeof getRateLimit['invoke']>[1],
    Awaited<ReturnType<typeof getRateLimit['invoke']>>
  >;
  readonly 'get-search-lessons': ToolDescriptor<
    typeof getSearchLessons['name'],
    Parameters<typeof getSearchLessons['invoke']>[0],
    Parameters<typeof getSearchLessons['invoke']>[1],
    Awaited<ReturnType<typeof getSearchLessons['invoke']>>
  >;
  readonly 'get-search-transcripts': ToolDescriptor<
    typeof getSearchTranscripts['name'],
    Parameters<typeof getSearchTranscripts['invoke']>[0],
    Parameters<typeof getSearchTranscripts['invoke']>[1],
    Awaited<ReturnType<typeof getSearchTranscripts['invoke']>>
  >;
  readonly 'get-sequences-assets': ToolDescriptor<
    typeof getSequencesAssets['name'],
    Parameters<typeof getSequencesAssets['invoke']>[0],
    Parameters<typeof getSequencesAssets['invoke']>[1],
    Awaited<ReturnType<typeof getSequencesAssets['invoke']>>
  >;
  readonly 'get-sequences-questions': ToolDescriptor<
    typeof getSequencesQuestions['name'],
    Parameters<typeof getSequencesQuestions['invoke']>[0],
    Parameters<typeof getSequencesQuestions['invoke']>[1],
    Awaited<ReturnType<typeof getSequencesQuestions['invoke']>>
  >;
  readonly 'get-sequences-units': ToolDescriptor<
    typeof getSequencesUnits['name'],
    Parameters<typeof getSequencesUnits['invoke']>[0],
    Parameters<typeof getSequencesUnits['invoke']>[1],
    Awaited<ReturnType<typeof getSequencesUnits['invoke']>>
  >;
  readonly 'get-subject-detail': ToolDescriptor<
    typeof getSubjectDetail['name'],
    Parameters<typeof getSubjectDetail['invoke']>[0],
    Parameters<typeof getSubjectDetail['invoke']>[1],
    Awaited<ReturnType<typeof getSubjectDetail['invoke']>>
  >;
  readonly 'get-subjects': ToolDescriptor<
    typeof getSubjects['name'],
    Parameters<typeof getSubjects['invoke']>[0],
    Parameters<typeof getSubjects['invoke']>[1],
    Awaited<ReturnType<typeof getSubjects['invoke']>>
  >;
  readonly 'get-subjects-key-stages': ToolDescriptor<
    typeof getSubjectsKeyStages['name'],
    Parameters<typeof getSubjectsKeyStages['invoke']>[0],
    Parameters<typeof getSubjectsKeyStages['invoke']>[1],
    Awaited<ReturnType<typeof getSubjectsKeyStages['invoke']>>
  >;
  readonly 'get-subjects-sequences': ToolDescriptor<
    typeof getSubjectsSequences['name'],
    Parameters<typeof getSubjectsSequences['invoke']>[0],
    Parameters<typeof getSubjectsSequences['invoke']>[1],
    Awaited<ReturnType<typeof getSubjectsSequences['invoke']>>
  >;
  readonly 'get-subjects-years': ToolDescriptor<
    typeof getSubjectsYears['name'],
    Parameters<typeof getSubjectsYears['invoke']>[0],
    Parameters<typeof getSubjectsYears['invoke']>[1],
    Awaited<ReturnType<typeof getSubjectsYears['invoke']>>
  >;
  readonly 'get-threads': ToolDescriptor<
    typeof getThreads['name'],
    Parameters<typeof getThreads['invoke']>[0],
    Parameters<typeof getThreads['invoke']>[1],
    Awaited<ReturnType<typeof getThreads['invoke']>>
  >;
  readonly 'get-threads-units': ToolDescriptor<
    typeof getThreadsUnits['name'],
    Parameters<typeof getThreadsUnits['invoke']>[0],
    Parameters<typeof getThreadsUnits['invoke']>[1],
    Awaited<ReturnType<typeof getThreadsUnits['invoke']>>
  >;
  readonly 'get-units-summary': ToolDescriptor<
    typeof getUnitsSummary['name'],
    Parameters<typeof getUnitsSummary['invoke']>[0],
    Parameters<typeof getUnitsSummary['invoke']>[1],
    Awaited<ReturnType<typeof getUnitsSummary['invoke']>>
  >;
};

export const MCP_TOOL_DESCRIPTORS = {
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
} as const satisfies ToolDescriptorEntries;

export type ToolDescriptorMap = typeof MCP_TOOL_DESCRIPTORS;
export type ToolMap = ToolDescriptorMap;
export type ToolName = keyof ToolDescriptorMap;
export type ToolDescriptorForName<TName extends ToolName> = ToolDescriptorMap[TName];

export const toolNames = ['get-changelog', 'get-changelog-latest', 'get-key-stages', 'get-key-stages-subject-assets', 'get-key-stages-subject-lessons', 'get-key-stages-subject-questions', 'get-key-stages-subject-units', 'get-lessons-assets', 'get-lessons-assets-by-type', 'get-lessons-quiz', 'get-lessons-summary', 'get-lessons-transcript', 'get-rate-limit', 'get-search-lessons', 'get-search-transcripts', 'get-sequences-assets', 'get-sequences-questions', 'get-sequences-units', 'get-subject-detail', 'get-subjects', 'get-subjects-key-stages', 'get-subjects-sequences', 'get-subjects-years', 'get-threads', 'get-threads-units', 'get-units-summary'] as const;

export function isToolName(value: unknown): value is ToolName {
  return typeof value === 'string' && value in MCP_TOOL_DESCRIPTORS;
}

export function getToolFromToolName<TName extends ToolName>(toolName: TName): ToolDescriptorForName<TName> {
  const descriptor = MCP_TOOL_DESCRIPTORS[toolName];
  if (!descriptor) {
    throw new TypeError('Unknown tool: ' + String(toolName));
  }
  return descriptor;
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
export type ToolOperationId = keyof OperationIdToToolName;
export type ToolNameForOperationId<TId extends ToolOperationId> = OperationIdToToolName[TId];
export type ToolDescriptorForOperationId<TId extends ToolOperationId> = ToolDescriptorForName<ToolNameForOperationId<TId>>;

export function isToolOperationId(value: unknown): value is ToolOperationId {
  return typeof value === 'string' && value in OPERATION_ID_TO_TOOL_NAME;
}

export function getToolNameFromOperationId<TId extends ToolOperationId>(operationId: TId): ToolNameForOperationId<TId> {
  const toolName = OPERATION_ID_TO_TOOL_NAME[operationId];
  if (!toolName) {
    throw new TypeError('Unknown operation: ' + String(operationId));
  }
  return toolName;
}

export function getToolFromOperationId<TId extends ToolOperationId>(operationId: TId): ToolDescriptorForOperationId<TId> {
  const toolName = getToolNameFromOperationId(operationId);
  return getToolFromToolName(toolName);
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
export type ToolOperationIdForName<TName extends ToolName> = ToolNameToOperationId[TName];

export function getOperationIdFromToolName<TName extends ToolName>(toolName: TName): ToolOperationIdForName<TName> {
  const operationId = TOOL_NAME_TO_OPERATION_ID[toolName];
  if (!operationId) {
    throw new TypeError('Unknown tool: ' + String(toolName));
  }
  return operationId;
}