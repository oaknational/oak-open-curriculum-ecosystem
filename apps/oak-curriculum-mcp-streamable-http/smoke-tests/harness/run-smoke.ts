/**
 * Canonical smoke harness orchestration.
 *
 * @remarks
 * `runSmokeMode` composes three steps: (1) build a hermetic env via the
 * mode's pure {@link ModeEnvBuilder}, (2) boot the in-process server
 * via the injected {@link BootServer} seam, (3) on a successful boot
 * spawn vitest via the injected {@link SpawnVitest} seam against the
 * mode's smoke-test directory; cleanup runs on every termination
 * path. The function is the harness's single public entrypoint and
 * carries no implicit state — every effectful surface is injected
 * through {@link RunSmokeDeps} per ADR-078.
 *
 * @packageDocumentation
 */

import type {
  BootOutcome,
  Clock,
  BootServer,
  SmokeModeConfig,
  SmokeRunResult,
  SpawnVitest,
} from './types.js';

/**
 * Dependencies for {@link runSmokeMode}.
 *
 * @remarks
 * Production wiring composes real `loadRuntimeConfig`-backed boot,
 * child-process vitest spawn, and `Date.now` clock. Integration
 * tests inject simple DI fakes per ADR-078.
 */
export interface RunSmokeDeps {
  readonly bootServer: BootServer;
  readonly spawnVitest: SpawnVitest;
  readonly clock: Clock;
  /** Path to the smoke vitest config, relative to workspace root. */
  readonly vitestConfigPath: string;
}

/**
 * Runs a single smoke mode end-to-end and returns the structured
 * result.
 *
 * @remarks
 * Lifecycle is fixed:
 *
 * 1. Build env via `mode.buildEnv({})`.
 * 2. Boot server with `bootTimeoutMs` enforced via `AbortSignal.timeout`.
 * 3. If boot succeeds, spawn vitest with `SMOKE_BASE_URL` injected
 *    through `VitestSpawnArgs`; capture exit code and duration.
 * 4. Always invoke `cleanup` on the listening outcome (boot success
 *    AND test failure both trigger cleanup; only the boot-failure
 *    variants skip it because no server is bound).
 *
 * The function does not throw on test failure; the non-zero exit code
 * is carried in the returned {@link SmokeRunResult}. The function may
 * still throw if cleanup itself throws — cleanup failures are
 * exceptional and indicate a server-shutdown bug, not a test failure.
 */
/**
 * Empty base env passed to every {@link ModeEnvBuilder} invocation.
 *
 * @remarks
 * The harness deliberately starts each mode from `{}` rather than
 * from `process.env`; per `testing-strategy.md` smoke composition
 * roots may read ambient env once at the CLI layer, but the env
 * reaching `loadRuntimeConfig` is composed entirely from the mode's
 * pure builder so test runs are reproducible.
 */
const EMPTY_BASE_ENV: Readonly<NodeJS.ProcessEnv> = Object.freeze({});

export async function runSmokeMode(
  mode: SmokeModeConfig,
  deps: RunSmokeDeps,
): Promise<SmokeRunResult> {
  const bootStart = deps.clock();
  const env = mode.buildEnv(EMPTY_BASE_ENV);

  const abortController = new AbortController();
  const timeoutHandle = setTimeout(() => abortController.abort(), mode.bootTimeoutMs);
  let bootOutcome: BootOutcome;
  try {
    bootOutcome = await deps.bootServer(env, abortController.signal);
  } finally {
    clearTimeout(timeoutHandle);
  }
  const bootDurationMs = deps.clock() - bootStart;

  if (bootOutcome.kind !== 'listening') {
    return {
      exitCode: 1,
      bootOutcome: bootOutcome.kind,
      bootDurationMs,
      testDurationMs: 0,
    };
  }

  const testStart = deps.clock();
  try {
    const spawnResult = await deps.spawnVitest({
      testDir: mode.testDir,
      smokeBaseUrl: bootOutcome.baseUrl,
      configPath: deps.vitestConfigPath,
    });
    return {
      exitCode: spawnResult.exitCode,
      bootOutcome: 'listening',
      bootDurationMs,
      testDurationMs: deps.clock() - testStart,
    };
  } finally {
    await bootOutcome.cleanup();
  }
}
