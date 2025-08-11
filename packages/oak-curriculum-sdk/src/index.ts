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
