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
} from './types/generated/api-schema/path-parameters';

export type { DocPaths as OpenApiPathsMap, DocSubject, DocKeyStage } from './types/doc-bridges';

// Configuration
export { apiUrl, apiSchemaUrl } from './config/index';

// Create a convenience export for createApiClient (alias for createOakClient)
export { createOakClient as createApiClient } from './client/index';

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
} from './types/generated/api-schema/path-parameters';

export { schemaBase as schema } from './types/generated/api-schema/api-schema-base';
export { PATH_OPERATIONS, OPERATIONS_BY_ID } from './types/generated/api-schema/path-parameters';
export type { PathOperation, OperationId } from './types/generated/api-schema/path-parameters';
export type { KeyStage, Subject } from './types/generated/api-schema/path-parameters';

export {
  validateRequest,
  validateCurriculumResponse,
  validateSearchResponse,
  isValidationFailure,
  isValidationSuccess,
} from './validation/index';
export type {
  ValidationResult,
  ValidationIssue,
  ValidatedClientOptions,
  HttpMethod,
} from './validation/index';
export { MCP_TOOLS, isToolName } from './types/generated/api-schema/mcp-tools/index';
export { getToolFromToolName } from './types/generated/api-schema/mcp-tools/lib';
export type { AllToolNames } from './types/generated/api-schema/mcp-tools/index';
export { executeToolCall, McpToolError, McpParameterError } from './mcp/execute-tool-call';
export type { ToolExecutionResult } from './mcp/execute-tool-call';
export {
  zodFromToolInputJsonSchema,
  zodRawShapeFromToolInputJsonSchema,
} from './mcp/zod-input-schema';

// Generated URL helpers (deterministic canonical URLs)
export {
  generateCanonicalUrlWithContext,
  generateCanonicalUrl,
  CONTENT_TYPE_PREFIXES,
  extractSlug,
  type ContentType,
} from './types/generated/api-schema/routing/url-helpers';

// OpenAI Connector exports (SDK-generated facade helpers)
export {
  executeOpenAiToolCall,
  OPENAI_CONNECTOR_TOOL_DEFS,
  isOpenAiToolName,
  type OpenAiToolName,
  type OpenAiSearchArgs,
  type OpenAiFetchArgs,
} from './types/generated/openai-connector/index';

// Universal MCP tooling exports
export {
  listUniversalTools,
  isUniversalToolName,
  createUniversalToolExecutor,
  type UniversalToolName,
  type UniversalToolExecutorDependencies,
  type UniversalToolListEntry,
} from './mcp/universal-tools';

// Hybrid search index types (SDK-owned to centralise downstream usage)
export type { SearchIndex } from './types/search-index.js';
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
} from './types/generated/search/index';

export {
  QueryParserRequestSchema,
  QueryParserResponseSchema,
  isQueryParserResponse,
  QUERY_PARSER_INTENT_ENUM,
} from './types/generated/query-parser/index';
export type {
  QueryParserRequest,
  QueryParserResponse,
  QueryParserIntent,
} from './types/generated/query-parser/index';

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
} from './types/generated/observability/index';
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
} from './types/generated/admin/index';

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
} from './types/generated/search';
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
} from './types/search-response-guards';
export {
  SequenceFacetUnitSchema,
  SequenceFacetSchema,
  SearchFacetsSchema,
} from './types/generated/zod/search/output/index';

export {
  describeKeyStageAllowed,
  describeSubjectAllowed,
  standardiseKeyStage,
  standardiseSubject,
} from './types/generated/api-schema/mcp-tools/synonyms';
