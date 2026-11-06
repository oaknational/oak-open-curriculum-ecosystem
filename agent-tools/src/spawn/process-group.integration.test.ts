import { describe, expect, it } from 'vitest';

import { sweepProcessGroup, type SignalOutcome } from './process-group.js';

/**
 * The sweep over time. A group whose dead members are reaped some time after
 * the first SIGKILL answers EPERM until then (macOS, for about half a
 * millisecond, measured), so the sweep waits between SIGKILLs. The kernel is
 * a fake whose answer depends only on how much time the sweep's own waits
 * have passed, never on how often it is asked.
 */

interface ReapingGroup {
  readonly signal: (signal: NodeJS.Signals) => SignalOutcome;
  readonly patience: Parameters<typeof sweepProcessGroup>[1];
}

/** A group the kernel reports gone once `reapedAtMs` has passed; the sweep's waits pass the time. */
function groupReapedAt(reapedAtMs: number): ReapingGroup {
  let nowMs = 0;
  return {
    signal: () => (nowMs >= reapedAtMs ? 'ended' : 'not-permitted'),
    patience: {
      attempts: 3,
      intervalMs: 10,
      sleep: async (milliseconds) => {
        nowMs += milliseconds;
      },
    },
  };
}

describe('sweepProcessGroup', () => {
  it('reports a group reaped within its waits as cleared', async () => {
    const group = groupReapedAt(15);

    await expect(sweepProcessGroup(group.signal, group.patience)).resolves.toBe('cleared');
  });

  it('reports a group reaped only after its last SIGKILL as not cleared', async () => {
    const group = groupReapedAt(25);

    await expect(sweepProcessGroup(group.signal, group.patience)).resolves.toBe('not-cleared');
  });
});
