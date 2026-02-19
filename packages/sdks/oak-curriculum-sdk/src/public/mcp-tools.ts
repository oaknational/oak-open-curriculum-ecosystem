/**
 * Oak Curriculum SDK - MCP Tools Entry Point
 *
 * This module provides all MCP (Model Context Protocol) tooling including:
 * - Tool definitions and registries
 * - Tool execution and validation
 * - Universal tools (search, fetch, help, ontology)
 * - Documentation resources and prompts
 *
 * Also re-exports core client types needed by MCP applications.
 */

// Re-export core client types needed by MCP apps
export { createOakClient, createOakPathBasedClient } from '../client/index.js';
export type { OakApiClient, OakApiPathBasedClient } from '../client/index.js';

export {
  toolNames,
  isToolName,
  isToolOperationId,
  getToolFromToolName,
  getToolFromOperationId,
  getToolNameFromOperationId,
  getOperationIdFromToolName,
  listAllToolDescriptors,
  type ToolOperationId,
  type ToolOperationIdForName,
  type ToolDescriptorForName,
  type ToolDescriptorForOperationId,
  type ToolDescriptor,
  type ToolMap,
  type ToolName,
  type ToolNameForOperationId,
  type ToolArgs,
  type ToolArgsForOperationId,
  type ToolDescriptors,
  type ToolInvoke,
  type ToolNameFromOperationId,
  type ToolResult,
  type ToolResultForOperationId,
  type RegisteredToolEntries,
} from '../types/generated/api-schema/mcp-tools/index.js';

export {
  SCOPES_SUPPORTED,
  type ScopesSupported,
} from '../types/generated/api-schema/mcp-tools/generated/data/scopes-supported.js';

export {
  createStubToolExecutionAdapter,
  listAvailableStubTools,
  hasStubForTool,
  assertStubAvailable,
} from '../mcp/stub-tool-executor.js';
export type { StubbedToolName } from '../types/generated/api-schema/mcp-tools/generated/stubs/index.js';
export type {
  SecurityScheme,
  SecuritySchemeType,
  NoAuthScheme,
  OAuth2Scheme,
} from '../types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.js';

export { executeToolCall, McpToolError, McpParameterError } from '../mcp/execute-tool-call.js';
export type { ToolExecutionResult } from '../mcp/execute-tool-call.js';

export {
  zodFromToolInputJsonSchema,
  zodRawShapeFromToolInputJsonSchema,
} from '../mcp/zod-input-schema.js';

export {
  listUniversalTools,
  isUniversalToolName,
  isAggregatedToolName,
  createUniversalToolExecutor,
  AGGREGATED_TOOL_DEFS,
  type UniversalToolName,
  type UniversalToolExecutorDependencies,
  type UniversalToolListEntry,
} from '../mcp/universal-tools/index.js';

export {
  DOCUMENTATION_RESOURCES,
  getGettingStartedMarkdown,
  getToolsReferenceMarkdown,
  getWorkflowsMarkdown,
  getDocumentationContent,
  type DocumentationResource,
} from '../mcp/documentation-resources.js';

export {
  ONTOLOGY_RESOURCE,
  getOntologyJson,
  type OntologyResource,
} from '../mcp/ontology-resource.js';

export { MCP_PROMPTS, getPromptMessages, type McpPrompt } from '../mcp/mcp-prompts.js';

export { SERVER_INSTRUCTIONS } from '../mcp/prerequisite-guidance.js';

export { WIDGET_URI } from '../mcp/widget-constants.js';
// Ontology data (single source of truth for domain knowledge)
export { ontologyData } from '../mcp/ontology-data.js';
export type { OntologyData } from '../mcp/ontology-data.js';

// Property graph data (concept TYPE relationships)
export { conceptGraph } from '../mcp/property-graph-data.js';
export type {
  ConceptGraph,
  ConceptId,
  ConceptCategory,
  ConceptEdge,
} from '../mcp/property-graph-data.js';

// Search retrieval service interface (dependency inversion for search SDK)
export type { SearchRetrievalService } from '../mcp/search-retrieval-types.js';

// Stub search retrieval for stub mode (no real ES client)
export { createStubSearchRetrieval } from '../mcp/search-retrieval-stub.js';

// Synonym utilities (ES export, lookup, phrase detection)
export {
  buildElasticsearchSynonyms,
  buildSynonymLookup,
  buildPhraseVocabulary,
  serialiseElasticsearchSynonyms,
  type ElasticsearchSynonymEntry,
  type ElasticsearchSynonymSet,
} from '../mcp/synonym-export.js';
