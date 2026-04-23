/**
 * Execution logic for the browse-curriculum tool.
 *
 * Calls `fetchSequenceFacets()` on the search retrieval service to return
 * structured facet data showing available subjects, key stages, sequences,
 * units, and lesson counts.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import {
  formatError,
  formatToolResponse,
  resolveUniversalToolLogger,
  type UniversalToolExecutorDependencies,
} from '../universal-tool-shared.js';
import type { SearchFacets } from '@oaknational/sdk-codegen/search';
import type { BrowseArgs } from './types.js';
import { buildBrowseSummary } from './formatting.js';

/**
 * Type guard for SearchFacets.
 */
function isSearchFacets(value: unknown): value is SearchFacets {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'sequences' in value && Array.isArray(value.sequences);
}

/**
 * Executes the browse-curriculum tool.
 *
 * @param args - Validated browse arguments (optional subject, keyStage)
 * @param deps - Dependencies including searchRetrieval service
 * @returns CallToolResult with formatted facet data or error
 */
export async function runBrowseTool(
  args: BrowseArgs,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  const logger = resolveUniversalToolLogger(deps);
  logger.debug('mcp-tool.browse-curriculum.execute', {
    toolName: 'browse-curriculum',
    subject: args.subject,
    keyStage: args.keyStage,
  });

  const result = await deps.searchRetrieval.fetchSequenceFacets({
    subject: args.subject,
    keyStage: args.keyStage,
  });

  if (!result.ok) {
    return formatError(`Browse error: ${result.error.message} (${result.error.type})`);
  }

  if (!isSearchFacets(result.value)) {
    return formatError('Unexpected response shape from fetchSequenceFacets');
  }

  const summary = buildBrowseSummary(result.value, args);

  return formatToolResponse({
    summary,
    data: {
      facets: result.value,
      filters: {
        subject: args.subject,
        keyStage: args.keyStage,
      },
    },
    timestamp: Date.now(),
    status: 'success',
    toolName: 'browse-curriculum',
    annotationsTitle: 'Browse Curriculum',
  });
}
