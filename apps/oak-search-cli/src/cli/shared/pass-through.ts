/**
 * Shared pass-through command registration.
 *
 * Provides a standard way to wire existing scripts as CLI subcommands.
 * The child process inherits the full environment by default (Node.js
 * behaviour when `env` is not specified in `execFileSync` options).
 */

import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Command } from 'commander';
import { typeSafeEntries } from '@oaknational/type-helpers';
import type { CliSdkEnv } from './create-cli-sdk.js';
import { printError } from './output.js';

/**
 * Resolve the CLI workspace root directory.
 *
 * Absolute path to the oak-search-cli workspace root (parent of `src/`).
 */
export const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

/**
 * Serialize CliSdkEnv (or compatible env object) to process.env format.
 * All values are stringified for Node.js process.env compatibility.
 */
function envToProcessEnv(env: CliSdkEnv): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of typeSafeEntries(env)) {
    if (value !== undefined && value !== null) {
      result[key] = typeof value === 'string' ? value : String(value);
    }
  }
  return result;
}

/**
 * Register a pass-through command that delegates to an existing script.
 *
 * The command forwards all arguments to the script via `npx tsx`,
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
  options?: { cliEnv?: CliSdkEnv },
): void {
  const cliEnv = options?.cliEnv;
  parent
    .command(name)
    .description(description)
    .allowUnknownOption()
    .allowExcessArguments()
    .action(function passThroughAction(this: Command) {
      try {
        const script = resolve(APP_ROOT, scriptPath);
        const execOptions = {
          stdio: 'inherit' as const,
          cwd: APP_ROOT,
          ...(cliEnv && { env: { ...process.env, ...envToProcessEnv(cliEnv) } }),
        };
        execFileSync('npx', ['tsx', script, ...this.args], execOptions);
      } catch (error) {
        if (
          error &&
          typeof error === 'object' &&
          'status' in error &&
          typeof error.status === 'number'
        ) {
          process.exitCode = error.status;
        } else {
          printError(error instanceof Error ? error.message : String(error));
          process.exitCode = 1;
        }
      }
    });
}
