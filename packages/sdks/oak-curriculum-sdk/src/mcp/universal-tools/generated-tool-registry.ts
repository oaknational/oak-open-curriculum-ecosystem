import { toolNames, getToolFromToolName, isToolName } from '@oaknational/sdk-codegen/mcp-tools';
import type { GeneratedToolRegistry } from './types.js';

/**
 * Default {@link GeneratedToolRegistry} wired to the real generation SDK.
 *
 * This is the composition-root constant that apps pass to
 * `listUniversalTools`, `isUniversalToolName`, and `createUniversalToolExecutor`.
 * Tests provide their own lightweight fakes instead.
 *
 * @example
 * ```typescript
 * const tools = listUniversalTools(generatedToolRegistry);
 * const knownName = generatedToolRegistry.isToolName('get-subjects');
 * ```
 */
export const generatedToolRegistry: GeneratedToolRegistry = {
  toolNames,
  getToolFromToolName,
  isToolName,
};
