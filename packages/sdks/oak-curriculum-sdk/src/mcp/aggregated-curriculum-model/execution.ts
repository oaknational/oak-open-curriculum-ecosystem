/**
 * Validation and execution for the get-curriculum-model tool.
 *
 * This module handles input validation and dispatches to the
 * curriculum model data composition function.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { composeCurriculumModelData } from '../curriculum-model-data.js';
import { formatToolResponse } from '../universal-tool-shared.js';

/**
 * Runs the get-curriculum-model tool, returning combined orientation.
 *
 * Returns both the curriculum domain model and tool usage guidance
 * in a single response. Takes no parameters.
 *
 * @returns CallToolResult containing curriculum model as structured JSON
 */
export function runCurriculumModelTool(): CallToolResult {
  const data = composeCurriculumModelData();

  return formatToolResponse({
    summary: 'Oak Curriculum model loaded. Includes domain model and tool guidance.',
    data,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-curriculum-model',
    annotationsTitle: 'Oak Curriculum Overview',
  });
}
