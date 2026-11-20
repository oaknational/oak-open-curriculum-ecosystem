import { err, ok, type Result } from '@oaknational/result';

import {
  DEFAULT_INTERVAL_SECONDS,
  DEFAULT_MAX_POLLS,
  MAX_BUDGET_SECONDS,
  MERGE_USAGE,
} from './merge-usage.js';

/**
 * The argv contract for `merge-bot merge`. Split from `merge-cli.ts` to keep
 * both files inside the size and complexity gates (the same seam
 * `resolve-config.ts` records for mint-token). The command takes no reviewer
 * list: the reviews are read from the pull request.
 */

export interface MergeArgs {
  readonly prNumber: number;
  readonly json: boolean;
  readonly intervalSeconds: number;
  readonly maxPolls: number;
}

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

interface CollectedMergeFlags {
  readonly singles: Partial<Record<SingleFlag, number>>;
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
  if (!isSingleFlag(flag)) {
    return err(new Error(`unknown flag "${flag}"\n${MERGE_USAGE}`));
  }
  if (value === undefined || value.startsWith('--')) {
    return err(new Error(`${flag} needs a value\n${MERGE_USAGE}`));
  }
  return recordSingle(state.singles, flag, value);
}

function collectMergeFlags(rest: readonly string[]): Result<CollectedMergeFlags, Error> {
  const state: CollectedMergeFlags = { singles: {}, json: false };
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
  const { singles, json } = collected.value;
  const prNumber = singles['--pr'];
  if (prNumber === undefined) {
    return err(new Error(`--pr is required\n${MERGE_USAGE}`));
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
  return ok({ prNumber, json, intervalSeconds, maxPolls });
}
