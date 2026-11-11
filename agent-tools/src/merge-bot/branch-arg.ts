import { err, ok, type Result } from '@oaknational/result';

import { printable } from '../pr-watch/printable.js';
import { gitRefFormatOracle, isLegalBranchName, type RefFormatOracle } from './ref-format.js';

/**
 * The `--branch <name>` contract `merge-bot push` and `merge-bot retire`
 * share: given exactly once, never flag-shaped, and legal by git's own ref
 * grammar (asked of git through the oracle).
 */

/**
 * The default branch names no merge-bot command pushes to or retires: the
 * never-commit-to-main rule as behaviour. Both commands compare them in any
 * case, because a case-insensitive filesystem resolves `Main` to `main`.
 */
export const DEFAULT_BRANCH_NAMES: ReadonlySet<string> = new Set(['main', 'master']);

/**
 * The branch names `merge-bot retire` and `merge-bot pull-request open` act
 * on: ASCII letters, digits, dot, underscore, hyphen and slash. A URL-safety
 * policy on top of git's own ref grammar (which `ref-format.ts` asks git
 * for), not a replacement for it: git accepts `#` and `%` in a branch name,
 * and a URL or a server decoding a path would read either as something
 * else. A name outside the list is handled by hand.
 */
const URL_SAFE_BRANCH = /^[A-Za-z0-9._/-]+$/;

/** Whether a branch name may travel in a URL path or query as it is (see `URL_SAFE_BRANCH`). */
export function isUrlSafeBranchName(name: string): boolean {
  return URL_SAFE_BRANCH.test(name);
}

/** The seams the branch check will construct for itself when not supplied one. */
export interface BranchArgSeams {
  readonly refFormatOracle?: RefFormatOracle;
}

/**
 * A value that reads as a flag is a forgotten `--branch` argument, never a
 * branch anyone meant: refuse it rather than acting on a branch literally
 * called `--json`. This guard is about argv INTENT; git's ref grammar has no
 * opinion here (the oracle passes the full ref name `refs/heads/--json`), and
 * legality is its question, asked separately.
 */
function readsAsFlag(value: string): boolean {
  return value.startsWith('-');
}

/**
 * Read one `--branch` value. The oracle enters HERE rather than at the
 * parser's head, so an argv with no `--branch` never runs git at all. Asking
 * it can FAIL (a machine with no git on `PATH` has no answer to give), and
 * that failure is returned, never thrown.
 *
 * @param current - the branch already read, if any: a repeat is refused, so
 *   which branch a command acts on is never decided by argv order.
 * @param usage - the command's usage text, appended to a refusal.
 */
export function readBranchArg(
  current: string | undefined,
  value: string | undefined,
  seams: BranchArgSeams,
  usage: string,
): Result<string, Error> {
  if (current !== undefined) {
    return err(new Error('--branch given more than once — pass it exactly once'));
  }
  const notABranch = new Error(
    `--branch needs a git branch name, got "${printable(value ?? '')}"\n${usage}`,
  );
  if (value === undefined || readsAsFlag(value)) {
    return err(notABranch);
  }
  const legal = isLegalBranchName(value, seams.refFormatOracle ?? gitRefFormatOracle());
  if (!legal.ok) {
    return err(legal.error);
  }
  return legal.value ? ok(value) : err(notABranch);
}
