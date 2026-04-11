/**
 * Curriculum model resource for MCP server.
 *
 * Provides the combined curriculum model (domain model + tool guidance)
 * as an MCP resource, enabling application-controlled context injection
 * for MCP clients that support pre-fetching resources.
 *
 * This resource complements the `get-curriculum-model` tool which provides
 * the same data via a model-controlled interface. The dual exposure pattern:
 * - Tools (get-curriculum-model): For ChatGPT and agents that request on-demand
 * - Resources (curriculum://model): For clients that pre-inject context
 *
 * @remarks
 * **This is the ONLY resource that agents must always load first.** It
 * provides the domain orientation that enables all other tools and resources.
 * All other graph surfaces (prerequisite, thread progressions, misconception)
 * are strictly optional and should be loaded only when the conversation needs
 * them — they are supplementary context at priority 0.5, not prerequisites.
 *
 * This resource is intentionally NOT produced by the graph resource factory
 * (graph-resource-factory.ts). It composes two distinct data sources
 * (ontology domain model + tool guidance) via `composeCurriculumModelData()`,
 * and serves as the priority 1.0 orientation resource. This is a
 * fundamentally different responsibility from the supplementary graph
 * surfaces which each expose a single generated data source.
 *
 * @see ./curriculum-model-data.ts for the composition function
 * @see ./graph-resource-factory.ts for the factory that produces other graph surfaces
 * @see ADR-058 for the context grounding strategy
 */

import { composeCurriculumModelData } from './curriculum-model-data.js';
import type { SourceAttribution } from '@oaknational/sdk-codegen/mcp-tools';
import { OAK_API_ATTRIBUTION } from './source-attribution.js';

/**
 * Curriculum model resource definition for MCP registration.
 *
 * Priority 1.0 and audience ["assistant"] are MCP spec annotations
 * indicating this resource should be auto-injected for AI assistants.
 */
export const CURRICULUM_MODEL_RESOURCE: {
  readonly name: string;
  readonly uri: string;
  readonly title: string;
  readonly description: string;
  readonly mimeType: 'application/json';
  readonly annotations: {
    readonly priority: number;
    readonly audience: ('user' | 'assistant')[];
  };
  readonly _meta: { readonly attribution: SourceAttribution };
} = {
  name: 'curriculum-model',
  uri: 'curriculum://model',
  title: 'Oak Curriculum Model',
  description:
    'Combined curriculum orientation: domain model (key stages, subjects, entity hierarchy, property graph) and tool usage guidance (categories, workflows, tips).',
  mimeType: 'application/json' as const,
  annotations: {
    priority: 1.0,
    audience: ['assistant'] satisfies ('user' | 'assistant')[],
  },
  _meta: { attribution: OAK_API_ATTRIBUTION },
};

/**
 * Generates the curriculum model as a JSON string for resource responses.
 *
 * Returns the composed curriculum model data (domain model + tool guidance,
 * excluding synonyms) as a formatted JSON string for MCP resource/read.
 *
 * @returns JSON string representation of the curriculum model
 */
export function getCurriculumModelJson(): string {
  return JSON.stringify(composeCurriculumModelData(), null, 2);
}
