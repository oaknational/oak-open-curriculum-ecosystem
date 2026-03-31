#!/usr/bin/env tsx
/**
 * CLI entry point for the vocabulary mining pipeline.
 *
 * @remarks
 * This script is invoked via `pnpm vocab-gen` from the SDK package or repo root.
 *
 * @example
 * ```bash
 * # Run with defaults
 * pnpm vocab-gen
 *
 * # Dry run (preview mode)
 * pnpm vocab-gen --dry-run
 *
 * # Verbose output
 * pnpm vocab-gen --verbose
 * ```
 */
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { createPipelineConfig, formatPipelineResult, runPipeline } from './vocab-gen.js';
import {
  logLevelToSeverityNumber,
  parseLogLevel,
  buildResourceAttributes,
  normalizeError,
} from '@oaknational/logger';
import { getActiveSpanContextSnapshot } from '@oaknational/observability';
import { UnifiedLogger, createNodeStdoutSink } from '@oaknational/logger/node';
import type { Logger } from '@oaknational/logger';

const level = parseLogLevel(process.env['LOG_LEVEL'], 'INFO');
const logger: Logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber(level),
  resourceAttributes: buildResourceAttributes({}, 'sdk-codegen', '0.0.0'),
  context: { tool: 'vocab-gen' },
  sinks: [createNodeStdoutSink()],
  getActiveSpanContext: getActiveSpanContextSnapshot,
});

/**
 * Get the directory name in ES modules context.
 */
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Default bulk download data path relative to repo root.
 *
 * Points to the CLI's bulk downloads directory, which is the canonical
 * location for Oak bulk download data in this repository. The vocab-gen
 * pipeline must process ALL sequence files present in this directory.
 */
const DEFAULT_BULK_DATA_PATH = 'apps/oak-search-cli/bulk-downloads';

/**
 * Default output path relative to SDK root.
 */
const DEFAULT_OUTPUT_PATH = 'src/generated/vocab';

/**
 * Resolves path relative to repo root.
 * vocab-gen is at packages/sdks/oak-sdk-codegen/vocab-gen/
 */
function fromRepoRoot(relativePath: string): string {
  return join(__dirname, '..', '..', '..', '..', relativePath);
}

/**
 * Resolves path relative to SDK root.
 * vocab-gen is at packages/sdks/oak-sdk-codegen/vocab-gen/
 */
function fromSdkRoot(relativePath: string): string {
  return join(__dirname, '..', relativePath);
}

/**
 * CLI arguments.
 */
interface CliArgs {
  readonly dryRun: boolean;
  readonly verbose: boolean;
}

/**
 * Parses CLI arguments.
 */
function parseArgs(args: readonly string[]): CliArgs {
  return {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose') || args.includes('-v'),
  };
}

/**
 * Prints the header banner.
 */
function printHeader(args: CliArgs): void {
  logger.info('Oak Vocabulary Mining Pipeline', { dryRun: args.dryRun });
}

/**
 * Prints verbose configuration info.
 */
function printVerboseConfig(bulkDataPath: string, outputPath: string): void {
  logger.info('Configuration:', { bulkDataPath, outputPath });
}

/**
 * Main entry point.
 */
async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  printHeader(args);

  const config = createPipelineConfig({
    bulkDataPath: fromRepoRoot(DEFAULT_BULK_DATA_PATH),
    outputPath: fromSdkRoot(DEFAULT_OUTPUT_PATH),
    dryRun: args.dryRun,
    verbose: args.verbose,
  });

  if (args.verbose) {
    printVerboseConfig(config.bulkDataPath, config.outputPath);
  }

  logger.info('Processing bulk download files...');

  const result = await runPipeline(config);
  logger.info(formatPipelineResult(result));

  if (!result.success) {
    logger.error(`Pipeline failed: ${result.error ?? 'unknown'}`);
    process.exit(1);
  }

  logger.info('Pipeline completed successfully.');
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  logger.error(`Fatal error: ${message}`, normalizeError(err));
  process.exit(1);
});
