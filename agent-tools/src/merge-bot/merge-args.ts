import { err, ok, type Result } from '@oaknational/result';

import { SETTLEMENT_WAIT_STATES } from './merge-decision.js';

/**
 * The argv contract for `merge-bot merge`. Split from `merge-cli.ts` to keep
 * both files inside the size and complexity gates (the same seam
 * `resolve-config.ts` records for mint-token).
 */

const DEFAULT_INTERVAL_SECONDS = 30;
const DEFAULT_MAX_POLLS = 90;
/** 50 minutes: the whole budget must end well inside GitHub's one-hour installation-token TTL. */
const MAX_BUDGET_SECONDS = 3000;

export interface MergeArgs {
  readonly prNumber: number;
  /** The DECLARED expected reviewer set — required; a defaulted set never merges. */
  readonly expect: readonly string[];
  readonly json: boolean;
  readonly intervalSeconds: number;
  readonly maxPolls: number;
}

export const MERGE_USAGE = `merge-bot merge --pr <number> --expect <reviewer> [--expect <reviewer> ...] [--json] [--interval <seconds>] [--max-polls <n>]
  Merges the PR via the sanctioned REST path when — and only when — the
  settlement verdict is SETTLE-READY: merge-commit method always (refusing
  when repo settings disallow merge commits, never a squash fallback), the
  VERDICTED tip's sha in the body (a moved tip answers 409 — an operational
  failure, exit 1 — never an unverdicted merge). Wait-class verdicts
  (${SETTLEMENT_WAIT_STATES.join(', ')}) poll under ONE minted
  token (default ${DEFAULT_INTERVAL_SECONDS}s x ${DEFAULT_MAX_POLLS} polls; --interval x --max-polls must not exceed
  ${MAX_BUDGET_SECONDS}s, keeping the whole budget inside GitHub's one-hour
  installation-token TTL); every other verdict is an immediate typed
  refusal, and an exhausted poll budget also exits 3, reporting the last
  verdict. That budget counts SLEEP alone, so polling ALSO stops (exit 1,
  naming the deadline) once the wall clock reaches five minutes before the
  minted token's own stated expiry — no merge call is ever fired in a round
  that could straddle it.
  --expect declares the expected reviewer set (repeatable; REQUIRED here —
  source it from the repository's automatic-review configuration; a
  defaulted or blank set never merges).
  --json puts EXACTLY the outcome object on stdout; progress moves to
  stderr.
  Exit map: 0 merged, 1 operational failure, 2 usage, 3 typed refusal —
  an already-MERGED PR exits 3.
  The pr-lifecycle merge-base deletion sweep is NOT discharged by this
  command — run it against the branch before merging.
`;

const SINGLE_FLAGS = ['--pr', '--interval', '--max-polls'] as const;
type SingleFlag = (typeof SINGLE_FLAGS)[number];

/** Widened at the declaration, so membership needs no assertion. */
const SINGLE_FLAG_SET: ReadonlySet<string> = new Set(SINGLE_FLAGS);

function isSingleFlag(flag: string): flag is SingleFlag {
  return SINGLE_FLAG_SET.has(flag);
}

function requirePositiveInt(flag: string, value: string): Result<number, Error> {
  if (!/^[1-9]\d*$/u.test(value)) {
    return err(new Error(`${flag} requires a positive integer, got "${value}"\n${MERGE_USAGE}`));
  }
  const parsed = Number(value);
  // The digit regex admits values past 2^53-1, which `Number` silently ROUNDS
  // (9007199254740993 becomes ...992): the command would then act on a
  // different PR than the operator supplied.
  if (!Number.isSafeInteger(parsed)) {
    return err(
      new Error(
        `${flag} requires a safe integer (at most ${Number.MAX_SAFE_INTEGER}), got "${value}" — ` +
          `larger values round to a DIFFERENT number\n${MERGE_USAGE}`,
      ),
    );
  }
  return ok(parsed);
}

/**
 * GitHub login grammar plus the app `[bot]` suffix. A blank or garbage
 * `--expect` value would satisfy the declared-set gate while naming a
 * reviewer that can never be OWED — the one-token way around the
 * settlement guarantee (security D4).
 */
const EXPECT_GRAMMAR = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})?(?:\[bot\])?$/u;

interface CollectedMergeFlags {
  readonly singles: Partial<Record<SingleFlag, number>>;
  readonly expect: string[];
  json: boolean;
}

function recordSingle(
  singles: Partial<Record<SingleFlag, number>>,
  flag: SingleFlag,
  value: string,
): Result<undefined, Error> {
  // A repeated single-valued flag is refused rather than last-wins: which PR
  // merges must never be decided by argv order.
  if (singles[flag] !== undefined) {
    return err(new Error(`${flag} given more than once — pass it exactly once`));
  }
  const parsed = requirePositiveInt(flag, value);
  if (!parsed.ok) {
    return parsed;
  }
  singles[flag] = parsed.value;
  return ok(undefined);
}

function consumeValueFlag(
  state: CollectedMergeFlags,
  flag: string,
  value: string | undefined,
): Result<undefined, Error> {
  if (flag !== '--expect' && !isSingleFlag(flag)) {
    return err(new Error(`unknown flag "${flag}"\n${MERGE_USAGE}`));
  }
  if (value === undefined || value.startsWith('--')) {
    return err(new Error(`${flag} needs a value\n${MERGE_USAGE}`));
  }
  if (flag === '--expect') {
    if (!EXPECT_GRAMMAR.test(value)) {
      return err(new Error(`--expect must be a GitHub login (got "${value}")\n${MERGE_USAGE}`));
    }
    state.expect.push(value);
    return ok(undefined);
  }
  return recordSingle(state.singles, flag, value);
}

function collectMergeFlags(rest: readonly string[]): Result<CollectedMergeFlags, Error> {
  const state: CollectedMergeFlags = { singles: {}, expect: [], json: false };
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index] ?? '';
    if (flag === '--json') {
      state.json = true;
      continue;
    }
    const consumed = consumeValueFlag(state, flag, rest[index + 1]);
    if (!consumed.ok) {
      return consumed;
    }
    index += 1;
  }
  return ok(state);
}

export function parseMergeArgs(rest: readonly string[]): Result<MergeArgs, Error> {
  const collected = collectMergeFlags(rest);
  if (!collected.ok) {
    return collected;
  }
  const { singles, expect, json } = collected.value;
  const prNumber = singles['--pr'];
  if (prNumber === undefined) {
    return err(new Error(`--pr is required\n${MERGE_USAGE}`));
  }
  if (expect.length === 0) {
    return err(
      new Error(
        '--expect is required at least once: declare the expected reviewer set from the ' +
          'repository automatic-review configuration. A defaulted (observed) set can omit a ' +
          'configured-but-never-requested reviewer, so it cannot back an irreversible merge.',
      ),
    );
  }
  const intervalSeconds = singles['--interval'] ?? DEFAULT_INTERVAL_SECONDS;
  const maxPolls = singles['--max-polls'] ?? DEFAULT_MAX_POLLS;
  const budgetSeconds = intervalSeconds * maxPolls;
  if (budgetSeconds > MAX_BUDGET_SECONDS) {
    return err(
      new Error(
        `--interval x --max-polls is ${budgetSeconds}s — the poll budget must not exceed ` +
          `${MAX_BUDGET_SECONDS}s, so the ONE minted installation token ` +
          "(GitHub's one-hour TTL) outlives the final merge call.",
      ),
    );
  }
  return ok({ prNumber, expect, json, intervalSeconds, maxPolls });
}
