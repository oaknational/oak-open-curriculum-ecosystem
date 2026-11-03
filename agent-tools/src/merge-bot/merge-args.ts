import { err, ok, type Result } from '@oaknational/result';

import type { UnavailableDeclaration } from '../pr-watch/declared-unavailable.js';
import {
  declaredExpectedSet,
  parseExpectValue,
  type ExpectValue,
} from '../pr-watch/expect-flag.js';
import { parseUnavailableFlag } from '../pr-watch/unavailable-flag.js';
import {
  DEFAULT_INTERVAL_SECONDS,
  DEFAULT_MAX_POLLS,
  MAX_BUDGET_SECONDS,
  MERGE_USAGE,
} from './merge-usage.js';

/**
 * The argv contract for `merge-bot merge`. Split from `merge-cli.ts` to keep
 * both files inside the size and complexity gates (the same seam
 * `resolve-config.ts` records for mint-token).
 */

export interface MergeArgs {
  readonly prNumber: number;
  /** The DECLARED expected reviewer set — required; empty only when declared `none`. */
  readonly expect: readonly string[];
  readonly json: boolean;
  readonly intervalSeconds: number;
  readonly maxPolls: number;
  /** Vendors declared unavailable (`--unavailable`), each an expected reviewer. */
  readonly unavailable: readonly UnavailableDeclaration[];
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
  readonly expect: ExpectValue[];
  readonly unavailable: UnavailableDeclaration[];
  json: boolean;
}

function recordUnavailable(state: CollectedMergeFlags, value: string): Result<undefined, Error> {
  try {
    state.unavailable.push(parseUnavailableFlag(value));
    return ok(undefined);
  } catch (cause) {
    return err(
      new Error(`${cause instanceof Error ? cause.message : String(cause)}\n${MERGE_USAGE}`),
    );
  }
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

// The grammar (a login, or the reserved `none`) is expect-flag.ts's: security
// D4's garbage-login hole is closed there for both commands that declare a set.
function recordExpect(state: CollectedMergeFlags, value: string): Result<undefined, Error> {
  const parsed = parseExpectValue(value);
  if (!parsed.ok) {
    return err(new Error(`${parsed.error.message}\n${MERGE_USAGE}`));
  }
  state.expect.push(parsed.value);
  return ok(undefined);
}

// A Map, so an argv token named like an object's own property (`toString`,
// `__proto__`) finds no handler and is refused as an unknown flag.
const LIST_FLAGS: ReadonlyMap<
  string,
  (state: CollectedMergeFlags, value: string) => Result<undefined, Error>
> = new Map([
  ['--expect', recordExpect],
  ['--unavailable', recordUnavailable],
]);

function consumeValueFlag(
  state: CollectedMergeFlags,
  flag: string,
  value: string | undefined,
): Result<undefined, Error> {
  const listFlag = LIST_FLAGS.get(flag);
  if (listFlag === undefined && !isSingleFlag(flag)) {
    return err(new Error(`unknown flag "${flag}"\n${MERGE_USAGE}`));
  }
  if (value === undefined || value.startsWith('--')) {
    return err(new Error(`${flag} needs a value\n${MERGE_USAGE}`));
  }
  if (listFlag !== undefined) {
    return listFlag(state, value);
  }
  return isSingleFlag(flag) ? recordSingle(state.singles, flag, value) : ok(undefined);
}

function collectMergeFlags(rest: readonly string[]): Result<CollectedMergeFlags, Error> {
  const state: CollectedMergeFlags = { singles: {}, expect: [], unavailable: [], json: false };
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
  const { singles, expect, unavailable, json } = collected.value;
  const prNumber = singles['--pr'];
  if (prNumber === undefined) {
    return err(new Error(`--pr is required\n${MERGE_USAGE}`));
  }
  const expected = requireExpectedSet(expect, unavailable);
  if (!expected.ok) {
    return expected;
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
  return ok({ prNumber, expect: expected.value, json, intervalSeconds, maxPolls, unavailable });
}

/**
 * The declared set the door merges on: `none` is the empty set, an undeclared
 * set is refused (a defaulted set can omit a configured-but-never-requested
 * reviewer, so it cannot back an irreversible merge), and a vendor declared
 * unavailable must be a declared reviewer.
 */
function requireExpectedSet(
  expect: readonly ExpectValue[],
  unavailable: readonly UnavailableDeclaration[],
): Result<readonly string[], Error> {
  const declared = declaredExpectedSet(expect);
  if (!declared.ok) {
    return err(new Error(`${declared.error.message}\n${MERGE_USAGE}`));
  }
  if (declared.value === null) {
    return err(
      new Error(
        '--expect is required at least once: declare the expected reviewer set from the ' +
          'repository automatic-review configuration, or none when the work needs no review. ' +
          'A defaulted (observed) set can omit a configured-but-never-requested reviewer, so ' +
          'it cannot back an irreversible merge.',
      ),
    );
  }
  const expected = declared.value;
  const unexpected = unavailable.find(
    (declaration) => !expected.some((login) => sameLogin(login, declaration.login)),
  );
  if (unexpected !== undefined) {
    return err(
      new Error(
        `--unavailable names ${unexpected.login}, which no --expect declares\n${MERGE_USAGE}`,
      ),
    );
  }
  return ok(expected);
}

// Logins compare without case, and a `[bot]` suffix names the same account.
function sameLogin(left: string, right: string): boolean {
  const bare = (login: string) => login.toLowerCase().replace(/\[bot\]$/u, '');
  return bare(left) === bare(right);
}
