/**
 * The argument grammar of `review-cost`: a `gate` or `survey` subcommand, one
 * selector for the gate, a date for the survey, and value flags that must be
 * followed by a value — a malformed invocation is a usage error (exit 2),
 * never a fail-open verdict.
 */

export interface ParsedArgs {
  command: 'gate' | 'survey';
  pr?: number;
  branch: boolean;
  refsFile?: string;
  since?: string;
  repo?: string;
  expect: string[];
  json: boolean;
  help: boolean;
  ghPath?: string;
  error?: string;
}

export const USAGE = [
  'review-cost gate (--pr <number> | --branch | --refs-file <path>) [--repo <owner/repo>] [--expect <login>]... [--json] [--gh <path>]',
  'review-cost survey --since <YYYY-MM-DD> [--repo <owner/repo>] [--expect <login>]... [--json] [--gh <path>]',
  "  The review loop's cost against the settlement-push budget the pull request declares",
  '  (`budget — N` in its description; two when undeclared). Every reviewed head is a round;',
  '  its cost rises with findings, comment volume, push size, files, pushes to the same files',
  '  and pushes within the hour (weights: DEFAULT_POLICY in cost.ts).',
  '  Exit 0 within budget, warn or converging; exit 3 HELD past the budget until the local note',
  '  .agent/state/collaboration/review-rebudgets.md records one decision line per push past it',
  '  (`<pull request> — <date> — <reason>`), the same push then passing; exit 1 operational;',
  '  exit 2 usage. Exactly one selector:',
  '  --pr: one pull request; --branch: the open pull request of the current branch;',
  '  --refs-file: the ref lines git hands the pre-push hook — every pushed branch with an open',
  '  pull request is priced; an exhausted one is held until its decision line exists, then its',
  '  findings go to triage (the owner, 2026-10-24). No open pull request passes.',
  "  A sync push — one merge of the pull request's base over the head the remote holds, its tree",
  "  exactly git's automatic merge — sits outside the budget (PDR-140 clause 4) and passes",
  '  whatever the verdict.',
  '  survey: every pull request updated since the date, any state, priced as the gate prices it —',
  '  the review-cost ledger reads this at wrap; post-merge reviews and comments are in the count.',
].join('\n');

const POSITIVE_INTEGER = /^[1-9]\d*$/u;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/u;

type Value = () => string | undefined;

const FLAG_HANDLERS: Readonly<Record<string, (parsed: ParsedArgs, value: Value) => void>> = {
  '--pr': (parsed, value) => {
    const raw = value();
    if (raw === undefined || !POSITIVE_INTEGER.test(raw)) {
      parsed.error = `--pr needs a positive integer, got '${raw ?? ''}'`;
      return;
    }
    parsed.pr = Number(raw);
  },
  '--branch': (parsed) => {
    parsed.branch = true;
  },
  '--refs-file': (parsed, value) => {
    parsed.refsFile = value();
  },
  '--since': (parsed, value) => {
    const raw = value();
    if (raw === undefined || !ISO_DAY.test(raw)) {
      parsed.error = `--since needs a YYYY-MM-DD date, got '${raw ?? ''}'`;
      return;
    }
    parsed.since = raw;
  },
  '--repo': (parsed, value) => {
    parsed.repo = value();
  },
  '--expect': (parsed, value) => {
    const login = value();
    if (login !== undefined) {
      parsed.expect.push(login);
    }
  },
  '--json': (parsed) => {
    parsed.json = true;
  },
  '--gh': (parsed, value) => {
    parsed.ghPath = value();
  },
  '--help': (parsed) => {
    parsed.help = true;
  },
  '-h': (parsed) => {
    parsed.help = true;
  },
};

// A value-taking flag must be followed by a value that is not itself a flag.
const VALUE_FLAGS = new Set(['--pr', '--refs-file', '--since', '--repo', '--expect', '--gh']);

// The error a flag raises before its handler runs: unknown, or a value flag with no value.
function flagError(flag: string, next: string | undefined): string | undefined {
  if (!Object.hasOwn(FLAG_HANDLERS, flag)) {
    return `unknown argument: ${flag}`;
  }
  if (VALUE_FLAGS.has(flag) && (next === undefined || next.startsWith('-'))) {
    return `${flag} needs a value`;
  }
  return undefined;
}

export function parseArgs(args: readonly string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    command: 'gate',
    branch: false,
    expect: [],
    json: false,
    help: false,
  };
  const rest = [...args];
  const command = rest.shift();
  if (command === 'survey') {
    parsed.command = 'survey';
  } else if (command !== 'gate') {
    parsed.error = 'expected the `gate` or `survey` subcommand';
  }
  while (rest.length > 0) {
    const flag = rest.shift() ?? '';
    const error = flagError(flag, rest[0]);
    if (error !== undefined) {
      parsed.error = error;
      break;
    }
    FLAG_HANDLERS[flag]?.(parsed, () => rest.shift());
  }
  return parsed;
}

export function selectors(parsed: ParsedArgs): number {
  return [parsed.pr !== undefined, parsed.branch, parsed.refsFile !== undefined].filter(Boolean)
    .length;
}
