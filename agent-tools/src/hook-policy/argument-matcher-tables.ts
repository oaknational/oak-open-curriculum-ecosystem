import {
  gitBranch,
  gitClean,
  gitPush,
  gitReset,
  gitRevert,
  gitWorktreeAdd,
  gitWorktreeList,
  gitWorktreeMove,
  gitWorktreePrune,
  gitWorktreeRemove,
} from './argv-tables-git.js';
import type { OptionSpec } from './argv-option-spec.js';

/**
 * Option tables for the argument-aware Bash-guard matcher.
 *
 * Each table lists the options a command (or git subcommand) accepts, so the
 * matcher can resolve an invocation's flags to canonical option names the way
 * the command's own parser does: a long option by exact name or by UNIQUE
 * prefix (git's parse-options rule — `--h` is `--hard` on `git reset` because
 * no other reset option starts with `h`, while `--m` is refused as ambiguous
 * between `--mixed` and `--merge`), and a short option by its letter whether
 * spelt alone, split, or clustered (`-rf`, `-r -f`, `-Rf`, `-rvf`).
 *
 * The tables are grounded on the commands' own manuals (git 2.50's own
 * manuals; GNU and BSD `rm`), and they only need to be complete enough for
 * two things: resolving abbreviations without false uniqueness, and knowing
 * which options swallow an argument so a cluster or a following token is not
 * misread as a flag. An option absent from a table is skipped at match time
 * (it can neither satisfy nor defeat a pattern), and a pattern naming an
 * unknown option fails to parse at commit time (the canonical-policy test),
 * never at run time.
 *
 * @packageDocumentation
 */

const rm: readonly OptionSpec[] = [
  { name: 'recursive', short: 'rR' },
  { name: 'force', short: 'f', overrides: ['interactive', 'I'] },
  // Only the long form takes a WHEN; the short `-i` takes none, so `-rif` is `-r -i -f`.
  { name: 'interactive', arg: 'optional', overrides: ['force'], overridesUnless: ['never'] },
  { name: 'i', short: 'i', shortOnly: true, implies: ['interactive'], overrides: ['force'] },
  { name: 'I', short: 'I', shortOnly: true, overrides: ['force'] },
  { name: 'dir', short: 'd' },
  { name: 'verbose', short: 'v' },
  { name: 'one-file-system', short: 'x' },
  { name: 'preserve-root', arg: 'optional' },
  { name: 'no-preserve-root' },
];

/** The option table for one subcommand (or, with empty `words`, for a command with no subcommands). */
export interface SubcommandTable {
  readonly words: readonly string[];
  readonly options: readonly OptionSpec[];
}

/** The subcommand tables of one command the matcher knows. */
export interface CommandTable {
  readonly command: string;
  readonly subcommands: readonly SubcommandTable[];
}

/**
 * The commands the matcher knows. A git subcommand may be two words
 * (`worktree remove`); `rm` has none.
 */
export const ARGV_COMMAND_TABLES: readonly CommandTable[] = [
  { command: 'rm', subcommands: [{ words: [], options: rm }] },
  {
    command: 'git',
    subcommands: [
      { words: ['reset'], options: gitReset },
      { words: ['revert'], options: gitRevert },
      { words: ['push'], options: gitPush },
      { words: ['clean'], options: gitClean },
      { words: ['branch'], options: gitBranch },
      { words: ['worktree', 'add'], options: gitWorktreeAdd },
      { words: ['worktree', 'remove'], options: gitWorktreeRemove },
      { words: ['worktree', 'move'], options: gitWorktreeMove },
      { words: ['worktree', 'list'], options: gitWorktreeList },
      { words: ['worktree', 'prune'], options: gitWorktreePrune },
    ],
  },
];
