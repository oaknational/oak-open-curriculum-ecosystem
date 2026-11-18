/**
 * The shell state one line of command text carries into the next word: the
 * working directory a `cd` named and whether the words are being printed.
 *
 * Inside a fenced block a `cd` line makes its directory current for the lines
 * that follow, so a bare `pnpm <script>` after `cd agent-tools` resolves
 * against that workspace's scripts, not the root's. A `cd` to a place the
 * text cannot name (a variable, a placeholder, an absolute or escaping path)
 * loses the block: its later invocations are omitted rather than guessed, and
 * a lost block stays lost.
 *
 * @packageDocumentation
 */

import path from 'node:path';

/**
 * Where a block's commands run: at the root, in a directory a `cd` named, or
 * somewhere the text cannot name (`lost`), after which nothing resolves.
 */
export interface CommandContext {
  readonly directory?: string;
  readonly lost: boolean;
}

export const AT_ROOT: CommandContext = { lost: false };
const LOST: CommandContext = { lost: true };

/** The state the reader of one line carries from word to word. */
export interface LineState {
  readonly context: CommandContext;
  /** An `echo` or `printf` opened this command: its words are text, not commands. */
  readonly printing: boolean;
  /** The next word opens a command (the line's first word, or one after a terminator). */
  readonly commandStart: boolean;
}

/** Tokens that end a shell command. */
export const COMMAND_TERMINATORS: ReadonlySet<string> = new Set(['&&', '||', '|', ';']);
/** Commands whose arguments are printed text, so a `pnpm` among them is not run. */
const HINT_COMMANDS: ReadonlySet<string> = new Set(['echo', 'printf']);
/** A `cd` target the text cannot name: a variable, a placeholder, a glob, a home or absolute path. */
const UNNAMEABLE_DIRECTORY = /[<>{}*$`~]|^\//;

/** The state at the start of a line read in `context`. */
export function lineStart(context: CommandContext): LineState {
  return { context, printing: false, commandStart: true };
}

/** The state after reading `token`, whose following word is `next`. */
export function advance(state: LineState, token: string, next: string | undefined): LineState {
  if (COMMAND_TERMINATORS.has(token)) {
    return { ...state, printing: false, commandStart: true };
  }
  const context =
    token === 'cd' && state.commandStart ? changeDirectory(state.context, next) : state.context;
  return { context, printing: state.printing || HINT_COMMANDS.has(token), commandStart: false };
}

/**
 * The context after `cd target`: the directory joined onto the current one
 * (`cd ..` from a directory returns to the root), or lost when the target is
 * absent, unnameable, or climbs out of the repository.
 */
function changeDirectory(context: CommandContext, target: string | undefined): CommandContext {
  if (context.lost || target === undefined || COMMAND_TERMINATORS.has(target)) {
    return LOST;
  }
  if (UNNAMEABLE_DIRECTORY.test(target)) {
    return LOST;
  }
  const joined = path.posix.normalize(path.posix.join(context.directory ?? '.', target));
  if (joined === '.') {
    return AT_ROOT;
  }
  if (joined.startsWith('..')) {
    return LOST;
  }
  return { directory: joined.replace(/\/$/, ''), lost: false };
}
