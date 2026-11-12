import { basename, isAssignment } from '../../shell/interpreter-script.js';
import { GIT_GLOBAL_OPTIONS_WITH_ARGUMENT } from '../../shell/git-global-options.js';
import { mayPrefixRedirection, redirectionWordKind } from '../../shell/redirections.js';

import type { Command } from './shell-commands.js';

/**
 * Where a segment's program and, for git, its subcommand sit. The program
 * follows reserved words, leading assignments, wrappers (`env`, `sudo`,
 * `command`, `exec`, `nice`, `time`) with their options, and redirections;
 * git's subcommand follows git's own options and redirections. The shell
 * takes a redirection and its target out of the words wherever they stand,
 * so `>/dev/null git push` and `git 2>/dev/null push` run `git push`.
 *
 * The scanner's words come after quote removal, so a bare operator (`>`) may
 * have been a quoted argument, and its target may have been a quoted empty
 * word the scanner dropped (`<<<''`); a split prefix (`{fd}`, `2`) may have
 * been a command of its own. A scan for the forbidden shapes therefore
 * follows every reading at once, as the set of places it can reach: after a
 * bare operator, the next word may be the command or the target; a split
 * prefix may be the command or belong to its redirection. A place is visited
 * once, so the scan stays linear. Rendering takes the one reading in which
 * every operator has its target and every prefix its redirection, so a
 * redirection's path is never printed as a program. Past the subcommand no
 * redirection is skipped: a quoted `'>'` there is a value, and the token
 * after it still counts (`git commit -m '>' --amend`). The one exception is
 * a bare `--` straight after a bare operator, which is the operator's target
 * rather than the end of git's options (`git commit 2> -- -n`). An option
 * that takes a value keeps it across a redirection
 * (`git -C 2>/dev/null . push`, `sudo -u >/dev/null root git push`).
 *
 * Where the words cannot tell the readings apart, the reader flags:
 * `git commit -m '>' -- -n` flags, although the shell hands git `-n` as a
 * pathspec there. Flagging and rendering can take different readings, so a
 * segment flagged under one can render under the other (`>> git push`
 * renders as `<arg> <arg> <arg>`); the rendering prints no value either way.
 *
 * An option the tables do not know may take the next word as its value, so
 * both readings are followed: a gap in the tables flags rather than hides
 * (`git --shallow-file f push`, `sudo -D /tmp git push`), at the cost of
 * reading a later word as the subcommand after an option that takes none
 * (`git --no-pager log --grep push` flags).
 *
 * Residuals: a wrapper outside the set, or a wrapper's positional operand,
 * hides the command (`timeout 5 git push`, `nohup git push`).
 */

const WRAPPERS: ReadonlySet<string> = new Set(['env', 'sudo', 'command', 'exec', 'nice', 'time']);
/** Wrapper options that take the next token as their value. */
const WRAPPER_VALUE_OPTIONS: ReadonlySet<string> = new Set([
  '-u',
  '-g',
  '-n',
  '-C',
  '--user',
  '--group',
  '--chdir',
  '--unset',
  '--adjustment',
]);
/** Shell reserved words that open a compound command in front of the program. */
const RESERVED_WORDS: ReadonlySet<string> = new Set([
  '{',
  '!',
  'if',
  'then',
  'elif',
  'else',
  'while',
  'until',
  'do',
]);
/** Whether a token names a wrapper that runs the command after its own options. */
export function isWrapper(token: string): boolean {
  return WRAPPERS.has(basename(token));
}

/** What a scan looks through: the words before the program, a wrapper's or git's options, or the value one of their options takes. */
type OptionsMode = 'wrapper' | 'git';
type ValueMode = 'wrapper-value' | 'git-value';
type Mode = 'prefix' | OptionsMode | ValueMode;
type Place = readonly [index: number, mode: Mode];

const VALUE_MODES: Readonly<Record<OptionsMode, ValueMode>> = {
  wrapper: 'wrapper-value',
  git: 'git-value',
};
const OPTIONS_MODES: Readonly<Record<ValueMode, OptionsMode>> = {
  'wrapper-value': 'wrapper',
  'git-value': 'git',
};

function isValueMode(mode: Mode): mode is ValueMode {
  return mode === 'wrapper-value' || mode === 'git-value';
}

/** What a scan does at one word: whether the word may be what it looks for, and where it goes on to. */
interface Step {
  readonly candidate: boolean;
  readonly next: readonly Place[];
}

/** A step through a word before the program: a reserved word or an assignment is passed (in `every`, a word shaped like an assignment may also be a command path, `a=x/git`), a wrapper opens its options, any other word is the program. */
function leadingStep(word: string, index: number, every: boolean): Step {
  if (RESERVED_WORDS.has(word) || isAssignment(word)) {
    return { candidate: every && isAssignment(word), next: [[index + 1, 'prefix']] };
  }
  return isWrapper(word)
    ? { candidate: false, next: [[index + 1, 'wrapper']] }
    : { candidate: true, next: [] };
}

/** A step through a wrapper's or git's options: an option taking a value opens that value, any other option is passed and, in `every`, may take a value the tables do not know, and the first other word is the command after the wrapper or git's subcommand. */
function optionsStep(word: string, index: number, mode: OptionsMode, every: boolean): Step {
  const values = mode === 'wrapper' ? WRAPPER_VALUE_OPTIONS : GIT_GLOBAL_OPTIONS_WITH_ARGUMENT;
  const value: Place = [index + 1, VALUE_MODES[mode]];
  if (values.has(word)) {
    return { candidate: false, next: [value] };
  }
  if (word.startsWith('-')) {
    return { candidate: false, next: every ? [[index + 1, mode], value] : [[index + 1, mode]] };
  }
  return mode === 'wrapper'
    ? { candidate: false, next: [[index, 'prefix']] }
    : { candidate: true, next: [] };
}

/** A step through a word that is no redirection, by the mode's own grammar; in a value mode the word is the option's value. */
function grammarStep(word: string, index: number, mode: Mode, every: boolean): Step {
  if (mode === 'prefix') {
    return leadingStep(word, index, every);
  }
  return isValueMode(mode)
    ? { candidate: false, next: [[index + 1, OPTIONS_MODES[mode]]] }
    : optionsStep(word, index, mode, every);
}

/** A step through a word that may be the prefix split from the redirection after it (`{fd}`, `2`): it belongs to that redirection, and in `every` it may also be the word the mode looks for (the program, git's subcommand, or an option's value). */
function splitPrefixStep(index: number, mode: Exclude<Mode, 'wrapper'>, every: boolean): Step {
  const prefixed: Place = [index + 1, mode];
  if (!isValueMode(mode)) {
    return { candidate: every, next: [prefixed] };
  }
  return {
    candidate: false,
    next: every ? [prefixed, [index + 1, OPTIONS_MODES[mode]]] : [prefixed],
  };
}

/** A step through a redirection at `index`, or a prefix split from one, by every reading it has (`every`) or by the one that gives it its target; undefined when the word is neither. A wrapper's options hand a split prefix on to the words before the program, which read it. */
function redirectionStep(
  segment: Command,
  index: number,
  mode: Mode,
  every: boolean,
): Step | undefined {
  const word = segment[index] ?? '';
  const kind = redirectionWordKind(word);
  if (kind === 'operator') {
    const target: Place = [index + 2, mode];
    return { candidate: false, next: every ? [[index + 1, mode], target] : [target] };
  }
  if (kind !== 'none') {
    return { candidate: false, next: [[index + 1, mode]] };
  }
  if (mode === 'wrapper' || !mayPrefixRedirection(word, segment[index + 1] ?? '')) {
    return undefined;
  }
  return splitPrefixStep(index, mode, every);
}

/** A step through the word at `index`: past a redirection, else by the mode's own grammar. */
function stepAt(segment: Command, index: number, mode: Mode, every: boolean): Step {
  return (
    redirectionStep(segment, index, mode, every) ??
    grammarStep(segment[index] ?? '', index, mode, every)
  );
}

/** The indices a scan from `starts` finds, each place visited once, in order. */
function scan(segment: Command, starts: readonly Place[], every: boolean): readonly number[] {
  const seen = new Set<string>();
  const found = new Set<number>();
  const work = [...starts];
  for (let place = work.pop(); place !== undefined; place = work.pop()) {
    const [index, mode] = place;
    const key = `${mode}@${String(index)}`;
    if (index < segment.length && !seen.has(key)) {
      seen.add(key);
      const step = stepAt(segment, index, mode, every);
      if (step.candidate) {
        found.add(index);
      }
      work.push(...step.next);
    }
  }
  return [...found].sort((left, right) => left - right);
}

/** Whether the token at `index` is git. */
function isGitAt(segment: Command, index: number): boolean {
  return basename(segment[index] ?? '') === 'git';
}

/** Every index at which git's subcommand may sit, over every reading of the segment's redirections. */
export function gitSubcommands(segment: Command): readonly number[] {
  const programs = scan(segment, [[0, 'prefix']], true).filter((index) => isGitAt(segment, index));
  return scan(
    segment,
    programs.map((program): Place => [program + 1, 'git']),
    true,
  );
}

/** Where the program and, for git, its subcommand sit when every redirection has its target. */
export function placesOf(segment: Command): { program: number; subcommand: number | undefined } {
  const [program = segment.length] = scan(segment, [[0, 'prefix']], false);
  const [subcommand] = isGitAt(segment, program)
    ? scan(segment, [[program + 1, 'git']], false)
    : [];
  return { program, subcommand };
}

/** The end of the segment's leading run of reserved words and assignments; a word shaped like an assignment is one only inside it. */
export function assignmentsEnd(segment: Command): number {
  const end = segment.findIndex((word) => !RESERVED_WORDS.has(word) && !isAssignment(word));
  return end === -1 ? segment.length : end;
}

/** Whether the token at `index` is a bare `--` that ends options: one that is no bare operator's target. */
export function endsOptions(segment: Command, index: number): boolean {
  return segment[index] === '--' && redirectionWordKind(segment[index - 1] ?? '') !== 'operator';
}
