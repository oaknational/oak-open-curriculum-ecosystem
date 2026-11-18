/**
 * How `check-commit-message` receives a commit message: the `git commit`-shaped
 * arguments, the text they name, and the refusal of an empty message.
 *
 * @remarks
 * Intake mirrors `git commit`:
 *   -m <msg>     One paragraph (subject, or a body paragraph). Repeat to add
 *                more paragraphs (joined by blank lines, identical to
 *                `git commit -m … -m …`).
 *   -F <file>    Read the message from <file>. Use `-F -` to read from stdin
 *                (matches `git commit -F -`).
 *   (no flags)   Read the message from stdin.
 *
 * `-m` and `-F` are mutually exclusive (matches `git commit`). Argument parsing,
 * message assembly and the empty-message refusal are pure and unit-tested in
 * the adjacent test file; {@link resolveMessage} is the one reader of a file or
 * stdin.
 */

import { readFileSync } from 'node:fs';
import { isatty } from 'node:tty';

import { err, ok, type Result } from '@oaknational/result';

const USAGE = `Usage: pnpm agent-tools:check-commit-message [-m <msg>]... [-F <file>]

Test a commit message against this repo's commitlint configuration in
isolation from the rest of the pre-commit / commit-msg hook chain.

Message intake (mirrors \`git commit\`):
  -m <msg>     One paragraph. Repeat to add more paragraphs, joined by
               blank lines (identical to \`git commit -m … -m …\`).
  -F <file>    Read the message from <file>. Use \`-F -\` for stdin.
  (no flags)   Read the message from stdin.

\`-m\` and \`-F\` are mutually exclusive (matches \`git commit\`).

Exit codes:
  0  conforms; 1  violates (a commitlint warning is a violation);
  2  invalid usage, unreadable or empty input, or no commitlint verdict.`;

/** Parsed command-line intent, or a usage error to report on stderr. */
export type ParsedArgs =
  | { readonly kind: 'messages'; readonly msgs: readonly string[] }
  | { readonly kind: 'file'; readonly file: string }
  | { readonly kind: 'stdin' }
  | { readonly kind: 'error'; readonly message: string };

/** The `-m` values and `-F` file collected from the argument vector, or the usage error that stopped it. */
type CollectedFlags =
  { readonly msgs: readonly string[]; readonly file?: string } | { readonly error: string };

type FlagStep =
  | { readonly kind: 'msg'; readonly value: string }
  | { readonly kind: 'file'; readonly value: string }
  | { readonly kind: 'error'; readonly message: string };

/** Interpret a single `-m`/`-F` flag and its value into one step. */
function readFlag(arg: string | undefined, value: string | undefined): FlagStep {
  if (arg === '-h' || arg === '--help') {
    return { kind: 'error', message: USAGE };
  }
  if (arg !== '-m' && arg !== '-F') {
    return {
      kind: 'error',
      message: `check-commit-message: unknown argument: ${arg ?? ''}\n${USAGE}`,
    };
  }
  if (value === undefined) {
    return { kind: 'error', message: USAGE };
  }
  return arg === '-m' ? { kind: 'msg', value } : { kind: 'file', value };
}

/** Collect `-m` / `-F` flag values from the argument vector (flat, early-return). */
function collectFlags(argv: readonly string[]): CollectedFlags {
  const msgs: string[] = [];
  let file: string | undefined;

  for (let index = 0; index < argv.length; index += 2) {
    const step = readFlag(argv[index], argv[index + 1]);
    if (step.kind === 'error') {
      return { error: step.message };
    }
    if (step.kind === 'msg') {
      msgs.push(step.value);
    } else {
      file = step.value;
    }
  }

  return file === undefined ? { msgs } : { msgs, file };
}

/**
 * Parse the `-m` / `-F` argument vector into the message source it names,
 * mirroring `git commit` intake. `-m` and `-F` are mutually exclusive; unknown
 * flags are a usage error.
 */
export function parseArgs(argv: readonly string[]): ParsedArgs {
  const collected = collectFlags(argv);
  if ('error' in collected) {
    return { kind: 'error', message: collected.error };
  }
  const { msgs, file } = collected;

  if (file !== undefined && msgs.length > 0) {
    return {
      kind: 'error',
      message: 'check-commit-message: -m and -F are mutually exclusive (matches git commit).',
    };
  }
  if (msgs.length > 0) {
    return { kind: 'messages', msgs };
  }
  if (file !== undefined) {
    return { kind: 'file', file };
  }
  return { kind: 'stdin' };
}

/**
 * Assemble `-m` paragraphs into a commit message: paragraphs joined by a blank
 * line, with a single trailing newline (identical to `git commit -m … -m …`).
 */
export function assembleMessage(msgs: readonly string[]): string {
  return `${msgs.join('\n\n')}\n`;
}

/**
 * The message to lint, or the reason there is none.
 *
 * @remarks
 * commitlint passes an empty message without checking it, so an empty or
 * whitespace-only message is refused here. Otherwise a caller that fed this
 * check nothing, such as a child given no stdin, reads the pass as a verdict
 * on a message it never delivered.
 */
export function requireMessage(message: string): Result<string, string> {
  return message.trim().length === 0
    ? err('check-commit-message: the message is empty, so there is nothing to check.')
    : ok(message);
}

/**
 * Read all of stdin synchronously (the file descriptor `0`).
 *
 * @remarks
 * Through the descriptor alone. Touching `process.stdin`, even to read
 * `isTTY`, builds Node's stdin stream, which makes a pipe non-blocking, and
 * this synchronous read of a writer slower than it then fails with `EAGAIN`.
 */
function readStdin(): Result<string, string> {
  try {
    return ok(readFileSync(0, 'utf8'));
  } catch (error) {
    const cause = error instanceof Error ? error.message : String(error);
    return err(`check-commit-message: cannot read stdin (${cause})`);
  }
}

/** Read the text a parsed intent names: the `-m` paragraphs, a file, or stdin. */
function readMessage(parsed: Exclude<ParsedArgs, { kind: 'error' }>): Result<string, string> {
  if (parsed.kind === 'messages') {
    return ok(assembleMessage(parsed.msgs));
  }
  if (parsed.kind === 'file') {
    if (parsed.file === '-') {
      return readStdin();
    }
    try {
      return ok(readFileSync(parsed.file, 'utf8'));
    } catch (error) {
      const cause = error instanceof Error ? error.message : String(error);
      return err(`check-commit-message: cannot read file: ${parsed.file} (${cause})`);
    }
  }
  if (isatty(0)) {
    return err(
      `check-commit-message: no message provided (no -m, no -F, stdin is a TTY).\n${USAGE}`,
    );
  }
  return readStdin();
}

/**
 * Resolve the commit-message text for a non-error parsed intent, refusing an
 * empty one.
 */
export function resolveMessage(
  parsed: Exclude<ParsedArgs, { kind: 'error' }>,
): Result<string, string> {
  const message = readMessage(parsed);
  return message.ok ? requireMessage(message.value) : message;
}
