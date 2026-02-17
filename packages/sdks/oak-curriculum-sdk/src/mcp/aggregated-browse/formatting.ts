/**
 * Formatting functions for the browse-curriculum tool.
 *
 * Produces human-readable summaries from the SearchFacets data
 * returned by the Search SDK's `fetchSequenceFacets()` method.
 */

import type { SearchFacets } from '../../types/generated/search/facets.js';
import type { BrowseArgs } from './types.js';

/**
 * Builds a human-readable summary of the facet data.
 *
 * @param facets - Facet data from the Search SDK
 * @param args - The validated browse arguments (optional filters)
 * @returns A summary string describing what was found
 *
 * @example
 * ```typescript
 * buildBrowseSummary({ sequences: [...] }, { subject: 'maths' });
 * // "Found 5 curriculum programmes for maths"
 * ```
 */
export function buildBrowseSummary(facets: SearchFacets, args: BrowseArgs): string {
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
