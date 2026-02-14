/**
 * Concept brief descriptions for SVG node tooltips.
 *
 * Imports from the SDK knowledge-graph-data.ts - the SINGLE SOURCE OF TRUTH.
 * Node IDs use the format `node-\{conceptId\}`.
 *
 */

import { conceptGraph } from '@oaknational/curriculum-sdk/public/mcp-tools';

/**
 * Map of node ID to brief description.
 * Built from SDK conceptGraph at import time.
 */
const CONCEPT_BRIEFS: Readonly<Record<string, string>> = Object.fromEntries(
  conceptGraph.concepts.map((c) => [`node-${c.id}`, c.brief]),
);

/**
 * Gets the brief description for a node ID.
 * Returns undefined if no brief is found.
 */
export function getConceptBrief(nodeId: string): string | undefined {
  return CONCEPT_BRIEFS[nodeId];
}
