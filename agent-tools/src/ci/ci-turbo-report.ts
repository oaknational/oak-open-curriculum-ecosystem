#!/usr/bin/env node
/**
 * Entry point for the Turbo CI summary reporter.
 *
 * @remarks
 * This module owns the I/O layer: it locates the Turbo run-summary JSON file,
 * delegates parsing to `ci-turbo-summary-parsing` and formatting to
 * `ci-turbo-report-formatting`, then writes output to the provided streams.
 *
 * The module also re-exports the public API from its sibling modules so that
 * existing callers — including both the unit and integration test suites — can
 * import everything from this single path without change.
 *
 * @packageDocumentation
 */

import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveRepoRoot } from '../core/repo-root.js';

import type {
  CiFileSystem,
  RunCiTurboReportOptions,
  TurboSummary,
} from './ci-turbo-report-types.js';
import { parseTurboSummary } from './ci-turbo-summary-parsing.js';
import {
  escapeAnnotationMessage,
  formatAnnotations,
  formatSummaryTable,
} from './ci-turbo-report-formatting.js';

// Re-exports — keeps the public API stable at this module path.
export type {
  CiFileSystem,
  TurboTask,
  TurboSummary,
  ParseResult,
  RunCiTurboReportOptions,
} from './ci-turbo-report-types.js';
export { parseTurboSummary } from './ci-turbo-summary-parsing.js';
export { formatSummaryTable, formatAnnotations } from './ci-turbo-report-formatting.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Default directory Turbo writes run-summary JSON files into.
 *
 * @remarks
 * Resolved at module load time relative to the repository root so the path
 * is stable regardless of the working directory from which the CLI is invoked.
 */
const DEFAULT_RUNS_DIR = path.resolve(resolveRepoRoot(import.meta.url), '.turbo/runs');

// ---------------------------------------------------------------------------
// Production filesystem implementation
// ---------------------------------------------------------------------------

/**
 * The default {@link CiFileSystem} backed by the real Node.js `fs/promises`
 * module.
 *
 * @remarks
 * `readdir` filters to plain files only so that subdirectories are never
 * mistaken for JSON summary candidates.
 */
const nodeCiFileSystem: CiFileSystem = {
  readdir: (dir) =>
    fsPromises
      .readdir(dir, { withFileTypes: true })
      .then((entries) => entries.filter((e) => e.isFile()).map((e) => e.name)),
  stat: (filePath) => fsPromises.stat(filePath),
  readFile: (filePath, encoding) => fsPromises.readFile(filePath, encoding),
};

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

/**
 * Find the newest Turbo summary JSON file in a runs directory.
 *
 * @remarks
 * Files are sorted by modification time descending. When two files share the
 * same `mtimeMs`, the one that sorts last lexicographically is chosen for
 * determinism.
 *
 * @param runsDir - Absolute path to the directory containing Turbo run JSON files.
 * @param fileSystem - Injectable filesystem seam; defaults to the real Node.js implementation.
 * @returns The absolute path to the most-recently-modified JSON file.
 * @throws `Error` when `runsDir` contains no JSON files.
 */
export async function findLatestSummaryFile(
  runsDir: string,
  fileSystem: CiFileSystem = nodeCiFileSystem,
): Promise<string> {
  const names = await fileSystem.readdir(runsDir);
  const jsonNames = names.filter((name) => name.endsWith('.json'));

  if (jsonNames.length === 0) {
    throw new Error(`No Turbo summary JSON files were found in "${runsDir}".`);
  }

  const datedFiles = await Promise.all(
    jsonNames.map(async (name) => {
      const filePath = path.join(runsDir, name);
      const stats = await fileSystem.stat(filePath);
      return { filePath, mtimeMs: stats.mtimeMs };
    }),
  );

  datedFiles.sort((left, right) =>
    right.mtimeMs !== left.mtimeMs
      ? right.mtimeMs - left.mtimeMs
      : right.filePath.localeCompare(left.filePath),
  );

  const newest = datedFiles[0];
  if (newest === undefined) {
    throw new Error(`No Turbo summary JSON files were found in "${runsDir}".`);
  }

  return newest.filePath;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Resolve the path to the Turbo summary file that will be parsed.
 *
 * When an explicit `filePath` is supplied it is used as-is. Otherwise the
 * newest file in `runsDir` is discovered via {@link findLatestSummaryFile}.
 *
 * @param filePath - Caller-supplied explicit path, or `undefined`.
 * @param runsDir - Directory to search when `filePath` is absent.
 * @param fileSystem - Filesystem seam forwarded to discovery.
 * @returns The resolved absolute path to the summary file.
 */
async function resolveSummaryPath(
  filePath: string | undefined,
  runsDir: string,
  fileSystem: CiFileSystem,
): Promise<string> {
  if (typeof filePath === 'string' && filePath.length > 0) {
    return filePath;
  }
  return findLatestSummaryFile(runsDir, fileSystem);
}

/**
 * Write formatted summary output to the provided stdio streams.
 *
 * The markdown table always goes to `stdout`. Annotations are written to
 * `stderr` only when at least one task failed — an empty annotations string
 * produces no write call.
 *
 * @param summary - A fully parsed {@link TurboSummary}.
 * @param stdout - Stream for the markdown step summary.
 * @param stderr - Stream for GitHub Actions error annotations.
 */
function writeSummaryToStreams(
  summary: TurboSummary,
  stdout: { write: (text: string) => void },
  stderr: { write: (text: string) => void },
): void {
  stdout.write(`${formatSummaryTable(summary)}\n`);
  const annotations = formatAnnotations(summary);
  if (annotations !== '') {
    stderr.write(`${annotations}\n`);
  }
}

/**
 * Resolve all {@link RunCiTurboReportOptions} fields to their concrete
 * production values, filling in defaults where options are absent.
 *
 * @param options - Caller-supplied options object (may be empty).
 * @returns A fully-resolved options record with no optional fields.
 */
function resolveReportOptions(options: RunCiTurboReportOptions): {
  summaryFilePath: string | undefined;
  runsDir: string;
  stdout: { write: (text: string) => void };
  stderr: { write: (text: string) => void };
  fileSystem: CiFileSystem;
} {
  return {
    summaryFilePath: options.summaryFilePath,
    runsDir: options.runsDir ?? DEFAULT_RUNS_DIR,
    stdout: options.stdout ?? process.stdout,
    stderr: options.stderr ?? process.stderr,
    fileSystem: options.fs ?? nodeCiFileSystem,
  };
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/**
 * Run the Turbo summary reporter: locate the summary file, parse it, and
 * write formatted output to the configured streams.
 *
 * @remarks
 * Best-effort: on any failure the function emits a `::warning` annotation to
 * `stderr` instead of throwing, so it never causes the CI step itself to fail.
 * The returned `exitCode` is always `0`.
 *
 * @param options - Optional overrides for the summary file path, runs
 *   directory, I/O streams, and filesystem.
 * @returns An object containing `exitCode` (always `0`).
 */
export async function runCiTurboReport(
  options: RunCiTurboReportOptions = {},
): Promise<{ exitCode: number }> {
  const { summaryFilePath, runsDir, stdout, stderr, fileSystem } = resolveReportOptions(options);

  try {
    const resolvedPath = await resolveSummaryPath(summaryFilePath, runsDir, fileSystem);
    const parsedJson: unknown = JSON.parse(await fileSystem.readFile(resolvedPath, 'utf8'));
    const result = parseTurboSummary(parsedJson);

    if (!result.ok) {
      throw result.error;
    }

    writeSummaryToStreams(result.value, stdout, stderr);
    return { exitCode: 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Turbo reporter failure.';
    stderr.write(
      `::warning::Unable to generate Turbo summary: ${escapeAnnotationMessage(message)}\n`,
    );
    return { exitCode: 0 };
  }
}

// Self-exec tail
const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFilePath) {
  const { exitCode } = await runCiTurboReport({ summaryFilePath: process.argv[2] });
  process.exit(exitCode);
}
