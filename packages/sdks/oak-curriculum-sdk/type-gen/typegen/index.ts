/**
 * Type generation modules public API
 *
 * This module provides pure functions for generating TypeScript types
 * from OpenAPI schemas. All types flow automatically from the schema.
 */

// Schema generation
export {
  generateJsonContent,
  generateTsSchemaContent,
  generateBaseSchemaContent,
} from './schema/index.js';

// Path generation
export {
  generatePathParametersHeader,
  generatePathsConstant,
  generateRuntimeSchemaChecks,
} from './paths/index.js';

// Parameter generation
export {
  generateParameterConstant,
  generateAllParameterConstants,
  PARAMETER_GENERATION_CONFIG,
} from './parameters/index.js';

// Operations generation
export {
  extractPathOperations,
  extractUniqueMethods,
  generateOperationConstants,
  type ExtractedOperation,
  type ExtractedParameter,
} from './operations/index.js';

// Re-export existing modules that are already factored out
export { generatePathParametersInterface } from '../typegen-interface-gen.js';
export { generateValidPathsByParameters } from '../typegen-writers.js';
export { extractPathParameters } from '../typegen-extraction.js';
export { generateCompleteMcpTools } from './mcp-tools/index.js';
export { generateUrlHelpers } from './routing/generate-url-helpers.js';
export { generateOpenAiConnectorContent } from './openai/generate-openai-connector.js';
export { generateSearchRequestModules } from './search/generate-search-requests.js';
export { generateSearchResponseModules } from './search/generate-search-responses.js';
export { generateSearchSuggestionModules } from './search/generate-search-suggestions.js';
export { generateSearchScopeModules } from './search/generate-search-scopes.js';
export { generateSearchFixtureModules } from './search/generate-search-fixtures.js';
export { generateSearchIndexModule } from './search/generate-search-index.js';
export { generateZeroHitFixtureModules } from './observability/generate-zero-hit-fixtures.js';
export { generateAdminStreamFixtureModules } from './admin/generate-admin-fixtures.js';
