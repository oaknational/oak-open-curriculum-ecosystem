/*
 * Dev-server lifecycle for the fidelity review: attach when something is
 * already answering on the base URL (and never touch it), spawn
 * `pnpm run dev` when the port is free — with a bounded ready-wait that a
 * dying dev server cuts short, and a teardown that only ever kills what
 * this module spawned, proves the port released, and prints the proof
 * (no-unbounded-host-load: every wait is bounded).
 * OWNERSHIP CONTRACT: a spawned handle's `stop()` must be called on every
 * exit path by the caller that received it — the child is detached, so an
 * orchestrator that exits without stopping leaves the group alive. This
 * module guarantees the teardown WORKS; the handle owner guarantees it
 * RUNS (typically via try/finally around the capture body).
 */
import path from 'node:path';
// Explicit module import, never the ambient global (lib boundary rule):
// this module owns the spawned dev server's process lifecycle — group
// kill, progress lines.
import process from 'node:process';

import { err, ok, type Result } from '@oaknational/result';

import { pollUntil, responds } from './dev-server-poll';
import { READY_WAIT_MS, spawnAndAwaitReady, spawnPnpmRunDev } from './dev-server-spawn';
import { probeIdentity, type ServerSentinel } from './server-identity';
import { describeThrown } from './support';

export { judgeServerIdentity, type IdentityProbe, type ServerSentinel } from './server-identity';

const SIGTERM_GRACE_MS = 10_000;
const RELEASE_WAIT_MS = 15_000;

export type DevServerHandle =
  | { readonly mode: 'attached' }
  | { readonly mode: 'spawned'; readonly stop: () => Promise<Result<void, string>> };

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
 *  `demoDir` is the app directory whose `pnpm run dev` answers on `base` —
 *  a REQUIRED parameter, because this module lives in a shared package and
 *  must never guess the app root from its own location (a wrong guess
 *  spawns in a directory with no dev script). */
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
  return awaitSpawnedReady(base, demoDir, sentinel);
}

/** Spawn the group, wait for it to answer, AND prove it is ours; any
 *  failure reaps the group before erring. */
async function awaitSpawnedReady(
  base: string,
  demoDir: string,
  sentinel: ServerSentinel,
): Promise<Result<DevServerHandle, string>> {
  const spawned = await spawnAndAwaitReady(demoDir, base, {
    spawnDev: spawnPnpmRunDev,
    untilReady: (stop) => pollUntil(() => responds(base), READY_WAIT_MS, stop),
    confirmOurs: () => probeIdentity(base, sentinel),
    reap: (pid) => stopSpawned(pid, base)(),
  });
  if (!spawned.ok) {
    return spawned;
  }
  return ok({ mode: 'spawned', stop: stopSpawned(spawned.value, base) });
}
