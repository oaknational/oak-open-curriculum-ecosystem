import { describe, expect, it } from 'vitest';

import { signalProcessGroup, sweepStep } from './process-group.js';

/**
 * Signalling a child's process group, and the sweep's decision on each of
 * the kernel's answers once the child has ended. Only ESRCH proves a group
 * has ended. EPERM answers both for a group whose members have all exited
 * and are not yet reaped (macOS, for about half a millisecond after a group
 * SIGKILL, measured) and for a group holding a live process this user may
 * not signal, so the sweep sends again until ESRCH or its last attempt. The
 * sweep's waits are proven over time in the integration test beside this
 * file, and the signal reaching every member of the group on real processes
 * by the gate-slot wrapper smoke.
 */

function failingKill(code: string): (pid: number, signal: NodeJS.Signals) => true {
  return () => {
    throw Object.assign(new Error(`kill ${code}`), { code });
  };
}

describe('signalProcessGroup', () => {
  it.each([
    { name: 'a signalled group', kill: (): true => true, outcome: 'signalled' },
    { name: 'no such group (ESRCH)', kill: failingKill('ESRCH'), outcome: 'ended' },
    {
      name: 'a group it may not signal (EPERM)',
      kill: failingKill('EPERM'),
      outcome: 'not-permitted',
    },
  ])('reports $name as $outcome', ({ kill, outcome }) => {
    expect(signalProcessGroup(4242, 'SIGKILL', kill)).toBe(outcome);
  });

  it('reports any other failure', () => {
    expect(() => signalProcessGroup(4242, 'SIGKILL', failingKill('EINVAL'))).toThrow('kill EINVAL');
  });

  it('reports a launch that never got a pid as having nothing left to signal', () => {
    expect(signalProcessGroup(undefined, 'SIGKILL', failingKill('EINVAL'))).toBe('ended');
  });
});

describe('sweepStep', () => {
  it.each([
    { answer: 'ended', attempt: 1, attempts: 3, step: 'cleared' },
    { answer: 'ended', attempt: 3, attempts: 3, step: 'cleared' },
    { answer: 'not-permitted', attempt: 2, attempts: 3, step: 'again' },
    { answer: 'signalled', attempt: 1, attempts: 3, step: 'again' },
    { answer: 'not-permitted', attempt: 3, attempts: 3, step: 'not-cleared' },
    { answer: 'signalled', attempt: 3, attempts: 3, step: 'not-cleared' },
  ] as const)(
    'decides $step on $answer at SIGKILL $attempt of $attempts',
    ({ answer, attempt, attempts, step }) => {
      expect(sweepStep(answer, attempt, attempts)).toBe(step);
    },
  );
});
