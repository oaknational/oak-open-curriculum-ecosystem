/**
 * Node IO for `agent-tools mcp-conformance` (MCP-189): raw-report retention
 * under a caller-chosen directory (absolute, or relative to the repo root),
 * and the assembly of the IO port the orchestration is handed.
 *
 * Launching the vendor CLI lives next door in `mcpjam-runner.ts`: reaching
 * out to another process and writing artefacts are different concerns, and
 * this file is the second.
 */
import { dirname, join, resolve } from 'node:path';

import { type McpConformanceIo, type RetentionOutcome } from './io-port.js';
import { resolveMcpjamBin, spawnMcpjam, type McpjamBinResolver } from './mcpjam-runner.js';
import { nodeOwnerOnlyWriteOps, type OwnerOnlyWriteOps } from './owner-only-write-ops.js';
import { assertOwnerOnlyEstablishable, writeOwnerOnly } from './owner-only-write.js';
import { type ConformanceSuite } from './types.js';

/**
 * Owner-only write of one file under a directory (created if absent).
 * Relative paths resolve against the repo root; an absolute `reportDir`
 * stands as given. The REPORTED path preserves the caller's own form
 * (relative in, repo-root-relative out; absolute in, absolute out) so the
 * emitted report never names a path that does not exist.
 *
 * Shared by the suites' retention here and the drive's per-tool evidence
 * retention (`drive-node-io.ts`) — every retained artefact can embed authed
 * vendor output, so all of them are OWNER-ONLY, established before any
 * content lands; the full rationale and ordering discipline live with
 * {@link writeOwnerOnly} in `owner-only-write.ts`. `platform` defaults to
 * the running host; a Windows host yields a failed outcome naming that
 * owner-only retention is unavailable there, and nothing is written.
 */
export function writeUnder(
  repoRoot: string,
  reportDir: string,
  fileName: string,
  content: string,
  ops?: OwnerOnlyWriteOps,
  platform?: NodeJS.Platform,
): RetentionOutcome {
  const writeDir = resolve(repoRoot, reportDir);
  const reportedPath = join(reportDir, fileName);
  // Directory creation goes through the SAME seam as the write. Tests are not
  // permitted filesystem access, so every call on this path is injectable by
  // construction; a direct `mkdirSync` here would put the code after it out of
  // reach of any permitted test.
  const edge = ops ?? nodeOwnerOnlyWriteOps;
  try {
    // A refusal leaves nothing behind: the platform check precedes `mkdir`, or a
    // Windows host would create the caller's report directory on its way to
    // reporting that it wrote nothing.
    assertOwnerOnlyEstablishable(platform ?? process.platform);
    edge.mkdir(writeDir);
    writeOwnerOnly(join(writeDir, fileName), content, edge, platform);
    return { ok: true, reportedPath };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function retainUnder(
  repoRoot: string,
  reportDir: string,
  ops?: OwnerOnlyWriteOps,
  platform?: NodeJS.Platform,
) {
  return (suite: ConformanceSuite, content: string): RetentionOutcome =>
    writeUnder(repoRoot, reportDir, `${suite}.json`, content, ops, platform);
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
  platform?: NodeJS.Platform,
): RetentionOutcome {
  return writeUnder(repoRoot, reportDir, 'summary.json', reportJson, ops, platform);
}

/**
 * Build the real IO seam.
 *
 * @param repoRoot - Absolute repository root (worktree-safe, from `resolveRepoRoot`).
 * @param reportDir - Raw-report directory: absolute, or relative to the repo root.
 * @param ops - Owner-only write operations; production callers omit it and
 *   get the real `node:fs` edge. Injectable so the owner-only ordering
 *   contract is provable THROUGH this production entry point.
 * @param platform - Defaults to the running host; a Windows host yields the
 *   owner-only refusal on every retention (see `owner-only-write.ts`).
 * @param resolveBin - Module-resolution edge; production callers omit it. It is
 *   injectable for the same reason `ops` is: `resolve` walks `node_modules` on
 *   disk, so the resolution-failure branch is only describable through a seam.
 */
export function buildMcpConformanceNodeIo(
  repoRoot: string,
  reportDir: string,
  ops?: OwnerOnlyWriteOps,
  platform?: NodeJS.Platform,
  resolveBin?: McpjamBinResolver,
): McpConformanceIo {
  return {
    runMcpjam: (args) => {
      const bin = resolveMcpjamBin(repoRoot, resolveBin);
      if (bin.ok) {
        return spawnMcpjam(repoRoot, bin.value, args);
      }
      return bin;
    },
    retainRawReport: retainUnder(repoRoot, reportDir, ops, platform),
  };
}

/**
 * Write owner-only at an ABSOLUTE path, creating parent directories. The
 * same write-then-never-expose discipline as `writeUnder`, for artefacts
 * whose destination the caller has already resolved (the reviewer pack via
 * `--pack-out`): the pack embeds vendor failure text from authed runs, the
 * same content class the summary protects owner-only. `ops` is the same
 * injectable seam as everywhere else on this surface, so the ordering
 * contract is provable through this entry point too, as is the Windows
 * refusal (`platform` defaults to the running host).
 */
export function retainOwnerOnlyAt(
  absolutePath: string,
  content: string,
  ops?: OwnerOnlyWriteOps,
  platform?: NodeJS.Platform,
): RetentionOutcome {
  // The same seam as `writeUnder`: no filesystem call on a retention path sits
  // outside it, so every one of them is reachable by a test that may not do IO.
  const edge = ops ?? nodeOwnerOnlyWriteOps;
  try {
    // As in `writeUnder`: refuse the platform before creating any directory, so
    // a refused retention mutates nothing at the caller-selected path.
    assertOwnerOnlyEstablishable(platform ?? process.platform);
    edge.mkdir(dirname(absolutePath));
    writeOwnerOnly(absolutePath, content, edge, platform);
    return { ok: true, reportedPath: absolutePath };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
