/**
 * Node IO for `agent-tools mcp-conformance` (MCP-189): the real spawn seam
 * over the lockfile-installed `@mcpjam/cli` bin, and raw-report retention
 * under a caller-chosen directory (absolute, or relative to the repo root).
 *
 * Bin resolution: the bare `@mcpjam/cli` specifier is resolved with a
 * `createRequire` anchored at the repo root — resolution-only, matching the
 * bootstrap precedent — which today yields `dist/index.js`, the same file
 * the package's `bin` entry names (verified 3.15.2; a future main/bin split
 * would fail loudly at the parse boundary). The child runs under the
 * current Node executable; no `npx`, no PATH lookup, no network at
 * install-drift risk.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { boundedExcerpt } from './bounded-excerpt.js';
import { type McpConformanceIo, type RetentionOutcome } from './io-port.js';
import { writeOwnerOnly, type OwnerOnlyWriteOps } from './owner-only-write.js';
import { type McpjamSpawnResult } from './runner.js';
import { type ConformanceSuite } from './types.js';

/**
 * Generous per-suite ceiling: observed suite durations against the deployed
 * alpha are 1–4 s (2026-07-26); the ceiling exists so a hung SSE stream
 * cannot hold a CI job to the runner's own timeout.
 */
const SUITE_TIMEOUT_MS = 120_000;

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

function spawnMcpjam(
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

// Writes resolve against the repo root; an absolute reportDir stands as
// given. The REPORTED path preserves the caller's own form (relative in,
// repo-root-relative out; absolute in, absolute out) so the emitted
// report never names a path that does not exist. Retained artefacts are
// OWNER-ONLY, established before any content lands — the full rationale
// and ordering discipline live with {@link writeOwnerOnly} in
// `owner-only-write.ts`.

/**
 * Owner-only write of one file under a directory (created if absent),
 * resolving relative paths against the repo root. Shared by the suites'
 * retention here and the drive's per-tool evidence retention
 * (`drive-node-io.ts`) — every retained artefact can embed authed vendor
 * output, so all of them get the 0600 discipline above.
 */
export function writeUnder(
  repoRoot: string,
  reportDir: string,
  fileName: string,
  content: string,
  ops?: OwnerOnlyWriteOps,
): RetentionOutcome {
  const writeDir = resolve(repoRoot, reportDir);
  const reportedPath = join(reportDir, fileName);
  try {
    mkdirSync(writeDir, { recursive: true });
    writeOwnerOnly(join(writeDir, fileName), content, ops);
    return { ok: true, reportedPath };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function retainUnder(repoRoot: string, reportDir: string, ops?: OwnerOnlyWriteOps) {
  return (suite: ConformanceSuite, content: string): RetentionOutcome =>
    writeUnder(repoRoot, reportDir, `${suite}.json`, content, ops);
}

/**
 * Default raw-report directory for a run: `tmp/mcp-conformance/<utc-stamp>`,
 * relative to the repo root. Lives with the IO seam because the wall-clock
 * read is an IO concern; both CLI operations (suites and drive) share it.
 */
export function defaultReportDir(): string {
  const utcStamp = new Date()
    .toISOString()
    .replaceAll(':', '-')
    .replace(/\.\d+Z$/u, 'Z');
  return join('tmp', 'mcp-conformance', utcStamp);
}

/**
 * Persist the wrapper's own aggregate report as `<report-dir>/summary.json`
 * so the report directory (and any CI artifact built from it) carries the
 * verdict document — divergences and failure reasons — alongside the raw
 * per-suite evidence, and stdout purity is never load-bearing.
 */
export function writeRunSummary(
  repoRoot: string,
  reportDir: string,
  reportJson: string,
  ops?: OwnerOnlyWriteOps,
): RetentionOutcome {
  return writeUnder(repoRoot, reportDir, 'summary.json', reportJson, ops);
}

/**
 * Build the real IO seam.
 *
 * @param repoRoot - Absolute repository root (worktree-safe, from `resolveRepoRoot`).
 * @param reportDir - Raw-report directory: absolute, or relative to the repo root.
 * @param ops - Owner-only write operations; production callers omit it and
 *   get the real `node:fs` edge. Injectable so the owner-only ordering
 *   contract is provable THROUGH this production entry point.
 */
export function buildMcpConformanceNodeIo(
  repoRoot: string,
  reportDir: string,
  ops?: OwnerOnlyWriteOps,
): McpConformanceIo {
  return {
    runMcpjam: (args) => {
      const bin = resolveMcpjamBin(repoRoot);
      if (bin.ok) {
        return spawnMcpjam(repoRoot, bin.value, args);
      }
      return bin;
    },
    retainRawReport: retainUnder(repoRoot, reportDir, ops),
  };
}

/**
 * Write owner-only at an ABSOLUTE path, creating parent directories. The
 * same write-then-never-expose discipline as `writeUnder`, for artefacts
 * whose destination the caller has already resolved (the reviewer pack via
 * `--pack-out`): the pack embeds vendor failure text from authed runs, the
 * same content class the summary protects at 0600.
 */
export function retainOwnerOnlyAt(absolutePath: string, content: string): RetentionOutcome {
  try {
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeOwnerOnly(absolutePath, content);
    return { ok: true, reportedPath: absolutePath };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
