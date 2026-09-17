import { err, ok, type Result } from '@oaknational/result';

import type { PathExists } from '../core/path-exists.js';
import { isLegalBranchName, realRefFormatOracle, type RefFormatOracle } from './ref-format.js';

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
  Pushes HEAD to the repository's GitHub remote as the BOT, over a freshly
  minted installation token — the whole per-session credential-helper recipe
  as one command. The push itself IS the git binary; this command injects the
  bot identity and refuses by type, and adds no transfer behaviour of its own.

  The token reaches git ONLY through a 0600 file that lives exactly as long
  as the transfer, read by a static credential helper; the child environment
  carries the file's path, never the token — the pre-push hook chain inherits
  that environment, and an env dump there must never print a live credential.
  Never in argv, never in a remote URL, never on either output stream. An
  empty minted token fails before any git call — an empty credential would
  make the helper emit an empty password and git would fall back to
  prompting, which is the signed-in human.

  There is no force flag and no --no-verify pass-through of any kind. Hooks
  run; a rejected non-fast-forward is answered by merging, never by
  overwriting.

  --branch names the target branch (default: the branch HEAD is on; a
  detached HEAD is a typed refusal, never a guess).
  --json puts EXACTLY the outcome object on stdout; git's transfer output is
  diagnostics and always goes to stderr.
  Exit map: 0 pushed, 1 operational failure (git's own non-zero exit, its
  stderr surfaced), 2 usage, 3 typed refusal — main and master refuse by
  name, because changes reach the default branch through pull requests.
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

/**
 * A value that reads as a flag is a forgotten `--branch` argument, never a
 * branch anyone meant to push: refuse it rather than cutting a remote branch
 * literally called `--json`. This guard is ours and it is about argv INTENT —
 * git's ref grammar has no opinion here (the oracle passes the full ref name
 * `refs/heads/--json`), and legality is its question, asked separately below.
 */
function readsAsFlag(value: string): boolean {
  return value.startsWith('-');
}

function isBranchName(value: string, oracle: RefFormatOracle): boolean {
  return !readsAsFlag(value) && isLegalBranchName(value, oracle);
}

interface CollectedPushFlags {
  branch?: string;
  json: boolean;
}

/** The seams this parser will construct for itself when not supplied one. */
export interface PushArgsSeams {
  readonly refFormatOracle?: RefFormatOracle;
  /** Existence probe for locating the git binary the default oracle asks. */
  readonly pathExists?: PathExists;
}

/**
 * The oracle enters HERE (the default-seam pattern the rest of this command
 * uses) rather than at the parser's head, so parsing an argv with no
 * `--branch` never reaches for a git binary at all. Constructing it can FAIL —
 * a machine with no trusted git has no oracle to ask — and that failure is
 * returned, never thrown: this function's whole contract is its Result.
 */
function consumeBranch(
  state: CollectedPushFlags,
  value: string | undefined,
  seams: PushArgsSeams,
): Result<undefined, Error> {
  // A repeated --branch is refused rather than last-wins: WHICH branch a push
  // lands on must never be decided by argv order.
  if (state.branch !== undefined) {
    return err(new Error('--branch given more than once — pass it exactly once'));
  }
  const oracle =
    seams.refFormatOracle === undefined
      ? realRefFormatOracle(seams.pathExists)
      : ok(seams.refFormatOracle);
  if (!oracle.ok) {
    return err(oracle.error);
  }
  if (value === undefined || !isBranchName(value, oracle.value)) {
    return err(new Error(`--branch needs a git branch name, got "${value ?? ''}"\n${PUSH_USAGE}`));
  }
  state.branch = value;
  return ok(undefined);
}

export function parsePushArgs(
  rest: readonly string[],
  seams: PushArgsSeams = {},
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
      return err(new Error(`unknown argument "${flag}"\n${PUSH_USAGE}`));
    }
    const consumed = consumeBranch(state, rest[index + 1], seams);
    if (!consumed.ok) {
      return consumed;
    }
    index += 1;
  }
  return ok({ branch: state.branch, json: state.json });
}
