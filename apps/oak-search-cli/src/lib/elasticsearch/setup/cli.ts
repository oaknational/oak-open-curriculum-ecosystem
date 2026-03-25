#!/usr/bin/env -S pnpm exec tsx
/**
 * Elasticsearch setup CLI.
 *
 * Creates synonyms set and all search indexes from SDK ontology data.
 * Loads configuration from .env.local in the app directory.
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRuntimeConfig } from '../../../runtime-config.js';
import { initializeEsClient } from '../../es-client.js';
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

/** Configure logging level. */
function initializeLogging(verbose: boolean): void {
  if (verbose) {
    setLogLevel('DEBUG');
  }
}

/** Execute the appropriate command and return exit code. */
async function executeCommand(
  args: CliArgs,
  config: { ELASTICSEARCH_URL: string; ELASTICSEARCH_API_KEY: string },
): Promise<number> {
  if (args.command === 'help') {
    printHelp();
    return 0;
  }
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
  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: CURRENT_DIR,
  });
  if (!configResult.ok) {
    process.stderr.write(`Environment validation failed: ${configResult.error.message}\n`);
    process.exit(1);
  }
  const config = configResult.value.env;
  initializeEsClient(config);
  const args = parseArgs(process.argv.slice(2));
  initializeLogging(args.verbose);
  process.exitCode = await executeCommand(args, config);
}

main().catch((error: unknown) => {
  const fatalError = error instanceof Error ? error : new Error(String(error), { cause: error });
  ingestLogger.error('Fatal error', fatalError);
  process.exitCode = 1;
});
