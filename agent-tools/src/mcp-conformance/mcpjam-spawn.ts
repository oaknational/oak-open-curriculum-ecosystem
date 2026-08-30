/**
 * The mcpjam spawn seam: resolve the lockfile-installed bin, build the child
 * environment, run it. Split from `node-io.ts`, which keeps the retention and
 * owner-only-write concerns — two responsibilities that shared one module
 * until the file outgrew its size budget.
 *
 * Bin resolution: the bare `@mcpjam/cli` specifier is resolved with a
 * `createRequire` anchored at the repo root — resolution-only, matching the
 * bootstrap precedent — which today yields `dist/index.js`, the same file the
 * package's `bin` entry names (verified 3.15.2; a future main/bin split would
 * fail loudly at the parse boundary). The child runs under the current Node
 * executable; no `npx`, no PATH lookup, no install-drift risk.
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { boundedExcerpt } from './bounded-excerpt.js';
import { type McpjamSpawnResult } from './runner.js';

/**
 * Generous per-child ceiling for EVERY mcpjam invocation through this seam
 * (suites, drive, compat). Observed suite durations against the deployed
 * alpha are 1–4 s (2026-07-26); compat's full-catalogue evaluation plus
 * widget scan runs longer but well inside this bound. The ceiling exists so
 * a hung SSE stream cannot hold a CI job to the runner's own timeout.
 */
const MCPJAM_CHILD_TIMEOUT_MS = 120_000;

/** Raw json-summary documents are single-digit KiB; 16 MiB is unreachable headroom. */
const MAX_STDOUT_BYTES = 16 * 1024 * 1024;

function resolveMcpjamBin(repoRoot: string): Result<string, Error> {
  try {
    return ok(createRequire(join(repoRoot, 'package.json')).resolve('@mcpjam/cli'));
  } catch (error) {
    return err(
      new Error(
        `@mcpjam/cli did not resolve from the repo root — run pnpm install (lockfile-declared devDependency): ${
          error instanceof Error ? error.message : String(error)
        }`,
      ),
    );
  }
}

/**
 * The environment every mcpjam child is launched with: the parent's, plus the
 * vendor's two telemetry gates forced on.
 *
 * The vendor builds its PostHog client AT MODULE LOAD from these env vars
 * alone, so the CLI's `--no-telemetry` flag cannot reach the decision. As of
 * SDK 2.4.0 its one `capture()` fires on a feature this repo never invokes,
 * so this declines a channel rather than closing a leak. Set unconditionally,
 * never merged — an inherited `DO_NOT_TRACK=0` must not re-enable reporting.
 * Rationale and guards: `tests/mcp-conformance/mcpjam-child-env.unit.test.ts`.
 */
export function mcpjamChildEnv(parentEnv: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return { ...parentEnv, DO_NOT_TRACK: '1', MCPJAM_TELEMETRY_DISABLED: '1' };
}

function spawnMcpjam(
  repoRoot: string,
  binPath: string,
  args: readonly string[],
): Result<McpjamSpawnResult, Error> {
  const child = spawnSync(process.execPath, [binPath, ...args], {
    cwd: repoRoot,
    env: mcpjamChildEnv(process.env),
    encoding: 'utf8',
    timeout: MCPJAM_CHILD_TIMEOUT_MS,
    // SIGKILL, not the default SIGTERM: SIGTERM is ignorable, so a child
    // that traps it (or is wedged inside an uninterruptible await) would
    // outlive the ceiling and the advertised timeout would not be real.
    killSignal: 'SIGKILL',
    maxBuffer: MAX_STDOUT_BYTES,
  });
  if (child.error !== undefined) {
    // A timeout sets BOTH `error` (ETIMEDOUT) and `signal`, so this branch
    // fires first — the captured streams must ride the error here too, or
    // the timeout case (where diagnostics matter most) loses them.
    return err(
      new Error(
        `${child.error.message}` +
          `${boundedExcerpt('partial stdout', child.stdout ?? '')}` +
          `${boundedExcerpt('stderr', child.stderr ?? '')}`,
      ),
    );
  }
  if (child.signal !== null) {
    // A signal death (typically the timeout ceiling) is a LAUNCH FAILURE to
    // the orchestration: retention never runs on this path, so no evidence
    // artefact survives it — bounded DIAGNOSTICS of both streams ride the
    // error instead, so the operator still sees what the child said.
    return err(
      new Error(
        `mcpjam died on signal ${child.signal} (timeout ceiling ${String(MCPJAM_CHILD_TIMEOUT_MS)}ms)` +
          `${boundedExcerpt('partial stdout', child.stdout)}${boundedExcerpt('stderr', child.stderr)}`,
      ),
    );
  }
  return ok({ exitCode: child.status ?? undefined, stdout: child.stdout, stderr: child.stderr });
}

/**
 * The spawn seam alone: resolve the lockfile-installed bin, run it. Consumers
 * whose retention shape differs from the suites' per-suite files (compat
 * retains a single artefact) compose their own IO around this, rather than
 * constructing — and discarding — the suites' retention closure.
 */
export function buildMcpjamRunner(
  repoRoot: string,
): (args: readonly string[]) => Result<McpjamSpawnResult, Error> {
  return (args) => {
    const bin = resolveMcpjamBin(repoRoot);
    if (bin.ok) {
      return spawnMcpjam(repoRoot, bin.value, args);
    }
    return bin;
  };
}
