#!/usr/bin/env node
/**
 * `pnpm agent-tools:check-commit-message`
 *
 * Test a commit message against this repo's commitlint configuration in
 * isolation from the rest of the pre-commit / commit-msg hook chain.
 *
 * Mirrors `git commit`'s message intake:
 *   -m <msg>     One paragraph (subject, or a body paragraph). Repeat to add
 *                more paragraphs (joined by blank lines, identical to
 *                `git commit -m … -m …`).
 *   -F <file>    Read the message from <file>. Use `-F -` to read from stdin
 *                (matches `git commit -F -`).
 *   (no flags)   Read the message from stdin.
 *
 * `-m` and `-F` are mutually exclusive (matches `git commit`).
 *
 * Exit codes:
 *   0  message conforms to the active commitlint config
 *   1  message violates the active commitlint config
 *   2  invalid usage / unreadable input
 *
 * The TypeScript port of the former `scripts/check-commit-message.sh`,
 * promoted to `src/` under ADR-168 §3 (workspace scripts are TypeScript) and
 * §5 (logic warranting tests belongs in `src/`); the pure argument-parsing and
 * message-assembly helpers are unit-tested in the adjacent test file.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

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
  0  conforms; 1  violates; 2  invalid usage.`;

/** Parsed command-line intent, or a usage error to report on stderr. */
export type ParsedArgs =
  | { readonly kind: 'messages'; readonly msgs: readonly string[] }
  | { readonly kind: 'file'; readonly file: string }
  | { readonly kind: 'stdin' }
  | { readonly kind: 'error'; readonly message: string };

/**
 * Parse the `-m` / `-F` argument vector, mirroring `git commit` intake.
 * `-m` and `-F` are mutually exclusive; unknown flags are a usage error.
 */
type CollectedFlags =
  | { readonly msgs: readonly string[]; readonly file?: string }
  | { readonly error: string };

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

/** Read all of stdin synchronously (the file descriptor `0`). */
function readStdin(): string {
  return readFileSync(0, 'utf8');
}

/** Resolve the commit-message text for a non-error parsed intent. */
function resolveMessage(parsed: Exclude<ParsedArgs, { kind: 'error' }>): string {
  if (parsed.kind === 'messages') {
    return assembleMessage(parsed.msgs);
  }
  if (parsed.kind === 'file') {
    if (parsed.file === '-') {
      return readStdin();
    }
    try {
      return readFileSync(parsed.file, 'utf8');
    } catch {
      process.stderr.write(`check-commit-message: cannot read file: ${parsed.file}\n`);
      process.exit(2);
    }
  }
  if (process.stdin.isTTY === true) {
    process.stderr.write(
      `check-commit-message: no message provided (no -m, no -F, stdin is a TTY).\n${USAGE}\n`,
    );
    process.exit(2);
  }
  return readStdin();
}

/**
 * Run commitlint from the repo root against the message in a temp file, so it
 * picks up the canonical `commitlint.config.mjs` and mirrors `.husky/commit-msg`
 * using the repo-pinned dependency graph. The temp file is always cleaned up.
 */
function runCommitlint(message: string): number {
  const repoRoot = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    encoding: 'utf8',
  }).stdout.trim();
  const dir = mkdtempSync(join(tmpdir(), 'commitlint-check-'));
  const messageFile = join(dir, 'COMMIT_EDITMSG');
  try {
    writeFileSync(messageFile, message);
    const result = spawnSync('pnpm', ['exec', 'commitlint', '--edit', messageFile], {
      cwd: repoRoot,
      stdio: 'inherit',
    });
    return result.status ?? 2;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function main(): never {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.kind === 'error') {
    process.stderr.write(`${parsed.message}\n`);
    process.exit(2);
  }
  process.exit(runCommitlint(resolveMessage(parsed)));
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  main();
}
