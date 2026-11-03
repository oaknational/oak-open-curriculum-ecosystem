import { describe, expect, it } from 'vitest';

import type { GitCommandResult } from './git-executor.js';
import {
  answered,
  COMMIT,
  EXPIRES_AT,
  gitFake,
  gitReads,
  mintAnswering,
  NOW,
  REFUSED_PUSH,
  runPush,
  TOKEN,
} from './test-helpers/push-cli-double.js';

/**
 * `merge-bot push` at the front door, checked before each attempt, the first
 * included: the token's own expiry leaves room to start, and HEAD still names
 * the commit the push settled. Each guard's own cases are
 * `push-attempt-guards.integration.test.ts`'s and the snapshot of HEAD is
 * `push-target-branch.integration.test.ts`'s; here the guards are composed
 * with the retry.
 *
 * Where a case needs the world to change between two attempts, it changes on
 * the wait the push itself asks for: the injected sleep sets what the clock or
 * the read of HEAD answers from then on. Nothing counts the push's queries.
 */

/** Another commit's full object name: where HEAD has moved to. */
const MOVED = 'abc1234abc1234abc1234abc1234abc1234abc12';

/** The instant the fixture token expires: past any margin the push keeps. */
const EXPIRED = '2026-08-06T10:00:00.000Z';

/** How many times the retry was announced on stderr. */
function retriesAnnounced(errText: string): number {
  return errText.split('trying again').length - 1;
}

describe('merge-bot push: a named branch', () => {
  it('refuses a named branch that is not the one HEAD is on, with exit 3, minting nothing and pushing nothing', async () => {
    const run = runPush({
      args: ['--branch', 'other-lane', '--json'],
      reads: gitReads({ currentBranch: answered('feat/elsewhere\n') }),
    });

    expect(await run.exit).toBe(3);
    expect(JSON.parse(run.out())).toMatchObject({ kind: 'refused' });
    expect(run.out()).toContain('other-lane');
    expect(run.out()).toContain('feat/elsewhere');
    expect(run.calls).toEqual([]);
  });
});

describe('merge-bot push: the token expiry bounds every attempt', () => {
  it('starts no attempt with a token that has expired, naming the expiry and never the token', async () => {
    const run = runPush({ overrides: { nowIsoImpl: () => EXPIRED } });

    expect(await run.exit).toBe(1);
    expect(run.calls).toEqual([]);
    expect(run.errText()).toContain(EXPIRES_AT);
    expect(run.errText()).not.toContain(TOKEN);
    expect(retriesAnnounced(run.errText())).toBe(0);
  });

  it('stops a refused push when the token expires during the wait, trying nothing again', async () => {
    let now = NOW;
    const run = runPush({
      git: gitFake(REFUSED_PUSH),
      overrides: {
        nowIsoImpl: () => now,
        sleepImpl: () => {
          now = EXPIRED;
          return Promise.resolve();
        },
      },
    });

    expect(await run.exit).toBe(1);
    expect(run.calls).toHaveLength(1);
    expect(run.errText()).toContain(EXPIRES_AT);
    expect(retriesAnnounced(run.errText())).toBe(1);
  });

  it('pushes nothing on an expiry it cannot read as a time', async () => {
    const run = runPush({ mint: mintAnswering(TOKEN, 'in an hour') });

    expect(await run.exit).toBe(1);
    expect(run.calls).toEqual([]);
    expect(run.errText()).toContain('in an hour');
  });
});

describe('merge-bot push: every attempt pushes only while HEAD names the settled commit', () => {
  it('stops a refused push when HEAD moves during the wait, trying nothing again', async () => {
    let head: GitCommandResult = answered(`${COMMIT}\n`);
    const run = runPush({
      git: gitFake(REFUSED_PUSH),
      reads: { ...gitReads(), headCommit: () => Promise.resolve(head) },
      overrides: {
        sleepImpl: () => {
          head = answered(`${MOVED}\n`);
          return Promise.resolve();
        },
      },
    });

    expect(await run.exit).toBe(1);
    expect(run.calls).toHaveLength(1);
    expect(run.errText()).toContain(MOVED);
    expect(retriesAnnounced(run.errText())).toBe(1);
  });
});
