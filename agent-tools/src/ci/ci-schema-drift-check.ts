/**
 * Advisory CI check: compares the committed OpenAPI schema cache against
 * the live upstream spec and renders ONE verdict onto every signal surface.
 * Always exits 0 — this is informational, not blocking.
 *
 * Stream contract (the ci-turbo-report shape): STDOUT carries the
 * step-summary markdown — the workflow appends it with
 * `>> "$GITHUB_STEP_SUMMARY"` — while `::warning`/`::notice` workflow
 * commands go to STDERR, where the Actions runner still parses them but the
 * summary redirect cannot swallow them. The commit-status DESCRIPTION rides
 * `$GITHUB_OUTPUT` (that channel has no stdout alternative); the POST itself
 * lives in the workflow via `gh api`, which owns retry, timeout, and
 * User-Agent concerns — and keeps the status token OFF the build job.
 *
 * Every path yields a verdict — in-sync, drifted, or skipped-with-reason —
 * so a fetch failure produces a status that SAYS "skipped" rather than a
 * missing status indistinguishable from the check never running (the
 * 2026-08-18 failure class: a correct signal landing where nobody looks).
 *
 * The upstream swagger endpoint is public, so no authentication is required.
 *
 * @packageDocumentation
 */

import { appendFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { resolveRepoRoot } from '../core/repo-root.js';

import {
  buildSchemaDriftReport,
  buildSkippedSchemaDriftReport,
  type SchemaDriftReport,
} from './ci-schema-drift-report.js';
import { escapeAnnotationMessage } from './ci-turbo-report-formatting.js';

const SCHEMA_URL = 'https://open-api.thenational.academy/api/v0/swagger.json';
const CACHE_PATH = resolve(
  resolveRepoRoot(import.meta.url),
  'packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json',
);
const CACHE_FILE_ANNOTATION =
  'file=packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json';

/**
 * Abort the advisory upstream fetch after this long. Pre-push runs this check
 * non-blocking, but a stalled connection (offline, captive portal, proxy) would
 * otherwise hang the fetch and block the push regardless of `|| true`, which only
 * catches a non-zero exit after the request returns.
 */
const SCHEMA_FETCH_TIMEOUT_MS = 5000;

/** Step-summary markdown: stdout, so the workflow's `>>` redirect owns the file. */
function writeSummaryLine(message: string): void {
  process.stdout.write(`${message}\n`);
}

/** Workflow commands (`::warning`/`::notice`): stderr, out of the summary redirect's path. */
function writeWorkflowCommand(message: string): void {
  process.stderr.write(`${message}\n`);
}

/**
 * Error text that rides a workflow command is escaped like every other
 * untrusted surface: a malformed upstream body reaches `JSON.parse`'s
 * message, which quotes raw bytes of the document (a line break included),
 * and an unescaped line break would end the `::notice::` line early.
 */
function describeError(error: unknown): string {
  return escapeAnnotationMessage(String(error));
}

/**
 * Hand the verdict to the workflow's status-publish job. `$GITHUB_OUTPUT`
 * is the one channel with no stdout alternative, so the script writes it
 * directly; local and pre-push runs (no env) skip silently.
 *
 * Line format: one `key=value` per line, so the description must never
 * carry a line break — the report builder percent-encodes CR and LF before
 * it caps the length, which is what keeps a second key or a heredoc
 * delimiter from being injected through upstream text (the invariant
 * `ci-schema-drift-report.unit.test.ts` pins).
 */
async function writeStepOutputs(report: SchemaDriftReport): Promise<void> {
  const outputPath = process.env['GITHUB_OUTPUT'] ?? '';
  if (outputPath === '') {
    return;
  }
  try {
    await appendFile(outputPath, `description=${report.statusDescription}\n`, 'utf8');
  } catch (error) {
    writeWorkflowCommand(`::notice::Schema drift outputs not written: ${describeError(error)}`);
  }
}

async function fetchLiveSchema(): Promise<string | null> {
  const response = await fetch(SCHEMA_URL, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(SCHEMA_FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    writeWorkflowCommand(
      `::notice::Schema drift check skipped — upstream returned HTTP ${String(response.status)}.`,
    );
    return null;
  }

  const liveJson: unknown = await response.json();
  return JSON.stringify(liveJson, undefined, 2);
}

async function readCachedSchema(): Promise<string | null> {
  try {
    return await readFile(CACHE_PATH, 'utf8');
  } catch {
    writeWorkflowCommand(`::warning ${CACHE_FILE_ANNOTATION}::Schema cache file not found.`);
    return null;
  }
}

/** Compare live against cache, or explain why the comparison could not run. */
async function computeReport(): Promise<SchemaDriftReport> {
  let liveText: string | null;
  try {
    liveText = await fetchLiveSchema();
  } catch (error) {
    writeWorkflowCommand(
      `::notice::Schema drift check skipped — failed to fetch upstream schema: ${describeError(error)}`,
    );
    return buildSkippedSchemaDriftReport('upstream schema fetch failed');
  }
  if (liveText === null) {
    return buildSkippedSchemaDriftReport('upstream schema fetch refused');
  }

  const cachedText = await readCachedSchema();
  if (cachedText === null) {
    return buildSkippedSchemaDriftReport('schema cache file missing');
  }

  return buildSchemaDriftReport(cachedText, liveText);
}

async function main(): Promise<void> {
  const report = await computeReport();

  if (report.annotation !== undefined) {
    writeWorkflowCommand(report.annotation);
  }
  writeSummaryLine(report.summaryMarkdown);
  await writeStepOutputs(report);
}

try {
  await main();
} catch (error) {
  process.stderr.write(
    `::notice::Schema drift check failed unexpectedly: ${describeError(error)}\n`,
  );
}
