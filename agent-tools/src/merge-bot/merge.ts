import { execFileSync } from 'node:child_process';

import { err, ok, type Result } from '@oaknational/result';

import { parsePrTarget, type GhCommandExecutor, type PrTarget } from '../pr-watch/gh.js';
import { readPrStateReading, type ReadPrStateOptions } from '../pr-watch/state-gh.js';
import type { PrStateReading, PrVerdict } from '../pr-watch/state-types.js';
import { computePrVerdict } from '../pr-watch/states.js';
import { decideMergeAction, type MergeDecision } from './merge-decision.js';
import { readMergeSettings, realFetch, putMerge } from './merge-github-api.js';
import { mintForConfig, type MintedToken, type MintSeams } from './mint-for-config.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import type { BotIdentity } from './resolve-identity.js';

/**
 * The `merge-bot merge` execution: mint → read → verdict → gate → merge.
 *
 * Composes pr-watch's reading and verdict (one settlement implementation,
 * never a re-derivation) and merges over merge-bot's own fetch port so the
 * call shape is an HTTP body a test can pin. The PUT carries the VERDICTED
 * tip's sha — a tip that moves between verdict and merge gets the API's 409,
 * never an unverdicted merge. Merge method is `merge`, always: the repo
 * settings gate refuses when merge commits are disallowed rather than ever
 * changing method (the never-squash ruling as behaviour).
 */

/**
 * A failed PR-state reading, typed so the poll loop can classify it as
 * retryable-within-budget (security H4): pr-watch's reader throws by design
 * on transients (mergeable UNKNOWN, a moved head, a gh non-zero exit), and
 * that throw must never escape into the usage-error exit path.
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
  readonly ghPath?: string;
  /**
   * Base environment for the read-path gh executor. Defaults to
   * `process.env` at the leaf (the default-seam pattern: reality enters at
   * exactly one injectable point): Node REPLACES a provided child env rather
   * than merging it, so pinning the read env forces constructing the whole
   * environment, and gh needs PATH and friends underneath.
   */
  readonly baseEnv?: Readonly<Record<string, string | undefined>>;
}

export interface MergeExecutionInput {
  readonly identity: BotIdentity;
  readonly prNumber: number;
  /** DECLARED expected reviewer set — required; a defaulted set never merges. */
  readonly expectedReviewers: readonly string[];
  readonly nowIso: string;
  readonly seams: MergeExecutionSeams;
}

/**
 * The execution outcome: merged, or a typed refusal the caller reports by
 * name. BOTH arms carry the verdict's evidence lines (security H3): an
 * irreversible act must record the grounds it fired on, machine-readably.
 */
export type MergeOutcome =
  | { readonly kind: 'merged'; readonly sha: string; readonly evidence: readonly string[] }
  | {
      readonly kind: 'refused';
      readonly reason: string;
      /** The verdict as a FIELD, so the poll loop reads it by name, never by parsing prose. */
      readonly verdictState: PrVerdict['state'];
      readonly evidence: readonly string[];
    };

/**
 * The child environment for a READ-path gh call: pinned host, stripped
 * enterprise fallbacks, and NO token of any kind — reads run on the
 * session's own gh auth (keyring OAuth), writes on the minted token via
 * fetch. The split is the estate's standing identity discipline made
 * structural, and it is what keeps the `gh agent-task` review-run probe
 * alive: that surface refuses app installation tokens outright (F-156 —
 * the merge arm's first live firing died on exactly this, the probe
 * inheriting the minted GH_TOKEN). A stale ambient GH_TOKEN is stripped
 * for the same determinism the old write-path injection had: the read
 * identity is the keyring, never whatever token happened to be in the
 * environment. The host stays pinned (security H1): an ambient GH_HOST
 * would steer reads to another host while the merge PUT stays pinned to
 * api.github.com by construction (`merge-github-api.ts`) — the reading
 * and the act must run against the same host.
 */
export function readEnv(
  baseEnv: Readonly<Record<string, string | undefined>>,
): Record<string, string | undefined> {
  return {
    ...baseEnv,
    GH_HOST: 'github.com',
    GH_ENTERPRISE_TOKEN: undefined,
    GITHUB_ENTERPRISE_TOKEN: undefined,
    GH_TOKEN: undefined,
    GITHUB_TOKEN: undefined,
  };
}

/** Wraps an executor so every read-path gh call runs on the keyring, host-pinned. */
export function readExecutor(
  baseEnv: Readonly<Record<string, string | undefined>>,
): GhCommandExecutor {
  return (file, args, options) => execFileSync(file, args, { ...options, env: readEnv(baseEnv) });
}

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
  const token = minted.value.token;

  const target = mergeTarget(input);
  if (!target.ok) {
    return target;
  }
  const readReading = input.seams.readReading ?? defaultReadReading(input.seams.baseEnv);
  const reading = readReading({
    target: target.value,
    ghPath: input.seams.ghPath,
    expectedReviewers: input.expectedReviewers,
  });
  if (!reading.ok) {
    return reading;
  }

  return gateAndMerge({ input, reading: reading.value, token });
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
  } catch (cause) {
    return err(
      new Error(
        `merge target rejected by PR-target grammar: ${cause instanceof Error ? cause.message : String(cause)}`,
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
    } catch (cause) {
      return err(
        new ReadingUnavailableError(
          `PR state reading failed: ${cause instanceof Error ? cause.message : String(cause)}`,
        ),
      );
    }
  };
}

/** A typed refusal carrying the verdict it fired on, by name and by evidence. */
function refused(reason: string, verdict: PrVerdict): Result<MergeOutcome, Error> {
  return ok({ kind: 'refused', reason, verdictState: verdict.state, evidence: verdict.evidence });
}

/**
 * The verdict → eligibility → settings-gate → merge tail. Eligibility is
 * classified BEFORE the settings endpoint is touched: that GET is a fallible
 * network call, so asking it first turned every documented typed refusal
 * (MERGED, CHECKS-RED, …) into an operational failure whenever the read
 * failed. The decision core is untouched — `allowMergeCommit: true` asks it
 * one question, whether this verdict is mergeable at all — and the REAL
 * setting then goes through the same function, so the never-squash refusal
 * keeps its one canonical wording.
 */
async function gateAndMerge(context: {
  readonly input: MergeExecutionInput;
  readonly reading: PrStateReading;
  readonly token: string;
}): Promise<Result<MergeOutcome, Error>> {
  const { input, reading, token } = context;
  const verdict = computePrVerdict(reading, input.nowIso);
  const decide = (allowMergeCommit: boolean): MergeDecision =>
    decideMergeAction({ verdict, allowMergeCommit, expectedDeclared: reading.expectedDeclared });

  const eligible = decide(true);
  if (eligible.kind === 'refuse') {
    return refused(eligible.reason, verdict);
  }
  const fetchImpl = input.seams.fetchImpl ?? realFetch();
  const allowMergeCommit = await readMergeSettings(fetchImpl, token, input.identity);
  if (!allowMergeCommit.ok) {
    return allowMergeCommit;
  }
  const decision = decide(allowMergeCommit.value);
  if (decision.kind === 'refuse') {
    return refused(decision.reason, verdict);
  }

  const merged = await putMerge(fetchImpl, token, {
    identity: input.identity,
    prNumber: input.prNumber,
    headRefOid: reading.headRefOid,
  });
  if (!merged.ok) {
    return merged;
  }
  return ok({ kind: 'merged', sha: merged.value, evidence: verdict.evidence });
}
