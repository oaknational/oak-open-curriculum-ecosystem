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
import { env } from '../../env.js';
import { ingestLogger, setLogLevel } from '../../logger';
import { printHelp, printSetupSummary } from './cli-output.js';
import {
  executeStatusCommand,
  executeSetupOrResetCommand,
  executeSynonymsCommand,
} from './cli-commands.js';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

interface CliArgs {
  readonly command: 'setup' | 'reset' | 'status' | 'synonyms' | 'help';
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
  if (commandArg === 'synonyms' || hasFlag(args, '--synonyms', '-s')) {
    return { command: 'synonyms', verbose };
  }
  if (commandArg === 'help' || hasFlag(args, '--help', '-h')) {
    return { command: 'help', verbose };
  }
  return { command: 'setup', verbose };
}

/** Configure logging and log environment status. */
function initializeEnvironment(
  envResult: { loaded: boolean; path?: string; appRoot?: string },
  verbose: boolean,
): void {
  if (verbose) {
    setLogLevel('DEBUG');
  }
  if (envResult.loaded) {
    ingestLogger.debug('Environment loaded', { path: envResult.path });
  } else {
    ingestLogger.debug('No .env.local found', { appRoot: envResult.appRoot });
  }
}

/** Execute the appropriate command and return exit code. */
async function executeCommand(args: CliArgs): Promise<number> {
  if (args.command === 'help') {
    printHelp();
    return 0;
  }

  const config = env();
  const credentials = {
    ELASTICSEARCH_URL: config.ELASTICSEARCH_URL,
    ELASTICSEARCH_API_KEY: config.ELASTICSEARCH_API_KEY,
  };

  if (args.command === 'status') {
    return executeStatusCommand(credentials, args.verbose);
  }
  if (args.command === 'synonyms') {
    return executeSynonymsCommand(credentials);
  }
  // Setup or reset command
  const result = await executeSetupOrResetCommand(credentials, args.command);
  if (!result) {
    return 1;
  }
  return printSetupSummary(result);
}

/**
 * Main CLI entry point.
 */
async function main(): Promise<void> {
  const envResult = loadAppEnv(CURRENT_DIR);
  const args = parseArgs(process.argv.slice(2));
  initializeEnvironment(envResult, args.verbose);
  process.exitCode = await executeCommand(args);
}

main().catch((error: unknown) => {
  ingestLogger.error('Fatal error', error instanceof Error ? error : undefined, {
    message: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
