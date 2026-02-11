#!/usr/bin/env npx tsx
/**
 * CLI argument parsing for live data ingestion using Commander.
 *
 * @remarks
 * Handles parsing of subject, key-stage, and flag arguments with validation.
 * Subject and key stage values are derived from the OpenAPI schema via the SDK.
 * Unknown flags trigger help output and exit.
 *
 * @module ingest-cli-args
 */

import type { KeyStage, SearchSubjectSlug } from '../../../types/oak.js';
import type { SearchIndexKind } from '../../search-index-target.js';
import { createProgram } from './ingest-cli-program.js';
import { ALL_KEY_STAGES, resolveSubjects, validateBulkMode } from './ingest-cli-validators.js';

/** Parsed CLI arguments for ingestion. */
export interface CliArgs {
  readonly subjects: SearchSubjectSlug[];
  readonly keyStages: KeyStage[];
  readonly indexes: SearchIndexKind[];
  readonly dryRun: boolean;
  readonly verbose: boolean;
  readonly help: boolean;
  readonly clearCache: boolean;
  readonly all: boolean;
  readonly bypassCache: boolean;
  readonly incremental: boolean;
  readonly ignoreCached404: boolean;
  readonly bulk: boolean;
  readonly bulkDir: string | undefined;
  readonly maxRetries: number | undefined;
  readonly retryDelay: number | undefined;
  readonly noRetry: boolean;
}

/** Commander parsed options interface. */
interface ParsedOptions {
  readonly subject: SearchSubjectSlug[];
  readonly all?: boolean;
  readonly bulk?: boolean;
  readonly bulkDir?: string;
  readonly keyStage: KeyStage[];
  readonly index: SearchIndexKind[];
  readonly dryRun?: boolean;
  readonly incremental?: boolean;
  readonly clearCache?: boolean;
  readonly bypassCache?: boolean;
  readonly ignoreCached404?: boolean;
  readonly verbose?: boolean;
  readonly maxRetries?: number;
  readonly retryDelay?: number;
  readonly retry: boolean;
}

/**
 * Build default CliArgs for help mode.
 */
function buildHelpArgs(): CliArgs {
  return {
    subjects: [],
    keyStages: [...ALL_KEY_STAGES],
    indexes: [],
    dryRun: false,
    verbose: false,
    help: true,
    clearCache: false,
    all: false,
    bypassCache: false,
    incremental: false,
    ignoreCached404: false,
    bulk: false,
    bulkDir: undefined,
    maxRetries: undefined,
    retryDelay: undefined,
    noRetry: false,
  };
}

/**
 * Resolve key stages from options.
 */
function resolveKeyStages(keyStageOpts: readonly KeyStage[]): KeyStage[] {
  return keyStageOpts.length > 0 ? [...keyStageOpts] : [...ALL_KEY_STAGES];
}

/**
 * Extract boolean flag with default false.
 */
function boolFlag(value: boolean | undefined): boolean {
  return value ?? false;
}

/**
 * Build CliArgs from parsed options.
 */
function buildCliArgs(opts: ParsedOptions): CliArgs {
  const bulkMode = boolFlag(opts.bulk);
  const allFlag = boolFlag(opts.all);

  validateBulkMode(bulkMode, opts.bulkDir);

  return {
    subjects: resolveSubjects(opts.subject, allFlag, bulkMode),
    keyStages: resolveKeyStages(opts.keyStage),
    indexes: opts.index,
    dryRun: boolFlag(opts.dryRun),
    verbose: boolFlag(opts.verbose),
    help: false,
    clearCache: boolFlag(opts.clearCache),
    all: allFlag,
    bypassCache: boolFlag(opts.bypassCache),
    incremental: boolFlag(opts.incremental),
    ignoreCached404: boolFlag(opts.ignoreCached404),
    bulk: bulkMode,
    bulkDir: opts.bulkDir,
    maxRetries: opts.maxRetries,
    retryDelay: opts.retryDelay,
    noRetry: !opts.retry,
  };
}

/**
 * Parse CLI arguments into structured CliArgs.
 *
 * @param args - Command line arguments (process.argv.slice(2))
 * @returns Parsed and validated CLI arguments
 */
export function parseArgs(args: readonly string[]): CliArgs {
  // Check for help flag explicitly before parsing
  if (args.includes('--help') || args.includes('-h')) {
    const program = createProgram();
    program.parse([...args], { from: 'user' });
    return buildHelpArgs();
  }

  const program = createProgram();
  program.parse([...args], { from: 'user' });

  const opts = program.opts<ParsedOptions>();
  return buildCliArgs(opts);
}

/**
 * Print help text (delegates to commander).
 */
export function printHelp(): void {
  const program = createProgram();
  program.outputHelp();
}
