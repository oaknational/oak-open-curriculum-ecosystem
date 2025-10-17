// Main client factories
export { createOakClient, createOakPathBasedClient } from './client/index.js';
export type { OakApiClient, OakApiPathBasedClient } from './client/index.js';

// Generated types
export type { paths } from './types/generated/api-schema/api-paths-types.js';
export type { components } from './types/generated/api-schema/api-paths-types.js';
/**
 * Public aliases for key generated types to appear clearly in documentation.
 */
export type { paths as OakApiPaths } from './types/generated/api-schema/api-paths-types.js';
export type {
  Subject as OakSubject,
  KeyStage as OakKeyStage,
} from './types/generated/api-schema/path-parameters.js';

export type { DocPaths as OpenApiPathsMap, DocSubject, DocKeyStage } from './types/doc-bridges.js';

// Configuration
export { apiUrl, apiSchemaUrl } from './config/index.js';

// Create a convenience export for createApiClient (alias for createOakClient)
export { createOakClient as createApiClient } from './client/index.js';

// Type guards and allowed-values constants (additive public API exports)
export {
  // Guards
  isValidPath,
  isAllowedMethod,
  isKeyStage,
  isSubject,
  isAssetType,
  isValidParameterType,
  isValidPathParameter,
  // Allowed values / helpers
  PATHS,
  KEY_STAGES,
  SUBJECTS,
  ASSET_TYPES,
  VALID_PATHS_BY_PARAMETERS,
} from './types/generated/api-schema/path-parameters.js';

export { schemaBase as schema } from './types/generated/api-schema/api-schema-base.js';
export { PATH_OPERATIONS, OPERATIONS_BY_ID } from './types/generated/api-schema/path-parameters.js';
export type { PathOperation, OperationId } from './types/generated/api-schema/path-parameters.js';
export type { KeyStage, Subject } from './types/generated/api-schema/path-parameters.js';

export {
  validateRequest,
  validateCurriculumResponse,
  validateSearchResponse,
  isValidationFailure,
  isValidationSuccess,
} from './validation/index.js';
export type {
  ValidationResult,
  ValidationIssue,
  ValidatedClientOptions,
  HttpMethod,
} from './validation/index';
export {
  toolNames,
  isToolName,
  isToolOperationId,
  getToolFromToolName,
  getToolFromOperationId,
  getToolNameFromOperationId,
  getOperationIdFromToolName,
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
} from './types/generated/api-schema/mcp-tools/index.js';
export {
  McpToolRegistry,
  attachMcpHandlers,
  createMcpToolRegistry,
} from './types/generated/api-schema/mcp-tools/generated/runtime/lib.js';
export { executeToolCall, McpToolError, McpParameterError } from './mcp/execute-tool-call.js';
export type { ToolExecutionResult } from './mcp/execute-tool-call.js';
export {
  zodFromToolInputJsonSchema,
  zodRawShapeFromToolInputJsonSchema,
} from './mcp/zod-input-schema.js';

// Generated URL helpers (deterministic canonical URLs)
export {
  generateCanonicalUrlWithContext,
  generateCanonicalUrl,
  CONTENT_TYPE_PREFIXES,
  extractSlug,
  type ContentType,
} from './types/generated/api-schema/routing/url-helpers.js';

// Universal MCP tooling exports
export {
  listUniversalTools,
  isUniversalToolName,
  createUniversalToolExecutor,
  type UniversalToolName,
  type UniversalToolExecutorDependencies,
  type UniversalToolListEntry,
} from './mcp/universal-tools.js';

// Hybrid search index types (SDK-owned to centralise downstream usage)
export {
  DEFAULT_INCLUDE_FACETS,
  SearchStructuredRequestSchema,
  isSearchStructuredRequest,
  SearchNaturalLanguageRequestSchema,
  isSearchNaturalLanguageRequest,
  SearchParsedQuerySchema,
  isSearchParsedQuery,
  SEARCH_SCOPES,
  SEARCH_SCOPES_WITH_ALL,
  isSearchScope,
  isSearchScopeWithAll,
  DEFAULT_SUGGESTION_CACHE,
  SearchSuggestionContextSchema,
  SearchSuggestionItemSchema,
  SearchSuggestionResponseSchema,
  SearchSuggestionRequestSchema,
  isSearchSuggestionRequest,
  isSearchSuggestionResponse,
  SearchLessonsResponseSchema,
  SearchUnitsResponseSchema,
  SearchSequencesResponseSchema,
  SearchMultiScopeResponseSchema,
  createSearchLessonsResponse,
  createSearchUnitsResponse,
  createSearchSequencesResponse,
  createSearchMultiScopeResponse,
} from './types/generated/search/index.js';

export {
  QueryParserRequestSchema,
  QueryParserResponseSchema,
  isQueryParserResponse,
  QUERY_PARSER_INTENT_ENUM,
} from './types/generated/query-parser/index.js';
export type {
  QueryParserRequest,
  QueryParserResponse,
  QueryParserIntent,
} from './types/generated/query-parser/index.js';

export {
  ZERO_HIT_SCOPES,
  ZeroHitScopeSchema,
  ZeroHitScopeBreakdownSchema,
  ZeroHitSummarySchema,
  ZeroHitEventSchema,
  ZeroHitTelemetrySchema,
  createZeroHitEvent,
  createZeroHitSummary,
  createZeroHitTelemetry,
  summariseZeroHitEvents,
  type ZeroHitScope,
  type ZeroHitScopeBreakdown,
  type ZeroHitSummary,
  type ZeroHitEvent,
  type ZeroHitTelemetry,
} from './types/generated/observability/index.js';
export {
  ADMIN_STREAM_ACTIONS,
  AdminStreamActionSchema,
  AdminStreamSuccessSchema,
  AdminStreamErrorSchema,
  AdminStreamFixtureSchema,
  createAdminStreamFixture,
  createAdminStreamEmptyFixture,
  createAdminStreamErrorFixture,
  createAdminStreamFixtureMap,
  type AdminStreamAction,
  type AdminStreamSuccessFixture,
  type AdminStreamErrorFixture,
  type AdminStreamFixture,
  type AdminStreamFixtureMap,
} from './types/generated/admin/index.js';

export type {
  SearchStructuredRequest,
  SearchStructuredScope,
  SearchNaturalLanguageRequest,
  SearchParsedQuery,
  SearchParsedIntent,
  SearchScope,
  SearchScopeWithAll,
  SearchSuggestionItem,
  SearchSuggestionResponse,
  SearchSuggestionRequest,
  SequenceFacetUnit,
  SequenceFacet,
  SearchFacets,
  SearchLessonResult,
  SearchLessonsResponse,
  SearchLessonsSuggestions,
  SearchLessonsSuggestionCache,
  SearchUnitResult,
  SearchUnitsResponse,
  SearchSequenceResult,
  SearchSequencesResponse,
  SearchMultiScopeBucket,
  SearchMultiScopeResponse,
} from './types/generated/search/index.js';
export {
  lessonSummarySchema,
  unitSummarySchema,
  subjectSequencesSchema,
  isUnitsGrouped,
  isLessonGroups,
  isTranscriptResponse,
  isLessonSummary,
  isUnitSummary,
  isSubjectSequences,
  type LessonSummaryResponseSchema,
  type UnitSummaryResponseSchema,
  type SubjectSequenceResponseSchema,
  type SearchLessonSummary,
  type SearchUnitSummary,
  type SearchSubjectSequences,
} from './types/search-response-guards.js';
export {
  SequenceFacetUnitSchema,
  SequenceFacetSchema,
  SearchFacetsSchema,
} from './types/generated/zod/search/output/index.js';
export {
  SearchCompletionSuggestPayloadSchema,
  SearchLessonsIndexDocSchema,
  SearchUnitsIndexDocSchema,
  SearchUnitRollupDocSchema,
  SearchSequenceIndexDocSchema,
  isSearchCompletionSuggestPayload,
  isSearchLessonsIndexDoc,
  isSearchUnitsIndexDoc,
  isSearchUnitRollupDoc,
  isSearchSequenceIndexDoc,
} from './types/generated/search/index.js';
export type {
  SearchCompletionSuggestPayload,
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
  SearchSubjectSlug,
} from './types/generated/search/index.js';
