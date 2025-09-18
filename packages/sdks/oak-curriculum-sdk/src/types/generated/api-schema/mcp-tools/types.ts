/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Type definitions and guards for MCP tools
 */

import {
  type Tool as BaseTool,
} from '@modelcontextprotocol/sdk/types.js';
import type { ZodSchema } from 'zod';


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

const toolNameToOperationId = {
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

export type OperationIdToToolNameMap = typeof operationIdToToolName;
export type AllOperationIds = keyof OperationIdToToolNameMap;
export type AllToolNames = OperationIdToToolNameMap[AllOperationIds]["toolName"];
export type ToolNameToOperationIdMap = typeof toolNameToOperationId;

/**
* Type guard for operation IDs
*/
function isOperationId(operationId: string): operationId is AllOperationIds { return operationId in operationIdToToolName; }

/**
* Type guard for tool names
*/
export function isToolName(value: unknown): value is AllToolNames { return typeof value === "string" && value in toolNameToOperationId; }

export function getToolNameFromOperationId(operationId: string): AllToolNames {
  if (!isOperationId(operationId)) {
    const allowed: AllOperationIds[] = [];
    for (const key in operationIdToToolName) {
      if (key in operationIdToToolName) {
        allowed.push(key as AllOperationIds);
      }
    }
    throw new TypeError(`Invalid operation ID: ${operationId}. Allowed values: ${allowed.join(", ")}`);
  }
  return operationIdToToolName[operationId].toolName;
}

/**
 * OakMcp types that extend @modelcontextprotocol/sdk types for compatibility
 * Uses Zod schemas for validation instead of custom validation logic
 */

export interface ZodValidator<T> {
  validate(data: unknown): { ok: true; data: T } | { ok: false; message: string };
}

export interface ToolHandler<ToolInput, ToolOutput> {
  handle(args: ToolInput): Promise<ToolOutput>;
}

type BaseInputSchema = BaseTool['inputSchema'];
type BaseOutputSchema = BaseTool['outputSchema'];

export interface OakInputSchemaBase extends BaseInputSchema {
  readonly type: 'object';
  readonly zodSchema: ZodSchema;
  readonly validate: (args: unknown) => { ok: true; data: unknown } | { ok: false; message: string };
}

export type OakOutputSchemaBase = BaseOutputSchema & {
  readonly type: 'object';
  readonly zodSchema: ZodSchema;
  readonly validate: (result: unknown) => { ok: true; data: unknown } | { ok: false; message: string };
}

export interface OakMcpToolBase<ToolInput, ToolOutput> extends BaseTool {
  readonly inputSchema: BaseTool["inputSchema"];
  readonly outputSchema: BaseTool["outputSchema"];
  readonly zodInputSchema: ZodSchema<ToolInput>;
  readonly zodOutputSchema: ZodSchema<ToolOutput>;
  readonly validateInput: (args: unknown) => { ok: true; data: ToolInput } | { ok: false; message: string };
  readonly validateOutput: (result: unknown) => { ok: true; data: ToolOutput } | { ok: false; message: string };
  readonly handle: (args: ToolInput) => Promise<ToolOutput>;
}

/**
 * Dynamic mapping from operation IDs to Zod schemas
 * Generated at compile time from OpenAPI schema and Zod endpoints
 */
export const operationIdToZodSchemas = {
  'getSequences-getSequenceUnits': {
    toolName: 'get-sequences-units',
    operationId: 'getSequences-getSequenceUnits',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getLessonTranscript-getLessonTranscript': {
    toolName: 'get-lessons-transcript',
    operationId: 'getLessonTranscript-getLessonTranscript',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'searchTranscripts-searchTranscripts': {
    toolName: 'get-search-transcripts',
    operationId: 'searchTranscripts-searchTranscripts',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getAssets-getSequenceAssets': {
    toolName: 'get-sequences-assets',
    operationId: 'getAssets-getSequenceAssets',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getAssets-getSubjectAssets': {
    toolName: 'get-key-stages-subject-assets',
    operationId: 'getAssets-getSubjectAssets',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getAssets-getLessonAssets': {
    toolName: 'get-lessons-assets',
    operationId: 'getAssets-getLessonAssets',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getAssets-getLessonAsset': {
    toolName: 'get-lessons-assets-by-type',
    operationId: 'getAssets-getLessonAsset',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getSubjects-getAllSubjects': {
    toolName: 'get-subjects',
    operationId: 'getSubjects-getAllSubjects',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getSubjects-getSubject': {
    toolName: 'get-subject-detail',
    operationId: 'getSubjects-getSubject',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getSubjects-getSubjectSequence': {
    toolName: 'get-subjects-sequences',
    operationId: 'getSubjects-getSubjectSequence',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getSubjects-getSubjectKeyStages': {
    toolName: 'get-subjects-key-stages',
    operationId: 'getSubjects-getSubjectKeyStages',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getSubjects-getSubjectYears': {
    toolName: 'get-subjects-years',
    operationId: 'getSubjects-getSubjectYears',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getKeyStages-getKeyStages': {
    toolName: 'get-key-stages',
    operationId: 'getKeyStages-getKeyStages',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getKeyStageSubjectLessons-getKeyStageSubjectLessons': {
    toolName: 'get-key-stages-subject-lessons',
    operationId: 'getKeyStageSubjectLessons-getKeyStageSubjectLessons',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits': {
    toolName: 'get-key-stages-subject-units',
    operationId: 'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getQuestions-getQuestionsForLessons': {
    toolName: 'get-lessons-quiz',
    operationId: 'getQuestions-getQuestionsForLessons',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getQuestions-getQuestionsForSequence': {
    toolName: 'get-sequences-questions',
    operationId: 'getQuestions-getQuestionsForSequence',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getQuestions-getQuestionsForKeyStageAndSubject': {
    toolName: 'get-key-stages-subject-questions',
    operationId: 'getQuestions-getQuestionsForKeyStageAndSubject',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getLessons-getLesson': {
    toolName: 'get-lessons-summary',
    operationId: 'getLessons-getLesson',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getLessons-searchByTextSimilarity': {
    toolName: 'get-search-lessons',
    operationId: 'getLessons-searchByTextSimilarity',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getUnits-getUnit': {
    toolName: 'get-units-summary',
    operationId: 'getUnits-getUnit',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getThreads-getAllThreads': {
    toolName: 'get-threads',
    operationId: 'getThreads-getAllThreads',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getThreads-getThreadUnits': {
    toolName: 'get-threads-units',
    operationId: 'getThreads-getThreadUnits',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'changelog-changelog': {
    toolName: 'get-changelog',
    operationId: 'changelog-changelog',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'changelog-latest': {
    toolName: 'get-changelog-latest',
    operationId: 'changelog-latest',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
  'getRateLimit-getRateLimit': {
    toolName: 'get-rate-limit',
    operationId: 'getRateLimit-getRateLimit',
    // TODO: Add dynamic schema resolution based on endpoint analysis
    inputSchema: null, // Will be resolved from endpoint parameters
    outputSchema: null, // Will be resolved from endpoint response
  },
} as const;

export type OperationIdToZodSchemasMap = typeof operationIdToZodSchemas;
export type ZodSchemaInfo = OperationIdToZodSchemasMap[keyof OperationIdToZodSchemasMap];

/**
 * Dynamic response schema mapping from endpoints
 * Generated at compile time from the actual endpoints array
 */
import { endpoints } from '../../zod/endpoints.js';

function getResponseSchemaForEndpoint(method: string, path: string): ZodSchema {
  const endpoint = endpoints.find((ep: { method: string; path: string; response: ZodSchema }) => ep.method === method && ep.path === path);
  if (!endpoint) {
    throw new Error(`No endpoint found for ${method} ${path}`);
  }
  return endpoint.response;
}

export { getResponseSchemaForEndpoint };