/**
 * Terminal output formatting helpers for CLI commands.
 *
 * Provides consistent, structured output across all CLI subcommands.
 * Supports both human-readable table output and JSON output for
 * programmatic consumption.
 */

import chalk from 'chalk';

/**
 * Print a success message to stdout.
 *
 * @param message - The success message to display
 * @returns void
 */
export function printSuccess(message: string): void {
  process.stdout.write(chalk.green(`✓ ${message}`) + '\n');
}

/**
 * Print an error message to stderr.
 *
 * @param message - The error message to display
 * @returns void
 */
export function printError(message: string): void {
  process.stderr.write(chalk.red(`✗ ${message}`) + '\n');
}

/**
 * Print an informational message to stdout.
 *
 * @param message - The info message to display
 * @returns void
 */
export function printInfo(message: string): void {
  process.stdout.write(chalk.blue(`ℹ ${message}`) + '\n');
}

/**
 * Print a warning message to stderr.
 *
 * @param message - The warning message to display
 * @returns void
 */
export function printWarning(message: string): void {
  process.stderr.write(chalk.yellow(`⚠ ${message}`) + '\n');
}

/**
 * Print data as formatted JSON to stdout.
 *
 * @param data - The data to serialise and print
 * @returns void
 */
export function printJson(data: unknown): void {
  process.stdout.write(JSON.stringify(data, null, 2) + '\n');
}

/**
 * Print a section header for grouping related output.
 *
 * @param title - The section title
 * @returns void
 */
export function printHeader(title: string): void {
  process.stdout.write(`\n${chalk.bold(title)}\n`);
  process.stdout.write(chalk.dim('─'.repeat(title.length)) + '\n');
}
