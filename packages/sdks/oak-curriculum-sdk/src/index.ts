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
// Generated URL helpers (deterministic canonical URLs)
export {
  generateCanonicalUrlWithContext,
  generateCanonicalUrl,
  CONTENT_TYPE_PREFIXES,
  extractSlug,
  type ContentType,
} from './types/generated/api-schema/routing/url-helpers.js';

// MCP tools and universal executors
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
  McpToolRegistry,
  attachMcpHandlers,
  createMcpToolRegistry,
  executeToolCall,
  McpToolError,
  McpParameterError,
  type ToolExecutionResult,
  createStubToolExecutionAdapter,
  listAvailableStubTools,
  hasStubForTool,
  assertStubAvailable,
  type StubbedToolName,
  zodFromToolInputJsonSchema,
  zodRawShapeFromToolInputJsonSchema,
  listUniversalTools,
  isUniversalToolName,
  createUniversalToolExecutor,
  type UniversalToolName,
  type UniversalToolExecutorDependencies,
  type UniversalToolListEntry,
} from './public/mcp-tools.js';

// Hybrid search, query parser, observability, and admin exports
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
  QueryParserRequestSchema,
  QueryParserResponseSchema,
  isQueryParserResponse,
  QUERY_PARSER_INTENT_ENUM,
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
  ADMIN_STREAM_ACTIONS,
  AdminStreamActionSchema,
  AdminStreamSuccessSchema,
  AdminStreamErrorSchema,
  AdminStreamFixtureSchema,
  createAdminStreamFixture,
  createAdminStreamEmptyFixture,
  createAdminStreamErrorFixture,
  createAdminStreamFixtureMap,
  lessonSummarySchema,
  unitSummarySchema,
  subjectSequencesSchema,
  isUnitsGrouped,
  isLessonGroups,
  isTranscriptResponse,
  isLessonSummary,
  isUnitSummary,
  isSubjectSequences,
  SequenceFacetUnitSchema,
  SequenceFacetSchema,
  SearchFacetsSchema,
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
  type QueryParserRequest,
  type QueryParserResponse,
  type QueryParserIntent,
  type ZeroHitScope,
  type ZeroHitScopeBreakdown,
  type ZeroHitSummary,
  type ZeroHitEvent,
  type ZeroHitTelemetry,
  type AdminStreamAction,
  type AdminStreamSuccessFixture,
  type AdminStreamErrorFixture,
  type AdminStreamFixture,
  type AdminStreamFixtureMap,
  type SearchStructuredRequest,
  type SearchStructuredScope,
  type SearchNaturalLanguageRequest,
  type SearchParsedQuery,
  type SearchParsedIntent,
  type SearchScope,
  type SearchScopeWithAll,
  type SearchSuggestionItem,
  type SearchSuggestionResponse,
  type SearchSuggestionRequest,
  type SearchFacets,
  type SequenceFacet,
  type SequenceFacetUnit,
  type SearchLessonsResponse,
  type SearchUnitsResponse,
  type SearchSequencesResponse,
  type SearchLessonsSuggestions,
  type SearchLessonsSuggestionCache,
  type SearchLessonResult,
  type SearchUnitResult,
  type SearchSequenceResult,
  type SearchMultiScopeBucket,
  type SearchMultiScopeResponse,
  type SearchCompletionSuggestPayload,
  type SearchLessonsIndexDoc,
  type SearchUnitsIndexDoc,
  type SearchUnitRollupDoc,
  type SearchSequenceIndexDoc,
  type SearchSubjectSlug,
  type LessonSummaryResponseSchema,
  type UnitSummaryResponseSchema,
  type SubjectSequenceResponseSchema,
  type SearchLessonSummary,
  type SearchUnitSummary,
  type SearchSubjectSequences,
} from './public/search.js';
