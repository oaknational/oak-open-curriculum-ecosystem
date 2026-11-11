import assert from 'node:assert/strict';
import { spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp } from 'node:fs/promises';
import net from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

/**
 * Helpers for the gate-slot smokes: fixed private ports, a lock that runs one
 * smoke at a time across worktrees, fixture wrapper processes, and waits on
 * events (a line, an exit). The one wall-clock bound is stopping a fixture
 * that will not exit.
 */

export const PACKAGE_ROOT = fileURLToPath(new URL('..', import.meta.url));
const FIXTURE = fileURLToPath(new URL('gate-slot-fixture.ts', import.meta.url));

/**
 * The smokes' own ports: below the ephemeral ranges, as the real ones are, so
 * no port the system hands out can land on them, and apart from the real
 * gate ports (23917 to 23920). The lock port is held for a smoke's whole run.
 */
const SMOKE_LOCK_PORT = 23_930;
export const SMOKE_MUTEX_PORT = 23_931;
export const SMOKE_SLOT_PORTS: readonly number[] = [23_932, 23_933, 23_934];

/** How a fixture runs: its tree, its limit, its child and its patience. */
export interface FixtureHost {
  readonly worktree: string;
  readonly limit?: 1 | 2 | 3;
  readonly child?: 'node' | 'sh';
  readonly childMaxMs?: number;
  readonly childGraceMs?: number;
  readonly mutexAttempts?: number;
  readonly identityTimeoutMs?: number;
}

const FIXTURE_DEFAULTS = {
  limit: 2,
  child: 'node',
  childMaxMs: 60_000,
  childGraceMs: 1000,
  mutexAttempts: 50,
  identityTimeoutMs: 2000,
} as const;

/** A running fixture with its output collected as it arrives. */
export interface Fixture {
  readonly process: ChildProcess;
  readonly pid: number;
  readonly stdout: () => string;
  readonly stderr: () => string;
}

/** Every fixture this smoke has started, so that none outlives it. */
const started: Fixture[] = [];

/** How long a stopped fixture has to pass SIGTERM to its gate, sweep it and exit. */
const STOP_BOUND_MS = 10_000;

/**
 * Hold the smoke lock for the rest of this process: two worktrees' gates run
 * the smokes at once, and the smokes' ports are fixed, so one waits for the
 * other. The kernel frees the lock when the smoke exits, however it exits.
 */
export async function holdSmokeLock(): Promise<void> {
  for (;;) {
    const server = net.createServer((socket) => socket.destroy());
    const bound = await new Promise<boolean>((resolve) => {
      server.once('error', () => {
        resolve(false);
      });
      server.listen({ host: '127.0.0.1', port: SMOKE_LOCK_PORT, exclusive: true }, () => {
        resolve(true);
      });
    });
    if (bound) {
      server.unref();
      return;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
  }
}

/** A fresh directory standing for one working tree; the smoke removes it when done. */
export async function makeTree(name: string): Promise<string> {
  return mkdtemp(join(tmpdir(), `gate-slot-${name}-`));
}

/**
 * Start a fixture wrapper with gate-slot arguments `argv`. Its environment is
 * built here and carries no held marker, because the smoke itself runs
 * inside a real gate that set one.
 */
export function startFixture(
  host: FixtureHost,
  argv: readonly string[],
  options: { readonly detached?: boolean } = {},
): Fixture {
  const config = {
    ...FIXTURE_DEFAULTS,
    ...host,
    mutexPort: SMOKE_MUTEX_PORT,
    slotPorts: SMOKE_SLOT_PORTS,
  };
  const child = spawn(
    process.execPath,
    ['--import', 'tsx', FIXTURE, JSON.stringify(config), ...argv],
    {
      cwd: PACKAGE_ROOT,
      env: {},
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: options.detached ?? false,
    },
  );
  assert.ok(child.pid !== undefined, 'gate-slot smoke: the fixture did not start');
  let out = '';
  let err = '';
  child.stdout.setEncoding('utf8').on('data', (chunk: string) => (out += chunk));
  child.stderr.setEncoding('utf8').on('data', (chunk: string) => (err += chunk));
  const fixture = { process: child, pid: child.pid, stdout: () => out, stderr: () => err };
  started.push(fixture);
  return fixture;
}

function isRunning(fixture: Fixture): boolean {
  return fixture.process.exitCode === null && fixture.process.signalCode === null;
}

/**
 * Stop every fixture still running and wait for each to exit, so that a
 * proof that throws, or the watchdog, leaves no wrapper holding the smoke's
 * ports and no gate running on: SIGTERM, which a wrapper passes on to its
 * gate's group before sweeping it. A wrapper still running after the bound
 * gets SIGKILL, which frees its ports; its gate's group then runs on, as it
 * does for any wrapper killed that way.
 */
export async function stopFixtures(): Promise<void> {
  await Promise.all(
    started.filter(isRunning).map(async (fixture) => {
      const exited = exitOf(fixture);
      fixture.process.kill('SIGTERM');
      const bound = new Promise<'bound'>((resolve) => {
        setTimeout(() => {
          resolve('bound');
        }, STOP_BOUND_MS).unref();
      });
      if ((await Promise.race([exited, bound])) === 'bound') {
        fixture.process.kill('SIGKILL');
        await exited;
      }
    }),
  );
}

/**
 * Resolve once `read()` contains `text`, checked on each arrival from
 * `stream`; fail if the stream ends first.
 */
export async function waitFor(
  stream: Readable | null,
  read: () => string,
  text: string,
): Promise<void> {
  while (!read().includes(text)) {
    if (stream === null || stream.readableEnded) {
      throw new Error(`gate-slot smoke: the stream ended without "${text}"; it held: ${read()}`);
    }
    const settled = new AbortController();
    try {
      await Promise.race([
        once(stream, 'data', { signal: settled.signal }),
        once(stream, 'end', { signal: settled.signal }),
      ]);
    } finally {
      settled.abort();
    }
  }
}

/** Resolve with the fixture's exit code, or the signal that ended it. */
export function exitOf(fixture: Fixture): Promise<number | NodeJS.Signals> {
  const child = fixture.process;
  if (child.exitCode !== null) {
    return Promise.resolve(child.exitCode);
  }
  if (child.signalCode !== null) {
    return Promise.resolve(child.signalCode);
  }
  return new Promise((resolve) => {
    child.once('exit', (code, signal) => {
      resolve(code ?? signal ?? -1);
    });
  });
}

/** The pid a gate child printed on its `ready` line. */
export async function readyPid(fixture: Fixture): Promise<number> {
  await waitFor(fixture.process.stdout, fixture.stdout, 'ready ');
  const pid = Number(/ready (\d+)/u.exec(fixture.stdout())?.[1]);
  assert.ok(Number.isInteger(pid) && pid > 0, `gate-slot smoke: no pid in ${fixture.stdout()}`);
  return pid;
}

/**
 * Resolve once every process holding the fixture's stdout has gone: the
 * wrapper, its gate child and any grandchild that inherited the pipe. The
 * pipe's end is the event; the smoke's watchdog bounds the wait.
 */
export async function outputEnded(fixture: Fixture): Promise<void> {
  const stdout = fixture.process.stdout;
  assert.ok(stdout !== null, 'gate-slot smoke: the fixture has no stdout');
  if (!stdout.readableEnded) {
    await once(stdout, 'end');
  }
}
