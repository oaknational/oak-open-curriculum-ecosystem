/**
 * Tool Executor Factory
 *
 * Composes the three SDK functions (`createClient`, `executeToolCall`,
 * `createExecutor`) into a single factory that the DI interface can
 * expose. This eliminates the factories-of-factories pattern that
 * forced tests to re-implement the composition chain.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type {
  UniversalToolName,
  ToolName,
  SearchRetrievalService,
  ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { generatedToolRegistry } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

/**
 * Configuration for creating a request-scoped tool executor.
 *
 * Generic over `TClient` so the factory preserves type safety between
 * `createClient` and `executeToolCall` without exposing the client
 * type to callers of the DI interface.
 */
interface RequestExecutorConfig<TClient> {
  /** API key for the Oak Curriculum API. */
  readonly apiKey: string;
  /** Search retrieval service (shared across requests). */
  readonly searchRetrieval: SearchRetrievalService;
  /** Factory for signed asset download URLs (HTTP transport only). */
  readonly createAssetDownloadUrl?: (lesson: string, type: string) => string;

  // SDK functions — injected for testability (ADR-078)
  /** Creates an Oak API client from an API key. */
  readonly createClient: (apiKey: string) => TClient;
  /** Executes a single tool call against the Oak API. */
  readonly executeToolCall: (
    name: unknown,
    args: unknown,
    client: TClient,
  ) => Promise<ToolExecutionResult>;
  /** Creates a universal tool executor from dependencies. */
  readonly createExecutor: (deps: {
    readonly executeMcpTool: (name: ToolName, args: unknown) => Promise<ToolExecutionResult>;
    readonly searchRetrieval: SearchRetrievalService;
    readonly generatedTools: typeof generatedToolRegistry;
    readonly createAssetDownloadUrl?: (lesson: string, type: string) => string;
  }) => (name: UniversalToolName, args: unknown) => Promise<CallToolResult>;

  /**
   * Optional callback invoked after each tool execution.
   *
   * Used by `executeWithAuthCapture` (ADR-054) to intercept auth errors
   * at the execution result level before they're lost in the MCP response.
   */
  readonly onToolExecution?: (name: unknown, result: ToolExecutionResult) => void;
}

/** Per-request config passed by the tool handler. */
export interface ToolExecutorFactoryConfig {
  readonly apiKey: string;
  readonly createAssetDownloadUrl?: (lesson: string, type: string) => string;
  /** Optional callback invoked after each tool execution (ADR-054 auth capture). */
  readonly onToolExecution?: (name: unknown, result: ToolExecutionResult) => void;
}

/** The function signature returned by {@link createDefaultRequestExecutor}. */
export type UniversalToolExecutorFn = (
  name: UniversalToolName,
  args: unknown,
) => Promise<CallToolResult>;

/**
 * Creates a request-scoped tool executor by composing SDK functions.
 *
 * This is the production factory wired into `ToolHandlerDependencies`.
 * It replaces the inline composition in `executeWithAuthCapture` and
 * simplifies the DI interface from 5 members to 3.
 *
 * @example
 * ```typescript
 * const executor = createDefaultRequestExecutor({
 *   apiKey: 'oak_...',
 *   searchRetrieval,
 *   createClient: createOakPathBasedClient,
 *   executeToolCall,
 *   createExecutor: createUniversalToolExecutor,
 * });
 * const result = await executor('oak_getLesson', { lessonSlug: 'intro-to-algebra' });
 * ```
 */
export function createDefaultRequestExecutor<TClient>(
  config: RequestExecutorConfig<TClient>,
): UniversalToolExecutorFn {
  const client = config.createClient(config.apiKey);

  const executor = config.createExecutor({
    executeMcpTool: async (name, args) => {
      const execution = await config.executeToolCall(name, args, client);
      // Callback must not throw — exceptions here bypass auth error capture
      // in tool-handler-with-auth.ts. Callers are responsible for defensive
      // code in the onToolExecution callback (null coalescing, type guards).
      config.onToolExecution?.(name, execution);
      return execution;
    },
    searchRetrieval: config.searchRetrieval,
    generatedTools: generatedToolRegistry,
    createAssetDownloadUrl: config.createAssetDownloadUrl,
  });

  return executor;
}

/** Internal factory config including searchRetrieval (closed over at build time). */
interface InternalFactoryConfig extends ToolExecutorFactoryConfig {
  readonly searchRetrieval: SearchRetrievalService;
}

/** Stub-mode configuration for {@link createStubRequestExecutor}. */
interface StubRequestExecutorConfig {
  readonly factoryConfig: InternalFactoryConfig;
  /** Stub adapter from `createStubToolExecutionAdapter()`. */
  readonly stubExecutor: (name: ToolName, args: unknown) => Promise<ToolExecutionResult>;
  /** The SDK's `createUniversalToolExecutor` function. */
  readonly createExecutor: RequestExecutorConfig<never>['createExecutor'];
}

/**
 * Creates a request-scoped tool executor using stub responses.
 *
 * Mirrors {@link createDefaultRequestExecutor} but bypasses client
 * creation and real API calls. The composition logic (wiring
 * `onToolExecution`, `searchRetrieval`, `generatedTools`) is shared
 * structurally with the production path to prevent lockstep drift.
 */
export function createStubRequestExecutor(
  config: StubRequestExecutorConfig,
): UniversalToolExecutorFn {
  const { factoryConfig, stubExecutor, createExecutor } = config;

  const executor = createExecutor({
    executeMcpTool: (name, args) => {
      // Promise.resolve normalises synchronous throws into rejections,
      // preventing unhandled exceptions if the stub throws synchronously.
      return Promise.resolve(stubExecutor(name, args ?? {})).then((result) => {
        factoryConfig.onToolExecution?.(name, result);
        return result;
      });
    },
    searchRetrieval: factoryConfig.searchRetrieval,
    generatedTools: generatedToolRegistry,
    createAssetDownloadUrl: factoryConfig.createAssetDownloadUrl,
  });

  return executor;
}
