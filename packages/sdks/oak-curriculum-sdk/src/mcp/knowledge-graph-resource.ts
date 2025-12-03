/**
 * Knowledge Graph MCP Resource
 *
 * Exposes the knowledge graph as an MCP resource for application-controlled
 * context injection. Complements the `get-knowledge-graph` tool which is
 * model-controlled.
 *
 * @see ADR-058 for the dual-exposure pattern
 * @see knowledge-graph-data.ts for the graph data structure
 *
 * @module knowledge-graph-resource
 */

import { conceptGraph } from './knowledge-graph-data.js';

/**
 * Knowledge graph resource metadata for MCP registration.
 *
 * This resource allows MCP clients that support pre-fetching resources
 * (e.g., Claude Desktop) to inject the knowledge graph into context.
 * ChatGPT uses the tool instead.
 */
export const KNOWLEDGE_GRAPH_RESOURCE = {
  /** Resource name for MCP registration */
  name: 'knowledge-graph',

  /** Resource URI following the curriculum:// scheme */
  uri: 'curriculum://knowledge-graph',

  /** Human-readable description */
  description:
    'Oak Curriculum concept TYPE relationships for agent reasoning. Shows how curriculum concepts connect.',

  /** MIME type for JSON content */
  mimeType: 'application/json',
} as const;

/**
 * Returns the knowledge graph as a JSON string.
 *
 * Used by the MCP resource handler to serve the graph content.
 *
 * @returns JSON string representation of the knowledge graph
 */
export function getKnowledgeGraphJson(): string {
  return JSON.stringify(conceptGraph, null, 2);
}
