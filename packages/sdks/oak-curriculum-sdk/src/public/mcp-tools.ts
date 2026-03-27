/**
 * Oak Curriculum SDK - MCP Tools Entry Point
 *
 * This module provides all MCP (Model Context Protocol) tooling including:
 * - Tool definitions and registries
 * - Tool execution and validation
 * - Universal tools (aggregated tools combining multiple API calls)
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
} from '@oaknational/sdk-codegen/mcp-tools';

export { SCOPES_SUPPORTED, type ScopesSupported } from '@oaknational/sdk-codegen/mcp-tools';
export { UndocumentedResponseError } from '@oaknational/sdk-codegen/mcp-tools';

export {
  createStubToolExecutionAdapter,
  listAvailableStubTools,
  hasStubForTool,
  assertStubAvailable,
} from '../mcp/stub-tool-executor.js';
export type { StubbedToolName } from '@oaknational/sdk-codegen/mcp-tools';
export type {
  SecurityScheme,
  SecuritySchemeType,
  NoAuthScheme,
  OAuth2Scheme,
} from '@oaknational/sdk-codegen/mcp-tools';

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
  generatedToolRegistry,
  toRegistrationConfig,
  toProtocolEntry,
  AGGREGATED_TOOL_DEFS,
  type GeneratedToolRegistry,
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
  CURRICULUM_MODEL_RESOURCE,
  getCurriculumModelJson,
} from '../mcp/curriculum-model-resource.js';

export {
  PREREQUISITE_GRAPH_RESOURCE,
  getPrerequisiteGraphJson,
} from '../mcp/prerequisite-graph-resource.js';

export {
  THREAD_PROGRESSIONS_RESOURCE,
  getThreadProgressionsJson,
} from '../mcp/thread-progressions-resource.js';

export { MCP_PROMPTS, getPromptMessages, type McpPrompt } from '../mcp/mcp-prompts.js';

export { SERVER_INSTRUCTIONS } from '../mcp/prerequisite-guidance.js';

export { WIDGET_URI } from '../mcp/widget-constants.js';
// Ontology data (single source of truth for domain knowledge)
export { ontologyData } from '../mcp/ontology-data.js';
export type { OntologyData } from '../mcp/ontology-data.js';

// Property graph data (concept TYPE relationships)
export { conceptGraph } from '@oaknational/sdk-codegen/vocab';
export type {
  ConceptGraph,
  ConceptId,
  ConceptCategory,
  ConceptEdge,
} from '@oaknational/sdk-codegen/vocab';

// Search retrieval service interface (dependency inversion for search SDK)
export type { SearchRetrievalService } from '../mcp/search-retrieval-types.js';

// Stub search retrieval for stub mode (no real ES client)
export { createStubSearchRetrieval } from '../mcp/search-retrieval-stub.js';

// Asset download proxy — HMAC token signing for secure download URLs
export {
  createDownloadSignature,
  validateDownloadSignature,
  deriveSigningSecret,
} from '../mcp/aggregated-asset-download/index.js';

// Re-export schema-derived asset type guard for app-layer validation (ADR-030)
export { isAssetType } from '@oaknational/sdk-codegen/api-schema';

// Synonym utilities moved to @oaknational/sdk-codegen/synonyms (ADR-108 F7 completion)
