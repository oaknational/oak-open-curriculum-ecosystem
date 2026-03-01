/**
 * Curriculum model data composition for the get-curriculum-model tool.
 *
 * Merges ontology data (domain model) and tool guidance into a single
 * response that provides agents with complete orientation in one call.
 * Explicitly excludes the synonyms section from ontology data as it
 * serves search infrastructure, not agent context.
 *
 * @see ./aggregated-curriculum-model/ for tool definition and execution
 * @see ./ontology-data.ts for the full ontology (including synonyms)
 * @see ./tool-guidance-data.ts for tool usage guidance
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ontologyData } from './ontology-data.js';
import { toolGuidanceData } from './tool-guidance-data.js';
import { getToolSpecificHelp } from './aggregated-help/help-content.js';

interface ComposeCurriculumModelOptions {
  readonly toolName?: string;
}

type StructuredContent = NonNullable<CallToolResult['structuredContent']>;

interface CurriculumModelBase {
  readonly domainModel: ReturnType<typeof composeDomainModel>;
  readonly toolGuidance: ReturnType<typeof composeToolGuidance>;
}

interface CurriculumModelWithHelp extends CurriculumModelBase {
  readonly toolSpecificHelp: StructuredContent;
}

type CurriculumModelData = CurriculumModelBase | CurriculumModelWithHelp;

/**
 * Domain model extracted from ontology data, excluding search synonyms.
 *
 * This provides agents with the curriculum structure, entity hierarchy,
 * property graph, threads, UK education context, and canonical URLs
 * needed to understand the Oak domain. Synonyms are excluded because
 * they serve Elasticsearch query expansion, not agent context.
 *
 * Fields are explicitly destructured from ontologyData. When new fields
 * are added to the ontology, they must be explicitly included here to
 * appear in the curriculum model response.
 */
function composeDomainModel() {
  const {
    version,
    generatedAt,
    purpose,
    notice,
    officialDocs,
    relatedResources,
    curriculumStructure,
    entityHierarchy,
    threads,
    ukEducationContext,
    canonicalUrls,
    workflows,
    idFormats,
    propertyGraph,
  } = ontologyData;

  return {
    version,
    generatedAt,
    purpose,
    notice,
    officialDocs,
    relatedResources,
    curriculumStructure,
    entityHierarchy,
    threads,
    ukEducationContext,
    canonicalUrls,
    workflows,
    idFormats,
    propertyGraph,
  };
}

/**
 * Tool guidance extracted from toolGuidanceData.
 *
 * Provides agents with an understanding of the available tools,
 * how to use them, and common workflows.
 */
function composeToolGuidance() {
  const { serverOverview, toolCategories, workflows, tips, idFormats } = toolGuidanceData;

  return {
    serverOverview,
    toolCategories,
    workflows,
    tips,
    idFormats,
  };
}

/**
 * Composes the full curriculum model data for agent orientation.
 *
 * Merges ontology domain model (excluding synonyms) with tool guidance
 * into a single response. Optionally includes tool-specific help when
 * a tool name is provided.
 *
 * @param options - Optional configuration with toolName for tool-specific help
 * @returns Composed curriculum model data
 */
export function composeCurriculumModelData(
  options?: ComposeCurriculumModelOptions,
): CurriculumModelData {
  const domainModel = composeDomainModel();
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
