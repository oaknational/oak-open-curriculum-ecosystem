/**
 * Shared helper for running CLI actions with validated environment.
 *
 * Command registration remains pure; env validation happens only when
 * an action actually runs, so help and parse errors stay config-free.
 */

import type { SearchCliEnv } from '../../env.js';
import type { CliObservability } from '../../observability/index.js';
import { printConfigError, type SearchCliEnvLoader } from '../../runtime-config.js';

/**
 * Wrap a Commander action so it loads validated env on demand.
 *
 * When observability is provided, the action runs inside a command-level
 * span. When omitted, the action runs directly (backward compatible).
 *
 * @param cliEnvLoader - Cached loader created at the composition root
 * @param action - Action body that requires validated CLI env
 * @param observability - Optional CLI observability for span wrapping
 * @returns Commander-compatible async action
 */
export function withLoadedCliEnv<TArgs extends readonly unknown[]>(
  cliEnvLoader: SearchCliEnvLoader,
  action: (cliEnv: SearchCliEnv, ...args: TArgs) => Promise<void> | void,
  observability?: CliObservability,
): (...args: TArgs) => Promise<void> {
  return async (...args: TArgs): Promise<void> => {
    const envResult = cliEnvLoader.load();
    if (!envResult.ok) {
      printConfigError(envResult.error);
      process.exitCode = 1;
      return;
    }

    const runAction = async (): Promise<void> => {
      await action(envResult.value, ...args);
    };

    if (observability) {
      await observability.withSpan({ name: 'oak.cli.command', run: runAction });
    } else {
      await runAction();
    }
  };
}
