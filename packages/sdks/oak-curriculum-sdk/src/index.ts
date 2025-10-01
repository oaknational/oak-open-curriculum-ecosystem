/**
 * Oak Curriculum SDK
 *
 * TypeScript SDK for accessing Oak National Academy's Curriculum API.
 * This SDK provides a type-safe client using openapi-fetch with generated types.
 */

// Main client factories
export { createOakClient, createOakPathBasedClient } from './client/index.js';
export type { OakApiClient, OakApiPathBasedClient } from './client/index.js';

// Generated types
export type { paths } from './types/generated/api-schema/api-paths-types';
export type { components } from './types/generated/api-schema/api-paths-types';
/**
 * Public aliases for key generated types to appear clearly in documentation.
 */
export type { paths as OakApiPaths } from './types/generated/api-schema/api-paths-types';
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
} from './validation/index.js';
export { MCP_TOOLS, isToolName } from './types/generated/api-schema/mcp-tools/index.js';
export { getToolFromToolName } from './types/generated/api-schema/mcp-tools/lib.js';
export type { AllToolNames } from './types/generated/api-schema/mcp-tools/index';
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

// OpenAI Connector exports (SDK-generated facade helpers)
export {
  executeOpenAiToolCall,
  OPENAI_CONNECTOR_TOOL_DEFS,
  isOpenAiToolName,
  type OpenAiToolName,
  type OpenAiSearchArgs,
  type OpenAiFetchArgs,
} from './types/generated/openai-connector/index.js';

// Universal MCP tooling exports
export {
  listUniversalTools,
  isUniversalToolName,
  createUniversalToolExecutor,
  type UniversalToolName,
  type UniversalToolExecutorDependencies,
  type UniversalToolListEntry,
} from './mcp/universal-tools.js';

// Export the type-safe object helpers
export {
  typeSafeKeys,
  typeSafeValues,
  typeSafeEntries,
  typeSafeFromEntries,
  typeSafeGet,
  typeSafeSet,
  typeSafeHas,
  typeSafeHasOwn,
  typeSafeOwnKeys,
  isPlainObject,
  getOwnString,
} from './types/helpers.js';

// Hybrid search index types (SDK-owned to centralise downstream usage)
export type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
  SearchSubjectSlug,
  SearchCompletionSuggestPayload,
} from './types/search-index.js';
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
export type {
  SearchLessonSummary,
  SearchUnitSummary,
  SearchSubjectSequences,
} from './types/search-response-guards.js';

export type {
  LessonSummaryResponseSchema,
  UnitSummaryResponseSchema,
  SubjectSequenceResponseSchema,
} from './types/search-response-guards.js';
export {
  lessonSummarySchema,
  unitSummarySchema,
  subjectSequencesSchema,
} from './types/search-response-guards.js';
export {
  SequenceFacetUnitSchema,
  SequenceFacetSchema,
  SearchFacetsSchema,
} from './types/generated/zod/search/output/index.js';
export {
  isUnitsGrouped,
  isLessonGroups,
  isTranscriptResponse,
  isLessonSummary,
  isUnitSummary,
  isSubjectSequences,
} from './types/search-response-guards.js';
