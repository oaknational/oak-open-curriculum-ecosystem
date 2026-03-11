/**
 * ES client lifecycle wrapper for CLI command handlers.
 *
 * Ensures the Elasticsearch client is closed in a `finally` block
 * regardless of handler outcome. Catches unexpected throws, logs
 * them structurally, prints a human-readable error, and signals
 * a non-zero exit code via the injected callback.
 *
 * @remarks
 * The caller creates the ES client; the wrapper guarantees cleanup.
 * All dependencies are injected as parameters (ADR-078), making the
 * wrapper testable with simple fakes — no `vi.mock` needed.
 *
 * @example
 * ```typescript
 * const esClient = createEsClient(cliEnv);
 * await withEsClient(esClient, async () => {
 *   const sdk = createSearchSdk({ deps: { esClient }, config });
 *   const result = await sdk.admin.setup();
 *   if (!result.ok) {
 *     deps.setExitCode(1);
 *     return;
 *   }
 * }, { logger, printError, setExitCode: (c) => { process.exitCode = c; } });
 * ```
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import type { Logger } from '@oaknational/logger/node';

/** Minimal contract for an ES client that can be closed. */
export interface CloseableEsClient {
  close(): Promise<void>;
}

/** Injected dependencies for `withEsClient`. */
export interface WithEsClientDeps {
  /** Structured logger for error and warning output. */
  readonly logger: Logger;
  /** Human-readable error printer (chalk-formatted stderr). */
  readonly printError: (message: string) => void;
  /** Exit code setter — composition root passes `(c) => { process.exitCode = c; }`. */
  readonly setExitCode: (code: number) => void;
}

/**
 * Execute a CLI command handler with managed ES client lifecycle.
 *
 * Runs the handler, catches unexpected throws, and closes the client
 * in a finally block regardless of outcome. The caller creates the
 * client; the wrapper guarantees cleanup.
 *
 * @param esClient - Pre-created Elasticsearch client
 * @param handler - The command handler to execute (must be inline —
 *   all resource creation must happen inside this closure so that
 *   withEsClient's finally block can clean up on any throw)
 * @param deps - Injected dependencies (logger, error printer, exit code setter)
 */
export async function withEsClient(
  esClient: CloseableEsClient,
  handler: () => Promise<void>,
  deps: WithEsClientDeps,
): Promise<void> {
  try {
    await handler();
  } catch (error: unknown) {
    deps.logger.error('Command failed', error);
    deps.printError(error instanceof Error ? error.message : String(error));
    deps.setExitCode(1);
  } finally {
    try {
      await esClient.close();
    } catch (closeErr: unknown) {
      deps.logger.warn('ES client close failed', closeErr);
      deps.setExitCode(1);
    }
  }
}
