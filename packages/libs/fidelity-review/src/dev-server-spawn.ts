/*
 * Spawning the detached `pnpm run dev` group and waiting for it to be
 * ready: the bounded ready-wait races the pnpm leader's exit, so a leader
 * that dies first (a pnpm refusal, a missing script) fails at once instead
 * of at the deadline. Its IO (the spawn, the ready-wait, the group reap)
 * arrives as arguments, so the race is testable in process. Split from
 * dev-server.ts for module size.
 */
import { spawn } from 'node:child_process';
// Explicit module import, never the ambient global (lib boundary rule).
import process from 'node:process';

import { err, ok, type Result } from '@oaknational/result';

import { describeThrown } from './support';

export const READY_WAIT_MS = 120_000;

/** The slice of a spawned child process the lifecycle reads. */
export interface DevChild {
  readonly pid?: number;
  on(event: 'error', listener: (error: Error) => void): unknown;
  once(
    event: 'exit',
    listener: (code: number | null, signal: NodeJS.Signals | null) => void,
  ): unknown;
  unref(): void;
}

/** The IO the spawn path performs; `ensureDevServer` supplies the real one. */
export interface SpawnIo {
  /** Starts `pnpm run dev` in `cwd`, detached as its own process group. */
  readonly spawnDev: (cwd: string) => DevChild;
  /** True once the server answers, false at the bounded deadline; stops early when `stop` aborts. */
  readonly untilReady: (stop: AbortSignal) => Promise<boolean>;
  /** Tears the spawned group down. */
  readonly reap: (pid: number) => Promise<Result<void, string>>;
}

/** How the spawned `pnpm run dev` leader exited. */
interface LeaderExit {
  readonly code: number | null;
  readonly signal: NodeJS.Signals | null;
}

/** The real spawn: `pnpm run dev` in `cwd`, detached, its output discarded. */
export function spawnPnpmRunDev(cwd: string): DevChild {
  return spawn('pnpm', ['run', 'dev'], { cwd, detached: true, stdio: 'ignore' });
}

/** Spawn the group; returns its pid and a promise that settles when its leader exits. */
function spawnGroup(
  demoDir: string,
  spawnDev: SpawnIo['spawnDev'],
): Result<{ readonly pid: number; readonly exited: Promise<LeaderExit> }, string> {
  const child = spawnDev(demoDir);
  // Without a listener, a spawn failure (e.g. ENOENT when pnpm is not
  // installed) emits an unhandled 'error' event after this function has
  // returned, and crashes a caller that handled our Result and kept
  // running — shared-library code must tolerate exactly that caller. The
  // failure itself surfaces at once: Node gives such a child no pid, so
  // this returns `spawn produced no pid`.
  child.on('error', (error) => {
    process.stdout.write(`dev-server: spawn error — ${describeThrown(error)}\n`);
  });
  const pid = child.pid;
  if (pid === undefined) {
    return err('dev-server: spawn produced no pid');
  }
  const exited = new Promise<LeaderExit>((resolve) => {
    child.once('exit', (code, signal) => {
      resolve({ code, signal });
    });
  });
  child.unref();
  return ok({ pid, exited });
}

/** Race the ready-wait against the leader's exit; the losing wait is stopped. */
async function readyOrExit(
  untilReady: SpawnIo['untilReady'],
  exited: Promise<LeaderExit>,
): Promise<'ready' | 'timeout' | LeaderExit> {
  const stopWait = new AbortController();
  const waited = untilReady(stopWait.signal).then((ready): 'ready' | 'timeout' =>
    ready ? 'ready' : 'timeout',
  );
  const outcome = await Promise.race([waited, exited]);
  stopWait.abort();
  return outcome;
}

/** The refusal for a leader that exited before the server was ready. */
function earlyExitError(exit: LeaderExit, demoDir: string): string {
  const how = exit.signal === null ? `exit code ${String(exit.code)}` : `signal ${exit.signal}`;
  return (
    `dev-server: pnpm run dev exited (${how}) before the server was ready; ` +
    `run \`pnpm run dev\` in ${demoDir} to see its output. An ERR_PNPM_BAD_PM_VERSION there ` +
    'is the corepack and standalone pnpm mix in .agent/reference/shell-and-tooling-gotchas.md.'
  );
}

/** Spawn the group in `demoDir` and wait until it answers on `base`,
 *  reaping it before erring on any failure; returns its pid once ready.
 *  A failed reap stays in the error: the caller gets no stop handle, so
 *  the operator must know the detached group may still need stopping. */
export async function spawnAndAwaitReady(
  demoDir: string,
  base: string,
  io: SpawnIo,
): Promise<Result<number, string>> {
  const spawned = spawnGroup(demoDir, io.spawnDev);
  if (!spawned.ok) {
    return spawned;
  }
  const { pid, exited } = spawned.value;
  process.stdout.write(`spawned pnpm run dev (pid ${pid}), waiting for ${base}…\n`);
  const outcome = await readyOrExit(io.untilReady, exited);
  if (outcome === 'ready') {
    return ok(pid);
  }
  const failure =
    outcome === 'timeout'
      ? `dev-server: not ready within ${READY_WAIT_MS / 1000}s`
      : earlyExitError(outcome, demoDir);
  const reaped = await io.reap(pid);
  return err(
    reaped.ok
      ? failure
      : `${failure} Teardown also failed, so process group ${pid} may still be running ` +
          `and need stopping by hand: ${reaped.error}`,
  );
}
