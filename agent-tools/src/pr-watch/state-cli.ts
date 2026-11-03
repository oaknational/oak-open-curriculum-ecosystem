import type { UnavailableDeclaration } from './declared-unavailable.js';
import { declaredExpectedSet, parseExpectValue, type ExpectValue } from './expect-flag.js';
import { parsePrTarget, type PrTarget } from './gh.js';
import type { UnavailableInput } from './state-compose.js';
import { readPrStateReading } from './state-gh.js';
import { parseUnavailableFlag } from './unavailable-flag.js';
import { computePrVerdict } from './states.js';
import { PR_VERDICT_STATES, type PrStateReading } from './state-types.js';

/**
 * CLI for the `pr` topic. D1 ships one action — `pr state <n>` — the
 * pr-lifecycle compound read resolved to one closed-set verdict (see
 * `states.ts`). Read-only by design: arming, merging, and reviewer-request
 * mutations stay with the pr-lifecycle skill's explicit human-authorised
 * boundary (plan non-goal). D2 adds `pr watch` on the same reading.
 */

export interface ReadReadingInput {
  readonly target: PrTarget;
  readonly ghPath?: string;
  /** Absent when `--expect` was not given; empty when it was `none` (expect-flag.ts). */
  readonly expectedReviewers?: readonly string[];
  /** Vendors declared unavailable; absent when none is declared. */
  readonly unavailable?: UnavailableInput;
}

export interface PrStateCliInput {
  readonly args: readonly string[];
  readonly stdout?: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr?: Pick<NodeJS.WriteStream, 'write'>;
  /** Reading seam (defaults to the real {@link readPrStateReading}). */
  readonly readReading?: (input: ReadReadingInput) => PrStateReading;
  /** Clock seam for the time-bound verdict legs (defaults to the real clock). */
  readonly now?: () => string;
  /** The bot's login, asked only when a vendor is declared unavailable. */
  readonly poster?: () => string;
}

interface ParsedStateArgs {
  readonly pr: string;
  readonly repo?: string;
  readonly json: boolean;
  readonly ghPath?: string;
  readonly help: boolean;
  /** `null` when undeclared; empty when declared `none` (expect-flag.ts). */
  readonly expect: readonly string[] | null;
  readonly unavailable: readonly UnavailableDeclaration[];
}

interface MutableStateArgs {
  repo?: string;
  ghPath?: string;
  json: boolean;
  help: boolean;
  positionals: string[];
  expect: ExpectValue[];
  unavailable: UnavailableDeclaration[];
}

const STATE_FLAG_HANDLERS: Readonly<Record<string, (state: MutableStateArgs) => void>> = {
  '--help': (state) => {
    state.help = true;
  },
  '-h': (state) => {
    state.help = true;
  },
  '--json': (state) => {
    state.json = true;
  },
};

const STATE_VALUE_HANDLERS: Readonly<
  Record<string, (state: MutableStateArgs, value: string) => void>
> = {
  '--repo': (state, value) => {
    state.repo = value;
  },
  '--gh': (state, value) => {
    state.ghPath = value;
  },
  '--expect': (state, value) => {
    const parsed = parseExpectValue(value);
    if (!parsed.ok) {
      throw new Error(`${parsed.error.message}\n\n${usage()}`);
    }
    state.expect.push(parsed.value);
  },
  '--unavailable': (state, value) => {
    state.unavailable.push(parseUnavailableFlag(value));
  },
};

function requireValue(args: readonly string[], index: number, option: string): string {
  const value = args[index];
  if (value === undefined || value.startsWith('-')) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function consumeStateArg(args: readonly string[], index: number, state: MutableStateArgs): number {
  const arg = args[index];
  const flagHandler = STATE_FLAG_HANDLERS[arg];
  if (flagHandler !== undefined) {
    flagHandler(state);
    return index;
  }
  const valueHandler = STATE_VALUE_HANDLERS[arg];
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

function parseStateArgs(args: readonly string[]): ParsedStateArgs {
  const state: MutableStateArgs = {
    json: false,
    help: false,
    positionals: [],
    expect: [],
    unavailable: [],
  };
  let index = 0;
  while (index < args.length) {
    index = consumeStateArg(args, index, state) + 1;
  }

  if (!state.help && state.positionals.length !== 1) {
    throw new Error(`expected exactly one PR number or URL\n\n${usage()}`);
  }
  const expect = declaredExpectedSet(state.expect);
  if (!expect.ok) {
    throw new Error(`${expect.error.message}\n\n${usage()}`);
  }
  return {
    pr: state.positionals[0] ?? '',
    json: state.json,
    help: state.help,
    expect: expect.value,
    unavailable: state.unavailable,
    ...(state.repo === undefined ? {} : { repo: state.repo }),
    ...(state.ghPath === undefined ? {} : { ghPath: state.ghPath }),
  };
}

function renderVerdictLines(reading: PrStateReading, nowIso: string): string {
  const verdict = computePrVerdict(reading, nowIso);
  const evidence = verdict.evidence.map((line) => `  - ${line}`);
  return [`PR #${reading.number} ${verdict.state}`, ...evidence, ''].join('\n');
}

function renderJson(reading: PrStateReading, nowIso: string): string {
  return `${JSON.stringify({ verdict: computePrVerdict(reading, nowIso), reading }, null, 2)}\n`;
}

interface ActionInput {
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly read: (readInput: ReadReadingInput) => PrStateReading;
  readonly nowIso: string;
  readonly poster: () => string;
}

function runStateAction(input: ActionInput & { readonly rest: readonly string[] }): number {
  const parsed = parseStateArgs(input.rest);
  if (parsed.help) {
    input.stdout.write(usage());
    return 0;
  }
  const target = parsePrTarget(parsed.pr, parsed.repo);
  const reading = input.read({
    target,
    ...(parsed.expect === null ? {} : { expectedReviewers: parsed.expect }),
    ...(parsed.ghPath === undefined ? {} : { ghPath: parsed.ghPath }),
    ...(parsed.unavailable.length === 0
      ? {}
      : {
          unavailable: {
            declarations: parsed.unavailable,
            poster: input.poster(),
            now: input.nowIso,
          },
        }),
  });
  input.stdout.write(
    parsed.json ? renderJson(reading, input.nowIso) : renderVerdictLines(reading, input.nowIso),
  );
  return 0;
}

function dispatchPrAction(input: ActionInput & { readonly args: readonly string[] }): number {
  const [action, ...rest] = input.args;
  if (action === '--help' || action === '-h') {
    input.stdout.write(usage());
    return 0;
  }
  if (action !== 'state') {
    throw new Error(`unknown pr action: ${action ?? '(none)'}\n\n${usage()}`);
  }
  return runStateAction({ ...input, rest });
}

/** Run the `pr` topic CLI; returns the process exit code. */
export function runPrStateCli(input: PrStateCliInput): number {
  const stdout = input.stdout ?? process.stdout;
  const stderr = input.stderr ?? process.stderr;
  const read =
    input.readReading ?? ((readInput: ReadReadingInput) => readPrStateReading(readInput));
  const nowIso = (input.now ?? (() => new Date().toISOString()))();
  const poster = input.poster ?? noPoster;

  try {
    return dispatchPrAction({ args: input.args, stdout, read, nowIso, poster });
  } catch (error) {
    stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }
}

function noPoster(): string {
  throw new Error("--unavailable needs the bot's login, and no merge-bot config was supplied");
}

function usage(): string {
  return [
    'pr state <pr-number|github-pull-url> [--repo <owner/repo>] [--json] [--expect <login>|none]... [--unavailable <login>=<comment-url>]... [--gh <absolute-path>]',
    '',
    'Resolves the pr-lifecycle compound read (checks BY NAME, review threads, auto-merge',
    'intent, per-reviewer legs over the FULL review harvest, agent-task review-run',
    'liveness, the >10 min quiet window) to ONE verdict from a closed state set:',
    // Derived, never transcribed: the set changes as a reviewed contract
    // change and this text must not drift behind it.
    `${PR_VERDICT_STATES.join(' | ')}.`,
    '--expect declares the expected reviewer set (repeatable; SKILL: sourced from the',
    "repository's automatic-review configuration); --expect none declares it EMPTY, the",
    "seat's judgement that the work needs no pull-request review to be safe and effective",
    "(the owner's word of 2026-10-27), and the verdict names the declaration. Undeclared,",
    'it defaults to the observed surface and the verdict says so. Read-only: never arms, merges, or',
    'requests reviews. --json prints the full reading and verdict. --unavailable declares a',
    "vendor down by the bot's comment on the pull request (declared-unavailable.ts).",
    '',
  ].join('\n');
}
