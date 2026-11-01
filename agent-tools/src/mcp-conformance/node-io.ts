/**
 * Raw-report retention for `agent-tools mcp-conformance` (MCP-189):
 * owner-only writes under a caller-chosen directory (absolute, or relative to
 * the repo root), and the IO seam the suites consume.
 *
 * The spawn half lives in `mcpjam-spawn.ts` — the two split when this module
 * outgrew its size budget, along the seam they already had: launching a child
 * versus persisting what it produced.
 */
import { closeSync, fchmodSync, mkdirSync, openSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { type McpConformanceIo, type RetentionOutcome } from './io-port.js';
import { buildMcpjamRunner } from './mcpjam-spawn.js';
import { type ConformanceSuite } from './types.js';

// Writes resolve against the repo root; an absolute reportDir stands as
// given. The REPORTED path preserves the caller's own form (relative in,
// repo-root-relative out; absolute in, absolute out) so the emitted
// report never names a path that does not exist.
// OWNER-ONLY, established BEFORE any content lands. Attended runs retain
// AUTHENTICATED vendor output here, and the report shapes constrain none
// of `error`, `output`, `details` or the captured stderr — a bearer or
// refresh token reaching any of them lands in this file, so the process
// default (0644 under a 022 umask) would expose it to every other user on
// a shared host.
//
// ORDER IS THE WHOLE POINT, and write-then-chmod gets it wrong: the `mode`
// argument applies only when the file is CREATED, so re-writing a report
// left 0644 by an older build would put the authenticated payload on disk
// world-readable and only tighten it afterwards — and if the chmod then
// failed, the content would stay exposed while retention reported failure.
//
// Opening with 'w' truncates to zero length first, so the file is EMPTY at
// this point; `fchmodSync` then tightens it (on the descriptor, so no path
// can be swapped underneath us); only then does content land. A chmod
// failure throws before the write, leaving an empty file and a loud
// retention failure rather than an exposed one. Every throw propagates to
// the caller's catch — including a close failure (EBADF/EIO — the write
// may not have flushed), which is why the success-path close sits INSIDE
// the try and the finally is error-path best-effort only (the caller's
// outcome already carries the true cause; a second throw here would
// replace it with the less useful close error).
function writeOwnerOnly(filePath: string, content: string): void {
  let handle: number | undefined;
  try {
    handle = openSync(filePath, 'w', 0o600);
    fchmodSync(handle, 0o600);
    writeFileSync(handle, content, { encoding: 'utf8' });
    closeSync(handle);
    handle = undefined;
  } finally {
    if (handle !== undefined) {
      try {
        closeSync(handle);
      } catch {
        // Descriptor leak at worst — the true failure is already propagating.
      }
    }
  }
}

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
): RetentionOutcome {
  const writeDir = resolve(repoRoot, reportDir);
  const reportedPath = join(reportDir, fileName);
  try {
    mkdirSync(writeDir, { recursive: true, mode: 0o700 });
    writeOwnerOnly(join(writeDir, fileName), content);
    return { ok: true, reportedPath };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function retainUnder(repoRoot: string, reportDir: string) {
  return (suite: ConformanceSuite, content: string): RetentionOutcome =>
    writeUnder(repoRoot, reportDir, `${suite}.json`, content);
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
): RetentionOutcome {
  return writeUnder(repoRoot, reportDir, 'summary.json', reportJson);
}

/**
 * Build the real IO seam.
 *
 * @param repoRoot - Absolute repository root (worktree-safe, from `resolveRepoRoot`).
 * @param reportDir - Raw-report directory: absolute, or relative to the repo root.
 */
export function buildMcpConformanceNodeIo(repoRoot: string, reportDir: string): McpConformanceIo {
  return {
    runMcpjam: buildMcpjamRunner(repoRoot),
    retainRawReport: retainUnder(repoRoot, reportDir),
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
    mkdirSync(dirname(absolutePath), { recursive: true, mode: 0o700 });
    writeOwnerOnly(absolutePath, content);
    return { ok: true, reportedPath: absolutePath };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
