import { describe, expect, it } from 'vitest';

import type { GateHolderIdentity } from './gate-slot-contract.js';
import { createGateSlotIo, type GateSlotHost } from './gate-slot-io.js';
import { main } from './gate-slot-main.js';
import type { SlotObservation } from './gate-slot-policy.js';
import type { GateSlotIo } from './gate-slot-types.js';

/**
 * The gate-slot command as a whole, over its ports. Each fake answers as the
 * real adapter does: `transact` runs the admission verdict it is handed over
 * a fixed host snapshot, as the adapter does under the mutex, and returns the
 * verdict with a release (a parametric fake: the verdict is contract data
 * flowing through the port); `runChild` reports how the gate child ended.
 * The win32 refusal runs over the real composition, whose ports the command
 * never reaches. Tests assert only what the command returns and writes.
 */

const HERE = '/work/here';

const MINE: GateHolderIdentity = {
  worktree: HERE,
  pid: 7202,
  command: 'pnpm check',
  acquired_at: '2026-09-24T07:00:00.000Z',
};

const OTHER: GateHolderIdentity = { ...MINE, worktree: '/work/other', pid: 7101 };

const EMPTY_HOST: readonly SlotObservation[] = [
  { port: 41, state: 'free' },
  { port: 42, state: 'free' },
  { port: 43, state: 'free' },
];

const NO_RELEASE = async (): Promise<void> => undefined;

/**
 * A host where this tree already holds a slot, as it does for a command run
 * inside its gate: a command that tried to take a slot here would wait, and
 * report the wait, before anything else.
 */
const THIS_TREE_HELD: readonly SlotObservation[] = [
  { port: 41, state: 'held', holder: MINE },
  ...EMPTY_HOST.slice(1),
];

/**
 * The real composition for a host the command must refuse: its ports and
 * child runner are never used, because the refusal comes first.
 */
const WIN32_HOST: Omit<GateSlotHost, 'platform'> = {
  ports: {
    host: '127.0.0.1',
    mutexPort: 41_000,
    slotPorts: [41_001],
    patience: { mutexAttempts: 1, mutexRetryMs: 1, identityTimeoutMs: 1 },
  },
  worktree: HERE,
  limit: 2,
  heldMarker: undefined,
  childCommand: 'pnpm',
  childMaxMs: 1000,
  childGraceMs: 100,
};

/** Yields a macrotask, so a loop that never gives up fails on the timeout instead of hanging. */
const NEXT_TICK = async (): Promise<void> =>
  new Promise((resolve) => {
    setImmediate(resolve);
  });

interface Sinks {
  readonly out: string[];
  readonly err: string[];
}

function hostIo(
  slots: readonly SlotObservation[],
  overrides: Partial<GateSlotIo> = {},
): { readonly io: GateSlotIo; readonly sinks: Sinks } {
  const sinks: Sinks = { out: [], err: [] };
  const io: GateSlotIo = {
    limit: 3,
    worktree: HERE,
    processGroups: true,
    pid: 9000,
    heldMarker: undefined,
    now: () => '2026-09-24T08:00:00.000Z',
    transact: async ({ decide }) => ({
      kind: 'decided',
      decision: decide(slots),
      release: NO_RELEASE,
    }),
    observe: async () => ({ kind: 'observed', slots }),
    runChild: async () => ({
      end: { status: 0, signal: null },
      stoppedAtBoundMs: undefined,
      groupNotCleared: false,
    }),
    sleep: NEXT_TICK,
    stdout: (line) => sinks.out.push(line),
    stderr: (line) => sinks.err.push(line),
    ...overrides,
  };
  return { io, sinks };
}

describe('gate-slot run', () => {
  it('runs the gate on a free host and exits with how the gate ended', async () => {
    const { io } = hostIo(EMPTY_HOST, {
      runChild: async () => ({
        end: { status: null, signal: 'SIGHUP' },
        stoppedAtBoundMs: undefined,
        groupNotCleared: false,
      }),
    });

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(129);
  });

  it('waits for the gate already running in its tree, names it, and gives up', async () => {
    const { io, sinks } = hostIo([
      { port: 41, state: 'held', holder: MINE },
      ...EMPTY_HOST.slice(1),
    ]);

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(1);
    expect(sinks.err.join('\n')).toContain(String(MINE.pid));
    expect(sinks.err.join('\n')).toContain('pnpm check');
  }, 30_000);

  it('waits at the limit it is given', async () => {
    const slots: readonly SlotObservation[] = [
      { port: 41, state: 'held', holder: OTHER },
      ...EMPTY_HOST.slice(1),
    ];
    const { io } = hostIo(slots, { limit: 1 });

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(1);
  }, 30_000);

  it('gives up while the mutex stays busy, naming its port', async () => {
    const { io, sinks } = hostIo(EMPTY_HOST, {
      transact: async () => ({ kind: 'mutex-busy', port: 31_917 }),
    });

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(1);
    expect(sinks.err.join('\n')).toContain('31917');
  }, 30_000);

  it('fails at once when the slots cannot be read', async () => {
    const { io, sinks } = hostIo(EMPTY_HOST, {
      transact: async () => ({ kind: 'failed', message: 'listen EPERM 127.0.0.1:31917' }),
    });

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(1);
    expect(sinks.err.join('\n')).toContain('EPERM');
  });

  it('refuses inside a gate before any wait, naming the enclosing slot', async () => {
    const { io, sinks } = hostIo(THIS_TREE_HELD, { heldMarker: '31918' });

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(1);
    expect(sinks.err[0]).toContain('31918');
    expect(sinks.err.join('\n')).toContain('pnpm check');
  }, 30_000);

  it('refuses a working tree no reader could match to its tree, naming it', async () => {
    const worktree = '/work/line\nbreak';
    const { io, sinks } = hostIo(EMPTY_HOST, { worktree });

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(1);
    expect(sinks.err[0]).toContain(JSON.stringify(worktree));
  });

  it('refuses on a host with no process groups to signal before any wait', async () => {
    const { io, sinks } = hostIo(THIS_TREE_HELD, { processGroups: false });

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(1);
    expect(sinks.err[0]).toContain('process group');
    expect(sinks.err.join('\n')).toContain('pnpm check');
  }, 30_000);

  it('refuses a gate on a win32 host, which has no process groups to signal', async () => {
    const err: string[] = [];
    const io: GateSlotIo = {
      ...createGateSlotIo({ ...WIN32_HOST, platform: 'win32' }),
      stderr: (line) => err.push(line),
    };

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(1);
    expect(err.join('\n')).toContain('process group');
  });

  it('fails a gate whose process group the sweep could not clear, and says so', async () => {
    const { io, sinks } = hostIo(EMPTY_HOST, {
      runChild: async () => ({
        end: { status: 0, signal: null },
        stoppedAtBoundMs: undefined,
        groupNotCleared: true,
      }),
    });

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(1);
    expect(sinks.err.join('\n')).toContain('process group');
  });

  it('keeps the gate verdict when the release fails, and says so', async () => {
    const { io, sinks } = hostIo(EMPTY_HOST, {
      transact: async ({ decide }) => ({
        kind: 'decided',
        decision: decide(EMPTY_HOST),
        release: async () => {
          throw new Error('close failed');
        },
      }),
      runChild: async () => ({
        end: { status: 3, signal: null },
        stoppedAtBoundMs: undefined,
        groupNotCleared: false,
      }),
    });

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(3);
    expect(sinks.err.join('\n')).toContain('close failed');
  });

  it('frees the slot and fails when the gate cannot be launched', async () => {
    const { io, sinks } = hostIo(EMPTY_HOST, {
      transact: async ({ decide }) => ({
        kind: 'decided',
        decision: decide(EMPTY_HOST),
        release: async () => {
          throw new Error('release reached');
        },
      }),
      runChild: async () => {
        throw new Error('spawn ENOMEM');
      },
    });

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(1);
    expect(sinks.err.join('\n')).toContain('spawn ENOMEM');
    expect(sinks.err.join('\n')).toContain('release reached');
  });

  it.each([
    { name: 'killed at its bound', end: { status: null, signal: 'SIGKILL' as const }, code: 137 },
    { name: 'exiting 0 on its way down', end: { status: 0, signal: null }, code: 1 },
  ])('fails a gate stopped at its bound, $name, and names the bound', async ({ end, code }) => {
    const { io, sinks } = hostIo(EMPTY_HOST, {
      runChild: async () => ({ end, stoppedAtBoundMs: 43 * 60_000, groupNotCleared: false }),
    });

    await expect(main(['run', 'pnpm', 'check'], io)).resolves.toBe(code);
    expect(sinks.err.join('\n')).toContain('43-minute');
  });
});

describe('gate-slot status', () => {
  it('lists every slot with its holder, and this tree', async () => {
    const slots: readonly SlotObservation[] = [
      { port: 31_918, state: 'held', holder: OTHER },
      { port: 31_919, state: 'foreign' },
      { port: 31_920, state: 'unanswered' },
    ];
    const { io, sinks } = hostIo(slots);

    await expect(main(['status'], io)).resolves.toBe(0);
    const out = sinks.out.join('\n');
    expect(out).toContain(OTHER.worktree);
    expect(out).toContain(HERE);
    expect(out).toContain('31919');
    expect(out).toContain('31920');
  });

  it('fails when the slots cannot be read', async () => {
    const { io } = hostIo(EMPTY_HOST, {
      observe: async () => ({ kind: 'failed', message: 'listen EPERM' }),
    });

    await expect(main(['status'], io)).resolves.toBe(1);
  });
});
