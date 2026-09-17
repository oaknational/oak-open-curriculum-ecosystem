/*
 * Dev-server lifecycle for the fidelity review: attach when something is
 * already answering on the base URL (and never touch it), spawn `pnpm dev`
 * when the port is free — with a bounded ready-wait and a teardown that
 * only ever kills what this module spawned, proves the port released, and
 * prints the proof (no-unbounded-host-load: every wait is bounded).
 * OWNERSHIP CONTRACT: a spawned handle's `stop()` must be called on every
 * exit path by the caller that received it — the child is detached, so an
 * orchestrator that exits without stopping leaves the group alive. This
 * module guarantees the teardown WORKS; the handle owner guarantees it
 * RUNS (typically via try/finally around the capture body).
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
// Explicit module import, never the ambient global (lib boundary rule):
// this module owns the spawned dev server's process lifecycle — group
// kill, pnpm self-identification via npm_execpath, progress lines.
import process from 'node:process';

import { err, ok, type Result } from '@oaknational/result';

import { resolveDevCommand, type DevCommand } from './dev-command';
import { probeIdentity, type ServerSentinel } from './server-identity';
import { describeThrown } from './support';

export { judgeServerIdentity, type IdentityProbe, type ServerSentinel } from './server-identity';

const READY_WAIT_MS = 120_000;
const POLL_MS = 1000;
const SIGTERM_GRACE_MS = 10_000;
const RELEASE_WAIT_MS = 15_000;

export type DevServerHandle =
  | { readonly mode: 'attached' }
  | { readonly mode: 'spawned'; readonly stop: () => Promise<Result<void, string>> };

export { resolveDevCommand, type DevCommand } from './dev-command';

async function responds(base: string): Promise<boolean> {
  try {
    await fetch(base, { signal: AbortSignal.timeout(2000) });
    return true;
  } catch {
    return false;
  }
}

/** Signal-0 probe of the spawned process GROUP — the primary release
 *  proof: POSIX keeps the pgid reserved while any member exists, so
 *  ESRCH here means the whole group is gone. An HTTP probe can be
 *  defeated by a socket-holding-but-header-withholding server; this
 *  cannot. */
function groupGone(pid: number): boolean {
  try {
    process.kill(-pid, 0);
    return false;
  } catch (error: unknown) {
    const code =
      error !== null && typeof error === 'object' && 'code' in error ? error.code : undefined;
    return code === 'ESRCH';
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Poll `predicate` every POLL_MS until true or the bounded deadline passes. */
async function pollUntil(predicate: () => Promise<boolean>, deadlineMs: number): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < deadlineMs) {
    if (await predicate()) {
      return true;
    }
    await wait(POLL_MS);
  }
  return false;
}

function stopSpawned(pid: number, base: string): () => Promise<Result<void, string>> {
  return async () => {
    try {
      // Negative pid = the whole process group: pnpm wraps next, and killing
      // pnpm alone orphans the next process holding the port.
      process.kill(-pid, 'SIGTERM');
    } catch (error: unknown) {
      if (groupGone(pid)) {
        // Idempotent teardown: already-gone IS the goal state (a natural
        // exit or a second stop() call reads as success, never failure).
        process.stdout.write(`dev server group ${pid} already gone\n`);
        return ok(undefined);
      }
      return err(`dev-server: SIGTERM failed — ${describeThrown(error)}`);
    }
    // Primary release proof: the process GROUP is gone (signal-0 probe);
    // the port answer is printed corroboration only.
    const released = await pollUntil(() => Promise.resolve(groupGone(pid)), SIGTERM_GRACE_MS);
    if (!released) {
      try {
        process.kill(-pid, 'SIGKILL');
      } catch {
        // The group died between the poll and the kill — that is the goal state.
      }
      const killed = await pollUntil(() => Promise.resolve(groupGone(pid)), RELEASE_WAIT_MS);
      if (!killed) {
        return err(`dev-server: process group ${pid} survived SIGKILL`);
      }
    }
    const stillAnswering = await responds(base);
    process.stdout.write(
      stillAnswering
        ? `dev server group ${pid} gone — WARNING: something still answers on ${base} (foreign server?)\n`
        : `dev server group ${pid} gone, ${base} released\n`,
    );
    return ok(undefined);
  };
}

/** Spawn the detached dev-server group in `demoDir`; returns its pid. */
function spawnDevServer(command: DevCommand, demoDir: string): Result<number, string> {
  const child = spawn(command.bin, command.args, {
    cwd: demoDir,
    detached: true,
    stdio: 'ignore',
  });
  // Without a listener, a spawn failure (e.g. ENOENT on a stale
  // npm_execpath) emits an unhandled 'error' event and crashes a caller
  // that handled our Result and kept running — shared-library code must
  // tolerate exactly that caller. The failure still surfaces: the ready
  // poll times out and returns err.
  child.on('error', (error: unknown) => {
    process.stdout.write(`dev-server: spawn error — ${describeThrown(error)}\n`);
  });
  const pid = child.pid;
  if (pid === undefined) {
    return err('dev-server: spawn produced no pid');
  }
  child.unref();
  return ok(pid);
}

/** How long an attach-mode reachability ASSERTION retries before failing.
 *  Long enough to ride out a transient listen gap or a slow first
 *  compile of '/', short enough that a genuinely-down server fails in
 *  seconds — attach-mode contact is an assertion, not a spawn wait
 *  (that generosity is READY_WAIT_MS's). */
const ATTACH_ASSERT_MS = 10_000;

/** Assert something is answering on `base`, without touching it — the
 *  attach-mode counterpart of ensureDevServer's ready wait, reusing the
 *  same bounded probe (a one-shot unbounded fetch here previously hung
 *  forever on a server that accepted but never responded, and each app
 *  carried its own copy). `hint` is the app's own start-it advice,
 *  rendered into the failure. */
export async function assertServerUp(
  base: string,
  hint: string,
  sentinel: ServerSentinel,
): Promise<Result<void, string>> {
  if (!(await pollUntil(() => responds(base), ATTACH_ASSERT_MS))) {
    return err(`no server reachable at ${base} within ${ATTACH_ASSERT_MS / 1000}s. ${hint}`);
  }
  return probeIdentity(base, sentinel);
}

/** Attach to a responding dev server, or spawn one and wait until it is ready.
 *  `demoDir` is the app directory whose `pnpm dev` answers on `base` — a
 *  REQUIRED parameter, because this module lives in a shared package and
 *  must never guess the app root from its own location (a wrong guess
 *  spawns in a script-less directory and burns the whole ready-wait
 *  before failing with a misleading not-ready error). */
export async function ensureDevServer(
  base: string,
  demoDir: string,
  sentinel: ServerSentinel,
): Promise<Result<DevServerHandle, string>> {
  if (!path.isAbsolute(demoDir)) {
    return err(`dev-server: demoDir (${demoDir}) must be an absolute path`);
  }
  if (await responds(base)) {
    // The attach path is where the wrong-service hazard is LARGEST (a
    // custom --base typed while another app runs) — identity gates it.
    const identity = await probeIdentity(base, sentinel);
    if (!identity.ok) {
      return err(identity.error);
    }
    process.stdout.write(`dev server already up at ${base} — attaching (will not stop it)\n`);
    return ok({ mode: 'attached' });
  }
  const command = resolveDevCommand(process.env.npm_execpath, process.execPath);
  if (!command.ok) {
    return err(command.error);
  }
  const spawned = spawnDevServer(command.value, demoDir);
  if (!spawned.ok) {
    return spawned;
  }
  return awaitSpawnedReady(spawned.value, base, sentinel);
}

/** Wait for the spawned group to answer AND prove it is ours; any
 *  failure reaps the group before erring. */
async function awaitSpawnedReady(
  pid: number,
  base: string,
  sentinel: ServerSentinel,
): Promise<Result<DevServerHandle, string>> {
  process.stdout.write(`spawned pnpm dev (pid ${pid}), waiting for ${base}…\n`);
  const ready = await pollUntil(() => responds(base), READY_WAIT_MS);
  if (!ready) {
    await stopSpawned(pid, base)();
    return err(`dev-server: not ready within ${READY_WAIT_MS / 1000}s`);
  }
  // Ready = answering AND provably OURS: a startup race that bound a
  // different service on the port is a loud identity failure here.
  const identity = await probeIdentity(base, sentinel);
  if (!identity.ok) {
    await stopSpawned(pid, base)();
    return err(identity.error);
  }
  return ok({ mode: 'spawned', stop: stopSpawned(pid, base) });
}
