/**
 * Workspace-census CLI — the one-command reviewer surface the census
 * plan's acceptance criteria name. Subcommands: `subjects`, `skeleton`,
 * `check`, `delta`. Defaults target the canonical artefact homes; every
 * path is overridable so tests and reviewers can point the instrument
 * at fixtures.
 */
import process from 'node:process';

import { err, ok, type Result } from '@oaknational/result';

import { DEFAULT_LEGACY_PATH, DEFAULT_ROWS_PATH } from './artefact.js';
import { runCheck, runDelta, runSkeleton, runSubjects } from './commands.js';
import type { CommandContext } from './context.js';
import { runFacts } from './facts-command.js';
import { runRender } from './render-command.js';

function usage(): string {
  return [
    'Usage: workspace-census <subjects|skeleton|check|delta|facts|render> [options]',
    '',
    '  subjects  [--repo-root <path>] [--json]',
    '  skeleton  [--repo-root <path>] [--rows <path>]',
    '  check     [--repo-root <path>] [--rows <path>]',
    '  delta     [--repo-root <path>] [--rows <path>] [--legacy <path>] [--json]',
    '  facts     [--repo-root <path>]',
    '  render    [--repo-root <path>] [--rows <path>] [--legacy <path>]',
    '',
    `Defaults: --rows ${DEFAULT_ROWS_PATH}`,
    `          --legacy ${DEFAULT_LEGACY_PATH}`,
  ].join('\n');
}

interface ParsedArgs {
  command: string | undefined;
  repoRoot: string;
  rowsPath: string;
  legacyPath: string;
  json: boolean;
  help: boolean;
}

type FlagHandler = (draft: ParsedArgs) => void;
type ValueHandler = (draft: ParsedArgs, value: string) => void;

const FLAG_HANDLERS: Readonly<Record<string, FlagHandler>> = {
  '--': () => undefined,
  '--help': (draft) => {
    draft.help = true;
  },
  '-h': (draft) => {
    draft.help = true;
  },
  '--json': (draft) => {
    draft.json = true;
  },
};

const VALUE_HANDLERS: Readonly<Record<string, ValueHandler>> = {
  '--repo-root': (draft, value) => {
    draft.repoRoot = value;
  },
  '--rows': (draft, value) => {
    draft.rowsPath = value;
  },
  '--legacy': (draft, value) => {
    draft.legacyPath = value;
  },
};

type StepOutcome = { readonly next: number } | { readonly error: string };

function applyArgument(draft: ParsedArgs, argv: readonly string[], index: number): StepOutcome {
  const argument = argv[index];
  if (argument === undefined) {
    return { next: index + 1 };
  }
  const flagHandler = FLAG_HANDLERS[argument];
  if (flagHandler !== undefined) {
    flagHandler(draft);
    return { next: index + 1 };
  }
  const valueHandler = VALUE_HANDLERS[argument];
  if (valueHandler !== undefined) {
    const value = argv[index + 1];
    if (value === undefined) {
      return { error: `${argument} requires a value` };
    }
    valueHandler(draft, value);
    return { next: index + 2 };
  }
  if (draft.command === undefined && !argument.startsWith('-')) {
    draft.command = argument;
    return { next: index + 1 };
  }
  return { error: `unknown argument: ${argument}` };
}

function parseArgs(argv: readonly string[]): Result<ParsedArgs, string> {
  const draft: ParsedArgs = {
    command: undefined,
    repoRoot: process.cwd(),
    rowsPath: DEFAULT_ROWS_PATH,
    legacyPath: DEFAULT_LEGACY_PATH,
    json: false,
    help: false,
  };
  let index = 0;
  while (index < argv.length) {
    const outcome = applyArgument(draft, argv, index);
    if ('error' in outcome) {
      return err(outcome.error);
    }
    index = outcome.next;
  }
  return ok(draft);
}

const COMMANDS: Readonly<Record<string, (context: CommandContext) => Promise<number>>> = {
  subjects: runSubjects,
  skeleton: runSkeleton,
  check: runCheck,
  delta: runDelta,
  facts: runFacts,
  render: runRender,
};

async function main(): Promise<number> {
  const parsed = parseArgs(process.argv.slice(2));
  if (!parsed.ok) {
    process.stderr.write(`workspace-census: ${parsed.error}\n${usage()}\n`);
    return 1;
  }
  const args = parsed.value;
  if (args.help || args.command === undefined) {
    process.stdout.write(`${usage()}\n`);
    return args.help ? 0 : 1;
  }
  const command = COMMANDS[args.command];
  if (command === undefined) {
    process.stderr.write(`workspace-census: unknown command: ${args.command}\n${usage()}\n`);
    return 1;
  }
  return command({
    repoRoot: args.repoRoot,
    rowsPath: args.rowsPath,
    legacyPath: args.legacyPath,
    json: args.json,
    stdout: process.stdout,
    stderr: process.stderr,
  });
}

try {
  process.exitCode = await main();
} catch (error: unknown) {
  process.stderr.write(
    `workspace-census: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
}
