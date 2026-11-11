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
 *   1  message violates the active commitlint config, by an error OR a warning
 *   2  invalid usage / unreadable or empty input, or commitlint gave no verdict
 *      (it did not run, or exited with a status that is not a lint result)
 *
 * An empty message is refused, not passed: commitlint passes one without
 * checking it (see `requireMessage` in `commit-message-intake.ts`).
 *
 * Warnings are violations. commitlint runs in strict mode here and in
 * `.husky/commit-msg`, because a warning that passes is a warning that ships.
 * The preset rates two rules as warnings, `body-leading-blank` and
 * `footer-leading-blank`; the second fires when a wrapped body line begins `word: `, the
 * preset rates it a warning, and messages carrying it were committed and pushed
 * while this tool and the hook both answered 0 (2026-09-19, twice in an hour,
 * with the trap already documented in the commit skill).
 *
 * The TypeScript port of the former `scripts/check-commit-message.sh`,
 * promoted to `src/` under ADR-168 §3 (workspace scripts are TypeScript) and
 * §5 (logic warranting tests belongs in `src/`). The message intake, with its
 * pure argument parsing, message assembly and empty-message refusal, lives in
 * `commit-message-intake.ts` beside its unit tests.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { sync as crossSpawnSync } from 'cross-spawn';

import { parseArgs, resolveMessage } from './commit-message-intake.js';
import { commitlintArgs, exitCodeForCommitlintStatus } from './commitlint-verdict.js';

/**
 * Check a commit message given as this command's arguments, and answer with
 * this command's exit code (see the module's exit codes).
 *
 * @remarks
 * The whole command except the process exit, so the commit-skill advisory
 * orchestrator runs it in its own process: the message it was given then
 * never travels on another command line, and `-F -` reads the orchestrator's
 * own stdin.
 */
export function checkCommitMessage(argv: readonly string[]): 0 | 1 | 2 {
  const parsed = parseArgs(argv);
  if (parsed.kind === 'error') {
    process.stderr.write(`${parsed.message}\n`);
    return 2;
  }
  const message = resolveMessage(parsed);
  if (!message.ok) {
    process.stderr.write(`${message.error}\n`);
    return 2;
  }
  return runCommitlint(message.value);
}

/**
 * Run commitlint from the repo root against the message in a temp file, so it
 * picks up the canonical `commitlint.config.mjs` and mirrors `.husky/commit-msg`
 * using the repo-pinned dependency graph. The temp file is always cleaned up.
 */
function runCommitlint(message: string): 0 | 1 | 2 {
  // git by name, with PATH as the trust root (the Sonar disposition policy's
  // S4036 section).
  const repoRoot = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    encoding: 'utf8',
  }).stdout.trim();
  const dir = mkdtempSync(join(tmpdir(), 'commitlint-check-'));
  const messageFile = join(dir, 'COMMIT_EDITMSG');
  try {
    writeFileSync(messageFile, message);
    // pnpm by name through cross-spawn, which launches a Windows `pnpm.cmd`
    // shim that a shell-less Node spawn cannot.
    const result = crossSpawnSync('pnpm', commitlintArgs(messageFile), {
      cwd: repoRoot,
      stdio: 'inherit',
    });
    return exitCodeForCommitlintStatus(result.status);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function main(): never {
  process.exit(checkCommitMessage(process.argv.slice(2)));
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  main();
}
