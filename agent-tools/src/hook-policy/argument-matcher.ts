import { GIT_GLOBAL_OPTIONS_WITH_ARGUMENT } from '../shell/git-global-options.js';
import type { OptionSpec } from './argv-option-spec.js';
import { interpreterScriptInSegment, substitutionInSegment } from './argv-nested.js';
import { collectPresentOptions } from './argv-options.js';
import {
  findCommandTable,
  findSubcommandTable,
  parseArgvPattern,
  sameWords,
  type ArgvPatternSpec,
} from './argv-pattern.js';
import { basename } from '../shell/interpreter-script.js';
import { segmentCommand, type ShellWord } from '../shell/shell-words.js';

export { parseArgvPattern } from './argv-pattern.js';

/**
 * The argument-aware matcher for the Bash guard (`match: 'argv'`).
 *
 * A string fingerprint cannot close the spelling space of a destructive
 * invocation: git resolves any unique prefix of a long option (`--h` is
 * `--hard`), accepts mode flags in any position (`git reset HEAD~1 --hard`),
 * and `rm` takes its short flags split, clustered, capitalised, or spelt
 * long (`-r -f`, `-Rf`, `-rvf`, `--recursive --force`). PR #100's review
 * rounds enumerated those spellings one by one and the list never closed.
 * This matcher reads the invocation the way the command's own parser does
 * and matches on the PARSED options, so one policy entry (`git reset --hard`,
 * `rm -rf`) names the mode rather than a spelling of it.
 *
 * The matcher is precise where the token-subsequence mode is broad: an
 * operand after `--` is never an option, options belong to the command in
 * their own shell segment, an option a later one overrides is gone (a
 * forced removal followed by the interactive flag is interactive), and
 * words are read as the command receives them
 * (quotes removed, so `rm '-rf'` is a forced removal and `"rm -rf"` is one
 * word that invokes nothing). It sees a command substitution's body,
 * unquoted or double-quoted, and the script a shell interpreter is given
 * (`-c` on the sh-like shells; quoted, escaped or ANSI-C quoted) as nested
 * commands, two levels deep;
 * it does not expand variables or tildes, resolve aliases, shell functions
 * or git config aliases, read a script on stdin, or know another command
 * with the same effect (`find -delete`, a scripting language, `rimraf`).
 * The guard's promise is PDR-044 innate immunity — fast, broad accident
 * prevention — not resistance to a bypass sought on purpose; and because
 * the host treats a hook timeout as an allow, matching is linear in the
 * command line so its cost is never driven by the input it judges. The
 * broad modes remain available beside it; which entries move onto this one
 * is the policy's decision, taken entry by entry.
 *
 * @packageDocumentation
 */

// ---------------------------------------------------------------------------
// Locating the invocation
// ---------------------------------------------------------------------------

/**
 * Skip git's own options (`git -C <path> --no-pager reset …`) and return the
 * index of the subcommand word, or `null` when there is none.
 */
function skipGitGlobalOptions(words: readonly ShellWord[], start: number): number | null {
  let index = start;
  while (index < words.length) {
    const word = words[index];
    if (word === undefined) {
      return null;
    }
    if (!word.text.startsWith('-')) {
      return index;
    }
    const joined = word.text.includes('=');
    const name = joined ? word.text.slice(0, word.text.indexOf('=')) : word.text;
    index += GIT_GLOBAL_OPTIONS_WITH_ARGUMENT.has(name) && !joined ? 2 : 1;
  }
  return null;
}

interface LocatedOptions {
  readonly options: readonly OptionSpec[];
  readonly argumentsStart: number;
}

/**
 * From a word whose basename is the spec's command, find the option table
 * that governs the invocation: for `rm` the command's own table; for `git`
 * the table of the subcommand named after the global options, provided it
 * is the spec's subcommand.
 */
function locateOptions(
  words: readonly ShellWord[],
  commandIndex: number,
  spec: ArgvPatternSpec,
): LocatedOptions | null {
  const table = findCommandTable(spec.command);
  if (table === undefined) {
    return null;
  }
  const sub = findSubcommandTable(table, spec.subcommand);
  if (sub === undefined) {
    return null;
  }
  if (spec.subcommand.length === 0) {
    return { options: sub.options, argumentsStart: commandIndex + 1 };
  }
  const subcommandIndex = skipGitGlobalOptions(words, commandIndex + 1);
  if (subcommandIndex === null) {
    return null;
  }
  const actual = words
    .slice(subcommandIndex, subcommandIndex + spec.subcommand.length)
    .map((word) => word.text);
  return sameWords(actual, spec.subcommand)
    ? { options: sub.options, argumentsStart: subcommandIndex + spec.subcommand.length }
    : null;
}

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

function invocationMatches(
  words: readonly ShellWord[],
  index: number,
  spec: ArgvPatternSpec,
): boolean {
  const located = locateOptions(words, index, spec);
  if (located === null) {
    return false;
  }
  const present = collectPresentOptions(words.slice(located.argumentsStart), located.options);
  return spec.required.every((name) => present.has(name));
}

/**
 * How many words naming the command are tried as the invocation per segment.
 * A wrapper's operand can shadow the real invocation (`xargs -a rm -- rm -rf`),
 * so the first word is not always it; a bound keeps the cost linear in the
 * segment, since the hook's timeout is an allow.
 */
const MAX_INVOCATION_CANDIDATES = 8;

/**
 * Whether the word before `index` is a command whose next word is its own
 * subcommand (`git rm`), so the candidate at `index` invokes that command,
 * not the one it is named after.
 */
function isSubcommandOf(words: readonly ShellWord[], index: number): boolean {
  const previous = index > 0 ? findCommandTable(basename(words[index - 1]?.text ?? '')) : undefined;
  return previous !== undefined && previous.subcommands.some((table) => table.words.length > 0);
}

/**
 * Whether the segment invokes the spec's command with its required options,
 * reading from any of the first few words whose basename is the command
 * (after `sudo`, `xargs`, `find -exec`, …) and is not another known
 * command's subcommand. A later twin of the command name that is really an
 * operand (`rm -- rm -rf x` deletes three files) can over-match; PDR-044
 * licenses that cost, and it is the deny direction.
 */
function invocationInSegment(words: readonly ShellWord[], spec: ArgvPatternSpec): boolean {
  let tried = 0;
  for (const [index, word] of words.entries()) {
    if (basename(word.text) !== spec.command || isSubcommandOf(words, index)) {
      continue;
    }
    if (invocationMatches(words, index, spec)) {
      return true;
    }
    tried += 1;
    if (tried >= MAX_INVOCATION_CANDIDATES) {
      return false;
    }
  }
  return false;
}

function segmentMatches(
  words: readonly ShellWord[],
  spec: ArgvPatternSpec,
  depth: number,
): boolean {
  const nested = (body: string, nestedDepth: number): boolean =>
    commandMatches(body, spec, nestedDepth);
  return (
    invocationInSegment(words, spec) ||
    substitutionInSegment(words, depth, nested) ||
    interpreterScriptInSegment(words, depth, nested)
  );
}

function segmentsMatch(
  segments: readonly (readonly ShellWord[])[],
  spec: ArgvPatternSpec,
  depth: number,
): boolean {
  return segments.some((segment) => segmentMatches(segment, spec, depth));
}

function commandMatches(command: string, spec: ArgvPatternSpec, depth: number): boolean {
  return segmentsMatch(segmentCommand(command), spec, depth);
}

/**
 * Decide whether already-segmented shell words carry an invocation matching
 * an `argv`-mode pattern — the form the guard uses so one command line is
 * segmented once however many `argv` entries the policy carries.
 */
export function matchesArgvPatternInSegments(
  pattern: string,
  segments: readonly (readonly ShellWord[])[],
): boolean {
  const spec = parseArgvPattern(pattern);
  return spec === null ? false : segmentsMatch(segments, spec, 0);
}

/**
 * Decide whether a Bash command line carries an invocation matching an
 * `argv`-mode pattern: some shell segment invokes the pattern's command (by
 * basename, in any position — after `sudo`, `xargs`, `find -exec`) with the
 * pattern's subcommand and every one of its required options present under
 * any accepted spelling; a command substitution's body, and a script handed
 * to a shell interpreter, are read as nested commands two levels deep. A
 * pattern that does not parse matches nothing.
 */
export function matchesArgvPattern(pattern: string, command: string): boolean {
  return matchesArgvPatternInSegments(pattern, segmentCommand(command));
}
