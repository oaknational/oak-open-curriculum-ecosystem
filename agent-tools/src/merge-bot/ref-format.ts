import { spawnSync } from 'node:child_process';

import { err, ok, type Result } from '@oaknational/result';

/**
 * Ref-name legality, asked of the system that OWNS it.
 *
 * git publishes `git check-ref-format` for exactly this question, and its
 * grammar is not summarisable: the rules interact per slash-separated
 * component, so a regex written from the prose admits shapes git rejects —
 * `foo.`, `foo//bar`, `foo/.bar`, `foo.lock/bar` all pass a plausible
 * hand grammar and all fail the oracle. Asking the oracle at time of use
 * (R9) means this file never has to track git's grammar; a git upgrade that
 * changes it changes this answer with no code change here.
 *
 * The oracle's output volume is fixed by git's own contract — nothing on
 * success, one diagnostic line on failure — so this is a controlled-output
 * child and `spawnSync`'s default buffer is a fact about it, not an
 * unexamined seam (R1 binds output the tool does NOT control).
 */

/**
 * There is no answer to read: git could not be run to ask. Named as a type so
 * the front door can tell it apart from a malformed argument — a machine with
 * no git on `PATH` has an OPERATIONAL problem, and answering it with a usage
 * dump sends the operator to fix their spelling.
 */
export class RefFormatOracleUnavailableError extends Error {}

/** The legality question as a seam: git's answer, or the failure to ask it. */
export type RefFormatOracle = (
  fullRefName: string,
) => Result<boolean, RefFormatOracleUnavailableError>;

/** The slice of a `git check-ref-format` run the oracle reads. */
export interface CheckRefFormatRun {
  readonly status: number | null;
  readonly error?: Error;
}

/** The real run: git by name, with `PATH` as the trust root. */
function runCheckRefFormat(fullRefName: string): CheckRefFormatRun {
  return spawnSync('git', ['check-ref-format', fullRefName], {
    stdio: ['ignore', 'ignore', 'ignore'],
  });
}

/**
 * git's own answer. The name is passed as a FULL ref (`refs/heads/<branch>`)
 * because that is the form `git-check-ref-format` documents its rules
 * against; `--branch` is a different question (it also expands `@{-1}`-style
 * shorthand against a repository, which a name being validated must not get).
 *
 * A run that fails to start (no git on `PATH`) or ends without an exit status
 * (killed by a signal) is the unavailable error, never an illegal name: git
 * gave no answer. The failure is returned, never thrown (ADR-088).
 */
export function gitRefFormatOracle(
  run: (fullRefName: string) => CheckRefFormatRun = runCheckRefFormat,
): RefFormatOracle {
  return (fullRefName) => {
    const result = run(fullRefName);
    if (result.error !== undefined) {
      return err(
        new RefFormatOracleUnavailableError(
          `git check-ref-format could not run (${result.error.message}); install git or put it on PATH`,
        ),
      );
    }
    if (result.status === null) {
      return err(
        new RefFormatOracleUnavailableError('git check-ref-format ended without an exit status'),
      );
    }
    return ok(result.status === 0);
  };
}

/** Whether `branch` is a legal branch name, per git. */
export function isLegalBranchName(
  branch: string,
  oracle: RefFormatOracle,
): Result<boolean, RefFormatOracleUnavailableError> {
  return oracle(`refs/heads/${branch}`);
}
