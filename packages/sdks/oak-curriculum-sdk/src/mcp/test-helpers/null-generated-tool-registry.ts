/**
 * Null implementation of GeneratedToolRegistry for integration tests.
 *
 * Returns a registry with empty tool names, a throwing getter, and an
 * always-false type guard. Use in tests where aggregated tools are under
 * test and the generated tool registry is not exercised.
 */

import type { ToolName } from '@oaknational/sdk-codegen/mcp-tools';
import type { GeneratedToolRegistry } from '../universal-tools/types.js';

export function createNullGeneratedToolRegistry(): GeneratedToolRegistry {
  return {
    toolNames: [],
    getToolFromToolName: () => {
      throw new Error('Should not call getToolFromToolName');
    },
    isToolName: (value: unknown): value is ToolName =>
      typeof value === 'string' && value === '__never__',
  };
}
