import type { PushAttempt } from './push-attempts.js';
import type { PushGitReads } from './push-git.js';
import type { PushToken } from './push-mint.js';
import { settleCommit } from './push-target-branch.js';
import { deadlinePassed } from './token-deadline.js';

/**
 * What must hold before each attempt of a push starts, the first included.
 *
 * The token's own expiry leaves room to start (R5: a credential's actual
 * expiry bounds every iteration, including the first). One token serves every
 * attempt, so the retry's waits and whatever came before them count against
 * it.
 *
 * HEAD still names the commit the push settled. The push hands git that
 * commit, never `HEAD`, so a commit made during a wait is not pushed in its
 * place; but the pre-push hook validates the checkout, never the commit git
 * is handed. An attempt made after HEAD moved would therefore land a commit
 * the gate did not run on, so it is not made.
 *
 * @packageDocumentation
 */

/** What an attempt is checked against. */
export interface AttemptGuards {
  readonly token: PushToken;
  /** The commit settled before the mint. */
  readonly commit: string;
  readonly reads: Pick<PushGitReads, 'headCommit'>;
  /** The wall clock, as an ISO instant. */
  readonly nowIso: () => string;
}

/**
 * Why the next attempt must not start, or undefined when it may.
 *
 * @param guards - The token and its deadline, the settled commit, git's read of HEAD and the clock.
 * @returns The reason to report, naming the cure, or undefined.
 */
async function attemptRefusal(guards: AttemptGuards): Promise<string | undefined> {
  const head = settleCommit(await guards.reads.headCommit());
  if (!head.ok) {
    return head.error.message;
  }
  if (head.value !== guards.commit) {
    return `HEAD moved from ${guards.commit} to ${head.value} after this push settled its commit; the pre-push hook validates the checkout, so pushing ${guards.commit} now would land a commit the gate did not run on: stopping; run the push again`;
  }
  // The clock is read last: no read stands between this check and the attempt.
  const now = guards.nowIso();
  const { deadline } = guards.token;
  return deadlinePassed(now, deadline)
    ? `the push's token expires ${deadline.tokenExpiresAt}, so an attempt must start by ${deadline.atIso}, and it is ${now}: stopping rather than starting a transfer that could meet the expiry; run the push again`
    : undefined;
}

/**
 * An attempt that runs only once its guards hold. A guard that does not hold
 * is reported and ends the push as an operational failure, never a retry.
 *
 * @param guards - What each attempt is checked against.
 * @param stderr - Where a refusal is reported.
 * @param attempt - The transfer itself.
 */
export function guardedAttempt(
  guards: AttemptGuards,
  stderr: Pick<NodeJS.WriteStream, 'write'>,
  attempt: () => Promise<PushAttempt>,
): () => Promise<PushAttempt> {
  return async () => {
    const stop = await attemptRefusal(guards);
    if (stop === undefined) {
      return attempt();
    }
    stderr.write(`merge-bot push: ${stop}\n`);
    return { kind: 'ended', exit: 1 };
  };
}
