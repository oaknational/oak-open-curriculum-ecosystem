/**
 * Operator profile — the check CLI's arguments as one exhaustive grammar:
 * `[--root <dir>] [--emit <relPath>]...`, each option with a value, `--root`
 * at most once. An argument the grammar does not name is refused by name,
 * never skipped: `--rot /srv/profile` must not fall back to the real home
 * profile and report it as the fixture the caller meant.
 */

import { err, ok, type Result } from '@oaknational/result';

import { valueAfter } from './operator-profile-argv.js';

const CHECK_USAGE = 'usage: validate-operator-profile [--root <dir>] [--emit <relPath>]...';

export interface CheckArgs {
  /** The `--root` value, or undefined when the environment decides the root. */
  readonly root: string | undefined;
  /** The documents to print after a conforming check, in argument order. */
  readonly emit: readonly string[];
}

/**
 * Parse the check's arguments.
 *
 * @param argv - arguments after the script path
 * @returns the parsed arguments, or a usage error naming what was refused
 */
export function parseCheckArgs(argv: readonly string[]): Result<CheckArgs, string> {
  let root: string | undefined;
  const emit: string[] = [];
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index] ?? '';
    const value = valueAfter(argv, index + 1);
    if (flag !== '--root' && flag !== '--emit') {
      return err(`unknown argument "${flag}" — ${CHECK_USAGE}`);
    }
    if (value === undefined) {
      return err(`${flag} needs a value — ${CHECK_USAGE}`);
    }
    if (flag === '--root') {
      if (root !== undefined) {
        return err(`--root given more than once — ${CHECK_USAGE}`);
      }
      root = value;
    } else {
      emit.push(value);
    }
  }
  return ok({ root, emit });
}
