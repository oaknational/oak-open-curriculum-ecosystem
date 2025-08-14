/**
 * Type generation modules public API
 *
 * This module provides pure functions for generating TypeScript types
 * from OpenAPI schemas. All types flow automatically from the schema.
 */

// Schema generation
export { generateJsonContent, generateTsSchemaContent } from './schema/index.js';

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
