/**
 * Commander program configuration for ingestion CLI.
 *
 * @module ingest-cli-program
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

/**
 * Add subject selection options to program.
 */
function addSubjectOptions(program: Command): void {
  program
    .option('--subject <slug>', 'Subject to ingest (repeatable)', collectSubject, [])
    .option('--all', 'Ingest all subjects');
}

/**
 * Add bulk mode options to program.
 */
function addBulkOptions(program: Command): void {
  program
    .option('--bulk', 'Use bulk download files instead of API')
    .option('--bulk-dir <path>', 'Directory containing bulk JSON files');
}

/**
 * Add filtering options to program.
 */
function addFilterOptions(program: Command): void {
  program
    .option('--key-stage <ks>', 'Key stage filter (repeatable)', collectKeyStage, [])
    .option('--index <kind>', 'Index to ingest (repeatable)', collectIndex, []);
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
    .name('ingest-live')
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
${chalk.yellow('Retry Configuration:')}
  --max-retries <n>     Max retry attempts for failed document operations
  --retry-delay <ms>    Base delay for exponential backoff
  --no-retry            Disable document-level retry

${chalk.yellow('Available Subjects:')} ${ALL_SUBJECTS.join(', ')}
${chalk.yellow('Available Key Stages:')} ${ALL_KEY_STAGES.join(', ')}

${chalk.yellow('Examples:')}
  $ ingest-live --subject history --key-stage ks2   # Single subject
  $ ingest-live --all                               # Full ingestion
  $ ingest-live --all --incremental                 # Resume failed run
  $ ingest-live --bulk --bulk-dir ./bulk-downloads  # Bulk mode
`,
    );

  addSubjectOptions(program);
  addBulkOptions(program);
  addFilterOptions(program);
  addGeneralOptions(program);
  addRetryOptions(program);

  return program;
}
