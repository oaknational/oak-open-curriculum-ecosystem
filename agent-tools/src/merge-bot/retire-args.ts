import { err, ok, type Result } from '@oaknational/result';

import { printable } from '../pr-watch/printable.js';
import { isUrlSafeBranchName, readBranchArg, type BranchArgSeams } from './branch-arg.js';

/**
 * The argv contract for `merge-bot retire`. Two flags: `--branch`, required,
 * and `--json`. A delete has no "the branch HEAD is on" default, and a
 * refusal is surfaced, never overridden, so `--force` refuses by name.
 */

export interface RetireArgs {
  readonly branch: string;
  readonly json: boolean;
}

export const RETIRE_USAGE = `merge-bot retire --branch <name> [--json]
  Retires a merged branch: proves every name it has (the local branch, the
  cached origin tracking ref, the remote branch) is an ancestor of the remote
  default branch's tip, then deletes each by compare-and-swap. The remote
  branch is deleted as the BOT, through GraphQL updateRefs with the proven sha
  as its beforeOid, so a push landing after the proof is kept, not deleted.
  Every proof runs before any delete; the remote goes first, and the local
  names only once the remote reads back absent through GitHub. At the mint,
  GitHub must read the branch tip and the default branch's name and tip in
  the bot's repository exactly as they were proven.

  No ref this command may delete is written while reading: a remote branch's
  objects arrive by an objects-only fetch. The reads refresh the default
  branch's tracking ref and origin/HEAD, and follow no tag. The bot token is
  minted only when a remote delete is due, and only with the branch-retire
  scope (contents).

  Refuses (exit 3, nothing deleted): main, master, HEAD and the default
  branch in any case; a tip that is not an ancestor of the default; a branch
  checked out, or mid-rebase or bisect, in any worktree; a local or tracking
  ref that is symbolic; a name another ref matches when case is ignored; an
  origin that is not the bot identity's repository; a remote, or a default
  branch, that GitHub reads at the mint as moved after its proof. It does not
  look for open pull requests: the judgement that a branch is merged and
  unwanted is the caller's. Names are limited to ASCII letters, digits and
  . _ / -.

  --json puts EXACTLY the outcome object on stdout; diagnostics go to stderr.
  Exit map: 0 retired (or nothing to retire), 1 operational failure, 2 usage,
  3 refusal. A failure after a delete may have happened reports every name:
  deleted, absent, kept (it moved, or was re-created, at the sha it holds),
  failed (the delete did not take), unknown, or not reached. A delete GitHub
  does not accept, read back at another sha, is such a failure: GitHub's
  error cannot say whether a delete happened first. The branch's config
  section goes once it has no local ref; a re-run removes one a failed
  removal left.
`;

/** Flags that will never exist here, and why. */
const REFUSED_FLAGS: Readonly<Record<string, string>> = {
  '--force':
    'there is no force flag: a refusal names a tip or a state to surface, never to override',
  '-f': 'there is no force flag: a refusal names a tip or a state to surface, never to override',
};

interface CollectedRetireFlags {
  readonly branch: string | undefined;
  readonly json: boolean;
}

/** Walk the argv: refused flags by name, `--json`, and `--branch` read once. */
function collectFlags(
  rest: readonly string[],
  seams: BranchArgSeams,
): Result<CollectedRetireFlags, Error> {
  let branch: string | undefined;
  let json = false;
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index] ?? '';
    const refusal = REFUSED_FLAGS[flag];
    if (refusal !== undefined) {
      return err(new Error(`${flag} is not a flag of this command — ${refusal}`));
    }
    if (flag === '--json') {
      json = true;
      continue;
    }
    if (flag !== '--branch') {
      return err(new Error(`unknown argument "${printable(flag)}"\n${RETIRE_USAGE}`));
    }
    const read = readBranchArg(branch, rest[index + 1], seams, RETIRE_USAGE);
    if (!read.ok) {
      return read;
    }
    branch = read.value;
    index += 1;
  }
  return ok({ branch, json });
}

export function parseRetireArgs(
  rest: readonly string[],
  seams: BranchArgSeams = {},
): Result<RetireArgs, Error> {
  const collected = collectFlags(rest, seams);
  if (!collected.ok) {
    return collected;
  }
  const { branch, json } = collected.value;
  if (branch === undefined) {
    return err(new Error(`--branch is required\n${RETIRE_USAGE}`));
  }
  if (!isUrlSafeBranchName(branch)) {
    return err(
      new Error(
        `"${printable(branch)}" holds characters outside ASCII letters, digits and . _ / - ; retire it by hand`,
      ),
    );
  }
  return ok({ branch, json });
}
