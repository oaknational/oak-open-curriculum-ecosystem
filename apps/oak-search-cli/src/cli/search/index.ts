/**
 * Search subcommand group — retrieval operations.
 *
 * Provides commands for querying lessons, units, sequences, threads,
 * type-ahead suggestions, and sequence facets via the Search SDK.
 *
 * @example
 * ```bash
 * oaksearch search lessons "expanding brackets" --subject maths --key-stage ks3
 * oaksearch search units "fractions" --size 5
 * oaksearch search suggest "frac" --scope lessons
 * oaksearch search facets --subject maths
 * ```
 */

import { Command } from 'commander';
import {
  createCliSdk,
  type CliSdkEnv,
  printJson,
  printError,
  validateSubject,
  validateKeyStage,
  validateScope,
} from '../shared/index.js';
import {
  handleSearchLessons,
  handleSearchUnits,
  handleSearchSequences,
  handleSuggest,
  handleFetchFacets,
} from './handlers.js';
import { registerThreadsCmd } from './register-threads-cmd.js';

/**
 * Common CLI option shape for commands with subject, key stage, and size.
 *
 * Used by lessons, units, and suggest commands.
 */
interface SubjectKeyStageOpts {
  readonly subject?: string;
  readonly keyStage?: string;
  readonly size: string;
}

/**
 * Register the `search lessons` subcommand.
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
function registerLessonsCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('lessons')
    .description('Search lessons using hybrid BM25 + ELSER retrieval')
    .argument('<query>', 'Search query text')
    .option('-s, --subject <subject>', 'Filter by subject slug')
    .option('-k, --key-stage <keyStage>', 'Filter by key stage (ks1-ks4)')
    .option('--size <n>', 'Maximum results to return', '25')
    .action(async (query: string, opts: SubjectKeyStageOpts) => {
      try {
        const sdk = createCliSdk(cliEnv);
        const result = await handleSearchLessons(sdk.retrieval, {
          query,
          subject: validateSubject(opts.subject),
          keyStage: validateKeyStage(opts.keyStage),
          size: parseInt(opts.size, 10),
        });
        if (!result.ok) {
          printError(`${result.error.type}: ${result.error.message}`);
          process.exitCode = 1;
          return;
        }
        printJson(result.value);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/**
 * Register the `search units` subcommand.
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
function registerUnitsCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('units')
    .description('Search units using hybrid BM25 + ELSER retrieval')
    .argument('<query>', 'Search query text')
    .option('-s, --subject <subject>', 'Filter by subject slug')
    .option('-k, --key-stage <keyStage>', 'Filter by key stage (ks1-ks4)')
    .option('--size <n>', 'Maximum results to return', '25')
    .action(async (query: string, opts: SubjectKeyStageOpts) => {
      try {
        const sdk = createCliSdk(cliEnv);
        const result = await handleSearchUnits(sdk.retrieval, {
          query,
          subject: validateSubject(opts.subject),
          keyStage: validateKeyStage(opts.keyStage),
          size: parseInt(opts.size, 10),
        });
        if (!result.ok) {
          printError(`${result.error.type}: ${result.error.message}`);
          process.exitCode = 1;
          return;
        }
        printJson(result.value);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/**
 * Register the `search sequences` subcommand.
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
function registerSequencesCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('sequences')
    .description('Search sequences (subject-phase programmes)')
    .argument('<query>', 'Search query text')
    .option('-s, --subject <subject>', 'Filter by subject slug')
    .option('--size <n>', 'Maximum results to return', '25')
    .action(async (query: string, opts: { subject?: string; size: string }) => {
      try {
        const sdk = createCliSdk(cliEnv);
        const result = await handleSearchSequences(sdk.retrieval, {
          query,
          subject: validateSubject(opts.subject),
          size: parseInt(opts.size, 10),
        });
        if (!result.ok) {
          printError(`${result.error.type}: ${result.error.message}`);
          process.exitCode = 1;
          return;
        }
        printJson(result.value);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/**
 * Register the `search suggest` subcommand.
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
function registerSuggestCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('suggest')
    .description('Get type-ahead suggestions')
    .argument('<prefix>', 'Prefix text to suggest from')
    .option('--scope <scope>', 'Search scope (lessons, units, sequences)', 'lessons')
    .option('-s, --subject <subject>', 'Filter by subject slug')
    .option('-k, --key-stage <keyStage>', 'Filter by key stage')
    .action(
      async (prefix: string, opts: { scope: string; subject?: string; keyStage?: string }) => {
        try {
          const sdk = createCliSdk(cliEnv);
          const result = await handleSuggest(sdk.retrieval, {
            prefix,
            scope: validateScope(opts.scope),
            subject: validateSubject(opts.subject),
            keyStage: validateKeyStage(opts.keyStage),
          });
          if (!result.ok) {
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          printJson(result.value);
        } catch (error) {
          printError(error instanceof Error ? error.message : String(error));
          process.exitCode = 1;
        }
      },
    );
}

/**
 * Register the `search facets` subcommand.
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
function registerFacetsCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('facets')
    .description('Fetch sequence facets for navigation')
    .option('-s, --subject <subject>', 'Filter by subject slug')
    .option('-k, --key-stage <keyStage>', 'Filter by key stage')
    .action(async (opts: { subject?: string; keyStage?: string }) => {
      try {
        const sdk = createCliSdk(cliEnv);
        const result = await handleFetchFacets(sdk.retrieval, {
          subject: validateSubject(opts.subject),
          keyStage: validateKeyStage(opts.keyStage),
        });
        if (!result.ok) {
          printError(`${result.error.type}: ${result.error.message}`);
          process.exitCode = 1;
          return;
        }
        printJson(result.value);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/**
 * Create the `search` subcommand group.
 *
 * @returns A Commander `Command` with search subcommands registered
 *
 * @example
 * ```typescript
 * const program = new Command();
 * program.addCommand(searchCommand());
 * ```
 */
export function searchCommand(cliEnv: CliSdkEnv): Command {
  const cmd = new Command('search').description(
    'Query lessons, units, sequences, threads, and suggestions',
  );

  registerLessonsCmd(cmd, cliEnv);
  registerUnitsCmd(cmd, cliEnv);
  registerSequencesCmd(cmd, cliEnv);
  registerThreadsCmd(cmd, cliEnv);
  registerSuggestCmd(cmd, cliEnv);
  registerFacetsCmd(cmd, cliEnv);

  return cmd;
}
