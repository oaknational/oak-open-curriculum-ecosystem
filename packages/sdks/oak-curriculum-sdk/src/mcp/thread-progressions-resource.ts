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

import type { ThreadProgressionGraph } from '@oaknational/sdk-codegen/vocab';
import { threadProgressionGraph } from '@oaknational/sdk-codegen/vocab-data';
import type { GraphSurfaceConfig } from './graph-resource-factory.js';
import { createGraphResource, createGraphJsonGetter } from './graph-resource-factory.js';

/**
 * Shared configuration for the thread progressions MCP surface.
 *
 * Used by both the resource definition and the tool definition
 * (in aggregated-thread-progressions.ts) to ensure consistency.
 */
export const THREAD_PROGRESSIONS_CONFIG: GraphSurfaceConfig<ThreadProgressionGraph> = {
  name: 'thread-progressions',
  title: 'Oak Curriculum Thread Progressions',
  description:
    'Ordered unit sequences within curriculum threads showing conceptual progressions across years. Use for learning path recommendations and progression queries.',
  uriSegment: 'thread-progressions',
  sourceData: threadProgressionGraph,
  summary: `Thread progression graph loaded. Contains ${String(threadProgressionGraph.stats.threadCount)} threads across ${String(threadProgressionGraph.stats.subjectsCovered.length)} subjects with ordered unit sequences.`,
};

/**
 * Thread progressions resource definition for MCP registration.
 *
 * @example
 * ```typescript
 * const { name, uri, ...metadata } = THREAD_PROGRESSIONS_RESOURCE;
 * server.registerResource(name, uri, metadata, handler);
 * ```
 */
export const THREAD_PROGRESSIONS_RESOURCE = createGraphResource(THREAD_PROGRESSIONS_CONFIG);

/**
 * Generates the thread progressions as a JSON string for resource responses.
 *
 * Returns the complete thread progression graph (threads, stats) as a
 * formatted JSON string for MCP resource/read.
 *
 * @returns JSON string representation of the thread progressions
 */
export const getThreadProgressionsJson = createGraphJsonGetter(THREAD_PROGRESSIONS_CONFIG);
