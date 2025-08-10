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
export type { paths } from './types/generated/api-schema/api-paths-types.js';

// Configuration
export { apiUrl, apiSchemaUrl } from './config/index.js';
