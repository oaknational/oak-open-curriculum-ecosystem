import { formatBranchTouchedFileReport } from './index.js';
import { readBranchTouchedFileReport } from './git.js';

export interface BranchTouchedFilesCliInput {
  readonly args: readonly string[];
  readonly repoRoot: string;
  readonly stdout?: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr?: Pick<NodeJS.WriteStream, 'write'>;
}

interface ParsedArgs {
  readonly baseRef: string;
  readonly headRef: string;
  readonly json: boolean;
  readonly showFiles: boolean;
  readonly help: boolean;
}

interface MutableArgs {
  baseRef: string;
  headRef: string;
  json: boolean;
  showFiles: boolean;
  help: boolean;
  positionals: string[];
}

type FlagHandler = (state: MutableArgs) => void;
type ValueHandler = (state: MutableArgs, value: string) => void;

const FLAG_HANDLERS: Readonly<Record<string, FlagHandler>> = {
  '--help': (state) => {
    state.help = true;
  },
  '-h': (state) => {
    state.help = true;
  },
  '--json': (state) => {
    state.json = true;
  },
  '--show-files': (state) => {
    state.showFiles = true;
  },
};

const VALUE_HANDLERS: Readonly<Record<string, ValueHandler>> = {
  '--base': (state, value) => {
    state.baseRef = value;
  },
  '--head': (state, value) => {
    state.headRef = value;
  },
  '--branch': (state, value) => {
    state.headRef = value;
  },
};

export function runBranchTouchedFilesCli(input: BranchTouchedFilesCliInput): number {
  const stdout = input.stdout ?? process.stdout;
  const stderr = input.stderr ?? process.stderr;

  try {
    const parsed = parseArgs(input.args);
    if (parsed.help) {
      stdout.write(usage());
      return 0;
    }

    const report = readBranchTouchedFileReport({
      repoRoot: input.repoRoot,
      baseRef: parsed.baseRef,
      headRef: parsed.headRef,
    });

    stdout.write(
      parsed.json
        ? `${JSON.stringify(report, null, 2)}\n`
        : formatBranchTouchedFileReport(report, { showFiles: parsed.showFiles }),
    );

    return 0;
  } catch (error) {
    stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }
}

export function parseArgs(args: readonly string[]): ParsedArgs {
  const state: MutableArgs = {
    baseRef: 'origin/main',
    headRef: 'HEAD',
    json: false,
    showFiles: false,
    help: false,
    positionals: [],
  };

  let index = 0;
  while (index < args.length) {
    const consumedIndex = consumeArg({ args, index, state });
    index = consumedIndex + 1;
  }

  return finalizeArgs(state);
}

function consumeArg(input: {
  readonly args: readonly string[];
  readonly index: number;
  readonly state: MutableArgs;
}): number {
  const arg = input.args[input.index];
  const flagHandler = FLAG_HANDLERS[arg];
  const valueHandler = VALUE_HANDLERS[arg];

  if (arg === '--') {
    return input.index;
  }
  if (flagHandler !== undefined) {
    flagHandler(input.state);
    return input.index;
  }
  if (valueHandler !== undefined) {
    const nextIndex = input.index + 1;
    valueHandler(input.state, requireValue(input.args, nextIndex, arg));
    return nextIndex;
  }
  if (arg.startsWith('--')) {
    throw new Error(`unknown option: ${arg}\n\n${usage()}`);
  }

  input.state.positionals.push(arg);
  return input.index;
}

function finalizeArgs(state: MutableArgs): ParsedArgs {
  if (state.positionals.length > 1) {
    throw new Error(`expected at most one branch/ref positional\n\n${usage()}`);
  }
  if (state.positionals[0] !== undefined) {
    state.headRef = state.positionals[0];
  }

  return {
    baseRef: state.baseRef,
    headRef: state.headRef,
    json: state.json,
    showFiles: state.showFiles,
    help: state.help,
  };
}

function requireValue(args: readonly string[], index: number, option: string): string {
  const value = args[index];
  if (value === undefined || value.startsWith('--')) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function usage(): string {
  return [
    'branch-touched-files [branch-or-ref] [--base <ref>] [--head <ref>] [--json] [--show-files]',
    '',
    'Counts unique files touched since branch-or-ref diverged from the base ref.',
    'Defaults: --base origin/main --head HEAD.',
    '',
  ].join('\n');
}
