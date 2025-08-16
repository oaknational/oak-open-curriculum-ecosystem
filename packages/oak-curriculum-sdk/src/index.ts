/**
 * Oak Curriculum SDK
 *
 * TypeScript SDK for accessing Oak National Academy's Curriculum API.
 * This SDK provides a type-safe client using openapi-fetch with generated types.
 */

// Main client factories
export { createOakClient, createOakPathBasedClient } from './client/index';
export type { OakApiClient, OakApiPathBasedClient } from './client/index';

// Generated types
export type { paths } from './types/generated/api-schema/api-paths-types';
export type { components } from './types/generated/api-schema/api-paths-types';

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
  isLesson,
  isAssetType,
  isSequence,
  isThreadSlug,
  isUnit,
  isValidParameterType,
  isValidPathParameter,
  // Allowed values / helpers
  PATHS,
  KEY_STAGES,
  SUBJECTS,
  LESSONS,
  ASSET_TYPES,
  SEQUENCES,
  THREAD_SLUGS,
  UNITS,
  VALID_PATHS_BY_PARAMETERS,
} from './types/generated/api-schema/path-parameters';

// Schema and operation exports
export { schemaBase as schema } from './types/generated/api-schema/api-schema-base';
export { PATH_OPERATIONS, OPERATIONS_BY_ID } from './types/generated/api-schema/path-parameters';
export type { PathOperation, OperationId } from './types/generated/api-schema/path-parameters';

// Validation module exports (explicit for tree-shaking)
export { validateRequest, validateResponse } from './validation/index';
export type {
  ValidationResult,
  ValidationIssue,
  ValidatedClientOptions,
  HttpMethod,
} from './validation/index';

// MCP (Model Context Protocol) Tool Support
// These exports enable SDK+MCP unified type generation where everything flows from the OpenAPI schema
export { MCP_TOOLS, isToolName } from './types/generated/api-schema/mcp-tools';
export type { AllToolNames } from './types/generated/api-schema/mcp-tools';

// Note: Parameter validation now happens via schema.parameters directly
// in the MCP server implementation. Response validation is handled
// via the SDK's built-in response structures.

// MCP executor - static function using path-based client
export { executeToolCall, McpToolError, McpParameterError } from './mcp/execute-tool-call';

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
} from './types/helpers';
