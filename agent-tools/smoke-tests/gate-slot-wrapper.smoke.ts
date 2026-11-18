import assert from 'node:assert/strict';
import { rm } from 'node:fs/promises';
import net from 'node:net';

import { GATE_SLOT_HELD_ENV } from '../src/gate-slot/gate-slot-contract';

import {
  exitOf,
  holdSmokeLock,
  makeTree,
  outputEnded,
  readyPid,
  SMOKE_MUTEX_PORT,
  SMOKE_SLOT_PORTS,
  startFixture,
  stopFixtures,
  waitFor,
} from './gate-slot-smoke-support';
import { blockedChild, killGroup, unreapedMemberChild } from './gate-slot-smoke-children';

/**
 * The gate-slot wrapper on real loopback listeners and real processes, through
 * fixture wrappers on the smokes' private ports (the fixture's header says
 * what differs from production). Every wait is on an event; the watchdog is
 * harness mechanics.
 */

const exitAfterFailedStop = (error: unknown): never => {
  process.stderr.write(`gate-slot wrapper smoke: fixtures did not stop: ${String(error)}\n`);
  return process.exit(1);
};
const watchdog = setTimeout(() => {
  process.stderr.write('gate-slot wrapper smoke: timed out\n');
  // Exit only once every fixture has let go of the smoke's ports, so the lock never frees early.
  stopFixtures().then(() => process.exit(1), exitAfterFailedStop);
}, 180_000);
watchdog.unref();

await holdSmokeLock();
const trees: string[] = [];
async function tree(name: string): Promise<string> {
  const path = await makeTree(name);
  trees.push(path);
  return path;
}

async function statusOf(): Promise<string> {
  const reader = startFixture({ worktree: await tree('reader') }, ['status']);
  assert.equal(await exitOf(reader), 0, reader.stderr());
  return reader.stdout();
}

function freeCount(status: string): number {
  return (status.match(/: free$/gmu) ?? []).length;
}

async function proveTheKernelFreesTheSlotOfAKilledHolder(): Promise<void> {
  const holder = startFixture({ worktree: await tree('killed') }, blockedChild(0));
  const orphan = await readyPid(holder);
  try {
    holder.process.kill('SIGKILL');
    assert.equal(await exitOf(holder), 'SIGKILL');
    // The orphaned gate child still runs: the slot is free because its holder died.
    assert.equal(freeCount(await statusOf()), 3);
  } finally {
    killGroup(orphan);
  }
}

async function proveTheWrapperExitsWithItsChildsVerdictAndTellsItTheSlot(): Promise<void> {
  const script = `process.exit(process.env.${GATE_SLOT_HELD_ENV} === '${String(SMOKE_SLOT_PORTS[0])}' ? 3 : 4)`;
  const gate = startFixture({ worktree: await tree('verdict') }, ['run', 'pnpm', '-e', script]);
  assert.equal(await exitOf(gate), 3, gate.stderr());
}

async function proveASecondGateInOneTreeWaitsForTheFirst(): Promise<void> {
  const same = await tree('same');
  const first = startFixture({ worktree: same, limit: 3 }, blockedChild(0));
  await readyPid(first);
  const second = startFixture({ worktree: same, limit: 3 }, [
    'run',
    'pnpm',
    '-e',
    'process.exit(5)',
  ]);
  await waitFor(second.process.stderr, second.stderr, `pid ${String(first.pid)}`);
  first.process.stdin?.end();
  assert.equal(await exitOf(first), 0);
  assert.equal(await exitOf(second), 5, second.stderr());
}

/** The smoke holds the mutex itself: a gate must wait for it, naming its port, and run once it is free. */
async function proveAGateWaitsForTheMutex(): Promise<void> {
  const mutex = net.createServer((socket) => socket.destroy());
  mutex.listen({ host: '127.0.0.1', port: SMOKE_MUTEX_PORT, exclusive: true });
  await new Promise((resolve) => mutex.once('listening', resolve));
  const gate = startFixture({ worktree: await tree('mutex'), mutexAttempts: 2 }, [
    'run',
    'pnpm',
    '-e',
    'process.exit(7)',
  ]);
  await waitFor(gate.process.stderr, gate.stderr, String(SMOKE_MUTEX_PORT));
  await new Promise((resolve) => mutex.close(resolve));
  assert.equal(await exitOf(gate), 7, gate.stderr());
}

/** A listener that accepts and never answers may be a stopped gate in this tree: a gate waits for it. */
async function proveASilentHolderBlocksAsIfItSharedTheTree(): Promise<void> {
  const silent = net.createServer(() => undefined);
  const port = SMOKE_SLOT_PORTS[0] ?? 0;
  silent.listen({ host: '127.0.0.1', port, exclusive: true });
  await new Promise((resolve) => silent.once('listening', resolve));
  const gate = startFixture({ worktree: await tree('silent'), limit: 3, identityTimeoutMs: 200 }, [
    'run',
    'pnpm',
    '-e',
    'process.exit(8)',
  ]);
  await waitFor(gate.process.stderr, gate.stderr, String(port));
  silent.close();
  assert.equal(await exitOf(gate), 8, gate.stderr());
}

/**
 * The gate child is a shell with a background grandchild that ignores the
 * signal: the signal reaches the whole group, the shell ends by it, and the
 * group is swept with SIGKILL before the slot is freed.
 */
async function proveASignalReachesTheWholeGate(
  signal: NodeJS.Signals,
  code: number,
): Promise<void> {
  const shell = [
    'run',
    'pnpm',
    '-c',
    `(trap '' TERM HUP; sleep 20; echo survived) & echo ready $!; wait`,
  ];
  const gate = startFixture({ worktree: await tree('signal'), child: 'sh' }, shell);
  await readyPid(gate);
  gate.process.kill(signal);
  assert.equal(await exitOf(gate), code, gate.stderr());
  // The grandchild holds the fixture's stdout, so the pipe ends only once it has
  // gone; had it outlived the sweep, it would have said so before going.
  await outputEnded(gate);
  assert.doesNotMatch(gate.stdout(), /survived/u);
}

/**
 * The gate's leader exits 0 on SIGTERM, leaving a grandchild that ignores it:
 * the group is swept once the leader has ended, the grandchild is gone before
 * the slot is freed, and the gate passes only once the sweep reports it clear.
 */
async function proveAFinishedGateLeavesNoStraggler(): Promise<void> {
  const script =
    `const { spawn } = require('node:child_process');` +
    `process.on('SIGTERM', () => process.exit(0));` +
    `const grandchild = spawn('/bin/sh', ['-c', "trap '' TERM; sleep 20; echo survived"], { stdio: ['ignore', 'inherit', 'ignore'] });` +
    String.raw`process.stdout.write('ready ' + grandchild.pid + '\n');` +
    `setInterval(() => undefined, 1000);`;
  const gate = startFixture({ worktree: await tree('straggler') }, ['run', 'pnpm', '-e', script]);
  await readyPid(gate);
  gate.process.kill('SIGTERM');
  assert.equal(await exitOf(gate), 0, gate.stderr());
  // The grandchild holds the fixture's stdout, so the pipe ends only once it has
  // gone; had it outlived the sweep, it would have said so before going.
  await outputEnded(gate);
  assert.doesNotMatch(gate.stdout(), /survived/u);
}

/** Spawned in its own process group, so the smoke signals that group and never its own. */
async function proveATerminalInterruptReachesTheGate(): Promise<void> {
  const gate = startFixture({ worktree: await tree('int') }, blockedChild(0), { detached: true });
  await readyPid(gate);
  process.kill(-gate.pid, 'SIGINT');
  assert.equal(await exitOf(gate), 130, gate.stderr());
}

/**
 * At its bound the gate gets SIGTERM first (the child reports it and keeps
 * running), then SIGKILL, which reaches a grandchild that ignores SIGTERM.
 */
async function proveAGatePastItsBoundIsStoppedWhole(): Promise<void> {
  const script =
    `const { spawn } = require('node:child_process');` +
    String.raw`process.on('SIGTERM', () => process.stdout.write('term\n'));` +
    `const grandchild = spawn('/bin/sh', ['-c', "trap '' TERM; exec sleep 30"], { stdio: ['ignore', 'inherit', 'ignore'] });` +
    String.raw`process.stdout.write('ready ' + grandchild.pid + '\n');` +
    `setInterval(() => undefined, 1000);`;
  const bounded = { worktree: await tree('bound'), childMaxMs: 5000, childGraceMs: 500 };
  const gate = startFixture(bounded, ['run', 'pnpm', '-e', script]);
  await readyPid(gate);
  await waitFor(gate.process.stdout, gate.stdout, 'term');
  assert.equal(await exitOf(gate), 137, gate.stderr());
  // The grandchild holds the fixture's stdout, so the pipe ends only once it has gone.
  await outputEnded(gate);
}

/** An unreaped dead member, which no SIGKILL clears, fails the gate though its leader exited 0. */
async function proveAGroupTheSweepCannotClearFailsTheGate(): Promise<void> {
  const gate = startFixture(
    { worktree: await tree('unreaped'), child: 'sh' },
    unreapedMemberChild(),
  );
  try {
    await waitFor(gate.process.stderr, gate.stderr, 'process group was not cleared');
    assert.equal(await exitOf(gate), 1, gate.stderr());
  } finally {
    gate.process.stdin?.end();
  }
}

/** A reader that reads a holder's identity and never closes cannot keep a finished gate from exiting. */
async function proveAHalfOpenReaderCannotHoldAGateOpen(): Promise<void> {
  const gate = startFixture({ worktree: await tree('half-open') }, blockedChild(0));
  await readyPid(gate);
  const reader = net.connect({
    host: '127.0.0.1',
    port: SMOKE_SLOT_PORTS[0] ?? 0,
    allowHalfOpen: true,
  });
  await new Promise((resolve) => reader.once('data', resolve));
  try {
    gate.process.stdin?.end();
    assert.equal(await exitOf(gate), 0, gate.stderr());
  } finally {
    reader.destroy();
  }
}

try {
  await proveTheKernelFreesTheSlotOfAKilledHolder();
  await proveAHalfOpenReaderCannotHoldAGateOpen();
  await proveTheWrapperExitsWithItsChildsVerdictAndTellsItTheSlot();
  await proveASecondGateInOneTreeWaitsForTheFirst();
  await proveAGateWaitsForTheMutex();
  await proveASilentHolderBlocksAsIfItSharedTheTree();
  await proveASignalReachesTheWholeGate('SIGTERM', 143);
  await proveASignalReachesTheWholeGate('SIGHUP', 129);
  await proveAFinishedGateLeavesNoStraggler();
  await proveATerminalInterruptReachesTheGate();
  await proveAGatePastItsBoundIsStoppedWhole();
  await proveAGroupTheSweepCannotClearFailsTheGate();
  process.stdout.write('gate-slot wrapper smoke: 12/12 proofs passed\n');
} finally {
  await stopFixtures();
  await Promise.all(trees.map(async (path) => rm(path, { recursive: true, force: true })));
}
