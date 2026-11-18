import { describe, expect, it } from 'vitest';

import type { GitCommandResult } from './git-executor.js';
import { guardedAttempt } from './push-attempt-guards.js';
import type { PushAttempt } from './push-attempts.js';
import type { TokenDeadline } from './token-deadline.js';

/**
 * `guardedAttempt` over git's read of HEAD and a clock, each injected: the
 * transfer runs only while HEAD names the settled commit and the token's
 * deadline has not passed, and a guard that does not hold ends the push as an
 * operational failure, never as a refusal the retry would try again.
 */

const COMMIT = 'def5678def5678def5678def5678def5678def56';
/** Another commit's full object name: where HEAD has moved to. */
const MOVED = 'abc1234abc1234abc1234abc1234abc1234abc12';
const TOKEN = 'sekrit-installation-token';
const EXPIRES_AT = '2026-08-06T10:00:00Z';

const DEADLINE: TokenDeadline = {
  atEpochMs: Date.parse('2026-08-06T09:55:00.000Z'),
  atIso: '2026-08-06T09:55:00.000Z',
  tokenExpiresAt: EXPIRES_AT,
};
const BEFORE_DEADLINE = '2026-08-06T09:00:00.000Z';
const AFTER_DEADLINE = '2026-08-06T09:55:00.001Z';

/** What the transfer answers when it runs: an exit no guard ends the push with. */
const TRANSFERRED: PushAttempt = { kind: 'ended', exit: 0 };
/** How a guard that does not hold ends the push. */
const STOPPED: PushAttempt = { kind: 'ended', exit: 1 };

function answered(stdout: string): GitCommandResult {
  return { status: 0, signal: null, stdout, stderr: '' };
}

const AT_COMMIT = answered(`${COMMIT}\n`);

/** One guarded attempt over the given read of HEAD and clock, with stderr recorded. */
function attempting(
  headCommit: () => Promise<GitCommandResult>,
  nowIso: () => string,
): { readonly outcome: Promise<PushAttempt>; readonly text: () => string } {
  let text = '';
  const attempt = guardedAttempt(
    { token: { token: TOKEN, deadline: DEADLINE }, commit: COMMIT, reads: { headCommit }, nowIso },
    {
      write: (chunk: string) => {
        text += chunk;
        return true;
      },
    },
    () => Promise.resolve(TRANSFERRED),
  );
  return { outcome: attempt(), text: () => text };
}

describe('guardedAttempt', () => {
  it.each([
    { name: 'well before the deadline', now: BEFORE_DEADLINE },
    { name: 'at the deadline itself', now: DEADLINE.atIso },
  ])(
    'runs the transfer, reporting nothing, while HEAD names the settled commit $name',
    async ({ now }) => {
      const run = attempting(
        () => Promise.resolve(AT_COMMIT),
        () => now,
      );

      expect(await run.outcome).toEqual(TRANSFERRED);
      expect(run.text()).toBe('');
    },
  );

  it('ends the push when HEAD has moved, naming both commits', async () => {
    const run = attempting(
      () => Promise.resolve(answered(`${MOVED}\n`)),
      () => BEFORE_DEADLINE,
    );

    expect(await run.outcome).toEqual(STOPPED);
    expect(run.text()).toContain(COMMIT);
    expect(run.text()).toContain(MOVED);
  });

  it("ends the push when HEAD cannot be read, with git's own account of it", async () => {
    const unreadable: GitCommandResult = {
      status: 128,
      signal: null,
      stdout: '',
      stderr: 'fatal: bad object HEAD\n',
    };
    const run = attempting(
      () => Promise.resolve(unreadable),
      () => BEFORE_DEADLINE,
    );

    expect(await run.outcome).toEqual(STOPPED);
    expect(run.text()).toContain('cannot settle the commit');
  });

  it('ends the push once the deadline has passed, naming the expiry and never the token', async () => {
    const run = attempting(
      () => Promise.resolve(AT_COMMIT),
      () => AFTER_DEADLINE,
    );

    expect(await run.outcome).toEqual(STOPPED);
    expect(run.text()).toContain(EXPIRES_AT);
    expect(run.text()).not.toContain(TOKEN);
  });

  it('ends the push when the deadline passes while HEAD is being read', async () => {
    // The fake models a read that takes time: the clock is past the deadline
    // once HEAD has been read, and not before.
    let now = BEFORE_DEADLINE;
    const run = attempting(
      () => {
        now = AFTER_DEADLINE;
        return Promise.resolve(AT_COMMIT);
      },
      () => now,
    );

    expect(await run.outcome).toEqual(STOPPED);
    expect(run.text()).toContain(EXPIRES_AT);
  });
});
