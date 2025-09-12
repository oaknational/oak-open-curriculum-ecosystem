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
} from './types/generated/api-schema/path-parameters.js';

// Schema and operation exports
export { schemaBase as schema } from './types/generated/api-schema/api-schema-base.js';
export { PATH_OPERATIONS, OPERATIONS_BY_ID } from './types/generated/api-schema/path-parameters.js';
export type { PathOperation, OperationId } from './types/generated/api-schema/path-parameters';

// Validation module exports (explicit for tree-shaking)
export { validateRequest, validateResponse } from './validation/index.js';
export type {
  ValidationResult,
  ValidationIssue,
  ValidatedClientOptions,
  HttpMethod,
} from './validation/index.js';

// MCP (Model Context Protocol) Tool Support
// These exports enable SDK+MCP unified type generation where everything flows from the OpenAPI schema
export { MCP_TOOLS, isToolName } from './types/generated/api-schema/mcp-tools/index.js';
export type { AllToolNames } from './types/generated/api-schema/mcp-tools/index';

// Note: Parameter validation now happens via schema.parameters directly
// in the MCP server implementation. Response validation is handled
// via the SDK's built-in response structures.

// MCP executor - static function using path-based client
export { executeToolCall, McpToolError, McpParameterError } from './mcp/execute-tool-call.js';

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
} from './types/helpers.js';
