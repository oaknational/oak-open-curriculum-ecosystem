/**
 * Shared pass-through command registration.
 *
 * Provides a standard way to wire existing scripts as CLI subcommands.
 * The child process inherits the full environment by default (Node.js
 * behaviour when `env` is not specified in `execFileSync` options).
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Command } from 'commander';
import { typeSafeEntries } from '@oaknational/type-helpers';
import type { CliSdkEnv } from './create-cli-sdk.js';
import { printError } from './output.js';
import { printConfigError, type SearchCliEnvLoader } from '../../runtime-config.js';

/**
 * Resolve the CLI workspace root directory.
 *
 * Absolute path to the oak-search-cli workspace root (parent of `src/`).
 */
export const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const PASS_THROUGH_TIMEOUT_MS = 60 * 60 * 1000;

/**
 * Serializable environment shape for child process forwarding.
 */
type SerializableCliEnv = CliSdkEnv;

/**
 * Serialize validated CLI env to process.env format.
 * All values are stringified for Node.js process.env compatibility.
 */
function envToProcessEnv(env: SerializableCliEnv): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of typeSafeEntries(env)) {
    if (value !== undefined && value !== null) {
      result[key] = typeof value === 'string' ? value : String(value);
    }
  }
  return result;
}

function executePassThroughScript(
  scriptPath: string,
  args: readonly string[],
  cliEnv: SerializableCliEnv | undefined,
): void {
  const script = resolve(APP_ROOT, scriptPath);
  if (!existsSync(script)) {
    printError(`Script not found: ${script}`);
    process.exitCode = 1;
    return;
  }

  const execOptions = {
    stdio: 'inherit' as const,
    cwd: APP_ROOT,
    timeout: PASS_THROUGH_TIMEOUT_MS,
    ...(cliEnv && { env: { ...process.env, ...envToProcessEnv(cliEnv) } }),
  };
  execFileSync('pnpm', ['exec', 'tsx', script, ...args], execOptions);
}

function loadPassThroughCliEnv(
  cliEnvLoader: SearchCliEnvLoader | undefined,
): SerializableCliEnv | undefined {
  if (!cliEnvLoader) {
    return undefined;
  }

  const envResult = cliEnvLoader.load();
  if (!envResult.ok) {
    printConfigError(envResult.error);
    process.exitCode = 1;
    return undefined;
  }

  return envResult.value;
}

function handlePassThroughError(error: unknown): void {
  if (error && typeof error === 'object' && 'status' in error && typeof error.status === 'number') {
    process.exitCode = error.status;
    return;
  }

  printError(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

/**
 * Register a pass-through command that delegates to an existing script.
 *
 * The command forwards all arguments to the script via `pnpm exec tsx`,
 * inheriting stdio for interactive output. The script handles its
 * own argument parsing and env loading.
 *
 * When `options.cliEnv` is provided, the child process receives the
 * validated environment merged over process.env, so scripts receive
 * the validated configuration without re-loading from dotfiles.
 *
 * @param parent - The parent Commander command to register under
 * @param name - The subcommand name
 * @param description - Help text for the subcommand
 * @param scriptPath - Path to the script file, relative to workspace root
 * @param options - Optional config; use `cliEnv` to pass validated env to the child
 * @returns void
 *
 * @example
 * ```typescript
 * const admin = new Command('admin');
 * registerPassThrough(admin, 'ingest', 'Ingest curriculum data', 'src/lib/ingest.ts');
 * registerPassThrough(admin, 'bench', 'Run benchmark', 'bench.ts', { cliEnv });
 * ```
 */
export function registerPassThrough(
  parent: Command,
  name: string,
  description: string,
  scriptPath: string,
  options?: { cliEnvLoader?: SearchCliEnvLoader },
): void {
  const cliEnvLoader = options?.cliEnvLoader;
  parent
    .command(name)
    .description(description)
    .allowUnknownOption()
    .allowExcessArguments()
    .action(function passThroughAction(this: Command) {
      try {
        const cliEnv = loadPassThroughCliEnv(cliEnvLoader);
        if (cliEnvLoader && cliEnv === undefined) {
          return;
        }
        executePassThroughScript(scriptPath, this.args, cliEnv);
      } catch (error) {
        handlePassThroughError(error);
      }
    });
}
