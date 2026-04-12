#!/usr/bin/env -S pnpm exec tsx
/**
 * CLI argument parsing for data ingestion using Commander.
 *
 * @remarks
 * Default mode is bulk (reads from local bulk-download files).
 * Use `--api` to switch to live API fetching.
 * Subject and key stage values are derived from the OpenAPI schema via the SDK.
 */

import { CommanderError } from 'commander';
import type { KeyStage, SearchSubjectSlug } from '../../../types/oak.js';
import type { SearchIndexKind } from '../../search-index-target.js';
import { createProgram } from './ingest-cli-program.js';
import { ALL_KEY_STAGES, resolveSubjects } from './ingest-cli-validators.js';

/** Parsed CLI arguments for ingestion. */
interface CliArgs {
  readonly subjects: SearchSubjectSlug[];
  readonly keyStages: KeyStage[];
  readonly indexes: SearchIndexKind[];
  readonly dryRun: boolean;
  readonly verbose: boolean;
  readonly help: boolean;
  readonly clearCache: boolean;
  readonly all: boolean;
  readonly bypassCache: boolean;
  readonly ignoreCached404: boolean;
  readonly api: boolean;
  readonly bulkDir: string | undefined;
  readonly maxRetries: number | undefined;
  readonly retryDelay: number | undefined;
  readonly noRetry: boolean;
}

/** Commander parsed options interface. */
interface ParsedOptions {
  readonly subject: SearchSubjectSlug[];
  readonly all?: boolean;
  readonly api?: boolean;
  readonly bulkDir?: string;
  readonly keyStage: KeyStage[];
  readonly index: SearchIndexKind[];
  readonly dryRun?: boolean;
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
    ignoreCached404: false,
    api: false,
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
  const apiMode = boolFlag(opts.api);
  const allFlag = boolFlag(opts.all);
  return {
    subjects: resolveSubjects(opts.subject, allFlag, apiMode),
    keyStages: resolveKeyStages(opts.keyStage),
    indexes: opts.index,
    dryRun: boolFlag(opts.dryRun),
    verbose: boolFlag(opts.verbose),
    help: false,
    clearCache: boolFlag(opts.clearCache),
    all: allFlag,
    bypassCache: boolFlag(opts.bypassCache),
    ignoreCached404: boolFlag(opts.ignoreCached404),
    api: apiMode,
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
  const program = createProgram();
  program.exitOverride();
  try {
    program.parse([...args], { from: 'user' });
  } catch (error) {
    if (error instanceof CommanderError && error.code === 'commander.helpDisplayed') {
      return buildHelpArgs();
    }
    throw error;
  }

  const opts = program.opts<ParsedOptions>();
  return buildCliArgs(opts);
}
