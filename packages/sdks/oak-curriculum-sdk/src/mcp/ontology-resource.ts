/**
 * Curriculum ontology resource for MCP server.
 *
 * This module provides the curriculum ontology as an MCP resource, enabling
 * application-controlled context injection for MCP clients that support
 * pre-fetching resources.
 *
 * The ontology data comes from ontology-data.ts which provides the static
 * curriculum domain model including key stages, subjects, entity hierarchy,
 * threads, and tool workflows.
 *
 * @remarks
 * This resource complements the `get-ontology` tool which provides the same
 * data via a model-controlled interface. The dual exposure pattern allows:
 * - Tools (get-ontology): For ChatGPT and agents that request context on-demand
 * - Resources (curriculum://ontology): For clients that pre-inject context
 *
 * @see `./ontology-data.ts` for the source ontology data
 * @see ADR-058 for the context grounding strategy
 */

import { ontologyData } from './ontology-data.js';

/**
 * Ontology resource definition for MCP registration.
 *
 * Resources are application-controlled primitives that can be surfaced
 * by MCP clients in sidebars, documentation panes, or pre-injected into
 * conversation context.
 */
export interface OntologyResource {
  /** Unique resource identifier (used in registration) */
  readonly name: string;
  /** Resource URI following curriculum:// scheme */
  readonly uri: string;
  /** Human-readable title */
  readonly title: string;
  /** Description shown in resource listings */
  readonly description: string;
  /** MIME type (always application/json for ontology) */
  readonly mimeType: 'application/json';
}

/**
 * Curriculum ontology resource definition.
 *
 * This resource exposes the complete curriculum domain model as JSON,
 * including:
 * - Curriculum structure (key stages, phases, subjects)
 * - Entity hierarchy (subject → sequence → unit → lesson)
 * - Threads (conceptual progression strands)
 * - Tool workflows (how to combine tools for common tasks)
 * - UK education context
 *
 * @example
 * ```typescript
 * // Register in MCP server
 * server.setRequestHandler(ListResourcesRequestSchema, async () => ({
 *   resources: [ONTOLOGY_RESOURCE]
 * }));
 * ```
 */
export const ONTOLOGY_RESOURCE: OntologyResource = {
  name: 'curriculum-ontology',
  uri: 'curriculum://ontology',
  title: 'Oak Curriculum Ontology',
  description:
    'Domain model for Oak curriculum including key stages, subjects, entity hierarchy, threads, and tool workflows.',
  mimeType: 'application/json',
};

/**
 * Generates the ontology as a JSON string for resource responses.
 *
 * Returns the complete ontology data from ontology-data.ts as a
 * formatted JSON string suitable for MCP resource/read responses.
 *
 * @returns JSON string representation of the curriculum ontology
 *
 * @example
 * ```typescript
 * // Handle resource read request
 * if (uri === 'curriculum://ontology') {
 *   return {
 *     contents: [{
 *       uri,
 *       mimeType: 'application/json',
 *       text: getOntologyJson()
 *     }]
 *   };
 * }
 * ```
 */
export function getOntologyJson(): string {
  return JSON.stringify(ontologyData, null, 2);
}
