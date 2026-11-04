import type { Result } from '@oaknational/result';

import type { GithubApiFetch } from './mint-installation-token.js';
import type { BotRepository } from './resolve-identity.js';
import {
  baseMismatch,
  classifyRemoteReadback,
  classifyRemoteReread,
  type PlannedDelete,
  type RemoteDeleteOutcome,
  type RetirePlan,
} from './retire-decision.js';
import type { RetireGitPort } from './retire-git-port.js';
import { readRemoteRefByApi, requestRefDelete } from './retire-github-api.js';
import type { DefaultBranchReading } from './retire-parse.js';
import type { NameReport, RetireOutcome } from './retire-report.js';

/**
 * The retire command's remote write: the branch deleted by compare-and-swap
 * as the bot, before any local name is touched. Every remote read here goes
 * through GitHub, in the bot identity's own repository, the one the delete
 * lands in: the re-read at the mint (the branch tip, and the default
 * branch's name and tip, against the proofs) and the read-back after the
 * delete. The outcome is the read-back, never GitHub's answer to the delete:
 * a stale `beforeOid` answers a generic error, and a 5xx can follow a delete
 * that happened.
 */

/** What the writes need beyond the plan. */
export interface ExecuteSeams {
  /** git, for the in-use check before the local deletes and the local writes. */
  readonly git: RetireGitPort;
  /** Mints the `branch-retire` token; called only when a remote delete is planned. */
  readonly mintToken: () => Promise<Result<string, Error>>;
  readonly fetchImpl: GithubApiFetch;
  readonly repo: BotRepository;
}

/** The branch and the default it was proven on, as the caller names them. */
export interface Proven {
  readonly branch: string;
  readonly base: DefaultBranchReading;
}

/** The proven branch with the plan being carried out. */
export interface Context extends Proven {
  readonly plan: RetirePlan;
}

export const ABSENT: NameReport = { state: 'absent' };

export type RemoteStep =
  | { readonly kind: 'done'; readonly report: NameReport }
  | { readonly kind: 'stop'; readonly outcome: RetireOutcome };

/** The remote re-read under the bot's token, ready for its delete. */
type Reread =
  { readonly kind: 'ready'; readonly token: string; readonly repositoryId: string } | RemoteStep;

function stopWith(context: Context, kind: 'failed' | 'refused', reason: string): RemoteStep {
  return { kind: 'stop', outcome: { kind, branch: context.branch, reason } };
}

/**
 * Mint the token and re-read the remote through the identity's repository.
 * A default branch other than the proven one refuses, as does a branch that
 * moved; a branch already gone is done.
 */
async function mintAndReread(
  target: PlannedDelete,
  context: Context,
  seams: ExecuteSeams,
): Promise<Reread> {
  const token = await seams.mintToken();
  if (!token.ok) {
    const reason = `minting the branch-retire token: ${token.error.message}; nothing was deleted`;
    return stopWith(context, 'failed', reason);
  }
  const state = await readRemoteRefByApi(seams.fetchImpl, token.value, seams.repo, context.branch);
  if (!state.ok) {
    return stopWith(context, 'failed', `${state.error.message}; nothing was deleted`);
  }
  const mismatch = baseMismatch(context.base, state.value.defaultBranch);
  if (mismatch !== undefined) {
    return stopWith(context, 'refused', `${mismatch}; nothing was deleted`);
  }
  const reread = classifyRemoteReread(target, state.value.ref);
  if (reread === 'moved') {
    const reason = `the remote branch moved after its proof (it was at ${target.expectedSha}); nothing was deleted`;
    return stopWith(context, 'refused', reason);
  }
  return reread === 'absent'
    ? { kind: 'done', report: ABSENT }
    : { kind: 'ready', token: token.value, repositoryId: state.value.repositoryId };
}

/** Delete the remote branch by compare-and-swap, if planned, and read it back through GitHub. */
export async function retireRemote(
  target: PlannedDelete | undefined,
  context: Context,
  seams: ExecuteSeams,
): Promise<RemoteStep> {
  if (target === undefined) {
    return { kind: 'done', report: ABSENT };
  }
  const ready = await mintAndReread(target, context, seams);
  if (ready.kind !== 'ready') {
    return ready;
  }
  const requested = await requestRefDelete(
    seams.fetchImpl,
    ready.token,
    ready.repositoryId,
    target,
  );
  const readback = await readRemoteRefByApi(
    seams.fetchImpl,
    ready.token,
    seams.repo,
    context.branch,
  );
  const detail = requested.ok ? '' : ` (${requested.error.message})`;
  if (!readback.ok) {
    const reason = `the remote branch's state is unknown after the delete request${detail}: ${readback.error.message}; nothing local was deleted; re-run to finish`;
    return stopPartial(context, { state: 'unknown' }, reason);
  }
  const outcome = classifyRemoteReadback(target, requested.ok, readback.value.ref);
  return remoteStepFor(outcome, { target, context, detail, accepted: requested.ok });
}

/** A partial retire after the remote step: every name reported, the planned local ones not reached. */
export function partialOutcome(
  context: Context,
  remote: NameReport,
  reason: string,
): RetireOutcome {
  const untouched = (planned: PlannedDelete | undefined): NameReport =>
    planned === undefined ? ABSENT : { state: 'not-reached' };
  return {
    kind: 'partial',
    branch: context.branch,
    base: context.base,
    names: {
      remote,
      tracking: untouched(context.plan.tracking),
      local: untouched(context.plan.local),
    },
    reason,
  };
}

function stopPartial(context: Context, remote: NameReport, reason: string): RemoteStep {
  return { kind: 'stop', outcome: partialOutcome(context, remote, reason) };
}

interface Readback {
  readonly target: PlannedDelete;
  readonly context: Context;
  /** GitHub's error text for a delete it did not accept, or empty. */
  readonly detail: string;
  readonly accepted: boolean;
}

/** The remote delete's read-back as the executor's next step. */
function remoteStepFor(outcome: RemoteDeleteOutcome, readback: Readback): RemoteStep {
  const { target, context, detail, accepted } = readback;
  switch (outcome.kind) {
    case 'deleted':
      return { kind: 'done', report: { state: 'deleted', sha: target.expectedSha } };
    case 'absent':
      return { kind: 'done', report: ABSENT };
    case 'unchanged':
      return stopWith(
        context,
        'failed',
        accepted
          ? `GitHub accepted the delete, but the remote branch still reads at ${target.expectedSha}; nothing local was deleted; re-run`
          : `the remote branch still reads at ${target.expectedSha} after a delete GitHub did not accept${detail}; nothing local was deleted`,
      );
    case 'replaced':
      return stopPartial(
        context,
        { state: 'kept', sha: outcome.sha },
        `GitHub deleted the remote branch at ${target.expectedSha}, but it now reads at ${outcome.sha}: another writer re-created it; nothing local was deleted`,
      );
    default: {
      // GitHub's error cannot say whether a delete happened first, so this is
      // reported as what reads back, never as a refusal (nothing deleted).
      const moved: Extract<RemoteDeleteOutcome, { kind: 'moved' }> = outcome;
      return stopPartial(
        context,
        { state: 'kept', sha: moved.sha },
        `the remote branch reads at ${moved.sha}, not ${target.expectedSha} as proven, after a delete GitHub did not accept${detail}: it moved after its proof, or was re-created after a delete that happened behind the error; nothing local was deleted`,
      );
    }
  }
}
