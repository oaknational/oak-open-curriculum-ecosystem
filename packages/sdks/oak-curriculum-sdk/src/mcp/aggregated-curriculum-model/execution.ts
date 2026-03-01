/**
 * Validation and execution for the get-curriculum-model tool.
 *
 * This module handles input validation and dispatches to the
 * curriculum model data composition function.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { composeCurriculumModelData } from '../curriculum-model-data.js';
import { formatToolResponse } from '../universal-tool-shared.js';

interface GetCurriculumModelInput {
  readonly tool_name?: string;
}

/**
 * Type guard for valid curriculum model input.
 *
 * Uses proper type narrowing without type assertions.
 */
function isValidCurriculumModelInput(value: unknown): value is GetCurriculumModelInput {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if ('tool_name' in value) {
    if (typeof value.tool_name !== 'string') {
      return false;
    }
  }
  return true;
}

type CurriculumModelValidationResult =
  | { readonly ok: true; readonly value: GetCurriculumModelInput }
  | { readonly ok: false; readonly message: string };

/**
 * Validates input for the get-curriculum-model tool.
 *
 * @param input - Raw input from tool invocation
 * @returns Validation result with typed value or error message
 */
export function validateCurriculumModelArgs(input: unknown): CurriculumModelValidationResult {
  if (input === undefined || input === null) {
    return { ok: true, value: {} };
  }
  if (!isValidCurriculumModelInput(input)) {
    return { ok: false, message: 'Invalid input: expected object with optional tool_name string' };
  }
  return { ok: true, value: input };
}

/**
 * Runs the get-curriculum-model tool, returning combined orientation.
 *
 * Returns both the curriculum domain model and tool usage guidance
 * in a single response. If tool_name is provided, also includes
 * tool-specific help.
 *
 * @param input - Optional input parameters
 * @returns CallToolResult containing curriculum model as structured JSON
 */
export function runCurriculumModelTool(input: GetCurriculumModelInput): CallToolResult {
  const data = composeCurriculumModelData(
    input.tool_name ? { toolName: input.tool_name } : undefined,
  );

  const hasTool = input.tool_name ? ` Includes help for: ${input.tool_name}.` : '';

  return formatToolResponse({
    summary: `Oak Curriculum model loaded. Includes domain model and tool guidance.${hasTool}`,
    data,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-curriculum-model',
    annotationsTitle: 'Get Curriculum Model',
  });
}
