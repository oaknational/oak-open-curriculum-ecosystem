/**
 * Type definitions for Oak Curriculum API
 */

export type { OpenAPI3 } from './openapi.js';

// Re-export generated types
export type { paths } from './generated/api-schema/api-paths-types';
export type { components } from './generated/api-schema/api-paths-types';

// MCP tools are now in generated/api-schema/mcp-tools

// Note: Validators removed - validation now happens via schema directly

// Re-export path operations - Note: PATH_OPERATIONS is the const, PathOperation is the type
export { PATH_OPERATIONS, OPERATIONS_BY_ID } from './generated/api-schema/path-parameters.js';
export type { PathOperation, OperationId } from './generated/api-schema/path-parameters';

// Export the helpers
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
} from './helpers.js';
