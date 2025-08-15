/**
 * Response validation functions using generated Zod schemas
 * Maps API operations to their response validators
 */

import type { z } from 'zod';
import type { ValidationResult, HttpMethod } from './types';
import { PATH_OPERATIONS } from '../types/generated/api-schema/path-parameters';
import { parseWithSchema } from './types';
import { schemas } from '../types/generated/zod/schemas';

/**
 * Map of operation IDs to their response schemas
 * Built from the generated Zod schemas
 */
const responseSchemaMap = new Map<string, z.ZodSchema>();

// Map operation IDs to their response schemas
responseSchemaMap.set(
  'getLessonTranscript-getLessonTranscript:200',
  schemas.TranscriptResponseSchema,
);
responseSchemaMap.set(
  'searchTranscripts-searchTranscripts:200',
  schemas.SearchTranscriptResponseSchema,
);
responseSchemaMap.set('getSequences-getSequenceUnits:200', schemas.SequenceUnitsResponseSchema);
responseSchemaMap.set('getAssets-getSequenceAssets:200', schemas.SequenceAssetsResponseSchema);
responseSchemaMap.set('getAssets-getSubjectAssets:200', schemas.SubjectAssetsResponseSchema);
responseSchemaMap.set('getAssets-getLessonAssets:200', schemas.LessonAssetsResponseSchema);
responseSchemaMap.set('getAssets-getLessonAsset:200', schemas.LessonAssetResponseSchema);
responseSchemaMap.set('getSubjects-getAllSubjects:200', schemas.AllSubjectsResponseSchema);
responseSchemaMap.set('getSubjects-getSubject:200', schemas.SubjectResponseSchema);
responseSchemaMap.set('getSubjects-getSubjectSequence:200', schemas.SubjectSequenceResponseSchema);
responseSchemaMap.set(
  'getSubjects-getSubjectKeyStages:200',
  schemas.SubjectKeyStagesResponseSchema,
);
responseSchemaMap.set('getKeyStages-getKeyStages:200', schemas.KeyStageResponseSchema);
responseSchemaMap.set(
  'getKeyStageSubjectLessons-getKeyStageSubjectLessons:200',
  schemas.KeyStageSubjectLessonsResponseSchema,
);
responseSchemaMap.set(
  'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits:200',
  schemas.AllKeyStageAndSubjectUnitsResponseSchema,
);
responseSchemaMap.set(
  'getQuestions-getQuestionsForLessons:200',
  schemas.QuestionForLessonsResponseSchema,
);
responseSchemaMap.set(
  'getQuestions-getQuestionsForSequence:200',
  schemas.QuestionsForSequenceResponseSchema,
);
responseSchemaMap.set(
  'getQuestions-getQuestionsForKeyStageAndSubject:200',
  schemas.QuestionsForKeyStageAndSubjectResponseSchema,
);
responseSchemaMap.set('getLessons-getLesson:200', schemas.LessonSummaryResponseSchema);
responseSchemaMap.set('getLessons-searchByTextSimilarity:200', schemas.LessonSearchResponseSchema);
responseSchemaMap.set('getUnits-getUnit:200', schemas.UnitSummaryResponseSchema);
responseSchemaMap.set('getThreads-getAllThreads:200', schemas.AllThreadsResponseSchema);
responseSchemaMap.set('getThreads-getThreadUnits:200', schemas.ThreadUnitsResponseSchema);
responseSchemaMap.set('getRateLimit-getRateLimit:200', schemas.RateLimitResponseSchema);

// Error schemas for common status codes
// TODO: Generate error schemas from OpenAPI spec
// responseSchemaMap.set('*:401', schemas.error_UNAUTHORIZED);
// responseSchemaMap.set('*:403', schemas.error_FORBIDDEN);
// responseSchemaMap.set('*:500', schemas.error_INTERNAL_SERVER_ERROR);

/**
 * Find the operation ID for a given path and method
 */
function findOperationId(path: string, method: HttpMethod): string | undefined {
  const operation = PATH_OPERATIONS.find((op) => op.path === path && op.method === method);
  return operation?.operationId;
}

/**
 * Parse and validate response data
 */
function parseResponse(
  schema: z.ZodSchema,
  response: unknown,
): ValidationResult<Record<string, unknown>> {
  return parseWithSchema(schema, response);
}

/**
 * Validates response data for an API operation
 * @param path - The API path template (e.g., '/lessons/{lesson}/transcript')
 * @param method - The HTTP method
 * @param statusCode - The HTTP response status code
 * @param response - The response data to validate
 * @returns ValidationResult with validated response or validation issues
 */
export function validateResponse(
  path: string,
  method: HttpMethod,
  statusCode: number,
  response: unknown,
): ValidationResult<Record<string, unknown>> {
  const operationId = findOperationId(path, method);

  if (!operationId) {
    return {
      ok: false,
      issues: [
        {
          path: [],
          message: `Unknown operation: ${method.toUpperCase()} ${path}`,
          code: 'UNKNOWN_OPERATION',
        },
      ],
    };
  }

  // Try to find schema for specific operation and status code
  let schema = responseSchemaMap.get(`${operationId}:${String(statusCode)}`);

  // If not found, try generic error schemas
  if (!schema && statusCode >= 400) {
    schema = responseSchemaMap.get(`*:${String(statusCode)}`);
  }

  if (!schema) {
    return {
      ok: false,
      issues: [
        {
          path: [],
          message: `No schema for status code ${String(statusCode)} in operation ${operationId}`,
          code: 'NO_SCHEMA_FOR_STATUS',
        },
      ],
    };
  }

  return parseResponse(schema, response);
}
