/**
 * Commander program configuration for ingestion CLI.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import {
  ALL_KEY_STAGES,
  ALL_SUBJECTS,
  collectSubject,
  collectKeyStage,
  collectIndex,
  validatePositiveInt,
} from './ingest-cli-validators.js';

/** Default bulk download directory (relative to search CLI workspace root). */
export const DEFAULT_BULK_DIR = './bulk-downloads';

/**
 * Add data source options to program.
 *
 * @remarks
 * Default mode is bulk (reads from local bulk-download files).
 * Use `--api` to switch to live API fetching.
 */
function addDataSourceOptions(program: Command): void {
  program
    .option('--api', 'Use live API instead of bulk download files')
    .option(
      '--bulk-dir <path>',
      `Directory containing bulk JSON files (default: ${DEFAULT_BULK_DIR})`,
    );
}

/**
 * Add subject selection options to program.
 *
 * @remarks
 * Subject/--all flags are only required in API mode.
 * In bulk mode (default), all subjects are read from the bulk files.
 */
function addSubjectOptions(program: Command): void {
  program
    .option(
      '--subject <slug>',
      'Subject to ingest — API mode only (repeatable)',
      collectSubject,
      [],
    )
    .option('--all', 'Ingest all subjects — API mode only');
}

/**
 * Add filtering options to program.
 */
function addFilterOptions(program: Command): void {
  program
    .option('--key-stage <ks>', 'Key stage filter (repeatable)', collectKeyStage, [])
    .option('--index <kind>', 'Limit to specific index kinds (repeatable)', collectIndex, []);
}

/**
 * Add general options to program.
 */
function addGeneralOptions(program: Command): void {
  program
    .option('--dry-run', 'Preview without writing to ES')
    .option('-i, --incremental', 'Skip existing documents (default: overwrite)')
    .option('--clear-cache', 'Clear SDK response cache before ingestion')
    .option('--bypass-cache', 'Continue without Redis cache')
    .option('--ignore-cached-404', 'Ignore cached 404 responses')
    .option('-v, --verbose', 'Show detailed output');
}

/**
 * Add retry options to program.
 */
function addRetryOptions(program: Command): void {
  program
    .option('--max-retries <n>', 'Max retry attempts', (v) => validatePositiveInt(v, 'max-retries'))
    .option('--retry-delay <ms>', 'Base retry delay in ms', (v) =>
      validatePositiveInt(v, 'retry-delay'),
    )
    .option('--no-retry', 'Disable document-level retry');
}

/**
 * Create and configure the commander program.
 */
export function createProgram(): Command {
  const program = new Command();

  program
    .name('ingest')
    .description('Ingest Oak Curriculum data into Elasticsearch')
    .version('1.0.0')
    .allowExcessArguments(false)
    .allowUnknownOption(false)
    .configureOutput({
      writeErr: (str) => {
        console.error(chalk.red(str));
      },
    })
    .showHelpAfterError(true)
    .addHelpText(
      'after',
      `
${chalk.yellow('Data Source (default: bulk)')}
  Reads from local bulk-download files by default (${DEFAULT_BULK_DIR}).
  Run 'pnpm bulk:download' first to fetch the bulk data.
  Use --api to switch to live API fetching (slower, rate-limited).

${chalk.yellow('Retry Configuration:')}
  --max-retries <n>     Max retry attempts for failed document operations
  --retry-delay <ms>    Base delay for exponential backoff
  --no-retry            Disable document-level retry

${chalk.yellow('Available Subjects:')} ${ALL_SUBJECTS.join(', ')}
${chalk.yellow('Available Key Stages:')} ${ALL_KEY_STAGES.join(', ')}

${chalk.yellow('Examples:')}
  $ ingest --index threads                            # Reindex threads only (bulk)
  $ ingest                                            # Full ingestion (bulk)
  $ ingest --api --subject history --key-stage ks2    # Single subject (API)
  $ ingest --api --all                                # Full ingestion (API)
  $ ingest --api --all --incremental                  # Resume failed run (API)
`,
    );

  addDataSourceOptions(program);
  addSubjectOptions(program);
  addFilterOptions(program);
  addGeneralOptions(program);
  addRetryOptions(program);

  return program;
}
