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
 * .agent/directives/schema-first-execution.md for details.
 */

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

export const MCP_TOOL_ENTRIES = [
  { name: 'get-changelog', descriptor: getChangelog, operationId: 'changelog-changelog' },
  { name: 'get-changelog-latest', descriptor: getChangelogLatest, operationId: 'changelog-latest' },
  { name: 'get-key-stages', descriptor: getKeyStages, operationId: 'getKeyStages-getKeyStages' },
  { name: 'get-key-stages-subject-assets', descriptor: getKeyStagesSubjectAssets, operationId: 'getAssets-getSubjectAssets' },
  { name: 'get-key-stages-subject-lessons', descriptor: getKeyStagesSubjectLessons, operationId: 'getKeyStageSubjectLessons-getKeyStageSubjectLessons' },
  { name: 'get-key-stages-subject-questions', descriptor: getKeyStagesSubjectQuestions, operationId: 'getQuestions-getQuestionsForKeyStageAndSubject' },
  { name: 'get-key-stages-subject-units', descriptor: getKeyStagesSubjectUnits, operationId: 'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits' },
  { name: 'get-lessons-assets', descriptor: getLessonsAssets, operationId: 'getAssets-getLessonAssets' },
  { name: 'get-lessons-assets-by-type', descriptor: getLessonsAssetsByType, operationId: 'getAssets-getLessonAsset' },
  { name: 'get-lessons-quiz', descriptor: getLessonsQuiz, operationId: 'getQuestions-getQuestionsForLessons' },
  { name: 'get-lessons-summary', descriptor: getLessonsSummary, operationId: 'getLessons-getLesson' },
  { name: 'get-lessons-transcript', descriptor: getLessonsTranscript, operationId: 'getLessonTranscript-getLessonTranscript' },
  { name: 'get-rate-limit', descriptor: getRateLimit, operationId: 'getRateLimit-getRateLimit' },
  { name: 'get-search-lessons', descriptor: getSearchLessons, operationId: 'getLessons-searchByTextSimilarity' },
  { name: 'get-search-transcripts', descriptor: getSearchTranscripts, operationId: 'searchTranscripts-searchTranscripts' },
  { name: 'get-sequences-assets', descriptor: getSequencesAssets, operationId: 'getAssets-getSequenceAssets' },
  { name: 'get-sequences-questions', descriptor: getSequencesQuestions, operationId: 'getQuestions-getQuestionsForSequence' },
  { name: 'get-sequences-units', descriptor: getSequencesUnits, operationId: 'getSequences-getSequenceUnits' },
  { name: 'get-subject-detail', descriptor: getSubjectDetail, operationId: 'getSubjects-getSubject' },
  { name: 'get-subjects', descriptor: getSubjects, operationId: 'getSubjects-getAllSubjects' },
  { name: 'get-subjects-key-stages', descriptor: getSubjectsKeyStages, operationId: 'getSubjects-getSubjectKeyStages' },
  { name: 'get-subjects-sequences', descriptor: getSubjectsSequences, operationId: 'getSubjects-getSubjectSequence' },
  { name: 'get-subjects-years', descriptor: getSubjectsYears, operationId: 'getSubjects-getSubjectYears' },
  { name: 'get-threads', descriptor: getThreads, operationId: 'getThreads-getAllThreads' },
  { name: 'get-threads-units', descriptor: getThreadsUnits, operationId: 'getThreads-getThreadUnits' },
  { name: 'get-units-summary', descriptor: getUnitsSummary, operationId: 'getUnits-getUnit' },
] as const;

const TOOL_ENTRY_BY_NAME = {
  'get-changelog': MCP_TOOL_ENTRIES[0],
  'get-changelog-latest': MCP_TOOL_ENTRIES[1],
  'get-key-stages': MCP_TOOL_ENTRIES[2],
  'get-key-stages-subject-assets': MCP_TOOL_ENTRIES[3],
  'get-key-stages-subject-lessons': MCP_TOOL_ENTRIES[4],
  'get-key-stages-subject-questions': MCP_TOOL_ENTRIES[5],
  'get-key-stages-subject-units': MCP_TOOL_ENTRIES[6],
  'get-lessons-assets': MCP_TOOL_ENTRIES[7],
  'get-lessons-assets-by-type': MCP_TOOL_ENTRIES[8],
  'get-lessons-quiz': MCP_TOOL_ENTRIES[9],
  'get-lessons-summary': MCP_TOOL_ENTRIES[10],
  'get-lessons-transcript': MCP_TOOL_ENTRIES[11],
  'get-rate-limit': MCP_TOOL_ENTRIES[12],
  'get-search-lessons': MCP_TOOL_ENTRIES[13],
  'get-search-transcripts': MCP_TOOL_ENTRIES[14],
  'get-sequences-assets': MCP_TOOL_ENTRIES[15],
  'get-sequences-questions': MCP_TOOL_ENTRIES[16],
  'get-sequences-units': MCP_TOOL_ENTRIES[17],
  'get-subject-detail': MCP_TOOL_ENTRIES[18],
  'get-subjects': MCP_TOOL_ENTRIES[19],
  'get-subjects-key-stages': MCP_TOOL_ENTRIES[20],
  'get-subjects-sequences': MCP_TOOL_ENTRIES[21],
  'get-subjects-years': MCP_TOOL_ENTRIES[22],
  'get-threads': MCP_TOOL_ENTRIES[23],
  'get-threads-units': MCP_TOOL_ENTRIES[24],
  'get-units-summary': MCP_TOOL_ENTRIES[25],
} as const;

type ToolEntryByNameMap = typeof TOOL_ENTRY_BY_NAME;
export type ToolEntry = ToolEntryByNameMap[keyof ToolEntryByNameMap];
export type ToolName = keyof ToolEntryByNameMap;
export type ToolOperationId = ToolEntry['operationId'];
export type ToolEntryForName<TName extends ToolName> = ToolEntryByNameMap[TName];
export type ToolDescriptors = { readonly [E in ToolEntry as E['name']]: E['descriptor'] };
export type ToolDescriptorMap = ToolDescriptors;
export type ToolMap = ToolDescriptorMap;
export type ToolDescriptorForName<TName extends ToolName> = ToolEntryForName<TName>['descriptor'];
export type ToolOperationIdForName<TName extends ToolName> = ToolEntryForName<TName>['operationId'];
type ToolNameToOperationIdMap = { readonly [E in ToolEntry as E['name']]: E['operationId'] };
type OperationIdToToolNameMap = Readonly<Record<ToolOperationId, ToolName>>;

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
} satisfies ToolDescriptors;

export const toolNames = Object.freeze(MCP_TOOL_ENTRIES.map((entry) => entry.name)) satisfies readonly ToolName[];

export function isToolName(value: unknown): value is ToolName {
  return typeof value === 'string' && value in MCP_TOOL_DESCRIPTORS;
}

export function getToolEntryFromToolName<TName extends ToolName>(toolName: TName): ToolEntryForName<TName> {
  const entry = TOOL_ENTRY_BY_NAME[toolName];
  if (!entry) {
    throw new TypeError('Unknown tool: ' + String(toolName));
  }
  return entry;
}

export function getToolFromToolName<TName extends ToolName>(toolName: TName): ToolDescriptorForName<TName> {
  const entry = getToolEntryFromToolName(toolName);
  return entry.descriptor;
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
} as const satisfies OperationIdToToolNameMap;

export type ToolNameForOperationId<TId extends ToolOperationId> = OperationIdToToolNameMap[TId];
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
} as const satisfies ToolNameToOperationIdMap;

export function getOperationIdFromToolName<TName extends ToolName>(toolName: TName): ToolOperationIdForName<TName> {
  const operationId = TOOL_NAME_TO_OPERATION_ID[toolName];
  if (!operationId) {
    throw new TypeError('Unknown tool: ' + String(toolName));
  }
  return operationId;
}