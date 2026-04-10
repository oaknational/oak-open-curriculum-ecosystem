/**
 * Curriculum model data composition for the get-curriculum-model tool.
 *
 * Combines the complete ontology data (domain model) with tool guidance
 * into a single response that provides agents with full orientation in
 * one call. The ontology is passed through without filtering — all
 * content in ontology-data.ts is delivered to the agent.
 *
 * @see ./aggregated-curriculum-model/ for tool definition and execution
 * @see ./ontology-data.ts for the domain model
 * @see ./tool-guidance-data.ts for tool usage guidance
 */

import type { OntologyData } from './ontology-data.js';
import { ontologyData } from './ontology-data.js';
import { toolGuidanceData } from './tool-guidance-data.js';

interface CurriculumModelData {
  readonly domainModel: OntologyData;
  readonly toolGuidance: ReturnType<typeof composeToolGuidance>;
}

/**
 * Tool guidance extracted from toolGuidanceData.
 *
 * Provides agents with an understanding of the available tools,
 * how to use them, and common workflows.
 */
function composeToolGuidance() {
  return {
    serverOverview: toolGuidanceData.serverOverview,
    toolCategories: toolGuidanceData.toolCategories,
    workflows: toolGuidanceData.workflows,
    tips: toolGuidanceData.tips,
    idFormats: toolGuidanceData.idFormats,
  };
}

/**
 * Composes the full curriculum model data for agent orientation.
 *
 * Returns the complete ontology (domain model) plus tool guidance
 * in a single response. No parameters — the full model is always
 * returned. Per-tool help is available on each tool's own description.
 *
 * @returns Composed curriculum model data
 */
export function composeCurriculumModelData(): CurriculumModelData {
  return {
    domainModel: ontologyData,
    toolGuidance: composeToolGuidance(),
  };
}
