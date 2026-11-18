import { err, ok, type Result } from '@oaknational/result';

import type { RetireReadings, TipState } from './retire-decision.js';
import {
  fetchRemoteObjects,
  isOnBase,
  listBranchRefs,
  probeRemoteBranch,
  readSymbolicRefs,
  readDefaultBranch,
} from './retire-git-read.js';
import type { RetireGit } from './retire-git-run.js';
import { caseCollisionsOf, type ListedRef } from './retire-parse.js';
import { worktreesUsing } from './retire-worktrees.js';

/**
 * Gather every reading the retire decision needs. The local listing comes
 * first, before anything is fetched: no ref this command may delete is
 * written here, the cached tracking tip is read BEFORE the remote's objects
 * arrive, and they arrive by an objects-only fetch, so the decision proves
 * the tip that was actually cached. Every reading is gathered before the
 * decision runs, so even a refusal that needs no network (a branch in use, a
 * case collision, a symbolic ref) is reached after the remote reads.
 *
 * A failed read is a failure (exit 1), never a refusal: refusals are the
 * decision's, over readings that were all read.
 */
export async function gatherReadings(
  retire: RetireGit,
  branch: string,
): Promise<Result<RetireReadings, Error>> {
  const own = [`refs/heads/${branch}`, `refs/remotes/origin/${branch}`] as const;
  const names = await readLocalNames(retire, own);
  if (!names.ok) {
    return names;
  }
  const { listing, symbolic } = names.value;
  const inUse = await worktreesUsing(retire, branch);
  if (!inUse.ok) {
    return inUse;
  }
  const base = await readDefaultBranch(retire);
  if (!base.ok) {
    return base;
  }
  const remoteSha = await readRemoteTip(retire, branch);
  if (!remoteSha.ok) {
    return remoteSha;
  }
  const tips = await provenTips(retire, base.value.sha, {
    local: listing.get(own[0])?.sha,
    tracking: listing.get(own[1])?.sha,
    remote: remoteSha.value,
  });
  if (!tips.ok) {
    return tips;
  }
  return ok({
    branch,
    base: base.value,
    ...tips.value,
    inUseBy: inUse.value,
    caseCollisions: caseCollisionsOf(listing, branch),
    symbolic,
  });
}

interface LocalNames {
  readonly listing: ReadonlyMap<string, ListedRef>;
  readonly symbolic: readonly string[];
}

/** Every local and tracking ref, and which of the branch's own names are symbolic: read before anything is fetched. */
async function readLocalNames(
  retire: RetireGit,
  own: readonly string[],
): Promise<Result<LocalNames, Error>> {
  const listing = await listBranchRefs(retire);
  if (!listing.ok) {
    return listing;
  }
  const symbolic = await readSymbolicRefs(retire, own);
  return symbolic.ok ? ok({ listing: listing.value, symbolic: symbolic.value }) : symbolic;
}

/** The remote branch's tip, its objects fetched to test, or undefined when the remote has no such branch. */
async function readRemoteTip(
  retire: RetireGit,
  branch: string,
): Promise<Result<string | undefined, Error>> {
  const probe = await probeRemoteBranch(retire, branch);
  if (!probe.ok) {
    return probe;
  }
  if (probe.value.kind === 'absent') {
    return ok(undefined);
  }
  const fetched = await fetchRemoteObjects(retire, branch);
  return fetched.ok ? ok(probe.value.sha) : fetched;
}

type TipShas = Readonly<Record<'local' | 'tracking' | 'remote', string | undefined>>;
type Tips = Readonly<Record<'local' | 'tracking' | 'remote', TipState | undefined>>;

/** Ask git whether each existing tip is an ancestor of the default's tip. */
async function provenTips(
  retire: RetireGit,
  baseSha: string,
  shas: TipShas,
): Promise<Result<Tips, Error>> {
  const tips: Record<'local' | 'tracking' | 'remote', TipState | undefined> = {
    local: undefined,
    tracking: undefined,
    remote: undefined,
  };
  for (const key of ['local', 'tracking', 'remote'] as const) {
    const sha = shas[key];
    if (sha === undefined) {
      continue;
    }
    const onBase = await isOnBase(retire, sha, baseSha);
    if (!onBase.ok) {
      return err(onBase.error);
    }
    tips[key] = { sha, onBase: onBase.value };
  }
  return ok(tips);
}
