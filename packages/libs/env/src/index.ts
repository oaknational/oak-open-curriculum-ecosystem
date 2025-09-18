/**
 * @fileoverview Runtime-adaptive environment utilities for MCP applications
 * @module mcp-env
 *
 * This library provides adaptive environment variable access that works across
 * different runtime environments (Node.js, Edge, Browser) using feature detection.
 */

// Export adaptive environment (default)
export { createAdaptiveEnvironment } from './adaptive.js';
export { findRepoRoot, loadRootEnv } from './repo-root.js';

/**
 * Environment provider interface for consistent environment variable access
 */
export type { EnvironmentProvider } from './adaptive.js';
