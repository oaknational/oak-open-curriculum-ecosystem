/**
 * MCP Tool Parameters Module
 * Generated from OpenAPI schema - DO NOT EDIT MANUALLY
 */

import type { McpToolName } from './mcp-tools.js';
import { MCP_TOOLS_DATA } from './mcp-tools.js';

/**
 * Discriminated union of tool parameters
 * Each tool has its own strongly-typed parameter interface
 */
export type ToolParameters<T extends McpToolName> =
  T extends 'oak-get-sequences-units' ? {
    sequence: string;
    year?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | 'all-years';
  } :
  T extends 'oak-get-lessons-transcript' ? {
    lesson: string;
  } :
  T extends 'oak-get-search-transcripts' ? {
    q: string;
  } :
  T extends 'oak-get-sequences-assets' ? {
    sequence: string;
    year?: number;
    assetType?: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
  } :
  T extends 'oak-get-key-stages-subject-assets' ? {
    keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
    subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';
    assetType?: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
    unit?: string;
  } :
  T extends 'oak-get-lessons-assets' ? {
    lesson: string;
    assetType?: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
  } :
  T extends 'oak-get-lessons-assets-by-type' ? {
    lesson: string;
    assetType: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
  } :
  T extends 'oak-get-subjects' ? {
  } :
  T extends 'oak-get-subject-detail' ? {
    subject: string;
  } :
  T extends 'oak-get-subjects-sequences' ? {
    subject: string;
  } :
  T extends 'oak-get-subjects-key-stages' ? {
    subject: string;
  } :
  T extends 'oak-get-subjects-years' ? {
    subject: string;
  } :
  T extends 'oak-get-key-stages' ? {
  } :
  T extends 'oak-get-key-stages-subject-lessons' ? {
    keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
    subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';
    unit?: string;
    offset?: number;
    limit?: number;
  } :
  T extends 'oak-get-key-stages-subject-units' ? {
    keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
    subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';
  } :
  T extends 'oak-get-lessons-quiz' ? {
    lesson: string;
  } :
  T extends 'oak-get-sequences-questions' ? {
    sequence: string;
    year?: number;
    offset?: number;
    limit?: number;
  } :
  T extends 'oak-get-key-stages-subject-questions' ? {
    keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
    subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';
    offset?: number;
    limit?: number;
  } :
  T extends 'oak-get-lessons-summary' ? {
    lesson: string;
  } :
  T extends 'oak-get-search-lessons' ? {
    q: string;
    keyStage?: 'ks1' | 'ks2' | 'ks3' | 'ks4';
    subject?: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';
    unit?: string;
  } :
  T extends 'oak-get-units-summary' ? {
    unit: string;
  } :
  T extends 'oak-get-threads' ? {
  } :
  T extends 'oak-get-threads-units' ? {
    threadSlug: string;
  } :
  T extends 'oak-get-changelog' ? {
  } :
  T extends 'oak-get-changelog-latest' ? {
  } :
  T extends 'oak-get-rate-limit' ? {
  } :
  never;

/**
 * Type predicate to check if value is a valid parameters object
 */
function isParametersObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}

/**
 * Validate parameters for a specific tool
 * @param toolName - The MCP tool name
 * @param params - Parameters to validate
 * @returns True if parameters are valid
 */
export function validateToolParameters<T extends McpToolName>(
  toolName: T,
  params: unknown
): params is ToolParameters<T> {
  if (!isParametersObject(params)) {
    return false;
  }
  
  const tool = MCP_TOOLS_DATA[toolName];
  if (!tool) {
    return false;
  }
  
  // Check required path parameters using the validated object
  for (const paramName of tool.pathParams) {
    if (!(paramName in params)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Helper type to extract parameters for a specific tool
 */
export type GetToolParameters<T extends McpToolName> = ToolParameters<T>;

/**
 * Helper type to extract the return type for a specific tool
 * (This will be connected to Zod schemas for runtime validation)
 */
export type GetToolResponse<T extends McpToolName> = 
  T extends keyof ToolResponseMap ? ToolResponseMap[T] : unknown;

/**
 * Map of tool names to their response types
 * This will be populated with actual response types from the schema
 */
export type ToolResponseMap = {
  // This will be generated from the OpenAPI response schemas
  // For now, using 'unknown' as placeholder
  [K in McpToolName]: unknown;
}

