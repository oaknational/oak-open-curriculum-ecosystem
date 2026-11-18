/**
 * Launching the vendor `mcpjam` CLI: resolving its binary, and running it under
 * a bounded timeout with bounded output.
 *
 * @remarks
 * Its own module because it is a different concern from the retention IO in
 * `node-io.ts` — the one thing the process REACHES OUT to do, as against the
 * artefacts it writes.
 *
 * @packageDocumentation
 */

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { boundedExcerpt } from './bounded-excerpt.js';
import { type McpjamSpawnResult } from './runner.js';

/**
 * Generous per-suite ceiling: observed suite durations against the deployed
 * alpha are 1–4 s (2026-07-26); the ceiling exists so a hung SSE stream
 * cannot hold a CI job to the runner's own timeout.
 */
const SUITE_TIMEOUT_MS = 120_000;

/** Raw json-summary documents are single-digit KiB; 16 MiB is unreachable headroom. */
const MAX_STDOUT_BYTES = 16 * 1024 * 1024;

/**
 * Module resolution is a FILESYSTEM operation: `resolve` walks `node_modules`
 * directories from the given root, so a test reaching this function reaches the
 * disk even though no path in the call names a file. That is why it is a seam
 * rather than a direct call — tests are not permitted filesystem access
 * (`testing-strategy.md` §Test Types), so the code after it would otherwise be
 * undescribable within the rules, exactly as with {@link OwnerOnlyWriteOps}.
 *
 * @param repoRoot - The root whose `node_modules` chain is searched.
 * @returns The resolved entry path.
 * @throws When the package does not resolve; the caller translates to a Result.
 */
export type McpjamBinResolver = (repoRoot: string) => string;

/** The real module-resolution edge; the default, so production callers get it by omitting the seam. */
const nodeMcpjamBinResolver: McpjamBinResolver = (repoRoot) =>
  createRequire(join(repoRoot, 'package.json')).resolve('@mcpjam/cli');

export function resolveMcpjamBin(
  repoRoot: string,
  resolver: McpjamBinResolver = nodeMcpjamBinResolver,
): Result<string, Error> {
  try {
    return ok(resolver(repoRoot));
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

export function spawnMcpjam(
  repoRoot: string,
  binPath: string,
  args: readonly string[],
): Result<McpjamSpawnResult, Error> {
  const child = spawnSync(process.execPath, [binPath, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    timeout: SUITE_TIMEOUT_MS,
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
        `mcpjam died on signal ${child.signal} (timeout ceiling ${String(SUITE_TIMEOUT_MS)}ms)` +
          `${boundedExcerpt('partial stdout', child.stdout)}${boundedExcerpt('stderr', child.stderr)}`,
      ),
    );
  }
  return ok({ exitCode: child.status ?? undefined, stdout: child.stdout, stderr: child.stderr });
}
