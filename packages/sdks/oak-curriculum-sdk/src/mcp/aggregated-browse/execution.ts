/**
 * Execution logic for the browse-curriculum tool.
 *
 * Calls `fetchSequenceFacets()` on the search retrieval service to return
 * structured facet data showing available subjects, key stages, sequences,
 * units, and lesson counts.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import {
  formatError,
  formatOptimizedResult,
  type UniversalToolExecutorDependencies,
} from '../universal-tool-shared.js';
import type { SearchFacets } from '../../types/generated/search/facets.js';
import type { BrowseArgs } from './types.js';

/** Error message when search retrieval service is not configured. */
const NOT_CONFIGURED_MESSAGE =
  'Curriculum browsing is not configured. Elasticsearch credentials are required. ' +
  'All other tools remain available.';

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
 * Builds a human-readable summary of the facet data.
 */
function buildBrowseSummary(facets: SearchFacets, args: BrowseArgs): string {
  const count = facets.sequences.length;
  const filterParts: string[] = [];

  if (args.subject !== undefined) {
    filterParts.push(args.subject);
  }
  if (args.keyStage !== undefined) {
    filterParts.push(args.keyStage.toUpperCase());
  }

  const filterText = filterParts.length > 0 ? ` for ${filterParts.join(' ')}` : '';
  const word = count === 1 ? 'programme' : 'programmes';

  if (count === 0) {
    return `No curriculum programmes found${filterText}. Try broader filters or no filters to see everything.`;
  }

  return `Found ${String(count)} curriculum ${word}${filterText}`;
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
  if (deps.searchRetrieval === undefined) {
    return formatError(NOT_CONFIGURED_MESSAGE);
  }

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

  return formatOptimizedResult({
    summary,
    fullData: {
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
