/**
 * Portability validation result reporting.
 *
 * Provides the function that formats and writes the collected portability
 * issues (or the success summary) to the terminal.  Separated from the
 * orchestration entry point so that the report function can be tested and
 * reused without re-running the full filesystem checks.
 */

import { writeErrorLine, writeLine } from '../../core/terminal-output.js';

/**
 * Reports the results of portability validation to stdout/stderr and returns
 * the process exit code.
 *
 * On success, writes a one-line summary to stdout.
 * On failure, writes a header and one line per issue to stderr.
 *
 * @param stats            - A human-readable summary of the counts checked
 *   (skills, rules, adapters, triggers).
 * @param writtenWrappers  - Paths written during a `--fix` run.  When
 *   non-empty, a fix summary is printed before the issue list.
 * @param validationIssues - The collected issue strings.  An empty array
 *   means validation passed.
 * @returns `0` when validation passed, `1` when at least one issue was found.
 */
export function reportPortabilityValidation(
  stats: string,
  writtenWrappers: readonly string[],
  validationIssues: readonly string[],
): number {
  if (writtenWrappers.length > 0) {
    writeLine(`Portability --fix wrote ${writtenWrappers.length} wrapper file(s):`);
    for (const writtenPath of writtenWrappers) {
      writeLine(`  + ${writtenPath}`);
    }
  }
  if (validationIssues.length > 0) {
    writeErrorLine(
      `Portability validation failed (${validationIssues.length} issue${validationIssues.length === 1 ? '' : 's'}):`,
    );
    for (const issue of validationIssues) {
      writeErrorLine(`  - ${issue}`);
    }
    return 1;
  }
  writeLine(`Portability validation passed: ${stats}.`);
  return 0;
}
