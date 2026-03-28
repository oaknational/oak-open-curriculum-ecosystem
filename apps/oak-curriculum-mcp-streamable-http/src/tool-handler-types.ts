/**
 * Shared types for tool handler DI interface.
 *
 * Extracted from `handlers.ts` to break the circular dependency:
 * `handlers.ts` → `tool-handler-with-auth.ts` → `handlers.ts`.
 * Both modules now import these types from here.
 *
 * @module
 */

import type { SearchRetrievalService } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type {
  ToolExecutorFactoryConfig,
  UniversalToolExecutorFn,
} from './tool-executor-factory.js';

/**
 * Dependencies for tool handler execution (3 members).
 *
 * `createRequestExecutor` replaces the previous 5 factory members. In tests,
 * it can be a simple `vi.fn(() => vi.fn())` — no factory-chain re-implementation.
 */
export interface ToolHandlerDependencies {
  readonly createRequestExecutor: (config: ToolExecutorFactoryConfig) => UniversalToolExecutorFn;
  readonly getResourceUrl: () => string;
  readonly searchRetrieval: SearchRetrievalService;
}

export type ToolHandlerOverrides = Partial<ToolHandlerDependencies>;
