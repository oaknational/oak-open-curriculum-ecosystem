import { spawnSync } from 'node:child_process';

import { err, ok, type Result } from '@oaknational/result';

import type { PathExists } from '../core/path-exists.js';
import { resolveTrustedGit } from '../core/trusted-git.js';

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

/** The legality question as a seam, so callers can pin behaviour without a git binary. */
export type RefFormatOracle = (fullRefName: string) => boolean;

/**
 * There is no oracle to ask: no trusted git binary was found. Named as a type
 * so the front door can tell it apart from a malformed argument — a machine
 * whose git sits outside the trusted directories has an OPERATIONAL problem,
 * and answering it with a usage dump sends the operator to fix their spelling.
 */
export class RefFormatOracleUnavailableError extends Error {}

/**
 * git's own answer. The name is passed as a FULL ref (`refs/heads/<branch>`)
 * because that is the form `git-check-ref-format` documents its rules
 * against; `--branch` is a different question (it also expands `@{-1}`-style
 * shorthand against a repository, which a name being validated must not get).
 *
 * The binary is resolved ONCE, here, and its throw translated at this one
 * boundary (ADR-088, the pattern `resolveGitContext` uses): resolving inside
 * the returned closure would let the throw escape through whatever
 * Result-typed function later asks the question.
 */
export function realRefFormatOracle(exists?: PathExists): Result<RefFormatOracle, Error> {
  let gitPath: string;
  try {
    gitPath = exists === undefined ? resolveTrustedGit() : resolveTrustedGit(exists);
  } catch (cause) {
    return err(
      new RefFormatOracleUnavailableError(cause instanceof Error ? cause.message : String(cause)),
    );
  }
  return ok((fullRefName) => {
    const result = spawnSync(gitPath, ['check-ref-format', fullRefName], {
      stdio: ['ignore', 'ignore', 'ignore'],
    });
    return result.error === undefined && result.status === 0;
  });
}

/** Whether `branch` is a legal branch name, per git. */
export function isLegalBranchName(branch: string, oracle: RefFormatOracle): boolean {
  return oracle(`refs/heads/${branch}`);
}
