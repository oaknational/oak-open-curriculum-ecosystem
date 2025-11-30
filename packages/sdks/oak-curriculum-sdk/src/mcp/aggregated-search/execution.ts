/**
 * Execution logic for the aggregated search tool.
 *
 * This module provides the runSearchTool function which executes
 * parallel searches across lessons and transcripts endpoints.
 *
 * @module aggregated-search/execution
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import {
  formatData,
  formatError,
  toErrorMessage,
  extractExecutionData,
} from '../universal-tool-shared.js';
import type { UniversalToolExecutorDependencies } from '../universal-tool-shared.js';
import type { SearchArgs } from './types.js';

/**
 * Executes the search aggregated tool.
 *
 * Runs get-search-lessons and get-search-transcripts in parallel,
 * combining results into a single response. Both searches use the
 * same query string, but only lessons search supports filtering.
 *
 * @param args - Validated search arguments
 * @param deps - Dependencies including the MCP tool executor
 * @returns CallToolResult with combined search results or error
 *
 * @example
 * ```typescript
 * const result = await runSearchTool(
 *   { q: 'photosynthesis', keyStage: 'ks3', subject: 'science' },
 *   { executeMcpTool }
 * );
 * ```
 */
export async function runSearchTool(
  args: SearchArgs,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  // Build arguments for lessons search (supports filtering)
  const lessonsArgs = {
    q: args.q,
    ...(args.keyStage !== undefined ? { keyStage: args.keyStage } : {}),
    ...(args.subject !== undefined ? { subject: args.subject } : {}),
    ...(args.unit !== undefined ? { unit: args.unit } : {}),
  };

  // Transcripts search only supports query string
  const transcriptsArgs = {
    q: args.q,
  };

  // Execute both searches (could be parallelised in future)
  const lessonsResult = await deps.executeMcpTool('get-search-lessons', lessonsArgs);
  const transcriptsResult = await deps.executeMcpTool('get-search-transcripts', transcriptsArgs);

  // Extract and validate lessons result
  const lessonsData = extractExecutionData(lessonsResult);
  if (!lessonsData.ok) {
    return formatError(toErrorMessage(lessonsData.error));
  }

  // Extract and validate transcripts result
  const transcriptsData = extractExecutionData(transcriptsResult);
  if (!transcriptsData.ok) {
    return formatError(toErrorMessage(transcriptsData.error));
  }

  // Combine results into unified response
  return formatData({
    status: 200,
    data: {
      q: args.q,
      keyStage: args.keyStage,
      subject: args.subject,
      unit: args.unit,
      lessonsStatus: lessonsData.status,
      lessons: lessonsData.data,
      transcriptsStatus: transcriptsData.status,
      transcripts: transcriptsData.data,
    },
  });
}
