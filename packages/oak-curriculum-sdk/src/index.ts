/**
 * Oak Curriculum SDK
 *
 * TypeScript SDK for accessing Oak National Academy's Curriculum API.
 * This SDK provides a type-safe, runtime-agnostic client with dependency injection.
 */

// Main client factory
export { createOakClient } from './client/index.js';
export type { OakCurriculumClient } from './client/index.js';

// Types
export type { Lesson, Unit, Programme, SearchParams, SearchResults } from './client/types.js';

// Adapters for different runtimes
export { nodeHttpAdapter } from './adapters/index.js';
export type {
  HttpAdapter,
  HttpOptions,
  HttpResponse,
  OakClientConfig,
  OakClientDependencies,
} from './adapters/index.js';

// Endpoints
export { endpoints } from './endpoints/index.js';
