/**
 * Environment utilities for MCP applications.
 *
 * Provides `.env` file loading and shared Zod schemas for
 * common environment variable contracts.
 *
 * Schemas are opt-in: apps import only what they need.
 */

export { findRepoRoot, loadRootEnv } from './repo-root';
export type { LoadRootEnvOptions } from './repo-root';

// Shared env contract schemas — import only the ones you need
export {
  OakApiKeyEnvSchema,
  ElasticsearchEnvSchema,
  LoggingEnvSchema,
  LOG_LEVELS,
  NODE_ENVS,
} from './schemas/index';
export type { OakApiKeyEnv, ElasticsearchEnv, LoggingEnv } from './schemas/index';
