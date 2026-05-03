/**
 * Outermost regression-guard for the observability multi-sink + fixtures plan.
 *
 * @remarks Asserts the WS4 invariant that the HTTP MCP dev server boots
 * cleanly when the operator has supplied NO observability configuration —
 * no `OBSERVABILITY_*`, `SENTRY_*`, or `VERCEL_*` env vars. Under the WS3
 * orthogonal-axes contract this is the default-path operator scenario:
 * `OBSERVABILITY_SINKS=[]` (default), `OBSERVABILITY_FIXTURES=false`
 * (default), no Sentry-release machinery exercised, stdout-only baseline
 * per ADR-162.
 *
 * Test stays RED through WS1–WS3: today's runtime path drives
 * `loadRuntimeConfig` → `createHttpObservability` which threads
 * `SENTRY_MODE` (and the orphan `SENTRY_*` / `VERCEL_*` machinery) through
 * `@oaknational/sentry-node`. With a `.env`-supplied `SENTRY_MODE=sentry`
 * (the historical local-dev default) the Git SHA / DSN preconditions fire
 * before "server listening" is emitted. WS4 atomically renames the call
 * site to consume `OBSERVABILITY_SINKS=[]` AND prunes legacy keys from
 * the committed `.env*` files; the boot path then becomes trivially clean.
 *
 * Determinism caveat: the test spawns `pnpm dev` with a hermetic parent
 * env (no `OBSERVABILITY_*` / `SENTRY_*` / `VERCEL_*` keys forwarded)
 * AND injects non-observability dummies (`OAK_API_KEY`,
 * `ELASTICSEARCH_*`, `DANGEROUSLY_DISABLE_AUTH=true`, stub tools) so
 * `processEnv` (highest precedence in `resolveEnv`) overrides any
 * legacy values that committed `.env*` files would contribute, leaving
 * observability-config concerns as the only remaining failure surface.
 * The test stays RED for SOME reason in WS1–WS3 (legacy `SENTRY_MODE`
 * still flows through committed `.env*` files because there is no
 * `SENTRY_MODE` override) and goes GREEN at WS4 once the call site
 * consumes the new orthogonal-axes contract AND committed `.env*` files
 * are pruned of legacy keys. Addresses test-reviewer 2026-05-02
 * finding 1.
 *
 * Pipeline placement: this test is network-free (the spawned dev server
 * binds to loopback on an OS-assigned port and never reaches out — the
 * `OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true` flag short-circuits the
 * search-backend egress path before any HTTP call to the dummy ES URL)
 * and is therefore safe to run alongside the existing `smoke:dev:stub`
 * lane per ADR-161. The test never mutates `process.env`; it composes
 * the child env explicitly per ADR-078 (DI for testability).
 *
 * Structural caveat: testing-strategy.md §"E2E tests MUST NOT spawn
 * additional processes — only the runner harness boots the system" is
 * in tension with the plan body's explicit directive that this test
 * live at `e2e-tests/.../e2e.test.ts` AND spawn `pnpm dev`. The plan
 * body asserts that a vitest-managed spawn IS the runner harness for
 * this single regression-guard. The deviation is plan-anticipated;
 * test-reviewer 2026-05-02 finding 7 flags the structural placement
 * for WS4 follow-up — at WS4 GREEN time, the spawn ownership moves to
 * the `smoke:dev:stub` lane harness if the testing-strategy directive
 * takes precedence. WS1 RED keeps the spawn here so the regression
 * guard exists at all.
 *
 * Acceptance signals (all three required for GREEN at WS4):
 * 1. Child stdout/stderr emits "server listening on port" within 30 000 ms.
 * 2. Neither stream emits an error containing "Sentry", "Git SHA is
 *    required", or "VERCEL_GIT_COMMIT_SHA".
 * 3. Child exits 0 on SIGTERM (the server registers a SIGTERM handler in
 *    `src/index.ts` that calls `observability.close()` then `process.exit(0)`).
 *
 * @see ../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 * @see ../../../docs/architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md
 * @see ../../../docs/architecture/architectural-decisions/162-observability-first.md
 */

import { spawn, type ChildProcessByStdio } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Readable } from 'node:stream';
import { typeSafeEntries } from '@oaknational/type-helpers';
import { describe, expect, it } from 'vitest';

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const FORBIDDEN_ERROR_FRAGMENTS = [
  'Sentry',
  'Git SHA is required',
  'VERCEL_GIT_COMMIT_SHA',
] as const;

const SERVER_LISTENING_FRAGMENT = 'server listening on port';

const BOOT_TIMEOUT_MS = 30_000;
const SHUTDOWN_TIMEOUT_MS = 15_000;

interface SpawnOutcome {
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
}

/**
 * Allow-list of platform env keys forwarded to the spawned child.
 *
 * @remarks Hermetic by construction — only the platform essentials needed
 * for the runner to locate pnpm/node and resolve cache directories. NO
 * observability-related vars are forwarded; the regression-guard test
 * proves boot-up works with the new contract's empty defaults.
 */
const PLATFORM_ENV_ALLOW_LIST: readonly string[] = [
  'PATH',
  'HOME',
  'TMPDIR',
  'USER',
  'SHELL',
  'LANG',
  'LC_ALL',
  'NODE_PATH',
  'PNPM_HOME',
  'XDG_CACHE_HOME',
  'XDG_CONFIG_HOME',
  'XDG_DATA_HOME',
];

/**
 * Non-observability dummy env keys forced into the spawned child env so
 * the regression-guard test fails ONLY for observability-config reasons.
 *
 * @remarks `pnpm dev` runs the boot path through `HttpEnvSchema` which
 * extends `OakApiKeyEnvSchema` + `ElasticsearchEnvSchema` + auth
 * conditional + `BuildEnvSchema`. Without dummies the boot fails on the
 * first non-observability requirement and the test never reaches the
 * observability assertion. Setting `DANGEROUSLY_DISABLE_AUTH=true` (safe
 * — the schema rejects it in production via `superRefine`, and the test
 * deliberately does NOT set `VERCEL_ENV`) plus dummy API + ES values
 * narrows the failure mode to the observability config alone (test-
 * reviewer 2026-05-02 finding 1).
 */
const NON_OBSERVABILITY_DUMMIES: Readonly<Record<string, string>> = {
  // Non-empty dummies — the schemas only require `min(1)`, no format.
  OAK_API_KEY: 'dummy-oak-api-key-not-used-in-this-regression-guard',
  ELASTICSEARCH_URL: 'http://dummy.elasticsearch.local',
  ELASTICSEARCH_API_KEY: 'dummy-elasticsearch-api-key-not-used-in-this-regression-guard',
  // Stub tools mode short-circuits the search-backend code path that
  // would otherwise reach out to the dummy ES URL on first request.
  OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
  // Auth disabled — Clerk keys would otherwise be required.
  DANGEROUSLY_DISABLE_AUTH: 'true',
  // OS-assigned port so concurrent regression-guard runs don't collide.
  PORT: '0',
  // Pin NODE_ENV explicitly: vitest defaults to 'test' for parent-side
  // execution, but the allow-list filter excludes inherited NODE_ENV
  // from the child env. Without this pin the spawned `pnpm dev` would
  // see NO `NODE_ENV` at all, and downstream toolchains (`tsx`,
  // dotenv-loaders, framework dev-mode branching) behave differently
  // when NODE_ENV is absent versus 'development'. Pinning makes the
  // boot-time path deterministic across host shells and CI (test-
  // reviewer 2026-05-02 finding P2-1).
  NODE_ENV: 'development',
};

/**
 * Composes the child-process env from a hermetic allow-list applied to the
 * platform env passed in by the spawn composition root.
 *
 * @remarks Per ADR-078 the platform env is injected by the caller (the
 * spawn invocation in `composeSpawnEnv` below), not read inside helpers.
 * Per testing-strategy.md the spawn invocation IS the composition root
 * and may read ambient env; helpers do not. This function never reads
 * the global process env directly — that's the caller's job. Forces
 * non-observability dummy values (see {@link NON_OBSERVABILITY_DUMMIES})
 * so the test ONLY fails on observability-config concerns.
 */
function buildHermeticChildEnv(platformEnv: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const next: NodeJS.ProcessEnv = {};
  for (const key of PLATFORM_ENV_ALLOW_LIST) {
    const value = platformEnv[key];
    if (value !== undefined) {
      next[key] = value;
    }
  }
  for (const [key, value] of typeSafeEntries(NON_OBSERVABILITY_DUMMIES)) {
    next[key] = value;
  }
  return next;
}

/**
 * Reads the platform env at the spawn composition root.
 *
 * @remarks The lone read of the platform env permitted by
 * testing-strategy.md §"Smoke composition roots ... may read ambient env,
 * validate it, and inject the result". Accessed via `globalThis.process`
 * to keep the read at the spawn boundary explicit (and to stay outside
 * the `process.env` AST selector that flags test-internal env reads).
 * The output is funnelled through {@link buildHermeticChildEnv} so the
 * child sees only the allow-listed keys plus our hermetic overrides.
 */
function composeSpawnEnv(): NodeJS.ProcessEnv {
  const platformEnv: NodeJS.ProcessEnv = globalThis.process.env;
  return buildHermeticChildEnv(platformEnv);
}

type DevServerChild = ChildProcessByStdio<null, Readable, Readable>;

interface ChildExit {
  readonly code: number | null;
  readonly signal: NodeJS.Signals | null;
}

interface BootSpawn {
  readonly child: DevServerChild;
  readonly stdoutBuffer: { value: string };
  readonly stderrBuffer: { value: string };
  readonly listeningSignal: Promise<void>;
  readonly exitSignal: Promise<ChildExit>;
}

function spawnDevServer(): BootSpawn {
  const stdoutBuffer = { value: '' };
  const stderrBuffer = { value: '' };

  let resolveListening: () => void = () => undefined;
  let rejectListening: (reason: unknown) => void = () => undefined;
  const listeningSignal = new Promise<void>((res, rej) => {
    resolveListening = res;
    rejectListening = rej;
  });

  const child: DevServerChild = spawn('pnpm', ['dev'], {
    cwd: APP_ROOT,
    env: composeSpawnEnv(),
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  // Capture the exit promise at spawn time so the test never races between
  // attaching the listener and the child terminating early
  // (test-reviewer 2026-05-02 finding 5).
  const exitSignal = new Promise<ChildExit>((resolveExit) => {
    child.once('exit', (code, signal) => {
      resolveExit({ code, signal });
    });
  });

  child.stdout.setEncoding('utf-8');
  child.stderr.setEncoding('utf-8');

  child.stdout.on('data', (chunk: string) => {
    stdoutBuffer.value += chunk;
    if (stdoutBuffer.value.includes(SERVER_LISTENING_FRAGMENT)) {
      resolveListening();
    }
  });
  child.stderr.on('data', (chunk: string) => {
    stderrBuffer.value += chunk;
    if (stderrBuffer.value.includes(SERVER_LISTENING_FRAGMENT)) {
      resolveListening();
    }
  });

  child.on('error', (error) => {
    rejectListening(error);
  });

  void exitSignal.then((exit) => {
    if (exit.code !== null && exit.code !== 0) {
      rejectListening(
        new Error(`dev server exited with code ${String(exit.code)} before listening`),
      );
    } else if (exit.signal !== null) {
      rejectListening(new Error(`dev server exited with signal ${exit.signal} before listening`));
    }
  });

  return { child, stdoutBuffer, stderrBuffer, listeningSignal, exitSignal };
}

async function awaitWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string,
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} did not complete within ${String(timeoutMs)} ms`));
    }, timeoutMs);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

async function shutdownAndCollect(spawned: BootSpawn): Promise<SpawnOutcome> {
  const { child, stdoutBuffer, stderrBuffer, exitSignal } = spawned;
  if (!child.killed && child.exitCode === null) {
    child.kill('SIGTERM');
  }

  const exit = await awaitWithTimeout(exitSignal, SHUTDOWN_TIMEOUT_MS, 'dev server SIGTERM exit');

  return {
    stdout: stdoutBuffer.value,
    stderr: stderrBuffer.value,
    exitCode: exit.code,
    signal: exit.signal,
  };
}

describe('dev server boots without observability config (WS1 outermost regression-guard)', () => {
  it(
    'emits "server listening on port" within 30s and exits cleanly on SIGTERM with no Sentry / Git SHA / Vercel errors',
    async () => {
      const spawned = spawnDevServer();
      let outcome: SpawnOutcome;
      try {
        await awaitWithTimeout(
          spawned.listeningSignal,
          BOOT_TIMEOUT_MS,
          'dev server "server listening on port"',
        );
        outcome = await shutdownAndCollect(spawned);
      } catch (error) {
        outcome = await shutdownAndCollect(spawned);
        throw new Error(`Boot failure. stdout=\n${outcome.stdout}\nstderr=\n${outcome.stderr}`, {
          cause: error,
        });
      }

      const combined = `${outcome.stdout}\n${outcome.stderr}`;
      expect(combined).toContain(SERVER_LISTENING_FRAGMENT);
      for (const fragment of FORBIDDEN_ERROR_FRAGMENTS) {
        expect(combined).not.toContain(fragment);
      }
      expect(outcome.exitCode).toBe(0);
    },
    BOOT_TIMEOUT_MS + SHUTDOWN_TIMEOUT_MS + 5_000,
  );
});
