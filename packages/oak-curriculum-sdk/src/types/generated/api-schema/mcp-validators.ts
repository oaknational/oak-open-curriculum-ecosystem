import type { McpToolName } from './mcp-tools.js';
import { z } from 'zod';

// Import schemas object from generated Zod endpoints
import { schemas } from '../zod/endpoints.js';
/**
 * MCP Tool Validator Mapping
 * Generated from OpenAPI schema - DO NOT EDIT MANUALLY
 * 
 * Maps tool names to their corresponding Zod validators.
 * This enables runtime validation at the API boundary (ADR-032).
 * ALL mappings flow from the schema - NO HARDCODING.
 */


/**
 * Map of MCP tool names to their Zod validators
 * Used for runtime validation of API responses
 */
export const MCP_TOOL_VALIDATORS = {
  'oak-get-sequences-units': schemas.SequenceUnitsResponseSchema,
  'oak-get-lessons-transcript': schemas.TranscriptResponseSchema,
  'oak-get-search-transcripts': schemas.SearchTranscriptResponseSchema,
  'oak-get-sequences-assets': schemas.SequenceAssetsResponseSchema,
  'oak-get-key-stages-subject-assets': schemas.SubjectAssetsResponseSchema,
  'oak-get-lessons-assets': schemas.LessonAssetsResponseSchema,
  'oak-get-lessons-assets-by-type': schemas.LessonAssetResponseSchema,
  'oak-get-subjects': schemas.AllSubjectsResponseSchema,
  'oak-get-subject-detail': schemas.SubjectResponseSchema,
  'oak-get-subjects-sequences': schemas.SubjectSequenceResponseSchema,
  'oak-get-subjects-key-stages': schemas.SubjectKeyStagesResponseSchema,
  'oak-get-subjects-years': z.unknown(),
  'oak-get-key-stages': schemas.KeyStageResponseSchema,
  'oak-get-key-stages-subject-lessons': schemas.KeyStageSubjectLessonsResponseSchema,
  'oak-get-key-stages-subject-units': schemas.AllKeyStageAndSubjectUnitsResponseSchema,
  'oak-get-lessons-quiz': schemas.QuestionForLessonsResponseSchema,
  'oak-get-sequences-questions': schemas.QuestionsForSequenceResponseSchema,
  'oak-get-key-stages-subject-questions': schemas.QuestionsForKeyStageAndSubjectResponseSchema,
  'oak-get-lessons-summary': schemas.LessonSummaryResponseSchema,
  'oak-get-search-lessons': schemas.LessonSearchResponseSchema,
  'oak-get-units-summary': schemas.UnitSummaryResponseSchema,
  'oak-get-threads': schemas.AllThreadsResponseSchema,
  'oak-get-threads-units': schemas.ThreadUnitsResponseSchema,
  'oak-get-changelog': z.unknown(),
  'oak-get-changelog-latest': z.unknown(),
  'oak-get-rate-limit': schemas.RateLimitResponseSchema,
} as const;

/**
 * Helper type to extract the validated response type for a tool
 */
export type GetToolValidatedResponse<T extends McpToolName> =
  T extends keyof typeof MCP_TOOL_VALIDATORS
    ? z.infer<typeof MCP_TOOL_VALIDATORS[T]>
    : unknown;

/**
 * Validate a response for a specific tool
 * @param toolName - The MCP tool name
 * @param response - The response to validate
 * @returns The validated response
 * @throws ZodError if validation fails
 */
export function validateToolResponse<T extends McpToolName>(
  toolName: T,
  response: unknown
): GetToolValidatedResponse<T> {
  const validator = MCP_TOOL_VALIDATORS[toolName];
  if (!validator) {
    throw new Error(`No validator found for tool: ${toolName}`);
  }
  return validator.parse(response) as GetToolValidatedResponse<T>;
}
