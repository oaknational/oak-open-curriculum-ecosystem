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
const DEFAULT_OUTPUT_PATH = 'src/mcp';

/**
 * Resolves path relative to repo root.
 * vocab-gen is at packages/sdks/oak-curriculum-sdk/vocab-gen/
 */
function fromRepoRoot(relativePath: string): string {
  return join(__dirname, '..', '..', '..', '..', relativePath);
}

/**
 * Resolves path relative to SDK root.
 * vocab-gen is at packages/sdks/oak-curriculum-sdk/vocab-gen/
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
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(' Oak Vocabulary Mining Pipeline');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  if (args.dryRun) {
    console.log('Mode: DRY RUN (no files will be written)');
    console.log('');
  }
}

/**
 * Prints verbose configuration info.
 */
function printVerboseConfig(bulkDataPath: string, outputPath: string): void {
  console.log('Configuration:');
  console.log(`  Bulk data: ${bulkDataPath}`);
  console.log(`  Output:    ${outputPath}`);
  console.log('');
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

  console.log('Processing bulk download files...\n');

  const result = await runPipeline(config);
  console.log(formatPipelineResult(result));

  if (!result.success) {
    console.error('Pipeline failed:', result.error);
    process.exit(1);
  }

  console.log('\nPipeline completed successfully.');
}

main().catch((err: unknown) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
