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
 */
export function printSuccess(message: string): void {
  console.log(chalk.green(`✓ ${message}`));
}

/**
 * Print an error message to stderr.
 *
 * @param message - The error message to display
 */
export function printError(message: string): void {
  console.error(chalk.red(`✗ ${message}`));
}

/**
 * Print an informational message to stdout.
 *
 * @param message - The info message to display
 */
export function printInfo(message: string): void {
  console.log(chalk.blue(`ℹ ${message}`));
}

/**
 * Print a warning message to stderr.
 *
 * @param message - The warning message to display
 */
export function printWarning(message: string): void {
  console.error(chalk.yellow(`⚠ ${message}`));
}

/**
 * Print data as formatted JSON to stdout.
 *
 * @param data - The data to serialise and print
 */
export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

/**
 * Print a section header for grouping related output.
 *
 * @param title - The section title
 */
export function printHeader(title: string): void {
  console.log(`\n${chalk.bold(title)}`);
  console.log(chalk.dim('─'.repeat(title.length)));
}
