#!/usr/bin/env npx tsx
/**
 * Elasticsearch setup CLI.
 *
 * Creates synonyms set and all search indexes from SDK ontology data.
 * Loads configuration from .env.local in the app directory.
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAppEnv } from './load-app-env.js';
import { ingestLogger, setLogLevel } from '../../logger';
import { printHelp, printSetupSummary } from './cli-output.js';
import { executeStatusCommand, executeSetupOrResetCommand } from './cli-commands.js';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

interface CliArgs {
  readonly command: 'setup' | 'reset' | 'status' | 'help';
  readonly verbose: boolean;
}

/** Checks if any of the specified flags are present in args. */
function hasFlag(args: readonly string[], ...flags: readonly string[]): boolean {
  return flags.some((flag) => args.includes(flag));
}

/**
 * Parses command line arguments.
 *
 * Supports both positional commands and flags:
 * - `pnpm es:setup reset` (positional)
 * - `pnpm es:setup --reset` (flag)
 *
 * @param args - Command line arguments
 * @returns Parsed CLI arguments
 */
function parseArgs(args: readonly string[]): CliArgs {
  const verbose = hasFlag(args, '--verbose', '-v');
  const commandArg = args.find((a) => !a.startsWith('-'));

  if (commandArg === 'status') {
    return { command: 'status', verbose };
  }
  if (commandArg === 'reset' || hasFlag(args, '--reset', '-r')) {
    return { command: 'reset', verbose };
  }
  if (commandArg === 'help' || hasFlag(args, '--help', '-h')) {
    return { command: 'help', verbose };
  }
  return { command: 'setup', verbose };
}

/**
 * Main CLI entry point.
 */
async function main(): Promise<void> {
  // Load environment from app directory
  const envResult = loadAppEnv(CURRENT_DIR);

  const args = parseArgs(process.argv.slice(2));

  // Set log level based on verbose flag
  if (args.verbose) {
    setLogLevel('DEBUG');
  }

  if (envResult.loaded) {
    ingestLogger.debug('Environment loaded', { path: envResult.path });
  } else {
    ingestLogger.debug('No .env.local found', { appRoot: envResult.appRoot });
  }

  // Handle commands
  if (args.command === 'help') {
    printHelp();
    return;
  }

  if (args.command === 'status') {
    const exitCode = await executeStatusCommand(args.verbose);
    process.exitCode = exitCode;
    return;
  }

  // Setup or reset command
  const result = await executeSetupOrResetCommand(args.command);

  if (!result) {
    process.exitCode = 1;
    return;
  }

  const exitCode = printSetupSummary(result);
  process.exitCode = exitCode;
}

main().catch((error: unknown) => {
  ingestLogger.error('Fatal error', error instanceof Error ? error : undefined, {
    message: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
