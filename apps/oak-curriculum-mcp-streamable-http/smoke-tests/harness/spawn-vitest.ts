/**
 * Production wiring for the harness's vitest-spawn seam.
 *
 * @remarks
 * Spawns `pnpm exec vitest run --config <configPath> <testDir>` as a
 * child process with `SMOKE_BASE_URL` injected into the child env, and
 * resolves to the child's exit code. The child's stdout and stderr are
 * inherited so test output flows live to the harness's TTY.
 *
 * The harness composition root may read ambient env (per
 * `testing-strategy.md` §"Smoke composition roots may read ambient
 * env"), so we pass a copy of `process.env` augmented with the boot's
 * `SMOKE_BASE_URL` — no global mutation.
 *
 * @packageDocumentation
 */

import { spawn, type SpawnOptions } from 'node:child_process';
import type { Clock, SpawnVitest, VitestSpawnArgs, VitestSpawnResult } from './types.js';

/**
 * Dependencies for {@link createChildProcessVitestSpawner}.
 *
 * @remarks
 * `processEnv` is a snapshot of the harness process's env, captured at
 * harness composition-root construction time — used as the *base* for
 * the child env (`SMOKE_BASE_URL` is layered on top). Tests inject a
 * fixed snapshot.
 */
export interface ChildProcessVitestSpawnerDeps {
  readonly clock: Clock;
  readonly processEnv: Readonly<NodeJS.ProcessEnv>;
}

/**
 * Builds a {@link SpawnVitest} bound to `child_process.spawn` with
 * stdout/stderr inherited.
 *
 * @remarks
 * The harness invokes the spawner exactly once per smoke run; multiple
 * concurrent invocations would cause garbled output on the inherited
 * TTY. The harness orchestrator enforces single-active-vitest by
 * running modes serially.
 */
export function createChildProcessVitestSpawner(deps: ChildProcessVitestSpawnerDeps): SpawnVitest {
  return async (args: VitestSpawnArgs): Promise<VitestSpawnResult> => {
    const childEnv = buildChildEnv(deps.processEnv, args.smokeBaseUrl);
    const startedAt = deps.clock();

    return await new Promise<VitestSpawnResult>((resolve) => {
      const child = spawn(
        'pnpm',
        ['exec', 'vitest', 'run', '--config', args.configPath, args.testDir],
        buildSpawnOptions(childEnv),
      );

      // Both spawn-error and exit are converted to a structured exit
      // code so the orchestrator's "does not throw on test failure"
      // contract holds against ENOENT, permission errors, and other
      // child_process failure modes (per architecture-reviewer-fred
      // 2026-05-03 review of run-smoke.ts cleanup ordering).
      child.on('error', (error: Error) => {
        process.stderr.write(`[smoke-harness] vitest spawn error: ${error.message}\n`);
        resolve({
          exitCode: 1,
          durationMs: deps.clock() - startedAt,
        });
      });

      child.on('exit', (code: number | null) => {
        resolve({
          exitCode: code ?? 1,
          durationMs: deps.clock() - startedAt,
        });
      });
    });
  };
}

function buildChildEnv(
  baseEnv: Readonly<NodeJS.ProcessEnv>,
  smokeBaseUrl: string,
): NodeJS.ProcessEnv {
  return { ...baseEnv, SMOKE_BASE_URL: smokeBaseUrl };
}

function buildSpawnOptions(env: NodeJS.ProcessEnv): SpawnOptions {
  return {
    env,
    stdio: 'inherit',
  };
}
