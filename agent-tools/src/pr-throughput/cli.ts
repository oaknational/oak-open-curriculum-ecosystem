#!/usr/bin/env node
/**
 * `pr-throughput` — the PDR-131 throughput register CLI.
 *
 * @remarks
 * Fitness-informational (ADR-144 three-zone model): runtime and measurement
 * failures print loudly with the contract named and exit 0 — the command
 * reports trend, it never gates, and a red transport never masquerades as a
 * quiet pass or blocks a chain. Only `--help` and argument errors sit outside
 * that contract (usage + exit 0 / usage + exit 2, per the CLI help contract).
 * `--write` appends one dated row to the tracked register; without it the row
 * prints for inspection only.
 */
import { execFileSync } from 'node:child_process';
import {
  appendFileSync,
  linkSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import type { GhCommandExecutor } from '../pr-watch/gh.js';

import { parsePrThroughputArgs, USAGE, type PrThroughputOptions } from './cli-args.js';
import { assertWindowCovered, CANONICAL_REPOSITORY, fetchMergedPrs } from './gh-fetch.js';
import { computeThroughput, formatRegisterRow, REGISTER_HEADER } from './index.js';

export { DEFAULT_REGISTER_PATH, parsePrThroughputArgs } from './cli-args.js';

/** IO seams; tests inject fakes, the entry point injects the real edges. */
export interface PrThroughputDeps {
  readonly executor: GhCommandExecutor;
  /** Create the register with the header, exclusively; false when it already exists. */
  readonly createRegister: (registerPath: string, header: string) => boolean;
  /** Append one row atomically (O_APPEND — never read-modify-overwrite). */
  readonly appendRegisterRow: (registerPath: string, row: string) => void;
  /** Read the register's first `length` characters; null when unreadable. */
  readonly readRegisterHead: (registerPath: string, length: number) => string | null;
  /** Output-line sink — injected so tests never touch ambient stdout. */
  readonly writeLine: (message: string) => void;
  /** Error-line sink — injected so tests can verify failures print loudly. */
  readonly writeError: (message: string) => void;
}

/**
 * Run the report. Runtime and measurement failures return 0 with loud stderr
 * text naming the informational contract; `--help` returns 0 with the usage
 * block, and argument errors return 2 with the error plus the usage block.
 */
export function runPrThroughput(argv: readonly string[], deps: PrThroughputDeps): number {
  // Help and argument errors follow the agent-tools CLI help contract
  // (README §CLI Norms), OUTSIDE the fitness-informational path: --help
  // prints the full usage and exits 0; invalid arguments print the error
  // AND the full usage, then exit non-zero.
  if (argv.includes('--help')) {
    deps.writeLine(USAGE);
    return 0;
  }

  let options: PrThroughputOptions;

  try {
    options = parsePrThroughputArgs(argv, new Date());
  } catch (error) {
    deps.writeError(
      `pr-throughput: ${error instanceof Error ? error.message : String(error)}\n\n${USAGE}`,
    );
    return 2;
  }

  // The informational contract covers EVERYTHING downstream: a register
  // write failing on permissions must still exit 0 with the loud message.
  try {
    return runWithOptions(options, deps);
  } catch (error) {
    return reportFailure(deps, error);
  }
}

function runWithOptions(options: PrThroughputOptions, deps: PrThroughputDeps): number {
  const covered = fetchCoveredCorpus(options, deps);

  if (!covered.ok) {
    return reportFailure(deps, covered.error);
  }

  const report = computeThroughput(covered.value, {
    windowDays: options.windowDays,
    now: options.now,
  });
  const row = formatRegisterRow(report, { note: options.note });

  deps.writeLine(row);
  deps.writeLine(
    `pr-throughput: ${report.mergedCount} merges in ${report.windowDays}d ` +
      `for ${CANONICAL_REPOSITORY} (${report.excludedCoordinationCount} coordination excluded)`,
  );

  if (options.write) {
    writeRegisterRow(options, deps, row);
  }

  return 0;
}

/**
 * Append the row, creating the register when absent. Single-source contract
 * checked where the two artefacts meet: an existing register whose head
 * differs from REGISTER_HEADER has drifted (a correction reached only one
 * copy). Loud, never destructive — the row still appends and the
 * informational contract keeps exit 0.
 */
function writeRegisterRow(options: PrThroughputOptions, deps: PrThroughputDeps, row: string): void {
  const created = deps.createRegister(options.registerPath, REGISTER_HEADER);

  if (!created) {
    const head = deps.readRegisterHead(options.registerPath, REGISTER_HEADER.length);

    if (head !== REGISTER_HEADER) {
      deps.writeError(
        `pr-throughput: register header at ${options.registerPath} has DRIFTED from ` +
          'REGISTER_HEADER — reconcile the two copies (fitness-informational contract: exit 0)',
      );
    }
  }

  deps.appendRegisterRow(options.registerPath, `${row}\n`);
  deps.writeLine(`pr-throughput: row appended to ${options.registerPath}`);
}

/**
 * Fetch the merge-date-bounded corpus (day precision over-fetches slightly;
 * computeThroughput re-filters against the exact instant) and refuse a
 * cap-hit corpus that cannot prove window coverage.
 */
function fetchCoveredCorpus(
  options: PrThroughputOptions,
  deps: PrThroughputDeps,
): ReturnType<typeof fetchMergedPrs> {
  const windowStartMs = options.now.getTime() - options.windowDays * 24 * 60 * 60_000;
  const corpus = fetchMergedPrs({
    executor: deps.executor,
    limit: options.limit,
    mergedSinceDate: new Date(windowStartMs).toISOString().slice(0, 10),
    mergedUntilDate: options.now.toISOString().slice(0, 10),
  });

  if (!corpus.ok) {
    return corpus;
  }

  return assertWindowCovered({
    prs: corpus.value,
    limit: options.limit,
    windowDays: options.windowDays,
  });
}

function reportFailure(deps: Pick<PrThroughputDeps, 'writeError'>, cause: unknown): number {
  const message = cause instanceof Error ? cause.message : String(cause);
  deps.writeError(
    `pr-throughput: FAILED — ${message} (fitness-informational contract: exit 0, nothing gated)`,
  );

  return 0;
}

function realDeps(): PrThroughputDeps {
  return {
    executor: (file, args, options) => execFileSync(file, [...args], options),
    createRegister: (registerPath, header) => {
      mkdirSync(path.dirname(registerPath), { recursive: true });
      // Atomic exclusive publication: the header is written COMPLETE to a
      // private temp file, then hard-linked into place. link(2) is atomic
      // and fails EEXIST if the register already exists, so a concurrent
      // appender can only ever observe either no file (its own creation
      // race to lose) or a file that already starts with the full header —
      // never a partial or header-less register.
      const tempPath = `${registerPath}.${String(process.pid)}.header.tmp`;
      // 'wx' (exclusive create): a pre-existing file OR symlink at the
      // predictable temp path fails loudly instead of being followed and
      // truncating an arbitrary writable target.
      writeFileSync(tempPath, header, { flag: 'wx' });
      try {
        linkSync(tempPath, registerPath);
        return true;
      } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
          return false;
        }

        // EACCES/ENOSPC/anything else is a REAL failure: rethrow into the
        // contract-wide catch (loud message, exit 0) instead of appending
        // to a register that may not exist or be partial.
        throw error;
      } finally {
        unlinkSync(tempPath);
      }
    },
    appendRegisterRow: (registerPath, row) => {
      appendFileSync(registerPath, row);
    },
    readRegisterHead: (registerPath, length) => {
      try {
        return readFileSync(registerPath, 'utf8').slice(0, length);
      } catch {
        return null;
      }
    },
    writeLine,
    writeError: writeErrorLine,
  };
}

function isCliEntryPoint(): boolean {
  const entryPoint = process.argv[1];

  if (entryPoint === undefined) {
    return false;
  }

  return import.meta.url === pathToFileURL(path.resolve(entryPoint)).href;
}

if (isCliEntryPoint()) {
  process.exitCode = runPrThroughput(process.argv.slice(2), realDeps());
}
