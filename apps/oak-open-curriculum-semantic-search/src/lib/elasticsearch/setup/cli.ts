#!/usr/bin/env npx tsx
/**
 * @module cli
 * @description Elasticsearch setup CLI.
 *
 * Creates synonyms set and all search indexes from SDK ontology data.
 * Loads configuration from .env.local in the app directory.
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAppEnv } from './load-app-env.js';
import { sandboxLogger, setLogLevel } from '../../logger';
import { printHelp, printSetupSummary } from './cli-output.js';
import { executeStatusCommand, executeSetupOrResetCommand } from './cli-commands.js';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

interface CliArgs {
  readonly command: 'setup' | 'reset' | 'status' | 'help';
  readonly verbose: boolean;
}

/**
 * Parses command line arguments.
 *
 * @param args - Command line arguments
 * @returns Parsed CLI arguments
 */
function parseArgs(args: readonly string[]): CliArgs {
  const verbose = args.includes('--verbose') || args.includes('-v');
  const commandArg = args.find((a) => !a.startsWith('-'));

  if (commandArg === 'status') {
    return { command: 'status', verbose };
  }
  if (commandArg === 'reset') {
    return { command: 'reset', verbose };
  }
  if (commandArg === 'help' || args.includes('--help') || args.includes('-h')) {
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
    sandboxLogger.debug('Environment loaded', { path: envResult.path });
  } else {
    sandboxLogger.debug('No .env.local found', { appRoot: envResult.appRoot });
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
  sandboxLogger.error('Fatal error', error instanceof Error ? error : undefined, {
    message: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
