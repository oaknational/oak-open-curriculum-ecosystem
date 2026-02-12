/**
 * Oak Curriculum SDK - Core Entry Point
 *
 * This module provides the core client and types for interacting with the
 * Oak National Academy curriculum API.
 *
 * ## Additional Entry Points
 *
 * For specialised functionality, import from dedicated entry points:
 *
 * - **MCP Tools**: `@oaknational/oak-curriculum-sdk/public/mcp-tools`
 *   Model Context Protocol tooling for AI integrations
 *
 * - **Search**: `@oaknational/oak-curriculum-sdk/public/search`
 *   Semantic search schemas, validators, and types
 *
 * This separation improves tree-shaking and makes dependencies explicit.
 */

// ============================================================================
// Client Factories
// ============================================================================

export {
  createOakClient,
  createOakPathBasedClient,
  createOakBaseClient,
  BaseApiClient,
} from './client/index.js';
export type { OakApiClient, OakApiPathBasedClient, OakClientConfig } from './client/index.js';

/** @deprecated Use createOakClient instead */
export { createOakClient as createApiClient } from './client/index.js';

// ============================================================================
// Generated Types from OpenAPI Schema
// ============================================================================

export type { paths } from './types/generated/api-schema/api-paths-types.js';
export type { components } from './types/generated/api-schema/api-paths-types.js';

/** Public aliases for documentation clarity */
export type { paths as OakApiPaths } from './types/generated/api-schema/api-paths-types.js';
export type {
  Subject as OakSubject,
  KeyStage as OakKeyStage,
} from './types/generated/api-schema/path-parameters.js';

export type { DocPaths as OpenApiPathsMap, DocSubject, DocKeyStage } from './types/doc-bridges.js';

// ============================================================================
// Configuration
// ============================================================================

export { apiUrl, apiSchemaUrl } from './config/index.js';

// Rate limiting and retry configuration
export type { RateLimitConfig } from './config/rate-limit-config.js';
export type { RetryConfig, StatusCodeMaxRetries } from './config/retry-config.js';
export type { RateLimitTracker, RateLimitInfo } from './client/middleware/rate-limit-tracker.js';
export { DEFAULT_RATE_LIMIT_CONFIG } from './config/rate-limit-config.js';
export { DEFAULT_RETRY_CONFIG } from './config/retry-config.js';

// ============================================================================
// Path Parameters and Type Guards
// ============================================================================

export {
  isValidPath,
  isAllowedMethod,
  isKeyStage,
  isSubject,
  isAssetType,
  isValidParameterType,
  isValidPathParameter,
  PATHS,
  KEY_STAGES,
  SUBJECTS,
  ASSET_TYPES,
  VALID_PATHS_BY_PARAMETERS,
  PATH_OPERATIONS,
  OPERATIONS_BY_ID,
} from './types/generated/api-schema/path-parameters.js';

export type {
  PathOperation,
  OperationId,
  KeyStage,
  Subject,
} from './types/generated/api-schema/path-parameters.js';

export { schemaBase as schema } from './types/generated/api-schema/api-schema-base.js';

// ============================================================================
// Subject Hierarchy (ADR-101)
// ============================================================================

export {
  SUBJECT_TO_PARENT,
  ALL_SUBJECTS,
  KS4_SCIENCE_VARIANTS,
  PARENT_TO_SUBJECTS,
  isKs4ScienceVariant,
  getSubjectParent,
  isAllSubject,
} from './types/generated/search/subject-hierarchy.js';

export type {
  AllSubjectSlug,
  ParentSubjectSlug,
  Ks4ScienceVariant,
} from './types/generated/search/subject-hierarchy.js';

// ============================================================================
// Validation
// ============================================================================

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

// ============================================================================
// URL Helpers
// ============================================================================

export {
  generateCanonicalUrlWithContext,
  generateCanonicalUrl,
  CONTENT_TYPE_PREFIXES,
  extractSlug,
  type ContentType,
} from './types/generated/api-schema/routing/url-helpers.js';

// ============================================================================
// Type-Safe Object Helpers
// ============================================================================

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
} from './types/helpers/type-helpers.js';

// ============================================================================
// SDK Error Types (ADR-088: Result Pattern)
// ============================================================================

export type {
  SdkFetchError,
  SdkNotFoundError,
  SdkLegallyRestrictedError,
  SdkServerError,
  SdkRateLimitError,
  SdkNetworkError,
  SdkValidationError,
  ResourceType,
  ServerErrorStatus,
} from './types/generated/api-schema/error-types/sdk-error-types.js';

export {
  classifyHttpError,
  classifyException,
  validationError,
  isRecoverableError,
  formatSdkError,
} from './types/generated/api-schema/error-types/sdk-error-types.js';
