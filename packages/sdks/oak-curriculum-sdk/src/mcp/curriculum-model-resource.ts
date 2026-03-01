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
 * @see ./curriculum-model-data.ts for the composition function
 * @see ./ontology-resource.ts for the analogous ontology resource
 */

import { composeCurriculumModelData } from './curriculum-model-data.js';

/**
 * Curriculum model resource definition for MCP registration.
 *
 * Priority 1.0 and audience ["assistant"] are MCP spec annotations
 * indicating this resource should be auto-injected for AI assistants.
 */
export const CURRICULUM_MODEL_RESOURCE = {
  name: 'curriculum-model',
  uri: 'curriculum://model',
  title: 'Oak Curriculum Model',
  description:
    'Combined curriculum orientation: domain model (key stages, subjects, entity hierarchy, property graph) and tool usage guidance (categories, workflows, tips).',
  mimeType: 'application/json' as const,
  annotations: {
    priority: 1.0,
    audience: ['assistant'] as const,
  },
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
