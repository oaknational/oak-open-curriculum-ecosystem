/**
 * Shared types for tool handler DI interface.
 *
 * Extracted from `handlers.ts` to break the circular dependency:
 * `handlers.ts` → `tool-handler-with-auth.ts` → `handlers.ts`.
 * Both modules now import these types from here.
 */

import type {
  ToolExecutorFactoryConfig,
  UniversalToolExecutorFn,
} from './tool-executor-factory.js';

/**
 * Dependencies for tool handler execution (2 members).
 *
 * `createRequestExecutor` composes SDK functions into a per-request executor.
 * `searchRetrieval` is closed over at construction time in `buildToolHandlerDependencies`
 * — the handler never accesses it directly.
 * In tests, `createRequestExecutor` can be a simple `vi.fn(() => vi.fn())`.
 */
export interface ToolHandlerDependencies {
  readonly createRequestExecutor: (config: ToolExecutorFactoryConfig) => UniversalToolExecutorFn;
  readonly getResourceUrl: () => string;
}

export type ToolHandlerOverrides = Partial<ToolHandlerDependencies>;
