/**
 * Composition root for the `arc-metrics` topic.
 *
 * @remarks
 * Vendor and project directories in, an arc's measures out. Parses argv,
 * resolves the project directories (the launch directory's own when none is
 * named; a directory named twice is measured once), lists each one's
 * transcripts, aggregates them, and emits text or JSON. The pure pieces do the
 * work; this layer wires them and translates failures into exit codes — no
 * throw escapes (ADR-088).
 *
 * The arc is every transcript in the directories measured, so the report grows
 * as sessions are added there: the directories named are what bound an arc.
 * A directory the caller named and that does not exist is refused as an input
 * error, since a mistyped name would otherwise drop out of the totals in
 * silence; the directory derived from the launch directory may be absent, and
 * then holds no sessions. The transcripts measured are the main sessions':
 * the vendor nests each session's sub-agent transcripts in a directory of
 * their own, and those are not read.
 *
 * @packageDocumentation
 */

import { resolve } from 'node:path';

import { projectDirectoryFor } from '../session-metadata/transcript-locator.js';
import { aggregateSession, type SessionMetrics } from './aggregate.js';
import { ARC_METRICS_HELP_TEXT, parseArgs, type ArcMetricsOptions } from './cli-options.js';
import type { ArcMetricsFileSystem } from './file-system.js';
import { nodeArcMetricsFileSystem } from './file-system-node.js';
import { formatJson, formatText, type ArcMetricsReport } from './format.js';
import { sessionIdOf } from './session-id.js';

/** Inputs for {@link runArcMetricsCli}. */
export interface ArcMetricsCliInput {
  readonly argv: readonly string[];
  readonly cwd: string;
  readonly env: { readonly HOME?: string };
  readonly fs?: ArcMetricsFileSystem;
  /**
   * Resolves a named directory against the launch directory. The host's own
   * path rule by default; injected so a test's paths mean the same on every
   * host (on Windows the default gives a POSIX-looking path a drive letter).
   */
  readonly resolvePath?: (from: string, to: string) => string;
  readonly stdout?: Pick<NodeJS.WritableStream, 'write'>;
  readonly stderr?: Pick<NodeJS.WritableStream, 'write'>;
}

/** Result of {@link runArcMetricsCli}. */
export interface ArcMetricsCliResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

/**
 * Execute the `arc-metrics` CLI.
 *
 * @param input - argv, cwd, env, and optional injected fs / streams.
 * @returns Exit code and captured stdout/stderr.
 */
export async function runArcMetricsCli(input: ArcMetricsCliInput): Promise<ArcMetricsCliResult> {
  const parsed = parseArgs(input.argv);
  if (!parsed.ok) {
    return emit(input, { exitCode: 2, stdout: '', stderr: `${parsed.error}\n` });
  }
  if (parsed.options.help) {
    return emit(input, { exitCode: 0, stdout: `${ARC_METRICS_HELP_TEXT}\n`, stderr: '' });
  }
  if (parsed.options.vendor !== 'claude') {
    return emit(input, {
      exitCode: 2,
      stdout: '',
      stderr: `--vendor does not support ${parsed.options.vendor} (supported: claude)\n\n${ARC_METRICS_HELP_TEXT}\n`,
    });
  }

  const directories = resolveDirectories(parsed.options, input);
  if (directories.paths.length === 0) {
    return emit(input, {
      exitCode: 2,
      stdout: '',
      stderr: 'no project directory: pass --project-dir, or run with HOME set\n',
    });
  }

  const fs = input.fs ?? nodeArcMetricsFileSystem;
  const measured = await measure({ directories, fs, gapSeconds: parsed.options.gapMinutes * 60 });
  if (!measured.ok) {
    return emit(input, { exitCode: measured.exitCode, stdout: '', stderr: `${measured.error}\n` });
  }

  const report: ArcMetricsReport = {
    vendor: parsed.options.vendor,
    gapSeconds: parsed.options.gapMinutes * 60,
    projectDirectories: directories.paths,
    sessions: measured.sessions,
  };
  const text = parsed.options.json ? formatJson(report) : formatText(report);
  return emit(input, { exitCode: 0, stdout: text, stderr: '' });
}

/** The directories to measure, and whether the caller named them or they were derived. */
interface ResolvedDirectories {
  readonly paths: readonly string[];
  readonly named: boolean;
}

function resolveDirectories(
  options: ArcMetricsOptions,
  input: ArcMetricsCliInput,
): ResolvedDirectories {
  if (options.projectDirs.length > 0) {
    const resolvePath = input.resolvePath ?? resolve;
    return {
      paths: [
        ...new Set(options.projectDirs.map((directory) => resolvePath(input.cwd, directory))),
      ],
      named: true,
    };
  }
  const home = input.env.HOME;
  if (home === undefined || home.length === 0) {
    return { paths: [], named: false };
  }
  return { paths: [projectDirectoryFor({ home, cwd: input.cwd })], named: false };
}

/** A failure with the exit code it maps to: 2 for the caller's input, 1 for a failed read. */
interface Failure {
  readonly ok: false;
  readonly exitCode: 1 | 2;
  readonly error: string;
}

type MeasureOutcome = { readonly ok: true; readonly sessions: readonly SessionMetrics[] } | Failure;

async function measure(input: {
  readonly directories: ResolvedDirectories;
  readonly fs: ArcMetricsFileSystem;
  readonly gapSeconds: number;
}): Promise<MeasureOutcome> {
  // Every directory is listed before any transcript is read, so a directory
  // that does not exist is refused at once, whatever stands before it.
  const transcripts: string[] = [];
  for (const directory of input.directories.paths) {
    const listed = await list(input.fs, directory, input.directories.named);
    if (!listed.ok) {
      return listed;
    }
    transcripts.push(...listed.paths);
  }
  const sessions: SessionMetrics[] = [];
  for (const path of transcripts) {
    const aggregated = await aggregate(input.fs, path, input.gapSeconds);
    if (!aggregated.ok) {
      return aggregated;
    }
    sessions.push(aggregated.session);
  }
  return {
    ok: true,
    sessions: [...sessions].sort((left, right) => left.firstAt.localeCompare(right.firstAt)),
  };
}

type ListOutcome = { readonly ok: true; readonly paths: readonly string[] } | Failure;

async function list(
  fs: ArcMetricsFileSystem,
  directory: string,
  named: boolean,
): Promise<ListOutcome> {
  try {
    const paths = await fs.listTranscripts(directory);
    if (paths === undefined && named) {
      return { ok: false, exitCode: 2, error: `no such project directory: ${directory}` };
    }
    return { ok: true, paths: paths ?? [] };
  } catch (cause) {
    return { ok: false, exitCode: 1, error: `failed to list ${directory}: ${describe(cause)}` };
  }
}

type AggregateOutcome = { readonly ok: true; readonly session: SessionMetrics } | Failure;

async function aggregate(
  fs: ArcMetricsFileSystem,
  path: string,
  gapSeconds: number,
): Promise<AggregateOutcome> {
  try {
    const session = await aggregateSession({
      sessionId: sessionIdOf(path),
      lines: fs.readLines(path),
      gapSeconds,
    });
    return { ok: true, session };
  } catch (cause) {
    return { ok: false, exitCode: 1, error: `failed to read ${path}: ${describe(cause)}` };
  }
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

function emit(input: ArcMetricsCliInput, result: ArcMetricsCliResult): ArcMetricsCliResult {
  if (result.stdout.length > 0) {
    input.stdout?.write(result.stdout);
  }
  if (result.stderr.length > 0) {
    input.stderr?.write(result.stderr);
  }
  return result;
}
