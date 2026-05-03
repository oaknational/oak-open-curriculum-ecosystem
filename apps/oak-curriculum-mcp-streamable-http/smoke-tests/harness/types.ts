/**
 * Public types for the canonical smoke-test harness.
 *
 * @remarks
 * The canonical smoke harness shape is owner-corrected
 * (`there-is-no-time-hashed-starfish.plan.md` §ARC A): the harness is a
 * thin start-server + invoke-vitest + cleanup wrapper, and smoke tests
 * are first-class `*.smoke.test.ts` Vitest files. This module's types
 * are vendor-neutral and contain no global state — every effectful
 * surface is a dependency-injection seam (ADR-078). All four existing
 * `local-*` modes boot in-process via the same `createApp + app.listen`
 * surface (see Task M1 reconnaissance, comms event
 * `claude-ba3961-misty-task-1-harness-recon-reply`); the harness
 * therefore owns a uniform in-process boot path. Modes that historically
 * required `pnpm dev`-style env scrubbing apply that scrubbing inside
 * their pure {@link ModeEnvBuilder} rather than as a child-process side
 * effect.
 *
 * @packageDocumentation
 */

/**
 * Pure function that builds the per-mode hermetic env passed to
 * `loadRuntimeConfig`.
 *
 * @remarks
 * The builder receives a base env (typically `{}` or a small allowlist
 * of pass-through keys) and returns the env to inject. Builders MUST
 * NOT read or mutate `process.env`, MUST NOT perform I/O, and MUST be
 * deterministic for testability.
 */
export type ModeEnvBuilder = (baseEnv: Readonly<NodeJS.ProcessEnv>) => Readonly<NodeJS.ProcessEnv>;

/**
 * Mode configuration consumed by the harness.
 */
export interface SmokeModeConfig {
  /** Stable mode name; doubles as the CLI dispatch keyword. */
  readonly name: string;
  /** Pure env-builder; produces the env injected into `loadRuntimeConfig`. */
  readonly buildEnv: ModeEnvBuilder;
  /**
   * Test directory containing `*.smoke.test.ts` files for this mode,
   * relative to the workspace root (e.g. `smoke-tests/local-stub`).
   */
  readonly testDir: string;
  /** Maximum boot-wait timeout in milliseconds. */
  readonly bootTimeoutMs: number;
}

/**
 * Outcome of attempting to boot the in-process server.
 *
 * @remarks
 * Discriminated union — every observed boot path produces exactly one
 * variant. The `listening` variant carries the cleanup callback that
 * tears the server down at the end of the run; the harness invokes
 * cleanup on every code path including failure of the test phase.
 */
export type BootOutcome =
  | {
      readonly kind: 'listening';
      readonly baseUrl: string;
      readonly cleanup: () => Promise<void>;
    }
  | { readonly kind: 'env-error'; readonly message: string }
  | { readonly kind: 'crashed'; readonly error: Error }
  | { readonly kind: 'timeout'; readonly elapsedMs: number };

/**
 * Result of running a smoke mode end-to-end.
 *
 * @remarks
 * `exitCode` is the number the CLI returns to its caller. `0` means
 * boot succeeded and all smoke tests passed; any non-zero value
 * indicates a boot or test failure. `bootOutcome` records which
 * variant of {@link BootOutcome} the boot phase produced; useful for
 * deterministic assertions in integration tests.
 */
export interface SmokeRunResult {
  readonly exitCode: number;
  readonly bootOutcome: BootOutcome['kind'];
  readonly bootDurationMs: number;
  readonly testDurationMs: number;
}

/**
 * Dependency-injection seam — boots the in-process server given a
 * hermetic env. Production wiring composes `loadRuntimeConfig` +
 * `createHttpObservability` + `createApp` + `app.listen`. Unit tests
 * inject a fake.
 *
 * @remarks
 * The `signal` carries the harness-level boot timeout; implementations
 * MUST honour cancellation by rejecting in-flight work and resolving
 * to `{ kind: 'timeout' }` when the signal aborts.
 */
export type BootServer = (
  env: Readonly<NodeJS.ProcessEnv>,
  signal: AbortSignal,
) => Promise<BootOutcome>;

/**
 * Arguments passed to {@link SpawnVitest}.
 */
export interface VitestSpawnArgs {
  /** Test directory (relative to workspace root). */
  readonly testDir: string;
  /** URL of the locally-bound server; injected into the spawned vitest's env. */
  readonly smokeBaseUrl: string;
  /** Path to the smoke vitest config (relative to workspace root). */
  readonly configPath: string;
}

/**
 * Result of running vitest as a child process.
 */
export interface VitestSpawnResult {
  readonly exitCode: number;
  readonly durationMs: number;
}

/**
 * Dependency-injection seam — spawns vitest as a child process. The
 * production wiring uses `pnpm exec vitest run` with the smoke config
 * path and test directory as arguments, and `SMOKE_BASE_URL` injected
 * into the child env. Integration tests inject a fake.
 */
export type SpawnVitest = (args: VitestSpawnArgs) => Promise<VitestSpawnResult>;

/**
 * Clock seam — returns an epoch timestamp in milliseconds. Production:
 * `Date.now`. Tests: deterministic fake.
 */
export type Clock = () => number;
