#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { writeErrorLine, writeLine } from '../core/terminal-output.js';

export type {
  RepoCheckCommandResult,
  RepoCheckRuntime,
  CheckProfileFailurePhase,
  PostTurboGateStatus,
  CheckProfileEnvironmentEvidence,
  CheckProfileArtifact,
} from './repo-check-profile.js';

export {
  collectProfileEnvironmentEvidence,
  classifyCheckFailurePhase,
  profilePostTurboGateStatus,
  buildCheckProfileArtifact,
  defaultRuntime,
} from './repo-check-profile.js';

export {
  runMarkdownlintStaged,
  runMarkdownlintTracked,
  runPrettierStaged,
  runPrettierTracked,
} from './repo-check-gates.js';

export { runKnipGate } from './repo-check-knip.js';

import {
  runMarkdownlintStaged,
  runMarkdownlintTracked,
  runPrettierStaged,
  runPrettierTracked,
} from './repo-check-gates.js';
import { runDepcruiseGate } from './repo-check-depcruise.js';
import { runKnipGate } from './repo-check-knip.js';
import { runLintChanged } from './repo-check-lint-changed.js';
import { runProfile } from './repo-check-runner.js';
import { runShellcheckTracked } from './repo-check-shellcheck.js';

function usage(): string {
  return [
    'Usage: pnpm agent-tools:repo-check <command>',
    '',
    'Commands:',
    '  depcruise-gate         Run dependency-cruiser; fail on any violation (error, warn, info or ignore),',
    '                         an environment issue, or a cruise without the TypeScript compiler.',
    '  knip-gate              Run knip; fail loudly when a crash is swallowed behind exit 0 (F-147)',
    '                         or the child dies without a verdict (F-112).',
    '  lint-changed           Run turbo lint over the workspaces changed since HEAD; skip the run',
    '                         when turbo plans no task for that scope.',
    '  markdownlint-staged    Run markdownlint on staged Markdown files only.',
    '  markdownlint-tracked [--fix]',
    "                         Run markdownlint on every Markdown file in git's index (the root gate);",
    '                         a staged new file counts, an untracked one does not.',
    '  prettier-staged        Run Prettier on staged files only.',
    '  prettier-tracked [--write]',
    "                         Run Prettier on every file in git's index (the root gate);",
    '                         a staged new file counts, an untracked one does not.',
    '  profile [--dry-run] [--capture-output]',
    '                         Capture the pnpm check Turbo graph and, unless dry-run is set, time pnpm check.',
    '                         --capture-output stores pnpm check stdout/stderr beside the profile artifact.',
    '  shellcheck-tracked     Run shellcheck on every tracked shell script outside the vendored skills;',
    '                         fail on any finding, silencing directive, unrecognised shebang or missing',
    '                         bash floor, or when .tools/bin or PATH has no pinned shellcheck.',
  ].join('\n');
}

interface RepoCheckCommand {
  /** The flags the command understands; anything else is rejected with usage. */
  readonly flags: ReadonlySet<string>;
  readonly run: (args: readonly string[]) => Promise<number>;
}

const NO_FLAGS: ReadonlySet<string> = new Set();

/** The command table: a Map, so a prototype key can never resolve to a non-command. */
const COMMANDS: ReadonlyMap<string, RepoCheckCommand> = new Map<string, RepoCheckCommand>([
  ['depcruise-gate', { flags: NO_FLAGS, run: () => runDepcruiseGate() }],
  ['knip-gate', { flags: NO_FLAGS, run: () => runKnipGate() }],
  ['lint-changed', { flags: NO_FLAGS, run: () => runLintChanged() }],
  ['markdownlint-staged', { flags: NO_FLAGS, run: () => runMarkdownlintStaged() }],
  [
    'markdownlint-tracked',
    {
      flags: new Set(['--fix']),
      run: (args) => runMarkdownlintTracked(args.includes('--fix') ? 'fix' : 'check'),
    },
  ],
  ['prettier-staged', { flags: NO_FLAGS, run: () => runPrettierStaged() }],
  [
    'prettier-tracked',
    {
      flags: new Set(['--write']),
      run: (args) => runPrettierTracked(args.includes('--write') ? 'write' : 'check'),
    },
  ],
  // profile reads its own flags; they are listed here too, so a new one needs both.
  [
    'profile',
    { flags: new Set(['--dry-run', '--capture-output']), run: (args) => runProfile(args) },
  ],
  ['shellcheck-tracked', { flags: NO_FLAGS, run: () => runShellcheckTracked() }],
]);

/**
 * Resolve argv to a command and its checked arguments, or a usage failure.
 * An unrecognised flag is refused rather than ignored: a mistyped repair
 * flag (`--fxi`) must not run the read-only check and report green.
 */
function resolveCommand(
  argv: readonly string[],
): { readonly run: RepoCheckCommand['run']; readonly args: readonly string[] } | undefined {
  const [name, ...args] = argv;
  const command = name === undefined ? undefined : COMMANDS.get(name);
  if (command === undefined || args.some((arg) => !command.flags.has(arg))) {
    return undefined;
  }
  return { run: command.run, args };
}

const HELP_FLAGS: ReadonlySet<string> = new Set(['--help', '-h']);

/**
 * pnpm forwards a `--` separator to this entry unchanged: before the command
 * (`pnpm agent-tools:repo-check -- <command>`) or after it, when a root script
 * already names the command (`pnpm check:profile -- --dry-run`). One separator
 * in either place is dropped; any other is an argument like any other and is
 * refused with usage.
 */
export function withoutForwardingSeparators(argv: readonly string[]): readonly string[] {
  const [first, ...rest] = argv[0] === '--' ? argv.slice(1) : argv;
  if (first === undefined) {
    return [];
  }
  return [first, ...(rest[0] === '--' ? rest.slice(1) : rest)];
}

async function main(): Promise<void> {
  const argv = withoutForwardingSeparators(process.argv.slice(2));
  if (argv.length === 1 && HELP_FLAGS.has(argv[0] ?? '')) {
    writeLine(usage());
    process.exitCode = 0;
    return;
  }
  const resolved = resolveCommand(argv);
  if (resolved === undefined) {
    writeErrorLine(usage());
    process.exitCode = 1;
    return;
  }
  // process.exitCode, never process.exit(): exit() can terminate before
  // piped stdout/stderr flush, truncating the captured output a gate
  // promises to re-emit. A gate that throws (git itself failed) reports the
  // message and exits 1: a gate's failure is guidance, never a stack trace.
  try {
    process.exitCode = await resolved.run(resolved.args);
  } catch (error: unknown) {
    writeErrorLine(`repo-check: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

function isCliEntryPoint(): boolean {
  const entryPoint = process.argv[1];
  if (entryPoint === undefined) {
    return false;
  }
  return import.meta.url === pathToFileURL(path.resolve(entryPoint)).href;
}

if (isCliEntryPoint()) {
  await main();
}
