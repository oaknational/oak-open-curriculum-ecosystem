#!/usr/bin/env node

/**
 * Repository encoding scanner.
 *
 * Reads the raw bytes of every tracked file and reports, by severity:
 *
 * - **critical** — invalid UTF-8, a byte-order mark, bidirectional controls
 *   (Trojan-Source risk), C0/C1 control characters, or the U+FFFD replacement
 *   character (the scar of prior mojibake).
 * - **notable** — zero-width / invisible characters, unusual spaces (NBSP and
 *   kin), and text not in Normalization Form C.
 * - **informational** — typographic punctuation (smart quotes, em dashes), which
 *   is valid and usually intentional.
 *
 * Binary files (those containing a NUL byte) are counted separately and never
 * reported as violations. Detection is deterministic and byte-level; reading raw
 * bytes is essential, because decoding as UTF-8 first would replace invalid
 * sequences with U+FFFD and hide them.
 *
 * Default: report findings, exit 0. `--fail-on <critical|notable|informational>`
 * exits 1 when any file has a finding at or above that severity (gate use).
 * `--json` emits the machine-readable report. Exit 2 signals invalid usage.
 *
 * @packageDocumentation
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { resolveRepoRoot } from '../core/repo-root.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import { resolveTrustedGit } from '../core/trusted-git.js';

import { analyzeFileBytes, reportFailsThreshold } from './check-encoding-helpers.js';
import { formatScanReport, isFlagged } from './check-encoding-report.js';
import {
  SEVERITY_ORDER,
  type EncodingSeverity,
  type FileEncodingReport,
} from './check-encoding-types.js';

/** NUL is the `git ls-files -z` record separator. */
const NUL = '\u0000';

interface ParsedArgs {
  readonly json: boolean;
  readonly help: boolean;
  readonly failOn: EncodingSeverity | null;
}

function isSeverity(value: string): value is EncodingSeverity {
  const severities: readonly string[] = SEVERITY_ORDER;
  return severities.includes(value);
}

function parseFailOnValue(value: string | undefined): Result<EncodingSeverity, string> {
  if (value === undefined || !isSeverity(value)) {
    return err(
      `--fail-on requires one of: ${SEVERITY_ORDER.join(', ')} (received ${value ?? '<nothing>'})`,
    );
  }
  return ok(value);
}

/** Parse argv (already sliced past `node script`); `err` carries a usage message. */
export function parseArgs(argv: readonly string[]): Result<ParsedArgs, string> {
  let json = false;
  let help = false;
  let failOn: EncodingSeverity | null = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      help = true;
      continue;
    }
    if (arg !== '--fail-on') {
      return err(`unknown argument: ${arg ?? '<undefined>'}`);
    }
    const failOnResult = parseFailOnValue(argv[index + 1]);
    index += 1;
    if (isErr(failOnResult)) {
      return failOnResult;
    }
    failOn = failOnResult.value;
  }
  return ok({ json, help, failOn });
}

const HELP_TEXT = `check-encoding — scan tracked files for encoding problems

Usage: pnpm agent-tools:check-encoding [--fail-on <severity>] [--json]

  --fail-on <critical|notable|informational>
        Exit 1 when any file has a finding at or above this severity.
        Default: report only, exit 0.
  --json
        Emit the machine-readable report instead of formatted text.
  --help, -h
        Show this help.`;

function listTrackedFiles(repoRoot: string): string[] {
  const stdout = execFileSync(resolveTrustedGit(), ['ls-files', '-z'], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return stdout.split(NUL).filter((entry) => entry.length > 0);
}

/** Read and analyse every tracked file; `err` names the first unreadable file. */
function analyzeAll(
  repoRoot: string,
  relativePaths: readonly string[],
): Result<FileEncodingReport[], string> {
  const reports: FileEncodingReport[] = [];
  for (const relativePath of relativePaths) {
    try {
      const bytes = readFileSync(path.join(repoRoot, relativePath));
      reports.push(analyzeFileBytes(relativePath, new Uint8Array(bytes)));
    } catch (cause) {
      // Fail loud: a tracked file the scanner cannot read could hide an encoding
      // defect, so silently skipping it would be a green-gate bypass.
      return err(
        `cannot read tracked file '${relativePath}': ${cause instanceof Error ? cause.message : String(cause)}`,
      );
    }
  }
  return ok(reports);
}

function emit(parsed: ParsedArgs, reports: readonly FileEncodingReport[]): void {
  const binaryCount = reports.filter((report) => report.isBinary).length;
  const flagged = reports.filter((report) => isFlagged(report) && !report.isBinary);
  if (parsed.json) {
    writeLine(
      JSON.stringify({ scanned: reports.length, binary: binaryCount, flagged }, undefined, 2),
    );
    return;
  }
  for (const line of formatScanReport(reports.length, binaryCount, flagged, parsed.failOn)) {
    writeLine(line);
  }
}

function gateExitCode(
  reports: readonly FileEncodingReport[],
  failOn: EncodingSeverity | null,
): number {
  if (failOn === null) {
    return 0;
  }
  const failures = reports.filter(
    (report) => !report.isBinary && reportFailsThreshold(report, failOn),
  );
  if (failures.length === 0) {
    return 0;
  }
  writeErrorLine(`\n✖ ${failures.length} file(s) at or above severity '${failOn}'.`);
  return 1;
}

function main(argv: readonly string[]): number {
  const parsed = parseArgs(argv);
  if (isErr(parsed)) {
    writeErrorLine(`check-encoding: ${parsed.error}`);
    writeErrorLine(HELP_TEXT);
    return 2;
  }
  if (parsed.value.help) {
    writeLine(HELP_TEXT);
    return 0;
  }

  const repoRoot = resolveRepoRoot(import.meta.url);
  const analysed = analyzeAll(repoRoot, listTrackedFiles(repoRoot));
  if (isErr(analysed)) {
    writeErrorLine(`check-encoding: ${analysed.error}`);
    return 2;
  }

  emit(parsed.value, analysed.value);
  return gateExitCode(analysed.value, parsed.value.failOn);
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  process.exit(main(process.argv.slice(2)));
}
