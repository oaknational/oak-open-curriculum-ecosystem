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
 * Options for {@link withLoadedCliEnv}.
 */
interface WithLoadedCliEnvOptions {
  /** CLI observability for span wrapping and tag enrichment. */
  readonly observability?: CliObservability;
  /**
   * Command name used for the `cli.command` tag and span name.
   *
   * @remarks Defaults to `'oak.cli.command'` when omitted.
   * Explicitly setting this improves error triage in Sentry — each
   * command gets its own tag value for filtering.
   */
  readonly commandName?: string;
}

/** Default span/tag name when no explicit commandName is provided. */
const DEFAULT_CLI_COMMAND_NAME = 'oak.cli.command';

/**
 * Wrap a Commander action so it loads validated env on demand.
 *
 * When observability is provided, the action runs inside a command-level
 * span and the command name is set as a tag on the current scope. When
 * omitted, the action runs directly (backward compatible).
 *
 * @param cliEnvLoader - Cached loader created at the composition root
 * @param action - Action body that requires validated CLI env
 * @param options - Optional observability and command-name enrichment
 * @returns Commander-compatible async action
 */
export function withLoadedCliEnv<TArgs extends readonly unknown[]>(
  cliEnvLoader: SearchCliEnvLoader,
  action: (cliEnv: SearchCliEnv, ...args: TArgs) => Promise<void> | void,
  options?: WithLoadedCliEnvOptions,
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

    if (options?.observability) {
      const commandName = options.commandName ?? DEFAULT_CLI_COMMAND_NAME;
      options.observability.setTag('cli.command', commandName);
      await options.observability.withSpan({ name: commandName, run: runAction });
    } else {
      await runAction();
    }
  };
}
