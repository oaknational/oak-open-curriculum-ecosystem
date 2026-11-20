import {
  ARGV_COMMAND_TABLES,
  type CommandTable,
  type SubcommandTable,
} from './argument-matcher-tables.js';
import type { OptionSpec } from './argv-option-spec.js';
import { resolvePatternWord } from './argv-options.js';

/**
 * The `argv`-mode pattern grammar for the argument-aware Bash-guard matcher:
 * `<command> [<subcommand>…] <option or operand>…`, parsed against the option
 * tables so an entry names a command, its subcommand, and the canonical
 * options and whole operands an invocation must carry.
 *
 * @packageDocumentation
 */

/**
 * A parsed `argv`-mode pattern: the command, its subcommand words, the
 * canonical options it requires, and the operands it requires (`.` in
 * `git add .`), each matched whole against one operand of the invocation.
 */
export interface ArgvPatternSpec {
  readonly command: string;
  readonly subcommand: readonly string[];
  readonly required: readonly string[];
  readonly operands?: readonly string[];
}

export function findCommandTable(command: string): CommandTable | undefined {
  return ARGV_COMMAND_TABLES.find((table) => table.command === command);
}

export function sameWords(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((word, at) => word === right[at]);
}

export function findSubcommandTable(
  table: CommandTable,
  words: readonly string[],
): SubcommandTable | undefined {
  return table.subcommands.find((sub) => sameWords(sub.words, words));
}

/** Whether `words` are the leading words of some subcommand (`worktree` before `worktree remove`). */
function namesSubcommandPrefix(table: CommandTable, words: readonly string[]): boolean {
  return table.subcommands.some(
    (sub) => sub.words.length >= words.length && sameWords(sub.words.slice(0, words.length), words),
  );
}

/** Split the pattern words after the command into the subcommand words and the remainder. */
function readSubcommand(
  table: CommandTable,
  words: readonly string[],
): readonly [readonly string[], readonly string[]] {
  let count = 0;
  while (count < words.length && namesSubcommandPrefix(table, words.slice(0, count + 1))) {
    count += 1;
  }
  return [words.slice(0, count), words.slice(count)];
}

function collectRequired(
  words: readonly string[],
  options: readonly OptionSpec[],
): readonly string[] | null {
  const required = new Set<string>();
  for (const word of words) {
    const names = resolvePatternWord(word, options);
    if (names === null) {
      return null;
    }
    for (const name of names) {
      required.add(name);
    }
  }
  return [...required];
}

/**
 * Parse an `argv`-mode policy pattern (a command, its subcommand words, then
 * options and operands), e.g. `git reset --hard`,
 * `git worktree remove --force`, `rm -rf`, `git add .`, into the command, its
 * subcommand words, the canonical names of the options the invocation must
 * carry, and the operands it must carry. Returns `null` when the command,
 * subcommand or any option is unknown to the tables, or when neither an
 * option nor an operand is named: an entry that would match nothing is a dead
 * entry, and the canonical-policy test makes that a commit-time failure
 * rather than a silent gap.
 */
export function parseArgvPattern(pattern: string): ArgvPatternSpec | null {
  const [command, ...rest] = pattern.trim().split(/\s+/u).filter(Boolean);
  const table = command === undefined ? undefined : findCommandTable(command);
  if (command === undefined || table === undefined) {
    return null;
  }
  const [subcommand, argumentWords] = readSubcommand(table, rest);
  const sub = findSubcommandTable(table, subcommand);
  const named = sub === undefined ? null : readArguments(argumentWords, sub.options);
  return named === null ? null : { command, subcommand, ...named };
}

/** A pattern word that names options (`--hard`, `-rf`); any other word after the subcommand is an operand. */
function isPatternOption(word: string): boolean {
  return word.startsWith('-') && word !== '-';
}

/** The options and operands a pattern names after its subcommand; `null` when an option is unknown or nothing is named. */
function readArguments(
  words: readonly string[],
  options: readonly OptionSpec[],
): Pick<ArgvPatternSpec, 'required' | 'operands'> | null {
  const operands = words.filter((word) => !isPatternOption(word));
  const required = collectRequired(words.filter(isPatternOption), options);
  if (required === null || required.length + operands.length === 0) {
    return null;
  }
  return operands.length === 0 ? { required } : { required, operands };
}
