#!/usr/bin/env node
/**
 * `agent-tools mcp-conformance` (MCP-189): MCPJam conformance suites against
 * a deployed MCP surface, with named verdicts against committed baselines.
 *
 * NAMING: distinct from `protocol-conformance` (the estate's
 * collaboration-protocol tier validator) — this command targets MCP servers.
 */
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { scanArgs, type FlagHandler, type ValueHandler } from '../core/cli-arg-parser.js';
import { HELP_TEXT } from './mcp-conformance-help.js';
import { resolveRepoRoot } from '../core/repo-root.js';
import { validateCliState, type CliState } from '../mcp-conformance/cli-validation.js';
import { runCompatFromCli } from '../mcp-conformance/compat-cli.js';
import { emitRunReportJson, runDriveFromCli } from '../mcp-conformance/drive-cli.js';
import { loadBaselines, type BaselineRead } from '../mcp-conformance/load-baselines.js';
import { buildMcpConformanceNodeIo, defaultReportDir } from '../mcp-conformance/node-io.js';
import { runMcpConformance } from '../mcp-conformance/report.js';
import { UNATTENDED_SUITES } from '../mcp-conformance/runner.js';
import {
  conformanceSuiteSchema,
  type ConformanceMode,
  type ConformanceOperation,
  type ConformanceRunReport,
  type ConformanceSuite,
} from '../mcp-conformance/types.js';

const INITIAL_STATE: CliState = {
  help: false,
  unattended: false,
  seed: false,
  drive: false,
  compat: false,
  target: undefined,
  suites: [],
  credentialsFile: undefined,
  reportDir: undefined,
  baselineDir: undefined,
  packOut: undefined,
  preambleFile: undefined,
  suiteErrors: [],
};

const CLI_FLAGS: Readonly<Record<string, FlagHandler<CliState>>> = {
  '--help': (state) => {
    state.help = true;
  },
  '-h': (state) => {
    state.help = true;
  },
  '--unattended': (state) => {
    state.unattended = true;
  },
  '--seed': (state) => {
    state.seed = true;
  },
  '--drive': (state) => {
    state.drive = true;
  },
  '--compat': (state) => {
    state.compat = true;
  },
};

const CLI_VALUE_OPTIONS: Readonly<Record<string, ValueHandler<CliState>>> = {
  '--target': (state, value) => {
    state.target = value;
  },
  '--suite': (state, value) => {
    const parsed = conformanceSuiteSchema.safeParse(value);
    if (parsed.success) {
      state.suites.push(parsed.data);
    } else {
      state.suiteErrors.push(`unknown suite "${value}" (expected protocol | apps | oauth)`);
    }
  },
  '--credentials-file': (state, value) => {
    state.credentialsFile = value;
  },
  '--report-dir': (state, value) => {
    state.reportDir = value;
  },
  '--baseline-dir': (state, value) => {
    state.baselineDir = value;
  },
  '--pack-out': (state, value) => {
    state.packOut = value;
  },
  '--preamble-file': (state, value) => {
    state.preambleFile = value;
  },
};

function scanCliArgs(
  argv: readonly string[],
):
  { readonly ok: true; readonly state: CliState } | { readonly ok: false; readonly error: string } {
  return scanArgs<CliState>(
    argv,
    { ...INITIAL_STATE, suites: [], suiteErrors: [] },
    { flags: CLI_FLAGS, valueOptions: CLI_VALUE_OPTIONS, helpText: HELP_TEXT },
  );
}

/**
 * Real baseline reader over one directory: ENOENT is the ABSENT state,
 * every other read error is preserved as the true cause.
 */
function baselineReaderFor(baselineDirAbsolute: string) {
  return (fileName: string): BaselineRead => {
    try {
      return { kind: 'ok', content: readFileSync(join(baselineDirAbsolute, fileName), 'utf8') };
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return { kind: 'absent' };
      }
      return { kind: 'error', message: error instanceof Error ? error.message : String(error) };
    }
  };
}

const DEFAULT_BASELINE_DIR = 'agent-tools/src/mcp-conformance/baselines';

function runFromCli(state: CliState, target: string): 0 | 1 {
  const operation: ConformanceOperation = state.seed ? 'seed' : 'verdict';
  const mode: ConformanceMode = state.unattended ? 'unattended' : 'attended';
  const defaultSuites: readonly ConformanceSuite[] = state.unattended
    ? UNATTENDED_SUITES
    : ['protocol', 'apps', 'oauth'];
  const suites = state.suites.length > 0 ? state.suites : defaultSuites;

  // projectDir is explicitly disabled, matching the protocol-conformance bin:
  // a worktree invocation must report on the tree it runs inside, never be
  // rebound to the primary checkout.
  const repoRoot = resolveRepoRoot(import.meta.url, { projectDir: undefined });
  const reportDir = state.reportDir ?? defaultReportDir();
  const baselineDir = state.baselineDir ?? DEFAULT_BASELINE_DIR;

  // `resolve` (not `join`): an absolute --baseline-dir stands as given, a
  // relative one resolves against the repo root.
  const { report, exitCode } = runMcpConformance(buildMcpConformanceNodeIo(repoRoot, reportDir), {
    target,
    operation,
    mode,
    suites,
    baselines: loadBaselines({
      reader: baselineReaderFor(resolve(repoRoot, baselineDir)),
      suites,
      mode,
    }),
    ...(state.credentialsFile === undefined ? {} : { credentialsFile: state.credentialsFile }),
  });
  return emitReport(repoRoot, reportDir, report, exitCode);
}

// One shared emitter for both operations (consolidate-at-second-consumer):
// the report/summary/stdout contract lives in drive-cli's emitRunReportJson.
function emitReport(
  repoRoot: string,
  reportDir: string,
  report: ConformanceRunReport,
  exitCode: 0 | 1,
): 0 | 1 {
  const reportJson = `${JSON.stringify(report, null, 2)}\n`;
  return emitRunReportJson(repoRoot, reportDir, reportJson) ? exitCode : 1;
}

function main(): void {
  const scanned = scanCliArgs(process.argv.slice(2));
  if (!scanned.ok) {
    process.stderr.write(`${scanned.error}\n`);
    process.exitCode = 2;
    return;
  }
  if (scanned.state.help) {
    process.stdout.write(HELP_TEXT);
    return;
  }
  const validationError = validateCliState(scanned.state);
  if (validationError !== undefined || scanned.state.target === undefined) {
    const reason = validationError ?? '--target is required';
    process.stderr.write(`${reason}\n${HELP_TEXT}\n`);
    process.exitCode = 2;
    return;
  }
  process.exitCode = selectOperation(scanned.state, scanned.state.target);
}

/**
 * Operation dispatch: compat, drive, or the default suite route (verdict,
 * with --seed as its authoring mode). Compat is a sibling of drive rather
 * than a fourth suite: its report schema, failure channel and exit semantics
 * are inverted relative to the suites (see `compat-run.ts`), so it carries
 * its own gate rather than bending the suites'.
 */
function selectOperation(state: CliState, target: string): 0 | 1 {
  if (state.compat) {
    return runCompatFromCli(state, target);
  }
  if (state.drive) {
    return runDriveFromCli(state, target);
  }
  return runFromCli(state, target);
}

main();
