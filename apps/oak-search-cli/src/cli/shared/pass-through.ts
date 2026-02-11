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
import { printError } from './output.js';

/** Resolve the CLI workspace root directory. */
export const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

/**
 * Register a pass-through command that delegates to an existing script.
 *
 * The command forwards all arguments to the script via `npx tsx`,
 * inheriting stdio for interactive output. The script handles its
 * own argument parsing and env loading.
 *
 * @param parent - The parent Commander command to register under
 * @param name - The subcommand name
 * @param description - Help text for the subcommand
 * @param scriptPath - Path to the script file, relative to workspace root
 */
export function registerPassThrough(
  parent: Command,
  name: string,
  description: string,
  scriptPath: string,
): void {
  parent
    .command(name)
    .description(description)
    .allowUnknownOption()
    .allowExcessArguments()
    .action(function passThroughAction(this: Command) {
      try {
        const script = resolve(APP_ROOT, scriptPath);
        execFileSync('npx', ['tsx', script, ...this.args], {
          stdio: 'inherit',
          cwd: APP_ROOT,
        });
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

/**
 * Register a pass-through command that delegates to a bash script.
 *
 * Similar to {@link registerPassThrough} but invokes `bash` directly
 * instead of `npx tsx`. Useful for shell scripts.
 *
 * @param parent - The parent Commander command to register under
 * @param name - The subcommand name
 * @param description - Help text for the subcommand
 * @param scriptPath - Path to the bash script, relative to workspace root
 */
export function registerBashPassThrough(
  parent: Command,
  name: string,
  description: string,
  scriptPath: string,
): void {
  parent
    .command(name)
    .description(description)
    .allowUnknownOption()
    .allowExcessArguments()
    .action(function bashPassThroughAction(this: Command) {
      try {
        const script = resolve(APP_ROOT, scriptPath);
        execFileSync('bash', [script, ...this.args], {
          stdio: 'inherit',
          cwd: APP_ROOT,
        });
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
