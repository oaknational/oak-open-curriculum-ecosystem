import type { PrSnapshot } from './index.js';
import { diffSnapshots, formatSnapshot, isTerminalState } from './report.js';
import { parsePrTarget, readPrSnapshot, type PrTarget } from './gh.js';

/**
 * CLI for `pr-watch`. Default mode prints a one-shot snapshot; `--watch` polls
 * and emits one line per state change, exiting when the PR is merged/closed or
 * a bounded poll budget is reached.
 *
 * `--watch` is a legitimate POLL loop: a pull request's CI / review / mergeable
 * state has no event-driven push primitive, so polling is unavoidable. It is
 * meant to run under the platform's background-task supervisor (e.g. a Monitor),
 * which is NOT a `use-monitor-for-event-driven-wake` violation — there is no
 * event source to subscribe to.
 */

export interface PrWatchCliInput {
  readonly args: readonly string[];
  readonly stdout?: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr?: Pick<NodeJS.WriteStream, 'write'>;
  /** Snapshot reader seam (defaults to the real {@link readPrSnapshot}). */
  readonly readSnapshot?: (target: PrTarget, ghPath?: string) => PrSnapshot;
  /** Sleep seam for the watch loop (defaults to a real timer). */
  readonly sleep?: (ms: number) => Promise<void>;
}

const DEFAULT_INTERVAL_SECONDS = 30;
const DEFAULT_MAX_POLLS = 240;
const MILLIS_PER_SECOND = 1000;

interface MutableArgs {
  repo?: string;
  json: boolean;
  watch: boolean;
  intervalSeconds: number;
  maxPolls: number;
  ghPath?: string;
  help: boolean;
  positionals: string[];
}

interface ParsedArgs {
  readonly pr: string;
  readonly repo?: string;
  readonly json: boolean;
  readonly watch: boolean;
  readonly intervalSeconds: number;
  readonly maxPolls: number;
  readonly ghPath?: string;
  readonly help: boolean;
}

const FLAG_HANDLERS: Readonly<Record<string, (state: MutableArgs) => void>> = {
  '--help': (state) => {
    state.help = true;
  },
  '-h': (state) => {
    state.help = true;
  },
  '--json': (state) => {
    state.json = true;
  },
  '--watch': (state) => {
    state.watch = true;
  },
};

const VALUE_HANDLERS: Readonly<Record<string, (state: MutableArgs, value: string) => void>> = {
  '--repo': (state, value) => {
    state.repo = value;
  },
  '--interval': (state, value) => {
    state.intervalSeconds = requirePositiveInt(value, '--interval');
  },
  '--max-polls': (state, value) => {
    state.maxPolls = requirePositiveInt(value, '--max-polls');
  },
  '--gh': (state, value) => {
    state.ghPath = value;
  },
};

function requirePositiveInt(value: string, option: string): number {
  if (!/^[1-9]\d*$/u.test(value)) {
    throw new Error(`${option} requires a positive integer`);
  }
  return Number(value);
}

function requireValue(args: readonly string[], index: number, option: string): string {
  const value = args[index];
  if (value === undefined || value.startsWith('-')) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function consumeArg(args: readonly string[], index: number, state: MutableArgs): number {
  const arg = args[index];
  const flagHandler = FLAG_HANDLERS[arg];
  if (flagHandler !== undefined) {
    flagHandler(state);
    return index;
  }
  const valueHandler = VALUE_HANDLERS[arg];
  if (valueHandler !== undefined) {
    valueHandler(state, requireValue(args, index + 1, arg));
    return index + 1;
  }
  if (arg.startsWith('-')) {
    throw new Error(`unknown option: ${arg}\n\n${usage()}`);
  }
  state.positionals.push(arg);
  return index;
}

export function parseArgs(args: readonly string[]): ParsedArgs {
  const state: MutableArgs = {
    json: false,
    watch: false,
    intervalSeconds: DEFAULT_INTERVAL_SECONDS,
    maxPolls: DEFAULT_MAX_POLLS,
    help: false,
    positionals: [],
  };

  let index = 0;
  while (index < args.length) {
    index = consumeArg(args, index, state) + 1;
  }

  if (!state.help && state.positionals.length !== 1) {
    throw new Error(`expected exactly one PR number or URL\n\n${usage()}`);
  }

  const parsed: ParsedArgs = {
    pr: state.positionals[0] ?? '',
    json: state.json,
    watch: state.watch,
    intervalSeconds: state.intervalSeconds,
    maxPolls: state.maxPolls,
    help: state.help,
  };
  return {
    ...parsed,
    ...(state.repo === undefined ? {} : { repo: state.repo }),
    ...(state.ghPath === undefined ? {} : { ghPath: state.ghPath }),
  };
}

function resolveRead(input: PrWatchCliInput): (target: PrTarget, ghPath?: string) => PrSnapshot {
  return input.readSnapshot ?? ((target, ghPath) => readPrSnapshot({ target, ghPath }));
}

function resolveSleep(input: PrWatchCliInput): (ms: number) => Promise<void> {
  return input.sleep ?? ((ms) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function runPrWatchCli(input: PrWatchCliInput): Promise<number> {
  const stdout = input.stdout ?? process.stdout;
  const stderr = input.stderr ?? process.stderr;

  try {
    const parsed = parseArgs(input.args);
    if (parsed.help) {
      stdout.write(usage());
      return 0;
    }
    const target = parsePrTarget(parsed.pr, parsed.repo);
    return parsed.watch
      ? await runWatch({
          target,
          parsed,
          read: resolveRead(input),
          sleep: resolveSleep(input),
          stdout,
        })
      : runOnce({ target, parsed, read: resolveRead(input), stdout });
  } catch (error) {
    stderr.write(`${describeError(error)}\n`);
    return 2;
  }
}

function runOnce(input: {
  readonly target: PrTarget;
  readonly parsed: ParsedArgs;
  readonly read: (target: PrTarget, ghPath?: string) => PrSnapshot;
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
}): number {
  const snapshot = input.read(input.target, input.parsed.ghPath);
  input.stdout.write(
    input.parsed.json ? `${JSON.stringify(snapshot, null, 2)}\n` : `${formatSnapshot(snapshot)}\n`,
  );
  return 0;
}

async function runWatch(input: {
  readonly target: PrTarget;
  readonly parsed: ParsedArgs;
  readonly read: (target: PrTarget, ghPath?: string) => PrSnapshot;
  readonly sleep: (ms: number) => Promise<void>;
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
}): Promise<number> {
  const { target, parsed, read, sleep, stdout } = input;
  let previous = read(target, parsed.ghPath);
  stdout.write(`${formatSnapshot(previous)}\n`);
  if (isTerminalState(previous)) {
    stdout.write(`PR #${previous.number} ${previous.state} — watch ending.\n`);
    return 0;
  }

  for (let poll = 0; poll < parsed.maxPolls; poll += 1) {
    await sleep(parsed.intervalSeconds * MILLIS_PER_SECOND);
    const next = read(target, parsed.ghPath);
    const changes = diffSnapshots(previous, next);
    if (changes.length > 0) {
      for (const change of changes) {
        stdout.write(`${change}\n`);
      }
      stdout.write(`${formatSnapshot(next)}\n`);
    }
    previous = next;
    if (isTerminalState(next)) {
      stdout.write(`PR #${next.number} ${next.state} — watch ending.\n`);
      return 0;
    }
  }

  stdout.write(`PR #${previous.number}: max polls (${parsed.maxPolls}) reached — watch ending.\n`);
  return 0;
}

function usage(): string {
  return [
    'pr-watch <pr-number|github-pull-url> [--repo <owner/repo>] [--json] [--watch] [--interval <seconds>] [--max-polls <n>] [--gh <absolute-path>]',
    '',
    'Reports a pull request CI / review / mergeable state, plus review (inline) and issue comments.',
    'Default: a one-shot snapshot. --json prints the structured snapshot.',
    '--watch polls (default every 30s) and emits one line per state change — including a new',
    '  review/bot comment naming its author — exiting on merged/closed or after --max-polls',
    `  (default ${DEFAULT_MAX_POLLS}). It runs under a background-task supervisor; PR state has no push primitive, so polling is unavoidable (not an event-wake violation).`,
    '--gh sets the gh binary path when gh is installed outside the probed locations.',
    '',
  ].join('\n');
}
