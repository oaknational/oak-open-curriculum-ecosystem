/**
 * Shared helper for running CLI actions with validated environment.
 *
 * Command registration remains pure; env validation happens only when
 * an action actually runs, so help and parse errors stay config-free.
 */

import type { SearchCliEnv } from '../../env.js';
import { printConfigError, type SearchCliEnvLoader } from '../../runtime-config.js';

/**
 * Wrap a Commander action so it loads validated env on demand.
 *
 * @param cliEnvLoader - Cached loader created at the composition root
 * @param action - Action body that requires validated CLI env
 * @returns Commander-compatible async action
 */
export function withLoadedCliEnv<TArgs extends readonly unknown[]>(
  cliEnvLoader: SearchCliEnvLoader,
  action: (cliEnv: SearchCliEnv, ...args: TArgs) => Promise<void> | void,
): (...args: TArgs) => Promise<void> {
  return async (...args: TArgs): Promise<void> => {
    const envResult = cliEnvLoader.load();
    if (!envResult.ok) {
      printConfigError(envResult.error);
      process.exitCode = 1;
      return;
    }

    await action(envResult.value, ...args);
  };
}
