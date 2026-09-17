import { ok, type Result } from '@oaknational/result';

import type { ReadPrStateOptions } from '../pr-watch/state-gh.js';
import type { PrStateReading } from '../pr-watch/state-types.js';
import { MERGE_USAGE, parseMergeArgs, type MergeArgs } from './merge-args.js';
import { verdictAwaitsSettlement } from './merge-decision.js';
import {
  deadlineMessage,
  deadlinePassed,
  mergeDeadlineFrom,
  type MergeDeadline,
} from './merge-deadline.js';
import { reportOutcome, writeProgress } from './merge-report.js';
import { ReadingUnavailableError, runMergeExecution, type MergeExecutionInput } from './merge.js';
import { mintForConfig, type MintedToken, type MintSeams } from './mint-for-config.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import {
  resolveBotIdentity,
  type BotIdentity,
  type MergeBotResolveInput,
} from './resolve-identity.js';

/**
 * The `merge-bot merge` action: the bounded poll loop and outcome reporting
 * (argv contract in `merge-args.ts`). The token is minted ONCE and every
 * poll runs under it, which is why the poll budget is bounded inside the
 * token's one-hour life. Exit map: 0 merged, 1 operational failure, 2 usage,
 * 3 typed refusal — an already-MERGED PR exits 3, because another actor's
 * merge is never this invocation's success.
 *
 * Build-vs-pass-through (owner principle 2026-08-06, recorded in
 * `.agent/plans/delivery/agent-tools-watch-commands.plan.md` Decisions:
 * build value in, pass through where a binary already provides it): the
 * reading passes through `gh`; the settlement verdict and identity
 * discipline are built value no binary provides. The merge call itself is
 * the one adjudicated exception — `gh pr merge --match-head-commit` covers
 * the tip pin, but returns no machine-readable merge-commit sha, so the
 * REST PUT is kept for the structured outcome and the test-pinned body; the
 * endpoint's own 405 enforcement still stands underneath our settings gate.
 */

const MILLIS_PER_SECOND = 1000;

// A statement of fact, not an imperative: topic-layer stderr is buffered, so
// this line can land AFTER the merge — the actionable "run it before merging"
// instruction lives in MERGE_USAGE, which the operator reads pre-flight.
const SWEEP_NOTE =
  'note: the pr-lifecycle merge-base deletion sweep is NOT discharged by this command.\n';

/** The action's composition surface; cli.ts forwards its own injection seams. */
export interface MergeActionInput {
  readonly identityInput: MergeBotResolveInput;
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
  readonly fetchImpl?: GithubApiFetch;
  readonly readFileImpl?: (path: string) => Promise<string>;
  readonly nowEpochSeconds?: () => number;
  /** Reading seam (defaults to pr-watch's gh-backed reading, throw-translated, inside merge.ts). */
  readonly readReadingImpl?: (options: ReadPrStateOptions) => Result<PrStateReading, Error>;
  readonly sleepImpl?: (ms: number) => Promise<void>;
  /** Clock seam for the settlement verdict's quiet window. */
  readonly nowIsoImpl?: () => string;
}

function mintSeamsFrom(input: MergeActionInput): MintSeams {
  return {
    ...(input.fetchImpl === undefined ? {} : { fetchImpl: input.fetchImpl }),
    ...(input.readFileImpl === undefined ? {} : { readFileImpl: input.readFileImpl }),
    ...(input.nowEpochSeconds === undefined ? {} : { nowEpochSeconds: input.nowEpochSeconds }),
  };
}

export async function runMergeAction(
  rest: readonly string[],
  input: MergeActionInput,
): Promise<number> {
  // The most likely first command a new operator types (docs review C3) —
  // it must reach the usage text on stdout, never the unknown-flag path.
  if (rest[0] === '--help' || rest[0] === '-h') {
    input.stdout.write(MERGE_USAGE);
    return 0;
  }
  const parsed = parseMergeArgs(rest);
  if (!parsed.ok) {
    input.stderr.write(`merge-bot merge: ${parsed.error.message}\n`);
    return 2;
  }
  const identity = resolveBotIdentity({}, input.identityInput);
  if (!identity.ok) {
    input.stderr.write(`merge-bot merge: ${identity.error.message}\n`);
    return 2;
  }
  input.stderr.write(SWEEP_NOTE);
  const run = await mintWithDeadline(identity.value, input);
  if (!run.ok) {
    input.stderr.write(`merge-bot merge: ${run.error.message}\n`);
    return 1;
  }
  return pollUntilActionable({
    parsed: parsed.value,
    identity: identity.value,
    run: run.value,
    input,
  });
}

/** The ONE minted token and the wall-clock deadline derived from ITS expiry. */
interface MintedRun {
  readonly token: MintedToken;
  readonly deadline: MergeDeadline;
}

/**
 * Mint ONCE — every poll runs under this token — and bound the loop by the
 * token's own stated expiry. Scope is the merge-only set: a merge never needs
 * `workflows: write` (security D3; provenance on the scope table).
 */
async function mintWithDeadline(
  identity: BotIdentity,
  input: MergeActionInput,
): Promise<Result<MintedRun, Error>> {
  const minted = await mintForConfig(
    { ...identity, scope: 'pull-request-merge' },
    mintSeamsFrom(input),
  );
  if (!minted.ok) {
    return minted;
  }
  const deadline = mergeDeadlineFrom(minted.value.expiresAt);
  if (!deadline.ok) {
    return deadline;
  }
  return ok({ token: minted.value, deadline: deadline.value });
}

function executionSeams(
  input: MergeActionInput,
  minted: MintedToken,
): MergeExecutionInput['seams'] {
  return {
    mint: () => Promise.resolve(ok(minted)),
    ...(input.fetchImpl === undefined ? {} : { fetchImpl: input.fetchImpl }),
    ...(input.readReadingImpl === undefined ? {} : { readReading: input.readReadingImpl }),
  };
}

async function pollUntilActionable(context: {
  readonly parsed: MergeArgs;
  readonly identity: BotIdentity;
  readonly run: MintedRun;
  readonly input: MergeActionInput;
}): Promise<number> {
  const { parsed, input } = context;
  const sleep =
    input.sleepImpl ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const nowIso = input.nowIsoImpl ?? ((): string => new Date().toISOString());
  const seams = executionSeams(input, context.run.token);

  // Bounded despite the open loop head: continuing requires poll < maxPolls
  // (enforced by retryLabel), and every other branch returns.
  for (let poll = 1; ; poll += 1) {
    // ONE clock read per poll, serving both the deadline and the verdict.
    const at = nowIso();
    // The parse-time budget counts only SLEEP; this is the wall clock, and it
    // gates the round BEFORE a merge call can be fired inside it — on EVERY
    // iteration including the first (R5). A token can already be inside its
    // margin at the moment the loop opens: minting is not instantaneous, and
    // nothing bounds the gap between the mint and the first reading.
    if (deadlinePassed(at, context.run.deadline)) {
      input.stderr.write(`merge-bot merge: ${deadlineMessage(at, context.run.deadline)}\n`);
      return 1;
    }
    const outcome = await runMergeExecution({
      identity: context.identity,
      prNumber: parsed.prNumber,
      expectedReviewers: parsed.expect,
      nowIso: at,
      seams,
    });
    const retry = retryLabel(outcome, poll, parsed.maxPolls);
    if (retry === undefined) {
      return reportOutcome(outcome, parsed, input);
    }
    writeProgress(parsed, poll, retry, input);
    await sleep(parsed.intervalSeconds * MILLIS_PER_SECOND);
  }
}

/**
 * Whether this poll outcome is worth another poll, and the progress label if
 * so. Two retryable shapes: a wait-class verdict (it resolves by time), and a
 * failed READING after a working first poll (a transient — a FIRST-poll
 * failure is a broken environment and fails fast). Everything else lands on
 * a terminal path.
 */
function retryLabel(
  outcome: Awaited<ReturnType<typeof runMergeExecution>>,
  poll: number,
  maxPolls: number,
): string | undefined {
  if (poll >= maxPolls) {
    return undefined;
  }
  if (!outcome.ok) {
    return outcome.error instanceof ReadingUnavailableError && poll > 1
      ? `reading unavailable (${outcome.error.message})`
      : undefined;
  }
  return outcome.value.kind === 'refused' && verdictAwaitsSettlement(outcome.value.verdictState)
    ? outcome.value.verdictState
    : undefined;
}
