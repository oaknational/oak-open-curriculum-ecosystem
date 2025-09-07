/**
 * @fileoverview Runtime-adaptive environment tissue for MCP applications
 * @module mcp-histos-env
 *
 * This tissue provides adaptive environment variable access that works across
 * different runtime environments (Node.js, Edge, Browser) using feature detection.
 */

// Export adaptive environment (default)
export { createAdaptiveEnvironment } from './adaptive.js';

// Export types from moria
export type { EnvironmentProvider } from '@oaknational/mcp-core';
