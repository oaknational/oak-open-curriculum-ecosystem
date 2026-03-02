/**
 * Thread progressions resource for MCP server.
 *
 * Provides the complete thread progression graph (ordered unit sequences
 * within curriculum threads) as an MCP resource, enabling
 * application-controlled context injection for clients that support
 * pre-fetching resources.
 *
 * This resource complements the `get-thread-progressions` tool which provides
 * the same data via a model-controlled interface. The dual exposure pattern:
 * - Tools (get-thread-progressions): For agents that request on-demand
 * - Resources (curriculum://thread-progressions): For clients that pre-inject context
 *
 * Priority 0.5 indicates supplementary reference data — valuable for deep
 * reasoning about learning progressions and thread paths, but not required
 * for basic agent orientation (which is served by curriculum://model at 1.0).
 *
 * @see ./aggregated-thread-progressions.ts for the tool definition
 * @see ADR-058 for the context grounding strategy
 * @see ADR-086 for the extraction methodology
 */

import { threadProgressionGraph } from '@oaknational/sdk-codegen/vocab-data';

/**
 * Thread progressions resource definition for MCP registration.
 *
 * @example
 * ```typescript
 * const { name, uri, ...metadata } = THREAD_PROGRESSIONS_RESOURCE;
 * server.registerResource(name, uri, metadata, handler);
 * ```
 */
export const THREAD_PROGRESSIONS_RESOURCE = {
  name: 'thread-progressions',
  uri: 'curriculum://thread-progressions',
  title: 'Oak Curriculum Thread Progressions',
  description:
    'Ordered unit sequences within curriculum threads showing conceptual progressions across years. Use for learning path recommendations and progression queries.',
  mimeType: 'application/json' as const,
  annotations: {
    priority: 0.5,
    audience: ['assistant'] satisfies ('user' | 'assistant')[],
  },
};

/**
 * Generates the thread progressions as a JSON string for resource responses.
 *
 * Returns the complete thread progression graph (threads, stats) as a
 * formatted JSON string for MCP resource/read.
 *
 * @returns JSON string representation of the thread progressions
 */
export function getThreadProgressionsJson(): string {
  return JSON.stringify(threadProgressionGraph, null, 2);
}
