import { err, ok, type Result } from '@oaknational/result';

import { parsePrTarget, type PrTarget } from '../pr-watch/gh.js';
import type { UnavailableInput } from '../pr-watch/state-compose.js';
import { readPrStateReading, type ReadPrStateOptions } from '../pr-watch/state-gh.js';
import type { PrStateReading, PrVerdict } from '../pr-watch/state-types.js';
import { decideMergeAction, type MergeDecision } from './merge-decision.js';
import { realFetch } from './github-fetch.js';
import { readMergeSettings, putMerge } from './merge-github-api.js';
import { readExecutor } from './merge-read-env.js';
import { isBotAuthored, resolveVerdict } from './merge-records-checks.js';
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
  readonly ghPath?: string;
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
  /** DECLARED expected reviewer set — required; empty only when declared `none` (expect-flag.ts). */
  readonly expectedReviewers: readonly string[];
  readonly nowIso: string;
  readonly unavailable?: UnavailableInput | undefined;
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
  const reading = readReading({
    target: target.value,
    ghPath: input.seams.ghPath,
    expectedReviewers: input.expectedReviewers,
    unavailable: input.unavailable,
  });
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

/** The decision's refusal carried as the outcome, with the verdict it fired on. */
type Refusal = Extract<MergeDecision, { kind: 'refuse' }>;
function refused(decision: Refusal, verdict: PrVerdict): Result<MergeOutcome, Error> {
  const { state: verdictState, evidence } = verdict;
  return ok({ ...decision, kind: 'refused', verdictState, evidence });
}

/**
 * The verdict → class → eligibility → settings-gate → merge tail. The base's
 * required contexts are read on every verdict the bot's own pull request
 * could merge on, the change class only where it decides
 * (`merge-records-checks.ts`); a failed read there is the transient class the
 * poll loop retries. Eligibility is classified BEFORE the settings GET (a
 * fallible call that once turned every typed refusal into an operational
 * failure): the decision is asked with `allowMergeCommit: true` first, then
 * with the REAL setting, so the never-squash refusal keeps its one wording. A
 * merge the class opened carries its ground beside the verdict's lines.
 */
async function gateAndMerge(context: {
  readonly input: MergeExecutionInput;
  readonly reading: PrStateReading;
  readonly token: string;
}): Promise<Result<MergeOutcome, Error>> {
  const { input, reading, token } = context;
  const fetchImpl = input.seams.fetchImpl ?? realFetch();
  const resolved = await resolveVerdict({
    reading,
    appSlug: input.appSlug,
    nowIso: input.nowIso,
    fetchImpl,
    token,
    target: { identity: input.identity, prNumber: input.prNumber },
  });
  if (!resolved.ok) {
    const message = `door reading failed: ${resolved.error.message}`;
    return err(new ReadingUnavailableError(message, { cause: resolved.error }));
  }
  const { verdict, changeClass } = resolved.value;
  const decide = (allowMergeCommit: boolean): MergeDecision =>
    decideMergeAction({
      verdict,
      allowMergeCommit,
      expectedDeclared: reading.expectedDeclared,
      declaredEmpty: reading.expectedReviewers.length === 0,
      botAuthored: isBotAuthored(reading.author, input.appSlug),
      changeClass,
    });

  const eligible = decide(true);
  if (eligible.kind === 'refuse') {
    return refused(eligible, verdict);
  }
  const allowMergeCommit = await readMergeSettings(fetchImpl, token, input.identity);
  if (!allowMergeCommit.ok) {
    return allowMergeCommit;
  }
  const decision = decide(allowMergeCommit.value);
  if (decision.kind === 'refuse') {
    return refused(decision, verdict);
  }
  return mergeVerdicted({ fetchImpl, token, input, reading, verdict, ground: decision.ground });
}

/** The merge PUT at the verdicted tip; the outcome's evidence is the verdict's lines plus the class ground, when one opened the door. */
async function mergeVerdicted(context: {
  readonly fetchImpl: GithubApiFetch;
  readonly token: string;
  readonly input: MergeExecutionInput;
  readonly reading: PrStateReading;
  readonly verdict: PrVerdict;
  readonly ground: string | undefined;
}): Promise<Result<MergeOutcome, Error>> {
  const { fetchImpl, token, input, reading, verdict, ground } = context;
  const merged = await putMerge(fetchImpl, token, {
    identity: input.identity,
    prNumber: input.prNumber,
    headRefOid: reading.headRefOid,
  });
  if (!merged.ok) {
    return merged;
  }
  const evidence = ground === undefined ? verdict.evidence : [...verdict.evidence, ground];
  return ok({ kind: 'merged', sha: merged.value, evidence });
}
