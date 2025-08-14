/**
 * Decorative tool metadata keyed strictly by operationId (ADR-029/030/031 compliant).
 *
 * This file provides the interface for tool decorations, with actual data
 * stored in tool-decorations-data.ts to meet line limits.
 *
 * All decorations are ONLY additive, decorative information and MUST NOT
 * contain API paths, methods, parameters, or validation logic.
 */

import type { ToolDecoration } from './types';
import { TOOL_DECORATIONS_DATA } from './tool-decorations-data';

/**
 * Decorations keyed by OpenAPI operationId.
 * - Keys MUST be operationIds (no path-like keys)
 * - Values contain only decorative fields (ToolDecoration type)
 * - All API data (paths, params, types) comes from SDK at generation time
 */
export const TOOL_DECORATIONS: Record<string, ToolDecoration> = TOOL_DECORATIONS_DATA;

/**
 * Utility to assert no path-like keys are present.
 */
export function assertNoPathKeys(record: Record<string, unknown>): void {
  for (const k of Object.keys(record)) {
    if (k.startsWith('/')) {
      throw new Error(`Invalid decoration key '${k}': must be operationId, not a path`);
    }
  }
}

// Validate at module init (fail fast during tests)
assertNoPathKeys(TOOL_DECORATIONS);
