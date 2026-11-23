import { err, ok, type Result } from '@oaknational/result';

import { parsePrTarget, type PrTarget } from '../pr-watch/gh.js';
import { readPrStateReading, type ReadPrStateOptions } from '../pr-watch/state-gh.js';
import type { PrStateReading, PrVerdict } from '../pr-watch/state-types.js';
import { decideMergeAction, type MergeDecision } from './merge-decision.js';
import { realFetch } from './github-fetch.js';
import { readMergeSettings, putMerge } from './merge-github-api.js';
import { readExecutor } from './merge-read-env.js';
import { resolveVerdict, type ResolvedVerdict } from './merge-door-checks.js';
import { mergeGrounds, noReviewObstacle } from './merge-no-review.js';
import { mintForConfig, type MintedToken, type MintSeams } from './mint-for-config.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import type { BotIdentity } from './resolve-identity.js';

/**
 * The `merge-bot merge` execution: mint → read → verdict → gate → merge.
 *
 * Composes pr-watch's reading and verdict (one settlement implementation, never
 * a re-derivation) and merges over merge-bot's own fetch port so the call shape
 * is an HTTP body a test can pin. The PUT carries the VERDICTED tip's sha — a
 * tip that moves between verdict and merge gets the API's 409, never an
 * unverdicted merge. Merge method is `merge`, always: the repo settings gate
 * refuses when merge commits are disallowed rather than ever changing method
 * (the never-squash ruling as behaviour).
 */

/**
 * A failed PR-state reading, typed so the poll loop can classify it as retryable-within-budget
 * (security H4): pr-watch's reader throws by design on transients (mergeable UNKNOWN, a moved
 * head, a gh non-zero exit), and that throw must never escape into the usage-error exit path.
 */
export class ReadingUnavailableError extends Error {}

/** The seams a caller may inject; the CLI supplies the real composition. */
interface MergeExecutionSeams {
  /** Mint thunk (defaults to mintForConfig at scope pull-request-merge). */
  readonly mint?: () => Promise<Result<MintedToken, Error>>;
  /** Reading assembly (defaults to pr-watch's gh-backed reading, throw-translated). */
  readonly readReading?: (options: ReadPrStateOptions) => Result<PrStateReading, Error>;
  readonly fetchImpl?: GithubApiFetch;
  readonly mintSeams?: MintSeams;
  /**
   * Base environment for the read-path gh executor; `process.env` at the leaf by default (reality
   * enters at one injectable point). Node REPLACES a provided child env, so a pinned read env
   * must carry PATH and friends itself.
   */
  readonly baseEnv?: Readonly<Record<string, string | undefined>>;
}

export interface MergeExecutionInput {
  readonly identity: BotIdentity;
  /** The bot's app slug: the only author the records door admits (`app/<slug>`). */
  readonly appSlug: string;
  readonly prNumber: number;
  readonly nowIso: string;
  /** The caller's reason for merging with no review, when it gives one (`merge-no-review.ts`). */
  readonly noReviewReason: string | undefined;
  readonly seams: MergeExecutionSeams;
}

/**
 * The execution outcome: merged, or a typed refusal reported by name. BOTH arms
 * carry the verdict's evidence (security H3): an irreversible act records its grounds.
 */
export type MergeOutcome =
  | { readonly kind: 'merged'; readonly sha: string; readonly evidence: readonly string[] }
  | {
      readonly kind: 'refused';
      readonly reason: string;
      /** The verdict as a FIELD, so the poll loop reads it by name, never by parsing prose. */
      readonly verdictState: PrVerdict['state'];
      /** Whether the poll loop may outwait this refusal (`merge-decision.ts`); a terminal one ends it. */
      readonly awaitsSettlement: boolean;
      readonly evidence: readonly string[];
      readonly outstandingChecks: ResolvedVerdict['outstandingChecks'];
    };

function defaultMint(input: MergeExecutionInput): () => Promise<Result<MintedToken, Error>> {
  return () =>
    mintForConfig({ ...input.identity, scope: 'pull-request-merge' }, input.seams.mintSeams ?? {});
}

/** Run the whole merge execution over the injected (or real) seams. */
export async function runMergeExecution(
  input: MergeExecutionInput,
): Promise<Result<MergeOutcome, Error>> {
  const mint = input.seams.mint ?? defaultMint(input);
  const minted = await mint();
  if (!minted.ok) {
    return minted;
  }
  if (minted.value.token === '') {
    return err(
      new Error(
        'minted token is empty — refusing before any call: an empty GH_TOKEN reads as unset and gh would run as the signed-in human',
      ),
    );
  }
  const target = mergeTarget(input);
  if (!target.ok) {
    return target;
  }
  const readReading = input.seams.readReading ?? defaultReadReading(input.seams.baseEnv);
  const reading = readReading({ target: target.value });
  if (!reading.ok) {
    return reading;
  }

  return gateAndMerge({ input, reading: reading.value, token: minted.value.token });
}

/**
 * The PR target through pr-watch's OWN reviewed grammar (security H2): the
 * identity path's looser owner/name patterns must not be the last check on
 * the irreversible path. `parsePrTarget` throws on bad grammar; translated
 * here at the one boundary.
 */
function mergeTarget(input: MergeExecutionInput): Result<PrTarget, Error> {
  try {
    return ok(
      parsePrTarget(String(input.prNumber), `${input.identity.owner}/${input.identity.repoName}`),
    );
  } catch (error) {
    return err(
      new Error(
        `merge target rejected by PR-target grammar: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
}

/**
 * The real reading with its throw translated at this one boundary (ADR-088):
 * pr-watch's reader throws on transients by design, and the poll loop needs
 * that failure as a typed value it can retry within the budget.
 */
function defaultReadReading(
  baseEnv: Readonly<Record<string, string | undefined>> | undefined,
): (options: ReadPrStateOptions) => Result<PrStateReading, Error> {
  return (options) => {
    try {
      return ok(
        readPrStateReading({
          ...options,
          execFileSync: readExecutor(baseEnv ?? process.env),
        }),
      );
    } catch (error) {
      return err(
        new ReadingUnavailableError(
          `PR state reading failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  };
}

/** The decision's refusal carried as the outcome, with the verdict it fired on. */
type Refusal = Extract<MergeDecision, { kind: 'refuse' }>;
function refused(decision: Refusal, resolved: ResolvedVerdict): Result<MergeOutcome, Error> {
  const { state: verdictState, evidence } = resolved.verdict;
  const { outstandingChecks } = resolved;
  return ok({ ...decision, kind: 'refused', verdictState, evidence, outstandingChecks });
}

/**
 * The verdict → eligibility → settings-gate → merge tail. The base's
 * required contexts are read on the settled verdict of the bot's own pull
 * request (`merge-door-checks.ts`); a failed read there is the transient
 * class the poll loop retries. Eligibility is classified BEFORE the settings
 * GET (a fallible call that once turned every typed refusal into an
 * operational failure): the decision is asked with `allowMergeCommit: true`
 * first, then with the REAL setting, so the never-squash refusal keeps its
 * one wording.
 */
async function gateAndMerge(context: {
  readonly input: MergeExecutionInput;
  readonly reading: PrStateReading;
  readonly token: string;
}): Promise<Result<MergeOutcome, Error>> {
  const { input, reading, token } = context;
  const fetchImpl = input.seams.fetchImpl ?? realFetch();
  const target = { identity: input.identity, prNumber: input.prNumber };
  const obstacle = noReviewObstacle(reading, input.nowIso);
  const resolved = await resolveVerdict({
    reading,
    appSlug: input.appSlug,
    nowIso: input.nowIso,
    mayMergeUnreviewed: input.noReviewReason !== undefined && obstacle === undefined,
    fetchImpl,
    token,
    target,
  });
  if (!resolved.ok) {
    return doorReadingFailed(resolved.error);
  }
  const { verdict } = resolved.value;
  const decide = (allowMergeCommit: boolean): MergeDecision =>
    decideMergeAction({
      verdict,
      allowMergeCommit,
      noReviewReason: input.noReviewReason,
      noReviewObstacle: obstacle,
    });

  const eligible = decide(true);
  if (eligible.kind === 'refuse') {
    return refused(eligible, resolved.value);
  }
  const allowMergeCommit = await readMergeSettings(fetchImpl, token, input.identity);
  if (!allowMergeCommit.ok) {
    return allowMergeCommit;
  }
  const decision = decide(allowMergeCommit.value);
  if (decision.kind === 'refuse') {
    return refused(decision, resolved.value);
  }
  // A merge with no review puts its reason on the pull request BEFORE the merge call.
  const grounds = await mergeGrounds({ decision, verdict, fetchImpl, token, ...target });
  return grounds.ok
    ? mergeVerdicted({ fetchImpl, token, input, reading, evidence: grounds.value })
    : grounds;
}

/** A failed door reading, as the transient class the poll loop retries. */
function doorReadingFailed(cause: Error): Result<never, Error> {
  return err(new ReadingUnavailableError(`door reading failed: ${cause.message}`, { cause }));
}

/** The merge PUT at the verdicted tip; the outcome carries the grounds it merged on. */
async function mergeVerdicted(context: {
  readonly fetchImpl: GithubApiFetch;
  readonly token: string;
  readonly input: MergeExecutionInput;
  readonly reading: PrStateReading;
  readonly evidence: readonly string[];
}): Promise<Result<MergeOutcome, Error>> {
  const { fetchImpl, token, input, reading, evidence } = context;
  const merged = await putMerge(fetchImpl, token, {
    identity: input.identity,
    prNumber: input.prNumber,
    headRefOid: reading.headRefOid,
  });
  if (!merged.ok) {
    return merged;
  }
  return ok({ kind: 'merged', sha: merged.value, evidence });
}
