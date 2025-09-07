/**
 * @fileoverview Runtime-adaptive environment utilities for MCP applications
 * @module mcp-env
 *
 * This library provides adaptive environment variable access that works across
 * different runtime environments (Node.js, Edge, Browser) using feature detection.
 */

// Export adaptive environment (default)
export { createAdaptiveEnvironment } from './adaptive.js';

// Export core types for convenience
export type { EnvironmentProvider } from '@oaknational/mcp-core';
