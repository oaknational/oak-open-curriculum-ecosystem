import { err, ok, type Result } from '@oaknational/result';

import { printable } from '../pr-watch/printable.js';
import { readBranchArg, type BranchArgSeams } from './branch-arg.js';

/**
 * The argv contract for `merge-bot push`. Split from `push-cli.ts` to keep
 * both files inside the size and complexity gates (the seam `merge-args.ts`
 * records for the merge action).
 *
 * The surface is deliberately TWO flags. Every push option that exists to get
 * around something — `--force`, `--force-with-lease`, `--no-verify` — is
 * absent by design and refuses BY NAME, so an operator reaching for one is
 * told there is no bypass here rather than being handed a generic
 * unknown-flag message they might read as a typo.
 */

export interface PushArgs {
  /** The target branch; absent means "whichever branch HEAD is on", resolved by the action. */
  readonly branch?: string;
  readonly json: boolean;
}

export const PUSH_USAGE = `merge-bot push [--branch <name>] [--json]
  Pushes the commit HEAD names to the repository's GitHub remote as the BOT,
  over one freshly minted installation token — the whole per-session
  credential-helper recipe as one command. The push itself IS the git binary;
  this command injects the bot identity and refuses by type. It pins what git
  is asked to write: that one commit, to refs/heads/<branch> alone, with tag
  following and submodule recursion turned off whatever the checkout
  configures. Its one addition is a bounded retry: when GitHub refuses the
  push at git's first request, before the pre-push hook runs, because the
  fresh token has not yet reached every edge, it runs git again with the same
  token after each wait on GitHub's advised backoff, naming each retry on
  stderr. Before each attempt, the first included, it stops (exit 1) when the
  token is within five minutes of its expiry, or when HEAD no longer names
  the commit the push began with: the pre-push hook validates the checkout,
  never the commit git is handed.

  The token reaches git ONLY through a 0600 file that lives exactly as long
  as the transfer, read by a static credential helper; the child environment
  carries the file's path, never the token — the pre-push hook chain inherits
  that environment, and an env dump there must never print a live credential.
  Never in argv, never in a remote URL, never on either output stream. An
  empty minted token fails before the transfer — an empty credential would
  make the helper emit an empty password and git would fall back to
  prompting, which is the signed-in human.

  There is no force flag and no --no-verify pass-through of any kind. Hooks
  run; a rejected non-fast-forward is answered by merging, never by
  overwriting.

  --branch names the target branch (default: the branch HEAD is on; a
  detached HEAD is a typed refusal, never a guess). The branch named must be
  the one HEAD is on: the push writes HEAD's commit under the name given, so
  another name is a typed refusal and nothing is minted or pushed. The push
  always writes refs/heads/<branch>, so a full ref name (refs/...) refuses.
  --json puts EXACTLY the outcome object on stdout; git's transfer output is
  diagnostics and always goes to stderr.
  Exit map: 0 pushed, 1 operational failure (git's own non-zero exit, its
  stderr surfaced; or origin's default branch unreadable, or origin not the
  repository the push goes to), 2 usage, 3 typed refusal — main, master and
  the default branch origin names refuse in any case, because changes reach
  the default branch through pull requests.
`;

/**
 * Flags that will never exist here, and why. Named individually so the
 * refusal teaches; a generic "unknown flag" reads as a typo and invites a
 * retry with a different spelling.
 */
const REFUSED_FLAGS: Readonly<Record<string, string>> = {
  '--force': 'there is no force flag: a rejected push is answered by merging, never by overwriting',
  '-f': 'there is no force flag: a rejected push is answered by merging, never by overwriting',
  '--force-with-lease':
    'there is no force flag: a rejected push is answered by merging, never by overwriting',
  '--no-verify':
    'hooks run on every bot push — the pre-push gates are the point of pushing through this command',
};

interface CollectedPushFlags {
  branch?: string;
  json: boolean;
}

export function parsePushArgs(
  rest: readonly string[],
  seams: BranchArgSeams = {},
): Result<PushArgs, Error> {
  const state: CollectedPushFlags = { json: false };
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index] ?? '';
    const refusal = REFUSED_FLAGS[flag];
    if (refusal !== undefined) {
      return err(new Error(`${flag} is not a flag of this command — ${refusal}`));
    }
    if (flag === '--json') {
      state.json = true;
      continue;
    }
    if (flag !== '--branch') {
      return err(new Error(`unknown argument "${printable(flag)}"\n${PUSH_USAGE}`));
    }
    const branch = readBranchArg(state.branch, rest[index + 1], seams, PUSH_USAGE);
    if (!branch.ok) {
      return branch;
    }
    state.branch = branch.value;
    index += 1;
  }
  return ok({ branch: state.branch, json: state.json });
}
