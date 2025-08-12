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
  isSequenceType,
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
  SEQUENCE_TYPES,
  THREAD_SLUGS,
  UNITS,
  VALID_PATHS_BY_PARAMETERS,
} from './types/generated/api-schema/path-parameters';
