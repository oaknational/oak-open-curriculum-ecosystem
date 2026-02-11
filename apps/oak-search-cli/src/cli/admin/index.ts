/**
 * Admin subcommand group — Elasticsearch management operations.
 *
 * Provides commands for ES setup, ingestion, index management,
 * synonym updates, bulk data download, and diagnostics.
 *
 * SDK-mapped operations call the SDK admin service directly.
 * Complex orchestration operations delegate to existing implementation
 * files, which are invoked as child processes for isolation.
 *
 * @example
 * ```bash
 * oaksearch admin setup
 * oaksearch admin setup --reset
 * oaksearch admin status
 * oaksearch admin synonyms
 * oaksearch admin meta get
 * oaksearch admin ingest --bulk --subject maths
 * ```
 */

import { Command } from 'commander';
import { isIndexMetaDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
import {
  createCliSdk,
  printJson,
  printError,
  printSuccess,
  printHeader,
  registerPassThrough,
  registerBashPassThrough,
} from '../shared/index.js';
import { env } from '../../lib/env.js';
import {
  handleSetup,
  handleReset,
  handleStatus,
  handleSynonyms,
  handleGetMeta,
  handleSetMeta,
} from './handlers.js';

/** Register the `admin setup` subcommand (SDK-mapped). */
function registerSetupCmd(parent: Command): void {
  parent
    .command('setup')
    .description('Create synonyms and all search indexes (idempotent)')
    .option('--reset', 'Delete and recreate all indexes (destructive)')
    .option('-v, --verbose', 'Enable verbose output')
    .action(async (opts: { reset?: boolean; verbose?: boolean }) => {
      try {
        const sdk = createCliSdk(env());
        const options = opts.verbose ? { verbose: true } : undefined;

        if (opts.reset) {
          const result = await handleReset(sdk.admin, options);
          printSuccess(
            `Reset complete. ${result.synonymCount} synonyms, ${result.indexResults.length} indexes.`,
          );
          printJson(result);
        } else {
          const result = await handleSetup(sdk.admin, options);
          printSuccess(
            `Setup complete. ${result.synonymCount} synonyms, ${result.indexResults.length} indexes.`,
          );
          printJson(result);
        }
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/** Register the `admin status` subcommand (SDK-mapped). */
function registerStatusCmd(parent: Command): void {
  parent
    .command('status')
    .description('Show Elasticsearch connection status and index listing')
    .action(async () => {
      try {
        const sdk = createCliSdk(env());
        const result = await handleStatus(sdk.admin);
        printHeader('Connection');
        printJson(result.connection);
        printHeader('Indexes');
        printJson(result.indexes);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/** Register the `admin synonyms` subcommand (SDK-mapped). */
function registerSynonymsCmd(parent: Command): void {
  parent
    .command('synonyms')
    .description('Update the synonym set in Elasticsearch')
    .action(async () => {
      try {
        const sdk = createCliSdk(env());
        const result = await handleSynonyms(sdk.admin);
        printSuccess(`Synonyms updated: ${result.count} synonyms.`);
        printJson(result);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/** Register the `admin meta` subcommand group (SDK-mapped). */
function registerMetaCmd(parent: Command): void {
  const metaCmd = parent.command('meta').description('Read or write index metadata');

  metaCmd
    .command('get')
    .description('Read current index metadata from Elasticsearch')
    .action(async () => {
      try {
        const sdk = createCliSdk(env());
        const result = await handleGetMeta(sdk.admin);
        printJson(result);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });

  metaCmd
    .command('set')
    .description('Write index metadata to Elasticsearch')
    .argument('<json>', 'JSON string of metadata to write')
    .action(async (json: string) => {
      try {
        const sdk = createCliSdk(env());
        const parsed: unknown = JSON.parse(json);
        if (!isIndexMetaDoc(parsed)) {
          throw new Error('Invalid metadata JSON: does not match IndexMetaDoc schema.');
        }
        const result = await handleSetMeta(sdk.admin, parsed);
        printJson(result);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/** Register pass-through commands for orchestration scripts. */
function registerOrchestrationCmds(parent: Command): void {
  registerPassThrough(
    parent,
    'ingest',
    'Ingest curriculum data into Elasticsearch',
    'src/lib/elasticsearch/setup/ingest-live.ts',
  );
  registerPassThrough(
    parent,
    'verify',
    'Verify ingestion completeness',
    'operations/ingestion/verify-ingestion.ts',
  );
  registerPassThrough(
    parent,
    'download',
    'Download Oak curriculum bulk data',
    'scripts/download-bulk.ts',
  );
  registerPassThrough(
    parent,
    'sandbox-ingest',
    'Ingest fixture data into sandbox index',
    'operations/sandbox/ingest.ts',
  );
  registerPassThrough(
    parent,
    'cache-reset',
    'Reset TTLs for SDK cache keys in Redis',
    'operations/utilities/reset-ttls.ts',
  );
  registerPassThrough(
    parent,
    'diagnose-elser',
    'Run ELSER ingestion failure diagnostics',
    'scripts/diagnose-elser-failures.ts',
  );
  registerPassThrough(
    parent,
    'analyze-elser',
    'Analyse ELSER diagnostic reports',
    'scripts/analyze-elser-failures.ts',
  );
  registerBashPassThrough(
    parent,
    'alias-swap',
    'Swap Elasticsearch index alias',
    'operations/infrastructure/alias-swap.sh',
  );
}

/**
 * Create the `admin` subcommand group.
 *
 * @returns A Commander `Command` with admin subcommands registered
 */
export function adminCommand(): Command {
  const cmd = new Command('admin').description(
    'Elasticsearch setup, ingestion, and index management',
  );

  registerSetupCmd(cmd);
  registerStatusCmd(cmd);
  registerSynonymsCmd(cmd);
  registerMetaCmd(cmd);
  registerOrchestrationCmds(cmd);

  return cmd;
}
