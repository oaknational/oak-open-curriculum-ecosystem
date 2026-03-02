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

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { OntologyData } from './ontology-data.js';
import { ontologyData } from './ontology-data.js';
import { toolGuidanceData } from './tool-guidance-data.js';
import { getToolSpecificHelp } from './tool-help-lookup.js';

interface ComposeCurriculumModelOptions {
  readonly toolName?: string;
}

type StructuredContent = NonNullable<CallToolResult['structuredContent']>;

interface CurriculumModelBase {
  readonly domainModel: OntologyData;
  readonly toolGuidance: ReturnType<typeof composeToolGuidance>;
}

interface CurriculumModelWithHelp extends CurriculumModelBase {
  readonly toolSpecificHelp: StructuredContent;
}

type CurriculumModelData = CurriculumModelBase | CurriculumModelWithHelp;

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
 * in a single response. Optionally includes tool-specific help when
 * a tool name is provided.
 *
 * @param options - Optional configuration with toolName for tool-specific help
 * @returns Composed curriculum model data
 */
export function composeCurriculumModelData(
  options?: ComposeCurriculumModelOptions,
): CurriculumModelData {
  const domainModel: OntologyData = ontologyData;
  const toolGuidance = composeToolGuidance();

  const base = { domainModel, toolGuidance };

  if (options?.toolName) {
    const helpResult = getToolSpecificHelp(options.toolName);
    if (!helpResult.isError && helpResult.structuredContent) {
      return { ...base, toolSpecificHelp: helpResult.structuredContent };
    }
  }

  return base;
}
